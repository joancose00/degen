// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract CallPlatform {
    enum Chain {
        ethereum,
        sonic,
        solana,
        sui,
        bsc,
        polygon,
        avalanche,
        arbitrum,
        optimism,
        base,
        abstractChain
    }
    
    struct Call {
        address caller;
        string tokenAddress;
        Chain chain;
        uint256 timestamp;
        string tokenSymbol;
        uint256 maxGain;
    }
    
    mapping(uint256 => Call) public calls;
    mapping(address => uint256[]) public userCalls;
    
    uint256 public totalCalls;
    uint256[] public allCallIds;
    address public oracle;
    address public owner;
    
    event NewCall(
        uint256 indexed callId,
        address indexed caller,
        string tokenAddress,
        Chain chain,
        string tokenSymbol,
        uint256 timestamp
    );
    
    event OracleUpdated(address indexed previousOracle, address indexed newOracle);
    event MaxGainUpdated(uint256 indexed callId, uint256 newMaxGain);
    event BatchMaxGainUpdated(uint256[] callIds, uint256[] newMaxGains);
    
    modifier onlyOracle() {
        require(msg.sender == oracle, "Only oracle can call this function");
        _;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function setOracle(address _oracle) external onlyOwner {
        address previousOracle = oracle;
        oracle = _oracle;
        emit OracleUpdated(previousOracle, _oracle);
    }
    
    function makeCall(
        string memory _tokenAddress,
        Chain _chain,
        string memory _tokenSymbol
    ) external {
        uint256 callId = totalCalls;
        
        calls[callId] = Call({
            caller: msg.sender,
            tokenAddress: _tokenAddress,
            chain: _chain,
            timestamp: block.timestamp,
            tokenSymbol: _tokenSymbol,
            maxGain: 0
        });
        
        userCalls[msg.sender].push(callId);
        allCallIds.push(callId);
        totalCalls++;
        
        emit NewCall(
            callId,
            msg.sender,
            _tokenAddress,
            _chain,
            _tokenSymbol,
            block.timestamp
        );
    }
    
    function updateMaxGain(uint256 _callId, uint256 _maxGain) external onlyOracle {
        require(_callId < totalCalls, "Invalid call ID");
        calls[_callId].maxGain = _maxGain;
        emit MaxGainUpdated(_callId, _maxGain);
    }
    
    function batchUpdateMaxGain(uint256[] calldata _callIds, uint256[] calldata _maxGains) external onlyOracle {
        require(_callIds.length == _maxGains.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < _callIds.length; i++) {
            require(_callIds[i] < totalCalls, "Invalid call ID");
            calls[_callIds[i]].maxGain = _maxGains[i];
        }
        
        emit BatchMaxGainUpdated(_callIds, _maxGains);
    }
    
    function getCallsByUser(
        address _user, 
        uint256 _offset, 
        uint256 _limit,
        bool _newestFirst
    ) external view returns (Call[] memory, bool hasMore) {
        uint256[] memory userCallIds = userCalls[_user];
        uint256 totalUserCalls = userCallIds.length;
        
        if (_offset >= totalUserCalls) {
            return (new Call[](0), false);
        }
        
        uint256 endIndex = _offset + _limit;
        if (endIndex > totalUserCalls) {
            endIndex = totalUserCalls;
        }
        
        uint256 returnLength = endIndex - _offset;
        Call[] memory userCallList = new Call[](returnLength);
        
        if (_newestFirst) {
            for (uint256 i = 0; i < returnLength; i++) {
                userCallList[i] = calls[userCallIds[totalUserCalls - 1 - _offset - i]];
            }
        } else {
            for (uint256 i = 0; i < returnLength; i++) {
                userCallList[i] = calls[userCallIds[_offset + i]];
            }
        }
        
        return (userCallList, endIndex < totalUserCalls);
    }
    
    function getAllCalls(
        uint256 _offset, 
        uint256 _limit,
        bool _newestFirst
    ) external view returns (Call[] memory, bool hasMore) {
        if (_offset >= totalCalls) {
            return (new Call[](0), false);
        }
        
        uint256 endIndex = _offset + _limit;
        if (endIndex > totalCalls) {
            endIndex = totalCalls;
        }
        
        uint256 returnLength = endIndex - _offset;
        Call[] memory allCallsArray = new Call[](returnLength);
        
        if (_newestFirst) {
            for (uint256 i = 0; i < returnLength; i++) {
                allCallsArray[i] = calls[totalCalls - 1 - _offset - i];
            }
        } else {
            for (uint256 i = 0; i < returnLength; i++) {
                allCallsArray[i] = calls[_offset + i];
            }
        }
        
        return (allCallsArray, endIndex < totalCalls);
    }
    
    function getCallsByChain(
        Chain _chain, 
        uint256 _offset, 
        uint256 _limit,
        bool _newestFirst
    ) external view returns (Call[] memory, bool hasMore) {
        uint256 count = 0;
        uint256[] memory matchingIds = new uint256[](totalCalls);
        
        if (_newestFirst) {
            for (uint256 i = totalCalls; i > 0; i--) {
                if (calls[i - 1].chain == _chain) {
                    matchingIds[count] = i - 1;
                    count++;
                }
            }
        } else {
            for (uint256 i = 0; i < totalCalls; i++) {
                if (calls[i].chain == _chain) {
                    matchingIds[count] = i;
                    count++;
                }
            }
        }
        
        if (_offset >= count) {
            return (new Call[](0), false);
        }
        
        uint256 endIndex = _offset + _limit;
        if (endIndex > count) {
            endIndex = count;
        }
        
        uint256 returnLength = endIndex - _offset;
        Call[] memory chainCalls = new Call[](returnLength);
        
        for (uint256 i = 0; i < returnLength; i++) {
            chainCalls[i] = calls[matchingIds[_offset + i]];
        }
        
        return (chainCalls, endIndex < count);
    }
    
    function getCallsByToken(
        string memory _tokenAddress, 
        Chain _chain, 
        uint256 _offset, 
        uint256 _limit,
        bool _newestFirst
    ) external view returns (Call[] memory, bool hasMore) {
        uint256 count = 0;
        uint256[] memory matchingIds = new uint256[](totalCalls);
        
        if (_newestFirst) {
            for (uint256 i = totalCalls; i > 0; i--) {
                if (keccak256(bytes(calls[i - 1].tokenAddress)) == keccak256(bytes(_tokenAddress)) && calls[i - 1].chain == _chain) {
                    matchingIds[count] = i - 1;
                    count++;
                }
            }
        } else {
            for (uint256 i = 0; i < totalCalls; i++) {
                if (keccak256(bytes(calls[i].tokenAddress)) == keccak256(bytes(_tokenAddress)) && calls[i].chain == _chain) {
                    matchingIds[count] = i;
                    count++;
                }
            }
        }
        
        if (_offset >= count) {
            return (new Call[](0), false);
        }
        
        uint256 endIndex = _offset + _limit;
        if (endIndex > count) {
            endIndex = count;
        }
        
        uint256 returnLength = endIndex - _offset;
        Call[] memory tokenCalls = new Call[](returnLength);
        
        for (uint256 i = 0; i < returnLength; i++) {
            tokenCalls[i] = calls[matchingIds[_offset + i]];
        }
        
        return (tokenCalls, endIndex < count);
    }
    
    function getCallDetails(uint256 _callId) external view returns (Call memory) {
        require(_callId < totalCalls, "Invalid call ID");
        return calls[_callId];
    }
    
    function getUserCallCount(address _user) external view returns (uint256) {
        return userCalls[_user].length;
    }
    
    function getChainName(Chain _chain) public pure returns (string memory) {
        if (_chain == Chain.ethereum) return "ethereum";
        if (_chain == Chain.sonic) return "sonic";
        if (_chain == Chain.solana) return "solana";
        if (_chain == Chain.sui) return "sui";
        if (_chain == Chain.bsc) return "bsc";
        if (_chain == Chain.polygon) return "polygon";
        if (_chain == Chain.avalanche) return "avalanche";
        if (_chain == Chain.arbitrum) return "arbitrum";
        if (_chain == Chain.optimism) return "optimism";
        if (_chain == Chain.base) return "base";
        if (_chain == Chain.abstractChain) return "abstract";
        revert("Invalid chain");
    }
}
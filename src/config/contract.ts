export const CALL_PLATFORM_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x45893069bfAd401C833CD4906Eb4AA6f34183251'

export const CALL_PLATFORM_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256[]",
        "name": "callIds",
        "type": "uint256[]"
      },
      {
        "indexed": false,
        "internalType": "uint256[]",
        "name": "newMaxGains",
        "type": "uint256[]"
      }
    ],
    "name": "BatchMaxGainUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "callId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newMaxGain",
        "type": "uint256"
      }
    ],
    "name": "MaxGainUpdated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "callId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "caller",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "tokenAddress",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "enum CallPlatform.Chain",
        "name": "chain",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "tokenSymbol",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "NewCall",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "previousOracle",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOracle",
        "type": "address"
      }
    ],
    "name": "OracleUpdated",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_oracle",
        "type": "address"
      }
    ],
    "name": "setOracle",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_tokenAddress",
        "type": "string"
      },
      {
        "internalType": "enum CallPlatform.Chain",
        "name": "_chain",
        "type": "uint8"
      },
      {
        "internalType": "string",
        "name": "_tokenSymbol",
        "type": "string"
      }
    ],
    "name": "makeCall",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_callId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_maxGain",
        "type": "uint256"
      }
    ],
    "name": "updateMaxGain",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256[]",
        "name": "_callIds",
        "type": "uint256[]"
      },
      {
        "internalType": "uint256[]",
        "name": "_maxGains",
        "type": "uint256[]"
      }
    ],
    "name": "batchUpdateMaxGain",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_offset",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_limit",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_newestFirst",
        "type": "bool"
      }
    ],
    "name": "getAllCalls",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "caller",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "tokenAddress",
            "type": "string"
          },
          {
            "internalType": "enum CallPlatform.Chain",
            "name": "chain",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "tokenSymbol",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "maxGain",
            "type": "uint256"
          }
        ],
        "internalType": "struct CallPlatform.Call[]",
        "name": "",
        "type": "tuple[]"
      },
      {
        "internalType": "bool",
        "name": "hasMore",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_offset",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_limit",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_newestFirst",
        "type": "bool"
      }
    ],
    "name": "getCallsByUser",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "caller",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "tokenAddress",
            "type": "string"
          },
          {
            "internalType": "enum CallPlatform.Chain",
            "name": "chain",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "tokenSymbol",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "maxGain",
            "type": "uint256"
          }
        ],
        "internalType": "struct CallPlatform.Call[]",
        "name": "",
        "type": "tuple[]"
      },
      {
        "internalType": "bool",
        "name": "hasMore",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum CallPlatform.Chain",
        "name": "_chain",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "_offset",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_limit",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_newestFirst",
        "type": "bool"
      }
    ],
    "name": "getCallsByChain",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "caller",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "tokenAddress",
            "type": "string"
          },
          {
            "internalType": "enum CallPlatform.Chain",
            "name": "chain",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "tokenSymbol",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "maxGain",
            "type": "uint256"
          }
        ],
        "internalType": "struct CallPlatform.Call[]",
        "name": "",
        "type": "tuple[]"
      },
      {
        "internalType": "bool",
        "name": "hasMore",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_tokenAddress",
        "type": "string"
      },
      {
        "internalType": "enum CallPlatform.Chain",
        "name": "_chain",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "_offset",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_limit",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_newestFirst",
        "type": "bool"
      }
    ],
    "name": "getCallsByToken",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "caller",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "tokenAddress",
            "type": "string"
          },
          {
            "internalType": "enum CallPlatform.Chain",
            "name": "chain",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "tokenSymbol",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "maxGain",
            "type": "uint256"
          }
        ],
        "internalType": "struct CallPlatform.Call[]",
        "name": "",
        "type": "tuple[]"
      },
      {
        "internalType": "bool",
        "name": "hasMore",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_callId",
        "type": "uint256"
      }
    ],
    "name": "getCallDetails",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "caller",
            "type": "address"
          },
          {
            "internalType": "string",
            "name": "tokenAddress",
            "type": "string"
          },
          {
            "internalType": "enum CallPlatform.Chain",
            "name": "chain",
            "type": "uint8"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          },
          {
            "internalType": "string",
            "name": "tokenSymbol",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "maxGain",
            "type": "uint256"
          }
        ],
        "internalType": "struct CallPlatform.Call",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_user",
        "type": "address"
      }
    ],
    "name": "getUserCallCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum CallPlatform.Chain",
        "name": "_chain",
        "type": "uint8"
      }
    ],
    "name": "getChainName",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "calls",
    "outputs": [
      {
        "internalType": "address",
        "name": "caller",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "tokenAddress",
        "type": "string"
      },
      {
        "internalType": "enum CallPlatform.Chain",
        "name": "chain",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "tokenSymbol",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "maxGain",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "userCalls",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalCalls",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "allCallIds",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "oracle",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export const CHAINS = [
  { id: 0, name: 'Ethereum' },
  { id: 1, name: 'Sonic' },
  { id: 2, name: 'Solana' },
  { id: 3, name: 'Sui' },
  { id: 4, name: 'BSC' },
  { id: 5, name: 'Polygon' },
  { id: 6, name: 'Avalanche' },
  { id: 7, name: 'Arbitrum' },
  { id: 8, name: 'Optimism' },
  { id: 9, name: 'Base' },
  { id: 10, name: 'Abstract' },
]
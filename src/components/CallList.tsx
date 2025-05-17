import { useState } from 'react'
import { useAccount, useReadContract } from 'wagmi'
import { CALL_PLATFORM_ADDRESS, CALL_PLATFORM_ABI, CHAINS } from '../config/contract'
import { Address } from 'viem'
import { CopyButton } from './CopyButton'

type Call = {
  caller: Address
  tokenAddress: string
  chain: number
  timestamp: bigint
  tokenSymbol: string
  maxGain: bigint
}

// Map chain names to DexScreener chain paths
const DEXSCREENER_CHAINS: Record<number, string> = {
  0: 'ethereum',
  1: 'sonic',
  2: 'solana',
  3: 'sui',
  4: 'bsc',
  5: 'polygon',
  6: 'avalanche',
  7: 'arbitrum',
  8: 'optimism',
  9: 'base',
  10: 'abstract',
}

export function CallList() {
  const { address } = useAccount()
  const [viewType, setViewType] = useState<'all' | 'user'>('all')
  const [offset, setOffset] = useState(0)
  const limit = 10

  const { data: allCallsData, isLoading: loadingAll } = useReadContract({
    address: CALL_PLATFORM_ADDRESS as Address,
    abi: CALL_PLATFORM_ABI,
    functionName: 'getAllCalls',
    args: [BigInt(offset), BigInt(limit), true],
    query: {
      enabled: viewType === 'all',
    },
  })

  const { data: userCallsData, isLoading: loadingUser } = useReadContract({
    address: CALL_PLATFORM_ADDRESS as Address,
    abi: CALL_PLATFORM_ABI,
    functionName: 'getCallsByUser',
    args: [address!, BigInt(offset), BigInt(limit), true],
    query: {
      enabled: viewType === 'user' && !!address,
    },
  })

  const isLoading = viewType === 'all' ? loadingAll : loadingUser
  const data = viewType === 'all' ? allCallsData : userCallsData
  const calls = data?.[0] || []
  const hasMore = data?.[1] || false

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleString()
  }

  const formatAddress = (address: string) => {
    if (address.length > 42) {
      // Likely non-EVM address
      return `${address.slice(0, 8)}...${address.slice(-6)}`
    }
    // EVM address
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatGain = (gain: bigint) => {
    if (gain === 0n) return '0%'
    // Convert from bigint to number and divide by 10000 (basis points)
    // or divide by 100 if the value is already in percentage * 100 format
    const gainNumber = Number(gain)
    // If the value seems too large, it's likely in wei format
    if (gainNumber > 1000000000000) {
      // Convert from wei to percentage (divide by 1e16 for percentage)
      return `${(gainNumber / 1e16).toFixed(2)}%`
    }
    // Otherwise treat as basis points (1 = 0.01%)
    return `${(gainNumber / 100).toFixed(2)}%`
  }

  const getDexScreenerUrl = (chainId: number, tokenAddress: string) => {
    const chain = DEXSCREENER_CHAINS[chainId]
    if (!chain) return null
    return `https://dexscreener.com/${chain}/${tokenAddress}`
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Call List</h2>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setViewType('all')
              setOffset(0)
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewType === 'all'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            All Calls
          </button>
          <button
            onClick={() => {
              setViewType('user')
              setOffset(0)
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              viewType === 'user'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            My Calls
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-400">Loading calls...</p>
        </div>
      ) : calls.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-400">No calls found</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {calls.map((call: Call, index: number) => {
              const dexScreenerUrl = getDexScreenerUrl(call.chain, call.tokenAddress)
              
              return (
                <div
                  key={`${call.timestamp}-${index}`}
                  className="bg-gray-800 rounded-lg p-4 border border-gray-700"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Chain</p>
                      <p className="font-medium">{CHAINS[call.chain].name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Token</p>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{call.tokenSymbol}</p>
                        {dexScreenerUrl && (
                          <a
                            href={dexScreenerUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                            title="View on DexScreener"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Token Address</p>
                      <div className="flex items-center gap-1">
                        <p className="font-medium font-mono text-sm break-all">{formatAddress(call.tokenAddress)}</p>
                        <CopyButton text={call.tokenAddress} />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Caller</p>
                      <div className="flex items-center gap-1">
                        <p className="font-medium font-mono">{formatAddress(call.caller)}</p>
                        <CopyButton text={call.caller} />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Max Gain</p>
                      <p className={`font-medium ${Number(call.maxGain) > 0 ? 'text-green-500' : 'text-gray-500'}`}>
                        {formatGain(call.maxGain)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-400">Timestamp</p>
                    <p className="text-sm">{formatDate(call.timestamp)}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setOffset(Math.max(0, offset - limit))}
              disabled={offset === 0}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-gray-400">
              Showing {offset + 1} - {offset + calls.length}
            </span>
            <button
              onClick={() => setOffset(offset + limit)}
              disabled={!hasMore}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}
import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CALL_PLATFORM_ADDRESS, CALL_PLATFORM_ABI, CHAINS } from '../config/contract'
import { Address } from 'viem'

export function MakeCall() {
  const [tokenAddress, setTokenAddress] = useState('')
  const [tokenSymbol, setTokenSymbol] = useState('')
  const [selectedChain, setSelectedChain] = useState(0)

  const { data: hash, error, isPending, writeContract } = useWriteContract()

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tokenAddress || !tokenSymbol) return

    writeContract({
      address: CALL_PLATFORM_ADDRESS as Address,
      abi: CALL_PLATFORM_ABI,
      functionName: 'makeCall',
      args: [tokenAddress, selectedChain, tokenSymbol],
    })
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <h2 className="text-2xl font-semibold mb-6">Make a New Call</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="chain" className="block text-sm font-medium text-gray-300 mb-2">
            Chain
          </label>
          <select
            id="chain"
            value={selectedChain}
            onChange={(e) => setSelectedChain(Number(e.target.value))}
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            {CHAINS.map((chain) => (
              <option key={chain.id} value={chain.id}>
                {chain.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="tokenAddress" className="block text-sm font-medium text-gray-300 mb-2">
            Token Address
          </label>
          <input
            type="text"
            id="tokenAddress"
            value={tokenAddress}
            onChange={(e) => setTokenAddress(e.target.value)}
            placeholder="Enter any address format for the selected chain"
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Accepts any address format: Ethereum (0x...), Solana (base58), Sui (0x...), etc.
          </p>
        </div>

        <div>
          <label htmlFor="tokenSymbol" className="block text-sm font-medium text-gray-300 mb-2">
            Token Symbol
          </label>
          <input
            type="text"
            id="tokenSymbol"
            value={tokenSymbol}
            onChange={(e) => setTokenSymbol(e.target.value)}
            placeholder="ETH, USDC, SOL, etc."
            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isPending || isConfirming}
          className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? 'Preparing...' : isConfirming ? 'Confirming...' : 'Make Call'}
        </button>
      </form>

      {isSuccess && (
        <div className="mt-6 p-4 bg-green-900/20 border border-green-600 rounded-lg">
          <p className="text-green-500">Call successfully made!</p>
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-900/20 border border-red-600 rounded-lg">
          <p className="text-red-500">Error: {error.message}</p>
        </div>
      )}
    </div>
  )
}
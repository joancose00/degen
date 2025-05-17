import { useState } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { CALL_PLATFORM_ADDRESS, CALL_PLATFORM_ABI } from '../config/contract'
import { Address } from 'viem'

export function AdminPanel() {
  const { address } = useAccount()
  const [newOracle, setNewOracle] = useState('')
  const [callId, setCallId] = useState('')
  const [maxGain, setMaxGain] = useState('')
  const [batchCallIds, setBatchCallIds] = useState('')
  const [batchMaxGains, setBatchMaxGains] = useState('')

  const { data: owner } = useReadContract({
    address: CALL_PLATFORM_ADDRESS as Address,
    abi: CALL_PLATFORM_ABI,
    functionName: 'owner',
  })

  const { data: oracle } = useReadContract({
    address: CALL_PLATFORM_ADDRESS as Address,
    abi: CALL_PLATFORM_ABI,
    functionName: 'oracle',
  })

  const { data: setOracleHash, isPending: settingOracle, writeContract: setOracleWrite } = useWriteContract()
  const { data: updateGainHash, isPending: updatingGain, writeContract: updateGainWrite } = useWriteContract()
  const { data: batchUpdateHash, isPending: batchUpdating, writeContract: batchUpdateWrite } = useWriteContract()

  const { isLoading: confirmingOracle } = useWaitForTransactionReceipt({ hash: setOracleHash })
  const { isLoading: confirmingGain } = useWaitForTransactionReceipt({ hash: updateGainHash })
  const { isLoading: confirmingBatch } = useWaitForTransactionReceipt({ hash: batchUpdateHash })

  const isOwner = address && owner && address.toLowerCase() === owner.toLowerCase()
  const isOracle = address && oracle && address.toLowerCase() === oracle.toLowerCase()

  const handleSetOracle = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newOracle) return

    setOracleWrite({
      address: CALL_PLATFORM_ADDRESS as Address,
      abi: CALL_PLATFORM_ABI,
      functionName: 'setOracle',
      args: [newOracle as Address],
    })
  }

  const handleUpdateMaxGain = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!callId || !maxGain) return

    updateGainWrite({
      address: CALL_PLATFORM_ADDRESS as Address,
      abi: CALL_PLATFORM_ABI,
      functionName: 'updateMaxGain',
      args: [BigInt(callId), BigInt(maxGain)],
    })
  }

  const handleBatchUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!batchCallIds || !batchMaxGains) return

    const callIds = batchCallIds.split(',').map(id => BigInt(id.trim()))
    const maxGains = batchMaxGains.split(',').map(gain => BigInt(gain.trim()))

    if (callIds.length !== maxGains.length) {
      alert('Number of call IDs must match number of max gains')
      return
    }

    batchUpdateWrite({
      address: CALL_PLATFORM_ADDRESS as Address,
      abi: CALL_PLATFORM_ABI,
      functionName: 'batchUpdateMaxGain',
      args: [callIds, maxGains],
    })
  }

  if (!isOwner && !isOracle) {
    return null
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6 mb-8">
      <h2 className="text-2xl font-semibold mb-6">Admin Panel</h2>

      <div className="space-y-6">
        {/* Oracle Settings - Only for Owner */}
        {isOwner && (
          <div className="border-b border-gray-800 pb-6">
            <h3 className="text-lg font-medium mb-4">Oracle Settings</h3>
            <p className="text-sm text-gray-400 mb-4">
              Current Oracle: <span className="font-mono">{oracle}</span>
            </p>
            <form onSubmit={handleSetOracle} className="space-y-4">
              <div>
                <label htmlFor="newOracle" className="block text-sm font-medium text-gray-300 mb-2">
                  New Oracle Address
                </label>
                <input
                  type="text"
                  id="newOracle"
                  value={newOracle}
                  onChange={(e) => setNewOracle(e.target.value)}
                  placeholder="0x..."
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={settingOracle || confirmingOracle}
                className="bg-purple-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {settingOracle ? 'Preparing...' : confirmingOracle ? 'Confirming...' : 'Set Oracle'}
              </button>
            </form>
          </div>
        )}

        {/* Max Gain Updates - Only for Oracle */}
        {isOracle && (
          <>
            <div className="border-b border-gray-800 pb-6">
              <h3 className="text-lg font-medium mb-4">Update Single Call Max Gain</h3>
              <form onSubmit={handleUpdateMaxGain} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="callId" className="block text-sm font-medium text-gray-300 mb-2">
                      Call ID
                    </label>
                    <input
                      type="number"
                      id="callId"
                      value={callId}
                      onChange={(e) => setCallId(e.target.value)}
                      placeholder="0"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="maxGain" className="block text-sm font-medium text-gray-300 mb-2">
                      Max Gain (basis points)
                    </label>
                    <input
                      type="number"
                      id="maxGain"
                      value={maxGain}
                      onChange={(e) => setMaxGain(e.target.value)}
                      placeholder="500 (5%)"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={updatingGain || confirmingGain}
                  className="bg-purple-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updatingGain ? 'Preparing...' : confirmingGain ? 'Confirming...' : 'Update Max Gain'}
                </button>
              </form>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Batch Update Max Gains</h3>
              <form onSubmit={handleBatchUpdate} className="space-y-4">
                <div>
                  <label htmlFor="batchCallIds" className="block text-sm font-medium text-gray-300 mb-2">
                    Call IDs (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="batchCallIds"
                    value={batchCallIds}
                    onChange={(e) => setBatchCallIds(e.target.value)}
                    placeholder="0, 1, 2, 3"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="batchMaxGains" className="block text-sm font-medium text-gray-300 mb-2">
                    Max Gains (comma-separated, basis points)
                  </label>
                  <input
                    type="text"
                    id="batchMaxGains"
                    value={batchMaxGains}
                    onChange={(e) => setBatchMaxGains(e.target.value)}
                    placeholder="500, 750, 1000, 250"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={batchUpdating || confirmingBatch}
                  className="bg-purple-600 text-white py-2 px-6 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {batchUpdating ? 'Preparing...' : confirmingBatch ? 'Confirming...' : 'Batch Update'}
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
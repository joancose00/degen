import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useState } from 'react'
import { useAccount } from 'wagmi'
import { MakeCall } from './components/MakeCall'
import { CallList } from './components/CallList'
import { AdminPanel } from './components/AdminPanel'

function App() {
  const { isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<'make' | 'list'>('make')

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-purple-500">Degen Inc.</h1>
          <ConnectButton />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {isConnected ? (
          <>
            <AdminPanel />
            
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => setActiveTab('make')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'make'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Make Call
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  activeTab === 'list'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                View Calls
              </button>
            </div>

            {activeTab === 'make' ? <MakeCall /> : <CallList />}
          </>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-4">Welcome to Call Platform</h2>
            <p className="text-gray-400 mb-8">Connect your wallet to get started</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
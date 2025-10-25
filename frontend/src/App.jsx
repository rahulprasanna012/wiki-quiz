import { useState } from 'react'
import GenerateQuizTab from './tabs/GenerateQuizTab'
import HistoryTab from './tabs/HistoryTab'

function App() {
  const [activeTab, setActiveTab] = useState('generate')

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            🧠 AI Wiki Quiz Generator
          </h1>
          <p className="text-white text-lg opacity-90">
            Transform Wikipedia articles into engaging educational quizzes
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-lg p-2 mb-6 flex gap-2">
          <button
            onClick={() => setActiveTab('generate')}
            className={`flex-1 py-3 px-6 rounded-md font-semibold transition duration-200 ${
              activeTab === 'generate'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            ✨ Generate Quiz
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 px-6 rounded-md font-semibold transition duration-200 ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            📚 History
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {activeTab === 'generate' ? <GenerateQuizTab /> : <HistoryTab />}
        </div>
      </div>
    </div>
  )
}

export default App

import { useState } from 'react'
import { generateQuiz } from '../services/api'
import QuizDisplay from '../components/QuizDisplay'

function GenerateQuizTab() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [quizData, setQuizData] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate URL
    if (!url.trim()) {
      setError('Please enter a Wikipedia URL')
      return
    }

    if (!url.includes('wikipedia.org/wiki/')) {
      setError('Please enter a valid Wikipedia article URL')
      return
    }

    setLoading(true)
    setError(null)
    setQuizData(null)

    try {
      const result = await generateQuiz(url)
      setQuizData(result)
      setUrl('') // Clear input on success
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Generate New Quiz
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              Wikipedia Article URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://en.wikipedia.org/wiki/Artificial_intelligence"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition duration-200 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? '🔄 Generating Quiz...' : '✨ Generate Quiz'}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 font-medium">❌ {error}</p>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 font-medium">
            🤖 AI is analyzing the article and creating your quiz...
          </p>
          <p className="mt-2 text-gray-500 text-sm">
            This may take 10-30 seconds
          </p>
        </div>
      )}

      {/* Quiz Display */}
      {quizData && !loading && (
        <div className="mt-8">
          <QuizDisplay data={quizData.quiz_data} />
        </div>
      )}
    </div>
  )
}

export default GenerateQuizTab

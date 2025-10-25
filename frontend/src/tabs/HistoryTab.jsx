import { useState, useEffect } from 'react'
import { getQuizHistory, getQuizById } from '../services/api'
import QuizDisplay from '../components/QuizDisplay'
import Modal from '../components/Modal'

function HistoryTab() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [loadingQuiz, setLoadingQuiz] = useState(false)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const data = await getQuizHistory()
      setHistory(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleViewQuiz = async (quizId) => {
    setLoadingQuiz(true)
    setModalOpen(true)
    try {
      const quiz = await getQuizById(quizId)
      setSelectedQuiz(quiz)
    } catch (err) {
      setError(err.message)
      setModalOpen(false)
    } finally {
      setLoadingQuiz(false)
    }
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedQuiz(null)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading quiz history...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-800">❌ {error}</p>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">📭 No quizzes generated yet</p>
        <p className="text-gray-500 mt-2">Start by generating your first quiz!</p>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Quiz History</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Wikipedia URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Generated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {history.map((quiz) => (
              <tr key={quiz.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  #{quiz.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {quiz.title}
                </td>
                <td className="px-6 py-4 text-sm text-blue-600 hover:text-blue-800">
                  <a href={quiz.url} target="_blank" rel="noopener noreferrer" className="underline">
                    View Article
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(quiz.date_generated)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => handleViewQuiz(quiz.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                  >
                    📖 View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for Quiz Details */}
      <Modal isOpen={modalOpen} onClose={closeModal}>
        {loadingQuiz ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading quiz details...</p>
          </div>
        ) : selectedQuiz ? (
          <QuizDisplay data={selectedQuiz.quiz_data} />
        ) : null}
      </Modal>
    </div>
  )
}

export default HistoryTab

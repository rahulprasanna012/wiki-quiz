const API_BASE_URL = 'https://wiki-quiz.onrender.com/'

/**
 * Generate a quiz from Wikipedia URL
 */
export async function generateQuiz(url) {
  const response = await fetch(`${API_BASE_URL}/generate_quiz`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Failed to generate quiz')
  }

  return response.json()
}

/**
 * Get quiz history
 */
export async function getQuizHistory() {
  const response = await fetch(`${API_BASE_URL}/history`)

  if (!response.ok) {
    throw new Error('Failed to fetch quiz history')
  }

  return response.json()
}

/**
 * Get quiz details by ID
 */
export async function getQuizById(quizId) {
  const response = await fetch(`${API_BASE_URL}/quiz/${quizId}`)

  if (!response.ok) {
    throw new Error('Failed to fetch quiz details')
  }

  return response.json()
}

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://wiki-quiz.onrender.com';

export const generateQuiz = async (url) => {
  try {
    const response = await fetch(`${API_BASE_URL}/generate_quiz`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || 'Failed to generate quiz');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw error;
  }
};

export const getHistory = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/history`);
    if (!response.ok) {
      throw new Error('Failed to fetch history');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching history:', error);
    throw error;
  }
};

export const getQuizById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/quiz/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch quiz');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching quiz:', error);
    throw error;
  }
};

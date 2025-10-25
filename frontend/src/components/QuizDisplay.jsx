function QuizDisplay({ data }) {
  if (!data) return null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b pb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-3">{data.title}</h2>
        <p className="text-gray-700 text-lg leading-relaxed">{data.summary}</p>
      </div>

      {/* Questions Section */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="mr-2">❓</span> Quiz Questions ({data.questions.length})
        </h3>
        <div className="space-y-6">
          {data.questions.map((question, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="font-semibold text-lg text-gray-900 mb-4">
                {index + 1}. {question.question}
              </div>
              <div className="space-y-2 mb-4">
                {question.options.map((option, optIndex) => (
                  <div
                    key={optIndex}
                    className={`p-3 rounded-md border ${
                      option === question.correct_answer
                        ? 'bg-green-50 border-green-300 font-semibold'
                        : 'bg-white border-gray-300'
                    }`}
                  >
                    <span className="font-medium mr-2">
                      {String.fromCharCode(65 + optIndex)}.
                    </span>
                    {option}
                    {option === question.correct_answer && (
                      <span className="ml-2 text-green-600">✓</span>
                    )}
                  </div>
                ))}
              </div>
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-blue-700">💡 Explanation: </span>
                  {question.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Entities */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🔑</span> Key Concepts
        </h3>
        <div className="flex flex-wrap gap-2">
          {data.key_entities.map((entity, index) => (
            <span
              key={index}
              className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-medium"
            >
              {entity}
            </span>
          ))}
        </div>
      </div>

      {/* Related Topics */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="mr-2">🔗</span> Related Topics
        </h3>
        <div className="flex flex-wrap gap-2">
          {data.related_topics.map((topic, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default QuizDisplay

import React, { useState } from 'react';

const QuestionForm: React.FC<{ postQuestion: (questionText: string) => void }> = ({ postQuestion }) => {
  const [questionText, setQuestionText] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (questionText.trim()) {
      postQuestion(questionText);
      setQuestionText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center bg-white p-6 rounded shadow-md" style={{ width: '100%', maxWidth: '700px', height: '220px' }}>
      <textarea
        className="w-full p-2 border border-gray-300 rounded mb-4"
        placeholder="Ask anything here..."
        value={questionText}
        onChange={(e) => setQuestionText(e.target.value)}
        style={{ height: '200px', resize: 'none' }}
      />
      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-auto">
        Post Question
      </button>
    </form>
  );
};

export default QuestionForm;
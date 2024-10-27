import React, { useState } from 'react';

interface QuestionFormProps {
    postQuestion: (questionText: string) => void;
}

const QuestionForm: React.FC<QuestionFormProps> = ({ postQuestion }) => {
    const [questionText, setQuestionText] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (questionText) {
            postQuestion(questionText);
            setQuestionText('');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input 
                type="text"
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                placeholder='Ask a question...'
            />
            <button type='submit'>Post</button>
        </form>
    );
};

export default QuestionForm;
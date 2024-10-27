import React from 'react';

interface QuestionItemProps {
    question: Question;
    postAnswer: (questionID: string, answerText: string) => void;
}

const QuestionItem: React.FC<QuestionItemProps> = ({ question, postAnswer }) => {
    const handlePostAnswer = () => {
        const answerText = prompt("Enter your answer");
        if (answerText) postAnswer(question.$id, answerText);
    };

    return (
        <li>
            {question.questionText}
            <button onClick={handlePostAnswer}>Answer</button>
        </li>
    );
};

export default QuestionItem;
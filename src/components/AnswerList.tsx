import React from 'react';

interface AnswerListProps {
    answers: Answer[];
}

const AnswerList: React.FC<AnswerListProps> = ({ answers }) => {
    return (
        <ul>
            {answers.map((answer) => (
                <li key={answer.$id}>{answer.answerText}</li>
            ))}
        </ul>
    );
};

export default AnswerList;
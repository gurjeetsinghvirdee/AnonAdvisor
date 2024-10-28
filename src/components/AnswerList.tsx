import React from 'react';
import { Answers } from '../types';

interface AnswerListProps {
    answers: Answers[];
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
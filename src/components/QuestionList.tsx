import React from 'react';
import QuestionItem from './QuestionItem';
import { Questions } from '../types';

interface QuestionListProps {
    questions: Questions[];
    postAnswer: (questionID: string, answerText: string) => void;
}

const QuestionList: React.FC<QuestionListProps> = ({ questions, postAnswer }) => {
    return (
        <ul>
            {questions.map((question) => (
                <QuestionItem 
                    key={question.$id}
                    question={question}
                    postAnswer={postAnswer}
                />
            ))}
        </ul>
    );
};

export default QuestionList;
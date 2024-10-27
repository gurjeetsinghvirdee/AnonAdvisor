import React from 'react';
import QuestionItem from './QuestionItem';

interface QuestionListProps {
    questions: Question[];
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
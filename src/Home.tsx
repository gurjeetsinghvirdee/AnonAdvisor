import React, { useState, useEffect } from 'react';
import { databases, client } from './appwrite';
import QuestionForm from './components/QuestionForm';

interface Questions {
    $id: string;
    questionText: string;
    timestamp: string;
}

const Home: React.FC<{ postQuestion: (questionText: string) => void, questions: Questions[] }> = ({ postQuestion, questions }) => {
    const [recentQuestion, setRecentQuestion] = useState<string | null>(null);

    return (
        <div className="container mx-auto p-4">
            <div className="my-4 flex flex-col items-center">
                <h2 className="text-2xl font-semibold text-white">Welcome to AnonAdvisor</h2>
                <p className="text-white">Ask a question anonymously!</p>
                <div className="w-full mt-4 p-4 bg-white rounded shadow-md flex flex-col items-center relative">
                    <QuestionForm postQuestion={postQuestion} />
                    {recentQuestion && (
                        <div className="absolute top-0 right-0 mt-2 mr-2 bg-blue-500 text-white p-2 rounded shadow-md">
                            {recentQuestion}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
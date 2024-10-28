import React, { useEffect, useState } from 'react';
import { databases, client } from './appwrite';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react';
import { FaQuestionCircle, FaUserPlus } from 'react-icons/fa';
import QuestionForm from './components/QuestionForm';
import QuestionList from './components/QuestionList';
import AnswerList from './components/AnswerList';

interface Questions {
  $id: string;
  questionText: string;
  timestamp: string;
}

interface Answers {
  $id: string;
  questionID: string;
  answerText: string;
  timestamp: string;
}

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [answers, setAnswers] = useState<Answers[]>([]);

  useEffect(() => {
    getQuestions();
    getAnswers();
    const unsubscribeQuestions = client.subscribe(`collections.${import.meta.env.VITE_APP_APPWRITE_QUESTIONS_COLLECTION_ID}.documents`, () => {
      getQuestions();
    });
    const unsubscribeAnswers = client.subscribe(`collections.${import.meta.env.VITE_APP_APPWRITE_ANSWERS_COLLECTION_ID}.documents`, () => {
      getAnswers();
    });
    return () => {
      unsubscribeQuestions();
      unsubscribeAnswers();
    };
  }, []);

  const getQuestions = async () => {
    const response = await databases.listDocuments(
      import.meta.env.VITE_APP_APPWRITE_DATABASE_ID!,
      import.meta.env.VITE_APP_APPWRITE_QUESTIONS_COLLECTION_ID!
    );
    setQuestions(response.documents.map((doc) => ({
      $id: doc.$id,
      questionText: doc.questionText,
      timestamp: doc.timestamp,
    })));
  };

  const getAnswers = async () => {
    const response = await databases.listDocuments(
      import.meta.env.VITE_APP_APPWRITE_DATABASE_ID!,
      import.meta.env.VITE_APP_APPWRITE_ANSWERS_COLLECTION_ID!
    );
    setAnswers(response.documents.map((doc) => ({
      $id: doc.$id,
      questionID: doc.questionID,
      answerText: doc.answerText,
      timestamp: doc.timestamp,
    })));
  };

  const postQuestion = async (questionText: string) => {
    await databases.createDocument(
      import.meta.env.VITE_APP_APPWRITE_DATABASE_ID!,
      import.meta.env.VITE_APP_APPWRITE_QUESTIONS_COLLECTION_ID!,
      'unique()',
      { questionText, timestamp: new Date().toISOString() }
    );
    getQuestions();
  };

  const postAnswer = async (questionID: string, answerText: string) => {
    await databases.createDocument(
      import.meta.env.VITE_APP_APPWRITE_DATABASE_ID!,
      import.meta.env.VITE_APP_APPWRITE_ANSWERS_COLLECTION_ID!,
      'unique()',
      { questionID, answerText, timestamp: new Date().toISOString() }
    );
    getAnswers();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-500 to-purple-500 text-gray-900">
      <Router>
        <nav className="bg-blue-600 p-4 flex justify-between items-center">
          <div className="text-white text-lg flex items-center">
            <FaQuestionCircle className="mr-2" />
            AnonAdvisor
          </div>
          <div className="flex items-center">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <Link to="/sign-up" className="text-white text-lg flex items-center cursor-pointer">
                <FaUserPlus className="mr-2" />
                Sign Up
              </Link>
            </SignedOut>
          </div>
        </nav>
        <Routes>
          <Route
            path="/"
            element={
              <div className="container mx-auto p-4 flex-grow">
                <div className="my-4 flex flex-col items-center">
                  <SignedOut>
                    <div className="text-center w-full max-w-2xl">
                      <h2 className="text-2xl font-semibold text-white">Welcome to AnonAdvisor</h2>
                      <p className="text-white">Ask a question anonymously or check out recent answers!</p>
                      <div className="w-full mt-4 p-4 bg-white rounded shadow-md flex justify-between items-end relative">
                        <QuestionForm postQuestion={postQuestion} />
                      </div>
                      <div className="mt-8 w-full">
                        <h5 className="text-xl font-semibold text-white">Recent Answers</h5>
                        <div className="flex flex-col-reverse">
                          <AnswerList answers={answers} />
                        </div>
                      </div>
                    </div>
                  </SignedOut>
                  <SignedIn>
                    <div className="w-full max-w-2xl mt-4 p-4 bg-white rounded shadow-md flex justify-between items-end relative">
                      <QuestionForm postQuestion={postQuestion} />
                      <button
                        className="ml-4 bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
                      >
                        Post
                      </button>
                    </div>
                    <div className="my-8 w-full">
                      <QuestionList questions={questions} postAnswer={postAnswer} />
                      <h5 className="text-xl font-semibold text-white mt-4">Answers</h5>
                      <AnswerList answers={answers} />
                    </div>
                  </SignedIn>
                </div>
              </div>
            }
          />
        </Routes>
        <footer className="bg-gray-800 text-white p-4 text-center mt-auto">
          Made with ❤️ using Vite + Appwrite
        </footer>
      </Router>
    </div>
  );
};

export default App;
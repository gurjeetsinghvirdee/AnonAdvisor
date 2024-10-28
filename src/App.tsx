import React, { useEffect, useState } from 'react';
import { databases, client } from './appwrite';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, SignUpButton } from '@clerk/clerk-react';
import { FaQuestionCircle, FaUserPlus } from 'react-icons/fa';
import Home from './Home';
import QuestionsPanel from './QuestionsPanel';
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
  const navigate = useNavigate();

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
    try {
      const documentID = 'unique()';
      await databases.createDocument(
        import.meta.env.VITE_APP_APPWRITE_DATABASE_ID!,
        import.meta.env.VITE_APP_APPWRITE_QUESTIONS_COLLECTION_ID!,
        documentID,
        { questionText, timeStamp: new Date().toISOString() }
      );
      getQuestions();
      navigate('/questions');
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

  const postAnswer = async (questionID: string, answerText: string) => {
    try {
      const documentID = 'unique()';
      const answerID = 'unique()';
      await databases.createDocument(
        import.meta.env.VITE_APP_APPWRITE_DATABASE_ID!,
        import.meta.env.VITE_APP_APPWRITE_ANSWERS_COLLECTION_ID!,
        documentID,
        { answerID, questionID, answerText, timeStamp: new Date().toISOString() }
      );
      getAnswers();
    } catch (error) {
      console.error('Error creating answer:', error);
    }
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
              <SignUpButton mode="modal">
                <button className="text-white text-lg flex items-center cursor-pointer">
                  <FaUserPlus className="mr-2" />
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home postQuestion={postQuestion} questions={questions} />} />
          <Route path="/questions" element={<QuestionsPanel questions={questions} postAnswer={postAnswer} />} />
        </Routes>
        <footer className="bg-gray-800 text-white p-4 text-center mt-auto">
          Made with ❤️ using Vite + Appwrite
        </footer>
      </Router>
    </div>
  );
};

export default App;
import React, { useEffect, useState } from 'react';
import { databases, client } from './appwrite';
import { Routes, Route, useNavigate, Link } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, SignUpButton } from '@clerk/clerk-react';
import { FaQuestionCircle, FaUserPlus } from 'react-icons/fa';
import { MdDarkMode, MdOutlineDarkMode } from 'react-icons/md';
import Home from '../src/Home';
import QuestionsPanel from '../src/QuestionsPanel';
import { lightTheme, darkTheme } from './theme';

export interface Questions {
  $id: string;
  questionText: string;
  timestamp: string;
  userID: string; // Added userID property
}

export interface Answers {
  $id: string;
  questionID: string;
  answerText: string;
  timestamp: string;
  parentID?: string;
  userID: string; // Added userID property
}

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Questions[]>([]);
  const [answers, setAnswers] = useState<Answers[]>([]);
  const [theme, setTheme] = useState(lightTheme);
  const navigate = useNavigate();

  useEffect(() => {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(isDarkMode ? darkTheme : lightTheme);
  }, []);

  useEffect(() => {
    const handleThemeChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? darkTheme : lightTheme);
    };
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleThemeChange);
    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', handleThemeChange);
    };
  }, []);

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
      userID: doc.userID // Ensure userID is included
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
      timestamp: new Date(doc.timeStamp).toLocaleString(),
      parentID: doc.parentID || null,
      userID: doc.userID // Ensure userID is included
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

  const postAnswer = async (questionID: string, answerText: string): Promise<void> => {
    try {
      const documentID = 'unique()';
      await databases.createDocument(
        import.meta.env.VITE_APP_APPWRITE_DATABASE_ID!,
        import.meta.env.VITE_APP_APPWRITE_ANSWERS_COLLECTION_ID!,
        documentID,
        { answerID: documentID, questionID, answerText, timeStamp: new Date().toISOString() }
      );
      getAnswers();
    } catch (error) {
      console.error('Error creating answer:', error);
    }
  };

  const postCommentReply = async (questionID: string, answerText: string, parentID: string): Promise<void> => {
    try {
      const documentID = 'unique()';
      await databases.createDocument(
        import.meta.env.VITE_APP_APPWRITE_DATABASE_ID!,
        import.meta.env.VITE_APP_APPWRITE_ANSWERS_COLLECTION_ID!,
        documentID,
        { answerID: documentID, questionID, answerText, parentID, timeStamp: new Date().toISOString() }
      );
      getAnswers();
    } catch (error) {
      console.error('Error creating comment reply:', error);
    }
  };

  const editResponse = async (documentID: string, updatedText: string): Promise<void> => {
    try {
      await databases.updateDocument(
        import.meta.env.VITE_APP_APPWRITE_DATABASE_ID!,
        import.meta.env.VITE_APP_APPWRITE_ANSWERS_COLLECTION_ID!,
        documentID,
        { answerText: updatedText, timeStamp: new Date().toISOString() }
      );
      getAnswers();
    } catch (error) {
      console.error('Error editing response:', error);
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === lightTheme ? darkTheme : lightTheme));
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: theme.background, color: theme.text }}>
      <nav className="p-4 flex justify-between items-center" style={{ backgroundColor: theme.background, color: theme.text }}>
        <div className="text-lg flex items-center">
          <Link to="/" className="flex items-center">
            <FaQuestionCircle className="mr-2" />
            AnonAdvisor
          </Link>
        </div>
        <div className="flex items-center">
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignUpButton mode="modal">
              <button className="text-lg flex items-center cursor-pointer">
                <FaUserPlus className="mr-2" />
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <button
            onClick={toggleTheme}
            className="ml-4 px-4 py-2 border rounded"
            style={{
              backgroundColor: theme === darkTheme ? '#333' : '#ddd',
              color: theme === darkTheme ? '#FFFF00' : '#000000',
            }}
          >
            {theme === darkTheme ? <MdDarkMode /> : <MdOutlineDarkMode />}
          </button>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home postQuestion={postQuestion} questions={questions} />} />
        <Route
          path="/questions"
          element={
            <QuestionsPanel
              questions={questions}
              postAnswer={postAnswer}
              answers={answers}
              editResponse={editResponse}
              postCommentReply={postCommentReply}
            />
          }
        />
      </Routes>
      <footer className="p-4 text-center mt-auto" style={{ backgroundColor: theme.background, color: theme.text }}>
        Made with ❤️ using Vite + Appwrite
      </footer>
    </div>
  );
};

export default App;
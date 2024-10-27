import React, { useEffect, useState } from 'react';
import { databases, client, QUESTIONS_COLLECTION_ID, ANSWERS_COLLECTION_ID } from './appwrite';
import QuestionForm from './components/QuestionForm';
import QuestionList from './components/QuestionList';
import AnswerList from './components/AnswerList';

interface Question {
  $id: string;
  questionText: string;
  timestamp: string;
  // answers?: Answer[]; // Optional answers array
}

interface Answer {
  $id: string;
  questionID: string;
  answerText: string;
  timestamp: string;
}

const App: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    getQuestions();
    getAnswers();

    const unsubscribeQuestions = client.subscribe('collections.${QUESTIONS_COLLECTION_ID}.documents', (response) => {
      console.log('New question added:', response);
      getQuestions();
    });

    const unsubscribeAnswers = client.subscribe('collections.${ANSWERS_COLLECTION_ID}.documents', (response) => {
      console.log('New answer added:', response);
      getAnswers();
    });

    return () => {
      unsubscribeQuestions();
      unsubscribeAnswers();
    };
  }, []);

  const getQuestions = async () => {
    const response = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID!, 
      process.env.QUESTIONS_COLLECTION_ID!
    );
    const questions = response.documents.map((doc) => ({
      $id: doc.$id,
      questionText: doc.questionText,
      timestamp: doc.timestamp,
    }));
    setQuestions(questions);
  };

  const getAnswers = async () => {
    const response = await databases.listDocuments(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.ANSWERS_COLLECTION_ID!
    );
    const answers = response.documents.map((doc) => ({
      $id: doc.$id,
      questionID: doc.questionID,
      answerText: doc.answerText,
      timestamp: doc.timestamp,
    }));
    setAnswers(answers);
  };

  const postQuestion = async (questionText: string) => {
    await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.QUESTIONS_COLLECTION_ID!,
      'unique()',
      { questionText, timestamp: new Date().toISOString() }
    );
    getQuestions();
  };

  const postAnswer = async (questionID: string, answerText: string) => {
    await databases.createDocument(
      process.env.APPWRITE_DATABASE_ID!,
      process.env.ANSWERS_COLLECTION_ID!,
      'unique()',
      { questionID, answerText, timestamp: new Date().toISOString() }
    );
    getAnswers();
  };

  return (
    <div>
      <h1>AnonAdvisor</h1>
      <QuestionForm postQuestion={postQuestion} />
      <QuestionList questions={questions} postAnswer={postAnswer} />
      <h2>Answers</h2>
      <AnswerList answers={answers} />
    </div>
  );
};

export default App;
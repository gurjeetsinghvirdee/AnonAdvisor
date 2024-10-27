import React, { useEffect, useState } from 'react';
import { databases, client } from './appwrite';
import { Container, CssBaseline, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import QuestionForm from './components/QuestionForm';
import QuestionList from './components/QuestionList';
import AnswerList from './components/AnswerList';

interface Question {
  $id: string;
  questionText: string;
  timestamp: string;
}

interface Answer {
  $id: string;
  questionID: string;
  answerText: string;
  timestamp: string;
}

const App = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);

  useEffect(() => {
    getQuestions();
    getAnswers();

    const unsubscribeQuestions = client.subscribe(`collections.${process.env.REACT_APP_APPWRITE_QUESTIONS_COLLECTION_ID}.documents`, (response) => {
      console.log('New question added:', response);
      getQuestions();
    });

    const unsubscribeAnswers = client.subscribe(`collections.${process.env.REACT_APP_APPWRITE_ANSWERS_COLLECTION_ID}.documents`, (response) => {
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
      process.env.REACT_APP_APPWRITE_DATABASE_ID!,
      process.env.REACT_APP_APPWRITE_QUESTIONS_COLLECTION_ID!
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
      process.env.REACT_APP_APPWRITE_DATABASE_ID!,
      process.env.REACT_APP_APPWRITE_ANSWERS_COLLECTION_ID!
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
      process.env.REACT_APP_APPWRITE_DATABASE_ID!,
      process.env.REACT_APP_APPWRITE_QUESTIONS_COLLECTION_ID!,
      'unique()',
      { questionText, timestamp: new Date().toISOString() }
    );
    getQuestions();
  };

  const postAnswer = async (questionID: string, answerText: string) => {
    await databases.createDocument(
      process.env.REACT_APP_APPWRITE_DATABASE_ID!,
      process.env.REACT_APP_APPWRITE_ANSWERS_COLLECTION_ID!,
      'unique()',
      { questionID, answerText, timestamp: new Date().toISOString() }
    );
    getAnswers();
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AnonAdvisor
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Box my={4}>
          <QuestionForm postQuestion={postQuestion} />
          <QuestionList questions={questions} postAnswer={postAnswer} />
          <Box my={2}>
            <Typography variant="h5" component="div">
              Answers
            </Typography>
            <AnswerList answers={answers} />
          </Box>
        </Box>
      </Container>
    </React.Fragment>
  );
};

export default App;
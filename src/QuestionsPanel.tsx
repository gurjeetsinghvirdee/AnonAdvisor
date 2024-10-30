import React, { useState } from 'react';
import { SignedIn, useUser } from '@clerk/clerk-react';
import { FaEdit, FaReply } from 'react-icons/fa';
import { Questions, Answers } from './types';
import AnswersPanel from './AnswersPanel';

interface Props {
  questions: Questions[];
  postAnswer: (questionID: string, answerText: string) => Promise<void>;
  answers: Answers[];
  editResponse: (documentID: string, updatedText: string) => Promise<void>;
  postCommentReply: (questionID: string, answerText: string, parentID: string) => Promise<void>;
  getAnswers: () => Promise<void>; // Adding getAnswers function to fetch latest answers
}

const QuestionsPanel: React.FC<Props> = ({ questions, postAnswer, answers, editResponse, postCommentReply, getAnswers }) => {
  const { user } = useUser();
  const [replyText, setReplyText] = useState('');

  const handleAnswerPost = async (questionID: string, answerText: string) => {
    await postAnswer(questionID, answerText);
    await getAnswers(); // Fetch latest answers after posting
  };

  const handleReplyPost = async (questionID: string, answerText: string, parentID: string) => {
    await postCommentReply(questionID, answerText, parentID);
    await getAnswers(); // Fetch latest answers after posting a reply
  };

  return (
    <div className="questions-panel">
      {questions.map((question) => (
        <div key={question.$id} className="question">
          <h2>{question.questionText}</h2>
          <p>Asked by: {question.userID}</p>
          <AnswersPanel
            answers={answers.filter((answer) => answer.questionID === question.$id)}
            editResponse={editResponse}
            onReplyPost={handleReplyPost}
            user={user}
          />
          <SignedIn>
            <div className="answer-form">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write your answer..."
              />
              <button onClick={() => handleAnswerPost(question.$id, replyText)}>Submit Answer</button>
            </div>
          </SignedIn>
        </div>
      ))}
    </div>
  );
};

export default QuestionsPanel;
 

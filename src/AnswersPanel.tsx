import React, { useState } from 'react';
import { Answers } from './types';

interface Props {
  answers: Answers[];
  editResponse: (documentID: string, updatedText: string) => Promise<void>;
  onReplyPost: (questionID: string, answerText: string, parentID: string) => Promise<void>;
  user: any; // Define this as per your user type
}

const AnswersPanel: React.FC<Props> = ({ answers, editResponse, onReplyPost, user }) => {
  const [replyText, setReplyText] = useState('');
  const [editingAnswerID, setEditingAnswerID] = useState<string | null>(null);
  const [editedText, setEditedText] = useState('');

  const handleEdit = (answerID: string, currentText: string) => {
    setEditingAnswerID(answerID);
    setEditedText(currentText);
  };

  const handleUpdate = async (answerID: string) => {
    await editResponse(answerID, editedText);
    setEditingAnswerID(null);
    setEditedText('');
  };

  return (
    <div className="answers-panel">
      {answers.map((answer) => (
        <div key={answer.$id} className="answer">
          {editingAnswerID === answer.$id ? (
            <div>
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
              />
              <button onClick={() => handleUpdate(answer.$id)}>Update</button>
              <button onClick={() => setEditingAnswerID(null)}>Cancel</button>
            </div>
          ) : (
            <div>
              <p>{answer.answerText}</p>
              <p>Answered by: {answer.userID}</p>
              <button onClick={() => handleEdit(answer.$id, answer.answerText)}>Edit</button>
              <div className="reply-form">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                />
                <button onClick={() => onReplyPost(answer.questionID, replyText, answer.$id)}>Reply</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AnswersPanel;
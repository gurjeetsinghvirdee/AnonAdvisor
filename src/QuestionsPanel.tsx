import React from 'react';
import { SignedIn, useUser } from '@clerk/clerk-react';
import { FaTrashAlt, FaReply, FaEdit } from 'react-icons/fa';
import { Questions, Answers } from './App';

interface Props {
  questions: Questions[];
  postAnswer: (questionID: string, answerText: string) => Promise<void>;
  answers: Answers[];
  softDeleteResponse: (documentID: string, collectionID: string) => Promise<void>;
  editResponse: (documentID: string, updatedText: string) => Promise<void>;
  postCommentReply: (questionID: string, answerText: string, parentID: string) => Promise<void>;
}

const QuestionsPanel: React.FC<Props> = ({ questions, postAnswer, answers, softDeleteResponse, editResponse, postCommentReply }) => {
  const { user } = useUser();

  const handleDelete = async (id: string, collectionID: string) => {
    await softDeleteResponse(id, collectionID);
  };

  const handleEdit = async (id: string, newText: string) => {
    await editResponse(id, newText);
  };

  const handleReply = async (questionID: string, answerText: string, parentID: string) => {
    await postCommentReply(questionID, answerText, parentID, user!.id);
  };

  return (
    <div className="space-y-4">
      {questions.filter(q => q.questionText !== null).map(question => (
        <div key={question.$id} className="border border-gray-300 p-4 rounded-lg bg-white shadow-md">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">{question.questionText}</h3>
            <SignedIn>
              {user?.id === question.userID && (
                <div className="flex space-x-3">
                  <FaTrashAlt onClick={() => handleDelete(question.$id, import.meta.env.VITE_APP_APPWRITE_QUESTIONS_COLLECTION_ID!)} className="text-red-500 cursor-pointer" title="Delete" />
                  <FaEdit onClick={() => handleEdit(question.$id, "New text here")} className="text-blue-500 cursor-pointer" title="Edit" />
                </div>
              )}
              <FaReply onClick={() => handleReply(question.$id, "Reply text here", question.$id)} className="text-green-500 cursor-pointer" title="Reply" />
            </SignedIn>
          </div>
          <div>
            {answers.filter(a => a.questionID === question.$id && !a.parentID && a.answerText !== null).map(answer => (
              <div key={answer.$id} className="ml-5 mb-3">
                <p className="mb-1">{answer.answerText}</p>
                <SignedIn>
                  {user?.id === answer.userID && (
                    <div className="flex space-x-3">
                      <FaTrashAlt onClick={() => handleDelete(answer.$id, import.meta.env.VITE_APP_APPWRITE_ANSWERS_COLLECTION_ID!)} className="text-red-500 cursor-pointer" title="Delete" />
                      <FaEdit onClick={() => handleEdit(answer.$id, "New text here")} className="text-blue-500 cursor-pointer" title="Edit" />
                    </div>
                  )}
                  <FaReply onClick={() => handleReply(question.$id, "Reply text here", answer.$id)} className="text-green-500 cursor-pointer" title="Reply" />
                </SignedIn>
                <div>
                  {answers.filter(a => a.parentID === answer.$id && a.answerText !== null).map(reply => (
                    <div key={reply.$id} className="ml-5 mt-3">
                      <p className="mb-1">{reply.answerText}</p>
                      <SignedIn>
                        {user?.id === reply.userID && (
                          <div className="flex space-x-3">
                            <FaTrashAlt onClick={() => handleDelete(reply.$id, import.meta.env.VITE_APP_APPWRITE_ANSWERS_COLLECTION_ID!)} className="text-red-500 cursor-pointer" title="Delete" />
                            <FaEdit onClick={() => handleEdit(reply.$id, "New reply text here")} className="text-blue-500 cursor-pointer" title="Edit" />
                          </div>
                        )}
                        <FaReply onClick={() => handleReply(question.$id, "Nested reply text here", reply.$id)} className="text-green-500 cursor-pointer" title="Reply" />
                      </SignedIn>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionsPanel;
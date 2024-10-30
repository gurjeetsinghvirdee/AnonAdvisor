import React, { useState, useEffect } from 'react';
import { SignedIn, useUser } from '@clerk/clerk-react';
import { FaReply, FaEdit } from 'react-icons/fa';
import { Questions, Answers } from './App';

interface Props {
  questions: Questions[];
  postAnswer: (questionID: string, answerText: string) => Promise<void>;
  answers: Answers[];
  editResponse: (documentID: string, updatedText: string) => Promise<void>;
  postCommentReply: (questionID: string, answerText: string, parentID: string) => Promise<void>;
}

const QuestionsPanel: React.FC<Props> = ({ questions, postAnswer, answers, editResponse, postCommentReply }) => {
  const { user } = useUser();
  const [replyText, setReplyText] = useState('');
  const [activeReply, setActiveReply] = useState<string | null>(null);

  useEffect(() => {
    console.log('Answers:', answers);
  }, [answers]);

  const handleEdit = async (id: string, newText: string) => {
    await editResponse(id, newText);
  };

  const handleReply = async (questionID: string, answerText: string, parentID: string) => {
    await postCommentReply(questionID, answerText, parentID);
    setReplyText('');
    setActiveReply(null);
  };

  const renderReplies = (parentID: string) => {
    return answers.filter(a => a.parentID === parentID && a.answerText !== null).map(reply => (
      <div key={reply.$id} className="ml-5 mt-3 border-l-2 border-gray-200 pl-3">
        <p className="mb-1 text-gray-600">{reply.answerText}</p>
        <SignedIn>
          {user?.id === reply.userID && (
            <div className="flex space-x-3 mb-2">
              <FaEdit onClick={() => handleEdit(reply.$id, "New reply text here")} className="text-blue-500 cursor-pointer" title="Edit" />
            </div>
          )}
          <FaReply onClick={() => setActiveReply(reply.$id)} className="text-green-500 cursor-pointer" title="Reply" />
          {activeReply === reply.$id && (
            <div className="mt-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="border border-gray-300 rounded p-2 w-full"
                placeholder="Type your reply here..."
              />
              <button
                onClick={() => handleReply(reply.questionID, replyText, reply.$id)}
                className="mt-1 bg-blue-500 text-white rounded px-3 py-1"
              >
                Submit
              </button>
            </div>
          )}
        </SignedIn>
        <div>{renderReplies(reply.$id)}</div>
      </div>
    ));
  };

  return (
    <div className="space-y-4 container mx-auto p-4">
      {questions.filter(q => q.questionText !== null).map(question => (
        <div key={question.$id} className="border border-gray-300 p-4 rounded-lg bg-white shadow-md">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">{question.questionText}</h3>
            <SignedIn>
              {user?.id === question.userID && (
                <div className="flex space-x-3">
                  <FaEdit onClick={() => handleEdit(question.$id, "New text here")} className="text-blue-500 cursor-pointer" title="Edit" />
                </div>
              )}
            </SignedIn>
          </div>
          <div>
            {answers.filter(a => a.questionID === question.$id && !a.parentID && a.answerText !== null).map(answer => (
              <div key={answer.$id} className="ml-5 mb-3">
                <p className="mb-1 text-gray-700">{answer.answerText}</p>
                <SignedIn>
                  {user?.id === answer.userID && (
                    <div className="flex space-x-3 mb-2">
                      <FaEdit onClick={() => handleEdit(answer.$id, "New text here")} className="text-blue-500 cursor-pointer" title="Edit" />
                    </div>
                  )}
                  <FaReply onClick={() => setActiveReply(answer.$id)} className="text-green-500 cursor-pointer" title="Reply" />
                  {activeReply === answer.$id && (
                    <div className="mt-2">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                        placeholder="Type your reply here..."
                      />
                      <button
                        onClick={() => handleReply(answer.questionID, replyText, answer.$id)}
                        className="mt-1 bg-blue-500 text-white rounded px-3 py-1"
                      >
                        Submit
                      </button>
                    </div>
                  )}
                </SignedIn>
                <div className="pl-5">{renderReplies(answer.$id)}</div>
              </div>
            ))}
          </div>
          <SignedIn>
            <FaReply onClick={() => setActiveReply(question.$id)} className="text-green-500 cursor-pointer" title="Reply" />
            {activeReply === question.$id && (
              <div className="mt-2">
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="border border-gray-300 rounded p-2 w-full"
                  placeholder="Type your reply here..."
                />
                <button
                  onClick={() => handleReply(question.$id, replyText, question.$id)}
                  className="mt-1 bg-blue-500 text-white rounded px-3 py-1"
                >
                  Submit
                </button>
              </div>
            )}
          </SignedIn>
        </div>
      ))}
    </div>
  );
}

export default QuestionsPanel;
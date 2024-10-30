import React, { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { databases } from '../appwrite';

const PostQuestionComponent = () => {
  const { isLoaded, isSignedIn, user } = useUser(); // Call the hook here

  const postQuestion = async (questionText: string, parentID?: string) => {
    if (!isLoaded || !isSignedIn || !user || !user.id) {
      console.log('User is not fully loaded, not signed in, or user ID is missing.');
      return;
    }

    try {
      const response = await databases.createDocument(
        import.meta.env.VITE_APP_APPWRITE_DATABASE_ID!,
        import.meta.env.VITE_APP_APPWRITE_QUESTIONS_COLLECTION_ID!,
        'unique()',
        {
          questionText,
          parentID: parentID || null,
          userID: user.id
        }
      );
      console.log('Question created:', response);
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };

  useEffect(() => {
    postQuestion("Example question");
  }, [isLoaded, isSignedIn, user]);

  return <div>Post Question Component</div>;
};

export default PostQuestionComponent;
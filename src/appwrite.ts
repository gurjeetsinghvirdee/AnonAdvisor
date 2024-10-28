import { Databases, Client } from 'appwrite';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APP_APPWRITE_ENDPOINT!) // Your Appwrite endpoint
  .setProject(import.meta.env.VITE_APP_APPWRITE_PROJECT_ID!); // Your Appwrite project ID

const databases = new Databases(client);

const QUESTIONS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_QUESTIONS_COLLECTION_ID!;
const ANSWERS_COLLECTION_ID = import.meta.env.VITE_APP_APPWRITE_ANSWERS_COLLECTION_ID!;

export { client, databases, QUESTIONS_COLLECTION_ID, ANSWERS_COLLECTION_ID };
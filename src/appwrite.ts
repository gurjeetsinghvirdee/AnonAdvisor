import { Databases, Client } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT!) // Your Appwrite endpoint
  .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID!); // Your Appwrite project ID

const databases = new Databases(client);

const QUESTIONS_COLLECTION_ID = process.env.REACT_APPWRITE_QUESTIONS_COLLECTION_ID!;
const ANSWERS_COLLECTION_ID = process.env.REACT_APP_APPWRITE_ANSWERS_COLLECTION_ID!;

export { client, databases, QUESTIONS_COLLECTION_ID, ANSWERS_COLLECTION_ID };
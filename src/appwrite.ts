import { Databases, Client } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT!) // Your Appwrite endpoint
  .setProject(process.env.APPWRITE_PROJECT_ID!); // Your Appwrite project ID

const databases = new Databases(client);

export { client, databases };
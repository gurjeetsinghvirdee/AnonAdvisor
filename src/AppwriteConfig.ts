import { Client, Databases } from 'appwrite';

const client = new Client();

client
    .setEndpoint(process.env.APPWRITE_ENDPOINT!) // Your API Endpoint
    .setProject(process.env.APPWRITE_PROJECT_ID!) // Your project ID

const databases = new Databases(client);

export { client, databases };
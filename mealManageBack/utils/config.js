// config.js
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export default {
  spreadsheetId: process.env.SPREADSHEET_ID,
  clientEmail: process.env.CLIENT_EMAIL,
  privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
};

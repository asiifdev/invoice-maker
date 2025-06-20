import dotenv from 'dotenv';

// Load environment variables first, before any other imports
dotenv.config();

import express from 'express';
import cors from 'cors';
import { routes } from './routes';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
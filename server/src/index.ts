import dotenv from 'dotenv';
dotenv.config();

import { app } from './app';
import { ensureDatabaseConstraints } from './lib/prisma';

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  try {
    await ensureDatabaseConstraints();
    app.listen(PORT, () => {
      console.log(`Art Studio Backend running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();

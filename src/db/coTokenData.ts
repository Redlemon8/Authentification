import { createClient } from 'redis';
import logger from '../utils/logger';
import { ValidationError } from '../utils/error';

const client = createClient({
  username: process.env.REDIS_USERNAME as string,
  password: process.env.REDIS_PASSWORD as string,
  socket: {
    host: process.env.REDIS_HOST as string,
    port: parseInt(process.env.REDIS_PORT as string),
    reconnectStrategy: (retries: number) => {
      if (retries > 5) {
        logger.error('Trop de tentatives de reconnexion à Redis');
        return new Error('Trop de tentatives de reconnexion à Redis');
      }
      return Math.min(retries * 500, 2000);
    },
  },
});

const connectRedis = async (): Promise<void> => {
  try {
    await client.connect();
    logger.info('Redis connected');
    return;
  } catch (err) {
    logger.error('Redis Client Error', err);
    throw new ValidationError('Failed to connect to Redis');
  }
};

export default {client, connectRedis};

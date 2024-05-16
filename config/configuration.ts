import { config } from 'dotenv';

const env = process.env.NODE_ENV || false;
if (!env) process.exit(100);

config({ path: `bin/.env.${env}` });

export const APP_CONFIG = {
  port: parseInt(process.env.PORT, 10),
  userName: process.env.USER_NAME,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  db_port: parseInt(process.env.DB_PORT, 10),
  postgres: process.env.POSTGRES,
  mongo_url: process.env.MONGO_URL,
  secret: process.env.JWT_SECRET,
  expires: process.env.JWT_EXPIRATION,
  kafka_topic_producer: process.env.KAFKA_TOPIC_PRODUCER,
};

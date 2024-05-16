import { APP_CONFIG } from 'config/configuration';
export const KAFKA_CONFIG = {
  TOPICS: {
    KAFKA_EVENTS: {
      topic: APP_CONFIG.kafka_topic_producer,
      numPartitions: 3,
      replicationFactor: 1,
    },
  },
};
export const Config = {
  KAFKA_HOST_1: 'localhost',
  KAFKA_PORT_1: 9092,
};

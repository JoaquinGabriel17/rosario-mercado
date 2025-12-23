import { Queue } from "bullmq";
import { redisConnection } from "../lib/redis";

export const orderExpirationQueue = new Queue("order-expiration", {
  connection: redisConnection,
});

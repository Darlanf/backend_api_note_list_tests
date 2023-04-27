import { redisEnv } from "../../app/env/redis.env";

export const redisConfig = {
  host: redisEnv.host,
  username: redisEnv.username,
  port: Number(redisEnv.port),
  password: redisEnv.password,
};

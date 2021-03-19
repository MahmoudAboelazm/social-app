import "reflect-metadata";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { Hello } from "./resolvers/hello";
import { PostResolver } from "./resolvers/postResolver";
import UserResolver from "./resolvers/userResolver";
import cors from "cors";

import Redis from "ioredis";
import session from "express-session";
import connectRedis from "connect-redis";
import { __prod__ } from "./constants";
import { createConnection } from "typeorm";
import { Post } from "./entities/Post";
import { User } from "./entities/User";
import { Updoot } from "./entities/Updoot";

const main = async () => {
  const conn = await createConnection({
    type: "postgres",
    database: "postgres",
    username: "postgres",
    password: "123",

    logging: true,
    synchronize: true,
    entities: [Post, User, Updoot],
  });

  const app = express();
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    }),
  );
  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    session({
      name: "qid",
      store: new RedisStore({ client: redis as any, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: "lax",
        secure: __prod__,
      },
      saveUninitialized: false,
      secret: "akhfdjdfafda",
      resave: false,
    }),
  );

  const applloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [Hello, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res, redis }),
  });
  //
  applloServer.applyMiddleware({
    app,
    cors: false,
  });
  app.listen(4000, () => {
    console.log("you are on port 4000");
  });
};

main().catch((err) => {
  console.error(err);
});

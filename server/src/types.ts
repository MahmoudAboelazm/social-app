import { Request, Response } from "express";
import { Session, SessionData } from "express-session";
import { Redis } from "ioredis";
import { createUpdootLoader, createUserLoader } from "./utils/createLoaders";

export type MyContext = {
  req: Request & {
    session: Session & Partial<SessionData> & { userId?: any };
  };
  redis: Redis;
  res: Response;
  userLoader: ReturnType<typeof createUserLoader>;
  updootLoader: ReturnType<typeof createUpdootLoader>;
};

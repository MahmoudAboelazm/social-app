import DataLoader from "dataloader";
import { Updoot } from "../entities/Updoot";
import { User } from "../entities/User";

export const createUserLoader = () =>
  new DataLoader<number, User>(async (userIds) => {
    const users = await User.findByIds(userIds as number[]);
    const userIdToUser: Record<number, User> = {};

    users.forEach((u) => {
      userIdToUser[u.id] = u;
    });

    return userIds.map((userid) => userIdToUser[userid]);
  });

export const createUpdootLoader = () =>
  new DataLoader<{ postId: number; userId: number }, Updoot | null>(
    async (updootKeys) => {
      const updoots = await Updoot.findByIds(updootKeys as any);
      const updootIdsToUpdoot: Record<string, Updoot> = {};

      updoots.forEach((updoot) => {
        updootIdsToUpdoot[`${updoot.postId}|${updoot.userId}`] = updoot;
      });

      return updootKeys.map(
        (updoot) => updootIdsToUpdoot[`${updoot.postId}|${updoot.userId}`],
      );
    },
  );

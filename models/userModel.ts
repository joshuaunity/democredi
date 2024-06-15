import { v4 as uuidv4 } from "uuid";
import db from "../config/database";

export enum AccountType {
  Lender = "lender",
  Borrower = "borrower",
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  pin: string;
  archived: boolean;
  accountType: AccountType;
  createdAt?: Date;
  updatedAt?: Date;
}

export const createUser = async (
  user: Partial<User>
): Promise<User | Error> => {
  const now = new Date();
  const id = uuidv4();
  if (!user.email) {
    return new Error("Email is required");
  }
  // check if user with email already exists
  const existingUser = await getUserByEmail(user.email);
  if (existingUser instanceof Error) {
    // user does not exist, proceed
  } else if (existingUser.email === user.email) {
    return new Error("User with email already exists");
  }

  await db("users").insert({
    id,
    ...user,
    createdAt: now,
    updatedAt: now,
  });

  const userRecord = await getUserById(id);
  if (!userRecord) {
    return new Error("Failed to create user");
  }

  return userRecord;
};

export const updateUser = async (
  id: string,
  updates: Partial<User>
): Promise<User | Error> => {
  updates.updatedAt = new Date();
  await db<User>("users").where({ id }).update(updates);
  const userRecord = await getUserById(id.toString());
  if (!userRecord) {
    return new Error("Failed to update user");
  }
  return userRecord;
};

export const getUserById = async (id: string): Promise<User | Error> => {
  const userRecord = await db<User>("users")
    .where({ id })
    .where("archived", false)
    .first();
  if (!userRecord) {
    return new Error("User not found");
  }
  return userRecord;
};

export const getUserByEmail = async (email: string): Promise<User | Error> => {
  const userRecord = await db<User>("users").where({ email }).first();
  if (!userRecord) {
    return new Error("User not found");
  }

  return userRecord;
};

export const archiveUser = async (id: string): Promise<void | Error> => {
  await db("users").where({ id }).update({ archived: true });
  const userRecord = await getUserById(id.toString());
  if (userRecord instanceof Error) {
    return new Error("Failed to archive user");
  } else if (userRecord.archived) {
    return new Error("Failed to archive user");
  }
};

export const allUsers = async (): Promise<User[]> => {
  return db<User>("users").where("archived", false);
};

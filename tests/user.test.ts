import {
    User,
    AccountType,
    createUser,
    getUserById,
    getUserByEmail,
    updateUser,
    archiveUser,
    allUsers,
} from "../models/userModel";
import db from "../config/database";
import { v4 as uuidv4 } from "uuid";

// Ensure the database is cleaned before and after each test
beforeEach(async () => {
    await db("users").del();
});

afterAll(async () => {
    await db.destroy();
});

describe("User Model", () => {
    test("should create a new user", async () => {
        const newUser: Partial<User> = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            pin: "password123",
            accountType: AccountType.Lender,
        };

        const createdUser = await createUser(newUser);

        if (createdUser instanceof Error) {
            throw createdUser;
        }

        expect(createdUser).toHaveProperty("id");
        expect(createdUser.firstName).toBe(newUser.firstName);
        expect(createdUser.lastName).toBe(newUser.lastName);
        expect(createdUser.email).toBe(newUser.email);
        expect(createdUser.accountType).toBe(newUser.accountType);
    });

    test("should update an existing user", async () => {
        const newUser: Partial<User> = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            pin: "password123",
            accountType: AccountType.Lender,
        };

        const createdUser = await createUser(newUser);
        if (createdUser instanceof Error) {
            throw createdUser;
        }

        const updates: Partial<User> = {
            firstName: "Johnny",
            lastName: "Doe",
            email: "johnathan@email.com",
        };

        const updatedUser = await updateUser(createdUser.id, updates);

        if (updatedUser instanceof Error) {
            throw updatedUser;
        }

        expect(updatedUser).toHaveProperty("id");
        expect(updatedUser.firstName).toBe(updates.firstName);
        expect(updatedUser.lastName).toBe(updates.lastName);
        expect(updatedUser.email).toBe(updates.email);
    });

    test("should get a user by id", async () => {
        const newUser: Partial<User> = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            pin: "password123",
            accountType: AccountType.Lender,
        };

        const createdUser = await createUser(newUser);
        if (createdUser instanceof Error) {
            throw createdUser;
        }

        const user = await getUserById(createdUser.id);

        if (user instanceof Error) {
            throw user;
        }

        expect(user).toHaveProperty("id");
        expect(user.id).toBe(createdUser.id);
        expect(user.firstName).toBe(newUser.firstName);
        expect(user.lastName).toBe(newUser.lastName);
        expect(user.email).toBe(newUser.email);
        expect(user.accountType).toBe(newUser.accountType);
    });

    test("should get a user by email", async () => {
        const newUser: Partial<User> = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            pin: "password123",
            accountType: AccountType.Lender,
        };

        const createdUser = await createUser(newUser);
        if (createdUser instanceof Error) {
            throw createdUser;
        }

        const user = await getUserByEmail(createdUser.email);

        if (user instanceof Error) {
            throw user;
        }

        expect(user).toHaveProperty("id");
        expect(user.id).toBe(createdUser.id);
        expect(user.firstName).toBe(newUser.firstName);
        expect(user.lastName).toBe(newUser.lastName);
        expect(user.email).toBe(newUser.email);
        expect(user.accountType).toBe(newUser.accountType);
    });

    test("should archive a user", async () => {
        const newUser: Partial<User> = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            pin: "password123",
            accountType: AccountType.Lender,
        };

        const createdUser = await createUser(newUser);
        if (createdUser instanceof Error) {
            throw createdUser;
        }

        const validArchive = await archiveUser(createdUser.id);
        if (validArchive instanceof Error) {
            throw validArchive;
        }

        const archivedUser = await getUserById(createdUser.id);

        if (archivedUser instanceof Error) {
            throw archivedUser;
        }

        expect(archivedUser).toHaveProperty("id");
        expect(archivedUser.archived).toBe(1);
    });

    test("should get all users", async () => {
        const newUser1: Partial<User> = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            pin: "password123",
            accountType: AccountType.Lender,
        };

        const newUser2: Partial<User> = {
            firstName: "Jane",
            lastName: "Doe",
            email: "janey67@email.com",
            pin: "password123",
            accountType: AccountType.Borrower,
        };

        await createUser(newUser1);
        await createUser(newUser2);

        const users = await allUsers();

        expect(users).toHaveLength(2);
    });
});

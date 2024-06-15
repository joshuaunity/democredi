import { Request, Response } from "express";
import bcrypt from "bcrypt";
import {
    createUser,
    updateUser,
    getUserById,
    getUserByEmail,
    archiveUser,
    allUsers,
    User,
    AccountType,
} from "../models/userModel";
import { validateFields, pinValidator, karmaCheck } from "../utils/helpers";

// Create a new user
export const createUserHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { firstName, lastName, email, pin, accountType } = req.body;
        const requiredFields = ['firstName', 'lastName', 'email', 'pin', 'accountType'];
        const missingFields = validateFields(req.body, requiredFields);

        if (missingFields.length > 0) {
            res.status(400).json({ error: `Missing or empty fields: ${missingFields.join(', ')}` });
            return;
        } else {
            // check karma level
            const karma = karmaCheck(email);
            if (!karma) {
                res.status(400).json({ error: 'User isnt eligible to use this service.' });
                return;
            }

            // checkif user with email already exists
            const existingUser = await getUserByEmail(email);
            if (existingUser instanceof Error) {
                // user does not exist, proceed
            } else if (existingUser.email === email) {
                res.status(400).json({ error: 'User with email already exists' });
                return;
            }

            // check if account type is valid
            const accountTypes = Object.values(AccountType);
            if (!accountTypes.includes(accountType.toLowerCase())) {
                res.status(400).json({ error: 'Invalid account type' });
                return;
            }

            // validate pin
            if (!pinValidator(pin)) {
                res.status(400).json({ error: 'Pin must be a 4-digit number' });
                return;
            }

            const hashedPassword = await bcrypt.hash(pin, 10);
            const userData: Partial<User> = {
                firstName,
                lastName,
                email,
                pin: hashedPassword,
                accountType: accountType.toLowerCase(),
            };
            const newUser: User | Error = await createUser(userData);
            if (newUser instanceof Error) {
                res.status(400).json({ error: newUser.message });
                return;
            }
            res.status(201).json(newUser);
            return;
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// All users
export const allUsersHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const users: User[] = await allUsers();
        res.status(200).json(users);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Update an existing user
export const updateUserHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userID = req.body.user.id
        const { firstName, lastName } = req.body;
        let updatedOwnerData: Partial<User> = {};
        if (firstName) updatedOwnerData.firstName = firstName;
        if (lastName) updatedOwnerData.lastName = lastName;
        if (Object.keys(updatedOwnerData).length === 0) {
            res.status(400).json({ error: 'Missing fields to update' });
            return;
        }   

        const user = await updateUser(userID, updatedOwnerData);
        res.status(200).json(user);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Get a user by ID
export const getUserDetailHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userID = req.body.user.id
        const user = await getUserById(userID);
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

// Archive a user
export const archiveUserHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userID = req.body.user.id
        await archiveUser(userID);
        res.status(200).json({ message: "User archived successfully" });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

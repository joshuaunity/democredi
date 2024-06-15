import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import config from "../config/config";
import { getUserByEmail, User } from "../models/userModel";

export const loginHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, pin } = req.body;
        if (!email || !pin) {
            res.status(400).json({ error: "Email and pin are required" });
            return;
        }

        const user = await getUserByEmail(email);
        if (user instanceof Error) {
            res.status(404).json({ error: user.message });
            return;
        }

        const ispinValid = await bcrypt.compare(pin, user.pin);
        if (!ispinValid) {
            res.status(401).json({ error: "Invalid pin" });
            return;
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            config.jwt.secret,
            { expiresIn: config.jwt.expiresIn }
        );
        res.status(200).json({ token });
        return;
    } catch (error: any) {
        res.status(500).json({ error: error.message });
        return;
    }
};

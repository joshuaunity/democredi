import { Request, Response } from "express";
import { Wallet, createWallet, getWalletByUserId, deposit, transfer } from "../models/walletModel";
import { getKycByUserId } from "../models/kycModel";

// Create a new wallet
export const createWalletHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        // check if user already has a wallet
        const existingWallet = await getWalletByUserId(req.body.user.id);
        if (!(existingWallet instanceof Error)) {
            res.status(400).json({ error: "User already has a wallet" });
            return;
        }

        // check if user has an approved kyc
        const kyc = await getKycByUserId(req.body.user.id);
        if (kyc instanceof Error) {
            res.status(400).json({ error: "User has no approved KYC" });
            return;
        }

        if (!kyc.approved) {
            res.status(400).json({ error: "User has no approved KYC" });
            return;
        }

        const wallet: Partial<Wallet> = {
            userId: req.body.user.id,
        };

        const newWallet = await createWallet(wallet);
        if (newWallet instanceof Error) {
            res.status(400).json({ error: newWallet.message });
            return;
        }

        res.status(201).json(newWallet);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};


// Get wallet details
export const getWalletHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const wallet = await getWalletByUserId(req.body.user.id);
        if (wallet instanceof Error) {
            res.status(404).json({ error: wallet.message });
            return;
        }

        res.status(200).json(wallet);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};


// Deposit money into wallet
export const depositHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const amount = req.body.amount;
        if (!amount || amount <= 0) {
            res.status(400).json({ error: "Invalid amount" });
            return;
        }

        const narration = "Account funding";
        const wallet = await deposit(req.body.user.id, amount, narration);
        if (wallet instanceof Error) {
            res.status(400).json({ error: wallet.message });
            return;
        }

        res.status(200).json(wallet);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};


// Transfer money from one wallet to another
export const transferHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { amount, recipientId, narration } = req.body;

        if (!amount || amount <= 0) {
            res.status(400).json({ error: "Invalid amount" });
            return;
        }

        // check if recipient is the same as sender
        if (recipientId === req.body.user.id) {
            res.status(400).json({ error: "Cannot transfer to self" });
            return;
        }

        // check if recipient has a wallet
        const recipientWallet = await getWalletByUserId(recipientId);
        if (recipientWallet instanceof Error) {
            res.status(400).json({ error: "Recipient has no wallet" });
            return;
        }

        // check if user has enough balance
        const senderWallet = await getWalletByUserId(req.body.user.id);
        if (senderWallet instanceof Error) {
            res.status(400).json({ error: "User has no wallet" });
            return;
        }

        if (senderWallet.balance < amount) {
            res.status(400).json({ error: "Insufficient balance" });
            return;
        }

        const newNarration = narration || "Transfer to " + recipientWallet.number;
        const wallet = await transfer(req.body.user.id, recipientId, amount, newNarration);
        if (wallet instanceof Error) {
            res.status(400).json({ error: wallet.message });
            return;
        }

        res.status(200).json(wallet);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
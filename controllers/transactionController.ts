import { Request, Response } from "express";
import { getTransactionById, getTransactionsByWalletId } from "../models/transactionModel";
import { getWalletByUserId } from "../models/walletModel";


// Get all wallet transactions
export const getTransactionsHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        // get user wallet
        const wallet = await getWalletByUserId(req.body.user.id);
        if (wallet instanceof Error) {
            res.status(404).json({ error: wallet.message });
            return;
        }

        if (!wallet.id) {
            res.status(404).json({ error: "Wallet not found" });
            return;
        }

        // get wallet transactions
        const transactions = await getTransactionsByWalletId(wallet.id);
        if (transactions instanceof Error) {
            res.status(404).json({ error: transactions.message });
            return;
        }

        res.status(200).json(transactions);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Get a transaction details
export const getTransactionHandler = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const transaction = await getTransactionById(id);
        if (transaction instanceof Error) {
            res.status(400).json({ error: transaction.message });
            return;
        }
        res.status(200).json(transaction);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};
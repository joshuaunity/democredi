import { v4 as uuidv4 } from 'uuid';
import { Knex } from "knex";
import db from "../config/database";

export enum TransactionType {
    Credit = "credit",
    Debit = "debit",
}
export interface Transaction {
    id?: string;
    walletId?: string;
    amount: number;
    type: TransactionType;
    narration: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export const createTransaction = async (
    trx: Knex.Transaction,
    narration: string,
    transaction: Partial<Transaction>
): Promise<Transaction | Error> => {
    try {
        const transactionId = uuidv4();
        await trx("transactions").insert({
            id: transactionId,
            narration,
            ...transaction
        });
        const transactionRecord = await trx<Transaction>("transactions")
            .where({ id: transactionId })
            .first();
        if (!transactionRecord) {
            throw new Error("Failed to create transaction");
        }
        return transactionRecord;
    } catch (error: any) {
        throw new Error(error.message || "Failed to create transaction");
    }
};

export const allTransactions = async (): Promise<Transaction[]> => {
    return await db<Transaction>("transactions").select();
};

export const getTransactionById = async (id: string): Promise<Transaction | Error> => {
    const transactionRecord = await db<Transaction>("transactions").where({ id }).first();
    if (!transactionRecord) {
        return new Error("Transaction not found");
    }
    return transactionRecord;
}

export const getTransactionsByWalletId = async (walletId: string): Promise<Transaction[] | Error> => {
    const transactionRecords = await db<Transaction>("transactions").where({ walletId });
    if (!transactionRecords) {
        return new Error("Transaction not found");
    }
    return transactionRecords;
}


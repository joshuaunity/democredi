import { v4 as uuidv4 } from "uuid";
import db from "../config/database";
import { accNumGenerator } from "../utils/helpers";
import {
    Transaction,
    TransactionType,
    createTransaction,
} from "./transactionModel";

export interface Wallet {
    id?: string;
    userId?: string;
    balance: number;
    number: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const MAX_ATTEMPTS = 10;

export const createWallet = async (
    wallet: Partial<Wallet>
): Promise<Wallet | Error> => {
    const trx = await db.transaction();
    let acctNumber: string | undefined;
    let attempts = 0;

    try {
        while (attempts < MAX_ATTEMPTS) {
            const acctNumberNew = `${accNumGenerator()}`;
            const existingWallet = await trx<Wallet>("wallets")
                .where({ number: acctNumberNew })
                .first();

            if (!existingWallet) {
                acctNumber = acctNumberNew;
                break;
            }

            attempts++;
        }

        if (!acctNumber) {
            throw new Error("Failed to generate a unique account number");
        }

        const walletId = uuidv4();

        await trx("wallets").insert({
            id: walletId,
            ...wallet,
            number: acctNumber,
        });

        const walletRecord = await trx<Wallet>("wallets")
            .where({ id: walletId })
            .first();
        await trx.commit();

        if (!walletRecord) {
            return new Error("Failed to create wallet");
        }

        return walletRecord;
    } catch (error: any) {
        await trx.rollback();
        return new Error(error.message || "Failed to create wallet");
    }
};

export const allWallets = async (): Promise<Wallet[]> => {
    return await db<Wallet>("wallets").select();
};

export const getWalletById = async (id: string): Promise<Wallet | Error> => {
    const walletRecord = await db<Wallet>("wallets").where({ id }).first();
    if (!walletRecord) {
        return new Error("Wallet not found");
    }
    return walletRecord;
};
export const getWalletByNumber = async (
    number: string
): Promise<Wallet | Error> => {
    const walletRecord = await db<Wallet>("wallets").where({ number }).first();
    if (!walletRecord) {
        return new Error("Wallet not found");
    }
    return walletRecord;
};

export const getWalletByUserId = async (
    userId: string
): Promise<Wallet | Error> => {
    const walletRecord = await db<Wallet>("wallets").where({ userId }).first();
    if (!walletRecord) {
        return new Error("Wallet not found");
    }
    return walletRecord;
};

export const deposit = async (
    userId: string,
    amount: number,
    narration: string
): Promise<Wallet | Error> => {
    const trx = await db.transaction();
    try {
        const wallet = await getWalletByUserId(userId);
        
        if (wallet instanceof Error) {
            await trx.rollback();
            return wallet;
        }

        const newBalance = wallet.balance + amount;
        await trx<Wallet>("wallets")
            .where({ userId })
            .update({ balance: newBalance, updatedAt: new Date() });
        

        // create transaction
        await createTransaction(trx, narration, {
            walletId: wallet.id,
            amount,
            type: TransactionType.Credit,
        });

        await trx.commit();
        return wallet;
    } catch (error) {
        await trx.rollback();
        return new Error("Failed to deposit amount");
    }
};

export const transfer = async (
    fromUserId: string,
    toUserId: string,
    amount: number,
    narration: string
): Promise<Transaction | Error> => {
    const trx = await db.transaction();
    try {
        const fromWallet = await trx<Wallet>("wallets")
            .where({ userId: fromUserId })
            .first();
        const toWallet = await trx<Wallet>("wallets")
            .where({ userId: toUserId })
            .first();

        if (!fromWallet || !toWallet) {
            await trx.rollback();
            return new Error("Wallet not found");
        }

        if (fromWallet.balance < amount) {
            await trx.rollback();
            return new Error("Insufficient balance");
        }

        const newFromBalance = fromWallet.balance - amount;
        const newToBalance = toWallet.balance + amount;

        await trx<Wallet>("wallets")
            .where({ userId: fromUserId })
            .update({ balance: newFromBalance, updatedAt: new Date() });
        await trx<Wallet>("wallets")
            .where({ userId: toUserId })
            .update({ balance: newToBalance, updatedAt: new Date() });

        // record transaction from and to wallets
        await createTransaction(trx, narration, {
            walletId: fromWallet.id,
            amount,
            type: TransactionType.Debit,
        });

        const transactinon = await createTransaction(trx, narration, {
            walletId: toWallet.id,
            amount,
            type: TransactionType.Credit,
        });


        // update wallets instance
        fromWallet.balance = newFromBalance;
        toWallet.balance = newToBalance;

        await trx.commit();
        return transactinon;
    } catch (error) {
        await trx.rollback();
        return new Error("Failed to transfer amount");
    }
};

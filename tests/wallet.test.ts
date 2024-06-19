import { Wallet, createWallet, getWalletByUserId, deposit, transfer } from "../models/walletModel";
import {
    User,
    AccountType,
    createUser,
} from "../models/userModel";
import { accNumGenerator } from "../utils/helpers";
import db from "../config/database";

// Ensure the database is cleaned before and after each test
beforeEach(async () => {
    await db("wallets").del();
    await db("users").del();
});

afterAll(async () => {
    await db.destroy();
});


describe("Wallet Model", () => {
    test("should create a new wallet", async () => {
        const user: Partial<User> = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            pin: "6788",
            accountType: AccountType.Lender,
        };

        const createdUser = await createUser(user);

        if (createdUser instanceof Error) {
            throw createdUser;
        }

        const wallet: Partial<Wallet> = {
            userId: createdUser.id,
        };

        const createdWallet = await createWallet(wallet);

        if (createdWallet instanceof Error) {
            throw createdWallet;
        }

        expect(createdWallet).toHaveProperty("id");
        expect(createdWallet.userId).toBe(wallet.userId);
        expect(createdWallet.balance).toBe("0.00");
        expect(createdWallet.number).toBeDefined();
    });

});

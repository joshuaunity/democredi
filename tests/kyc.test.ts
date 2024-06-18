import {
    Kyc,
    createKyc,
    allKycs,
    getKycById,
    updateKyc,
    deleteKyc,
    getKycByUserId,
} from "../models/kycModel";
import {
    User,
    AccountType,
    createUser,
} from "../models/userModel";
import db from "../config/database";

// Ensure the database is cleaned before and after each test
beforeEach(async () => {
    await db("kycs").del();
    await db("users").del();
});

afterAll(async () => {
    await db.destroy();
});

describe("Kyc Model", () => {
    test("should create a new kyc record", async () => {
        const user: Partial<User> = {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            pin: "password123",
            accountType: AccountType.Lender,
        };

        const createdUser = await createUser(user);

        if (createdUser instanceof Error) {
            throw createdUser;
        }

        const kyc: Partial<Kyc> = {
            userId: createdUser.id,
            phone: "08012345678",
            nubanNumber: "1234567890",
            nubanCode: "044",
            bvn: "12345678901",
        };

        const createdKyc = await createKyc(kyc);

        if (createdKyc instanceof Error) {
            throw createdKyc;
        }

        expect(createdKyc).toHaveProperty("id");
        expect(createdKyc.userId).toBe(kyc.userId);
        expect(createdKyc.phone).toBe(kyc.phone);
        expect(createdKyc.nubanNumber).toBe(kyc.nubanNumber);
        expect(createdKyc.nubanCode).toBe(kyc.nubanCode);
        expect(createdKyc.bvn).toBe(kyc.bvn);
    });

    test("should return all kyc records", async () => {
        const kycRecords = await allKycs();
        expect(kycRecords).toBeInstanceOf(Array);
    });

    test("should return a kyc record by ID", async () => {
        const user: Partial<User> = {
            firstName: "Jane",
            lastName: "Doe",
            email: "jane.doe@example.com",
            pin: "password123",
            accountType: AccountType.Borrower,
        };

        const createdUser = await createUser(user);

        if (createdUser instanceof Error) {
            throw createdUser;
        }

        const kyc: Partial<Kyc> = {
            userId: createdUser.id,
            phone: "08087654321",
            nubanNumber: "0987654321",
            nubanCode: "033",
            bvn: "10987654321",
        };

        const createdKyc = await createKyc(kyc);

        if (createdKyc instanceof Error) {
            throw createdKyc;
        }

        if (createdKyc.id === undefined) {
            throw new Error("Failed to create kyc");
        }

        const fetchedKyc = await getKycById(createdKyc.id);

        if (fetchedKyc instanceof Error) {
            throw fetchedKyc;
        }
        expect(fetchedKyc).toHaveProperty("id");
        expect(fetchedKyc?.id).toBe(createdKyc.id);
    });

    test("should update a kyc record", async () => {
        const user: Partial<User> = {
            firstName: "Alice",
            lastName: "Smith",
            email: "alice.smith@example.com",
            pin: "password123",
            accountType: AccountType.Lender,
        };

        const createdUser = await createUser(user);

        if (createdUser instanceof Error) {
            throw createdUser;
        }

        const kyc: Partial<Kyc> = {
            userId: createdUser.id,
            phone: "08011223344",
            nubanNumber: "1122334455",
            nubanCode: "055",
            bvn: "11223344556",
        };

        const createdKyc = await createKyc(kyc);

        if (createdKyc instanceof Error) {
            throw createdKyc;
        }

        const updates = {
            phone: "08099887766",
            nubanNumber: "5566778899",
            nubanCode: "066",
        };


        if (createdKyc.id === undefined) {
            throw new Error("Failed to create kyc");
        }

        const updatedKyc = await updateKyc(createdKyc.id, updates);
        if (updatedKyc instanceof Error) {
            throw updatedKyc;
        }
        expect(updatedKyc).toHaveProperty("id");
        expect(updatedKyc?.phone).toBe(updates.phone);
        expect(updatedKyc?.nubanNumber).toBe(updates.nubanNumber);
        expect(updatedKyc?.nubanCode).toBe(updates.nubanCode);
    });

    test("should delete a kyc record", async () => {
        const user: Partial<User> = {
            firstName: "Bob",
            lastName: "Brown",
            email: "bob.brown@example.com",
            pin: "password123",
            accountType: AccountType.Borrower,
        };

        const createdUser = await createUser(user);

        if (createdUser instanceof Error) {
            throw createdUser;
        }

        const kyc: Partial<Kyc> = {
            userId: createdUser.id,
            phone: "08099887766",
            nubanNumber: "5566778899",
            nubanCode: "066",
            bvn: "22334455667",
        };

        const createdKyc = await createKyc(kyc);

        if (createdKyc instanceof Error) {
            throw createdKyc;
        }

        if (createdKyc.id === undefined) {
            throw new Error("Failed to create kyc");
        }

        await deleteKyc(createdKyc.id);

        const fetchedKyc = await getKycById(createdKyc.id);
        expect(fetchedKyc).toBeInstanceOf(Error);
    });

    test("should return a kyc record by user ID", async () => {
        const user: Partial<User> = {
            firstName: "Charlie",
            lastName: "Black",
            email: "charlie.black@example.com",
            pin: "password123",
            accountType: AccountType.Lender,
        };

        const createdUser = await createUser(user);

        if (createdUser instanceof Error) {
            throw createdUser;
        }

        const kyc: Partial<Kyc> = {
            userId: createdUser.id,
            phone: "08112233445",
            nubanNumber: "6677889900",
            nubanCode: "077",
            bvn: "33445566778",
        };

        const createdKyc = await createKyc(kyc);

        if (createdKyc instanceof Error) {
            throw createdKyc;
        }

        const fetchedKyc = await getKycByUserId(createdUser.id);
        if (fetchedKyc instanceof Error) {
            throw fetchedKyc;
        }
        expect(fetchedKyc).toHaveProperty("id");
        expect(fetchedKyc?.userId).toBe(createdUser.id);
    });
});

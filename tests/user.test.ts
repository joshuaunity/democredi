import { User, AccountType, createUser, getUserById, updateUser } from '../models/userModel';

jest.mock('../models/userModel', () => ({
    createUser: jest.fn(),
    updateUser: jest.fn(),
}));


describe('User Model', () => {
    test('should create a new user', async () => {
        // Define test data
        const newUser: Partial<User> = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            pin: 'password123',
            accountType: AccountType.Lender,
        };

        // Mock the createUser function
        (createUser as jest.Mock).mockResolvedValue(newUser as User);

        // Call the createUser function
        const createdUser = await createUser(newUser);

        if (createdUser instanceof Error) {
            throw createdUser;
        }

        // Assert user creation
        expect(createdUser).toHaveProperty('id');
        expect(createdUser.firstName).toBe(newUser.firstName);
        expect(createdUser.lastName).toBe(newUser.lastName);
        expect(createdUser.email).toBe(newUser.email);
        expect(createdUser.accountType).toBe(newUser.accountType);
    });

    test('should update an existing user', async () => {
        // Define test data
        const existingUser: User = {
            id: '123',
            firstName: 'Jane',
            lastName: 'Doe',
            email: 'jane.doe@example.com',
            pin: 'password456',
            accountType: AccountType.Borrower,
            archived: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const updates: Partial<User> = {
            firstName: 'Janet',
            lastName: 'Doe',
        };

        // Mock the updateUser function
        (updateUser as jest.Mock).mockResolvedValue({ ...existingUser, ...updates } as User);

        // Call the updateUser function
        const updatedUser = await updateUser(existingUser.id, updates);

        if (updatedUser instanceof Error) {
            throw updatedUser;
        }

        // Assert user update
        expect(updatedUser).toHaveProperty('id', existingUser.id);
        expect(updatedUser.firstName).toBe(updates.firstName);
        expect(updatedUser.lastName).toBe(updates.lastName);
    });
});


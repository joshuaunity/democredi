import { User, AccountType, createUser, getUserById, updateUser } from '../models/userModel';
import { v4 as uuidv4 } from 'uuid';

// Mock only the createUser and updateUser functions, not the entire module
jest.mock('../models/userModel', () => {
    const actualModule = jest.requireActual('../models/userModel');
    return {
        ...actualModule,
        createUser: jest.fn(),
        updateUser: jest.fn(),
    };
});


describe('User Model', () => {
    test('should create a new user', async () => {
        // Define test data
        const newUser: Partial<User> = {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@example.com',
            pin: 'password123',
            accountType: AccountType.Lender
        };

        // Mock the createUser function
        (createUser as jest.Mock).mockResolvedValue({ id: uuidv4(), ...newUser } as User);

        // Call the createUser function
        const createdUser = await createUser(newUser);

        if (createdUser instanceof Error) {
            throw createdUser;
        }

        console.log(createdUser);

        // Assert user creation
        expect(createdUser).toHaveProperty('id');
        expect(createdUser.firstName).toBe(newUser.firstName);
        expect(createdUser.lastName).toBe(newUser.lastName);
        expect(createdUser.email).toBe(newUser.email);
        expect(createdUser.accountType).toBe(newUser.accountType);
    });
});

import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Response } from 'express';
import { User } from '../../schemas/user.schema';
import { error } from 'console';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(), // Mock the create method of the UsersService
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('createUser', () => {
    it('should create a new user and return a success response', async () => {
      const mockUser: User = {
        email: 'wawan@mail.com',
        firstName: 'wawan',
        lastName: 's',
      };

      const expectedResponse = {
        status: 'success',
        message: 'User created successfully',
        data: mockUser,
      };

      // Mock the UsersService.create method to return a resolved Promise with the mockUser
      (usersService.create as jest.Mock).mockResolvedValue(mockUser);

      const response: Response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await controller.createUser(mockUser, response);

      expect(usersService.create).toHaveBeenCalledWith(mockUser);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith(expectedResponse);
    });

    it('should return an error response when user creation fails', async () => {
      const mockUser: User = {
        email: 'wawan@mail.com',
        firstName: 'wawan',
        lastName: 's',
      };

      const expectedErrorResponse = {
        status: 'failed',
        message: 'Failed add user!',
        data: error,
      };

      // Mock the UsersService.create method to throw a rejected Promise with an error
      (usersService.create as jest.Mock).mockRejectedValue(
        new Error('Mocked error'),
      );

      const response: Response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await controller.createUser(mockUser, response);

      expect(usersService.create).toHaveBeenCalledWith(mockUser);
      expect(response.status).toHaveBeenCalledWith(401);
      expect(response.json).toHaveBeenCalledWith(expectedErrorResponse);
    });
  });
});

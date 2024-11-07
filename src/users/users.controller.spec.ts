import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './DTOs/createUser.dto';
import { ValidateUserDto } from './DTOs/validateUser.dto';
import { User } from './user.entity';
import { Response } from 'express';
import { HttpStatus } from '@nestjs/common';

describe('UserController', () => {
  let userController: UserController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            validateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testUser',
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser: Partial<User> = {
        id: '12345',
        ...createUserDto,
      };
      jest
        .spyOn(usersService, 'createUser')
        .mockResolvedValue(mockUser as User);

      const result = await userController.createUser(createUserDto);
      expect(result).toEqual(mockUser);
      expect(usersService.createUser).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('validateUser', () => {
    it('should validate a user and return a token in the response headers', async () => {
      const validateUserDto: ValidateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockToken = 'mockJwtToken';
      const mockUserId = '12345';
      const mockResponse = {
        header: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as unknown as Response;

      jest.spyOn(usersService, 'validateUser').mockResolvedValue({
        userId: mockUserId,
        token: mockToken,
      });

      await userController.validateUser(validateUserDto, mockResponse);

      expect(usersService.validateUser).toHaveBeenCalledWith(validateUserDto);
      expect(mockResponse.header).toHaveBeenCalledWith(
        'access-token',
        mockToken,
      );
      expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockResponse.json).toHaveBeenCalledWith({ user: mockUserId });
    });
  });
});

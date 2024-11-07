import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CreateUserDto } from './DTOs/createUser.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { ValidateUserDto } from './DTOs/validateUser.dto';
import { Response } from 'express';
import { ApiBody, ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post('register')
  @ApiBody({
    schema: {
      example: {
        email: 'test@test.com',
        password: 'test-pass',
        username: 'test',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been successfully registered.',
    schema: {
      example: {
        id: '1234567890abcdef12345678',
        email: 'test@test.com',
        username: 'test',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid data provided for user registration.',
  })
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  @ApiBody({
    schema: {
      example: {
        email: 'test@test.com',
        password: 'test-pass',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User successfully authenticated.',
    headers: {
      'auth-token': {
        description: 'JWT token for accessing secure routes.',
        schema: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    },
    schema: {
      example: {
        user: '1234567890abcdef12345678',
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Invalid email or password.',
  })
  async validateUser(
    @Body() validateUserDto: ValidateUserDto,
    @Res() res: Response,
  ): Promise<void> {
    const { token, userId } =
      await this.userService.validateUser(validateUserDto);
    res
      .header('auth-token', token)
      .status(HttpStatus.OK)
      .json({ user: userId });
  }
}

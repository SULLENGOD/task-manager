import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CreateUserDto } from './DTOs/createUser.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { ValidateUserDto } from './DTOs/validateUser.dto';
import { Response } from 'express';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }

  @Post('login')
  async validateUser(
    @Body() validateUserDto: ValidateUserDto,
    @Res() res: Response,
  ): Promise<void> {
    const { token, userId } =
      await this.userService.validateUser(validateUserDto);
    res
      .header('access-token', token)
      .status(HttpStatus.OK)
      .json({ user: userId });
  }
}

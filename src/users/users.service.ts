import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './DTOs/createUser.dto';
import { ValidateUserDto } from './DTOs/validateUser.dto';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.username = createUserDto.username;

    const savedUser = this.userRepository.save(user);

    return plainToInstance(User, savedUser);
  }

  async validateUser(
    validateUserDto: ValidateUserDto,
  ): Promise<{ userId: string; token: string }> {
    const { email, password } = validateUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'username', 'email', 'password'],
    });
    if (!user) throw new NotFoundException('The user is not found');

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid)
      throw new NotFoundException('The password is incorrect');

    const payload = { userId: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      userId: user.id,
      token,
    };
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }
}

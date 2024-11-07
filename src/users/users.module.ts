import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserController } from './users.controller';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: 'some-value',
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [UserController],
  providers: [UsersService],
  exports: [JwtModule],
})
export class UsersModule {}

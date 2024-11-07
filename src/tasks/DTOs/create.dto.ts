import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  endDate?: Date;

  @IsOptional()
  @IsEnum(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
  state?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

  @IsString()
  @IsOptional()
  userId: string;
}

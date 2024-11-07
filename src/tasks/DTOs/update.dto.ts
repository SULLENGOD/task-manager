import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  endDate: string;

  @IsEnum(['PENDING', 'IN_PROGRESS', 'COMPLETED'])
  state: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
}

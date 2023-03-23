import { IsOptional, IsPositive, validate } from 'class-validator';

export class PaginationDto {
  @IsPositive()
  @IsOptional()
  limit: number;

  @IsOptional()
  // @IsPositive()
  offset: number;
}

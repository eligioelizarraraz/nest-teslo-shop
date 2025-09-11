import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // Opcional si se pone el enableImplicitConversions: true
  limit?: number;

  @IsOptional()
  @Min(0)
  @Type(() => Number) // Opcional si se pone el enableImplicitConversions: true
  offset?: number;
}

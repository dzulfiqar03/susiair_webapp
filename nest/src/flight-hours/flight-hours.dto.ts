import { IsIn, Matches } from 'class-validator';

export class RangeQueryDto {
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'from must be in YYYY-MM-DD format' })
  from: string;

  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'to must be in YYYY-MM-DD format' })
  to: string;
}

export const RANGE_KEYS = ['1w', '1m', '3m', '6m', '1y'] as const;
export type RangeKey = (typeof RANGE_KEYS)[number];

export class SummaryQueryDto {
  @IsIn(RANGE_KEYS as unknown as string[], {
    message: 'range must be one of: 1w, 1m, 3m, 6m, 1y',
  })
  range: RangeKey;
}

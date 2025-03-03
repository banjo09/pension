import { Contribution, ContributionType } from "./contribution.types";

export interface StatementFilter {
  startDate: string;
  endDate: string;
  contributionTypes?: ContributionType[];
}

export interface Statement {
  id: string;
  userId: string;
  generatedDate: string;
  startDate: string;
  endDate: string;
  contributions: Contribution[];
  totalAmount: number;
  projectedBenefits: {
    lumpSum: number;
    monthlyPension: number;
  };
}
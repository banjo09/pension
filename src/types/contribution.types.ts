export type ContributionType = "mandatory" | "voluntary";
export type ContributionStatus = "pending" | "approved" | "rejected";

export interface Contribution {
  id: string;
  userId: string;
  amount: number;
  date: Date;
  type: ContributionType;
  status: ContributionStatus;
  description?: string;
  employerPortion?: number;
  employeePortion?: number;
  reference?: string;
}

export interface ContributionSummary {
  totalContributions: number;
  mandatoryContributions: number;
  voluntaryContributions: number;
  currentMonthContribution: number;
  lastContributionDate: string;
  contributionGrowth: number; // percentage
}

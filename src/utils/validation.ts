import * as yup from "yup";
import { isBefore, isAfter, isSameMonth, isValid } from "date-fns";
import { ContributionType } from "../types/contribution.types";

// Common validation schemas
export const emailSchema = yup.string()
  .email("Please enter a valid email address")
  .required("Email is required");

export const passwordSchema = yup.string()
  .min(8, "Password must be at least 8 characters")
  .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
  .matches(/[a-z]/, "Password must contain at least one lowercase letter")
  .matches(/[0-9]/, "Password must contain at least one number")
  .matches(/[^A-Za-z0-9]/, "Password must contain at least one special character")
  .required("Password is required");

export const nameSchema = yup.string()
  .min(2, "Name must be at least 2 characters")
  .max(50, "Name must be less than 50 characters")
  .required("Name is required");

export const phoneSchema = yup.string()
  .matches(/^\+?[0-9]{10,15}$/, "Please enter a valid phone number")
  .required("Phone number is required");

// Login form validation schema
export const loginSchema = yup.object({
  email: emailSchema,
  password: passwordSchema,
});

// Password recovery validation schema
export const passwordRecoverySchema = yup.object({
  email: emailSchema,
});

// Profile validation schema
export const profileSchema = yup.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  address: yup.string().required("Address is required"),
  nextOfKin: yup.object({
    name: nameSchema,
    relationship: yup.string().required("Relationship is required"),
    phone: phoneSchema,
    address: yup.string().required("Address is required"),
  }),
});

// Contribution validation
export const contributionSchema = yup.object({
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be positive")
    .required("Amount is required"),
  date: yup
    .date()
    .typeError("Please enter a valid date")
    .max(new Date(), "Future dates are not allowed")
    .required("Date is required"),
  type: yup
    .string()
    .oneOf(["mandatory", "voluntary"], "Invalid contribution type")
    .required("Contribution type is required"),
  description: yup.string().optional(),
});

// Custom validators for business rules
export const validateContributionDate = (date: Date): string | undefined => {
  if (!isValid(date)) {
    return "Invalid date";
  }
  
  if (isAfter(date, new Date())) {
    return "Future dates are not allowed";
  }
  
  return undefined;
};

export const validateMandatoryContribution = (
  date: Date,
  existingContributions: Array<{
    date: string | Date;
    type: ContributionType;
  }>
): string | undefined => {
  // Check if there's already a mandatory contribution for the same month
  const hasMandatoryContributionInSameMonth = existingContributions.some(
    (contribution) => {
      const contributionDate = new Date(contribution.date);
      return (
        contribution.type === "mandatory" &&
        isSameMonth(contributionDate, date)
      );
    }
  );

  if (hasMandatoryContributionInSameMonth) {
    return "You already have a mandatory contribution for this month";
  }

  return undefined;
};

export const validateDuplicateContribution = (
  date: Date,
  amount: number,
  existingContributions: Array<{
    date: string | Date;
    amount: number;
  }>
): string | undefined => {
  // Check for duplicate contribution (same date and amount)
  const hasDuplicateContribution = existingContributions.some(
    (contribution) => {
      const contributionDate = new Date(contribution.date);
      return (
        isSameMonth(contributionDate, date) &&
        contribution.amount === amount
      );
    }
  );

  if (hasDuplicateContribution) {
    return "A contribution with the same date and amount already exists";
  }

  return undefined;
};

// Statement date range validation
export const dateRangeSchema = yup.object({
  startDate: yup
    .date()
    .typeError("Please enter a valid start date")
    .required("Start date is required"),
  endDate: yup
    .date()
    .typeError("Please enter a valid end date")
    .min(yup.ref("startDate"), "End date must be after start date")
    .required("End date is required"),
});
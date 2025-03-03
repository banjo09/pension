import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { RootState, AppDispatch } from "../services/store";
// import { fetchContributions, addNewContribution } from "../services/store";
// import { Contribution, ContributionType } from '../types/contribution.types';
import { useNotifications } from "./useNotifications";
// import { validateContribution } from "../services/contributionService";
import { Contribution, ContributionType } from "../../types/contribution.types";
import {
  addNewContribution,
  AppDispatch,
  fetchContributions,
  RootState,
} from "../../services/store";

// Define contribution type formats for clarity
export const formatContributionType = {
  MANDATORY: "mandatory" as ContributionType,
  VOLUNTARY: "voluntary" as ContributionType,
};

export const useContributions = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { showToast, addNotification } = useNotifications();

  // Get contributions data from Redux store
  const {
    contributions,
    loading: isLoading,
    error: storeError,
  } = useSelector((state: RootState) => state.contributions);

  // Get user from auth state
  const { user } = useSelector((state: RootState) => state.auth);

  // Local error state
  const [error, setError] = useState<string | null>(storeError);

  // Update local error when store error changes
  useEffect(() => {
    setError(storeError);
  }, [storeError]);

  // Fetch contributions
  const fetchUserContributions = useCallback(async () => {
    if (!user?.id) return;

    try {
      await dispatch(fetchContributions(user.id)).unwrap();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred while fetching contributions");
      }
    }
  }, [dispatch, user?.id]);

  // Validate contribution based on business rules
  const validateUserContribution = useCallback(
    (
      contribution: Partial<Contribution>
    ): { isValid: boolean; message?: string } => {
      if (!contribution.date || !contribution.type) {
        return {
          isValid: false,
          message: "Missing required contribution information",
        };
      }

      // Check if contribution has a future date
      if (new Date(contribution.date) > new Date()) {
        return {
          isValid: false,
          message: "Contribution date cannot be in the future",
        };
      }

      // For mandatory contributions, check if there's already one in the current month
      if (contribution.type === formatContributionType.MANDATORY) {
        // Get the year and month of the contribution
        const contributionDate = new Date(contribution.date);
        const contributionMonth = contributionDate.getMonth();
        const contributionYear = contributionDate.getFullYear();

        // Check if there's already a mandatory contribution in this month
        const existingContribution = contributions.find((c: Contribution) => {
          if (c.type !== formatContributionType.MANDATORY) return false;

          const existingDate = new Date(c.date);
          return (
            existingDate.getMonth() === contributionMonth &&
            existingDate.getFullYear() === contributionYear &&
            c.id !== contribution.id // Exclude current contribution when editing
          );
        });

        if (existingContribution) {
          return {
            isValid: false,
            message:
              "Only one mandatory contribution is allowed per calendar month",
          };
        }
      }

      // Check for duplicate transaction reference
      if (contribution.reference) {
        const duplicateReference = contributions.find(
          (c: Contribution) =>
            c.reference === contribution.reference && c.id !== contribution.id
        );

        if (duplicateReference) {
          return {
            isValid: false,
            message: "Duplicate transaction reference detected",
          };
        }
      }

      return { isValid: true };
    },
    [contributions]
  );

  // Create new contribution
  const createContribution = useCallback(
    // async (contribution: Omit<Contribution, "id" | "userId" | "status">) => {
    async (contribution: Omit<Contribution, "id">) => {
      if (!user?.id) {
        showToast({
          type: "error",
          title: "Error",
          message: "User not authenticated",
        });
        return false;
      }

      // Validate contribution before dispatching
      const validation = validateUserContribution(contribution);
      if (!validation.isValid) {
        setError(validation.message || "Invalid contribution");
        showToast({
          type: "error",
          title: "Validation Error",
          message: validation.message || "Invalid contribution",
        });
        return false;
      }

      try {
        // Add contribution using Redux thunk
        await dispatch(
          addNewContribution({
            userId: user.id,
            contribution,
          })
        ).unwrap();

        showToast({
          type: "success",
          title: "Success",
          message: "Contribution submitted successfully",
        });

        addNotification({
          title: "New Contribution",
          message: `${contribution.type} contribution of ${contribution.amount} was successfully processed.`,
          type: "contribution",
        });

        return true;
      } catch (error) {
        let errorMessage = "Failed to submit contribution";
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === "string") {
          errorMessage = error;
        }

        setError(errorMessage);
        showToast({
          type: "error",
          title: "Error",
          message: errorMessage,
        });

        return false;
      }
    },
    [user?.id, dispatch, validateUserContribution, showToast, addNotification]
  );

  // Get contribution statistics
  const getContributionStats = useCallback(() => {
    if (!contributions || contributions.length === 0) {
      return {
        totalContributions: 0,
        mandatoryTotal: 0,
        voluntaryTotal: 0,
        contributionCount: 0,
        mandatoryCount: 0,
        voluntaryCount: 0,
        monthlyData: {},
      };
    }
    const totalContributions = contributions.reduce(
      (total: number, c: Contribution) => total + c.amount,
      0
    );

    const mandatoryTotal = contributions
      .filter((c: Contribution) => c.type === formatContributionType.MANDATORY)
      .reduce((total: number, c: Contribution) => total + c.amount, 0);

    const voluntaryTotal = contributions
      .filter((c: Contribution) => c.type === formatContributionType.VOLUNTARY)
      .reduce((total: number, c: Contribution) => total + c.amount, 0);

    const monthlyData = contributions.reduce(
      (acc: Record<string, number>, c: Contribution) => {
        const date = new Date(c.date);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;

        if (!acc[monthYear]) acc[monthYear] = 0;
        acc[monthYear] += c.amount;

        return acc;
      },
      {}
    );

    return {
      totalContributions,
      mandatoryTotal,
      voluntaryTotal,
      contributionCount: contributions.length,
      mandatoryCount: contributions.filter(
        (c: Contribution) => c.type === formatContributionType.MANDATORY
      ).length,
      voluntaryCount: contributions.filter(
        (c: Contribution) => c.type === formatContributionType.VOLUNTARY
      ).length,
      monthlyData,
    };
  }, [contributions]);

  // Load contributions on component mount
  useEffect(() => {
    if (user?.id) {
      fetchUserContributions();
    }
  }, [fetchUserContributions, user?.id]);

  return {
    contributions,
    isLoading,
    error,
    fetchContributions: fetchUserContributions,
    createContribution,
    validateContribution: validateUserContribution,
    getContributionStats,
  };
};

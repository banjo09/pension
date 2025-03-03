import {
  configureStore,
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { User } from "../types/user.types";
import { Contribution, ContributionSummary } from "../types/contribution.types";
import { Statement, StatementFilter } from "../types/statement.types";
import { LoginCredentials } from "../types/auth.types";
import * as authService from "./authService";
import * as contributionService from "./contributionService";
import * as statementService from "./statementService";

// Auth Slice
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Async thunks for auth
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const user = await authService.loginUser(credentials);
      return user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Login failed"
      );
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  await authService.logoutUser();
  return null;
});

export const fetchCurrentUser = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getCurrentUser();
      return user;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch user"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchCurrentUser.fulfilled,
        (state, action: PayloadAction<User | null>) => {
          state.loading = false;
          state.user = action.payload;
          // state.isAuthenticated = true;
          state.isAuthenticated = !!action.payload;
        }
      )
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

// Contributions Slice
interface ContributionState {
  contributions: Contribution[];
  summary: ContributionSummary | null;
  loading: boolean;
  error: string | null;
}

const initialContributionState: ContributionState = {
  contributions: [],
  summary: null,
  loading: false,
  error: null,
};

export const fetchContributions = createAsyncThunk(
  "contributions/fetchContributions",
  async (userId: string, { rejectWithValue }) => {
    try {
      return await contributionService.getContributions(userId);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch contributions"
      );
    }
  }
);

export const addNewContribution = createAsyncThunk(
  "contributions/addContribution",
  async (
    {
      userId,
      contribution,
    }: { userId: string; contribution: Omit<Contribution, "id"> },
    { rejectWithValue, getState }
  ) => {
    try {
      // Validate contribution before adding
      const state = getState() as RootState;
      const existingContributions = state.contributions.contributions;

      const validation = contributionService.validateContribution(
        (contribution.date as unknown as string),
        contribution.type,
        existingContributions
      );

      if (!validation.valid) {
        return rejectWithValue(validation.message || "Invalid contribution");
      }

      return await contributionService.addContribution(userId, contribution);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to add contribution"
      );
    }
  }
);

export const fetchContributionSummary = createAsyncThunk(
  "contributions/fetchSummary",
  async (userId: string, { rejectWithValue }) => {
    try {
      return await contributionService.getContributionSummary(userId);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch summary"
      );
    }
  }
);

const contributionSlice = createSlice({
  name: "contributions",
  initialState: initialContributionState,
  reducers: {
    clearContributionError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContributions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchContributions.fulfilled,
        (state, action: PayloadAction<Contribution[]>) => {
          state.loading = false;
          state.contributions = action.payload;
        }
      )
      .addCase(fetchContributions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addNewContribution.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addNewContribution.fulfilled,
        (state, action: PayloadAction<Contribution>) => {
          state.loading = false;
          state.contributions.push(action.payload);
        }
      )
      .addCase(addNewContribution.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchContributionSummary.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchContributionSummary.fulfilled,
        (state, action: PayloadAction<ContributionSummary>) => {
          state.loading = false;
          state.summary = action.payload;
        }
      )
      .addCase(fetchContributionSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Statements Slice
interface StatementState {
  statements: Statement[];
  currentStatement: Statement | null;
  loading: boolean;
  error: string | null;
}

const initialStatementState: StatementState = {
  statements: [],
  currentStatement: null,
  loading: false,
  error: null,
};

export const generateUserStatement = createAsyncThunk(
  "statements/generateStatement",
  async (
    { userId, filter }: { userId: string; filter: StatementFilter },
    { rejectWithValue }
  ) => {
    try {
      return await statementService.generateStatement(userId, filter);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to generate statement"
      );
    }
  }
);

const statementSlice = createSlice({
  name: "statements",
  initialState: initialStatementState,
  reducers: {
    clearStatementError: (state) => {
      state.error = null;
    },
    clearCurrentStatement: (state) => {
      state.currentStatement = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateUserStatement.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        generateUserStatement.fulfilled,
        (state, action: PayloadAction<Statement>) => {
          state.loading = false;
          state.currentStatement = action.payload;
          state.statements.push(action.payload);
        }
      )
      .addCase(generateUserStatement.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Notifications Slice
interface Notification {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "warning";
  read: boolean;
  timestamp: number;
}

interface NotificationState {
  notifications: Notification[];
}

const initialNotificationState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState: initialNotificationState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<Omit<Notification, "id" | "timestamp" | "read">>
    ) => {
      state.notifications.push({
        id: Date.now().toString(),
        timestamp: Date.now(),
        read: false,
        ...action.payload,
      });
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification) {
        notification.read = true;
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

// Export actions
export const { clearError } = authSlice.actions;
export const { clearContributionError } = contributionSlice.actions;
export const { clearStatementError, clearCurrentStatement } =
  statementSlice.actions;
export const { addNotification, markAsRead, clearNotifications } =
  notificationSlice.actions;

// Configure Store
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    contributions: contributionSlice.reducer,
    statements: statementSlice.reducer,
    notifications: notificationSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

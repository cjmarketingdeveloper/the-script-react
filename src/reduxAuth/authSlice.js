import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as CONSTANTS from "../CONSTANTS";

// Initialize state from localStorage safely
const user = JSON.parse(localStorage.getItem(CONSTANTS.SESSION_COOKIE));

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
};

// --------------------------------------------------------------------------
// Async Thunks
// --------------------------------------------------------------------------

// Register User
export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
    try {
        const response = await axios.post(`${CONSTANTS.API_URL}auth/register`, userData);
        localStorage.setItem(CONSTANTS.SESSION_COOKIE, JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        const message = error.response?.data?.message || error.response?.data || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Login User
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
    try {
        console.log(userData);
        const response = await axios.post(`${CONSTANTS.API_URL}auth/login`, userData);
        localStorage.setItem(CONSTANTS.SESSION_COOKIE, JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.log(error);
        const message = error.response?.data?.message || error.response?.data || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Logout User
export const logout = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem(CONSTANTS.SESSION_COOKIE);
});

// Update User Profile
// Payload format: { id: "userId", data: { name, surname, phone, job } }
export const updateUserProfile = createAsyncThunk(
  "auth/updateUserProfile",
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const authUser = state.auth?.user;
      
      const rawToken =
        authUser?.token ||
        authUser?.accessToken ||
        authUser?.user?.token ||
        JSON.parse(localStorage.getItem(CONSTANTS.SESSION_COOKIE))?.token;

      if (!rawToken) {
        return rejectWithValue("Authentication token missing. Please log in again.");
      }

      const authHeader = rawToken.startsWith("Bearer ") ? rawToken : `Bearer ${rawToken}`;

      // 🟢 Send { data } so req.body has a .data property for your backend's req.body.data
      const res = await axios.put(
        `${CONSTANTS.API_URL}users/update/personal-details/${id}`,
        { data }, // 👈 Wrap in { data } to match req.body.data
        {
          headers: {
            token: authHeader,
            Authorization: authHeader,
          },
        }
      );

      return res.data; // This returns the updated user object directly from Mongoose
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data || "Update failed";
      return rejectWithValue(message);
    }
  }
);

// --------------------------------------------------------------------------
// Slice
// --------------------------------------------------------------------------

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
        updateUserLocal: (state, action) => {
            const updatedUser = action.payload;

            if (state.user) {
                state.user = {
                    ...state.user,
                    ...updatedUser,
                    token: state.user.token
                };

                const currentSession = JSON.parse(localStorage.getItem(CONSTANTS.SESSION_COOKIE)) || {};
                const newSession = {
                    ...currentSession,
                    ...updatedUser,
                    token: currentSession.token
                };
                localStorage.setItem(CONSTANTS.SESSION_COOKIE, JSON.stringify(newSession));
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // REGISTER
            .addCase(register.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = '';
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })

            // LOGIN
            .addCase(login.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = '';
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })

            // LOGOUT
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isSuccess = false;
                state.isError = false;
                state.message = '';
            })

            // UPDATE USER PROFILE
            .addCase(updateUserProfile.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.message = '';
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;

                const updatedFields = action.payload?.user || action.payload?.data || action.payload;

                if (state.user) {
                    state.user = {
                        ...state.user,
                        ...updatedFields,
                        token: state.user.token // Keep original auth token intact
                    };

                    const currentSession = JSON.parse(localStorage.getItem(CONSTANTS.SESSION_COOKIE)) || {};
                    const newSession = {
                        ...currentSession,
                        ...updatedFields,
                        token: currentSession.token
                    };
                    localStorage.setItem(CONSTANTS.SESSION_COOKIE, JSON.stringify(newSession));
                }
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    }
});

export const { reset, updateUserLocal } = authSlice.actions;
export default authSlice.reducer;
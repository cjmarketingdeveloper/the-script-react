import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as CONSTANTS from "../CONSTANTS";
import { Users as DefaultUsers } from '../data/users'; // Import your offline users

// 1. Initialize local mock database if not already seeded
const getLocalUsersDB = () => {
    const local = localStorage.getItem('mock_users_db');
    if (!local) {
        localStorage.setItem('mock_users_db', JSON.stringify(DefaultUsers));
        return DefaultUsers;
    }
    return JSON.parse(local);
};

const saveLocalUsersDB = (users) => {
    localStorage.setItem('mock_users_db', JSON.stringify(users));
};

// Get active session on startup
const user = JSON.parse(localStorage.getItem(CONSTANTS.SESSION_COOKIE));

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
};

// Mock Register Thunk
export const register = createAsyncThunk('auth/register', async (newUserPayload, thunkAPI) => {
    try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        const db = getLocalUsersDB();
        
        // Ensure email/phone doesn't conflict
        const userExists = db.some(
            (u) => u.email?.toLowerCase() === newUserPayload.email?.toLowerCase() || 
                   u.phonenumber === newUserPayload.phonenumber
        );

        if (userExists) {
            throw new Error("An account with this email or phone number already exists.");
        }

        const formattedUser = {
            id: `usr_${Math.random().toString(36).substr(2, 9)}`,
            ...newUserPayload,
            token: "mock-jwt-token-xyz-123", // Simulated API JWT
            created_at: new Date().toISOString()
        };

        db.push(formattedUser);
        saveLocalUsersDB(db);

        // Mirroring your server's payload response structure
        const mockResponse = { data: formattedUser };
        localStorage.setItem(CONSTANTS.SESSION_COOKIE, JSON.stringify(mockResponse.data));

        return mockResponse.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || "Registration failed");
    }
});

// Mock Login Thunk
export const login = createAsyncThunk('auth/login', async (loginPayload, thunkAPI) => {
    try {
        // Simulate network delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        const db = getLocalUsersDB();
        
        // Find user by phone and password match
        const foundUser = db.find(
            (u) => u.email === loginPayload.email && u.password === loginPayload.password
        );

        if (!foundUser) {
            // Throw string to match your error.response.data layout
            throw new Error("Invalid email address or password.");
        }

        const safeUser = { ...foundUser, token: "mock-jwt-token-xyz-123" };
        delete safeUser.password; // Secure password from state

        // Mirror the server response format: { data: userObject }
        const mockResponse = { data: safeUser };
        localStorage.setItem(CONSTANTS.SESSION_COOKIE, JSON.stringify(mockResponse.data));

        return mockResponse; 
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

// Mock Logout Thunk
export const logout = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem(CONSTANTS.SESSION_COOKIE);
});

// Mock Update User Thunk
export const updateUser = createAsyncThunk('auth/updateUser', async (userUpdate, thunkAPI) => {
    try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        const db = getLocalUsersDB();
        const currentSession = JSON.parse(localStorage.getItem(CONSTANTS.SESSION_COOKIE));

        if (!currentSession) {
            throw new Error("No active session found.");
        }

        // Find index of user to modify
        const userIndex = db.findIndex((u) => u.id === currentSession.id);
        if (userIndex === -1) {
            throw new Error("User not found in mock database.");
        }

        // Update local database record
        db[userIndex] = {
            ...db[userIndex],
            ...userUpdate
        };
        saveLocalUsersDB(db);

        const updatedUser = {
            ...currentSession,
            ...userUpdate
        };

        return { message: "Update done", user: updatedUser };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message || "Failed to update profile.");
    }
});

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
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload; // Sets user direct state
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload.data;
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const updatedUser = action.payload.user;
                
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
            });
    }
});

export const { reset, updateUserLocal } = authSlice.actions;
export default authSlice.reducer;
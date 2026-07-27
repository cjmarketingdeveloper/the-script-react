import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import * as CONSTANTS from "../CONSTANTS";
import axios from "axios";

//Get user from localStorage
const user = JSON.parse(localStorage.getItem(CONSTANTS.SESSION_COOKIE))

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

//Register user and pharmacy
export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
    try{

        const response = await axios.post(CONSTANTS.API_URL + "auth/register", user);

        localStorage.setItem(CONSTANTS.SESSION_COOKIE, JSON.stringify(response.data));

        return response; 
    }catch(error){
        //const message = (error.response && error.response.data && error.data.message) || error.message || error.toString()
        const message = error.response.data
        return thunkAPI.rejectWithValue(message)
    }
})

//Login user 
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
    try{

        const response = await axios.post(CONSTANTS.API_URL + "auth/login", user);    
        localStorage.setItem(CONSTANTS.SESSION_COOKIE, JSON.stringify(response.data));

        return response; 
    }catch(error){
        console.log(error);
       // const message = (error.response && error.response.data && error.data.message) || error.message || error.toString()
       const message = error.response.data 
        return thunkAPI.rejectWithValue(message)
    }
})

//Logout user 
export const logout = createAsyncThunk('auth/logout', async () => {
        //console.log("LOGOUT ------------->");
        localStorage.removeItem(CONSTANTS.SESSION_COOKIE);
})
export const updateUser = createAsyncThunk('auth/updateUser',
  async (userUpdate, thunkAPI) => {
    try {
      const response = await axios.put(
        CONSTANTS.API_URL + "users/update/rsvp/details/v1/",
        userUpdate
      );
      // This returns the object { message: "Update done", user: content }
      return response.data; 
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
        },
        updateUserLocal: (state, action) => {
            const updatedUser = action.payload; // This is the 'user' object from result.data.user

            if (state.user) {
                // 1. Update State
                state.user = {
                    ...state.user,
                    ...updatedUser,
                    token: state.user.token // Explicitly keep original token
                };

                // 2. Update LocalStorage
                const currentSession = JSON.parse(localStorage.getItem(CONSTANTS.SESSION_COOKIE)) || {};
                const newSession = {
                    ...currentSession,
                    ...updatedUser,
                    token: currentSession.token // Keep original token in storage
                };
                localStorage.setItem(CONSTANTS.SESSION_COOKIE, JSON.stringify(newSession));
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                //state.user = action.payload
                state.message = action.payload
                state.user = null
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.user = null
            })
            .addCase(logout.fulfilled, (state) => {
                state.user = null
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload.data
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.user = null
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
            })
    }
})

export const { reset , updateUserLocal} = authSlice.actions
export default authSlice.reducer
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { GET, POST } from "../../services/Http";
import { API } from "../../services/Api";

const initialState = {
    name: null,
    email: null,
    password: null,
    userId: null,
    error: null,
    loading: false,
    registerStatus: null,
    registerMessage: null,
    isRememberMe: false,
    usersList: [],
    messagesList: []
}

const registerAPI = createAsyncThunk('user/register', async (req, thunkAPI) => {
    try {
        const response = await POST(API.register, req);
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data);
    }
})

const loginAPI = createAsyncThunk('user/login', async (req, thunkAPI) => {
    try {
        let RequestData = {
            email: req.email,
            password: req.password
        }
        const response = await POST(API.login, RequestData);
        return { ...response.data, isRemember: req.isRemember, password: req.password };
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data);
    }
})

const usersAPI = createAsyncThunk('user/users', async (req, thunkAPI) => {
    try {
        const response = await GET(API.users);
        return response.data;
    } catch (error) {
        console.log('error in users api', error);
        return thunkAPI.rejectWithValue(error.response?.data);
    }
});

const messagesAPI = createAsyncThunk('user/messages', async (req, thunkAPI) => {
    try {
        const response = await GET(`${API.messages}/${req.sender_id}/${req.receiver_id}`);
        return response.data;
    } catch (error) {
        console.log('error in users api', error);
        return thunkAPI.rejectWithValue(error.response?.data);
    }
});


const user = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state, action) => {
            const { email, password, isRememberMe } = state;
            if (isRememberMe) {
                return {
                    ...initialState,
                    email,
                    password,
                    isRememberMe
                };
            }
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerAPI.pending, (state, action) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(registerAPI.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.registerStatus = action.payload.status;
                state.registerMessage = action.payload.message;
            })
            .addCase(registerAPI.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'something went wrong';
                state.registerStatus = action.payload.status;
                state.registerMessage = action.payload.message;
            });

        builder
            .addCase(loginAPI.pending, (state, action) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(loginAPI.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.registerStatus = action.payload.status;
                state.registerMessage = action.payload.message;
                state.userId = action.payload.user.id;
                state.name = action.payload.user.name;
                state.email = action.payload.user.email
                state.isRememberMe = action.payload.isRemember;
                if (action.payload.isRemember) {
                    state.password = action.payload.password;
                } else {
                    state.password = null;
                }
            })
            .addCase(loginAPI.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'something went wrong';
                state.registerStatus = action.payload.status;
                state.registerMessage = action.payload.message;
            });

        builder
            .addCase(usersAPI.pending, (state, action) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(usersAPI.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.registerStatus = action.payload.status;
                state.usersList = action.payload.users;
            })
            .addCase(usersAPI.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'something went wrong';
                state.registerStatus = action.payload.status;
            });

        builder
            .addCase(messagesAPI.pending, (state, action) => {
                state.loading = true;
                state.error = false;
            })
            .addCase(messagesAPI.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.registerStatus = action.payload.status;
                state.messagesList = action.payload.messages;
            })
            .addCase(messagesAPI.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'something went wrong';
                state.registerStatus = action.payload.status;
            });
    },
    selectors: {}
});


export default user.reducer;
export const { logout } = user.actions;
export {
    registerAPI,
    loginAPI,
    usersAPI,
    messagesAPI
}


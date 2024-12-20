import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    currentUser: null,
    error: null,
    loading: false
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        SignInStart: (state) => {
            state.loading = true;
            state.error = null
        },
        SignInSuccess:(state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null
        },
        SignInFailure: (state,action) =>{
            state.loading = false;
            state.error = action.payload
        },
        UpdateStart: (state) => {
            state.loading = true
            state.error = null
        },
        UpdateSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null
        },
        UpdateFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload
        },
        DeleteUserStart: (state) => {
            state.loading = true;
            state.error = null
        },
        DeleteUserSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null
        },
        DeleteUserFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload
        },
        SignoutSuccess: (state) => {
            state.currentUser = null;
            state.error = null;
            state.loading = false
        }
    }
})

export const {
    SignInStart,
    SignInSuccess,
    SignInFailure,
    UpdateStart,
    UpdateSuccess,
    UpdateFailure,
    DeleteUserStart,
    DeleteUserSuccess,
    DeleteUserFailure,
    SignoutSuccess
}  = userSlice.actions

export default userSlice.reducer
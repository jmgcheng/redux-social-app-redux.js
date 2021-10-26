import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
/*
  - createAsyncThunk
    - Redux Toolkit's createAsyncThunk API generates thunks that automatically dispatch those "start/success/failure" actions for you
    - you can now use the created thunk to call async requests
*/



import { client } from '../../api/client'

const initialState = []

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await client.get('/fakeApi/users')
  return response.data
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      return action.payload
      /*
        - return action.payload
          - this one returns a payload rather than updating a state... I thougth reducer needs to update a state?
            - since this is considered a reducer, any returned is a new state? then redux auto update the state for this slice?
      */
    })
  }  
})

export default usersSlice.reducer
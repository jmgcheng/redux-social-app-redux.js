import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
/*
  - createAsyncThunk
    - Redux Toolkit's createAsyncThunk API generates thunks that automatically dispatch those "start/success/failure" actions for you
    - you can now use the created thunk to call async requests
  - createEntityAdapter
    - an API provides a standardized way to store your data in a slice 
      - by taking a collection of items and putting them into the shape of { ids: [], entities: {} }. 
      - it also generates a set of reducer functions and selectors that know how to work with that data.
    - all of this for normalizing data    
*/



import { client } from '../../api/client'



const usersAdapter = createEntityAdapter()



// const initialState = []
const initialState = usersAdapter.getInitialState()



export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await client.get('/fakeApi/users')
  return response.data
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {


    /*builder.addCase(fetchUsers.fulfilled, (state, action) => {
      return action.payload
      
        - return action.payload
          - this one returns a payload rather than updating a state... I thougth reducer needs to update a state?
            - since this is considered a reducer, any returned is a new state? then redux auto update the state for this slice?
      
    })*/
    builder.addCase(fetchUsers.fulfilled, usersAdapter.setAll)
    /*
      - usersAdapter.setAll
        - this is auto created when setting createEntityAdapter adapter object
    */


  }  
})

export default usersSlice.reducer


/*
export const selectAllUsers = state => state.users
export const selectUserById = (state, userId) =>
  state.users.find(user => user.id === userId)
  - selectAllUsers, selectUserById
    - exports these selector functions so that it can be reuse in components
    - It's often a good idea to encapsulate data lookups by writing reusable selectors.
      - But, like any abstraction, it's not something you should do all the time, everywhere. Writing selectors means more code to understand and maintain. Don't feel like you need to write selectors for every single field of your state. Try starting without any selectors, and add some later when you find yourself looking up the same values in many parts of your application code.
*/



export const { selectAll: selectAllUsers, selectById: selectUserById } = usersAdapter.getSelectors(state => state.users)
/*
  - usersAdapter.getSelectors
    - this is auto created when setting createEntityAdapter adapter object
    - this is auto creation will replace the manual eg. export const selectAllUsers = state => state.users
  - selectAll, selectById, selectIds
    - so these are auto created by postsAdapter.getSelector for us to use  
*/
/*
  not used in rty query advance branch
  import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
  - createAsyncThunk
    - Redux Toolkit's createAsyncThunk API generates thunks that automatically dispatch those "start/success/failure" actions for you
    - you can now use the created thunk to call async requests  
*/




import { createEntityAdapter, createSelector } from '@reduxjs/toolkit'
/*
  - createEntityAdapter
    - an API provides a standardized way to store your data in a slice 
      - by taking a collection of items and putting them into the shape of { ids: [], entities: {} }. 
      - it also generates a set of reducer functions and selectors that know how to work with that data.
    - all of this for normalizing data     
  - createSelector
    - Reselect is a library for creating memoized selector functions
      - and was specifically designed to be used with Redux. 
      - It has a createSelector function that generates memoized selectors that will only recalculate results when the inputs change. 
    - Redux Toolkit exports the createSelector function, so we already have it available.
*/



import { apiSlice } from '../api/apiSlice'
/*
  - apiSlice
    - apiSlice was created by createApi() when we defined our single API slice object
    - check apiSlice.js
*/



const usersAdapter = createEntityAdapter()

const initialState = usersAdapter.getInitialState()
/*
  - getInitialState
    - getInitialState is also prebuilt in the adaptor that is created by createEntityAdapter
    - it generates an empty {ids: [], entities: {}} object
      - You can pass in more fields to getInitialState, and those will be merged in
*/



export const extendedApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => '/users',
      transformResponse: (res) => {
        return usersAdapter.setAll(initialState, res)
      },
    }),
  }),
})
/*
  - apiSlice.injectEndpoints
    - this is just and extension setup, hence injectEndpoints
    - RTK Query supports splitting out endpoint definitions with apiSlice.injectEndpoints().
    - That way, we can still have a single API slice with a single middleware and cache reducer
      - but we can move the definition of some endpoints to other files
    - This enables code-splitting scenarios, as well as co-locating some endpoints alongside feature folders if desired.
    - see apiSlice.js for the main setup
  - getUsers
    - note that this will become "useGetUsersQuery" when we export it
      - The hooks are automatically named based on a standard convention:
        - use, the normal prefix for any React hook
        - The name of the endpoint, capitalized
        - The type of the endpoint, Query or Mutation
        - In this case, our endpoint is getUsers and it's a query endpoint, so the generated hook is useGetUsersQuery
    - this was use differently in index.js VS how post are used in PostsLists.js
    - use in index.js eg
      - store.dispatch(extendedApiSlice.endpoints.getUsers.initiate())
      - useGetUsersQuery below not used. Not same as how PostList.js use apiSlice.js        
  - transformResponse
    - Endpoints can define a transformResponse handler that can extract or modify the data received from the server before it's cached.   
  - notes
    - Each endpoint object contains:
      - The same primary query/mutation hook that we exported from the root API slice object, but named as useQuery or useMutation
      - For query endpoints, an additional set of query hooks for scenarios like "lazy queries" or partial subscriptions
      - A set of "matcher" utilities to check for the pending/fulfilled/rejected actions dispatched by requests for this endpoint
      - initiate - An initiate thunk that triggers a request for this endpoint
      - select - A select function that creates memoized selectors that can retrieve the cached result data + status entries for this endpoint      
*/



export const { useGetUsersQuery } = extendedApiSlice
/*
  - export the auto generated renamed endpoints
*/



// Calling `someEndpoint.select(someArg)` generates a new selector that will return
// the query result object for a query with those parameters.
// To generate a selector for a specific query argument, call `select(theQueryArg)`.
// In this case, the users query has no params, so we don't pass anything to select()
export const selectUsersResult = extendedApiSlice.endpoints.getUsers.select()
/*
  - select()
    - auto created
    - An initiate thunk that triggers a request for this endpoint    
*/



const selectUsersData = createSelector(
  selectUsersResult,
  (usersResult) => usersResult.data
)
/*
  - createSelector
    - Reselect is a library for creating memoized selector functions
      - and was specifically designed to be used with Redux. 
      - It has a createSelector function that generates memoized selectors that will only recalculate results when the inputs change. 
    - Redux Toolkit exports the createSelector function, so we already have it available.
    - args
      - 1st arg - eg. [selectAllPosts, (state, userId) => userId]
        - one or more "input selectors"
        - the result of these selectors will be pass to the 2nd arg
        - selectAllPosts
          - 1st result in 1st arg
        - (state, userId) => userId
          - 2nd result in 1st arg
      - 2nd arg
        - this is an "output selector"
        - it will have an {n} arg base on how many result the input selectors will pass
        - (posts, userId) ...
          - 2nd arg arguments (posts, userId) corresponds to the what the input selectors passed
    - all of these to improve performance https://redux.js.org/usage/deriving-data-selectors
*/



export const {
  selectAll: selectAllUsers,
  selectById: selectUserById,
} = usersAdapter.getSelectors((state) => selectUsersData(state) ?? initialState)
/*
  - usersAdapter.getSelectors
    - this is auto created when setting createEntityAdapter adapter object
    - this is auto creation will replace the manual eg. export const selectAllPosts = state => state.posts.posts
  - selectAll, selectById, selectIds
    - so these are auto created by usersAdapter.getSelectors for us to use
*/
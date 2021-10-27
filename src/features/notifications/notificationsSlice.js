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



const notificationsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
})



export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (_, { getState }) => {
    const allNotifications = selectAllNotifications(getState())
    const [latestNotification] = allNotifications
    const latestTimestamp = latestNotification ? latestNotification.date : ''
    const response = await client.get(
      `/fakeApi/notifications?since=${latestTimestamp}`
    )
    return response.data
  }
)
/*
  - createAsyncThunk
    - 2 args
      - 1st. A string that will be used as the prefix for the generated action types
      - 2nd. A "payload creator" callback function that should return a Promise containing some data, or a rejected Promise with an error
  - fetchNotifications - flow
    - this is a thunk
    - this is triggered in react ui component eg. dispatch(fetchNotifications()) at Navbar.js
    - then, this fetchNotifications thunk will first dispatch auto created action type 'notifications/fetchNotifications/pending'
      - check this in react redux app browser debugger
    - then, dispatch auto created action type 'notifications/fetchNotifications/fulfilled'
      - check this in react redux app browser debugger
    - then, our extraReducers [fetchNotifications.fulfilled] below will listen and change the state.status    
*/



const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: notificationsAdapter.getInitialState(),
  reducers: {
    allNotificationsRead(state, action) {
      /*state.forEach(notification => {
        notification.read = true
      })*/
      Object.values(state.entities).forEach(notification => {
        notification.read = true
      })      
      /*
        - state.entities
          - this is now using the entities auto created above when setting createEntityAdapter adapter object
      */
    }
  },

  /*
  note that we were able to use this kind of setup of extra reducer when we are still not using createEntityAdapter  
  lets leave this example here for code reference for diff setup
  extraReducers: {
    [fetchNotifications.fulfilled]: (state, action) => {
      state.push(...action.payload)
      state.forEach(notification => {
        // Any notifications we've read are no longer new
        notification.isNew = !notification.read
      })      
      // Sort with newest first
      state.sort((a, b) => b.date.localeCompare(a.date))

        //- state.sort
        //  - As a reminder, array.sort() always mutates the existing array - this is only safe because we're using createSlice and Immer inside

    }
  }*/

  extraReducers(builder) {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      Object.values(state.entities).forEach(notification => {
        // Any notifications we've read are no longer new
        notification.isNew = !notification.read
      })
      notificationsAdapter.upsertMany(state, action.payload)
    })
  }

})

export const { allNotificationsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

/*
export const selectAllNotifications = state => state.notifications
  - selectAllNotifications
    - exports these selector functions so that it can be reuse in components
    - It's often a good idea to encapsulate data lookups by writing reusable selectors.
      - But, like any abstraction, it's not something you should do all the time, everywhere. Writing selectors means more code to understand and maintain. Don't feel like you need to write selectors for every single field of your state. Try starting without any selectors, and add some later when you find yourself looking up the same values in many parts of your application code.
*/

export const { selectAll: selectAllNotifications } = notificationsAdapter.getSelectors(state => state.notifications)
/*
  - notificationsAdapter.getSelectors
    - this is auto created when setting createEntityAdapter adapter object
    - this is auto creation will replace the manual eg. export const selectAllNotifications = state => state.notifications
  - selectAll, selectById, selectIds
    - so these are auto created by postsAdapter.getSelector for us to use    
*/
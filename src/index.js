import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import store from './app/store'
import { Provider } from 'react-redux'
/*
  - Provider, store
    - you need to wrap your App with this so every component can access the store
*/



/*
not used in rtk query advance branch
import { fetchUsers } from './features/users/usersSlice'
  - fetchUsers
    - this is a thunk created in createAsyncThunk in usersSlice
    - thunks are created using createAsyncThunk
      - createAsyncThunk
        - Redux Toolkit's createAsyncThunk API generates thunks that automatically dispatch those "start/success/failure" actions for you
        - you can now use this to call async requests    
*/
import { extendedApiSlice } from './features/users/usersSlice'
/*
  - extendedApiSlice
    - this was created when we extended our apiSlice using apiSlice.injectEndpoints
    - RTK Query supports splitting out endpoint definitions with apiSlice.injectEndpoints().
      - this is why we still use usersSlice.js
*/



import { worker } from './api/server'
// Start our mock API server
worker.start({ onUnhandledRequest: 'bypass' })
/*
  this is for the fake api
*/



/*
not used in rty query advance branch
store.dispatch(fetchUsers())
  - store.dispatch(fetchUsers())
    - We only need to fetch the list of users once, and we want to do it right when the application starts. We can do that in our index.js file, and directly dispatch the fetchUsers thunk because we have the store right there
  - doing this update the state in users slice
*/



store.dispatch(extendedApiSlice.endpoints.getUsers.initiate())
/*
  - initiate()
    - auto created
    - An initiate thunk that triggers a request for this endpoint
*/



ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

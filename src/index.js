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



import { fetchUsers } from './features/users/usersSlice'
/*
  - fetchUsers
    - this is a thunk created in createAsyncThunk in usersSlice
    - thunks are created using createAsyncThunk
      - createAsyncThunk
        - Redux Toolkit's createAsyncThunk API generates thunks that automatically dispatch those "start/success/failure" actions for you
        - you can now use this to call async requests    
*/



import { worker } from './api/server'
// Start our mock API server
worker.start({ onUnhandledRequest: 'bypass' })
/*
  this is for the fake api
*/



store.dispatch(fetchUsers())
/*
  - store.dispatch(fetchUsers())
    - We only need to fetch the list of users once, and we want to do it right when the application starts. We can do that in our index.js file, and directly dispatch the fetchUsers thunk because we have the store right there
  - doing this update the state in users slice
*/



ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

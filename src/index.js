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

import { worker } from './api/server'
// Start our mock API server
worker.start({ onUnhandledRequest: 'bypass' })
/*
  this is for the fake api
*/



ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

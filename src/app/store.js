import { configureStore } from '@reduxjs/toolkit'
/*
	- configureStore
		- this is the recommended way to create store when using redux
*/



import postsReducer from '../features/posts/postsSlice'
/*
	- postsReducer
		- export default postsSlice.reducer in postsSlice.js
		- this will be used by reducer object passed in configureStore
*/
import usersReducer from '../features/users/usersSlice'
import notificationsReducer from '../features/notifications/notificationsSlice'



import { apiSlice } from '../features/api/apiSlice'
/*
	- apiSlice
		- started using in rtk query
	- apiSlice.middleware
		- the API slice auto generates a custom middleware that we also need to be add to the store
*/



export default configureStore({
	reducer: {
		posts: postsReducer,
		users: usersReducer,
		notifications: notificationsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer 		// started using this in rtk query
	},
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(apiSlice.middleware)	// started using this in rtk query
})
/*
	- configureStore
		- this is the recommended way to create store when using redux
	- apiSlice.middleware
		- the API slice auto generates a custom middleware that we also need to be add to the store
*/




/*
	export default configureStore({
		reducer: {
			posts: postsReducer
		}
	})
	This tells Redux that we want our top-level state object to have a field named posts inside
		- and all the data for state.posts will be updated by the postsReducer function when actions are dispatched.
*/
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




export default configureStore({
	reducer: {
		posts: postsReducer,
		users: usersReducer
	}
})
/*
	- configureStore
		- this is the recommended way to create store when using redux
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
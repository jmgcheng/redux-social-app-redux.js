import { createSlice } from '@reduxjs/toolkit'
/*
  - createSlice
    - you use createSlice when you use redux toolkit
    - createSlice will setup your action creator functions, action objects, and reducers 
    - createSlice will create ____.reducer that you will export and will be use when creating a store by configureStore()
    - createSlice has name, initialState, reducers that you need to setup
*/



import { nanoid } from '@reduxjs/toolkit'
/*
  - nanoid
    - just another helper function
    - Redux Toolkit has a nanoid function we can use for generating a random unique id
*/


import { sub } from 'date-fns'
/*
  - sub
    - just another helper function
*/



import { createAsyncThunk } from '@reduxjs/toolkit'
/*
  - createAsyncThunk
    - Redux Toolkit's createAsyncThunk API generates thunks that automatically dispatch those "start/success/failure" actions for you
    - you can now use the created thunk to call async requests
*/
import { client } from '../../api/client'




const initialState = {
  posts: [],
  status: 'idle',
  error: null
}



export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts')
  return response.data
})
/*
  - createAsyncThunk
    - 2 args
      - 1st. A string that will be used as the prefix for the generated action types
      - 2nd. A "payload creator" callback function that should return a Promise containing some data, or a rejected Promise with an error
  - fetchPosts - flow
    - this is a thunk
    - this is triggered in react ui component eg. dispatch(fetchPosts())
    - then, this fetchPosts thunk will first dispatch auto created action type 'posts/fetchPosts/pending'
      - check this in react redux app browser debugger
    - then, our extraReducers addCase(fetchPosts.pending, ... ) in createSlice below will listen and change the state.status
    - then, when the Promise "await client.get('/fakeApi/posts')" is resolves in the payload create "2nd arg"
      - this fetchPosts thunk takes the response.data 
      - and dispatch auto created action type 'posts/fetchPosts/fulfilled' containing the posts array as action.payload
        - check this in react redux app browser debugger
    - then, our extraReducers addCase(fetchPosts.fulfilled, ... ) below will listen and change the state.status
*/



export const addNewPost = createAsyncThunk('posts/addNewPost',
  // The payload creator receives the partial `{title, content, user}` object
  /*
    - addNewPost - flow
      - this is a thunk
      - this is triggered in react ui component eg. await dispatch(addNewPost({ title, content, user: userId }))
  */
  async initialPost => {
    // We send the initial data to the fake API server
    const response = await client.post('/fakeApi/posts', initialPost)
    // The response includes the complete post object, including unique ID
    return response.data
  }
)



const postsSlice = createSlice({
/*
  - createSlice
    - this is how you create a slice
    - createSlice has name, initialState, reducers that you need to setup
*/


  name: 'posts',
  initialState,
  reducers: {
    /*
      - reducers
        - reducers can be empty reducers: {} if you dont need any actions
    */
    




    /*
      - default - no prepare
        postAdded(state, action) {
          state.push(action.payload)
        },
        use this simple version if you dont need to prepare your action payload
    */



    /*
      - prepare
        - use format below if you need to prepare you action payload before it goes to reducer()
    */
    postAdded: {                         // <- note that this is not used in async branch anymore because we are using addNewPost thunk triggered in ui eg. await dispatch(addNewPost({ title, content, user: userId }))
      reducer(state, action) {
        // state.push(action.payload)    // use in our master branch
        state.posts.push(action.payload) // use in async
                                        /*
                                          - state.posts
                                            - we also need to change any uses of state as an array to be state.posts instead, because the array is now one level deeper
                                        */        
      },
      prepare(title, content, userId) {
        // async will use diff prepare logic. Check master for old one
      }
    },
    /*
      - postAdded
        - a view component will trigger this reducer
          - eg. 
            dispatch( postAdded({ id: nanoid(), title, content }) ) // using default - no prepare
            dispatch( postAdded(title, content, userId) )           // using prepare
          - the view component imported useDispatch and postAdded to do this
      - state.push
        - It's safe to call mutating functions like Array.push() or modify object fields like state.someField = someValue inside of createSlice()
          - because of Immer library
      - action.payload
        - By convention, we normally put the additional info in a field called action.payload
          - but it's up to us to decide what the payload field contains - it could be a string, a number, an object, an array, or something else
    */


    postUpdated(state, action) {
      const { id, title, content } = action.payload
      // const existingPost = state.find(post => post.id === id)          // use in our master branch
      const existingPost = state.posts.find(post => post.id === id)   // use in async
                                                                          /*
                                                                            - state.posts
                                                                              - we also need to change any uses of state as an array to be state.posts instead, because the array is now one level deeper
                                                                          */
      if (existingPost) {                   // update values if post found
        existingPost.title = title
        existingPost.content = content
      }
    },


    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      // const existingPost = state.find(post => post.id === postId)      // use in our master branch
      const existingPost = state.posts.find(post => post.id === postId)
                                                                          /*
                                                                            - state.posts
                                                                              - we also need to change any uses of state as an array to be state.posts instead, because the array is now one level deeper
                                                                          */
      if (existingPost) {
        existingPost.reactions[reaction]++
        /*
          - existingPost.reactions[reaction]++
            - its like existingPost.reactions['thumbsUp']++ base on the value of reaction in action.payload
        */
      }
    }



  }, /* end bracket } for reducers */



  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // Add any fetched posts to the array
        state.posts = state.posts.concat(action.payload)
        /*
          - action.payload
            - this came from return response.data in fetchPosts thunk one the promise is resolves
        */
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.posts.push(action.payload)
      })      
  }
/*
  - extraReducers
    - it seems you need to use this if your using a thunk since these are like callback listeners
    - we use extraReducers if there are times when a slice reducer needs to respond to other actions that weren't defined as part of this slice's reducers field.
    - The extraReducers option should be a function that receives a parameter called builder. 
      - The builder object provides methods that let us define additional case reducers that will run in response to actions defined outside of the slice.
  - fetchPosts.pending, fetchPosts.fulfilled, fetchPosts.rejected 
    - these are actionCreator auto created
    - these are from createAsyncThunk
    - these can be seen react redux app browser debugger
    - if posts/fetchPosts/pending fired
      - then .addCase(fetchPosts.pending ... ) fires. So extraReducers or extraCallbacks
      - then .addCase(fetchPosts.fulfilled ... ) fires when promise is resolved in fetchPosts thunk
  - fetchPosts, addNewPost are thunks we created above using createAsyncThunk
*/  




})





export const { postAdded, postUpdated, reactionAdded  } = postsSlice.actions
/*
  - postsSlice.actions
    - auto created by createSlice for us
    - When we write the postAdded reducer function, createSlice will automatically generate an "action creator" function with the same name. 
    - We can export that action creator and use it in our UI components to dispatch the action when the user clicks "Save Post".  
      - eg. 
        dispatch( postAdded({ id: nanoid(), title, content }) ) // using default - no prepare
        dispatch( postAdded(title, content, userId) )           // using prepare    
*/





export default postsSlice.reducer
/*
  - postsSlice.reducer
    - auto created by createSlice for us
    - also need to export this as this will be used in configureStore
*/



export const selectAllPosts = state => state.posts.posts
export const selectPostById = (state, postId) =>
  state.posts.posts.find(post => post.id === postId)
/*
  - selectAllPosts, selectPostById
    - exports these selector functions so that it can be reuse in components
    - It's often a good idea to encapsulate data lookups by writing reusable selectors.
      - But, like any abstraction, it's not something you should do all the time, everywhere. Writing selectors means more code to understand and maintain. Don't feel like you need to write selectors for every single field of your state. Try starting without any selectors, and add some later when you find yourself looking up the same values in many parts of your application code.
*/  
/*
  - state.posts
    - we also need to change any uses of state as an array to be state.posts instead, because the array is now one level deeper
*/
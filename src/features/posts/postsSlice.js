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




const initialState = [
  {
    id: '1',
    title: 'First Post!',
    content: 'Hello!',
    user: '0',
    date: sub(new Date(), { minutes: 10 }).toISOString(),
    reactions: {
      thumbsUp: 0,
      hooray: 0,
      heart: 0,
      rocket: 0,
      eyes: 0,
    },
  },
  {
    id: '2',
    title: 'Second Post',
    content: 'More text',
    user: '2',
    date: sub(new Date(), { minutes: 5 }).toISOString(),
    reactions: {
      thumbsUp: 0,
      hooray: 0,
      heart: 0,
      rocket: 0,
      eyes: 0,
    },
  },
]






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
    postAdded: {
      reducer(state, action) {
        state.push(action.payload)
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            date: new Date().toISOString(),
            title,
            content,
            user: userId,
            reactions: {
              thumbsUp: 0,
              hooray: 0,
              heart: 0,
              rocket: 0,
              eyes: 0,
            }
          }
        }
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
      const existingPost = state.find(post => post.id === id)
      if (existingPost) {                   // update values if post found
        existingPost.title = title
        existingPost.content = content
      }
    },


    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.find(post => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
        /*
          - existingPost.reactions[reaction]++
            - its like existingPost.reactions['thumbsUp']++ base on the value of reaction in action.payload
        */
      }
    }



  }
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
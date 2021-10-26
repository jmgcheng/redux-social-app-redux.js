/*
  notes
    - this is a react component
      - note capital letter first
      - redux use camel case
*/



import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
/*
  - useDispatch
    - you need useDispatch to get the dispatch function In order to dispatch actions from a component and access store
      - eg. 
        dispatch( postAdded({ id: nanoid(), title, content }) ) // using default - no prepare
        dispatch( postAdded(title, content, userId) )           // using prepare       
*/


import { useSelector } from 'react-redux'
/*
  - useSelector
    - React components read data from the store with the useSelector hook
      - Selector functions receive the whole state object, and should return a value
      - Selectors will re-run whenever the Redux store is updated, and if the data they return has changed, the component will re-render    
    - the component will re-render any time the value returned from useSelector changes to a new reference
*/



import { nanoid } from '@reduxjs/toolkit'
/*
  - nanoid
    - Redux Toolkit has a nanoid function we can use for generating a random unique id
*/



/*
import { postAdded } from './postsSlice'                        // this is not use in async branch. Check master when its still used
  - postAdded
    - one of the action creator exported in postsSlice.js
    - arg in dispatch() to update store
      - eg. 
        dispatch( postAdded({ id: nanoid(), title, content }) ) // using default - no prepare
        dispatch( postAdded(title, content, userId) )           // using prepare           
    - was used to update data in Store... we need to use addNewPost to use API to POST to api
*/




import { addNewPost } from './postsSlice'
/*
  - addNewPost
    - this is a thunk created in createAsyncThunk in postsSlice
    - thunks are created using createAsyncThunk
      - createAsyncThunk
        - Redux Toolkit's createAsyncThunk API generates thunks that automatically dispatch those "start/success/failure" actions for you
        - you can now use this to call async requests        
*/





export const AddPostForm = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState('')
  const [addRequestStatus, setAddRequestStatus] = useState('idle')

  const dispatch = useDispatch()

  const users = useSelector(state => state.users)
/*
  - useSelector
    - Our initial component will read the state.users value from the Redux store
*/    



  const onTitleChanged = e => setTitle(e.target.value)
  const onContentChanged = e => setContent(e.target.value)
  const onAuthorChanged = e => setUserId(e.target.value)
  /*
    - onTitleChanged, onContentChanged, onAuthorChanged
      - onChange event handlers below
  */


  const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle' // cool way to use Boolean vanilla js


  const onSavePostClicked = async () => {
    if (canSave) {
      try {
        setAddRequestStatus('pending')
        await dispatch(addNewPost({ title, content, user: userId })).unwrap()
        /*
          - unwrap()
            - Redux Toolkit adds a .unwrap() function to the returned Promise
              - which will return a new Promise that either has the actual action.payload value from a fulfilled action
              - or throws an error if it's the rejected action. 
            - This lets us handle success and failure in the component using normal try/catch logic. 
              - So, we'll clear out the input fields to reset the form if the post was successfully created, and log the error to the console if it failed.  
        */
        setTitle('')
        setContent('')
        setUserId('')
      } catch (err) {
        console.error('Failed to save the post: ', err)
      } finally {
        setAddRequestStatus('idle')
      }
    }
  }

  

  const usersOptions = users.map(user => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ))


  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={userId} onChange={onAuthorChanged}>
          <option value=""></option>
          {usersOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button type="button" onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  )
} /*close braket export const AddPostForm */
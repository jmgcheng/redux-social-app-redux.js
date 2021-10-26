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



import { postAdded } from './postsSlice'
/*
  - postAdded
    - one of the action creator exported in postsSlice.js
    - arg in dispatch() to update store
      - eg. 
        dispatch( postAdded({ id: nanoid(), title, content }) ) // using default - no prepare
        dispatch( postAdded(title, content, userId) )           // using prepare           
*/





export const AddPostForm = () => {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [userId, setUserId] = useState('')

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


  const onSavePostClicked = () => {
    if (title && content) {
      /*
        - dispatch( postAdded({ id: nanoid(), title, content }) )
          - use this if no prepare is use in your createSlice
          - this will be handled by postAdded in postsSlice.js
      */

      dispatch(postAdded(title, content, userId))                   // use this one if your postAdded prepares its own action payload. check postsSlice.js
      /*
        - eg. 
          dispatch( postAdded({ id: nanoid(), title, content }) )   // using default - no prepare
          dispatch( postAdded(title, content, userId) )             // using prepare           
      */

      setTitle('')
      setContent('')
    }
  }

  const canSave = Boolean(title) && Boolean(content) && Boolean(userId) // cool way to use Boolean vanilla js

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
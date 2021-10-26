/*
  notes
    - this is a react component
      - note capital letter first
      - redux use camel case
*/



import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
/*
  - useSelector
    - React components read data from the store with the useSelector hook
      - Selector functions receive the whole state object, and should return a value
      - Selectors will re-run whenever the Redux store is updated, and if the data they return has changed, the component will re-render    
    - the component will re-render any time the value returned from useSelector changes to a new reference
*/



import { useHistory } from 'react-router-dom'
/*
  - useHistory
    - used for redirect 
*/





import { postUpdated } from './postsSlice'
/*
  - postUpdated
    - one of the action creator exported in postsSlice.js
    - arg in dispatch() to update store
      - eg. 
        dispatch( postAdded({ id: nanoid(), title, content }) ) // using default - no prepare
        dispatch( postAdded(title, content, userId) )           // using prepare               
*/





export const EditPostForm = ({ match }) => {
  const { postId } = match.params

  const post = useSelector(state =>
    state.posts.find(post => post.id === postId)
  )
/*
  - useSelector
    - we can use the postID inside a selector function to find the right post object from the Redux store
    - the component will re-render any time the value returned from useSelector changes to a new reference
*/  







  const [title, setTitle] = useState(post.title)
  const [content, setContent] = useState(post.content)

  const dispatch = useDispatch()
  const history = useHistory()

  const onTitleChanged = e => setTitle(e.target.value)
  const onContentChanged = e => setContent(e.target.value)

  const onSavePostClicked = () => {
    if (title && content) {
      dispatch(postUpdated({ id: postId, title, content }))

/*
  - dispatch(postUpdated({ id: postId, title, content }))
    - use this if no prepare is use in your createSlice
    - this will be handled by postUpdated in postsSlice.js
*/

      history.push(`/posts/${postId}`)
/*
  - history.push
    - just a redirect
*/
    }
  }

  return (
    <section>
      <h2>Edit Post</h2>
      <form>
        <label htmlFor="postTitle">Post Title:</label>
        <input
          type="text"
          id="postTitle"
          name="postTitle"
          placeholder="What's on your mind?"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postContent">Content:</label>
        <textarea
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
      </form>
      <button type="button" onClick={onSavePostClicked}>
        Save Post
      </button>
    </section>
  )
}
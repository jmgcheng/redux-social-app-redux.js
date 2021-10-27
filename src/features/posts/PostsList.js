/*
	notes
		- this is a react component
      - note capital letter first
      - redux use camel case
*/



import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'



import { useSelector } from 'react-redux'
/*
	- useSelector
		- React components can read data from the Redux store using the useSelector hook from the React-Redux library
*/



import { selectAllPosts, fetchPosts, selectPostIds, selectPostById } from './postsSlice'
/*
  - selectAllPosts
    - import selectAllPosts in slice for reuse
  - fetchPosts
    - this is a thunk created in createAsyncThunk in postsSlice
    - thunks are created using createAsyncThunk
      - createAsyncThunk
        - Redux Toolkit's createAsyncThunk API generates thunks that automatically dispatch those "start/success/failure" actions for you
        - you can now use this to call async requests        
*/



import { Link } from 'react-router-dom'



import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'
import { Spinner } from '../../components/Spinner'
/*
  - PostAuthor, TimeAgo, ReactionButtons, Spinner
    - these are just react components
*/



const PostExcerpt = ({ postId }) => {
  const post = useSelector(state => selectPostById(state, postId))
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}






export const PostsList = () => {
  const dispatch = useDispatch()
  const orderedPostIds = useSelector(selectPostIds)


/*
  const posts = useSelector(state => state.posts)
	- useSelector
		- Our initial PostsList component will read the state.posts value from the Redux store
			- then loop over the array of posts and show each of them on screen
*/  
  const posts = useSelector(selectAllPosts)
/*
  - selectAllPosts
    - use selectAllPosts for reuse
*/



  const postStatus = useSelector(state => state.posts.status)
  const error = useSelector(state => state.posts.error)



  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(fetchPosts())
    }
  }, [postStatus, dispatch])
  /*
    - useEffect
      - after component render, trigger arrow function
      - call dispatch(fetchPosts()) if postStatus is idle
      - trigger useEffect again if [postStatus, dispatch] changed
  */



  let content

  if (postStatus === 'loading') {
    content = <Spinner text="Loading..." />
  } else if (postStatus === 'succeeded') {
    // Sort posts in reverse chronological order by datetime string
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))

    /*content = orderedPosts.map(post => (
      <PostExcerpt key={post.id} post={post} />
    ))*/
    content = orderedPostIds.map(postId => (        // we started using this when we setup createEntityAdapter in slice
      <PostExcerpt key={postId} postId={postId} />
    ))


  } else if (postStatus === 'failed') {
    content = <div>{error}</div>
  }


  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )


} /*close braket export const PostsList */
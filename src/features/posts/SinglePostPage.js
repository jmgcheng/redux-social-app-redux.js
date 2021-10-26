/*
  notes
    - this is a react component
      - note capital letter first
      - redux use camel case
*/



import React from 'react'
import { useSelector } from 'react-redux'
/*
  - useSelector
    - React components read data from the store with the useSelector hook
      - Selector functions receive the whole state object, and should return a value
      - Selectors will re-run whenever the Redux store is updated, and if the data they return has changed, the component will re-render    
    - the component will re-render any time the value returned from useSelector changes to a new reference
*/



import { Link } from 'react-router-dom'

import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'
/*
  - PostAuthor, TimeAgo, ReactionButtons
    - these are just react components
*/



export const SinglePostPage = ({ match }) => {
  const { postId } = match.params
/*
  - { match }
    - from route path="/posts/:postId"
    - from url /posts/123
    - React Router will pass in a match object as a prop that contains the URL information we're looking for
*/  



  const post = useSelector(state =>
    state.posts.find(post => post.id === postId)
  )
/*
  - useSelector
    - we can use the postID from params inside a selector function to find the right post object from the Redux store
    - the component will re-render any time the value returned from useSelector changes to a new reference
*/





  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    )
  }

  return (
    <section>
      <article className="post">
        <h2>{post.title}</h2>
        <div>
          <PostAuthor userId={post.user} />
          <TimeAgo timestamp={post.date} />
        </div>
        <p className="post-content">{post.content}</p>
        <ReactionButtons post={post} />
        <Link to={`/editPost/${post.id}`} className="button">
          Edit Post
        </Link>
      </article>
    </section>
  )
}
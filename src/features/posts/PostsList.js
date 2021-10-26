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
		- React components can read data from the Redux store using the useSelector hook from the React-Redux library
*/



import { Link } from 'react-router-dom'



import { PostAuthor } from './PostAuthor'
import { TimeAgo } from './TimeAgo'
import { ReactionButtons } from './ReactionButtons'
/*
  - PostAuthor, TimeAgo, ReactionButtons
    - these are just react components
*/




export const PostsList = () => {
  const posts = useSelector(state => state.posts)
/*
	- useSelector
		- Our initial PostsList component will read the state.posts value from the Redux store
			- then loop over the array of posts and show each of them on screen
*/  


  const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
/*
  - just ordering the post by their date
  - localeCompare
    - this is vanilla js
*/




  const renderedPosts = orderedPosts.map(post => {
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
  })


  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {renderedPosts}
    </section>
  )


} /*close braket export const PostsList */
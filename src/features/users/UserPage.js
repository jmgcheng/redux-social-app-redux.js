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

import { selectUserById } from '../users/usersSlice'
import { selectAllPosts } from '../posts/postsSlice'
/*
  - selectUserById, selectAllUsers
    - import selectAllUsers in slice for reuse
*/


import { selectPostsByUser } from '../posts/postsSlice'
/*
	- selectPostsByUser
		- improve version of selector as it use createSelector() to Memoized
*/



export const UserPage = ({ match }) => {
  const { userId } = match.params

  const user = useSelector(state => selectUserById(state, userId))

  /*const postsForUser = useSelector(state => {
    const allPosts = selectAllPosts(state)
    return allPosts.filter(post => post.user === userId)
  })*/
  const postsForUser = useSelector(state => selectPostsByUser(state, userId))
/*
	- selectPostsByUser
		- improve version of selector as it use createSelector() to Memoized
		- we should see that <UserPage> doesn't re-render this time in redux profiler
*/



  const postTitles = postsForUser.map(post => (
    <li key={post.id}>
      <Link to={`/posts/${post.id}`}>{post.title}</Link>
    </li>
  ))

  return (
    <section>
      <h2>{user.name}</h2>

      <ul>{postTitles}</ul>
    </section>
  )
}
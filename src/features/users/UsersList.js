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
import { selectAllUsers } from './usersSlice'
/*
  - selectAllUsers
    - import selectAllUsers in slice for reuse
*/



export const UsersList = () => {
  const users = useSelector(selectAllUsers)

  const renderedUsers = users.map(user => (
    <li key={user.id}>
      <Link to={`/users/${user.id}`}>{user.name}</Link>
    </li>
  ))

  return (
    <section>
      <h2>Users</h2>

      <ul>{renderedUsers}</ul>
    </section>
  )
}
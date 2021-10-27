/*
  notes
    - this is a react component
      - note capital letter first
      - redux use camel case
*/



import React, {useLayoutEffect} from 'react'
import { useSelector, useDispatch } from 'react-redux'
/*
  - useSelector
    - React components can read data from the Redux store using the useSelector hook from the React-Redux library
*/



import { formatDistanceToNow, parseISO } from 'date-fns'
import classnames from 'classnames'

import { selectAllUsers } from '../users/usersSlice'
import { selectAllNotifications, allNotificationsRead } from './notificationsSlice'
/*
  - selectAllUsers, selectAllNotifications
    - import selectAllUsers in slice for reuse
*/



export const NotificationsList = () => {
  const dispatch = useDispatch()
  const notifications = useSelector(selectAllNotifications)
  const users = useSelector(selectAllUsers)

  useLayoutEffect(() => {
    dispatch(allNotificationsRead())
  })
  /*
    - useLayoutEffect
      - useLayoutEffect is identical to useEffect, but it's major key difference is that it gets triggered synchronously after all DOM mutation
  */  



  const renderedNotifications = notifications.map(notification => {
    const date = parseISO(notification.date)
    const timeAgo = formatDistanceToNow(date)
    const user = users.find(user => user.id === notification.user) || {
      name: 'Unknown User'
    }

    const notificationClassname = classnames('notification', {
      new: notification.isNew
    })

    return (
      <div key={notification.id} className={notificationClassname}>
        <div>
          <b>{user.name}</b> {notification.message}
        </div>
        <div title={notification.date}>
          <i>{timeAgo} ago</i>
        </div>
      </div>
    )
  })

  return (
    <section className="notificationsList">
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  )
}
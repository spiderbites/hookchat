import React, { useContext } from 'react'
import Message from '../components/Message'
import { UserContext } from './UserContext'

function MessageList (props) {
  const usersContext = useContext(UserContext)
  return props.data.map((msg, i) => (
    <Message
      key={i}
      avatar={usersContext.usersById[msg.userId].avatar}
      username={usersContext.usersById[msg.userId].username}
      {...msg}
    />
  ))
}

export default MessageList

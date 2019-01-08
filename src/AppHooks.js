import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import Messages from './Messages'
import Compose from './Compose'
import ApiContext from './ApiContext.js'
import keyBy from 'lodash/keyBy'

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
`

function App (props) {
  const { api } = useContext(ApiContext)
  const [usersById, setUsersById] = useState({})
  const [currentUser, setCurrentUser] = useState({})
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([])
  const [earliest, setEarliest] = useState(Date.now())
  const [noisy, toggleNoise] = useState(true)

  const fetchUsers = async () => {
    const response = await fetch(`${api}/users`)
    const users = await response.json()
    setUsersById(keyBy(users, 'id'))
  }

  const fetchCurrentUser = async () => {
    const response = await fetch(`${api}/me`)
    const currentUser = await response.json()
    setCurrentUser(currentUser)
  }

  const fetchMessages = async () => {
    setLoading(true)
    const response = await fetch(`${api}/messages?before=${earliest}&count=10`)
    const olderMessages = await response.json()
    setMessages(olderMessages.concat(messages))
    setLoading(false)
    setEarliest(
      olderMessages.length ? Date.parse(olderMessages[0].time) : earliest
    )
  }

  const handleCompose = text => {
    setMessages(
      messages.concat({
        time: new Date(),
        text,
        userId: currentUser.id
      })
    )
  }

  useEffect(() => {
    fetchUsers()
      .then(fetchCurrentUser)
      .then(fetchMessages)
  }, [])

  useEffect(
    () => {
      if (noisy) {
        const timeout = setTimeout(async () => {
          const response = await fetch(`${api}/new-message`)
          const newMessage = await response.json()
          setMessages(messages.concat(newMessage))
        }, 2000)
        return () => clearTimeout(timeout)
      }
    },
    [noisy, messages.length]
  )

  return (
    <Container>
      <div>Message Count: {messages.length}</div>
      <button onClick={() => toggleNoise(!noisy)}>
        {noisy ? 'Please stop' : 'Ok go'}
      </button>
      <Messages
        users={usersById}
        data={messages}
        loadMore={fetchMessages}
        loading={loading}
      />
      <Compose onMessage={handleCompose} />
    </Container>
  )
}

export default App

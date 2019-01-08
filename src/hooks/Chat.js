import React, { useEffect, useState, useContext } from 'react'
import styled from 'styled-components'
import Messages from './Messages'
import Compose from './Compose'
import { UserContext } from './UserContext'

const API = process.env.REACT_APP_API
const MESSAGE_FETCH_INTERVAL = 2000

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
`

function Chat (props) {
  const usersContext = useContext(UserContext)
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([])
  const [earliest, setEarliest] = useState(Date.now())
  const [noisy, toggleNoise] = useState(true)

  const fetchMessages = async () => {
    setLoading(true)
    const response = await fetch(`${API}/messages?before=${earliest}&count=10`)
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
        userId: usersContext.currentUser.id
      })
    )
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  useEffect(
    () => {
      if (noisy) {
        const timeout = setTimeout(async () => {
          const response = await fetch(`${API}/new-message`)
          const newMessage = await response.json()
          setMessages(messages.concat(newMessage))
        }, MESSAGE_FETCH_INTERVAL)
        return () => clearTimeout(timeout)
      }
    },
    [noisy, messages.length]
  )

  return (
    <Container>
      <div>Message Count: {messages.length}</div>
      <button onClick={() => toggleNoise(!noisy)}>
        {noisy ? 'Silence!' : 'Ok go'}
      </button>
      <Messages data={messages} loadMore={fetchMessages} loading={loading} />
      <Compose onMessage={handleCompose} />
    </Container>
  )
}

export default Chat

import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from './UserContext'
import MessageScroller from './MessageScroller'
import Compose from './ComposeCustomHook'
import Button from '../components/Button'
import Container from '../components/Container'
import Info from '../components/Info'

const API = process.env.REACT_APP_API
const MESSAGE_FETCH_INTERVAL = 2000

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
    setMessages(messages => olderMessages.concat(messages))
    setLoading(false)
    setEarliest(
      olderMessages.length ? Date.parse(olderMessages[0].time) : earliest
    )
  }

  const handleCompose = text => {
    setMessages(messages =>
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
        const timer = setInterval(async () => {
          const response = await fetch(`${API}/new-message`)
          const newMessage = await response.json()
          setMessages(messages => messages.concat(newMessage))
        }, MESSAGE_FETCH_INTERVAL)
        return () => clearInterval(timer)
      }
    },
    [noisy]
  )

  return (
    <>
      <Info>
        <span>Message Count: {messages.length}</span>
        <Button style={{ float: 'right' }} onClick={() => toggleNoise(!noisy)}>
          {noisy ? 'Silence!' : 'Ok go'}
        </Button>
      </Info>
      <Container>
        <MessageScroller
          data={messages}
          loadMore={fetchMessages}
          loading={loading}
        />
        <Compose onMessage={handleCompose} />
      </Container>
    </>
  )
}

export default Chat

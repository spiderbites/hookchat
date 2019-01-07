import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import throttle from 'lodash/throttle'
import Message from './Message'

const MessageList = styled.div`
  background-color: palegoldenrod;
  overflow-y: auto;
  margin: 0px auto;
  height: 600px;
  padding: 20px;
`

function Messages (props) {
  const { users, data, loading, loadMore } = props
  const listRef = useRef(null)
  useEffect(() => {
    const list = listRef.current
    list.scrollTop = list.scrollHeight
  })

  const checkScroll = e => {
    if (e.target.scrollTop < 50 && !loading) {
      loadMore()
    }
  }

  const handleScroll = e => {
    e.persist()
    throttle(checkScroll, 500)(e)
  }

  return (
    <MessageList ref={listRef} onScroll={handleScroll}>
      {loading && <div>Loading...</div>}
      {data.map((msg, i) => (
        <Message
          key={i}
          avatar={users[msg.userId].avatar}
          username={users[msg.userId].username}
          {...msg}
        />
      ))}
    </MessageList>
  )
}

export default Messages

import React from 'react'
import styled from 'styled-components'
import { UsersContext } from './users-context'
import Avatar from './Avatar'

const Username = styled.span`
  font-weight: 900;
`

const Date = styled.span`
  margin-left: 5px;
`

const Container = styled.div`
  display: flex;
  margin: 20px 0;
`

const Content = styled.div`
  margin-left: 15px;
`

const Message = ({ time, userId, text }) => {
  return (
    <UsersContext.Consumer>
      {users => {
        return (
          <Container>
            <Avatar src={users[userId].avatar} />
            <Content>
              <Username>{users[userId].username}</Username>
              <Date>{time.toString()}</Date>
              <div>{text}</div>
            </Content>
          </Container>
        )
      }}
    </UsersContext.Consumer>
  )
}

export default Message

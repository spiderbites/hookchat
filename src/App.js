import React, { Component } from 'react'
import styled from 'styled-components'
import Messages from './MessagesHooks'
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

class App extends Component {
  static contextType = ApiContext
  interval = null

  state = {
    messages: [],
    earliest: Date.now(),
    loading: false,
    usersById: {},
    currentUser: {}
  }

  async componentDidMount () {
    await this.fetchUsers()
    await this.fetchCurrentUser()
    await this.fetchMessages()
    this.interval = setInterval(this.fetchNewMessage, 5000)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  fetchUsers = async () => {
    const response = await fetch(`${this.context.api}/users`)
    const users = await response.json()
    this.setState({ users: keyBy(users, 'id') })
  }

  fetchCurrentUser = async () => {
    const response = await fetch(`${this.context.api}/me`)
    const currentUser = await response.json()
    this.setState({ currentUser })
  }

  fetchMessages = async () => {
    this.setState({ loading: true })
    const response = await fetch(
      `${this.context.api}/messages?before=${this.state.earliest}&count=10`
    )
    const olderMessages = await response.json()
    this.setState(prevState => ({
      messages: olderMessages.concat(prevState.messages),
      loading: false,
      earliest: olderMessages.length
        ? Date.parse(olderMessages[0].time)
        : prevState.earliest
    }))
  }

  fetchNewMessage = async () => {
    const response = await fetch(`${this.context.api}/new-message`)
    const newMessage = await response.json()
    this.setState(prevState => ({
      messages: prevState.messages.concat(newMessage)
    }))
  }

  handleCompose = text => {
    this.setState(prevState => ({
      messages: prevState.messages.concat({
        time: new Date(),
        text,
        userId: this.state.currentUser.id
      })
    }))
  }

  render () {
    const { messages, loading, users } = this.state
    return (
      <Container>
        <div>Message Count: {this.state.messages.length}</div>
        <Messages
          users={users}
          data={messages}
          loadMore={this.fetchMessages}
          loading={loading}
        />
        <Compose onMessage={this.handleCompose} />
      </Container>
    )
  }
}

export default App

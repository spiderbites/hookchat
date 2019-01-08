import React, { Component } from 'react'
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

class App extends Component {
  interval = null

  state = {
    messages: [],
    earliest: Date.now(),
    loading: false,
    noisy: true
  }

  async componentDidMount () {
    await this.fetchMessages()
    this.interval = setInterval(this.fetchNewMessage, MESSAGE_FETCH_INTERVAL)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  fetchMessages = async () => {
    this.setState({ loading: true })
    const response = await fetch(
      `${API}/messages?before=${this.state.earliest}&count=10`
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
    if (!this.state.noisy) {
      return
    }
    const response = await fetch(`${API}/new-message`)
    const newMessage = await response.json()
    this.setState(prevState => ({
      messages: prevState.messages.concat(newMessage)
    }))
  }

  toggleNoise = () => {
    this.setState({ noisy: !this.state.noisy })
  }

  handleCompose = (text, userId) => {
    this.setState(prevState => ({
      messages: prevState.messages.concat({
        time: new Date(),
        text,
        userId
      })
    }))
  }

  render () {
    const { messages, loading } = this.state
    return (
      <Container>
        <div>Message Count: {this.state.messages.length}</div>
        <button onClick={this.toggleNoise}>
          {this.state.noisy ? 'Silence!' : 'Ok go'}
        </button>
        <Messages
          data={messages}
          loadMore={this.fetchMessages}
          loading={loading}
        />
        <UserContext.Consumer>
          {({ currentUser }) => (
            <Compose
              onMessage={text => this.handleCompose(text, currentUser.id)}
            />
          )}
        </UserContext.Consumer>
      </Container>
    )
  }
}

export default App

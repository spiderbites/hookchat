import React, { Component } from 'react'
import Messages from './Messages'
import Compose from './Compose'
import { UserContext } from './UserContext'
import Button from '../components/Button'
import Container from '../components/Container'
import Info from '../components/Info'

const API = process.env.REACT_APP_API
const MESSAGE_FETCH_INTERVAL = 2000

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
      <>
        <Info>
          <span>Message Count: {this.state.messages.length}</span>
          <Button
            style={{ float: 'right' }}
            onClick={() => this.setState({ noisy: !this.state.noisy })}
          >
            {this.state.noisy ? 'Silence!' : 'Ok go'}
          </Button>
        </Info>
        <Container>
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
      </>
    )
  }
}

export default App

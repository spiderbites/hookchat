import React, { Component } from 'react'
import MessageScroller from './MessageScroller'
import Compose from './Compose'
import { UserContext } from './UserContext'
import Button from '../components/Button'
import Container from '../components/Container'
import Info from '../components/Info'

const API = process.env.REACT_APP_API
const MESSAGE_FETCH_INTERVAL = 2000

class Chat extends Component {
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

  componentDidUpdate (prevProps) {
    // If the noisy parameter has changed, clear the interval
    if (prevProps.noisy !== this.props.noisy) {
      clearInterval(this.interval)
    }
    // If going from not noisy to noisy, set the interval
    if (!prevProps.noisy && this.props.noisy) {
      this.interval = setInterval(this.fetchNewMessage, MESSAGE_FETCH_INTERVAL)
    }
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
    if (this.state.noisy) {
      const response = await fetch(`${API}/new-message`)
      const newMessage = await response.json()
      this.setState(prevState => ({
        messages: prevState.messages.concat(newMessage)
      }))
    }
  }

  handleCompose = (text, userId) => {
    const newMessage = {
      time: new Date(),
      text,
      userId
    }

    this.setState(prevState => ({
      messages: prevState.messages.concat(newMessage)
    }))
  }

  render () {
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
          <MessageScroller
            data={this.state.messages}
            loadMore={this.fetchMessages}
            loading={this.state.loading}
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

export default Chat

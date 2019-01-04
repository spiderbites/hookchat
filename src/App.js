import React, { Component } from 'react'
import styled from 'styled-components'
import Messages from './Messages'
import Compose from './Compose'
import { messages, generateMessage, currentUser } from './data'

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
`

class App extends Component {
  state = { messages: [], loadingMore: false, earliest: null }

  async componentDidMount () {
    this.loadMore()
    setInterval(this.getNewMessage, 5000)
  }

  getNewMessage = () => {
    this.setState(prevState => ({
      messages: prevState.messages.concat(generateMessage({ fresh: true }))
    }))
  }

  getMessages = (before, count) => {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        const filtered = messages.filter(d => d.time < before)
        const sliced = filtered.slice(filtered.length - count, filtered.length)
        resolve(sliced)
      }, 500)
    })
  }

  loadMore = async () => {
    this.setState({ loadingMore: true })
    const messages = await this.getMessages(
      this.state.earliest || Date.now(),
      10
    )
    this.setState(prevState => {
      const newMessages = messages.concat(prevState.messages)
      return {
        loadingMore: false,
        messages: newMessages,
        earliest: newMessages[0].time
      }
    })
  }

  handleCompose = text => {
    this.setState(prevState => ({
      messages: prevState.messages.concat({
        time: new Date(),
        text,
        userId: currentUser.id
      })
    }))
  }

  render () {
    return (
      <Container>
        <div>Num messages: {this.state.messages.length}</div>
        <Messages
          data={this.state.messages}
          loadMore={this.loadMore}
          loading={this.state.loadingMore}
        />
        <Compose onMessage={this.handleCompose} />
      </Container>
    )
  }
}

export default App

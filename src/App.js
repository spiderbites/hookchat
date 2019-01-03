import React, { Component } from 'react'
import styled from 'styled-components'
import Messages from './Messages'
import Compose from './Compose'
import { messages, users, generateMessage, currentUser } from './data'
import keyBy from 'lodash/keyBy'

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1000px;
`

class App extends Component {
  state = { messages: [], users: [], loadingMore: false, earliest: null }

  async componentDidMount () {
    this.loadMore()
    setInterval(this.getNewMessage, 5000)
  }

  getNewMessage = () => {
    this.setState(prevState => ({
      messages: prevState.messages.concat(generateMessage({ fresh: true }))
    }))
  }

  initData = () => {
    this.setState({ users: keyBy(users, 'id') })
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
        <Messages
          data={this.state.messages}
          onScrollTop={this.loadMore}
          loading={this.state.loadingMore}
        />
        <Compose onMessage={this.handleCompose} />
      </Container>
    )
  }
}

export default App

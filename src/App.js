import React, { Component } from 'react'
import Messages from './Messages'
import data from './data.json'

class App extends Component {
  state = { messages: [], loadingMore: false }

  async componentDidMount () {
    this.setState({ loadingMore: true })
    const messages = await this.getData(Date.now(), 10)
    console.log(messages)
    this.setState(prevState => ({
      loadingMore: false,
      messages: messages.concat(prevState.messages)
    }))
  }

  getData (before, count) {
    return data
      .sort()
      .filter(d => d.time <= before)
      .slice(data.length - count, data.length)
  }

  render () {
    return <Messages data={this.state.messages} />
  }
}

export default App

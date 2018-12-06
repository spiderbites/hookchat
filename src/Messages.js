import React from 'react'
import Message from './Message'

class Messages extends React.Component {
  container = null

  state = {
    atTop: true
  }

  handleScroll = e => {
    if (this.container) {
      if (this.container.scrollTop < 10 && !this.state.atTop) {
        console.log('do it')
        this.setState({ atTop: true })
      } else if (this.container.scrollTop >= 10) {
        this.setState({ atTop: false })
      }
    }
  }

  render () {
    return (
      <div
        ref={ref => (this.container = ref)}
        style={{ overflowY: 'auto', height: '75px' }}
        onScroll={this.handleScroll}
      >
        {this.props.data.map((msg, i) => (
          <Message key={i}>{msg.text}</Message>
        ))}
      </div>
    )
  }
}

export default Messages

import React from 'react'
import Message from './Message'
import styled from 'styled-components'
import throttle from 'lodash/throttle'

const MessageList = styled.div`
  background-color: palegoldenrod;
  overflow-y: auto;
  margin: 0px auto;
  height: 600px;
  padding: 20px;
`

class Messages extends React.Component {
  listRef = React.createRef()

  state = {
    atTop: true
  }

  componentDidMount () {
    this.listRef.current.scrollTop = this.listRef.current.scrollHeight
  }

  checkWheel = e => {
    if (
      e.deltaY < 0 &&
      this.listRef.current.scrollTop === 0 &&
      !this.props.loading
    ) {
      this.props.onScrollTop()
    }
  }

  delayedCallback = throttle(this.checkWheel, 1500, { trailing: false })

  handleWheel = e => {
    e.persist()
    this.delayedCallback(e)
  }

  getSnapshotBeforeUpdate (prevProps, prevState) {
    const list = this.listRef.current
    console.log(list.scrollHeight - list.scrollTop, list.clientHeight)
    if (
      prevProps.data.length < this.props.data.length &&
      list.scrollHeight - list.scrollTop === list.clientHeight
    ) {
      return true
    }
    return null
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (prevProps.data.length === 0 || snapshot !== null) {
      this.listRef.current.scrollTop = this.listRef.current.scrollHeight
    }
  }

  render () {
    return (
      <MessageList ref={this.listRef} onWheel={this.handleWheel}>
        {this.props.loading && <div>Loading...</div>}
        {this.props.data.map((msg, i) => (
          <Message key={i} {...msg} />
        ))}
      </MessageList>
    )
  }
}

export default Messages

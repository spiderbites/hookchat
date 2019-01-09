import React, { Component } from 'react'
import styled from 'styled-components'

const StyledInput = styled.input`
  width: 100%;
  height: 35px;
  border-radius: 0px;
  border: none;
  font-size: 16px;
  box-sizing: border-box;
  padding: 5px;
`

class Compose extends Component {
  state = {
    text: ''
  }

  onChange = e => {
    this.setState({ text: e.target.value })
  }

  onKeyPress = e => {
    if (e.key === 'Enter') {
      this.props.onMessage(e.target.value)
      this.setState({ text: '' })
    }
  }

  render () {
    return (
      <StyledInput
        placeholder='Talk talk...'
        value={this.state.text}
        onChange={this.onChange}
        onKeyPress={this.onKeyPress}
      />
    )
  }
}

export default Compose

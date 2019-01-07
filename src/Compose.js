import React, { Component } from 'react'
import styled from 'styled-components'

const StyledInput = styled.input`
  width: 100%;
  height: 25px;
  border-radius: 4px;
  border: 2px solid gray;
  font-size: 16px;
  box-sizing: border-box;
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
        value={this.state.text}
        onChange={this.onChange}
        onKeyPress={this.onKeyPress}
      />
    )
  }
}

export default Compose

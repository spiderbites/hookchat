import React, { Component } from 'react'
import Input from '../components/Input'
import validate from '../helpers/validate'

class Compose extends Component {
  state = {
    text: '',
    error: false
  }

  onKeyUp = e => {
    if (this.state.error || this.state.text === '') return
    if (e.key === 'Enter') {
      this.props.onMessage(e.target.value)
      this.setState({ text: '' })
    }
  }

  onChange = e => {
    const text = e.target.value
    this.setState({ text, error: validate(text) })
  }

  render () {
    const { error, text } = this.state
    return (
      <Input
        error={error}
        placeholder='Talk talk...'
        value={text}
        onChange={this.onChange}
        onKeyUp={this.onKeyUp}
      />
    )
  }
}

export default Compose

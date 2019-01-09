import React, { useState } from 'react'
import Input from '../components/Input'
import validate from '../helpers/validate'

function Compose (props) {
  const [text, setText] = useState('')
  const [error, setError] = useState(false)

  const onKeyUp = e => {
    if (error || text === '') return
    if (e.key === 'Enter') {
      props.onMessage(e.target.value)
      setText('')
    }
  }

  const onChange = e => {
    const text = e.target.value
    setText(text)
    setError(validate(text))
  }

  return (
    <Input
      error={error}
      placeholder='Talk talk...'
      value={text}
      onChange={onChange}
      onKeyUp={onKeyUp}
    />
  )
}

export default Compose

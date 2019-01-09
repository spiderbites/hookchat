import React, { useState } from 'react'
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

function Compose (props) {
  const [text, setText] = useState('')
  const onKeyPress = e => {
    if (e.key === 'Enter') {
      props.onMessage(e.target.value)
      setText('')
    }
  }

  return (
    <StyledInput
      placeholder='Talk talk...'
      value={text}
      onChange={e => setText(e.target.value)}
      onKeyPress={onKeyPress}
    />
  )
}

export default Compose

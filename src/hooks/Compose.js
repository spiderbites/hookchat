import React, { useState } from 'react'
import styled from 'styled-components'

const StyledInput = styled.input`
  width: 100%;
  height: 25px;
  border-radius: 4px;
  border: 2px solid gray;
  font-size: 16px;
  box-sizing: border-box;
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
      value={text}
      onChange={e => setText(e.target.value)}
      onKeyPress={onKeyPress}
    />
  )
}

export default Compose

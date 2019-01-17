import React, { useRef } from 'react'
import Input from '../components/Input'
import validate from '../helpers/validate'
import useValidatingInput from './useValidatingInput'
import useFocus from './useFocus'

function Compose (props) {
  const [text, setText, error] = useValidatingInput('', validate)
  const inputEl = useRef(null)
  useFocus(inputEl)

  const onKeyUp = e => {
    if (error || text === '') return
    if (e.key === 'Enter') {
      props.onMessage(e.target.value)
      setText('')
    }
  }

  return (
    <Input
      ref={inputEl}
      error={error}
      placeholder='Talk talk...'
      value={text}
      onChange={e => setText(e.target.value)}
      onKeyUp={onKeyUp}
    />
  )
}

export default Compose

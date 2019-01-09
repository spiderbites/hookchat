import React from 'react'
import Input from '../components/Input'
import validate from '../helpers/validate'
import useValidatingInput from './useValdatingInput'

function Compose (props) {
  const { value, setValue, error } = useValidatingInput('', validate)

  const onKeyUp = e => {
    if (error || value === '') return
    if (e.key === 'Enter') {
      props.onMessage(e.target.value)
      setValue('')
    }
  }

  return (
    <Input
      error={error}
      placeholder='Talk talk...'
      value={value}
      onChange={e => setValue(e.target.value)}
      onKeyUp={onKeyUp}
    />
  )
}

export default Compose

import { useState } from 'react'

export default function useValidatingInput (initial, validate) {
  const [value, setValue] = useState(initial)
  const error = validate(value)
  return { value, setValue, error }
}

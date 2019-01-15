import { useEffect } from 'react'

function useFocus (ref) {
  useEffect(() => {
    ref.current.focus()
  }, [])
}

export default useFocus

import React, { useEffect, useReducer } from 'react'
import keyBy from 'lodash/keyBy'
const API = process.env.REACT_APP_API

export const UserContext = React.createContext()

function reducer (state, action) {
  switch (action.type) {
    case 'request':
      return {
        loading: true,
        ...state
      }
    case 'success':
      return {
        usersById: keyBy(action.payload.users, 'id'),
        currentUser: action.payload.currentUser,
        dataReady: true,
        loading: false,
        error: null
      }
    case 'failure':
      return {
        dataReady: false,
        loading: false,
        error: action.error
      }
    default:
      return state
  }
}

const initialState = {
  loading: false,
  dataReady: false,
  error: null,
  usersById: {},
  currentUser: {}
}

export const UserProvider = props => {
  const [state, dispatch] = useReducer(reducer, initialState)

  const fetchUsers = async () => {
    const response = await fetch(`${API}/users`)
    return response.json()
  }

  const fetchCurrentUser = async () => {
    const response = await fetch(`${API}/me`)
    return response.json()
  }

  const fetchData = async () => {
    dispatch({ type: 'request' })
    try {
      const [users, currentUser] = await Promise.all([
        fetchUsers(),
        fetchCurrentUser()
      ])
      dispatch({ type: 'success', payload: { users, currentUser } })
    } catch (error) {
      dispatch({ type: 'failure', error })
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (state.error) {
    return state.error.message
  }

  if (!state.dataReady) {
    return 'Loading users...'
  }

  return (
    <UserContext.Provider value={state}>{props.children}</UserContext.Provider>
  )
}

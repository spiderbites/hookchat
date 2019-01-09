import React, { useEffect, useReducer } from 'react'
import keyBy from 'lodash/keyBy'
const API = process.env.REACT_APP_API

export const UserContext = React.createContext()

function reducer (state, action) {
  switch (action.type) {
    case 'data_fetched':
      return {
        usersById: keyBy(action.payload.users, 'id'),
        currentUser: action.payload.currentUser,
        dataReady: true
      }
    default:
      return state
  }
}

const initialState = {
  usersById: {},
  currentUser: {},
  dataReady: false
}

export function UserProvider (props) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const fetchUsers = async () => {
    const response = await fetch(`${API}/users`)
    return response.json()
  }

  const fetchCurrentUser = async () => {
    const response = await fetch(`${API}/me`)
    return response.json()
  }

  useEffect(() => {
    Promise.all([fetchUsers(), fetchCurrentUser()]).then(data => {
      const [users, currentUser] = data
      dispatch({ type: 'data_fetched', payload: { users, currentUser } })
    })
  }, [])

  if (!state.dataReady) {
    return 'Loading users...'
  }
  return (
    <UserContext.Provider value={state}>{props.children}</UserContext.Provider>
  )
}

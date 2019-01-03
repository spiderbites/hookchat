import React from 'react'
import { users } from './data'
import keyBy from 'lodash/keyBy'

export const UsersContext = React.createContext(keyBy(users, 'id'))

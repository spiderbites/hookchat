import React, { Component } from 'react'
import keyBy from 'lodash/keyBy'
const API = process.env.REACT_APP_API

export const UserContext = React.createContext()

export class UserProvider extends Component {
  state = {
    dataReady: false,
    usersById: {},
    currentUser: {}
  }

  async componentDidMount () {
    await Promise.all([this.fetchUsers(), this.fetchCurrentUser()])
    this.setState({ dataReady: true })
  }

  fetchUsers = async () => {
    const response = await fetch(`${API}/users`)
    const users = await response.json()
    this.setState({ usersById: keyBy(users, 'id') })
  }

  fetchCurrentUser = async () => {
    const response = await fetch(`${API}/me`)
    const currentUser = await response.json()
    this.setState({ currentUser })
  }

  render () {
    if (!this.state.dataReady) {
      return 'loading users...'
    }
    return (
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    )
  }
}

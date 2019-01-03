import faker from 'faker'
import times from 'lodash/times'
import sample from 'lodash/sample'
import sortBy from 'lodash/sortBy'

const NUM_USERS = 25

let users = times(NUM_USERS, n => {
  const { username, avatar } = faker.helpers.contextualCard()
  return { username, avatar, id: n + 1 }
})

let yesterday = new Date()
yesterday.setDate(yesterday.getDate() - 1)
const today = new Date()

const generateMessage = ({ fresh = false }) => {
  return {
    time: fresh ? new Date() : faker.date.between(yesterday, today),
    text: faker.hacker.phrase(),
    userId: sample(users).id
  }
}

const messages = sortBy(times(1500, generateMessage), 'time')

const { username, avatar } = faker.helpers.contextualCard()
const currentUser = { username, avatar, id: NUM_USERS + 1 }

const allUsers = users.concat(currentUser)

export { messages, generateMessage, allUsers as users, currentUser }

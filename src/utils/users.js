const users = []

// addUser, removeUser, getUser

const addUser = ({ id, username }) => {
  // clean data
  username = username.trim().toLowerCase()

  // Validate the data
  if (!username) {
    return {
      error: 'Username is required'
    }
  }

  // check for existing user
  const existingUser = users.find((user) => {
    return user.username === username
  })

  // validate username
  if (existingUser) {
    return {
      error: 'Username is taken'
    }
  }

  // store user
  const user = { id, username }
  users.push(user)
  return { user }
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id)

  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

const getUser = (id) => {
  return users.find((user) => user.id === id)
}

const getUsers = () => users

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsers
}

import bcrypt from 'bcrypt'

const users = [
  {
    name: 'admin User',
    email: 'admin@test.com',
    password: bcrypt.hashSync('12345678', 10),
    isAdmin: true,
  },
  {
    name: 'test User',
    email: 'test@test.com',
    password: bcrypt.hashSync('12345678', 10),
    isAdmin: false,
  },
  {
    name: 'khan User',
    email: 'khan@test.com',
    password: bcrypt.hashSync('12345678', 10),
    isAdmin: false,
  },
]

export default users

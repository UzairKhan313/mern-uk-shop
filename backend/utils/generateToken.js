import jwt from 'jsonwebtoken'

const generateToken = (res, userID) => {
  const token = jwt.sign({ userId: userID }, process.env.JWT_SECRET, {
    expiresIn: '3d',
  })
  // res.clearCookie('jwt')

  // set jwt as Http only cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    // expires: new Date(Date.now() + 10000),
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  })
}
export default generateToken

import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONOG_URI)
    console.log(`Mongo Db connected with host : ${conn.connection.host}`)
  } catch (err) {
    console.log(`Error : ${err.message}`)
    process.exit(1)
  }
}

export default connectDB

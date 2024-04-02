// A sript file to uplaod all our dummy data to the data base.
// This file is completely isolated from the rest of the application.

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import colors from 'colors'

// data files
import users from './data/user.js'
import products from './data/products.js'

// modal files.
import Product from './models/product.js'
import User from './models/user.js'
import Order from './models/order.js'

// connection db file.
import connectDB from './config/DB.js'

dotenv.config() // config global varaibles.
connectDB() // Connection to Database.

const importData = async () => {
  try {
    // first Delete all the existing Data in Data base.
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    // inserting user data.
    const createdUsers = await User.insertMany(users)
    const adminUser = createdUsers[0]._id

    // adding user field to the product data. because it don't have.
    const sampleProduct = products.map((product) => {
      return { ...product, user: adminUser }
    })

    await Product.insertMany(sampleProduct)

    console.log('Data imported to data base. '.green.inverse)
    process.exit()
  } catch (error) {
    console.log(`Error : ${error}`.red.inverse)
  }
}

const destroyData = async () => {
  try {
    // first Delete all the existing Data in Data base.
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()

    console.log('Data imported to data base. '.green.inverse)
    process.exit()
  } catch (error) {
    console.log(`Error : ${error}`.red.inverse)
  }
}
console.log(process.argv)

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}

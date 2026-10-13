import 'dotenv/config'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import userModel from '../models/userModel.js'
import { getMongoConnectionUri } from '../config/mongodb.js'
const email = process.env.ADMIN_EMAIL
const password = process.env.ADMIN_PASSWORD

if (!email || !password) {
  throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set before seeding')
}

if (password.length < 8) {
  throw new Error('ADMIN_PASSWORD must be at least 8 characters long')
}

try {
  await mongoose.connect(getMongoConnectionUri())

  const passwordHash = await bcrypt.hash(password, 10)
  await userModel.findOneAndUpdate(
    { email },
    {
      name: 'Administrator',
      email,
      password: passwordHash,
      role: 'admin',
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  )

  console.log(`Admin account seeded: ${email}`)
} finally {
  await mongoose.disconnect()
}

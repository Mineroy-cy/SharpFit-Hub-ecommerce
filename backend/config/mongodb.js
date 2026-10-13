import mongoose from 'mongoose';

const getMongoConnectionUri = () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI_PRODUCTION
  if (!mongoUri) {
    throw new Error('MONGODB_URI or MONGO_URI_PRODUCTION must be set')
  }

  return /\/[^/?]+(?:\?|$)/.test(mongoUri.replace(/^mongodb\+srv?:\/\/[^/]+/, ''))
    ? mongoUri
    : `${mongoUri}/e-commerce`
}

const connnectDB = async () => {
  mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');  
  }) 
  await mongoose.connect(getMongoConnectionUri())
}

export { getMongoConnectionUri }
export default connnectDB;
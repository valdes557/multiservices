import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null; }

declare global { var _mongoose: MongooseCache | undefined; }

const cached: MongooseCache = global._mongoose || { conn: null, promise: null };
global._mongoose = cached;

async function dbConnect() {
  // On ne lit/valide l'URI qu'au moment réel de la connexion (jamais au build).
  if (!MONGODB_URI) {
    throw new Error('La variable d\'environnement MONGODB_URI n\'est pas définie.');
  }
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }).then((m) => m);
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }
  return cached.conn;
}

export default dbConnect;
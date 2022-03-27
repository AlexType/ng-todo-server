import mongoose from 'mongoose';

const User = new mongoose.Schema({
  createdAt: { type: Number, default: new Date().getTime(), required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  avatar: { type: String },
});

export default mongoose.model('User', User);

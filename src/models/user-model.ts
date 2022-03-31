import { model, Schema } from 'mongoose';

const UserSchema = new Schema({
  createdAt: { type: Number, default: new Date().getTime() },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  avatar: { type: String },
});

export default model('User', UserSchema);

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema } = mongoose;

// ----------------- User Schema -----------------
export const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  displayName: { type: String },
  avatarUrl: { type: String },
});

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ----------------- Room Schema -----------------
export const roomSchema = new Schema({
  name: { type: String, required: true },
  members: [{ type: String }], // users who joined
  pending: [{ type: String }], // invited but not joined
});

// ----------------- Message Schema -----------------
const messageSchema = new Schema({
  roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
  sender: { type: String, required: true },
  type: { type: String, required: true }, // "text" or "product"
  content: { type: Schema.Types.Mixed, required: true }, // string for text OR object for product
  votes: { type: Number, default: 0 },
  voters: { type: [{ username: String, vote: Number }], default: [] }
}, { timestamps: true });

// ----------------- Models -----------------
export const User = mongoose.model("User", userSchema);
export const Room = mongoose.model("Room", roomSchema);
export const Message = mongoose.model("Message", messageSchema);

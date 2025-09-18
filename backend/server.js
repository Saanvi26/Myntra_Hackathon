import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import { User, Room, Message } from "./models.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const MONGO_URI =
  process.env.MONGO_URI;
await mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
console.log("Connected to MongoDB");


// Signup
app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password, displayName } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ error: "All fields required" });

    const existing = await User.findOne({
      $or: [
        { username: { $regex: new RegExp("^" + username + "$", "i") } },
        { email: email },
      ],
    });
    if (existing)
      return res.status(400).json({ error: "Username or email exists" });

    const user = await User.create({ username, email, password, displayName });
    res.json({
      success: true,
      user: { username: user.username, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const match = await user.comparePassword(password);
    if (!match) return res.status(400).json({ error: "Invalid password" });

    res.json({
      success: true,
      user: { username: user.username, email: user.email },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all users (for dropdown)
app.get("/api/users", async (req, res) => {
  const users = await User.find({}, { username: 1, displayName: 1 }).lean();
  res.json(users);
});


app.post("/api/rooms", async (req, res) => {
  const { name, creator, invited } = req.body; 
  if (!name || !creator)
    return res.status(400).json({ error: "Name & creator required" });

  const room = await Room.create({
    name,
    members: [creator], 
    pending: invited || [],
  });

  res.json(room);
});

// List rooms for a user 
app.get("/api/rooms", async (req, res) => {
  const username = req.query.username;
  const rooms = await Room.find({
    members: { $regex: new RegExp("^" + username + "$", "i") },
  }).lean();
  res.json(rooms);
});

// Get pending invites for a user 
app.get("/api/rooms/pending", async (req, res) => {
  const username = req.query.username;
  if (!username) return res.status(400).json({ error: "No username provided" });

  const rooms = await Room.find({
    pending: { $regex: new RegExp("^" + username + "$", "i") },
  }).lean();
  res.json(rooms);
});

// Accept invite
app.post("/api/rooms/:roomId/join", async (req, res) => {
  const { username } = req.body;
  const room = await Room.findById(req.params.roomId);
  if (!room) return res.status(404).json({ error: "Room not found" });

  // remove from pending 
  room.pending = room.pending.filter(
    (u) => u.toLowerCase() !== username.toLowerCase()
  );

  // add to members if not already present
  if (!room.members.find((u) => u.toLowerCase() === username.toLowerCase())) {
    room.members.push(username);
  }

  await room.save();

  io.to(room._id.toString()).emit("system_message", {
    text: `${username} joined the room.`,
  });
  res.json(room);
});

// Get last messages
app.get("/api/rooms/:roomId/messages", async (req, res) => {
  const msgs = await Message.find({ roomId: req.params.roomId })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  res.json(msgs.reverse());
});

// Vote message
app.post("/api/messages/:msgId/vote", async (req, res) => {
  const { username, vote } = req.body; // vote = 1 or -1
  const msg = await Message.findById(req.params.msgId);
  if (!msg) return res.status(404).json({ error: "Message not found" });

  msg.voters = msg.voters || [];
  const existing = msg.voters.find(
    (v) => v.username.toLowerCase() === username.toLowerCase()
  );
  if (existing) {
    if (existing.vote !== vote) {
      msg.votes -= existing.vote;
      existing.vote = vote;
      msg.votes += vote;
    }
  } else {
    msg.voters.push({ username, vote });
    msg.votes += vote;
  }

  await msg.save();
  io.to(msg.roomId.toString()).emit("vote_updated", {
    messageId: msg._id,
    votes: msg.votes,
  });
  res.json(msg);
});

// ---------- Socket.IO real-time ----------
io.on("connection", (socket) => {
  console.log("Socket connected", socket.id);

  socket.on("join_room", async ({ roomId, username }) => {
    const room = await Room.findById(roomId);
    if (!room) return;

    if (
      !room.members.find((u) => u.toLowerCase() === username.toLowerCase())
    )
      return; 

    socket.join(roomId);
    socket.data.username = username;
    socket.data.roomId = roomId;

  });

  socket.on("send_message", async ({ roomId, sender, type, content }) => {
    const msg = await Message.create({
      roomId,
      sender,
      type,
      content,
      votes: 0,
      voters: [],
    });
    io.to(roomId).emit("message", msg);
  });

  socket.on("vote", async ({ messageId, username, vote }) => {
    const msg = await Message.findById(messageId);
    if (!msg) return;
    msg.voters = msg.voters || [];
    const existing = msg.voters.find(
      (v) => v.username.toLowerCase() === username.toLowerCase()
    );
    if (existing) {
      if (existing.vote !== vote) {
        msg.votes -= existing.vote;
        existing.vote = vote;
        msg.votes += vote;
      }
    } else {
      msg.voters.push({ username, vote });
      msg.votes += vote;
    }
    await msg.save();
    io.to(msg.roomId.toString()).emit("vote_updated", {
      messageId: msg._id,
      votes: msg.votes,
    });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log("Server listening on port", PORT));

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    clerkId: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.model('User', userSchema);

export async function findUserByEmail(email) {
  const user = await User.findOne({ email: email?.toLowerCase() });
  return mapUser(user);
}

export async function findUserById(id) {
  const user = await User.findById(id);
  return mapUser(user);
}

export async function findUserByClerkId(clerkId) {
  const user = await User.findOne({ clerkId });
  return mapUser(user);
}

export async function upsertClerkUser({ clerkId, name, email }) {
  const normalizedEmail = email.toLowerCase();
  const user = await User.findOneAndUpdate(
    { $or: [{ clerkId }, { email: normalizedEmail }] },
    { $set: { clerkId, name, email: normalizedEmail } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );

  return mapUser(user);
}

function mapUser(user) {
  if (!user) return null;

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    clerkId: user.clerkId,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export default User;

import mongoose from "mongoose";
const { Schema } = mongoose;

const studentSchema = new Schema({
  // Define user fields here matching the GraphQL schema
  name: { type: String, required: [true, "name fields are required"] },
  email: {
    type: String,
    required: [true, "email fields are required"],
  },
  age: {
    type: Number,
    required: [true, "age fields are required"],
  },
  address: {
    type: String,
    required: [true, "address fields are required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Student ||
  mongoose.model("Student", studentSchema);

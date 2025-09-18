import mongoose from "mongoose";
const { Schema } = mongoose;

const studentSchema = new Schema(
  {
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
  },
  {
    timestamps: true, // Enable automatic timestamps
    versionKey: false, // Disable __v field
  }
);

// Pre-save middleware untuk update updatedAt
studentSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

// Pre-update middleware untuk update updatedAt pada update operations
studentSchema.pre(
  ["updateOne", "findOneAndUpdate", "updateMany"],
  function (next) {
    this.set({ updatedAt: new Date() });
    next();
  }
);

export default mongoose.models.Student ||
  mongoose.model("Student", studentSchema);

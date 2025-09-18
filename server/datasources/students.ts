// MongoDB Data Source for Students
import Student from "../models/student";
import { MongoDataSource } from "apollo-datasource-mongodb";
import { ObjectId } from "mongodb";
import { StudentDocument } from "../../app/study-graphql/types/student";

export default class Students extends MongoDataSource<StudentDocument> {
  // Function to fetch all students with filtering, sorting, and pagination
  async getAllStudents({
    searchTerm,
    sortBy = "name",
    sortOrder = "asc",
    limit = 50,
    offset = 0,
  }: {
    searchTerm?: string;
    sortBy?: string;
    sortOrder?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    try {
      let query = {};

      // Build search query if searchTerm is provided (same logic as searchStudents)
      if (searchTerm && searchTerm.trim() !== "") {
        const searchRegex = new RegExp(searchTerm, "i"); // Case-insensitive search
        query = {
          $or: [
            { name: searchRegex },
            { email: searchRegex },
            { address: searchRegex },
            // For age search, check if searchTerm is a number
            ...(isNaN(Number(searchTerm)) ? [] : [{ age: Number(searchTerm) }]),
          ],
        };
      }

      // Build sort object
      const sortObj: any = {};
      sortObj[sortBy] = sortOrder === "desc" ? -1 : 1;

      // Execute query with sorting, limit, and offset
      const students = await Student.find(query)
        .sort(sortObj)
        .limit(limit)
        .skip(offset);

      return students;
    } catch (error) {
      throw new Error("Failed to fetch students");
    }
  }

  // Function to fetch a single student
  async getStudent({ id }: { id: string }) {
    try {
      return await Student.findById(id);
    } catch (error) {
      throw new Error("Failed to fetch student");
    }
  }

  // Function to create a new student
  async createStudent({ input }: any) {
    try {
      const now = new Date();
      const studentData = {
        ...input,
        createdAt: now,
        updatedAt: now,
      };

      const newStudent = await Student.create(studentData);
      console.log("Created student with timestamps:", {
        id: newStudent._id,
        createdAt: newStudent.createdAt,
        updatedAt: newStudent.updatedAt,
      });

      return newStudent;
    } catch (error) {
      console.error("Error creating student:", error);
      throw new Error("Failed to create student");
    }
  }

  // Function to update existing student
  async updateStudent({ input }: any) {
    try {
      const { id, ...updateData } = input;
      const now = new Date();

      const updatedStudent = await Student.findByIdAndUpdate(
        id,
        {
          ...updateData,
          updatedAt: now,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedStudent) {
        throw new Error("Student not found");
      }

      console.log("Updated student with timestamps:", {
        id: updatedStudent._id,
        createdAt: updatedStudent.createdAt,
        updatedAt: updatedStudent.updatedAt,
      });

      return updatedStudent;
    } catch (error) {
      console.error("Error updating student:", error);
      throw new Error("Failed to update student");
    }
  }

  // Function to delete existing student
  async deleteStudent({ id }: { id: string }): Promise<string> {
    try {
      await Student.findByIdAndDelete(id);
      return "Student deleted successfully";
    } catch (error) {
      throw new Error("Failed to delete student");
    }
  }
}

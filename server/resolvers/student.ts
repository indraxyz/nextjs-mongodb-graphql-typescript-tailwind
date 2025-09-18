const resolvers = {
  Student: {
    // Resolver untuk mengkonversi _id menjadi id
    id: (parent: any) => parent._id?.toString() || parent.id,

    // Resolver untuk mengkonversi Date menjadi ISO string
    createdAt: (parent: any) => {
      if (parent.createdAt) {
        try {
          const date =
            parent.createdAt instanceof Date
              ? parent.createdAt
              : new Date(parent.createdAt);

          if (isNaN(date.getTime())) {
            console.warn("Invalid createdAt date:", parent.createdAt);
            return new Date().toISOString();
          }

          return date.toISOString();
        } catch (error) {
          console.error("Error parsing createdAt:", error);
          return new Date().toISOString();
        }
      }
      return new Date().toISOString();
    },

    updatedAt: (parent: any) => {
      if (parent.updatedAt) {
        try {
          const date =
            parent.updatedAt instanceof Date
              ? parent.updatedAt
              : new Date(parent.updatedAt);

          if (isNaN(date.getTime())) {
            console.warn("Invalid updatedAt date:", parent.updatedAt);
            return new Date().toISOString();
          }

          return date.toISOString();
        } catch (error) {
          console.error("Error parsing updatedAt:", error);
          return new Date().toISOString();
        }
      }
      return new Date().toISOString();
    },
  },
  Query: {
    students: async (
      _: any,
      { input }: { input?: any },
      context: {
        dataSources: { students: { getAllStudents: (params?: any) => any } };
      }
    ) => {
      try {
        return await context.dataSources.students.getAllStudents(input || {});
      } catch (error) {
        throw new Error("Failed to fetch students");
      }
    },
    student: async (
      _: any,
      { id }: { id: string },
      context: {
        dataSources: {
          students: { getStudent: (params: { id: string }) => any };
        };
      }
    ) => {
      try {
        return await context.dataSources.students.getStudent({ id });
      } catch (error) {
        throw new Error("Failed to fetch student");
      }
    },
  },
  Mutation: {
    createStudent: async (_: any, { input }: any, context: any) => {
      try {
        const newStudent = await context.dataSources.students.createStudent({
          input,
        });
        return newStudent;
      } catch (error) {
        throw new Error("Failed to create student");
      }
    },
    updateStudent: async (
      _: any,
      { id, input }: { id: string; input: any },
      context: any
    ) => {
      try {
        const updatedStudent = await context.dataSources.students.updateStudent(
          {
            input: { id, ...input },
          }
        );
        return updatedStudent;
      } catch (error) {
        throw new Error("Failed to update student");
      }
    },
    deleteStudent: async (_: any, { id }: { id: string }, context: any) => {
      try {
        const result = await context.dataSources.students.deleteStudent({ id });
        return result;
      } catch (error) {
        throw new Error("Failed to delete student");
      }
    },
  },
};

export default resolvers;

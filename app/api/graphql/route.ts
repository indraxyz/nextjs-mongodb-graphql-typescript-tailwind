import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import Students from "@/server/datasources/students";
import Student from "@/server/models/student";
import resolvers from "@/server/resolvers/student";
import typeDefs from "@/server/schemas/student";
import { connectDB } from "@/server/utils/connectDB";
import { Collection } from "mongodb";

// Initialize database connection
connectDB();

// Import types
import { StudentDocument } from "../../study-graphql/types/student";

// Define a simpler context interface for Apollo Server
interface ApolloContext {
  dataSources: {
    students: Students;
  };
}

const server = new ApolloServer<ApolloContext>({
  resolvers,
  typeDefs,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (): Promise<ApolloContext> => ({
    dataSources: {
      students: new Students({
        modelOrCollection: Student as unknown as Collection<StudentDocument>,
      }),
    },
  }),
});

// Type assertion to fix Next.js 15 compatibility
const apolloHandler = handler as (request: NextRequest) => Promise<Response>;

export const GET = apolloHandler;
export const POST = apolloHandler;

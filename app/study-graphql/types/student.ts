export interface Student {
  id: string;
  name: string;
  email: string;
  age: number;
  address: string;
  createdAt: string;
  updatedAt: string;
}

// export interface NewStudentInput {
//   name: string;
//   email: string;
//   age: number;
//   address: string;
// }

export interface StudentFormData {
  name: string;
  email: string;
  age: number;
  address: string;
}

export interface StudentFormErrors {
  name?: string;
  email?: string;
  age?: string;
  address?: string;
}

// Hook Props Interfaces
export interface UseStudentFormProps {
  editingStudent?: Student | null;
  onSubmit: (data: StudentFormData) => Promise<void>;
  onReset: () => void;
}

export interface UseStudentCRUDProps {
  searchTerm?: string;
  sortBy?: keyof Student;
  sortOrder?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export interface UseStudentUIProps {
  onEdit?: (student: Student) => void;
  onDelete?: (id: string, name: string) => Promise<boolean>;
}

export interface UseStudentSearchProps {
  students: Student[];
  onSearchChange?: (searchTerm: string) => void;
  onSortChange?: (sortBy: keyof Student, sortOrder: "asc" | "desc") => void;
}

// GraphQL Response Interfaces
export interface CreateStudentResponse {
  createStudent: Student;
}

export interface UpdateStudentResponse {
  updateStudent: Student;
}

export interface DeleteStudentResponse {
  deleteStudent: boolean;
}

// Server Interfaces
export interface Context {
  req: any; // NextRequest
  res: any; // NextResponse
  dataSources: {
    students: any; // Students class
  };
}

// Database Document Interface
export interface StudentDocument {
  _id: any; // ObjectId
  name: string;
  email: string;
  age: number;
  address: string;
  createdAt: Date;
  updatedAt: Date;
}

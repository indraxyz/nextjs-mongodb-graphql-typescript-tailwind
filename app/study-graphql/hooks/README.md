# Custom Hooks untuk Student Management

Koleksi custom hooks yang mengikuti prinsip separation of concerns untuk memisahkan logic dari UI components.

## 🏗️ Struktur Hooks

### 1. **useStudentForm** - Form Management

Menangani state form, validasi, dan submit logic.

```typescript
const {
  formData,
  errors,
  isSubmitting,
  handleInputChange,
  handleSubmit,
  resetForm,
  validateForm,
} = useStudentForm({
  editingStudent: student,
  onSubmit: async (data) => {
    /* handle submit */
  },
  onReset: () => {
    /* handle reset */
  },
});
```

**Features:**

- ✅ Real-time validation
- ✅ Error handling per field
- ✅ Form state management
- ✅ Auto-populate untuk edit mode

### 2. **useStudentCRUD** - Data Operations

Menangani operasi Create, Read, Update, Delete dengan GraphQL.

```typescript
const {
  students,
  isLoading,
  error,
  createStudent,
  updateStudent,
  deleteStudent,
  confirmDelete,
  refetch,
} = useStudentCRUD({
  searchTerm: "search",
  sortBy: "name",
  sortOrder: "asc",
  limit: 100,
  offset: 0,
});
```

**Features:**

- ✅ GraphQL integration
- ✅ Loading states per operation
- ✅ Error handling
- ✅ Auto-refetch setelah mutations
- ✅ Confirmation untuk delete

### 3. **useStudentSearch** - Search & Sorting

Menangani pencarian dan sorting dengan debouncing.

```typescript
const {
  searchTerm,
  debouncedSearchTerm,
  sortBy,
  sortOrder,
  filteredStudents,
  searchStats,
  sortOptions,
  handleSearchChange,
  handleSortChange,
  toggleSortOrder,
} = useStudentSearch({
  students: data,
  onSearchChange: (term) => {
    /* handle search */
  },
  onSortChange: (field, order) => {
    /* handle sort */
  },
});
```

**Features:**

- ✅ Debounced search (500ms)
- ✅ Client-side filtering fallback
- ✅ Multiple sort options
- ✅ Search statistics
- ✅ Real-time search feedback

### 4. **useStudentUI** - UI State Management

Menangani state UI seperti modal, loading, dan interactions.

```typescript
const {
  showForm,
  editingStudent,
  isLoading,
  isEditing,
  isCreating,
  showCreateForm,
  showEditForm,
  hideForm,
  handleEdit,
  handleDelete,
  reset,
} = useStudentUI({
  onEdit: (student) => {
    /* handle edit */
  },
  onDelete: (id, name) => {
    /* handle delete */
  },
});
```

**Features:**

- ✅ Modal state management
- ✅ Edit/Create mode detection
- ✅ Loading state per action
- ✅ Event handlers
- ✅ State reset utilities

### 5. **useStudentManagement** - Main Hook

Hook utama yang menggabungkan semua functionality.

```typescript
const {
  // Data
  students,
  isLoading,
  error,

  // Search & Sort
  searchTerm,
  searchStats,
  sortBy,
  sortOrder,
  sortOptions,

  // Form
  formData,
  formErrors,
  isSubmitting,

  // UI State
  showForm,
  editingStudent,
  isEditing,
  isCreating,

  // Actions
  handleSearchChange,
  handleSortChange,
  toggleSortOrder,
  handleInputChange,
  handleSubmit,
  handleCreate,
  handleEdit,
  handleDelete,
  handleFormClose,

  // Utilities
  refetch,
  reset,
} = useStudentManagement();
```

## 🎯 Keuntungan Pendekatan Hooks

### ✅ Separation of Concerns

- Setiap hook memiliki tanggung jawab yang spesifik
- Logic terpisah dari UI components
- Mudah untuk testing individual

### ✅ Reusability

- Hooks bisa digunakan di multiple components
- Logic yang sama bisa di-share
- Konsisten behavior across components

### ✅ Maintainability

- Mudah untuk debug dan fix bugs
- Perubahan logic tidak mempengaruhi UI
- Code lebih terorganisir

### ✅ Type Safety

- Full TypeScript support
- IntelliSense yang baik
- Compile-time error checking

### ✅ Performance

- Optimized re-renders
- Memoization where needed
- Efficient state updates

## 🚀 Cara Penggunaan

### Basic Usage

```typescript
import { useStudentManagement } from "../hooks";

function StudentManagement() {
  const {
    students,
    isLoading,
    handleCreate,
    handleEdit,
    handleDelete,
    // ... other properties
  } = useStudentManagement();

  return <div>{/* UI implementation */}</div>;
}
```

### Advanced Usage dengan Custom Logic

```typescript
import { useStudentForm, useStudentCRUD, useStudentSearch } from "../hooks";

function CustomStudentComponent() {
  // Gunakan hooks individual untuk custom logic
  const crud = useStudentCRUD({
    /* custom params */
  });
  const search = useStudentSearch({
    students: crud.students,
    onSearchChange: (term) => {
      // Custom search logic
    },
  });

  // Custom form logic
  const form = useStudentForm({
    editingStudent: null,
    onSubmit: async (data) => {
      // Custom submit logic
    },
  });

  return <div>{/* Custom UI implementation */}</div>;
}
```

## 🔧 Best Practices

### 1. **Single Responsibility**

Setiap hook hanya menangani satu concern:

- `useStudentForm` → Form logic only
- `useStudentCRUD` → Data operations only
- `useStudentSearch` → Search/sort only
- `useStudentUI` → UI state only

### 2. **Composition over Inheritance**

Gunakan `useStudentManagement` yang menggabungkan hooks, atau compose sendiri sesuai kebutuhan.

### 3. **Error Boundaries**

Setiap hook menangani error-nya sendiri dan memberikan feedback yang jelas.

### 4. **Loading States**

Semua async operations memiliki loading states yang proper.

### 5. **Type Safety**

Gunakan TypeScript interfaces untuk semua props dan return values.

## 🧪 Testing

Hooks bisa ditest secara individual menggunakan `@testing-library/react-hooks`:

```typescript
import { renderHook, act } from "@testing-library/react-hooks";
import { useStudentForm } from "./useStudentForm";

test("should validate form data", () => {
  const { result } = renderHook(() =>
    useStudentForm({
      editingStudent: null,
      onSubmit: jest.fn(),
      onReset: jest.fn(),
    })
  );

  act(() => {
    result.current.handleInputChange("name", "");
  });

  expect(result.current.errors.name).toBe("Nama harus diisi");
});
```

---

**Catatan**: Hooks ini dirancang untuk memberikan developer experience yang lebih baik dengan memisahkan concerns dan membuat code lebih maintainable. Gunakan sesuai kebutuhan project Anda.

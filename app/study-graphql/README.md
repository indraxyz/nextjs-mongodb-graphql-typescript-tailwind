# Student Management System dengan GraphQL

Implementasi sederhana sistem manajemen students menggunakan Apollo Client, Next.js App Router, TypeScript, dan Tailwind CSS.

## 🏗️ Struktur Proyek

```
app/study-graphql/
├── components/           # Komponen UI
│   ├── SimpleStudentManagement.tsx  # Komponen utama (SEDERHANA)
│   ├── StudentManagement.tsx        # Komponen kompleks (legacy)
│   ├── HybridStudentManagement.tsx  # Komponen hybrid (legacy)
│   ├── StudentCard.tsx              # Card individual student
│   ├── StudentForm.tsx              # Form create/edit
│   ├── SearchBar.tsx                # Search dan filter
│   ├── Pagination.tsx               # Pagination
│   ├── LoadingSpinner.tsx           # Loading indicator
│   ├── ErrorMessage.tsx             # Error display
│   └── index.ts                     # Export barrel
├── hooks/               # Custom hooks (untuk komponen kompleks)
├── graphql/             # GraphQL operations
│   ├── queries.ts               # GraphQL queries
│   └── mutations.ts             # GraphQL mutations
├── lib/                 # Apollo Client Configuration
│   ├── apollo-client.ts         # RSC Apollo Client
│   ├── apollo-provider.tsx      # ApolloNextAppProvider wrapper
│   └── make-client.ts           # Client factory function
├── types/               # TypeScript types
│   └── student.ts               # Student types
└── page.tsx             # Main page component
```

## 🎯 Fitur Utama

### ✅ CRUD Operations

- **Create**: Tambah student baru
- **Read**: Tampilkan daftar students
- **Update**: Edit data student existing
- **Delete**: Hapus student dengan konfirmasi

### 🔍 Search

- **Real-time search**: Cari berdasarkan nama, email, atau alamat

### 🎨 UI Features

- **Responsive design**: Grid layout yang adaptif
- **Loading states**: Loading spinner
- **Error handling**: Error messages dengan retry
- **Modal forms**: Form dalam modal overlay

## 🚀 Komponen Utama

### **SimpleStudentManagement** - Komponen dengan Custom Hooks

Komponen yang menggunakan custom hooks untuk separation of concerns:

- **useStudentManagement** - Main hook yang menggabungkan semua functionality
- **useStudentForm** - Form state dan validation
- **useStudentCRUD** - Data operations (Create, Read, Update, Delete)
- **useStudentSearch** - Search dan sorting dengan debouncing
- **useStudentUI** - UI state management (modal, loading, etc)

```typescript
// Menggunakan main hook untuk kemudahan
export default function SimpleStudentManagement() {
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
  } = useStudentManagement();

  // ... UI implementation
}
```

### **StudentManagementAdvanced** - Komponen dengan Individual Hooks

Komponen yang menggunakan hooks individual untuk kontrol yang lebih granular:

```typescript
// Menggunakan hooks individual untuk custom logic
export default function StudentManagementAdvanced() {
  // UI State Management
  const ui = useStudentUI();

  // Search & Sorting
  const search = useStudentSearch({
    students: [],
    onSearchChange: (term) => {
      /* custom logic */
    },
    onSortChange: (field, order) => {
      /* custom logic */
    },
  });

  // CRUD Operations
  const crud = useStudentCRUD({
    searchTerm: search.debouncedSearchTerm,
    sortBy: search.sortBy,
    sortOrder: search.sortOrder,
    limit: 50, // Custom limit
  });

  // Form Management
  const form = useStudentForm({
    editingStudent: ui.editingStudent,
    onSubmit: async (data) => {
      /* custom submit logic */
    },
    onReset: () => {
      /* custom reset logic */
    },
  });

  // ... custom implementation
}
```

## 🚀 Cara Menggunakan

### 1. Akses Halaman

- Navigasi ke `/study-graphql` untuk mengakses aplikasi

### 2. Operasi CRUD

- **Tambah**: Klik tombol "Tambah Student"
- **Edit**: Klik tombol "Edit" pada card student
- **Hapus**: Klik tombol "Hapus" dengan konfirmasi
- **Lihat**: Data ditampilkan dalam grid card

### 3. Search

- Ketik di search bar untuk mencari berdasarkan nama, email, atau alamat

## 🎯 Keuntungan Pendekatan Custom Hooks

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

- Optimized re-renders dengan proper memoization
- Efficient state updates
- Minimal unnecessary re-renders

### ✅ Developer Experience

- IntelliSense yang lebih baik
- Auto-completion untuk semua properties
- Clear API untuk setiap hook

## 🔧 Tech Stack

- **Next.js 14** dengan App Router
- **Apollo Client** untuk GraphQL
- **TypeScript** untuk type safety
- **Tailwind CSS** untuk styling
- **MongoDB** sebagai database

## 🚨 Error Handling

- GraphQL errors ditampilkan dengan jelas
- Network errors dengan retry options
- Form validation real-time
- Loading states yang proper

## 📁 Struktur Hooks

```
hooks/
├── useStudentForm.ts          # Form state dan validation
├── useStudentCRUD.ts          # Data operations (CRUD)
├── useStudentSearch.ts        # Search dan sorting
├── useStudentUI.ts            # UI state management
├── useStudentManagement.ts    # Main hook (composition)
├── useDebounce.ts             # Utility hook
├── useStudents.ts             # Legacy hooks
├── index.ts                   # Export barrel
└── README.md                  # Hooks documentation
```

## 🎯 Pilihan Implementasi

### 1. **SimpleStudentManagement** (Recommended)

- Menggunakan `useStudentManagement` hook
- Semua functionality dalam satu hook
- Mudah digunakan dan dipahami
- Cocok untuk kebanyakan use cases

### 2. **StudentManagementAdvanced**

- Menggunakan hooks individual
- Kontrol yang lebih granular
- Custom logic yang lebih fleksibel
- Cocok untuk requirements yang kompleks

### 3. **Legacy Components**

- `StudentManagement` - Implementasi lama dengan hooks individual
- `HybridStudentManagement` - Implementasi hybrid
- Tersedia sebagai referensi

---

**Catatan**: Gunakan `SimpleStudentManagement` untuk implementasi standar, atau `StudentManagementAdvanced` jika memerlukan kontrol yang lebih granular. Semua hooks dirancang untuk memberikan developer experience yang optimal dengan TypeScript support penuh.

"use client";

import { Student } from "../types/student";
import {
  useStudentForm,
  useStudentCRUD,
  useStudentSearch,
  useStudentUI,
} from "../hooks";

// Utility function untuk format tanggal dengan error handling
const formatDateTime = (dateString: string | undefined | null): string => {
  if (!dateString) return "N/A";

  console.log("dateString", dateString);
  // data: 2025-09-09T09:04:10.428+00:00

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn("Invalid date string:", dateString);
      return "Invalid Date";
    }
    // Menggunakan toLocaleString untuk menampilkan tanggal dan waktu
    return date.toLocaleString("id-ID", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error parsing date:", dateString, error);
    return "Invalid Date";
  }
};

/**
 * Contoh penggunaan hooks individual untuk custom logic
 * Demonstrasi bagaimana menggabungkan hooks secara manual
 * untuk mendapatkan kontrol yang lebih granular
 */
export default function StudentManagementAdvanced() {
  // UI State Management
  const ui = useStudentUI();

  // CRUD Operations - tanpa search/sort dulu
  const crud = useStudentCRUD({
    searchTerm: "",
    sortBy: "name",
    sortOrder: "asc",
    limit: 50, // Custom limit
    offset: 0,
  });

  // Search & Sorting dengan data dari CRUD
  const search = useStudentSearch({
    students: crud.students,
    onSearchChange: (searchTerm) => {
      console.log("Search term changed:", searchTerm);
    },
    onSortChange: (sortBy, sortOrder) => {
      console.log("Sort changed:", { sortBy, sortOrder });
    },
  });

  // Form Management
  const form = useStudentForm({
    editingStudent: ui.editingStudent,
    onSubmit: async (data) => {
      try {
        if (ui.isEditing && ui.editingStudent) {
          await crud.updateStudent(ui.editingStudent.id, data);
          console.log("Student updated successfully");
        } else {
          await crud.createStudent(data);
          console.log("Student created successfully");
        }
        ui.hideForm();
      } catch (error) {
        console.error("Error submitting form:", error);
        throw error;
      }
    },
    onReset: () => {
      ui.hideForm();
    },
  });

  // Custom handlers dengan additional logic
  const handleDelete = async (id: string, name: string) => {
    // Custom confirmation dengan additional info
    const confirmed = confirm(
      `Yakin ingin menghapus ${name}?\n\nTindakan ini tidak dapat dibatalkan.`
    );

    if (confirmed) {
      try {
        await crud.deleteStudent(id);
        console.log(`Student ${name} deleted successfully`);
        return true;
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("Gagal menghapus student. Silakan coba lagi.");
        return false;
      }
    }
    return false;
  };

  const handleEdit = (student: Student) => {
    console.log("Editing student:", student);
    ui.handleEdit(student);
  };

  const handleCreate = () => {
    console.log("Creating new student");
    ui.showCreateForm();
  };

  // Custom loading state
  const isAnyLoading = crud.isLoading || form.isSubmitting || ui.isLoading;

  if (crud.queryLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data students...</p>
        </div>
      </div>
    );
  }

  if (crud.error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <svg
              className="w-12 h-12 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <h3 className="text-lg font-medium text-red-800 mb-2">Error</h3>
            <p className="text-red-700 mb-4">{crud.error.message}</p>
            <button
              onClick={() => crud.refetch()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header dengan custom stats */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Advanced Student Management
          </h1>
          <p className="text-gray-600 mt-1">
            Total: {search.searchStats.total} students
            {search.searchStats.hasSearch && (
              <span className="ml-2 text-blue-600">
                • Filtered: {search.searchStats.filtered}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={handleCreate}
          disabled={isAnyLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          + Tambah Student
        </button>
      </div>

      {/* Search and Sort Controls */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Cari berdasarkan nama, email, alamat, atau umur..."
              value={search.searchTerm}
              onChange={(e) => search.handleSearchChange(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={search.sortBy}
              onChange={(e) =>
                search.handleSortChange(e.target.value as keyof Student)
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {search.sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <button
              onClick={search.toggleSortOrder}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              title={`Urutkan ${
                search.sortOrder === "asc" ? "menurun" : "menaik"
              }`}
            >
              {search.sortOrder === "asc" ? "↑ A-Z" : "↓ Z-A"}
            </button>
          </div>
        </div>

        {/* Advanced Search Stats */}
        <div className="text-sm text-gray-600">
          <div className="flex items-center gap-4">
            <div>
              {search.searchStats.hasSearch ? (
                <span>
                  Menampilkan {search.searchStats.filtered} dari{" "}
                  {search.searchStats.total} hasil untuk "
                  {search.searchStats.searchTerm}"
                </span>
              ) : (
                <span>Menampilkan {search.searchStats.total} students</span>
              )}
            </div>

            {isAnyLoading && (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-blue-600">Memuat...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Modal dengan enhanced validation */}
      {ui.showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                {ui.isEditing ? "Edit Student" : "Tambah Student"}
              </h2>
              <button
                onClick={ui.hideForm}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={form.handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nama <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.formData.name}
                  onChange={(e) =>
                    form.handleInputChange("name", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    form.errors.name ? "border-red-500" : ""
                  }`}
                  placeholder="Masukkan nama lengkap"
                />
                {form.errors.name && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={form.formData.email}
                  onChange={(e) =>
                    form.handleInputChange("email", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    form.errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="contoh@email.com"
                />
                {form.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Umur <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={form.formData.age}
                  onChange={(e) =>
                    form.handleInputChange("age", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    form.errors.age ? "border-red-500" : ""
                  }`}
                  placeholder="Masukkan umur"
                />
                {form.errors.age && (
                  <p className="text-red-500 text-sm mt-1">{form.errors.age}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Alamat <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={form.formData.address}
                  onChange={(e) =>
                    form.handleInputChange("address", e.target.value)
                  }
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    form.errors.address ? "border-red-500" : ""
                  }`}
                  rows={3}
                  placeholder="Masukkan alamat lengkap"
                />
                {form.errors.address && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.errors.address}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={form.isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {form.isSubmitting
                    ? "Menyimpan..."
                    : ui.isEditing
                    ? "Update Student"
                    : "Simpan Student"}
                </button>
                <button
                  type="button"
                  onClick={ui.hideForm}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Students Grid dengan enhanced cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {search.filteredStudents.map((student) => {
          if (!student?.id) return null;

          return (
            <div
              key={student.id}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {student.name || "-"}
                </h3>
                <span className="text-sm text-gray-500">
                  {student.age || 0} tahun
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <p className="text-gray-600 text-sm">
                  📧 {student.email || "-"}
                </p>
                <p className="text-gray-600 text-sm">
                  📍 {student.address || "-"}
                </p>
                <p className="text-gray-500 text-xs">
                  Dibuat: {formatDateTime(student.createdAt)}
                </p>
                <p className="text-gray-500 text-xs">
                  Diperbarui: {formatDateTime(student.updatedAt)}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(student as Student)}
                  disabled={isAnyLoading}
                  className="flex-1 px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Edit
                </button>
                <button
                  onClick={() =>
                    handleDelete(student.id, student.name || "Student")
                  }
                  disabled={isAnyLoading}
                  className="flex-1 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hapus
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {search.filteredStudents.length === 0 && !crud.queryLoading && (
        <div className="text-center py-12">
          <div className="bg-gray-50 rounded-lg p-8">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {search.searchStats.hasSearch
                ? "Tidak ada hasil pencarian"
                : "Belum ada data student"}
            </h3>
            <p className="text-gray-500 mb-4">
              {search.searchStats.hasSearch
                ? `Tidak ada student yang sesuai dengan pencarian "${search.searchStats.searchTerm}"`
                : "Mulai dengan menambahkan student pertama Anda"}
            </p>
            {!search.searchStats.hasSearch && (
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Tambah Student Pertama
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

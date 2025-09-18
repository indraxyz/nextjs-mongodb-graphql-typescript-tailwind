import { useCallback } from "react";
import { Student, StudentFormData } from "../types/student";
import { useStudentForm } from "./useStudentForm";
import { useStudentCRUD } from "./useStudentCRUD";
import { useStudentSearch } from "./useStudentSearch";
import { useStudentUI } from "./useStudentUI";

/**
 * Main hook yang menggabungkan semua functionality untuk student management
 * Hook ini mengikuti prinsip separation of concerns dengan memisahkan:
 * - Form logic (useStudentForm)
 * - CRUD operations (useStudentCRUD)
 * - Search & sorting (useStudentSearch)
 * - UI state (useStudentUI)
 */
export function useStudentManagement() {
  // UI State Management
  const ui = useStudentUI();

  // Search & Sorting
  const search = useStudentSearch({
    students: [], // Akan diisi dari CRUD hook
    onSearchChange: (searchTerm) => {
      // Trigger refetch dengan search term baru
      crud.refetch();
    },
    onSortChange: (sortBy, sortOrder) => {
      // Trigger refetch dengan sort parameter baru
      crud.refetch();
    },
  });

  // CRUD Operations
  const crud = useStudentCRUD({
    searchTerm: search.debouncedSearchTerm,
    sortBy: search.sortBy,
    sortOrder: search.sortOrder,
    limit: 100,
    offset: 0,
  });

  // Update search hook dengan data dari CRUD
  const searchWithData = useStudentSearch({
    students: crud.students,
    onSearchChange: (searchTerm) => {
      // Search akan dihandle oleh CRUD hook
    },
    onSortChange: (sortBy, sortOrder) => {
      // Sort akan dihandle oleh CRUD hook
    },
  });

  // Form Management
  const form = useStudentForm({
    editingStudent: ui.editingStudent,
    onSubmit: async (data: StudentFormData) => {
      try {
        if (ui.isEditing && ui.editingStudent) {
          await crud.updateStudent(ui.editingStudent.id, data);
        } else {
          await crud.createStudent(data);
        }
        ui.hideForm();
      } catch (error) {
        console.error("Error submitting form:", error);
        throw error; // Re-throw agar form bisa handle error
      }
    },
    onReset: () => {
      ui.hideForm();
    },
  });

  // Enhanced delete handler dengan UI feedback
  const handleDelete = useCallback(
    async (id: string, name: string) => {
      try {
        const success = await crud.confirmDelete(id, name);
        if (success) {
          // Optional: Show success message
          console.log(`Student ${name} berhasil dihapus`);
        }
        return success;
      } catch (error) {
        console.error("Error deleting student:", error);
        return false;
      }
    },
    [crud]
  );

  // Enhanced edit handler
  const handleEdit = useCallback(
    (student: Student) => {
      ui.handleEdit(student);
    },
    [ui]
  );

  // Enhanced create handler
  const handleCreate = useCallback(() => {
    ui.showCreateForm();
  }, [ui]);

  // Enhanced form close handler
  const handleFormClose = useCallback(() => {
    ui.hideForm();
    form.resetForm();
  }, [ui, form]);

  return {
    // Data
    students: crud.students,
    isLoading: crud.isLoading,
    error: crud.error,

    // Search & Sort
    searchTerm: search.searchTerm,
    debouncedSearchTerm: search.debouncedSearchTerm,
    sortBy: search.sortBy,
    sortOrder: search.sortOrder,
    searchStats: searchWithData.searchStats,
    sortOptions: search.sortOptions,

    // Form
    formData: form.formData,
    formErrors: form.errors,
    isSubmitting: form.isSubmitting,

    // UI State
    showForm: ui.showForm,
    editingStudent: ui.editingStudent,
    isEditing: ui.isEditing,
    isCreating: ui.isCreating,

    // Actions
    handleSearchChange: search.handleSearchChange,
    handleSortChange: search.handleSortChange,
    toggleSortOrder: search.toggleSortOrder,
    handleInputChange: form.handleInputChange,
    handleSubmit: form.handleSubmit,
    handleCreate,
    handleEdit,
    handleDelete,
    handleFormClose,

    // Utilities
    refetch: crud.refetch,
    reset: () => {
      ui.reset();
      form.resetForm();
      search.setSearchTerm("");
    },
  };
}

import { useState, useCallback } from "react";
import { Student, UseStudentUIProps } from "../types/student";

export function useStudentUI({ onEdit, onDelete }: UseStudentUIProps = {}) {
  // UI State
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Show form untuk create
  const showCreateForm = useCallback(() => {
    setEditingStudent(null);
    setShowForm(true);
  }, []);

  // Show form untuk edit
  const showEditForm = useCallback(
    (student: Student) => {
      setEditingStudent(student);
      setShowForm(true);
      onEdit?.(student);
    },
    [onEdit]
  );

  // Hide form
  const hideForm = useCallback(() => {
    setShowForm(false);
    setEditingStudent(null);
  }, []);

  // Handle edit action
  const handleEdit = useCallback(
    (student: Student) => {
      showEditForm(student);
    },
    [showEditForm]
  );

  // Handle delete action dengan loading state
  const handleDelete = useCallback(
    async (id: string, name: string) => {
      if (!onDelete) return false;

      setIsLoading(true);
      try {
        const success = await onDelete(id, name);
        return success;
      } finally {
        setIsLoading(false);
      }
    },
    [onDelete]
  );

  // Reset semua state
  const reset = useCallback(() => {
    setShowForm(false);
    setEditingStudent(null);
    setIsLoading(false);
  }, []);

  // Computed values
  const isEditing = !!editingStudent;
  const isCreating = showForm && !editingStudent;
  const isFormVisible = showForm;

  return {
    // State
    showForm: isFormVisible,
    editingStudent,
    isLoading,

    // Computed
    isEditing,
    isCreating,

    // Actions
    showCreateForm,
    showEditForm,
    hideForm,
    handleEdit,
    handleDelete,
    reset,

    // Setters (untuk external control)
    setShowForm,
    setEditingStudent,
    setIsLoading,
  };
}

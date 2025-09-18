import { useState, useMemo } from "react";
import { Student, UseStudentSearchProps } from "../types/student";
import { useDebounce } from "./useDebounce";

export function useStudentSearch({
  students,
  onSearchChange,
  onSortChange,
}: UseStudentSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof Student>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Debounce search term untuk mengurangi request ke database
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Handle search change
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    onSearchChange?.(value);
  };

  // Handle sort change
  const handleSortChange = (field: keyof Student) => {
    const newSortOrder =
      sortBy === field && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(field);
    setSortOrder(newSortOrder);
    onSortChange?.(field, newSortOrder);
  };

  // Toggle sort order untuk field yang sama
  const toggleSortOrder = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);
    onSortChange?.(sortBy, newSortOrder);
  };

  // Client-side filtering (jika diperlukan untuk fallback)
  const filteredStudents = useMemo(() => {
    if (!debouncedSearchTerm) return students;

    const searchLower = debouncedSearchTerm.toLowerCase();
    return students.filter(
      (student) =>
        student.name?.toLowerCase().includes(searchLower) ||
        student.email?.toLowerCase().includes(searchLower) ||
        student.address?.toLowerCase().includes(searchLower) ||
        student.age?.toString().includes(searchLower)
    );
  }, [students, debouncedSearchTerm]);

  // Client-side sorting (jika diperlukan untuk fallback)
  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      let comparison = 0;

      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else if (
        (aValue as any) instanceof Date &&
        (bValue as any) instanceof Date
      ) {
        comparison = (aValue as any).getTime() - (bValue as any).getTime();
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });
  }, [filteredStudents, sortBy, sortOrder]);

  // Search statistics
  const searchStats = useMemo(() => {
    const total = students.length;
    const filtered = filteredStudents.length;
    const hasSearch = !!debouncedSearchTerm;

    return {
      total,
      filtered,
      hasSearch,
      searchTerm: debouncedSearchTerm,
    };
  }, [students.length, filteredStudents.length, debouncedSearchTerm]);

  // Sort options untuk dropdown
  const sortOptions = [
    { value: "name", label: "Nama" },
    { value: "email", label: "Email" },
    { value: "age", label: "Umur" },
    { value: "address", label: "Alamat" },
    { value: "createdAt", label: "Tanggal Dibuat" },
  ] as const;

  return {
    // State
    searchTerm,
    debouncedSearchTerm,
    sortBy,
    sortOrder,

    // Data
    filteredStudents: sortedStudents,
    searchStats,
    sortOptions,

    // Actions
    handleSearchChange,
    handleSortChange,
    toggleSortOrder,

    // Setters (untuk external control)
    setSearchTerm,
    setSortBy,
    setSortOrder,
  };
}

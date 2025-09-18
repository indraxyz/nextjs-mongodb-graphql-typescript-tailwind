# Date Utilities

Utility functions untuk menangani format tanggal dan waktu di aplikasi Student Management.

## Features

- ✅ Format tanggal dan waktu dengan timezone Indonesia (Asia/Jakarta)
- ✅ Error handling yang robust untuk berbagai format input
- ✅ Support untuk relative time (misal: "2 jam yang lalu")
- ✅ Validasi tanggal yang komprehensif
- ✅ TypeScript support penuh

## Functions

### `formatDateTime(dateString)`

Format tanggal dan waktu lengkap dengan timezone Indonesia.

```typescript
formatDateTime("2024-01-15T10:30:00.000Z");
// Output: "15 Jan 2024, 17.30"
```

### `formatDate(dateString)`

Format tanggal saja tanpa waktu.

```typescript
formatDate("2024-01-15T10:30:00.000Z");
// Output: "15 Januari 2024"
```

### `formatTime(dateString)`

Format waktu saja tanpa tanggal.

```typescript
formatTime("2024-01-15T10:30:00.000Z");
// Output: "17.30"
```

### `getRelativeTime(dateString)`

Format waktu relatif (misal: "2 jam yang lalu").

```typescript
getRelativeTime("2024-01-15T10:30:00.000Z");
// Output: "2 jam yang lalu" atau "15 Januari 2024" (jika lebih dari 30 hari)
```

### `isValidDate(dateString)`

Validasi apakah string adalah tanggal yang valid.

```typescript
isValidDate("2024-01-15T10:30:00.000Z");
// Output: true

isValidDate("invalid-date");
// Output: false
```

## Usage

```typescript
import {
  formatDateTime,
  formatDate,
  getRelativeTime,
} from "../utils/dateUtils";

// Di component
const createdAt = formatDateTime(student.createdAt);
const joinDate = formatDate(student.createdAt);
const lastUpdate = getRelativeTime(student.updatedAt);
```

## Error Handling

Semua functions memiliki error handling yang robust:

- Jika input `null` atau `undefined` → return "N/A"
- Jika tanggal tidak valid → return "Tanggal tidak valid"
- Jika terjadi error parsing → return "Error parsing tanggal"

## Timezone

Semua functions menggunakan timezone `Asia/Jakarta` untuk konsistensi dengan pengguna Indonesia.

## Supported Input Formats

- ISO 8601: `2024-01-15T10:30:00.000Z`
- ISO dengan timezone offset: `2024-01-15T10:30:00+07:00`
- Date string: `"2024-01-15"`
- Timestamp: `1705312200000`

Berikut adalah **Dokumentasi API Lengkap** yang bisa Anda berikan kepada Claude Code (atau digunakan sendiri) untuk memastikan Frontend React memanfaatkan semua fitur Backend (Search, Filter, Pagination) secara maksimal.

Silakan Copy-Paste blok di bawah ini:

---

### 📋 Prompt Context: Backend API Documentation (Final Version)

````markdown
# Backend API Documentation for Frontend Developer

## 1. System Overview

Backend (Laravel) acts as a read-only middleware that fetches, cleans, and serves data from a legacy WordPress database.

- **Base URL:** `http://127.0.0.1:8000`
- **Authentication:** Public (No token required)
- **CORS:** Enabled for all origins (`*`)

## 2. API Endpoints

### A. Get News List (Daftar Berita)

Fetches a paginated list of news with optional search and filtering.

- **Endpoint:** `GET /api/posts`
- **Pagination:** Default **9 items** per page.

**Query Parameters (All Optional):**
| Parameter | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `page` | `int` | Page number for pagination. | `?page=2` |
| `keyword` | `string` | Search in Title OR Content. | `?keyword=penelitian` |
| `category` | `string` | Filter by **Category Slug**. | `?category=pengumuman` |

**Request Examples:**

1. **Basic:** `GET /api/posts`
2. **Search:** `GET /api/posts?keyword=workshop`
3. **Filter Category:** `GET /api/posts?category=berita`
4. **Complex:** `GET /api/posts?keyword=dana&category=pengumuman&page=2`

**Response Structure:**

```json
{
  "status": "success",
  "data": [
    {
      "id": 7335,
      "title": "Judul Berita",
      "slug": "judul-berita",
      "date": "20 Nov 2025",
      "category": "Pengumuman",
      "category_slug": "pengumuman",
      "thumbnail": "[https://lppm.unila.ac.id/.../img.jpg](https://lppm.unila.ac.id/.../img.jpg)",
      "excerpt": "Cuplikan teks pendek max 150 karakter..."
    }
  ],
  "pagination": {
    "total": 150,
    "per_page": 9,
    "current_page": 1,
    "last_page": 17,
    "next_page_url": "http://.../api/posts?page=2",
    "prev_page_url": null
  }
}
```
````

### B. Get News Detail (Detail Berita)

Fetches a single news article by ID with full HTML content.

- **Endpoint:** `GET /api/posts/{id}`
- **Path Parameter:** `id` (Integer, e.g., `7332`)

**Response Structure:**

```json
{
  "status": "success",
  "data": {
    "id": 7332,
    "title": "Judul Lengkap Berita",
    "slug": "judul-lengkap-berita",
    "date": "Thursday, 20 November 2025",
    "category": "Pengumuman",
    "image": "[https://lppm.unila.ac.id/.../img.jpg](https://lppm.unila.ac.id/.../img.jpg)",
    "content": "<p>Paragraf 1...</p> <ul><li>List item</li></ul>"
  }
}
```

## 3\. Frontend Integration Notes (Vital\!)

### 1\. Handling Search & Filter

- Use a single state object for params in React, e.g., `const [params, setParams] = useState({ keyword: '', category: '' })`.
- Trigger the API call whenever these params change (or use a debounce for the keyword).
- Reset `page` to `1` whenever a filter or keyword changes.

### 2\. Rendering Content

- The `content` field in Detail API is **Sanitized HTML**.
- All Angular wrappers (`ng-tns`, etc.) have been removed by Backend.
- Images inside content have been fixed to absolute URLs (`https://...`).
- **Action:** Use `dangerouslySetInnerHTML={{ __html: data.content }}`.
- **Styling:** Apply global CSS styles for `ul`, `li`, `p`, `img` inside the content container to ensure it looks good (e.g., add bullets for lists).

### 3\. Image Handling

- Backend guarantees the `thumbnail` and `image` fields are never null.
- If the original image is missing, Backend returns a placeholder URL (`https://placehold.co/600x400...`).
- You can display it directly without fallback logic in Frontend.

### 4\. Date Formats

- **List View:** Returns 'd M Y' (e.g., `05 Nov 2025`) - Compact.
- **Detail View:** Returns 'l, d F Y' (e.g., `Wednesday, 05 November 2025`) - Full.

<!-- end list -->

```

***

### Cara Menggunakan:
Berikan teks di atas ke Claude Code. Dia akan langsung mengerti bahwa dia perlu membuat:
1.  **Search Bar Input** (yang mengirim query `?keyword=`).
2.  **Dropdown/Tabs Kategori** (yang mengirim query `?category=`).
3.  **Pagination Button** (yang membaca `next_page_url` dari JSON).
```

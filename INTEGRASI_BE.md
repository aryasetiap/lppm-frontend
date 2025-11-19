# Project Context: Frontend Integration for Headless News Portal

## 1. Current Status

Backend (Laravel API) is fully ready and tested.
We are now moving to **Frontend Development** using **ReactJS (Vite)**.
Your task is to build/update the React components to consume the API endpoints provided below.

## 2. API Configuration

- **Base URL:** `http://127.0.0.1:8000`
- **Authentication:** Public API (No token required).
- **CORS:** Enabled for all origins (`*`).

## 3. API Endpoints Documentation

### A. Endpoint List Berita (News List)

- **URL:** `GET /api/posts`
- **Response Structure:**
  ```json
  {
    "status": "success",
    "data": [
      {
        "id": 7335,
        "title": "Judul Berita...",
        "slug": "judul-berita",
        "date": "05 Nov 2025",
        "category": "Pengumuman",
        "thumbnail": "[https://lppm.unila.ac.id/.../img.jpg](https://lppm.unila.ac.id/.../img.jpg)",
        "excerpt": "Cuplikan teks pendek..."
      }
    ],
    "pagination": {
      "total": 879,
      "current_page": 1,
      "last_page": 88
    }
  }
  ```
  - **Notes:**
    - `thumbnail` might be a placeholder URL if the original image is missing.
    - Use `excerpt` for the card view description.

### B. Endpoint Detail Berita (News Detail)

- **URL:** `GET /api/posts/{id}`
- **Response Structure (Real Example):**
  ```json
  {
    "status": "success",
    "data": {
      "id": 7332,
      "title": "Judul Lengkap Berita...",
      "slug": "judul-lengkap-berita",
      "date": "Wednesday, 05 November 2025",
      "category": "Pengumuman",
      "image": "[https://lppm.unila.ac.id/.../img.jpg](https://lppm.unila.ac.id/.../img.jpg)",
      "content": "<b>Bandar Lampung</b> - Isi berita... <ul><li>List item</li></ul>"
    }
  }
  ```
  - **Critical Rendering Instructions for `content`:**
    - The `content` field contains **Safe HTML** strings (Sanitized from Backend).
    - It contains tags like `<b>`, `<strong>`, `<p>`, `<ul>`, `<li>`, `\n` (newlines).
    - **Action:** You must render this using `dangerouslySetInnerHTML` in React.
    - **Styling:** Please provide CSS/Tailwind classes to style standard HTML tags inside the content area (e.g., make `<ul>` have list-disc, `<b>` be font-bold, add spacing between paragraphs).

## 4. Frontend Requirements (Task)

Please create/refactor the following components:

### 1. `NewsList.jsx`

- Fetch data from `/api/posts`.
- Display grid of news cards (Image, Title, Date, Category, Excerpt).
- Handle "Loading" state.
- (Optional) Simple Previous/Next pagination using the `pagination` object.

### 2. `NewsDetail.jsx`

- Fetch data from `/api/posts/{id}` using `useParams`.
- Display full Article:
  - Header: Title, Date, Category.
  - Hero Image: Full width `image`.
  - Body: The `content` rendered as HTML.
- Handle "Not Found" (404) or Loading state.

### 3. Routing

- Ensure `react-router-dom` is set up to navigate from List → Detail.

**Tech Stack:** ReactJS, Axios, Tailwind CSS (preferable).

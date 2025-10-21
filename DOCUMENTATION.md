# Technical Test - Product Management Application

## 📋 Overview
Full-stack product management application dengan authentication, built menggunakan Next.js 15 (Frontend) dan Express.js (Backend).

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.5.6 (App Router, Turbopack)
- **Language**: TypeScript
- **UI Library**: Ant Design v5
- **HTTP Client**: Axios
- **Authentication**: Firebase Auth
- **State Management**: React Context API

### Backend
- **Framework**: Express.js v5
- **Database**: SQLite (better-sqlite3)
- **Authentication**: Firebase Admin SDK
- **Language**: TypeScript (dengan @swc/register)

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+ 
- Yarn package manager
- Firebase Project (dengan Email/Password authentication enabled)

### 1. Clone Repository
```bash
git clone <repository-url>
cd interviewer_test
```

### 2. Frontend Setup

#### Install Dependencies
```bash
cd technical-test-fe
yarn install
```

#### Environment Variables
Create `.env.local` file:
```bash
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
```

**Cara Mendapatkan:**
1. Buka Firebase Console → Project Settings
2. Scroll ke "Your apps" → Web app
3. Copy config values

#### Run Frontend
```bash
yarn dev
```
Frontend akan berjalan di: **http://localhost:3000**

---

### 3. Backend Setup

#### Install Dependencies
```bash
cd technical-test-be
yarn install
```

#### Environment Variables (.env.dev)

**Option A: Mode Development (Tanpa Firebase Auth)**
```bash
# Jalankan dengan: yarn dev
# Tidak memerlukan Firebase Service Account
```

**Option B: Mode Firebase (Dengan Firebase Auth) - BONUS SECTION**
Create `.env.dev` file:
```bash
WEB_FIREBASE_WEB_TYPE="service_account"
WEB_FIREBASE_WEB_PROJECT_ID="your-project-id"
WEB_FIREBASE_WEB_PRIVATE_KEY_ID="abc123..."
WEB_FIREBASE_WEB_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n"
WEB_FIREBASE_WEB_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
WEB_FIREBASE_WEB_CLIENT_ID="123456789"
WEB_FIREBASE_WEB_AUTH_URI="https://accounts.google.com/o/oauth2/auth"
WEB_FIREBASE_WEB_TOKEN_URI="https://oauth2.googleapis.com/token"
WEB_FIREBASE_WEB_AUTH_PROVIDER_X509_CERT_URL="https://www.googleapis.com/oauth2/v1/certs"
WEB_FIREBASE_WEB_CLIENT_X509_CERT_URL="https://www.googleapis.com/robot/v1/metadata/x509/..."
```

**Cara Mendapatkan Service Account Key:**
1. Firebase Console → Project Settings → Service accounts
2. Click "Generate new private key"
3. Download JSON file
4. Map JSON fields ke .env.dev (lihat mapping di bawah)

**JSON to .env.dev Mapping:**
```
type                           → WEB_FIREBASE_WEB_TYPE
project_id                     → WEB_FIREBASE_WEB_PROJECT_ID
private_key_id                 → WEB_FIREBASE_WEB_PRIVATE_KEY_ID
private_key                    → WEB_FIREBASE_WEB_PRIVATE_KEY (keep \n)
client_email                   → WEB_FIREBASE_WEB_CLIENT_EMAIL
client_id                      → WEB_FIREBASE_WEB_CLIENT_ID
auth_uri                       → WEB_FIREBASE_WEB_AUTH_URI
token_uri                      → WEB_FIREBASE_WEB_TOKEN_URI
auth_provider_x509_cert_url    → WEB_FIREBASE_WEB_AUTH_PROVIDER_X509_CERT_URL
client_x509_cert_url           → WEB_FIREBASE_WEB_CLIENT_X509_CERT_URL
```

#### Run Backend

**Development Mode (No Auth):**
```bash
yarn dev
```

**Firebase Mode (With Auth) - BONUS SECTION:**
```bash
yarn dev:firebase
```

Backend akan berjalan di: **http://localhost:8001**

---

## 📁 Project Structure

```
interviewer_test/
├── technical-test-fe/
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   ├── products/route.ts    # Proxy: GET products list
│   │   │   │   └── product/route.ts     # Proxy: CRUD single product
│   │   │   ├── login/page.tsx           # Login page (Firebase Auth)
│   │   │   ├── products/page.tsx        # Main product management page
│   │   │   ├── layout.tsx               # Root layout with providers
│   │   │   └── AntdProvider.tsx         # Ant Design provider
│   │   ├── context/
│   │   │   └── AuthContext.tsx          # Firebase auth state management
│   │   └── lib/
│   │       └── firebase/config.ts       # Firebase initialization
│   ├── .env.local                       # Frontend environment variables
│   └── package.json
│
└── technical-test-be/
    ├── src/
    │   ├── index.ts                     # Server entry point
    │   ├── client/
    │   │   └── web/
    │   │       └── product/
    │   │           ├── controller.ts    # Product CRUD logic
    │   │           └── route.ts         # Product routes definition
    │   └── lib/
    │       ├── external/
    │       │   ├── auth/
    │       │   │   └── firebase-client.ts  # Firebase Admin SDK
    │       │   └── database/
    │       │       └── database.ts      # SQLite connection
    │       └── produc/service.ts        # Product service
    ├── .env.dev                         # Backend environment variables
    └── package.json
```

---

## 🔐 Authentication Flow

### Frontend
1. User login via `/login` page
2. `signInWithEmailAndPassword()` authenticates with Firebase
3. Firebase returns ID token
4. Token stored in Firebase Auth state (managed by AuthContext)
5. Protected routes check `user` state, redirect if not authenticated
6. All API calls include `Authorization: Bearer ${token}` header

### Backend (Firebase Mode)
1. Receive API request with `Authorization` header
2. Extract Bearer token
3. Verify token using Firebase Admin SDK
4. If valid: process request
5. If invalid: return 401 Unauthorized

---

## 🎨 Features Implemented

### ✅ Core Features (Required)

#### 1. Product List Page (`/products`)
- Display products in Ant Design Table
- Columns: Title, Price (formatted), Category, Description, Actions
- Pagination with backend integration (page, limit params)
- Real-time search with 300ms debounce
- Loading states

#### 2. Create Product
- Modal form dengan validasi
- Fields: product_title*, product_price*, product_category*, product_description*, product_image (optional)
- Success/error notifications
- Auto-refresh table after creation

#### 3. Edit Product
- Pre-filled form dengan data existing
- Same validation as create
- Update via PUT request
- Auto-refresh table after update

#### 4. Delete Product
- Popconfirm untuk konfirmasi
- Soft handling jika delete item terakhir di page (auto ke page sebelumnya)
- Success/error notifications

#### 5. Search Products
- Real-time search dengan debounce
- Search by product title
- Reset pagination ke page 1 saat search
- Integration dengan backend `/api/web/v1/products?search=...`

#### 6. File Upload (Optional)
- Upload product image (preview only)
- Custom upload handler (prevent auto-upload)
- Store filename in database

---

### ✅ Bonus Features (Implemented)

#### 1. Login Page (`/login`)
- Firebase Authentication (Email/Password)
- Form validation
- Error handling dengan user-friendly messages
- Auto-redirect ke `/products` setelah login
- Redirect ke `/products` jika sudah login

#### 2. Protected Routes
- `/products` page protected
- Auto-redirect ke `/login` jika belum authenticate
- Auth state management via Context API
- Loading state saat check authentication

#### 3. User Info Display
- Show logged-in user email di header
- User icon (UserOutlined dari Ant Design)

#### 4. Logout Functionality
- Logout button di products page
- Confirm logout dengan Firebase signOut()
- Redirect ke `/login` setelah logout

#### 5. API Authorization (BONUS SECTION)
- Firebase ID Token dikirim di semua API requests
- Header format: `Authorization: Bearer ${token}`
- Backend verify token via Firebase Admin SDK
- Endpoints protected:
  - GET `/api/web/v1/products`
  - POST `/api/web/v1/product`
  - PUT `/api/web/v1/product`
  - DELETE `/api/web/v1/product`

---

## 🧪 Testing Guide

### 1. Authentication Testing
```
Test Case 1: Login Success
1. Buka http://localhost:3000/login
2. Enter valid credentials
3. Expected: Redirect ke /products, user email muncul di header

Test Case 2: Protected Route
1. Logout dari aplikasi
2. Manual access http://localhost:3000/products
3. Expected: Auto-redirect ke /login dengan warning message

Test Case 3: Logout
1. Click Logout button di products page
2. Expected: Redirect ke /login, tidak bisa akses /products
```

### 2. CRUD Testing
```
Test Case 4: Create Product
1. Login dan buka /products
2. Click "Add New Product"
3. Fill form: Title, Price, Category, Description
4. Click Save
5. Expected: Success notification, produk baru muncul di tabel

Test Case 5: Edit Product
1. Click Edit button pada produk
2. Modify data (e.g., ubah price)
3. Click Save
4. Expected: Success notification, data ter-update di tabel

Test Case 6: Delete Product
1. Click Delete button pada produk
2. Confirm deletion di popup
3. Expected: Success notification, produk hilang dari tabel

Test Case 7: Search
1. Type keyword di search box (e.g., "laptop")
2. Wait 300ms (debounce)
3. Expected: Tabel filter otomatis, pagination reset ke page 1

Test Case 8: Pagination
1. Klik page 2 di pagination
2. Expected: Load produk page 2, URL params update
```

### 3. Token Authorization Testing (Bonus)
```
Test Case 9: Token in API Calls
1. Login ke aplikasi
2. Open DevTools (F12) → Console tab
3. Expected logs:
   - "Firebase Token: Token berhasil didapat"
   - "Firebase Token for Submit: Token berhasil didapat"
   - "Firebase Token for Delete: Token berhasil didapat"

Test Case 10: Network Headers
1. Open DevTools (F12) → Network tab
2. Perform any CRUD operation
3. Click request di Network tab
4. Check Headers → Request Headers
5. Expected: Authorization: Bearer eyJhbGciOi...

Test Case 11: Backend Verification
1. Ensure backend running dengan yarn dev:firebase
2. Perform CRUD operations
3. Expected: All requests return 200/201 status
4. No 401/403 errors
```

---

## 🐛 Troubleshooting

### Issue: "rawData.some is not a function"
**Cause:** API response bukan format array  
**Solution:** Check console log "API Response" dan "Products Data", pastikan backend return `{ data: [...], pagination: {...} }`

### Issue: 401 Unauthorized di API calls
**Cause:** Token tidak valid atau backend tidak verify token  
**Solution:** 
1. Check console log "Firebase Token: ..."
2. Verify .env.dev di backend sudah benar
3. Restart backend dengan `yarn dev:firebase`

### Issue: React 19 compatibility warnings
**Cause:** Ant Design v5 belum fully support React 19  
**Solution:** Warnings bisa diabaikan, aplikasi tetap berfungsi normal

### Issue: Firebase "auth/user-not-found"
**Cause:** User belum registered di Firebase  
**Solution:** Create user via Firebase Console → Authentication → Users → Add user

---

## 📊 API Endpoints

### Products API

#### Get Products List
```
GET /api/web/v1/products?search=keyword&page=1&limit=10
Headers: Authorization: Bearer {token}

Response:
{
  "data": [
    {
      "product_id": "uuid",
      "product_title": "Laptop",
      "product_price": 5000000,
      "product_category": "Electronics",
      "product_description": "High-end laptop",
      "product_image": "laptop.jpg"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

#### Create Product
```
POST /api/web/v1/product
Headers: 
  Content-Type: application/json
  Authorization: Bearer {token}

Body:
{
  "product_title": "New Product",
  "product_price": 100000,
  "product_category": "Category",
  "product_description": "Description",
  "product_image": "optional.jpg"
}

Response:
{
  "message": "Product created successfully",
  "product_id": "uuid"
}
```

#### Update Product
```
PUT /api/web/v1/product
Headers: 
  Content-Type: application/json
  Authorization: Bearer {token}

Body:
{
  "product_id": "uuid",
  "product_title": "Updated Title",
  "product_price": 150000,
  ...
}

Response:
{
  "message": "Product updated successfully"
}
```

#### Delete Product
```
DELETE /api/web/v1/product?product_id=uuid
Headers: Authorization: Bearer {token}

Response:
{
  "message": "Product deleted successfully"
}
```

---

## 🎯 Evaluation Criteria Met

### ✅ Technical Implementation
- [x] Next.js 14+ dengan App Router
- [x] TypeScript untuk type safety
- [x] API Proxy pattern (Next.js routes → Backend)
- [x] Proper error handling
- [x] Loading states
- [x] Form validation

### ✅ UI/UX
- [x] Responsive design
- [x] Clean and modern interface (Ant Design)
- [x] User feedback (notifications, loading indicators)
- [x] Intuitive navigation
- [x] Confirmation dialogs untuk destructive actions

### ✅ Code Quality
- [x] Clean code structure
- [x] Proper separation of concerns (API proxy, components, context)
- [x] Reusable hooks (useDebounce, useAuth)
- [x] TypeScript interfaces
- [x] Error boundary handling
- [x] Console logging untuk debugging

### ✅ Bonus Features
- [x] Firebase Authentication
- [x] Protected routes
- [x] Context API untuk state management
- [x] API Authorization dengan JWT tokens
- [x] Backend token verification

---

## 📝 Notes

### Design Decisions

1. **API Proxy Pattern**: Menggunakan Next.js API routes sebagai proxy untuk menghindari CORS issues dan centralize API calls

2. **Context API vs Redux**: Pilih Context API karena lebih lightweight untuk authentication state yang simple

3. **Debounce Search**: Implement custom `useDebounce` hook untuk optimize search performance (reduce API calls)

4. **Protected Routes**: Menggunakan client-side protection dengan `useEffect` check user state (cukup untuk demo, production perlu server-side auth)

5. **Token Management**: Store token di Firebase Auth state (automatic refresh), tidak perlu manual localStorage

### Known Limitations

1. File upload hanya simpan filename (tidak ada actual file storage)
2. Ant Design v5 warning dengan React 19 (tidak blocking)
3. Client-side route protection (production sebaiknya SSR/middleware)
4. No pagination state persistence (reload = reset ke page 1)

### Future Improvements

1. Server Components untuk better performance
2. Image upload ke cloud storage (Firebase Storage / AWS S3)
3. Server-side authentication dengan middleware
4. Toast notifications (instead of message.success yang kadang tidak muncul)
5. Unit tests (Jest, React Testing Library)
6. E2E tests (Playwright / Cypress)
7. Input sanitization
8. Rate limiting

---

## 👤 Author

**Your Name**  
Technical Test untuk [Company Name]  
Date: October 2025

---

## 📄 License

This project is created for technical test purposes only.

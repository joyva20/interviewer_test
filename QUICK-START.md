# 🚀 Quick Start Guide

## ⚡ Setup dalam 5 Menit

### 1️⃣ Frontend Setup
```powershell
# Terminal 1
cd technical-test-fe
yarn install
# Copy .env.local.example ke .env.local dan isi Firebase config
yarn dev
```
✅ Frontend: http://localhost:3000

### 2️⃣ Backend Setup (Mode Firebase)
```powershell
# Terminal 2
cd technical-test-be
yarn install
# Isi .env.dev dengan Firebase Service Account Key
yarn dev:firebase
```
✅ Backend: http://localhost:8001

### 3️⃣ Firebase Setup
1. Buat Firebase Project: https://console.firebase.google.com
2. Enable Authentication → Email/Password
3. Buat test user
4. Copy config ke `.env.local` (frontend)
5. Download Service Account Key ke `.env.dev` (backend)

### 4️⃣ Test
1. Buka http://localhost:3000/login
2. Login dengan test user
3. Create/Edit/Delete products
4. Cek console untuk Firebase token logs

---

## 📋 Fitur Checklist

### Core Features (Required)
- [x] Product List dengan Table (Ant Design)
- [x] Pagination (backend-integrated)
- [x] Search dengan debounce
- [x] Create Product (modal form + validation)
- [x] Edit Product (pre-filled form)
- [x] Delete Product (dengan konfirmasi)
- [x] File Upload (optional, simpan filename)

### Bonus Features
- [x] Login Page (Firebase Auth)
- [x] Protected Routes
- [x] User Info Display (email)
- [x] Logout Button
- [x] API Authorization (Bearer Token)
- [x] Backend Token Verification

---

## 🎯 Testing Quick Checks

**Authentication:**
- ✅ Login redirect ke /products
- ✅ /products tanpa login redirect ke /login
- ✅ Logout berhasil
- ✅ User email muncul di header

**CRUD:**
- ✅ Create product → success notification
- ✅ Edit product → data ter-update
- ✅ Delete product → item hilang
- ✅ Search → real-time filter

**API Authorization (Bonus):**
- ✅ Console log: "Firebase Token: Token berhasil didapat"
- ✅ Network tab: `Authorization: Bearer ...`
- ✅ Backend: No 401/403 errors
- ✅ All API calls return 200/201

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| "rawData.some is not a function" | Check API response format, refresh browser |
| 401 Unauthorized | Verify .env.dev backend, restart `yarn dev:firebase` |
| Firebase auth/user-not-found | Create user di Firebase Console |
| Port already in use | Kill process: `Get-Process node \| Stop-Process -Force` |
| Module not found | `yarn install` di folder yang sesuai |

---

## 📝 Submission Checklist

Sebelum submit technical test:

- [ ] **Kode bersih**: No console.error di production
- [ ] **Testing**: Semua fitur tested dan berfungsi
- [ ] **Dokumentasi**: README.md lengkap dengan setup instructions
- [ ] **Environment**: .env.example files provided (tanpa secrets)
- [ ] **Git**: Commit history clear dan deskriptif
- [ ] **Demo**: Siap demo live untuk reviewer
- [ ] **.gitignore**: .env* files di-ignore
- [ ] **Dependencies**: package.json up to date

---

## 📞 Support

Jika ada masalah atau pertanyaan, hubungi:
- **Email**: your-email@example.com
- **GitHub**: @yourusername

---

**Good luck! 🎉**

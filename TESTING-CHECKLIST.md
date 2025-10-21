# 🧪 Testing Checklist - Product Management Application

## Pre-Testing Setup
- [ ] Frontend running di `http://localhost:3000` (`yarn dev`)
- [ ] Backend running di `http://localhost:8001` (`yarn dev:firebase`)
- [ ] Firebase project configured dengan Email/Password auth enabled
- [ ] Test user created di Firebase Console
- [ ] Browser DevTools opened (F12)

---

## 🔐 Authentication Tests

### Test 1: Login Success
- [ ] Navigate to `http://localhost:3000/login`
- [ ] Enter valid email and password
- [ ] Click "Login" button
- [ ] ✅ **Expected**: Redirect to `/products` page
- [ ] ✅ **Expected**: User email displayed in header
- [ ] ✅ **Expected**: Console shows "Firebase Token: Token berhasil didapat"

### Test 2: Login Failure
- [ ] Navigate to `http://localhost:3000/login`
- [ ] Enter invalid credentials
- [ ] Click "Login" button
- [ ] ✅ **Expected**: Error message displayed
- [ ] ✅ **Expected**: Remain on login page

### Test 3: Protected Route (Not Logged In)
- [ ] Logout or open incognito browser
- [ ] Navigate directly to `http://localhost:3000/products`
- [ ] ✅ **Expected**: Auto-redirect to `/login`
- [ ] ✅ **Expected**: Warning message "Please login to access this page"

### Test 4: Login Page Redirect (Already Logged In)
- [ ] Login successfully
- [ ] Navigate to `http://localhost:3000/login`
- [ ] ✅ **Expected**: Auto-redirect to `/products`
- [ ] ✅ **Expected**: No flash of login form

### Test 5: Logout
- [ ] Login successfully
- [ ] On `/products` page, click "Logout" button
- [ ] ✅ **Expected**: Redirect to `/login`
- [ ] ✅ **Expected**: Success message "Logged out successfully"
- [ ] ✅ **Expected**: Cannot access `/products` without re-login

---

## 📋 Product List Tests

### Test 6: View Products List
- [ ] Login and navigate to `/products`
- [ ] ✅ **Expected**: Table displays with products
- [ ] ✅ **Expected**: Columns: Title, Price, Category, Description, Actions
- [ ] ✅ **Expected**: Pagination displayed at bottom
- [ ] ✅ **Expected**: Console shows API Response structure

### Test 7: Pagination
- [ ] Click page 2 in pagination
- [ ] ✅ **Expected**: Table updates with page 2 products
- [ ] ✅ **Expected**: Loading indicator briefly shows
- [ ] ✅ **Expected**: Current page highlighted in pagination
- [ ] Change "Items per page" to 20
- [ ] ✅ **Expected**: More items displayed, pagination updates

### Test 8: Search Products
- [ ] Type keyword in search box (e.g., "laptop")
- [ ] Wait 300ms
- [ ] ✅ **Expected**: Table filters to matching products
- [ ] ✅ **Expected**: Pagination resets to page 1
- [ ] ✅ **Expected**: Console shows debounced search query
- [ ] Clear search box
- [ ] ✅ **Expected**: All products displayed again

---

## ✏️ Create Product Tests

### Test 9: Open Create Modal
- [ ] Click "Add New Product" button
- [ ] ✅ **Expected**: Modal opens with empty form
- [ ] ✅ **Expected**: Form fields: Title, Price, Category, Description, Image
- [ ] ✅ **Expected**: All fields are empty

### Test 10: Create Product - Validation
- [ ] Click "Save" without filling any fields
- [ ] ✅ **Expected**: Validation errors displayed for required fields
- [ ] Fill only Title field
- [ ] Click "Save"
- [ ] ✅ **Expected**: Validation errors for remaining required fields

### Test 11: Create Product - Success
- [ ] Fill all required fields:
  - Title: "Test Product"
  - Price: 50000
  - Category: "Electronics"
  - Description: "Test description"
- [ ] Click "Save"
- [ ] ✅ **Expected**: Console shows "Firebase Token for Submit: Token berhasil didapat"
- [ ] ✅ **Expected**: Success notification "Product created successfully!"
- [ ] ✅ **Expected**: Modal closes
- [ ] ✅ **Expected**: New product appears in table
- [ ] ✅ **Expected**: Table auto-refreshes

### Test 12: Create Product - With Image
- [ ] Click "Add New Product"
- [ ] Fill required fields
- [ ] Click "Upload" and select image file
- [ ] ✅ **Expected**: File preview displayed
- [ ] Click "Save"
- [ ] ✅ **Expected**: Product created with image filename

### Test 13: Create Product - Cancel
- [ ] Click "Add New Product"
- [ ] Fill some fields
- [ ] Click "Cancel" or X button
- [ ] ✅ **Expected**: Modal closes without saving
- [ ] ✅ **Expected**: Table unchanged

---

## ✏️ Edit Product Tests

### Test 14: Open Edit Modal
- [ ] Click "Edit" button on any product
- [ ] ✅ **Expected**: Modal opens with form
- [ ] ✅ **Expected**: All fields pre-filled with existing data
- [ ] ✅ **Expected**: Modal title shows "Edit Product"

### Test 15: Edit Product - Success
- [ ] Click "Edit" on a product
- [ ] Modify Price: change to 75000
- [ ] Modify Description: add some text
- [ ] Click "Save"
- [ ] ✅ **Expected**: Console shows "Firebase Token for Submit: Token berhasil didapat"
- [ ] ✅ **Expected**: Success notification "Product updated successfully!"
- [ ] ✅ **Expected**: Modal closes
- [ ] ✅ **Expected**: Updated data displayed in table

### Test 16: Edit Product - Cancel
- [ ] Click "Edit" on a product
- [ ] Modify some fields
- [ ] Click "Cancel"
- [ ] ✅ **Expected**: Modal closes without saving
- [ ] ✅ **Expected**: Original data unchanged in table

---

## 🗑️ Delete Product Tests

### Test 17: Delete Product - Cancel
- [ ] Click "Delete" button on any product
- [ ] ✅ **Expected**: Confirmation popup appears
- [ ] ✅ **Expected**: Popup text: "Are you sure you want to delete this product?"
- [ ] Click "No" or outside popup
- [ ] ✅ **Expected**: Popup closes
- [ ] ✅ **Expected**: Product NOT deleted

### Test 18: Delete Product - Confirm
- [ ] Click "Delete" button on any product
- [ ] Click "Yes" in confirmation popup
- [ ] ✅ **Expected**: Console shows "Firebase Token for Delete: Token berhasil didapat"
- [ ] ✅ **Expected**: Success notification "Product deleted successfully!"
- [ ] ✅ **Expected**: Product removed from table
- [ ] ✅ **Expected**: Table auto-refreshes

### Test 19: Delete Last Item on Page
- [ ] Navigate to last page with only 1 product
- [ ] Delete that product
- [ ] ✅ **Expected**: Auto-navigate to previous page
- [ ] ✅ **Expected**: No empty page displayed

---

## 🔒 API Authorization Tests (BONUS)

### Test 20: Token in Console Logs
- [ ] Login successfully
- [ ] Navigate to `/products`
- [ ] Open Console tab (F12)
- [ ] ✅ **Expected**: "Firebase Token: Token berhasil didapat"
- [ ] Create a product
- [ ] ✅ **Expected**: "Firebase Token for Submit: Token berhasil didapat"
- [ ] Delete a product
- [ ] ✅ **Expected**: "Firebase Token for Delete: Token berhasil didapat"

### Test 21: Token in Network Headers
- [ ] Open Network tab (F12)
- [ ] Perform any CRUD operation (Create/Edit/Delete)
- [ ] Click request in Network tab (e.g., `/api/products`)
- [ ] Navigate to "Headers" section
- [ ] Scroll to "Request Headers"
- [ ] ✅ **Expected**: `Authorization: Bearer eyJhbGciOiJSUzI1NiIs...`
- [ ] ✅ **Expected**: Token is long JWT string

### Test 22: Backend Token Verification
- [ ] Ensure backend running with `yarn dev:firebase`
- [ ] Backend terminal should show startup message
- [ ] Perform CRUD operations
- [ ] ✅ **Expected**: All requests return status 200/201
- [ ] ✅ **Expected**: No 401 Unauthorized errors
- [ ] ✅ **Expected**: No 403 Forbidden errors
- [ ] Check backend terminal logs
- [ ] ✅ **Expected**: No authentication errors

### Test 23: Without Token (Edge Case)
- [ ] Stop frontend dev server
- [ ] Use Postman or curl to call backend directly:
  ```bash
  curl http://localhost:8001/api/web/v1/products
  ```
- [ ] ✅ **Expected**: 401 Unauthorized (if backend in firebase mode)
- [ ] ✅ **Expected**: Response indicates missing/invalid token

---

## 🎨 UI/UX Tests

### Test 24: Loading States
- [ ] Navigate to `/products`
- [ ] Observe initial load
- [ ] ✅ **Expected**: Loading indicator/spinner shown
- [ ] Create/Edit/Delete product
- [ ] ✅ **Expected**: Button shows loading state during operation
- [ ] ✅ **Expected**: Table shows loading overlay during fetch

### Test 25: Responsive Design
- [ ] Open DevTools (F12) → Device toolbar (Ctrl+Shift+M)
- [ ] Test mobile view (375px width)
- [ ] ✅ **Expected**: Table scrollable horizontally if needed
- [ ] ✅ **Expected**: Modal fits screen
- [ ] ✅ **Expected**: Buttons properly sized
- [ ] Test tablet view (768px width)
- [ ] ✅ **Expected**: Layout adapts properly

### Test 26: User Feedback
- [ ] Perform successful Create operation
- [ ] ✅ **Expected**: Green success notification
- [ ] Trigger error (e.g., stop backend and try Create)
- [ ] ✅ **Expected**: Red error notification
- [ ] ✅ **Expected**: Error message is user-friendly

---

## 🐛 Error Handling Tests

### Test 27: Backend Offline
- [ ] Stop backend server
- [ ] Try to load `/products` page
- [ ] ✅ **Expected**: Error logged in console
- [ ] ✅ **Expected**: Empty table or error message
- [ ] ✅ **Expected**: No app crash

### Test 28: Network Error During Operation
- [ ] Start Create operation
- [ ] Stop backend mid-operation (Ctrl+C backend terminal)
- [ ] ✅ **Expected**: Error notification displayed
- [ ] ✅ **Expected**: Form remains open
- [ ] ✅ **Expected**: User can retry

### Test 29: Invalid Token (Expired)
- [ ] Login successfully
- [ ] Wait for token to expire (or manually invalidate in Firebase)
- [ ] Try CRUD operation
- [ ] ✅ **Expected**: 401 error or auto-redirect to login
- [ ] ✅ **Expected**: Appropriate error message

---

## 🔄 Session Persistence Tests

### Test 30: Page Refresh
- [ ] Login successfully
- [ ] Navigate to `/products`
- [ ] Refresh page (F5 or Ctrl+R)
- [ ] ✅ **Expected**: Still logged in
- [ ] ✅ **Expected**: User email still displayed
- [ ] ✅ **Expected**: No redirect to login

### Test 31: New Tab
- [ ] Login successfully in Tab 1
- [ ] Open new tab (Ctrl+T)
- [ ] Navigate to `http://localhost:3000/products`
- [ ] ✅ **Expected**: Auto-logged in (shared auth state)
- [ ] ✅ **Expected**: User info displayed

### Test 32: Browser Close/Reopen
- [ ] Login successfully
- [ ] Close browser completely
- [ ] Reopen browser
- [ ] Navigate to `http://localhost:3000/products`
- [ ] ✅ **Expected**: Need to login again (session not persisted)
- [ ] OR ✅ **Expected**: Still logged in (if Firebase persistence enabled)

---

## 📊 Summary

**Total Tests**: 32  
**Core Features**: Tests 1-19  
**Bonus Features**: Tests 20-23  
**UI/UX**: Tests 24-26  
**Edge Cases**: Tests 27-32  

### Pass Criteria
- [ ] All Core Feature tests pass (✅ Tests 1-19)
- [ ] All Bonus Feature tests pass (✅ Tests 20-23)
- [ ] No critical bugs in UI/UX tests
- [ ] App handles errors gracefully

---

## 📝 Test Results

Date: _____________  
Tester: _____________  

**Passed**: _____ / 32  
**Failed**: _____ / 32  
**Blocked**: _____ / 32  

**Notes:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

**Critical Issues Found:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

**Recommendations:**
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________

---

## ✅ Sign-off

- [ ] All critical tests passed
- [ ] No blocking issues
- [ ] Documentation complete
- [ ] Code ready for review

**Signature**: ___________________  
**Date**: ___________________

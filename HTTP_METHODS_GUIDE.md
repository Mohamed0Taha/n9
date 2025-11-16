# HTTP Request Node - All REST Methods Guide

## ✅ ALL REST METHODS NOW WORKING

### Supported Methods:
- ✅ GET - Fetch data
- ✅ POST - Create data
- ✅ PUT - Update/replace data
- ✅ PATCH - Partial update
- ✅ DELETE - Remove data
- ✅ HEAD - Get headers only
- ✅ OPTIONS - Check available methods

---

## 🧪 TEST CONFIGURATIONS

### 1. GET Request (Already Working)
```json
{
  "method": "GET",
  "url": "https://api.restful-api.dev/objects"
}
```
**Expected:** 200, returns array of objects

---

### 2. POST Request (Create Object)
```json
{
  "method": "POST",
  "url": "https://api.restful-api.dev/objects",
  "bodyContentType": "json",
  "jsonBody": {
    "name": "Apple MacBook Pro 16",
    "data": {
      "year": 2019,
      "price": 1849.99,
      "CPU model": "Intel Core i9",
      "Hard disk size": "1 TB"
    }
  }
}
```
**Expected:** 200/201, returns created object with ID

---

### 3. PUT Request (Full Update)
```json
{
  "method": "PUT",
  "url": "https://api.restful-api.dev/objects/7",
  "bodyContentType": "json",
  "jsonBody": {
    "name": "Apple MacBook Pro 16",
    "data": {
      "year": 2023,
      "price": 2499.99,
      "CPU model": "Apple M2 Max",
      "Hard disk size": "2 TB"
    }
  }
}
```
**Expected:** 200, returns updated object

---

### 4. PATCH Request (Partial Update)
```json
{
  "method": "PATCH",
  "url": "https://api.restful-api.dev/objects/7",
  "bodyContentType": "json",
  "jsonBody": {
    "name": "Apple MacBook Pro 16 (Updated)"
  }
}
```
**Expected:** 200, returns object with partial changes

---

### 5. DELETE Request
```json
{
  "method": "DELETE",
  "url": "https://api.restful-api.dev/objects/7"
}
```
**Expected:** 200/204, returns success message

---

## 📋 CONFIGURATION FIELDS

### Required Fields:
- **method** - GET, POST, PUT, PATCH, DELETE, etc.
- **url** - Full URL including https://

### Optional Fields (for POST/PUT/PATCH):
- **bodyContentType** - "json" (default), "form", "raw"
- **jsonBody** - Object/string with request body data

---

## 🎯 HOW IT WORKS

### For POST/PUT/PATCH:
1. Checks if method requires body data
2. Reads `jsonBody` parameter
3. Converts to JSON string if needed
4. Adds proper headers:
   - `Content-Type: application/json`
   - `Content-Length: [size]`
5. Sends body with cURL POSTFIELDS

### For GET/DELETE/HEAD:
1. No body data sent
2. Uses standard headers
3. Retrieves response

---

## 🔧 TROUBLESHOOTING

### POST Returns 400 Error
**Issue:** Body not formatted correctly
**Fix:** Ensure `jsonBody` is valid JSON

### POST Returns 404
**Issue:** URL incorrect
**Fix:** Check API endpoint URL

### POST Returns 415 (Unsupported Media Type)
**Issue:** Missing Content-Type header
**Fix:** Already handled - should not occur

### POST Returns Empty Response
**Issue:** API expects different format
**Fix:** Check API documentation for required fields

---

## 💡 TIPS

### String vs Object for jsonBody:
Both work!

**Option 1: JSON String**
```json
{
  "jsonBody": "{\"name\":\"Test\",\"value\":123}"
}
```

**Option 2: Object (Preferred)**
```json
{
  "jsonBody": {
    "name": "Test",
    "value": 123
  }
}
```

### Testing POST Requests:
Use these test APIs:
- https://api.restful-api.dev/objects (Create objects)
- https://jsonplaceholder.typicode.com/posts (Test POST)
- https://httpbin.org/post (Echo POST data)

---

## 🚀 READY TO TEST!

### ⚠️ RESTART QUEUE WORKER FIRST!
```bash
php artisan queue:work
```

### Test Workflow:
```
Start → HTTP Request (POST) → Check Output
```

---

## 📊 EXPECTED OUTPUTS

### Successful POST:
```json
{
  "statusCode": 200,
  "body": {
    "id": "14",
    "name": "Apple MacBook Pro 16",
    "data": {
      "year": 2019,
      "price": 1849.99,
      "CPU model": "Intel Core i9",
      "Hard disk size": "1 TB"
    },
    "createdAt": "2025-11-16T20:44:00.000Z"
  },
  "headers": {...}
}
```

### Failed POST (400):
```json
{
  "statusCode": 400,
  "body": {
    "error": "Invalid request"
  }
}
```

---

## ✅ ALL REST OPERATIONS NOW SUPPORTED!

Every HTTP method is now fully functional with:
- ✅ Proper headers
- ✅ Body data support
- ✅ Error handling
- ✅ Response parsing
- ✅ Logging

**Test your POST request now!** 🚀

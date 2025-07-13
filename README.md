# 🎬 YouTube Clone REST API

This is a fully functional backend API for a YouTube-like video-sharing platform. It allows users to register, log in, upload videos, like/dislike, comment, subscribe to other channels, and track video views — all secured with JWT authentication.

---

## 🚀 Features

- ✅ User Registration & Login (JWT Auth)
- ✅ Video Upload, Update, Delete
- ✅ Like / Dislike Videos
- ✅ Add / Update / Delete Comments
- ✅ Subscribe / Unsubscribe to other Channels
- ✅ View Counter (unique views only)
- ✅ Channel Logo Upload (Cloudinary)
- ✅ Virtuals for Views & Subscriber Count
  

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB** with **Mongoose**
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Cloudinary** for media upload
- **dotenv** for environment configuration
- **multer** (optional) for file handling

---

## API Endpoints
- **user** : api/v1/user/
- **video** : api/v1/video/
- **comment** : api/v1/comment

## User End Points 
- api/v1/user/signup
- api/v1/user/signin
- api/v1/user/update
- api/v1/user/subscribe

## Video Endpoints
- api/v1/video/upload
- api/v1/video/update/:id
- api/v1/video/delete/:id
- api/v1/video/all
- api/v1/video/myVideo
- api/v1/video/like
- api/v1/video/dislike
- api/v1/video/view

## Comment Endpoints
- api/v1/comment/newComment - post
- api/v1/comment/:id - get
- api/v1/comment/:id - update
- api/v1/comment/:id - delete  

# Clone repo
`git clone https://github.com/your-username/youtube-clone-api.git`

# Install dependencies
`npm install`

# Set up your .env file

# Run the server
`npm run dev`







# CheckMate - Minimalist Todo App (fully created by AI)

A modern, feature-rich todo application built with React and Firebase, featuring a clean and minimalist design.

## Features

- 📝 Create, edit, and delete tasks
- 🎨 Priority levels with color coding
- 🌓 Dark/Light mode
- 📱 PWA support for offline use
- 🔄 Drag and drop task reordering
- 🔍 Search and filter tasks
- 📅 Due dates and reminders
- 🔄 Auto-cleanup of completed tasks
- 📊 Progress tracking
- 🔐 Google authentication
- 📱 Responsive design
- 📅 Google Calendar integration
- ☁️ Cloud sync with Firebase

## Tech Stack

- React
- Tailwind CSS
- Firebase (Authentication & Firestore)
- Zustand (State Management)
- Framer Motion (Animations)
- React Beautiful DnD (Drag & Drop)
- Vite (Build Tool)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/minimalist-todo.git
   cd minimalist-todo
   ```

2. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Create a Firebase project and update the configuration:
   - Create a new project in Firebase Console
   - Enable Authentication and Firestore
   - Copy your Firebase config to `src/firebase.js`

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

## Environment Variables

Create a `.env` file in the frontend directory with the following variables:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

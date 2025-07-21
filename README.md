# RuralStar

**Empowering Rural Communities Through Technology**

RuralStar is a modern web application designed to empower rural communities by providing a platform for networking, sharing knowledge, and personal development. Built with Next.js, TypeScript, and Firebase, the platform bridges the digital divide and fosters growth in rural areas.

---

## 👤 Developer

**Prashant Kumar**

---

## 🚀 Features

- User registration and authentication
- Profile management and enhancement tools
- Post creation and sharing
- Messaging and notifications
- Skill and achievement tracking
- Responsive and mobile-friendly UI

---

## 🛠️ Tech Stack

- **Frontend:** Next.js, React, TypeScript
- **Styling:** Tailwind CSS
- **Backend/Database:** Firebase (Authentication & Firestore)
- **AI Integration:** Genkit (for profile improvement tools)

---

## 📁 Folder Structure

```
RuralStar-master/
├── src/
│   ├── ai/              # AI and Genkit flows
│   ├── app/             # Main application pages and routes
│   ├── components/      # Reusable UI and feature components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions and Firebase integration
│   └── next.config.ts   # Next.js configuration
├── public/              # Static assets
├── package.json         # Project metadata and dependencies
├── README.md            # Project documentation
└── ...                  # Other config and environment files
```

---

## 🏁 Getting Started

### Prerequisites

- Node.js (v18 or above recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Prash-Ant-Magician/RuralStar-master.git
   cd RuralStar-master
   ```
2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```
3. **Set up Firebase:**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Add your Firebase config to `src/lib/firebase/config.ts`

4. **(Optional) Configure AI/Genkit integration:**  
   Update `src/ai/genkit.ts` as needed.

### Running the App

```sh
npm run dev
# or
yarn dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## 📦 Usage Example

### Register a New User

1. Visit `http://localhost:3000/register`
2. Fill out the registration form with your details
3. Click **Register** to create your account

### Create a New Post

1. Log in to your account
2. Navigate to the "Create Post" section
3. Enter your content and submit to share with the community

### Enhance Your Profile

1. Go to your profile page after logging in
2. Use the "Enhance Profile" feature (powered by Genkit AI) to get suggestions for improvement

### Connect with Others

1. Browse the "Community" page to see other users
2. Send messages, share skills, and collaborate

---

## 🤝 Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.

---

## 📄 License

This project is licensed under the MIT License.

---

> _Empowering rural communities through technology._

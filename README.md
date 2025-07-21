# RuralStar

RuralStar is a modern web application designed to empower rural communities by providing a platform for networking, sharing knowledge, and personal development. Built with Next.js, TypeScript, and Tailwind CSS, it offers a seamless and interactive user experience.

## Features

- User registration and authentication
- Profile management and enhancement tools
- Post creation and sharing
- Messaging and notifications
- Skill and achievement tracking
- Responsive and mobile-friendly UI

## Tech Stack

- **Frontend:** Next.js, React, TypeScript
- **Styling:** Tailwind CSS
- **Backend/Database:** Firebase (Authentication & Firestore)
- **AI Integration:** Genkit (for profile improvement tools)

## Getting Started

### Prerequisites

- Node.js (v18 or above recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/RuralStar.git
   cd RuralStar
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```
3. Set up Firebase:
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Add your Firebase config to `src/lib/firebase/config.ts`

4. (Optional) Configure AI/Genkit integration in `src/ai/genkit.ts`.

### Running the App

```sh
npm run dev
# or
yarn dev
```
The app will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

- `src/app/` - Main application pages and routes
- `src/components/` - Reusable UI and feature components
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility functions and Firebase integration
- `src/ai/` - AI and Genkit flows

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.

## License

This project is licensed under the MIT License.

---

*Empowering rural communities through technology.*

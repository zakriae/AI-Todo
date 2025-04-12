# AI-Todo: Smart Task Management System


AI-Todo is an intelligent task management application that helps you organize your daily activities efficiently, with AI-powered suggestions to enhance productivity.

## ✨ Features

- **User Authentication** - Secure login with Google OAuth
- **Projects Management** - Organize tasks into separate projects
- **Labels** - Categorize tasks with custom labels
- **Task Priorities** - Set importance levels from P1 to P4
- **Due Dates** - Track deadlines with calendar integration
- **Smart Views** - Today, Upcoming, and Inbox views
- **AI-Powered Suggestions** - Generate missing tasks and subtasks using OpenAI
- **Responsive Design** - Works on mobile, tablet, and desktop

## 🛠️ Technologies

- **Frontend**: Next.js 15, React 18, TailwindCSS
- **Backend**: Next.js API routes, MongoDB
- **Authentication**: NextAuth.js
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form with Zod validation
- **UI Components**: Shadcn UI system
- **AI Integration**: OpenAI API
- **Styling**: TailwindCSS with animations


## 📱 Project Structure

```
AI-Todo/
├── actions/         # Server actions for data operations
├── app/             # Next.js app directory with routes
├── components/      # Reusable React components
│   ├── add-tasks/   # Task creation components
│   ├── containers/  # Page containers
│   ├── labels/      # Label management
│   ├── nav/         # Navigation components
│   ├── projects/    # Project management
│   ├── todos/       # Todo components
│   └── ui/          # UI components (Shadcn)
├── hooks/           # Custom React hooks
├── lib/             # Utility libraries
├── public/          # Static assets
├── types/           # TypeScript type definitions
└── utils/           # Utility functions

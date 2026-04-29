# Frontend Setup Guide

This is a React + TypeScript + Vite frontend application with TailwindCSS styling.

## Prerequisites

Before getting started, ensure you have the following installed on your system:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or your preferred package manager (yarn, pnpm)
- **Git** (optional, for version control)

## Installation & Setup

### 1. Install Dependencies

Open your terminal in the `frontend` directory and run:

```bash
npm install
```

Or if you prefer using yarn or pnpm:

```bash
yarn install
# or
pnpm install
```

This will install all required dependencies listed in `package.json`.

## Running the Application

### Development Server

To start the development server with hot reload:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the next available port if 5173 is in use).

### Build for Production

To create an optimized production build:

```bash
npm run build
```

The compiled files will be generated in the `dist/` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

### Linting

To check for code quality issues and style violations:

```bash
npm run lint
```

To auto-fix some linting issues:

```bash
npm run lint -- --fix
```

## Project Structure

```
frontend/
├── src/
│   ├── assets/           # Static assets (images, fonts, etc.)
│   ├── components/       # Reusable React components
│   ├── hooks/           # Custom React hooks
│   ├── layout/          # Layout components (Header, Sidebar, Footer)
│   ├── pages/           # Page components
│   ├── routes/          # Routing configuration
│   ├── schema/          # TypeScript schemas/types
│   ├── store/           # Zustand state management stores
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main App component
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
├── public/              # Public static files
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── README.md           # This file
```

## Technology Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **UI Components**: Shadcn/ui, Radix UI
- **State Management**: Zustand
- **Routing**: React Router
- **HTTP Client**: Axios
- **Validation**: Zod
- **Icons**: Lucide React
- **Linting**: ESLint

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Check code quality and style |

## Environment Variables

If your application requires environment variables, create a `.env` file in the `frontend` directory:

```
VITE_API_URL=http://localhost:3000/api
```

Note: Environment variables must be prefixed with `VITE_` to be accessible in the client.

## Troubleshooting

### Port 5173 is already in use

Vite will automatically try the next available port. You can also manually specify a port:

```bash
npm run dev -- --port 3000
```

### Dependencies installation fails

Try clearing npm cache and reinstalling:

```bash
npm cache clean --force
npm install
```

### TypeScript errors

Ensure your TypeScript version is up to date:

```bash
npm install typescript@latest
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run `npm run lint` to check for issues
4. Commit your changes with clear messages
5. Push to the repository

## Additional Resources

- [Vite Documentation](https://vite.dev/)
- [React Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)

---

**Happy coding!** 🚀
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

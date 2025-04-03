# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for code issues

## Code Style Guidelines
- **Component Files**: Use PascalCase for component file names (e.g., `Button.tsx`)
- **Imports**: Order - React/Next, third-party libraries, local components, utilities
- **Components**: Use function declarations with arrow functions
- **Types**: Use TypeScript interfaces with descriptive names
- **Naming**: PascalCase for components/interfaces, camelCase for variables/functions
- **Error Handling**: Use try/catch with specific error messages and console.error logging
- **React Patterns**: Use React hooks (useState, useEffect, useRef) for state management
- **UI Components**: Leverage the existing Shadcn/Radix UI component library
- **CSS**: Use Tailwind CSS for styling with className prop
- **File Structure**: Group related components by feature area

## Technologies
- Next.js 15.1.0 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Shadcn UI components
- Framer Motion for animations
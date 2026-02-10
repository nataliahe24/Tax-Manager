<p align="center">
  <img src="https://img.icons8.com/3d-fluency/94/task.png" alt="Task Manager Logo" width="80" />
</p>

<h1 align="center">Task Manager</h1>

<p align="center">
  <strong>Modern task manager built with Next.js, React and Tailwind CSS</strong>
</p>

<p align="center">
  <a href="https://statuesque-entremet-4c9d2f.netlify.app/">
    <img src="https://img.shields.io/badge/Live_Demo-Netlify-00C7B7?logo=netlify&logoColor=white" alt="Live Demo" />
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Jest-30-C21325?logo=jest" alt="Jest" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License" />
</p>

---

## Description

**Task Manager** is a CRUD web application for managing tasks that lets you create, edit, complete and delete tasks with priorities, due dates and dark mode support. Data is persisted in `localStorage`, so no backend or database is needed.

The project follows the **Atomic Design** methodology for component organization and is designed as learning material to master the modern React stack.

---

## Features

| Feature                   | Details                                                                             |
| ------------------------- | ----------------------------------------------------------------------------------- |
| **Create tasks**          | Title, description, due date and priority (High / Medium / Low)                     |
| **Inline editing**        | Click any task to edit its title and description without leaving the list           |
| **Complete / Reactivate** | Checkbox to mark as completed or set back to pending                                |
| **Delete with Undo**      | Confirmation before deleting and toast notification with undo option                |
| **Filters**               | All, Active or Completed with a single click                                        |
| **Search**                | Search by title or description with debounce (300 ms)                               |
| **Dark / Light mode**     | Theme toggle persisted in `localStorage` with no flash on load                      |
| **Toasts**                | Animated notifications (success, error, info) with auto-dismiss and timeout cleanup |
| **Validation**            | Real-time validation on all form fields                                             |
| **Persistence**           | Data saved in `localStorage`; survives reloads and tab closures                     |
| **Responsive**            | Mobile-first design with Tailwind CSS                                               |
| **Accessibility**         | ARIA roles, `aria-live`, `aria-label` on interactive controls                       |

---

## Technologies Used

| Technology                                          | Version | Purpose                                         |
| --------------------------------------------------- | ------- | ----------------------------------------------- |
| [**Next.js**](https://nextjs.org/)                  | 16.1.6  | React framework with App Router and SSR/SSG     |
| [**React**](https://react.dev/)                     | 19.2.3  | UI library with hooks and functional components |
| [**TypeScript**](https://www.typescriptlang.org/)   | 5.x     | Static typing for safety and better DX          |
| [**Tailwind CSS**](https://tailwindcss.com/)        | 4.x     | Utility-first CSS with dark mode support        |
| [**Jest**](https://jestjs.io/)                      | 30.x    | Unit and component testing                      |
| [**Testing Library**](https://testing-library.com/) | 16.x    | User-centric testing utilities                  |
| [**ESLint**](https://eslint.org/)                   | 9.x     | Linting and code quality                        |

---

## Project Structure

```
task-manager/
├── app/
│   ├── globals.css          # Global styles + toast animations
│   ├── layout.tsx           # Root layout with ToastProvider and theme
│   └── page.tsx             # Main page (CRUD + filters + search)
├── components/
│   ├── atoms/               # Primitive reusable components
│   │   ├── TextField.tsx
│   │   ├── TextAreaField.tsx
│   │   ├── DateField.tsx
│   │   ├── SelectField.tsx
│   │   └── index.ts
│   ├── molecules/           # Small functional components
│   │   └── ThemeToggle.tsx
│   └── organisms/           # Complex components that compose atoms
│       ├── TaskForm.tsx
│       └── TaskList.tsx
├── contexts/
│   └── ToastContext.tsx      # Toast notification provider
├── hooks/
│   ├── useDebounce.ts        # Generic debounce hook
│   ├── useLocalStorage.ts    # localStorage persistence
│   ├── useTaskFormValidation.ts  # Form validation logic
│   └── useTheme.ts           # Dark/light mode toggle
├── lib/
│   ├── date-utils.ts         # Date formatting and calculations
│   ├── priority-styles.ts    # Centralized priority styles
│   ├── theme-script.ts       # Anti-flash theme script
│   ├── types.ts              # Task, TaskStatus, TaskPriority types
│   └── index.ts              # Barrel exports
└── __tests__/
    └── page.test.tsx          # CRUD and UI tests
```

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- npm (included with Node.js)

### Create the project from scratch

```bash
npx create-next-app@latest task-manager
```

### Clone this repository

```bash
git clone <repository-url>
cd task-manager
```

### Install dependencies

```bash
npm install
```

---

## Usage

### Development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production build

```bash
npm run build
npm start
```

### Run tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

---

## Examples

### Create a task

1. Fill in the **"New task"** form with a title, description, date and priority.
2. Click **"Add task"**.
3. The task appears immediately in the list and a confirmation toast is shown.

### Edit a task

1. Click on any task in the list.
2. Modify the title or description.
3. Press **"Save"** or `Enter` to confirm (`Escape` to cancel).

### Filter and search

- Use the **All / Active / Completed** buttons to filter by status.
- Type in the search field to filter by title or description in real time.

### Switch theme

- Click the sun/moon icon in the top-right corner of the header.

---

## Available Scripts

| Command         | Description                         |
| --------------- | ----------------------------------- |
| `npm run dev`   | Start development server with HMR   |
| `npm run build` | Generate optimized production build |
| `npm start`     | Serve the production build          |
| `npm run lint`  | Run ESLint across the project       |
| `npm test`      | Run the test suite with Jest        |

---

## Learning Resources

### Official Documentation

- [Next.js Docs](https://nextjs.org/docs) - Complete Next.js documentation
- [React Docs](https://react.dev/) - Official React documentation
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/) - Comprehensive TypeScript guide
- [Tailwind CSS Docs](https://tailwindcss.com/docs) - Class reference and configuration
- [Jest Docs](https://jestjs.io/docs/getting-started) - Testing guide with Jest
- [Testing Library](https://testing-library.com/docs/) - User-centric testing docs

### Tutorials and Courses

- [Codecademy - Build and Deploy an App with Cursor](https://www.codecademy.com/learn/build-and-deploy-an-app-with-cursor) - The course this project was built with
- [freeCodeCamp - React Course](https://www.freecodecamp.org/learn/front-end-development-libraries/#react) - Free React course
- [freeCodeCamp - TypeScript Course](https://www.freecodecamp.org/news/learn-typescript-beginners-guide/) - TypeScript beginner guide
- [Codecademy - Learn React](https://www.codecademy.com/learn/react-101) - Interactive React course
- [Codecademy - Learn TypeScript](https://www.codecademy.com/learn/learn-typescript) - Interactive TypeScript course
- [Next.js Learn](https://nextjs.org/learn) - Official interactive Next.js tutorial
- [Tailwind CSS Tutorial](https://tailwindcss.com/docs/utility-first) - Learn the utility-first approach

### Atomic Design

- [Atomic Design by Brad Frost](https://bradfrost.com/blog/post/atomic-web-design/) - Original Atomic Design article
- [Atomic Design Methodology](https://atomicdesign.bradfrost.com/) - Full book (free online)

---

## Contributing

Contributions are welcome! To collaborate:

1. Fork the repository
2. Create a branch for your feature:
   ```bash
   git checkout -b feat/my-new-feature
   ```
3. Make your changes following the commit convention:
   - `feat:` new feature
   - `fix:` bug fix
   - `refactor:` code improvement without changing functionality
   - `docs:` documentation changes
   - `test:` add or modify tests
   - `style:` formatting changes (no logic affected)
4. Make sure the tests pass: `npm test`
5. Create a Pull Request describing your changes

---

## License

This project is licensed under the **MIT** License. See the [LICENSE](LICENSE) file for details.

---

## Contact

If you have questions, suggestions or find any issues, please open an [issue](../../issues) in the repository.

---

<p align="center">
  Made with <img src="https://img.icons8.com/fluency/20/pixel-heart.png" alt="heart" /> using Next.js + React + TypeScript
</p>

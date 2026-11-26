# Birthday Buddy 🎂

A simple birthday countdown built with React, TypeScript, Vite, and Tailwind CSS v4.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

1. Extract this ZIP file.
2. Open the extracted `birthday-countdown` folder in VS Code.
3. Open the integrated terminal (**Terminal → New Terminal**).
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local URL printed by Vite (usually http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

## Features

- Live days / hours / minutes / seconds countdown
- Birthday-today celebration banner
- February 29 handling in non-leap years
- Add, edit, and delete birthdays
- Optional birth year and emoji
- Chronologically sorted upcoming birthdays
- Browser localStorage persistence
- Responsive layout and reduced-motion support

No icon or animation packages are used. Birthday data stays in the browser's local storage.

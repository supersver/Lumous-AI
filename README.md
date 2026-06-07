# Lumous AI Frontend

Lumous AI is a modern multi-model AI workspace that lets users connect their own AI provider keys, chat with leading models, track usage, and manage conversations from a single dashboard.

Built with React, TypeScript, Tailwind CSS, and Firebase Authentication.

## Features

- 🔐 Google Authentication with Firebase
- 🤖 Multi-model AI support via OpenRouter
- 💬 Persistent chat conversations
- ⚡ Real-time streaming responses
- 📊 Usage and cost analytics
- 🎨 Modern responsive UI
- 🌙 Dark mode support
- 📝 Markdown rendering
- 💻 Syntax-highlighted code blocks
- 🔍 Model discovery and filtering
- 🔑 Bring Your Own API Key (BYOK)

## Tech Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- Zustand
- TanStack Query
- React Router
- Firebase Authentication
- React Markdown
- React Syntax Highlighter

### Backend

See the Lumous AI Backend repository for API implementation.

## Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm
- Firebase Project
- Lumous AI Backend running locally

### Installation

Clone the repository:

```bash
git clone https://github.com/your-username/lumous-ai-frontend.git
cd lumous-ai-frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:3000

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

Start development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## Project Structure

```text
src/
├── api/
├── components/
├── hooks/
├── layouts/
├── pages/
├── providers/
├── routes/
├── services/
├── store/
├── types/
└── utils/
```

## Roadmap

- [x] Firebase Authentication
- [x] Chat Sessions
- [x] OpenRouter Integration
- [x] Markdown Support
- [x] Syntax Highlighting
- [x] Multi-model Selection
- [x] Usage Analytics Dashboard
- [ ] Chat Search
- [ ] Export Conversations
- [ ] Shared Conversations
- [ ] Workspace Management

## Contributing

Contributions, bug reports, and feature requests are welcome.

If you'd like to contribute:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

## Security

Never commit API keys, Firebase credentials, or sensitive configuration files.

Users are responsible for managing and securing their own provider API keys.

## License

Lumous AI is licensed under the Apache License 2.0.

You are free to use, modify, and distribute this software in accordance with the terms of the Apache License 2.0. See the [LICENSE](LICENSE) file for the full license text.

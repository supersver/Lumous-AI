# <img src="https://raw.githubusercontent.com/supersver/Lumous-AI/main/src/assets/logo.svg" alt="Lumous AI" width="28" /> Lumous AI

### Open-source AI workspace for developers and teams

🌐 **Website:** https://getlumous.in

Connect your own AI providers, bring your own API keys, track usage across models, and gain complete visibility into costs, tokens, and provider activity.

Built with transparency, developer ownership, and observability at its core.

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
![Open Source](https://img.shields.io/badge/Open%20Source-Yes-success)
![BYOK](https://img.shields.io/badge/BYOK-Supported-purple)
![OpenRouter](https://img.shields.io/badge/OpenRouter-Integrated-orange)
![Built in Public](https://img.shields.io/badge/Built%20in-Public-22C55E)

---

## ✨ What is Lumous AI?

Lumous AI is an open-source AI workspace that enables developers and teams to use their own AI provider credentials while maintaining complete ownership of their infrastructure, usage, and costs.

Unlike many AI applications that bundle model access into expensive subscriptions, Lumous AI follows a **Bring Your Own Key (BYOK)** approach.

You bring the keys.

You choose the models.

You control the spend.

Lumous AI provides the tooling, analytics, and observability layer needed to understand how AI is being used across your workspace.

---

## 🎯 Why Lumous AI?

Most AI platforms focus on the chat experience.

Lumous AI focuses on visibility and control.

### 🔓 Open Source

Inspect the code, contribute improvements, and self-host the platform.

### 🔑 Bring Your Own Keys

Use your own provider credentials and maintain ownership of your AI infrastructure.

### 🤖 Model Agnostic

Access multiple AI providers through OpenRouter without vendor lock-in.

### 📊 Usage Analytics

Track requests, tokens, and model adoption across your workspace.

### 💰 Cost Transparency

Understand exactly where your AI budget is being spent.

### 🔒 Secure Credential Management

API keys are encrypted before storage and handled securely.

### 🌐 Self-Host Friendly

Run Lumous AI within your own infrastructure if desired.

---

## ✨ Features

* 🔑 Bring Your Own Keys (BYOK)
* 🤖 OpenRouter Integration
* 💬 Multi-Model AI Chat
* ⚡ Streaming Responses
* 📊 Usage Analytics Dashboard
* 💰 Cost Tracking & Reporting
* 📝 Markdown Rendering
* 💻 Syntax Highlighted Code Blocks
* 🔍 Model Discovery
* 📂 Persistent Conversations
* 🔒 Secure API Key Storage
* 🌙 Dark Mode
* 🚀 Open Source

---

## 🏗️ Architecture

```text
┌──────────────────────────────────────────────────────────┐
│                        Lumous AI                         │
└──────────────────────────────────────────────────────────┘
                            │
                            ▼

┌──────────────────────────────────────────────────────────┐
│                     Frontend (React)                     │
├──────────────────────────────────────────────────────────┤
│ • Chat Workspace                                         │
│ • Conversation Management                                │
│ • Model Selection                                        │
│ • Analytics Dashboard                                    │
│ • User Settings                                          │
└──────────────────────────────────────────────────────────┘
                            │
                            ▼

┌──────────────────────────────────────────────────────────┐
│                    Backend Services                      │
├──────────────────────────────────────────────────────────┤
│ • Authentication                                         │
│ • API Key Management                                     │
│ • Conversation Storage                                   │
│ • Usage Tracking                                         │
│ • Cost Analytics                                         │
│ • OpenRouter Gateway                                     │
└──────────────────────────────────────────────────────────┘
                            │
                            ▼

┌──────────────────────────────────────────────────────────┐
│                       OpenRouter                         │
└──────────────────────────────────────────────────────────┘
                            │
                            ▼

┌──────────────────────────────────────────────────────────┐
│                    AI Model Providers                    │
├──────────────────────────────────────────────────────────┤
│ OpenAI • Anthropic • Google • Meta • Mistral • Others    │
└──────────────────────────────────────────────────────────┘
```

---

## 📦 Repositories

### Frontend

Main application interface for interacting with AI models.

Repository:

```text
Lumous-AI
```

Features:

* Chat Interface
* Model Selection
* Analytics Dashboard
* Conversation Management
* User Settings

### Backend

Core API and platform services.

Repository:

```text
Lumous-BE
```

Features:

* Authentication
* OpenRouter Integration
* Usage Tracking
* Cost Analytics
* API Key Management

### Website

Official marketing website and documentation portal.

Repository:

```text
Lumous-AI-Web
```

Features:

* Product Showcase
* Open Source Information

---

## 🛠️ Tech Stack

### Frontend

* React
* TypeScript
* Tailwind CSS
* Material UI
* Zustand
* TanStack Query
* Firebase Authentication
* React Router
* Axios

### Backend

* Node.js/ExpressJS
* TypeScript
* REST APIs
* SSE

### AI Infrastructure

* OpenRouter

### Website

* Next.js
* TypeScript
* Tailwind CSS
* Shadcn

---

## 🚀 Getting Started

Clone the repository:

```bash
git clone https://github.com/supersver/Lumous-AI.git
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Refer to each repository's README for project-specific setup instructions.

---

## 🗺️ Roadmap

### Completed

* [x] BYOK Support
* [x] OpenRouter Integration
* [x] Multi-Model Support
* [x] Authentication
* [x] Persistent Conversations
* [x] Streaming Responses
* [x] Analytics Dashboard
* [x] Cost Tracking
* [x] Markdown Support
* [x] Syntax Highlighting

### Planned

* [ ] Team Workspaces
* [ ] Shared Conversations
* [ ] Conversation Search
* [ ] Prompt Library
* [ ] Export Conversations
* [ ] Advanced Reporting
* [ ] Self-Hosting Documentation
* [ ] Additional Provider Integrations
* [ ] Workspace Analytics

---

## 🤝 Contributing

Contributions are welcome and appreciated.

Whether you're fixing bugs, improving documentation, enhancing accessibility, optimizing performance, or proposing new features, we'd love your help.

### Contributing Process

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

---

## 🔐 Security

Never commit API keys, secrets, or sensitive credentials.

If you discover a security vulnerability, please open a responsible disclosure issue and avoid publicly disclosing the vulnerability until it has been reviewed.

---

## 📄 License

Licensed under the Apache License 2.0.

See the [LICENSE](LICENSE) file for details.

---

## 🌟 Vision

Build the open-source AI workspace that gives developers complete ownership, visibility, and control over their AI infrastructure.

**No lock-in.**

**No hidden costs.**

**Just transparency.**

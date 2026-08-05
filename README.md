<div align="center">

# 📬 Email Outreach Automation Platform

### AI-personalized cold outreach, at scale — without sounding like a bot.

*Deduplicate. Generate. Personalize. Send. Repeat.*

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-22B573?style=for-the-badge&logo=gmail&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_API-F55036?style=for-the-badge&logo=lightning&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**[🌐 Portfolio](https://vaibhav7506portfolio.vercel.app/)** · [📖 Documentation](#-getting-started) · [🐛 Report a Bug](#)

</div>

<br>

## 🎯 The Problem

Cold outreach to HR and Talent Acquisition professionals usually fails one of two ways:

- **Fully manual** → doesn't scale, burns hours per week
- **Fully templated** → sounds generic, gets ignored or marked as spam

This platform sits in the middle: **LLM-personalized messages generated at scale**, sent through a reliable delivery pipeline, with zero duplicate or wasted sends.

<br>

## ✨ What It Does

<table>
<tr>
<td width="50%" valign="top">

### 🧹 Smart Contact Deduplication
Ingests large, messy contact lists and strips duplicate entries before a single email goes out — no repeat outreach, no wasted API calls, no annoyed recipients.

</td>
<td width="50%" valign="top">

### 🤖 AI-Personalized Messaging
Dynamically constructs a unique prompt per recipient — pulling in their company, role, and context — then sends it to **Groq's LLM API** for genuinely personalized copy instead of mail-merge fill-ins.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 📤 Reliable Delivery
Built on **Nodemailer**, handling SMTP delivery with retry-safe sending logic — so a network hiccup doesn't mean a lost lead or a duplicate email.

</td>
<td width="50%" valign="top">

### 🎯 HR-Focused Targeting
Purpose-built for outreach to **HR and Talent Acquisition professionals at Indian tech companies** — the contact schema, prompt context, and tone are all tuned for that audience.

</td>
</tr>
</table>

<br>

## 🏗️ How It Works

```
┌────────────────┐     ┌───────────────┐     ┌────────────────┐     ┌─────────────┐
│  Contact List   │ ──▶ │ Deduplication  │ ──▶ │  Prompt Builder │ ──▶ │  Groq API   │
│  (recipients)   │     │  (unique set)  │     │  (per-contact)  │     │  (generates │
└────────────────┘     └───────────────┘     └────────────────┘     │   copy)     │
                                                                       └──────┬──────┘
                                                                              │
                                                                              ▼
                                                                    ┌──────────────────┐
                                                                    │    Nodemailer     │
                                                                    │  (sends the email) │
                                                                    └──────────────────┘

                        all stages run inside sendEmails.js
```

<br>

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js |
| **AI / LLM** | Groq API |
| **Email Delivery** | Nodemailer (SMTP) |
| **Data Handling** | Custom deduplication logic over structured contact lists |

<br>

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A Groq API key
- SMTP credentials (Gmail App Password, or any SMTP provider)

### Installation

```bash
git clone https://github.com/vaibhav7506/<repo-name>.git
cd <repo-name>
npm install
```

### Configuration

Create a `.env` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### Run

```bash
node sendEmails.js
```

<br>

## 📂 Project Structure

```
├── sendEmails.js        # Full pipeline — dedup, prompt generation, Groq call, Nodemailer send
├── package.json
├── package-lock.json
└── .env                  # API keys & SMTP credentials (not committed)
```

<br>

## 🗺️ Roadmap

- [ ] Rate-limiting / throttled sending to respect provider limits
- [ ] Delivery + open-rate tracking
- [ ] CSV import for contact lists
- [ ] Retry queue for failed sends
- [ ] Web dashboard for campaign monitoring

<br>

## 👤 Author

**Vaibhav Sharma**
Full Stack Developer (MERN) · 2026 Batch, MMMUT

[![Portfolio](https://img.shields.io/badge/Portfolio-vaibhav7506portfolio.vercel.app-black?style=for-the-badge&logo=vercel&logoColor=white)](https://vaibhav7506portfolio.vercel.app/)

<br>

<div align="center">

*Built to make cold outreach feel a little less cold.*

</div>

# ✍️ MAYO Handwriting AI

**Convert handwriting to digital text instantly – powered by AI.**
Built by [Victor Mayowa](https://victormayowa.vercel.app) (MAYO).

[![React](https://img.shields.io/badge/React-18-20232a?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646cff?logo=vite)](https://vitejs.dev/)
[![Tesseract.js](https://img.shields.io/badge/OCR-Tesseract.js-5c7bff)](https://tesseract.projectnaptha.com/)
[![License MIT](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

> 🚀 **Live Demo**: [mayo-handwriting-ai.vercel.app](https://mayo-handwriting-ai.vercel.app)

---

## 📸 Screenshot

![MAYO Handwriting AI Screenshot](./public/screenshot.png)  
*Drag, drop, or upload an image and get recognized text in seconds.*

---

## 🧠 How It Works

This project uses **Tesseract.js**, a pure JavaScript port of Google’s Tesseract OCR engine, running directly in the browser (or via a backend proxy). The AI model is an **LSTM (Long Short-Term Memory) neural network** trained on millions of text images, including handwritten samples.

1. **Image Upload** – Accepts common formats (PNG, JPEG, WebP).  
2. **Pre‑processing** – The image is binarized and deskewed for improved accuracy.  
3. **AI Recognition** – Tesseract.js extracts characters and words, returning a plain‑text transcript.  
4. **Instant Output** – The recognized text is displayed and ready to copy.

---

## ✨ Key Features

- 🔍 **Handwriting to Text** – Works on neat handwriting, printed text, and mixed documents.
- 🎨 **Clean, Responsive UI** – Minimalist design with Mulish font, #5c7bff primary color, and dark mode.
- ⚡ **Browser‑Based OCR** – No server required; your images never leave your device (optional backend for Vercel).
- 📋 **One‑Click Copy** – Grab the recognized text instantly.
- 🌗 **Dark Mode** – Respects your system preference.
- ♿ **Accessible & Semantic HTML** – Built with a11y best practices.

---

## 🏗️ Tech Stack

| Layer         | Technology                                                                 |
| ------------- | -------------------------------------------------------------------------- |
| Frontend      | [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/) |
| Build Tool    | [Vite](https://vitejs.dev/)                                                |
| OCR Engine    | [Tesseract.js](https://www.npmjs.com/package/tesseract.js)                 |
| Styling       | CSS Modules / Tailwind (choose yours)                                      |
| Animation     | [GSAP](https://gsap.com/)                                                  |
| Deployment    | [Vercel](https://vercel.com/)                                              |

---

## 📦 Getting Started (Local Development)

```bash
# Clone the repository
git clone https://github.com/victormayowa185/mayo-handwriting-ai.git

# Navigate into the project
cd mayo-handwriting-ai

# Install dependencies
npm install

# Start the development server
npm run dev
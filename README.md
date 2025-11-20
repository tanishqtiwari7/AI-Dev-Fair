# AI-Dev-Fair (Cognibench)

A powerful AI-driven development suite designed to analyze, visualize, and document GitHub repositories. Built with the MERN stack and powered by Google's Gemini AI.

## 🚀 Features

### 1. Architecture Forge

Deep dive into any GitHub repository.

- **Visualization:** Generates Mermaid.js diagrams to visualize the project structure.
- **Analysis:** Identifies architectural layers, key components, and data flow.
- **Risk Assessment:** Detects potential issues and risks within the codebase.

### 2. Readme Forge

Automated documentation generator.

- **AI Generation:** Creates comprehensive `README.md` files based on repository content.
- **Tech Stack Detection:** Automatically identifies languages and frameworks used.
- **Preview & Export:** Live preview of the generated Markdown with options to copy or download.

### 3. File Explorer Forge

Interactive repository browser.

- **Hierarchical View:** Browse repository files in a tree structure.
- **Search:** Quickly find files within the repository.

### 4. Authentication

- Secure user signup and login system.
- Protected routes for access to the Arena tools.

## 🛠️ Tech Stack

**Frontend:**

- React (Vite)
- Tailwind CSS
- Mermaid.js (Visualization)
- React Router
- Axios

**Backend:**

- Node.js & Express
- MongoDB (Mongoose)
- Google Generative AI (Gemini 1.5 Flash)
- GitHub API Integration

## 📦 Installation & Setup

### Prerequisites

- Node.js installed
- MongoDB instance (local or Atlas)
- Google Gemini API Key

### 1. Clone the Repository

```bash
git clone https://github.com/tanishqtiwari7/Cognibench.git
cd AI-Dev-Fair
```

### 2. Backend Setup

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=3000
MONGO_URL=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
```

Start the server:

```bash
npm start
```

### 3. Frontend Setup

Navigate to the client directory and install dependencies:

```bash
cd ../client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:3000
```

Start the development server:

```bash
npm run dev
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

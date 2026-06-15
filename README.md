# MindQuery 🧠

MindQuery is a modern, blazing-fast, and responsive quiz application. It features a completely serverless architecture using **Vercel** and **Neon PostgreSQL**. 

Test your knowledge with randomized questions, see your live progress, and compete for a spot on the global leaderboard!

## ✨ Features

- **Modern UI/UX**: Clean, responsive design with smooth micro-animations.
- **Dark Mode**: Integrated dark/light theme toggle that remembers user preferences.
- **Randomized Quizzes**: Questions and choices are shuffled securely using the Fisher-Yates algorithm every time you play, ensuring no two quiz attempts are the same.
- **Live Timer**: Interactive progress bar and countdown timer for each question.
- **Global Leaderboard**: Displays past results, scores, and time taken by players, fully paginated.
- **Serverless Backend**: Powered by Node.js Vercel Serverless Functions.
- **Postgres Database**: Hosted on Neon DB for lightning-fast queries and auto-scaling.
- **CI/CD Pipeline**: Instant, zero-downtime auto-deployments directly from GitHub to Vercel.

## 🛠️ Technology Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js Serverless Functions (ES Modules)
- **Database**: Vercel Postgres (Powered by Neon)
- **Database SDK**: `@neondatabase/serverless`
- **Hosting**: Vercel

## 🚀 Live Demo

**[Play MindQuery Now](https://mindquery.vercel.app)** *(Or whatever your Vercel URL is!)*

## 📂 Project Structure

```text
mindquery/
├── htdocs/                      # Vercel Root Directory
│   ├── index.html               # Main Quiz Interface
│   ├── assets/                  # CSS styles and Frontend JS
│   │   ├── styles.css           # UI Styling & Dark Mode
│   │   └── script.js            # Core Frontend Logic & Quiz Engine
│   ├── api/                     # Node.js Serverless Backend Functions
│   │   ├── get_questions.js     # Fetches & parses questions from DB
│   │   ├── get_results.js       # Fetches & paginates past high scores
│   │   └── submit_result.js     # Saves player score & time to DB
│   ├── db_schema.sql            # PostgreSQL Database Schema setup
│   ├── restore_data.sql         # Seed data script for questions & results
│   └── package.json             # Backend dependencies (Neon SDK)
└── README.md                    # Project Documentation
```

## ⚙️ Installation & Deployment

This project is built to be deployed seamlessly on **Vercel**.

1. **Fork or Clone the Repository**
2. **Create a Vercel Project**: Import your GitHub repository into Vercel.
3. **Set the Root Directory**: In your Vercel Project Settings > General, set the **Root Directory** to exactly `htdocs`.
4. **Attach a Database**: Go to the Vercel Storage tab and add a **Vercel Postgres (Neon)** database. This will automatically inject `DATABASE_URL` into your environment variables.
5. **Initialize the Database**: Open your Neon/Vercel Postgres query editor and run the SQL scripts found in `htdocs/db_schema.sql` and `htdocs/restore_data.sql`.
6. **Redeploy**: Go to the Deployments tab and trigger a redeployment so the serverless functions pick up the new database connection string.

## 📝 License

This project is open-source and free to use.

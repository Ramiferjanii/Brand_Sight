# BrandSight - Real-Time Brand Monitoring & Market Intelligence

BrandSight is a high-end web platform designed for brands to monitor their performance, track competitors, and analyze market sentiment in real-time.

## Features

*   **Real-Time Scraping Hub**: Configure and launch automated data extraction tasks.
*   **Competitor Battle**: Side-by-side technical comparison of products with AI verdicts.
*   **AI-Powered Insights**: Llama-3 driven analysis of market trends and sentiment.
*   **Sentiment Analysis**: Advanced NLP pipeline to track brand health and customer mood.
*   **Interactive Dashboards**: Data visualizations for price tracking, rating distribution, and sales volume.
*   **Automated Notifications**: Stay informed with email and in-app alerts.

## Tech Stack

### Frontend
*   **Next.js 16** (App Router)
*   **React 19**
*   **Tailwind CSS V4**
*   **Framer Motion** (Animations)
*   **ApexCharts** (Data Visualization)

### Backend
*   **Node.js & Express**
*   **Prisma ORM**
*   **PostgreSQL / Supabase**
*   **Groq SDK** (Llama-3 for AI Insights)
*   **Python Scrapers** (Selenium & Requests)

## Getting Started

### Prerequisites
*   Node.js 18+
*   PostgreSQL database (Supabase recommended)
*   Groq API Key

### Installation

1.  **Backend Setup**:
    ```bash
    cd backend
    npm install
    # Configure .env with your DATABASE_URL and GROQ_API_KEY
    npx prisma generate
    npm start
    ```

2.  **Frontend Setup**:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

## License
ISC

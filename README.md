# 🏡 Bengaluru House Price Predictor

AI-powered web app to estimate house prices in Bengaluru based on location, sqft, BHK, and bathrooms.

## Tech Stack
- **Frontend:** Next.js, TypeScript, Tailwind CSS
- **Backend:** Flask (Python)
- **ML Model:** Linear Regression (scikit-learn)

## Features
- Select from 100+ Bengaluru locations
- Real-time price prediction
- Glassmorphism UI

## How to Run
1. Clone the repo
2. Install backend dependencies: `pip install -r server/requirements.txt`
3. Run Flask: `python server/server.py`
4. Install frontend: `cd frontend && npm install`
5. Run Next.js: `npm run dev`
6. Open `http://localhost:3000`

## Dataset
Bengaluru house prices from Kaggle (13,000+ records)

## Model Performance
- R² Score: ~0.78
- MAE: ~₹12 Lakhs

## Screenshot


## License
MIT

# VayalGuard 🌱

VayalGuard is a climate-smart farming risk assessment web application designed to help farmers understand weather conditions, identify potential farming risks, and plan suitable agricultural activities.

The application combines farm profile information with a seven-day weather forecast to provide risk assessments and practical farm action suggestions.

## Features

- **Farm Profile Management:** Enter farmer details, village, state, district, crop, sowing date, growth stage, irrigation method, and expected harvest date.
- **Backend Integration:** Save and retrieve farmer profiles using an Express API and MongoDB.
- **Seven-Day Weather Forecast:** View upcoming weather conditions using the existing Open-Meteo weather service.
- **Automatic Season Estimation:** Estimate the season from forecast conditions without requiring a manual season selection.
- **Farming Risk Assessment:** Assess potential risks based on weather forecasts and farm conditions.
- **Farm Action Plan:** Receive practical tasks based on the crop, growth stage, and forecast conditions.
- **Tamil and English Support:** Switch between Tamil and English.
- **Custom Crop Input:** Select "Other" to enter a crop not listed in the dropdown.
- **Custom Irrigation Input:** Select "Other" to enter a custom irrigation method.
- **Weather-Based Recommendations:** Get guidance related to rainfall, heat, wind, soil moisture, sowing, and harvesting.
- **Crop-Specific Guidance:** Show action-plan recommendations relevant to selected crops and farming conditions.

## Technologies Used

### Frontend
- React
- Vite
- JavaScript
- HTML
- CSS

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Weather Service
- Open-Meteo weather API
- Open-Meteo geocoding service

## Project Structure

The project contains a frontend and a separate backend.

```text
vayalguard-main/
├── src/
│   ├── App.jsx
│   └── ...
├── package.json
└── ...

backend/
├── models/
│   └── Farmer.js
├── .env
├── package.json
└── ...
```

The exact structure may vary depending on your existing project files.

## Requirements

Before running the application, install:

- Node.js
- npm
- MongoDB Atlas account or another configured MongoDB database
- A code editor such as Visual Studio Code
- An internet connection for weather data

## Installation and Setup

### 1. Start the Backend

Open a terminal in Visual Studio Code and navigate to the backend folder.

```bash
cd D:\Downloads\vayalguard-main\backend
```

Install the dependencies:

```bash
npm install
```

Create or update the `.env` file in the backend folder with your MongoDB connection details.

Example:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

Use the environment variable names expected by your existing backend code. Replace the example connection string with your actual MongoDB connection string.

**Important:** Never share your database password or upload your `.env` file to a public repository.

Start the backend using the script configured in `backend/package.json`. For example:

```bash
npm run dev
```

Or, if your project uses a start script:

```bash
npm start
```

### 2. Start the Frontend

Open a second terminal and navigate to the frontend project folder.

```bash
cd D:\Downloads\vayalguard-main\vayalguard-main
```

Install the frontend dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Open the local URL displayed in the terminal. It is commonly:

```text
http://localhost:5173
```

Keep both the frontend and backend running while testing the application.

## Backend API Endpoints

The backend provides the following endpoints.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Checks whether the backend API is running |
| POST | `/api/farmers` | Saves a farmer profile |
| GET | `/api/farmers` | Retrieves farmer profiles |
| GET | `/api/farmers/:id` | Retrieves a farmer profile using its ID |

### Health Check

Open the following URL in your browser when the backend is running on port 5000:

```text
http://localhost:5000/api/health
```

A successful response indicates that the backend is running.

## How the Application Works

1. The user enters farm and farmer details.
2. The application obtains weather data for the selected location.
3. The application displays the upcoming seven-day forecast.
4. The system estimates the season from forecast conditions.
5. The risk assessment evaluates weather and farm-related factors.
6. The Farm Action Plan provides recommendations based on the crop, growth stage, and weather conditions.
7. The user can switch between Tamil and English.
8. Farmer profile details can be saved to and retrieved from the backend database.

## Risk Assessment

The risk assessment uses rule-based conditions to estimate potential farming risks.

Factors may include:

- Rainfall probability
- Expected rainfall amount
- High temperatures
- Dry weather and soil moisture concerns
- Wind conditions
- Crop growth stage
- Expected harvest date
- Irrigation method
- Crop-specific weather concerns

Risk levels and suggested actions depend on the conditions evaluated by the application.

**Disclaimer:** These risk scores and recommendations are heuristic estimates. They are not a scientifically validated crop-loss prediction model and should not replace official weather warnings or advice from qualified agricultural experts.

## Farm Action Plan

The Farm Action Plan is intended to help farmers organize practical field activities.

Depending on the crop and conditions, recommendations may include:

- Checking weather forecasts before fieldwork
- Monitoring soil moisture
- Preparing for dry or hot weather
- Monitoring water levels in paddy fields
- Checking drainage when heavy rainfall is expected and relevant to the crop
- Planning harvesting around expected rainfall
- Taking precautions during strong winds
- Checking field conditions before sowing

Recommendations may differ depending on weather conditions, crop selection, and growth stage.

## Troubleshooting

### Error: `vite` is not recognized

Navigate to the frontend directory and run:

```bash
npm install
npm run dev
```

### Backend Is Not Connecting

1. Confirm that the backend server is running.
2. Check the backend API URL configured in the frontend.
3. Confirm that the backend port is correct.
4. Open the browser developer console and inspect any errors.
5. Check the backend terminal for error messages.

### MongoDB Connection Error

1. Check the MongoDB connection string in `.env`.
2. Verify the database username and password.
3. Check MongoDB Atlas network access settings.
4. Restart the backend after changing environment variables.

### Weather Forecast Is Not Loading

1. Check your internet connection.
2. Verify the location entered in the farm profile.
3. Check the browser console for API errors.
4. Keep the existing weather service configuration unchanged unless a change is necessary.

### Custom Crop or Irrigation Field Is Not Appearing

Select **Other** from the corresponding dropdown and check whether the custom input field appears.

If it does not appear, verify that the latest `App.jsx` has been saved and that the browser has refreshed.

## Security Considerations

- Keep database credentials in the backend `.env` file.
- Never expose database credentials in frontend code.
- Do not commit `.env` to a public Git repository.
- The current API may not include authentication or authorization.
- Before deploying publicly or using real farmer data, implement suitable authentication, authorization, input validation, and security controls.

## Future Enhancements

Potential future improvements include:

- User authentication and farmer accounts
- More
# Robusa - Frontend (React Native Expo) & Robusa_Backend (Express Node)

Welcome to Robusa! Robusa is a project consisting of a frontend built in React Native Expo and a backend built in Express Node.

## Cloning the Repository

To clone this repository, run the following command:
git clone https://github.com/BhumikDhandhukia/Robusa-.git


## Frontend Setup

### Installation

1. Navigate to the `Robusa` directory:
   ```bash
   cd Robusa

2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

1. Create a `config.js` file in the `Robusa` directory.
   
2. Add the following content to `config.js`, replacing `YOUR_BACKEND_API_URL` with the URL of your backend API (e.g., `http://localhost:3000` if running locally, If acccesing on same wifi Your IP Address:3000):

   ```javascript
   const API_URL = 'YOUR_BACKEND_API_URL';
   export default {
   API_URL,};

   ```

### Running the App

1. Start the Expo server:
   ```bash
   expo start
   ```

2. Follow the instructions to run the Expo app using Expo Go on your device.

## Backend Setup

### Installation

1. Navigate to the `Robusa_Backend` directory:
   ```bash
   cd Robusa_Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Configuration

1. Create a `.env` file in the `Robusa_Backend` directory.

2. Add your MongoDB URL to the `.env` file:
   ```
   MONGO_URL=YOUR_MONGODB_URL
   ```

### Running the Server

- To run the server with Node:
  ```bash
  node server.js
  ```

- To run the server with Nodemon (recommended for development):
  ```bash
  nodemon server.js
  ```
```




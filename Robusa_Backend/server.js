const express = require('express');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 3000;

require('dotenv').config()



const mongoURI = process.env.MONGO_URI  ;

// Connect to MongoDB Atlas on app startup
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Mongoose connection
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
  console.log('Connected to MongoDB using Mongoose');
});


app.use(cors());


app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); 
// Middleware to set up MongoDB client connection for each request
app.use((req, res, next) => {
  req.dbClient = client;
  next();
});

const authRouter = require('./routes/auth');
const registerDeviceRouter = require('./routes/registerdevice');
const notificationsRouter = require('./routes/notificationsRouter');
const deliveryPersonRouter = require('./routes/deliveryPersonRouter');



const User = require('./models/userModel'); // Import the user model

// Use the router for all routes starting with '/auth'
app.use('/registerdevice', registerDeviceRouter);
app.use('/auth', authRouter);
app.use('/notifications', notificationsRouter);
app.use('/deliveryperson', deliveryPersonRouter);


async function startServer() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');

    // Start Express server after successful MongoDB connection
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
    process.exit(1); // Exit the application if the connection fails
  }
}

// Start the server
startServer();

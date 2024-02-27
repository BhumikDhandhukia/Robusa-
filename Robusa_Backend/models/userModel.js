const mongoose = require('mongoose');


const deviceSchema = new mongoose.Schema({
  deviceName: { type: String, required: false },
  uniqueId: { type: String, required: true, unique: true },
  deviceType: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  communicationApi: { type: String, required: true, default: 'dont know' },
  pin: { type: String }, // Add the pin field here
  pinCreatedAt: { type: Date, default: Date.now } // Add the pinCreatedAt field here
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  devices: {
    type: [deviceSchema],
    default: [{ deviceName: 'Dummy', uniqueId: "D01", deviceType: "Dummy" }]
  },
  expoToken: { type: String } // Add the expoToken field here
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;

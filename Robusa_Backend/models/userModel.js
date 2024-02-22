const mongoose = require('mongoose');


const deviceSchema = new mongoose.Schema({
  deviceName: { type: String, required: false},
  uniqueId: { type: String, required: true, unique: true },
  deviceType: { type: String, required: true },
  status: { type: String, enum: ['Active', 'Inactive'], default: 'Active' },
  communicationApi: { type: String, required: true , default:'dont know'},
});


const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  devices: {
    type: [deviceSchema],
    default: [{deviceName:'Dummy',uniqueId:"D01",deviceType:"Dummy"}] 
  },
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
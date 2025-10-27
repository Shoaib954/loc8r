const mongoose = require('mongoose');

const dbURI = "mongodb://127.0.0.1:27017/loc8r";

mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });

mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on('error', err => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});
 
require("./users")
require("./locations")
require("./reviews")

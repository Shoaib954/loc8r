const mongoose = require('mongoose');

const dbURI = process.env.MONGODB_URI || "mongodb+srv://shoaib954:shoaib954@cluster0.mongodb.net/loc8r?retryWrites=true&w=majority";
mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
  console.log(`Mongoose connected to ${dbURI}`);  
});
mongoose.connection.on('error', err => {
  console.log('Mongoose connection error:', err);
});
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected');
});
 
require("./users")
require("./locations")
require("./reviews")

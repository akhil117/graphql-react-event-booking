const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//schema is like a plan
const eventSchema = new Schema({
   title:{
    type: String,
    required: true
   },
   description: {
     type: String,
     required: true
   },
   price: {
     type: String,
     required: true
   },
   date:{
     type: Date,
     required: true
   },
   creator: {
     type: Schema.Types.ObjectId,
     ref: 'User'
   }
});

// model is like a blue print
module.exports = mongoose.model('Event',eventSchema);




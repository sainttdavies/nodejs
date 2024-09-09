const mongoose =require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    industry: {
        type: String,
       
    }
});

module.exports = mongoose.model('Customers', customerSchema);

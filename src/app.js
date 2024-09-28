const express = require('express');
const mongoose = require('mongoose');
const Customer = require('./models/customer');
//const cors = require(cors);

const app = express();
mongoose.set('strictQuery', false);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(cors());

if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}
//env
const PORT = process.env.PORT || 3000; 
const CONNECTION = process.env.CONNECTION;


const customers = [
  {
    name: "Kwesi",
    industry: "Tech",
  },
  {
    name: "Davies",
    industry: "Billion",
  },
  {
    name: "Drew",
    industry: "Fly",
  },
];


const customer = new Customer({
  name: 'Davies',
  industry: 'Tech'
});


//Get Api
app.get("/", (req, res) => {
  res.send("Welcome!");
});

app.get("/api/customers", async(req, res) => {
  try{
    const result = await Customer.find();
    res.send({ "customers": result});
  }catch(e){
res.status(500).json({error: e.message});
  };
});

app.get('/api/customers/:id', async(req, res) => {
  console.log({
   requestParams: req.params,
   requestQuery: req.query
  });
  try{
    const {id: customerId}= req.params;
    console.log(customerId);
    const customer = await Customer.findById(customerId);
    console.log(customer);
    if(!customer){
      res.status(404).json({error: 'User not found'});
    }else{
      res.json({customer});
    }
  }catch(e){
    res.status(500).json({error: 'something went wrong'});
  }
});

app.get('/api/orders/:id', async(req, res) => {
  console.log({
   requestParams: req.params,
   requestQuery: req.query
  });
  try{
    const result = await Customer.findOne(
      {'orders._id': req.params.id}
    );
      console.log(result);
      if(result){
        res.json({result});
      }else{
        res.status(404).json({error: 'Order not found'});
      }
  }catch(e){
    res.status(500).json({error: 'something went wrong'});
  }
});


//Put Api 
app.put('/api/customers/:id', async(req, res) => {
  try{
    const  customerId= req.params.id;
    const  customer = await Customer.findOneAndReplace({_id: customerId}, req.body, {new: true});
    res.json({customer});
    console.log(customer);
    console.log(customerId);
  }catch(e){
    console.log(e.massage);
    res.status(500).json({error: 'something went wrong'});
  };
});

//Patch Api
app.patch('/api/customers/:id', async(req,res) => {
  try{
    const  customerId= req.params.id;
    const  customer = await Customer.findOneAndUpdate({_id: customerId}, req.body, {new: true});
    res.json({customer});
    console.log(customer);
    
  }catch(e){
    console.log(e.massage);
    res.status(500).json({error: 'something went wrong'});
  };

});

//Patch Ordera
app.patch('/api/orders/:id', async(req,res) => {
  console.log(req.params);
  const  orderId= req.params.id;
  req.body._id = orderId;
  try{
    const result = await Customer.findOneAndUpdate(
      {'orders._id': orderId},
      { $set: {'orders.$': req.body}},
      {new: true}
    );
      console.log(result);
      if(result){
        res.json({result});
      }else{
        res.status(404).json({error: 'Order not found'});
      }
  }catch(e){
    console.log(e.massage);
    res.status(500).json({error: 'something went wrong'});
  };

});

//Delete Api
app.delete('/api/customers/:id', async(req, res) => {
  try{
    const {id: customerId} = req.params;
    const result = await Customer.deleteOne({_id: customerId}, req.body);
    res.json({deletedCount: result.deletedCount});
    console.log(result);
  }catch(e){
    res.status(500).json({error: 'Something went wrong'});
  };
});


//Post Api
app.post("/", (req, res) => {
  res.send("This is a post request!");
});

app.post('/api/customers', async (req, res) => {
  console.log(req.body);
  const customer = new Customer(req.body);
    try{
      await customer.save();
      res.status(201).json({customer});
    }catch(e){
    res.status(400).json({error: e.message});
    };
});




const start = async () => {
  try{
    await mongoose.connect(CONNECTION);
  
    app.listen(PORT, () => {
      console.log("App listening on port " + PORT);
    });
  } catch(e){
    console.log(e.message)
  }
};

start();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

require('dotenv').config();



// mongoDB connnection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.n1yvnuo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});




async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const coffeesCollection = client.db("coffeeDB").collection("coffees");
  const usersCollection= client.db("usersDB").collection("users")
    // GET coffees all data from DB 
    app.get("/coffees", async (req, res) => {
      const result = await coffeesCollection.find().toArray();
      res.send(result);
    })


    //   get single coffe data from mongoDB
    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeesCollection.findOne(query);
      res.send(result)
    });


    // POST Coffee to DB
    app.post("/coffees", async (req, res) => {
      const coffeeData = req.body;
      const result = await coffeesCollection.insertOne(coffeeData);
      res.send(result);

    })
    // PUT / UPDATE mongoDB existing data 
    app.put("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCoffee = req.body;
      console.log(updatedCoffee)

      const updatedDoc = {
        $set: updatedCoffee
      }

      const result = await coffeesCollection.updateOne(filter, updatedDoc, options);
      res.send(result);
    })

    //  delete single coffee from DB
    app.delete("/coffee/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeesCollection.deleteOne(query);
      res.send(result)
    })


   
  //  GET all-users from mongoDB

  app.get("/users", async(req,res)=> {
    const result= await usersCollection.find().toArray();
    res.send(result)
  })
//  GET single user data from mongoDB
app.get("/users/:id", async (req,res)=> {
  const id= req.params.id;
  const query= {_id: new ObjectId(id)};
  const result= await usersCollection.findOne(query);
  res.send(result);
})
  

  // POST user details
  app.post("/users", async(req,res)=> {
    const newUser= req.body;
    const result=await usersCollection.insertOne(newUser);
    res.send(result)
  });


  //  patch Users info
app.patch("/users",async (req,res)=> {
const {email, lastSignInTime}= req.body;
 const filter= {email: email}
 const updatedDoc= {
  $set : {
    lastSignInTime: lastSignInTime
  }
 }
 const result= await usersCollection.updateOne(filter, updatedDoc);
 res.send(result)
})

//  delete User
app.delete('/users/:id', async (req,res)=> {
  const id= req.params.id;
  const query= {_id : new ObjectId(id)};
  const result= await usersCollection.deleteOne(query);
  res.send(result)
})


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get("/", (req, res) => {
  res.send("Hello Coffee store server");
});

app.listen(port, () => {
  console.log(`my port is ${port}`)
})
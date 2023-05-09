const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
require('dotenv').config()
const app = express();
const cors = require('cors');

const port = process.env.POST || 5000;
// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USERS}:${process.env.DB_PASS}@cluster0.sflyv9x.mongodb.net/?retryWrites=true&w=majority`;

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

    const chocolateCollection =client.db('chocolateDB').collection('chocolate');

    app.get('/chocolates', async(req, res) => {
        const cursor = chocolateCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.post('/chocolates', async(req, res) => {
        const newChocolate = req.body;
        console.log(newChocolate);
        const result = await chocolateCollection.insertOne(newChocolate);
        res.send(result);
    })
    // delete chocolate
    app.delete('/chocolates/:id', async(req, res) =>{
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await chocolateCollection.deleteOne(query);
        res.send(result);
    })
    // update data get function
    app.get('/chocolates/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id : new ObjectId(id)};
        const chocolate = await chocolateCollection.findOne(query);
        res.send(chocolate);
    })
    // update finally updated
    app.put('/chocolates/:id', async(req, res) =>{
        const id = req.params.id;
        const chocolate = req.body;
        console.log(id, chocolate);
        const filter = {_id : new ObjectId(id)};
        const options = {upsert : true};
        const updateChocolate ={
            $set:{
                name:chocolate.name,
                photo:chocolate.photo,
                country: chocolate.country,
                category:chocolate.category
            }
        }
        const result = await chocolateCollection.updateOne(filter, updateChocolate, options);
        res.send(result);
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


app.get('/', (req, res) => {
    res.send("Chocolate Management server Is running!!!");
})

app.listen(port, (req, res) =>{
    console.log(`Chocolate management running port is : ${port}`);
})
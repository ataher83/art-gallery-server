const express = require('express')
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000

//middleware
// app.use(cors())
app.use(
  cors({
      origin: ['http://localhost:5173', 'https://the-art-gallery-74571.web.app'],
      credentials: true,
  }),
)
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.0yjrwty.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // await client.connect();  


  const craftCollection = client.db('craftDB').collection('craft');
  const userCollection = client.db('craftDB').collection('user');
  const catagoriesCollection = client.db('craftDB').collection('catagories');




// ম্যানুয়ালি ডাটাবেজে কালেকশন করা ডাটা গেট করা 
  app.get('/catagories', async(req, res) => {
    const cursor = catagoriesCollection.find() 
    const result = await cursor.toArray() 
    res.send(result) 
})





  app.get('/craft', async(req, res) => {
      const cursor = craftCollection.find() 
      const result = await cursor.toArray() 
      res.send(result) 
  })

  app.get('/craft/:id', async(req, res) => {
      const id = req.params.id 
      const query = { _id: new ObjectId(id)} 
      const result = await craftCollection.findOne(query)
      res.send(result) 
  })

  app.post('/craft', async(req, res) => {
      const newCraft = req.body
      console.log(newCraft)
      const result = await craftCollection.insertOne(newCraft)
      res.send(result) 
  })

  app.put('/craft/:id', async(req, res) => {
      const id = req.params.id 
      const filter = { _id: new ObjectId(id)} 
      const options = { upsert: true }
      const updatedCraft = req.body
      const craft = {
          $set: {
              image: updatedCraft.image,
              itemName: updatedCraft.itemName,
              subcategoryName: updatedCraft.subcategoryName,
              shortDescription: updatedCraft.shortDescription,
              price: updatedCraft.price,
              rating: updatedCraft.rating,
              customization: updatedCraft.customization,
              processingTime: updatedCraft.processingTime,
              stockStatus: updatedCraft.stockStatus,
              userEmail: updatedCraft.userEmail,
              userName: updatedCraft.userName
          }
      }

      const result = await craftCollection.updateOne(filter, craft, options)
      res.send(result) 
  })

  app.delete('/craft/:id', async(req, res) => {
      const id = req.params.id 
      const query = { _id: new ObjectId(id)} 
      const result = await craftCollection.deleteOne(query)
      res.send(result) 
  })


// ম্যানুয়ালি ডাটাবেজে কালেকশন করা ডাটা গেট করা 
//   app.get('/catagories', async(req, res) => {
//     const cursor = catagoriesCollection.find() 
//     const result = await cursor.toArray() 
//     res.send(result) 
// })





  //user related apis
  app.get('/user', async(req, res) => {
    const cursor = userCollection.find() 
    const users = await cursor.toArray() 
    res.send(users) 
})

  app.post('/user', async(req, res) => {
    const user = req.body 
    console.log(user)
    const result = await userCollection.insertOne(user)
    res.send(result) 
  })


  app.patch('/user', async(req, res) => {
    const user = req.body 
    const filter = { email: user.email }
    const updateDoc = {
      $set: {
        lastLoggedAt: user.lastLoggedAt
      }
    }
    const result = await userCollection.updateOne(filter, updateDoc)
    res.send(result) 
  })

  app.delete('/user/:id', async(req, res) => {
    const id = req.params.id 
    const query = { _id: new ObjectId(id)} 
    const result = await userCollection.deleteOne(query)
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




app.get('/', (req, res) => {
    res.send('Art Gallery Server is running')
  })
  
  app.listen(port, () => {
    console.log(`Art Gallery Server is running on port: ${port}`)
  })
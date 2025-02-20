require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hqlh5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const db = client.db("Task-Management");
    const tasksCollection = db.collection("Tasks");

    app.get("/tasks", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const tasks = await tasksCollection.find(query).toArray();
      res.json(tasks);
    });

    app.post("/tasks", async (req, res) => {
      const { email, title, description, category } = req.body;
      const task = {
        email,
        title,
        description,
        category: category ,
        timestamp: new Date(),
      };
      console.log(task)
      const result = await tasksCollection.insertOne(task);
      res.send(result);
    });

    app.put("/tasks/:id", async (req, res) => {
      const { id } = req.params;
      const updatedTask = req.body;
      const result = await tasksCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedTask }
      );
      res.send(result);
    });

    app.delete("/tasks/:id", async (req, res) => {
      const { id } = req.params;
      const result = await tasksCollection.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Task Management System is Running Perfecetly");
});

app.listen(port, () => {
  console.log(`Task management is running on port ${port}`);
});

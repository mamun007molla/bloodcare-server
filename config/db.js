const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ug9dheb.mongodb.net/?appName=Cluster0`;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db;

const connectDB = async () => {
  await client.connect();
  db = client.db("missionscic11");
  console.log("MongoDB Connected ✔️");
};

const getCol = (name) => db.collection(name);

module.exports = { connectDB, getCol };

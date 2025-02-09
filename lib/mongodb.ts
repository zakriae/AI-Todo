import { MongoClient, ServerApiVersion } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client: MongoClient;

if (process.env.NODE_ENV === "development") {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  };

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
  }
  client = globalWithMongo._mongoClient;
} else {
  client = new MongoClient(uri, options);
}

export default client;

const getDB = async (dbName: string) => {
    try {
      await client.connect()
      console.log("######db was connected#######")
      console.log( client.db(dbName))
      return client.db(dbName)
    } catch (err) {
        console.log(err)
    }
}

export const getCollection = async (collectionName: string) => {
     const db = await getDB("next-auth-db")
      if(db) {
        console.log("db was returned")
        return db.collection(collectionName)} 

     return null
}



import clientPromise from "@/lib/mongodb";


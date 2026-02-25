const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://rushi:Yash2005@demo.djkmtp0.mongodb.net/?appName=demo';
const client = new MongoClient(uri);

async function run() {
  await client.connect();
  const db = client.db('test');
  const result = await db.collection('fitnesstests').updateMany(
    { videoProofUrl: { $ne: null } },
    { $set: { videoProofUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' } }
  );
  console.log(result);
  await client.close();
}

run().catch(console.dir);

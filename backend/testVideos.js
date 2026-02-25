const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://rushi:Yash2005@demo.djkmtp0.mongodb.net/?appName=demo';
const client = new MongoClient(uri);

async function run() {
  await client.connect();
  const db = client.db('test');
  const tests = await db.collection('fitnesstests')
    .find({ videoProofUrl: { $ne: null } })
    .sort({ _id: -1 })
    .limit(3)
    .toArray();

  console.log(JSON.stringify(tests.map(t => t.videoProofUrl), null, 2));

  await client.close();
}

run().catch(console.dir);

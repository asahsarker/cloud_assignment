const { MongoClient } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.send("Server is running");
});

const uri =
	"mongodb+srv://asahsarker:Asah1081@cluster0.4yfjafm.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const run = async () => {
	try {
		await client.connect();
		const database = client.db("rainfall");
		const rainFallCollections = database.collection("rainFallCollections");
		// Post API to create data from application UI
		app.post("/api/create/rainfall", async (req, res) => {
			const result = await rainFallCollections.insertMany(req.body);
			res.json(result);
		});
	} finally {
		// await client.close()
	}
};
run().catch(console.dir);

app.listen(PORT, () => {
	console.log("server is running on port", PORT);
});

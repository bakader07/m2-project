const mongoose = require("mongoose");

const MONGO_URI = "mongodb://localhost:27017/m2-project";

mongoose
	.connect(MONGO_URI)
	.then(() => {
		console.log("Connected to MongoDB");
	})
	.catch((error) => {
		console.error("Error connecting to MongoDB:", error);
	});

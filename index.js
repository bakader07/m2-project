const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");

require("./db");
const MLModel = require("./models/MLModel");

const upload = multer({ dest: "uploads/" });

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(
	bodyParser.urlencoded({
		extended: true,
		keepExtensions: true,
		uploadDir: "uploads",
	})
);

const dir = path.join(__dirname, "public");
app.use(express.static(dir));

app.set("view engine", "ejs");

// app.get("/main", (req, res) => {
// 	// res.json({ message: "ok" });
// 	res.render("home");
// });

app.get("/models", async (req, res) => {
	// res.json({ message: "ok" })
	try {
		const models = await MLModel.find();
		console.log("models:", models);
		res.render("list", { models: models });
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});
app.get("/models/:id", async (req, res) => {
	try {
		console.log(req.params.id);
		const model = await MLModel.findById(req.params.id);
		console.log(model);
		if (!model) {
			return res.status(404).json({ error: "Model not found" });
		}
		res.render("photo", { model: model });
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});
app.post("/models/:id", upload.single("image"), async (req, res) => {
	try {
		console.log(req.params.id);
		const model = await MLModel.findById(req.params.id);
		console.log(model);
		console.log(req.file);

		const form = new FormData();
		form.append("model", model.filename);
		form.append("image", req.file.filename);
		const response = await fetch("http://localhost:5000/predict", {
			method: "POST",
			body: form,
		});

		res.render("photo", { result: response });
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});

app.get("/test", (req, res) => {
	// res.json({ message: "ok" });
	res.render("photo");
});

app.get("/upload", (req, res) => {
	// res.json({ message: "ok" });
	res.render("upload");
});
app.post("/upload", upload.single("model"), async (req, res) => {
	try {
		console.log(req.body.name);
		console.log(req.file.filename);
		const model = new MLModel({
			name: req.body.name,
			filename: req.file.filename,
		});
		await model.save();
		console.log(model);
		res.redirect("/models");
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});

//*******************************************************************/

app.get("/", (req, res) => {
	try {
		res.render("index");
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});

app.get("/about", (req, res) => {
	try {
		res.render("about");
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});

app.get("/contact", (req, res) => {
	try {
		res.render("contact");
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});

app.get("/login", (req, res) => {
	try {
		res.render("login");
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});

app.get("/404", (req, res) => {
	try {
		res.render("404");
	} catch (error) {
		res.status(500).json({ error: "Internal server error" });
	}
});

app.listen(port, () => {
	console.log(`listening at http://localhost:${port}`);
});

const port = 4000;
const fs = require("fs");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const configData = fs.readFileSync("config.json");
const config = JSON.parse(configData);
// Router 
const orderDataRouter = require("./Router/Order/orderData");
const productRouter = require("./Router/Product/product");
const newCollectionsRouter = require("./Router/newcollections/newcollections");
const popularwomenRouter = require("./Router/popularwomen/popularwomen");
const relatedproductsRouter = require("./Router/relatedproducts/relatedproducts");
const userRouter = require("./Router/Users/Users");
const signupRouter = require("./Router/Signup/Signup");
const loginRouter = require("./Router/Login/Login");
const AuthRouter = require("./Router/Auth/Auth");
const momoPaymentRouter = require('./Router/MomoPayment/MomoPayment');
const mongoURI = config.mongoURI;

mongoose
.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));
// Used Router 
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use('/newcollections', newCollectionsRouter);
app.use('/popularwomen', popularwomenRouter);
app.get("/relatedproducts", relatedproductsRouter);
app.use('/orderData', orderDataRouter);
app.use('/product', productRouter);
app.use('/users', userRouter);
app.use('/signup', signupRouter);
app.use('/login', loginRouter);
app.use('/api', AuthRouter);
app.use('/momo', momoPaymentRouter);
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage: storage });
app.use("/images", express.static("upload/images"));
app.post("/upload", upload.single("product"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "No file uploaded" });
  }
  res.json({
    success: true,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
    message: "File uploaded successfully",
  });
});
app.listen(port, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
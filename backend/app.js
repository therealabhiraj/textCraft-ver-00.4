// const express = require("express");
// const app = express();
// const cors = require('cors');

// const dotenv = require("dotenv");
// dotenv.config();
// const cookieParser = require("cookie-parser");

// const connectToDB = require("./config/db");
// connectToDB();

// app.use(cors({
//     origin: 'http://localhost:5174', // Frontend URL
//     methods: 'GET,POST,PUT,DELETE',  // Allowed HTTP methods
//     allowedHeaders: 'Content-Type,Authorization,Cookie',  // Allow cookie headers
//     credentials: true,  // Allow cookies to be sent with requests
// }));


// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// const userRouter = require("./routes/user.routes");
// app.set("view engine", "ejs");

// // Routes
// app.use("/user", userRouter);

// // Error handling middleware (optional but recommended)
// app.use((err, req, res, next) => {
//     console.error(err);
//     res.status(500).json({ message: 'Something went wrong!' });
// });

// app.listen(5000, () => {
//     console.log("Server is running on port 5000");
// });


const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const cors = require('cors');
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");

const connectToDB = require("./config/db");
connectToDB();

// Import image routes
const imageRouter = require("./routes/image.routes");

app.use(cors({
    origin: 'http://localhost:5174', // Frontend URL
    methods: 'GET,POST,PUT,DELETE',  // Allowed HTTP methods
    allowedHeaders: 'Content-Type,Authorization,Cookie',  // Allow cookie headers
    credentials: true,  // Allow cookies to be sent with requests
}));

app.use(bodyParser.json({ limit: '10mb' })); // for JSON payload
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // for form data
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRouter = require("./routes/user.routes");
app.set("view engine", "ejs");

// Routes
app.use("/user", userRouter);
app.use("/image", imageRouter);  // Add this line to use the image routes

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});

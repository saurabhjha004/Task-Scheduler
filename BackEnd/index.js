require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const MongoStore = require("connect-mongo");
const TaskRoutes = require("./Routes/TaskRoutes");

const PORT = 8080;

const app = express();
app.use([
  cors({
    origin: process.env.FRONTEND_DOMAIN,
    credentials: true,
    methods: ["GET", "PUT", "PATCH", "PUT", "DELETE"],
  }),
  express.json(),
  express.urlencoded({ extended: true }),
]);

const sessionStore = new MongoStore({
  mongoUrl: process.env.MONGO_URL,
  collectionName: "session",
});
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);


app.post("/forgotpass", async (req, res) => {
  const { email } = req.body;
  await authModel.findOne({ email: email }).then((user) => {
    if (!user) return res.send({ Status: "Enter a valid email" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    var transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "jhonmoorthi85131@gmail.com",
        pass: "klxb xvje ygnr qvbo",
      },
    });

    var mailOptions = {
      from: "jhonmoorthi85131@gmail.com",
      to: email,
      subject: "Forgot password for task manager",
      text: `${process.env.FRONTEND_DOMAIN}/ResetPass/${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        return res.send({ Status: "success" });
      }
    });
  });
});

const authenticator = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Login Required" });
  }
  next();
};
app.use("/todo", [authenticator, TodoRoutes]);
app.use("/note", [authenticator, NoteRoutes]);
app.use("/task", [authenticator, TaskRoutes]);

app.listen(PORT, () => {
  console.log(`Server Running On Port : ${PORT} `);
});

module.exports = app;

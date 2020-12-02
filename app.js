const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const colors = require("colors");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const cookieParser = require("cookie-parser");
const errorRoute = require("./controllers/errorController");
const error404Route = require("./middleware/404");
const connectionRoute = require("./util/mongodb").connection;


//*lOAD ENV VARS
dotenv.config({
    path:'./config/config.env',
});

const PORT = process.env.PORT || 3000;
const app = express();

const restaurantsRoute = require("./routes/restaurants");
const ownersRoute = require("./routes/owners");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");


app.use("/public", express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(mongoSanitize());
app.use(helmet());
app.use(xss());
app.use(hpp());


app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PATCH, DELETE, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
})

app.use(restaurantsRoute);
app.use(ownersRoute);
app.use(authRoute);
app.use(userRoute);

app.use(error404Route);
app.use(errorRoute);


connectionRoute()
.then(()=>{
    app.listen(PORT, ()=>{ 
        console.log(`Server starts in ${process.env.NODE_ENV} mode, on port ${PORT}`.blue.bold);
    })
})



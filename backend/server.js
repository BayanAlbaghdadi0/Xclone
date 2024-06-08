import  express from 'express';
import authRoutes from './routes/auth.route.js'
import dotenv from 'dotenv';
import  connectMongoDB  from './db/connectMongoDB.js';
import cookieParser from 'cookie-parser';
dotenv.config()
// console.log(process.env.MONGO_URL);
const app = express();


const PORT = process.env.PORT|| 5000;

//
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth',authRoutes);

// app.get('/', (req, res) => {
//   res.send('welcome in my  Express!');
// });


app.listen(PORT, () => {
  console.log(`  srever runing in ... http://localhost:${PORT}`);
  connectMongoDB();
});

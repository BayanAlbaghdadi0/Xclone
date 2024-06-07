import  express from 'express';
import authRoutes from './routes/auth.route.js'
import dotenv from 'dotenv';
import  connectMongoDB  from './db/connectMongoDB.js';
dotenv.config()
// console.log(process.env.MONGO_URL);
const app = express();


const PORT = process.env.PORT|| 5000;

//
app.use(express.json());
app.use('/api/auth',authRoutes);

app.get('/', (req, res) => {
  res.send('welcome in my  Express!');
});

app.get('/about', (req, res) => {
  res.send(' about page ');
});

app.get('/contact', (req, res) => {
  res.send(' call me at no proposal');
});


app.listen(PORT, () => {
  console.log(`  srever runing in ... http://localhost:${PORT}`);
  connectMongoDB();
});

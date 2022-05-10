import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from "dotenv";

import placesRoutes from './routes/places-routes';
import usersRoutes from './routes/users-routes';
import HttpError from './models/http-error';

dotenv.config();
const app = express();

app.use(bodyParser.json());

app.use('/api/places', placesRoutes); // => /api/places...
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500)
  res.json({message: error.message || 'An unknown error occurred!'});
});

const PORT = process.env.PORT || 1000;

mongoose
  .connect(process.env.MONGO_URL)
  .then(()=>{
    app.listen(PORT, console.log(`Server running in http://localhost:${PORT}`));
  })
  .catch(err => {
    console.log(err);
  });


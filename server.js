// These are our required libraries to make the server work.
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import express from 'express';
import dotenv from 'dotenv';
// lab 6 
// import countries from './public/lab_6/countries.js';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.route('/api')
  .get(async(req, res) => {
    console.log('GET request detected');
    // lab 5 
    // res.send(`Lab 5 for ${process.env.NAME}`);

    // lab 7 
    console.log('fetch request data', json);
  })
  .post(async (req, res) => {
    console.log('POST request detected');
    // res.send('Hello World');

    // lab 7 
    const data = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
    const json = await data.json();
    res.json(json);
    // lab 6 
    // console.log('Form data in res.body', req.body);
    // res.json(countries);
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

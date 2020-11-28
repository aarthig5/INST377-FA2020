// These are our required libraries to make the server work.
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import express from 'express';
import dotenv from 'dotenv';
// lab 6 
// import countries from './public/lab_6/countries.js';
import fetch from 'node-fetch';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

import { createRequire } from 'module';

const require = createRequire(import.meta.url);

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const dbSettings = {
	filename: './tmp/database.db',
	driver: sqlite3.Database
	};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

async function dataFetch() {
	const url = "https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json";
	const response = await fetch(url);

	return response.json()

}

async function insertIntoDB(data) {
	try {
		const restaurant_name = data.name;
		const category = data.category;

		await db.exec(`INSERT INTO restaurants (restaurant_name, category) VALUES ("${restaurant_name}", "${category}")`);
		console.log(`${restaurant_name} and ${category} inserted`);
		}

	catch(e) {
		console.log('Error on insertion');
		console.log(e);
		}

}

async function databaseInitialize(dbSettings) {
	try {
		const db = await open(dbSettings);
		await db.exec(`CREATE TABLE IF NOT EXISTS restaurants (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			restaurant_name TEXT,
			category TEXT)
			`)

		const data = await dataFetch();
		data.forEach((entry) => { insertIntoDB(entry) });


		const test = await db.get("SELECT * FROM restaurants")
		console.log(test);

	}
	catch(e) {
		console.log("Error loading Database");
		console.log(e);

	}
}

async function query(db) {
  const result = await db.all(`SELECT category, COUNT(restaurant_name) FROM restaurants GROUP BY category`);
  return result;
}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// app.route('/api')
//   .get(async(req, res) => {
//     console.log('GET request detected');
//     // lab 5 
//     res.send(`Lab 5 for ${process.env.NAME}`);

//     // lab 7 
//     console.log('fetch request data', json);
//   })
//   .post(async (req, res) => {
//     console.log('POST request detected');
//     // res.send('Hello World');

//     // lab 7 
//     const data = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
//     const json = await data.json();
//     res.json(json);

//     // lab 6 
//     // console.log('Form data in res.body', req.body);
//     // res.json(countries);
//   });

// lab 8 
app.route('/sql')
  .get((req, res) => {
    console.log('GET detected');
  })
  .post(async (req, res) => {
    console.log('POST request detected');
    console.log('Form data in res.body', req.body);
    // This is where the SQL retrieval function will be:
    // Please remove the below variable
		const db = await open(dbSettings);
    const output = await query(db);
    // This output must be converted to SQL
    res.json(output);
  });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});

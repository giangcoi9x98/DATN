"use strict"
require('dotenv').config();
const { Pool } = require('pg');
const {
    POSTGRES_URI = 'postgresql://postgres:secret_password@localhost:5433/quayso'
} = process.env;
function connectDatabase() {
  const connectionString = POSTGRES_URI;
  const pool = new Pool({
    connectionString,
    max: 10,
    min: 1,
  });
  pool.on('error', (error) => {
    console.log('failed to connect to pg ', error);
  });
  pool.on('connect', () => {
    console.log(`connected to postgres: ${connectionString}`);
  });

  return pool.connect();
}
module.exports ={
    connectDatabase
}
// import pkg from 'pg';
// import dotenv from 'dotenv';

// dotenv.config();

// const { Pool } = pkg;

// const pool = new Pool({
//     user: process.env.DB_USER,
//     host: process.env.DB_HOST,
//     database: process.env.DB_DATABASE,
//     password: process.env.DB_PASSWORD,  
//     port: process.env.DB_PORT || 5432,  
// });

// pool.on('connect', () => {
//     console.log('Connection pool established');
// });

// export default pool;

import pg from "pg";
import dotenv from 'dotenv';

dotenv.config();

// const {Pool} = pg;
// const pool = new Pool({ connectionString: process.env.DATABASE_URL })
// pool.connect();

// export pool;
// const pool = new Pool({
//         user: process.env.DB_USER,
//         host: process.env.DB_HOST,
//         database: process.env.DB_DATABASE,
//         password: process.env.DB_PASSWORD,  
//         port: process.env.DB_PORT || 5432,
//      });


const pool = new pg.Client({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
//     ssl: {
//       require: true,
//       rejectUnauthorized: false,
//       ca: process.env.SSLca,
//   },
ssl: {
    rejectUnauthorized: false, // Allow self-signed certificates (common for cloud databases)
  },
  });
  pool.connect();
  export default pool;
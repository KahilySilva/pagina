const mysql = require('mysql');
const dotenv = require('dotenv');

// Configuración de dotenv
dotenv.config({ path: './env/.env' });

// Configuración de la conexión
const connection = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE
});

// Intentar conectar a la base de datos
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  } else {
    console.log('Connected to the database successfully!');
    process.exit(0);
  }
});
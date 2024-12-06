const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',        // MySQL host (change if using remote DB)
  user: 'root',     // The MySQL username
  password: 'Mabel123', // The MySQL password
  database: 'grooming'  // The database name you're connecting to
});

connection.connect(function(err) {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as ID ' + connection.threadId);
});

const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',        // Using root user
  password: 'Mabel123', // Password set above
  database: 'grooming'  // The database you're connecting to
});

connection.connect(function(err) {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
    return;
  }
  console.log('Connected to the database as ID ' + connection.threadId);
});

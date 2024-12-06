const express = require('express');
const path = require('path');
const morgan = require('morgan');
const session = require('express-session');
const dotenv = require('dotenv');
const bcryptjs = require('bcryptjs');
const citasRouter = require('./routes/citas');
const connection = require('./database/db');

const app = express();

// Configuración de middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'));

// Configuración de dotenv
dotenv.config({ path: './env/.env' });

// Configuración de directorio público
app.use(express.static(path.join(__dirname, 'public')));

// Configuración del motor de plantillas
app.set('view engine', 'ejs');

// Configuración de sesiones
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Rutas
app.use('/citas', citasRouter);

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/cita', (req, res) => {
    res.render('cita');
});

// Registro de usuarios
app.post('/register', async (req, res) => {
    const user = req.body.user;
    const name = req.body.name;
    const correo = req.body.correo;
    const celular = req.body.celular;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    connection.query('INSERT INTO users SET ?', { user: user, name: name, correo: correo, celular: celular, pass: passwordHaash }, async (error, results) => {
        if (error) {
            console.log(error);
        } else {
            res.render('register', {
                alert: true,
                alertTittle: "Registration",
                alertMessage: "Successful Registration",
                alertIcon: 'success',
                showConfirmButton: false,
                timer: 1500,
                ruta: ''
            });
        }
    });
});

// Autenticación de usuarios
app.post('/auth', async (req, res) => {
    const user = req.body.user;
    const pass = req.body.pass;
    let passwordHaash = await bcryptjs.hash(pass, 8);
    if (user && pass) {
        connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results, fields) => {
            if (results.length == 0 || !(await bcryptjs.compare(pass, results[0].pass))) {
                res.render('login', {
                    alert: true,
                    alertTittle: "Error",
                    alertMessage: "USUARIO y/o PASSWORD INCORRECTAS",
                    alertIcon: 'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'
                });
            } else {
                req.session.loggedin = true;
                req.session.name = results[0].name;
                res.render('login', {
                    alert: true,
                    alertTittle: "Conexión exitosa",
                    alertMessage: "¡LOGIN CORRECTO!",
                    alertIcon: 'success',
                    showConfirmButton: false,
                    timer: 1500,
                    ruta: ''
                });
            }
            res.end();
        });
    } else {
        res.send('Please enter user and Password!');
        res.end();
    }
});

// Control de autenticación en todas las páginas
app.get('/', (req, res) => {
    if (req.session.loggedin) {
        res.render('index', {
            login: true,
            name: req.session.name
        });
    } else {
        res.render('index', {
            login: false,
            name: 'Debe iniciar sesión',
        });
    }
    res.end();
});

// Logout
app.get('/logout', function (req, res) {
    req.session.destroy(() => {
        res.redirect('/') // siempre se ejecutará después de que se destruya la sesión
    });
});

// Configuración del servidor para Railway
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
    console.log(`SERVER RUNNING IN http://localhost:${port}`);
});
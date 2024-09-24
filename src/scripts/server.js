const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost', // Cambia esto
    user: 'root',     // Cambia esto
    password: 'admin', // Cambia esto
    database: 'bakerwinsbd' // Cambia esto
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos: ', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Ruta para el inicio de sesión
app.post('/login', (req, res) => {
    const { usuario, contrasena } = req.body;

    // Consulta SQL para verificar el usuario y la contraseña
    const query = `
        SELECT u.nombre, uc.contrasena 
        FROM usuarios u
        JOIN usuarios_contrasena uc ON u.idUsuarios = uc.idUsuarios
        WHERE u.nombre = ? AND uc.contrasena = ?`;

    db.query(query, [usuario, contrasena], (err, results) => {
        if (err) {
            res.status(500).send('Error en la consulta a la base de datos');
            return;
        }

        if (results.length > 0) {
            res.send('Inicio de sesión exitoso');
        } else {
            res.send('Usuario o contraseña incorrectos');
        }
    });
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Función para registrar un usuario
function ingresarUsuario(email, nombre, apellidos, contrasena, callback) {
    const sql = 'INSERT INTO usuarios (email, nombre, apellidos) VALUES (?, ?, ?)';
    db.query(sql, [email, nombre, apellidos], (err, result) => {
        if (err) {
            callback(err, null);
            return;
        }

        callback(null, result);
    });
}

// Rutina para manejar el envio de datos al formulario
app.post('/registro', (req, res) => {
    const { email, nombre, apellidos, contrasena } = req.body;

    ingresarUsuario(email, nombre, apellidos, contrasena, (err, result) => {
        if (err) {
            res.status(500).send('Error al registrar usuario');
            return;
        }

        res.send('Usuario registrado correctamente');
    });
});

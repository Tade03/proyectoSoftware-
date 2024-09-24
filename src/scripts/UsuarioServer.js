// UsuarioService.js
const mysql = require('mysql');

class UsuarioService {
    constructor() {
        this.db = mysql.createConnection({
            host: 'localhost',
            user: 'tu_usuario',
            password: 'tu_contraseña',
            database: 'tu_base_de_datos'
        });

        this.db.connect((err) => {
            if (err) {
                console.error('Error conectando a la base de datos:', err);
                return;
            }
            console.log('Conectado a la base de datos MySQL');
        });
    }

    ingresarUsuario(email, nombre, apellidos, contraseña, callback) {
        const sql = 'INSERT INTO usuarios (email, nombre, apellidos, contraseña) VALUES (?, ?, ?, ?)';
        this.db.query(sql, [email, nombre, apellidos, contraseña], (err, result) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, result);
        });
    }

    // Puedes agregar más métodos aquí para otras operaciones relacionadas con usuarios
}

module.exports = UsuarioService;
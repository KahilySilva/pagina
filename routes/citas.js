const express = require('express');
const router = express.Router();
const db = require('../database/db'); // Asegúrate de que esta ruta sea correcta

// Crear una nueva cita
router.post('/create', (req, res) => {
    const { nombre_mascota, nombre_dueno, fecha_cita, servicio } = req.body;
    const sql = "INSERT INTO citas (nombre_mascota, nombre_dueno, fecha_cita, servicio) VALUES (?, ?, ?, ?)";
    db.query(sql, [nombre_mascota, nombre_dueno, fecha_cita, servicio], (err, result) => {
        if (err) {
            console.error('Error al insertar la cita:', err);
            res.status(500).send('Error al insertar la cita');
            return;
        }
        res.json({ id: result.insertId, message: 'Nueva cita creada exitosamente' });
    });
});

// Obtener todas las citas
router.get('/all', (req, res) => {
    const sql = "SELECT * FROM citas";
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error al obtener las citas:', err);
            res.status(500).send('Error al obtener las citas');
            return;
        }
        res.json(results);
    });
});

// Eliminar una cita
router.delete('/delete/:id', (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM citas WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar la cita:', err);
            res.status(500).send('Error al eliminar la cita');
            return;
        }
        res.send('Cita eliminada exitosamente');
    });
});

// Actualizar una cita
router.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { nombre_mascota, nombre_dueno, fecha_cita, servicio } = req.body;
    const sql = "UPDATE citas SET nombre_mascota = ?, nombre_dueno = ?, fecha_cita = ?, servicio = ? WHERE id = ?";
    db.query(sql, [nombre_mascota, nombre_dueno, fecha_cita, servicio, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar la cita:', err);
            res.status(500).send('Error al actualizar la cita');
            return;
        }
        res.send('Cita actualizada exitosamente');
    });
});

module.exports = router;
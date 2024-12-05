document.addEventListener('DOMContentLoaded', function() {
    cargarCitas();
});

document.getElementById('appointment-form').addEventListener('submit', agregarCita);

function cargarCitas() {
    fetch('/citas/all')
    .then(response => response.json())
    .then(data => {
        data.forEach(cita => {
            agregarCitaATabla(cita);
        });
    })
    .catch(error => {
        console.error('Error al cargar las citas:', error);
    });
}

function agregarCita(event) {
    event.preventDefault();
    
    const nombre_mascota = document.getElementById('nombre_mascota').value;
    const nombre_dueno = document.getElementById('nombre_dueno').value;
    const fecha_cita = document.getElementById('fecha_cita').value;
    const servicio = document.getElementById('servicio').value;
    
    const cita = {
        nombre_mascota: nombre_mascota,
        nombre_dueno: nombre_dueno,
        fecha_cita: fecha_cita,
        servicio: servicio
    };
    
    fetch('/citas/create', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cita)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.message);
        cita.id = data.id; // Asigna el id devuelto a la cita
        agregarCitaATabla(cita);
        document.getElementById('appointment-form').reset();
    })
    .catch(error => {
        console.error('Error al enviar la cita:', error);
    });
}

function agregarCitaATabla(cita) {
    const tableBody = document.getElementById('appointments-table-body');
    const newRow = tableBody.insertRow();
    
    newRow.insertCell(0).textContent = cita.nombre_mascota;
    newRow.insertCell(1).textContent = cita.nombre_dueno;
    newRow.insertCell(2).textContent = cita.fecha_cita;
    newRow.insertCell(3).textContent = cita.servicio;
    
    const actionsCell = newRow.insertCell(4);
    
    // Botón de eliminar
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.addEventListener('click', function() {
        fetch(`/citas/delete/${cita.id}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                tableBody.removeChild(newRow); // Eliminar la fila directamente
            } else {
                console.error('Error al eliminar la cita');
            }
        })
        .catch(error => {
            console.error('Error en la solicitud DELETE:', error);
        });
    });
    actionsCell.appendChild(deleteButton);
    
    // Botón de editar
    const editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.addEventListener('click', function() {
        editarCita(cita, newRow);
    });
    actionsCell.appendChild(editButton);
}

function editarCita(cita, row) {
    // Convertir la fecha al formato yyyy-MM-dd
    const fecha = new Date(cita.fecha_cita);
    const fechaFormateada = fecha.toISOString().split('T')[0];

    // Rellenar el formulario con los datos de la cita
    document.getElementById('nombre_mascota').value = cita.nombre_mascota;
    document.getElementById('nombre_dueno').value = cita.nombre_dueno;
    document.getElementById('fecha_cita').value = fechaFormateada;
    document.getElementById('servicio').value = cita.servicio;
    
    // Cambiar el comportamiento del formulario para actualizar la cita
    const form = document.getElementById('appointment-form');
    form.removeEventListener('submit', agregarCita);
    form.addEventListener('submit', actualizarCita);

    function actualizarCita(event) {
        event.preventDefault();
        
        const nombre_mascota = document.getElementById('nombre_mascota').value;
        const nombre_dueno = document.getElementById('nombre_dueno').value;
        const fecha_cita = document.getElementById('fecha_cita').value;
        const servicio = document.getElementById('servicio').value;
        
        const citaActualizada = {
            id: cita.id,
            nombre_mascota: nombre_mascota,
            nombre_dueno: nombre_dueno,
            fecha_cita: fecha_cita,
            servicio: servicio
        };
        
        fetch(`/citas/update/${cita.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(citaActualizada)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message);
            // Actualizar la fila en la tabla
            row.cells[0].textContent = citaActualizada.nombre_mascota;
            row.cells[1].textContent = citaActualizada.nombre_dueno;
            row.cells[2].textContent = citaActualizada.fecha_cita;
            row.cells[3].textContent = citaActualizada.servicio;
            
            // Restaurar el comportamiento original del formulario
            form.removeEventListener('submit', actualizarCita);
            form.addEventListener('submit', agregarCita);
            form.reset();
        })
        .catch(error => {
            console.error('Error al actualizar la cita:', error);
        });
    }
}
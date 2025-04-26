document.addEventListener('DOMContentLoaded', function () {
  // Establecer la fecha límite para 18 años atrás
  function setFechaLimite() {
    const hoy = new Date();
    const limite = new Date(hoy.setFullYear(hoy.getFullYear() - 18)); // Restamos 18 años
    const fechaLimite = limite.toISOString().split('T')[0]; // Convertimos a formato yyyy-mm-dd
    document.getElementById('fechaNacimiento').setAttribute('max', fechaLimite);
  }

  setFechaLimite(); // Establecer la fecha límite al cargar la página

  const formulario = document.getElementById('registroForm');

  formulario.addEventListener('submit', function (e) {
    e.preventDefault();
    let valido = true;

    const nombre = document.getElementById('nombre');
    const apellido = document.getElementById('apellido');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const telefono = document.getElementById('telefono');
    const generoSeleccionado = document.querySelector('input[name="genero"]:checked');
    const fechaNacimiento = document.getElementById('fechaNacimiento').value;

    document.querySelectorAll('.mensaje-error').forEach(el => el.style.display = 'none');

    if (!nombre.value.trim()) {
      mostrarError('errorNombre');
      valido = false;
    }
    if (!apellido.value.trim()) {
      mostrarError('errorApellido');
      valido = false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim() || !emailRegex.test(email.value)) {
      mostrarError('errorEmail');
      valido = false;
    }
    if (password.value.length < 6) {
      mostrarError('errorPassword');
      valido = false;
    }
    if (!/^[9]\d{8}$/.test(telefono.value)) {
      mostrarError('errorTelefono');
      valido = false;
    }
    if (!generoSeleccionado) {
      mostrarError('errorGenero');
      valido = false;
    }

    // Validar la fecha de nacimiento (si es mayor o igual a 18 años)
    const fechaNacimientoDate = new Date(fechaNacimiento);
    const edad = new Date().getFullYear() - fechaNacimientoDate.getFullYear();
    const mes = new Date().getMonth() - fechaNacimientoDate.getMonth();
    const dia = new Date().getDate() - fechaNacimientoDate.getDate();
    
    if (edad < 18 || (edad === 18 && (mes < 0 || (mes === 0 && dia < 0)))) {
      mostrarError('errorFechaNacimiento');
      valido = false;
    }

    if (!valido) return;

    const data = {
      nombre: nombre.value.trim(),
      apellido: apellido.value.trim(),
      email: email.value.trim(),
      password: password.value,
      telefono: telefono.value,
      genero: generoSeleccionado.value,
      fechaNacimiento: fechaNacimiento
    };

    fetch('http://localhost:3000/registrar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      // Verifica si la respuesta es exitosa
      if (!response.ok) {
        // Si la respuesta no es 2xx, lanzamos un error
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: data.message
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Serás redirigido al login.',
          confirmButtonText: 'Ir al login'
        }).then(() => {
          window.location.href = '../Login/login.html';
        });
      }
    })
    .catch(error => {
      console.error('Error al registrar:', error); // Esto te ayudará a ver el error en la consola
      Swal.fire({
        icon: 'error',
        title: 'Error inesperado',
        text: `Ocurrió un error al registrar. Detalle: ${error.message}`
      });
    });
  });

  function mostrarError(id) {
    const errorEl = document.getElementById(id);
    if (errorEl) errorEl.style.display = 'block';
  }
});

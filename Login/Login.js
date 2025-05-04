document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Prevenir el comportamiento por defecto del formulario
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    const response = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
  
    const data = await response.json();
  
    if (response.ok) {
      // Mostrar mensaje bonito de éxito
      Swal.fire({
        icon: 'success',
        title: '¡Login exitoso!',
        text: 'Bienvenido',
        confirmButtonText: 'Continuar'
      }).then(() => {
        // Redirigir después de cerrar el alert
        window.location.href = '../Index/indexbt.html';
      });
    } else {
      // Mostrar error con SweetAlert
      Swal.fire({
        icon: 'error',
        title: 'Error de login',
        text: data.error || 'Error desconocido',
        confirmButtonText: 'Intentar de nuevo'
      });
    }
});

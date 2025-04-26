const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Conexión a la base de datos MongoDB
mongoose.connect('mongodb://localhost:27017/registroapp')
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error al conectar a MongoDB', err));

// Modelo de Usuario
const Usuario = mongoose.model('Usuario', new mongoose.Schema({
  nombre: String,
  apellido: String,
  email: String,
  password: String,  // Almacenamos la contraseña tal cual en texto plano
  telefono: String,
  genero: String,
  fechaNacimiento: String
}));

// Ruta para registrar usuario
app.post('/registrar', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el correo ya existe
    const usuarioExistente = await Usuario.findOne({ email });

    if (usuarioExistente) {
      return res.status(400).json({ error: true, message: 'El correo ya está registrado' });
    }

    // Crear nuevo usuario con la contraseña en texto plano
    const nuevoUsuario = new Usuario({ ...req.body });
    await nuevoUsuario.save();

    res.json({ success: true, message: 'Usuario registrado correctamente' });
  } catch (err) {
    console.error('Error al registrar usuario:', err);
    res.status(500).json({ error: true, message: 'Error al registrar', details: err.message });
  }
});

// Ruta para login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Buscar al usuario por email
  const usuario = await Usuario.findOne({ email });

  if (!usuario) {
    return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
  }

  // Comparar la contraseña en texto plano
  if (usuario.password !== password) {
    return res.status(400).json({ error: 'Usuario o contraseña incorrectos' });
  }

  // Generar un token JWT
  const token = jwt.sign({ userId: usuario._id }, 'mi_clave_secreta', { expiresIn: '1h' });

  // Enviar el token como respuesta
  res.json({ success: true, token });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

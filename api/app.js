const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
app.use(express.json());

// Configura la conexión a MongoDB
const uri = "mongodb+srv://ialfper:ialfper21@alumnos.zoinj.mongodb.net/alumnos?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Función para conectar a la base de datos y obtener las colecciones
async function connectToMongoDB() {
  try {
    client.connect();
    console.log("Conectado a MongoDB Atlas");
    const db = client.db('Restaurante');
    return {
      menus: db.collection('menus'),
      pedidos: db.collection('Pedidos'),

    };
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    throw new Error('Error al conectar a la base de datos');
  }
}

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

//endpoint para obtener todos los usuarios
app.get('/api/menus', async (req, res) => {
  try {
    const { menus } = await connectToMongoDB();
    const listaMenus = await menus.find().toArray();
    console.log(listaMenus);
    res.json(listaMenus);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los especialistas' });
    console.log("nonononon");
  }
});




//endppoint Crear pedido

app.post('/api/Crearpedidos', async (req, res) => {

  const {idMESA, nombre, correo } = req.body;

  if (!idMESA || !nombre || !correo) {
    return res.status(400).json({ error: 'Faltan campos obligatorios...' });
  }

  const nuevoPedido = {
    mesaAsignada:idMESA,
    nombre:nombre,
    correo:correo
  };

  try {
    const { pedidos } = await connectToMongoDB();

    const resultado = await pedidos.insertOne(nuevoPedido);

    console.log(`PEDIDO creado con ID: ${resultado.insertedId}`);

    res.status(201).json({
      mensaje: 'PEDIDO ENVIADO',
      id: resultado.insertedId,
      pedido: nuevoPedido
    });



  } catch (error) {
    // Manejo de errores 
    console.error("Error al guardar la tarjeta en MongoDB:", error);
    res.status(500).json({ error: 'Error interno del servidor al crear la tarjeta' });
  }

});


module.exports = app;
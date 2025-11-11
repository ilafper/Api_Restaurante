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

//endppoint crear pedido.
app.post('/api/crearpedidos', async (req, res) => {

  const nuevoPedido = req.body;

  if (!nuevoPedido.idMesa || !nuevoPedido.menu || !nuevoPedido.estado) {
    return res.status(400).json({ error: 'Faltan campos obligatorios...' });
  }

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



//endpoint para pedidos
app.get('/api/pedidos', async (req, res) => {
  try {
    const { pedidos } = await connectToMongoDB();
    const listaPedidos = await pedidos.find().toArray();
    
    console.log(listaPedidos);
    res.json(listaPedidos);


  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los pedidos' });
    console.log("nonononon");
  }
});


module.exports = app;
# Backend Node.js con MongoDB Atlas

Backend desarrollado con Node.js, Express y MongoDB Atlas para gestionar Personas y Mascotas.

## Configuración Inicial

### 1. Crear Cluster en MongoDB Atlas

1. Ir a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear una cuenta o iniciar sesión
3. Crear un nuevo proyecto
4. Crear un cluster (puede ser tier gratuito M0)
5. Crear un usuario en Security -> Database Access
6. Permitir acceso desde tu IP en Security -> Network Access
7. Obtener la cadena de conexión (Connection String)

### 2. Configurar Variables de Entorno

1. Renombrar `.env.example` a `.env`
2. Reemplazar la URI de MongoDB con tu cadena de conexión:
```
MONGO_URI=mongodb+srv://usuario:contraseña@cluster0.xxxxx.mongodb.net/nombre_base_datos?retryWrites=true&w=majority
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:4200
```

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Ejecutar el Servidor

**Desarrollo (con nodemon):**
```bash
npm run dev
```

**Producción:**
```bash
npm start
```

El servidor se ejecutará en `http://localhost:5000`

## API Endpoints

### Personas
- `GET /api/personas` - Obtener todas las personas
- `GET /api/personas/:id` - Obtener una persona
- `POST /api/personas` - Crear una persona
- `PUT /api/personas/:id` - Actualizar una persona
- `DELETE /api/personas/:id` - Eliminar una persona

### Mascotas
- `GET /api/mascotas` - Obtener todas las mascotas
- `GET /api/mascotas/:id` - Obtener una mascota
- `GET /api/mascotas/persona/:personaId` - Obtener mascotas de una persona
- `POST /api/mascotas` - Crear una mascota
- `PUT /api/mascotas/:id` - Actualizar una mascota
- `DELETE /api/mascotas/:id` - Eliminar una mascota

## Estructura del Proyecto

```
backend-nodejs/
├── models/
│   ├── Persona.js       # Esquema de Persona
│   └── Mascota.js       # Esquema de Mascota
├── routes/
│   ├── personas.js      # Rutas de Personas
│   └── mascotas.js      # Rutas de Mascotas
├── .env                 # Variables de entorno (local)
├── .env.example         # Ejemplo de variables
├── .gitignore           # Archivos ignorados por git
├── package.json         # Dependencias
├── server.js            # Punto de entrada
└── README.md            # Este archivo
```

## Ejemplo de Uso

### Crear una Persona

```bash
curl -X POST http://localhost:5000/api/personas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "telefono": "123456789",
    "cedula": "1234567890",
    "ciudad": "Bogotá"
  }'
```

### Crear una Mascota

```bash
curl -X POST http://localhost:5000/api/mascotas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Firulais",
    "tipo": "perro",
    "raza": "Labrador",
    "color": "marrón",
    "edad": 3,
    "personaId": "ID_DE_LA_PERSONA",
    "descripcion": "Perro muy amigable"
  }'
```

## Notas Importantes

- Las mascotas están relacionadas con personas mediante `personaId`
- MongoDB Atlas proporciona un tier gratuito de 512MB ideal para desarrollo
- Asegúrate de agregar tu IP a la lista blanca en MongoDB Atlas
- Mantén seguras tus credenciales, nunca las commits al repositorio

## Troubleshooting

**Error: connect ECONNREFUSED**
- Verifica que MongoDB Atlas esté accesible
- Comprueba que tu IP esté en la lista blanca de MongoDB Atlas

**Error: MongoServerSelectionError**
- Verifica la cadena de conexión en `.env`
- Comprueba el usuario y contraseña de MongoDB

**CORS Error**
- Asegúrate de que `CORS_ORIGIN` coincida con la URL de tu frontend

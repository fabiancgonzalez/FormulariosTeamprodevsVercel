# Backend Node.js + MongoDB Atlas - Guía Rápida

✅ **¡Backend configurado exitosamente!**

## Estado Actual
- ✓ Servidor ejecutándose en puerto **5001**
- ✓ Conectado a **MongoDB Atlas**
- ✓ CORS habilitado
- ✓ Rutas API configuradas

## Endpoints Disponibles

### Personas
```
GET    /api/personas              → Obtener todas las personas
GET    /api/personas/:id          → Obtener una persona por ID
POST   /api/personas              → Crear una nueva persona
PUT    /api/personas/:id          → Actualizar una persona
DELETE /api/personas/:id          → Eliminar una persona
```

### Mascotas
```
GET    /api/mascotas              → Obtener todas las mascotas
GET    /api/mascotas/:id          → Obtener una mascota por ID
GET    /api/mascotas/persona/:personaId → Mascotas de una persona
POST   /api/mascotas              → Crear una nueva mascota
PUT    /api/mascotas/:id          → Actualizar una mascota
DELETE /api/mascotas/:id          → Eliminar una mascota
```

### Health Check
```
GET    /api/health                → Verificar estado del servidor
```

## Ejemplos de Uso

### Crear una Persona
```bash
curl -X POST http://localhost:5001/api/personas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "telefono": "3015551234",
    "cedula": "1234567890",
    "ciudad": "Bogotá"
  }'
```

### Obtener todas las personas
```bash
curl http://localhost:5001/api/personas
```

### Crear una Mascota (necesita el ID de una persona)
```bash
curl -X POST http://localhost:5001/api/mascotas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Firulais",
    "tipo": "perro",
    "raza": "Labrador",
    "color": "marrón",
    "edad": 3,
    "personaId": "AQUI_VA_EL_ID_DE_LA_PERSONA",
    "descripcion": "Perro muy amigable"
  }'
```

## Iniciar el Servidor

### Desarrollo (con nodemon - auto-recarga)
```bash
npm run dev
```

### Producción
```bash
npm start
```

## Próximos Pasos

1. **Conectar el frontend Angular** - Actualiza `src/services/data.service.ts` para usar `http://localhost:5001`
2. **Crear las colecciones** - Prueba los endpoints para crear datos
3. **Implementar autenticación** - Agregar JWT si es necesario

## Estructura del Backend
```
backend-nodejs/
├── models/
│   ├── Persona.js       # Esquema MongoDB para Personas
│   └── Mascota.js       # Esquema MongoDB para Mascotas
├── routes/
│   ├── personas.js      # Endpoints CRUD de Personas
│   └── mascotas.js      # Endpoints CRUD de Mascotas
├── config/
│   └── mongodb.js       # Configuración de MongoDB
├── server.js            # Servidor Express
├── package.json         # Dependencias
├── .env                 # Variables de entorno
└── README.md            # Documentación
```

## Solución de Problemas

**Error: EADDRINUSE (puerto en uso)**
→ Cambia el puerto en `.env` o detén el proceso que ocupa el puerto

**Error: bad auth (autenticación fallida)**
→ Verifica la contraseña en `.env` y que tu IP esté en la lista blanca de MongoDB Atlas

**Error: connect ETIMEDOUT**
→ Verifica conexión a internet y que MongoDB Atlas esté accesible

---

¡Ahora puedes empezar a usar el backend! 🚀

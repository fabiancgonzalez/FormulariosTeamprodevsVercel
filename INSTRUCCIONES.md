# 📋 Guía de Uso - Sistema de Formularios de Persona y Mascota

## ✨ Características Implementadas

### 1. **Página Principal con Dos Botones**
   - ✅ Botón "Cargar Persona"
   - ✅ Botón "Cargar Mascota"

### 2. **Formulario de Persona**
   - Campos:
     - Nombre * (requerido)
     - Apellido * (requerido)
     - Email (opcional)
     - Teléfono (opcional)
     - Fecha de nacimiento (opcional)
     - Estatura (opcional)
   - Botón "Guardar" que persiste en base de datos

### 3. **Formulario de Mascota**
   - Campos:
     - Nombre de la mascota * (requerido)
     - Especie * (requerido)
     - Raza (opcional)
     - Color (opcional)
     - Edad (opcional)
   - Botón "Guardar" que persiste en base de datos

### 4. **Funcionalidades Implementadas**
   - ✅ Mostrar/Ocultar formularios dinámicamente
   - ✅ Validación de campos requeridos
   - ✅ Mensajes de éxito/error
   - ✅ Integración con API REST
   - ✅ Almacenamiento en base de datos SQL Server
   - ✅ Limpieza automática de formularios tras guardar

---

## 🚀 Cómo Ejecutar

### Opción 1: Ejecutar ambas aplicaciones simultáneamente
```bash
npm run dev
```
Esto inicia:
- Angular (http://localhost:4200)
- Servidor Node.js con API (http://localhost:3000)

### Opción 2: Ejecutar por separado

**Terminal 1 - Servidor Node.js (API):**
```bash
npm run server
```
- Disponible en: `http://localhost:3000`

**Terminal 2 - Angular:**
```bash
npm start
```
- Disponible en: `http://localhost:4200`

---

## 📊 Base de Datos

### Crear la base de datos:
```bash
npm run db:create
```

### Tablas utilizadas:
- **Personas**: Almacena información de personas
- **Mascotas**: Almacena información de mascotas

---

## 🔧 Cambios Realizados

### Componentes Modificados/Creados:

1. **app.ts** - Componente raíz
   - Agregada lógica de mostrar/ocultar formularios
   - Métodos: `mostrarPersona()`, `mostrarMascota()`

2. **app.html** - Plantilla raíz
   - Botones para cargar formularios
   - Directivas *ngIf para mostrar formularios dinámicamente

3. **formulariopersona.ts** - Componente de Persona
   - Signals para capturar datos
   - Método `guardarPersona()` para persistencia
   - Validaciones y manejo de errores

4. **formulariomascota.ts** - Componente de Mascota
   - Signals para capturar datos
   - Método `guardarMascota()` para persistencia
   - Validaciones y manejo de errores

5. **data.service.ts** - Servicio de datos
   - Ya contenía métodos para CRUD de personas y mascotas
   - Se utilizaron métodos existentes: `crearPersona()`, `crearMascota()`

### Estilos:
- ✅ Botones principales con diseño Material
- ✅ Formularios con estilos mejorados
- ✅ Alertas de éxito/error con colores diferenciados
- ✅ Diseño responsivo

---

## 🎯 Flujo de Funcionamiento

1. **Usuario abre la aplicación** → Ve página principal con dos botones
2. **Hace click en "Cargar Persona"** → Se muestra formulario de persona
3. **Completa campos y presiona "Guardar"** → Se validan datos y se envían al API
4. **API guarda en base de datos** → Se muestra mensaje de éxito
5. **Usuario puede cambiar a "Cargar Mascota"** → Se repite el proceso

---

## ✅ Verificación

Todos los errores de compilación han sido resueltos:
- ✅ No hay errores de TypeScript
- ✅ No hay errores de componentes
- ✅ La aplicación está lista para ejecutarse

---

## 📝 Notas Importantes

- Los campos marcados con * son obligatorios
- Los mensajes de éxito desaparecen automáticamente después de 5 segundos
- Asegúrate que el servidor SQL Server esté corriendo
- Asegúrate que la base de datos fue creada correctamente

---

## 🆘 Troubleshooting

Si experimenta problemas:

1. **Base de datos no conecta**: Verifica credenciales en `server.js`
2. **Puerto 3000 en uso**: Cambia el puerto en `server.js` (línea: `const PORT = 3000;`)
3. **Puerto 4200 en uso**: Ejecuta con puerto diferente: `ng serve --port 4300`

¡Listo! Tu aplicación está lista para usar. 🎉

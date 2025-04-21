# Sistema de Gestión de Muestras de Alimentos

Una plataforma web integral para la gestión de muestras de alimentos - desde la recolección hasta los resultados de análisis, construida con React, Vite y TailwindCSS para el frontend y Node.js, Express y Supabase/PostgreSQL para el backend.

## 📋 Características

- **Autenticación Segura**: Sistema de inicio de sesión con control de acceso basado en roles
- **Gestión de Empleados**: Operaciones CRUD completas para la gestión del personal
- **Seguimiento de Muestras**: Registro y seguimiento de muestras de alimentos con información detallada del estado
- **Gestión de Pruebas**: Asignar pruebas a laboratorios y seguir el progreso
- **Registro de Resultados**: Vincular resultados de pruebas a muestras específicas
- **Sistema de Informes**: Generar informes en PDF/Excel y visualizar paneles analíticos
- **Gestión de Proveedores y Laboratorios**: Seguimiento de colaboradores externos

## 🛠️ Stack Tecnológico

### Frontend
- **React + Vite**: Para renderización rápida y mejor experiencia de desarrollo
- **TailwindCSS**: Para diseño de interfaz responsiva
- **Axios**: Para comunicación con API
- **React Hook Form**: Para manejo y validación de formularios

### Backend
- **Node.js + Express**: Para desarrollo de API escalable
- **JWT + Bcrypt**: Para autenticación segura
- **Supabase SDK**: Para operaciones de base de datos

### Base de Datos
- **PostgreSQL** (via Supabase): Para almacenamiento relacional de datos

## 🏗️ Arquitectura del Proyecto

### Estructura del Frontend
```
src/
├── assets/                  # Imágenes, iconos, estilos globales
├── components/              # Componentes reutilizables
│   ├── Layout/              # Navbar, Sidebar, Footer
│   ├── UI/                  # Botones, modales, tablas genéricas
│   └── Forms/               # Formularios CRUD
├── pages/                   # Pantallas principales
├── services/                # Conexión API
├── context/                 # Estado global
├── hooks/                   # Hooks personalizados
└── utils/                   # Funciones auxiliares
```

### Estructura del Backend
```
src/
├── config/                  # Configuraciones (BD, autenticación)
├── controllers/             # Lógica de endpoints
├── routes/                  # Definiciones de rutas
├── models/                  # Modelos de base de datos
├── middlewares/             # Middleware de autenticación y validación
└── app.js                   # Punto de entrada
```

## 🚀 Instalación y Configuración

1. Clonar el repositorio
2. Instalar dependencias
    ```bash
    # Frontend
    cd Frontend
    npm install

    # Backend
    cd ../Backend
    npm install
    ```
3. Configurar variables de entorno (se proporcionan archivos de ejemplo)
4. Iniciar servidores de desarrollo
    ```bash
    # Frontend
    npm run dev

    # Backend
    npm run dev
    ```

## 💽 Esquema de Base de Datos

- **Usuarios**: Autenticación y gestión de roles
- **Empleados**: Información del personal y responsabilidades
- **Muestras**: Seguimiento de muestras de alimentos con detalles de recolección
- **Pruebas**: Procedimientos de prueba disponibles
- **Resultados**: Resultados de pruebas vinculados a muestras
- **Proveedores**: Proveedores externos de alimentos
- **Laboratorios**: Instalaciones de pruebas

## 🔍 Consideraciones Clave

- **Seguridad**: Validación de entrada, protección de endpoints
- **Rendimiento**: Paginación de datos, caché para datos estáticos
- **Experiencia de Usuario**: Retroalimentación constante para acciones

## 📦 Entregables

1. Aplicación web responsiva con todas las pantallas requeridas
2. API REST documentada
3. Scripts SQL de base de datos con relaciones validadas
4. Documentación técnica y de usuario

## 🧪 Pruebas y Despliegue

- **Pruebas**: Jest/Vitest para pruebas unitarias, Postman para integración
- **Despliegue**: Vercel/Netlify (Frontend), Render/Heroku (Backend), Supabase (Base de Datos)

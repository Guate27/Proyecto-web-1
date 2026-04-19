# BlogStream

Aplicación web de tipo blog con CRUD completo construida con HTML5, CSS y JavaScript.

## Descripción

BlogStream permite listar, crear, editar y eliminar publicaciones consumiendo la API de [DummyJSON](https://dummyjson.com). La aplicación incluye búsqueda y filtrado por texto, etiquetas y usuario, paginación, y una sección de favoritos guardados localmente en el navegador.

## API utilizada

**DummyJSON** — `https://dummyjson.com/posts`

Soporta GET, POST, PUT y DELETE de forma simulada. Los cambios no persisten en el servidor pero la app los refleja correctamente en la interfaz.

## Funcionalidades

- Listado de posts con paginación
- Búsqueda por texto, etiqueta y usuario
- Vista de detalle con 6 campos del post
- Crear post con validación de formulario
- Editar post con formulario precargado
- Eliminar post con confirmación
- Favoritos guardados en localStorage
- Skeleton loaders y spinner de carga
- Notificaciones de éxito y error
- Diseño responsive

## Estructura del proyecto

```
proyecto-blog/
├── index.html
├── .gitignore
├── README.md
├── css/
│   ├── main.css        ← variables, reset, tipografía
│   ├── componentes.css ← cards, botones, formularios, skeletons
│   └── layout.css      ← navbar, estructura de vistas
└── js/
    ├── api.js          ← fetch: GET, POST, PUT, DELETE
    ├── ui.js           ← renderizado del DOM
    ├── validation.js   ← validaciones de formularios
    ├── router.js       ← navegación SPA con hash
    └── main.js         ← inicialización y lógica principal
```


## Integrantes

- Julio Pellecer-241071
- Ronald Catún- 19789
  
## Cronograma de Subidas
https://canva.link/sm8423a4xxm6wnt 
 
## Enlace en el servidor con el proyecto
http://ssh.chicharronconpelos.shop/julio241071/proyecto_1 
## Foto del funcionamiento
<img width="1863" height="973" alt="image" src="https://github.com/user-attachments/assets/a629300a-b5de-4168-b8bc-e67c6a920f54" />
## Enlace video funcionamiento
https://youtu.be/b67-oXMjN8U


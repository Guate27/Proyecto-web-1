/* importación de las funciones defininidas en main.js */

import { mostrarLista }     from './main.js';
import { mostrarDetalle }   from './main.js';
import { mostrarCrear }     from './main.js';
import { mostrarEditar }    from './main.js';
import { mostrarFavoritos } from './main.js';


function interpretarRuta(hash) {
  const partes = hash.replace('#', '').split('/');
  const ruta   = partes[0] || 'lista';
  const id     = partes[1] || null;
  return { ruta, id };
} 

//Función que permite al usuario saber en qué apartado de la aplicación se encuentra aplicandole un estilo específico al elemento del html que identica el apartado donde se encuentra el usuario actualmente.
//La función también le permite al usuario acceder al contenido del apartado utilizando las funciones del archivo main.js
function cargarVista(hash) {
  const { ruta, id } = interpretarRuta(hash);

  // Actualización de la ruta donde se encuentra el usuario 
  document.querySelectorAll('.enlace-nav').forEach(enlace => {
    enlace.classList.remove('activo');
    if (enlace.dataset.ruta === ruta) {
      enlace.classList.add('activo');
    }
  });

  // Llamada a una de las funciones de main.js para desplegar en el html visble para el usuario el contenido del apartado de la aplicación al cual accedió el usuario 
  switch (ruta) {
    case 'lista':
      mostrarLista();
      break;
    case 'detalle':
      mostrarDetalle(id);
      break;
    case 'crear':
      mostrarCrear();
      break;
    case 'editar':
      mostrarEditar(id);
      break;
    case 'favoritos':
      mostrarFavoritos();
      break;
    default:
      mostrarLista();
  }
}

//Función que detecta el cambio del hash de la URL cada vez que el usuario accede a un apartado de la aplicación y ejecuta la función cargarVista. 
// Esta función también permite asegurar que la página siempre le muestre contenido al usuario desde que entra por primera vez 
export function iniciarRouter() {
  // Detección de cambios de hash utilizado en la URL 
  window.addEventListener("hashchange", () => {
    cargarVista(window.location.hash);
  });

  // Carga iniacial de contenido 
  const hashInicial = window.location.hash || '#lista';
  cargarVista(hashInicial);
}


//Función que busca una plantilla creada en el HMTL utilizando su id para poder copiar el contenido que almacena y utilizar esa copia en otra parte del código de la aplicación 
export function clonarPlantilla(idPlantilla) {
  const plantilla = document.getElementById(idPlantilla);
  return document.importNode(plantilla.content, true);
}

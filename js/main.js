

import { iniciarRouter, clonarPlantilla } from './router.js';
import { obtenerPosts, obtenerPostPorId } from './api.js';
import {
  renderizarTarjetaPost,
  mostrarEsqueletos,
  mostrarEstadoVacio,
  mostrarEstadoError
} from './ui.js';

// Guarda información que varias funciones comparten,
const estado = {
  paginaActual:   1,
  totalPosts:     0,
  postsPorPagina: 10
};

// Función que muestra una notificación flotante en la esquina inferior derecha sobre la respuesta de la App a una petición del usuario . Desaparece automáticamente después de 3 segundos.

export function mostrarNotificacion(mensaje, tipo = 'info') {
  const notificacion = document.getElementById('notificacion');
  notificacion.textContent = mensaje;
  notificacion.className   = `notificacion notificacion--${tipo} visible`;

  setTimeout(() => {
    notificacion.classList.remove('visible');
  }, 3000);
}

//Función que le muestra en pantalla al usuario el listado general de posts 
  
export async function mostrarLista() {
  const contenedor = document.getElementById('contenedor_app');

  const vista = clonarPlantilla('plantilla_lista');
  contenedor.innerHTML = '';
  contenedor.appendChild(vista);

  const cuadricula = document.getElementById('cuadricula_posts');
  mostrarEsqueletos(cuadricula, estado.postsPorPagina);

  try {
    const datos = await obtenerPosts(estado.paginaActual, estado.postsPorPagina);
    estado.totalPosts = datos.total;

    cuadricula.innerHTML = '';

    if (datos.posts.length === 0) {
      mostrarEstadoVacio(cuadricula);
      return;
    }

    datos.posts.forEach(post => {
      const tarjeta = renderizarTarjetaPost(post);
      cuadricula.appendChild(tarjeta);
    });

    renderizarPaginacion();

  } catch (error) {
    mostrarEstadoError(cuadricula, 'No se pudo cargar el listado de posts');
  }
}

//Funciómn que maneja la ditribución del contenido calculando el total de páginas y crea los botones de anterior y siguiente para navegar entre páginas.*/
function renderizarPaginacion() {
  const contenedor   = document.getElementById('controles_paginacion');
  const totalPaginas = Math.ceil(estado.totalPosts / estado.postsPorPagina);

  contenedor.innerHTML = `
    <button 
      class="boton boton--secundario" 
      id="boton_pagina_anterior"
      ${estado.paginaActual === 1 ? 'disabled' : ''}
    >← Anterior</button>

    <span class="controles-paginacion__info">
      Página ${estado.paginaActual} de ${totalPaginas}
    </span>

    <button 
      class="boton boton--secundario" 
      id="boton_pagina_siguiente"
      ${estado.paginaActual === totalPaginas ? 'disabled' : ''}
    >Siguiente →</button>
  `;

  document.getElementById('boton_pagina_anterior')
    ?.addEventListener('click', () => {
      if (estado.paginaActual > 1) {
        estado.paginaActual--;
        mostrarLista();
      }
    });

  document.getElementById('boton_pagina_siguiente')
    ?.addEventListener('click', () => {
      if (estado.paginaActual < totalPaginas) {
        estado.paginaActual++;
        mostrarLista();
      }
    });
}

/* Funciones pendientes */
/* Muestra La información completa  de un post específico.*/
export async function mostrarDetalle(id) {
  const contenedor = document.getElementById('contenedor_app');
 
  const vista = clonarPlantilla('plantilla_detalle');
  contenedor.innerHTML = '';
  contenedor.appendChild(vista);
 
  const contenidoDetalle = document.getElementById('contenido_detalle');
  contenidoDetalle.innerHTML = '<div class="spinner"></div>';
 
  document.getElementById('boton_regresar')
    ?.addEventListener('click', () => {
      window.location.hash = '#lista';
    });
 
  try {
    const post = await obtenerPostPorId(id);
 
    const etiquetasHTML = post.tags
      .map(etiqueta => `<span class="etiqueta">${etiqueta}</span>`)
      .join('');
 
    contenidoDetalle.innerHTML = `
      <div class="contenido-detalle__etiquetas">${etiquetasHTML}</div>
      <h1 class="contenido-detalle__titulo">${post.title}</h1>
      <div class="contenido-detalle__meta">
        <span class="contenido-detalle__meta-item">
          <strong>ID:</strong> ${post.id}
        </span>
        <span class="contenido-detalle__meta-item">
          <strong>Autor:</strong> Usuario #${post.userId}
        </span>
        <span class="contenido-detalle__meta-item">
          <strong>Reacciones:</strong> 👍 ${post.reactions.likes} · 👎 ${post.reactions.dislikes}
        </span>
        <span class="contenido-detalle__meta-item">
          <strong>Vistas:</strong> ${post.views}
        </span>
        <span class="contenido-detalle__meta-item">
          <strong>Etiquetas:</strong> ${post.tags.join(', ')}
        </span>
        <span class="contenido-detalle__meta-item">
          <strong>Comentarios:</strong> disponibles en la API
        </span>
      </div>
      <p class="contenido-detalle__cuerpo">${post.body}</p>
      <div class="contenido-detalle__acciones">
        <a href="#editar/${post.id}" class="boton boton--principal">Editar</a>
        <button class="boton boton--peligro" id="boton_eliminar_post">Eliminar</button>
      </div>
    `;
 
  } catch (error) {
    mostrarEstadoError(contenidoDetalle, 'No se pudo cargar el post');
  }
}

export async function mostrarCrear()     {}
export async function mostrarEditar(id) {}
export async function mostrarFavoritos() {}

// Definición de evento que controla la apertura y cierre del menú de navegación 
document.addEventListener('DOMContentLoaded', () => {
  iniciarRouter();

  const botonMenu = document.getElementById('boton_menu_movil');
  const enlaces   = document.querySelector('.barra-navegacion__enlaces');

  botonMenu?.addEventListener('click', () => {
    enlaces?.classList.toggle('abierto');
  });

  enlaces?.querySelectorAll('.enlace-nav').forEach(enlace => {
    enlace.addEventListener('click', () => {
      enlaces.classList.remove('abierto');
    });
  
  });
});

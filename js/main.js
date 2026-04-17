import { iniciarRouter, clonarPlantilla } from './router.js';
import { obtenerPosts, obtenerPostPorId, crearPost,
         actualizarPost, eliminarPost, buscarPosts } from './api.js';
import {
  renderizarTarjetaPost,
  mostrarEsqueletos,
  mostrarEstadoVacio,
  mostrarEstadoError
} from './ui.js';
import { validarFormularioCrear, validarFormularioEditar } from './validation.js';

// Guarda información que varias funciones comparten,
const estado = {
  paginaActual:   1,
  totalPosts:     0,
  postsPorPagina: 10,
  filtroTexto:    '',
  filtroEtiqueta: '',
  filtroUsuario:  ''
};

// Función para acceder a los pst Favoritos guardados 
export function obtenerFavoritos() {
  return JSON.parse(localStorage.getItem('blogstream_favoritos') || '[]');
}

function guardarFavoritos(favoritos) {
  localStorage.setItem('blogstream_favoritos', JSON.stringify(favoritos));
}

function toggleFavorito(post) {
  const favoritos = obtenerFavoritos();
  const indice    = favoritos.findIndex(f => f.id === post.id);

  if (indice === -1) {
    favoritos.push(post);
    mostrarNotificacion(`"${post.title.substring(0, 30)}..." guardado en favoritos`, 'exito');
  } else {
    favoritos.splice(indice, 1);
    mostrarNotificacion('Post eliminado de favoritos', 'info');
  }

  guardarFavoritos(favoritos);
}

// Función que muestra una notificación flotante en la esquina inferior derecha sobre la respuesta de la App a una petición del usuario . Desaparece automáticamente después de 3 segundos.
export function mostrarNotificacion(mensaje, tipo = 'info') {
  const notificacion     = document.getElementById('notificacion');
  notificacion.textContent = mensaje;
  notificacion.className   = `notificacion notificacion--${tipo} visible`;

  setTimeout(() => notificacion.classList.remove('visible'), 3000);
}

//Función que abre el modal de confirmación para eliminar un post

function abrirModal(idPost) {
  const modal = document.getElementById('modal_confirmacion');
  modal.classList.add('abierto');

  document.getElementById('boton_confirmar_eliminar').onclick = async () => {
    cerrarModal();
    try {
      await eliminarPost(idPost);
      mostrarNotificacion('Post eliminado exitosamente', 'exito');
      window.location.hash = '#lista';
    } catch {
      mostrarNotificacion('No se pudo eliminar el post', 'error');
    }
  };

  document.getElementById('boton_cancelar_eliminar').onclick = cerrarModal;
  document.getElementById('modal_fondo').onclick             = cerrarModal;
}

function cerrarModal() {
  document.getElementById('modal_confirmacion').classList.remove('abierto');
}

//Función que le muestra en pantalla al usuario el listado general de posts 
export async function mostrarLista() {
  const contenedor = document.getElementById('contenedor_app');

  const vista = clonarPlantilla('plantilla_lista');
  contenedor.innerHTML = '';
  contenedor.appendChild(vista);

  const cuadricula = document.getElementById('cuadricula_posts');
  mostrarEsqueletos(cuadricula, estado.postsPorPagina);

  // Configurar filtros
  const inputTexto    = document.getElementById('filtro_texto');
  const selectEtiq    = document.getElementById('filtro_etiqueta');
  const selectUsuario = document.getElementById('filtro_usuario');

  inputTexto.value    = estado.filtroTexto;
  selectEtiq.value    = estado.filtroEtiqueta;
  selectUsuario.value = estado.filtroUsuario;

  await cargarFiltros();

  inputTexto.addEventListener('input', () => {
    estado.filtroTexto  = inputTexto.value;
    estado.paginaActual = 1;
    cargarPosts();
  });

  selectEtiq.addEventListener('change', () => {
    estado.filtroEtiqueta = selectEtiq.value;
    estado.paginaActual   = 1;
    cargarPosts();
  });

  selectUsuario.addEventListener('change', () => {
    estado.filtroUsuario = selectUsuario.value;
    estado.paginaActual  = 1;
    cargarPosts();
  });

  await cargarPosts();
}

 //Función que carga las opciones de etiquetas y usuarios en los selectores
async function cargarFiltros() {
  try {
    const datos         = await obtenerPosts(1, 100);
    const todasEtiq     = [...new Set(datos.posts.flatMap(p => p.tags))].sort();
    const todosUsuarios = [...new Set(datos.posts.map(p => p.userId))].sort((a, b) => a - b);

    const selectEtiq    = document.getElementById('filtro_etiqueta');
    const selectUsuario = document.getElementById('filtro_usuario');

    todasEtiq.forEach(etiqueta => {
      const opcion       = document.createElement('option');
      opcion.value       = etiqueta;
      opcion.textContent = etiqueta;
      selectEtiq.appendChild(opcion);
    });

    todosUsuarios.forEach(userId => {
      const opcion       = document.createElement('option');
      opcion.value       = userId;
      opcion.textContent = `Usuario #${userId}`;
      selectUsuario.appendChild(opcion);
    });

    selectEtiq.value    = estado.filtroEtiqueta;
    selectUsuario.value = estado.filtroUsuario;

  } catch { /* Si falla los filtros quedan vacíos */ }
}

//Carga y renderiza los posts aplicando los filtros activos
async function cargarPosts() {
  const cuadricula = document.getElementById('cuadricula_posts');
  mostrarEsqueletos(cuadricula, estado.postsPorPagina);

  try {
    let posts = [];
    let total = 0;

    if (estado.filtroTexto) {
      const datos = await buscarPosts(estado.filtroTexto);
      posts       = datos.posts;
      total       = datos.total;
    } else {
      const datos = await obtenerPosts(estado.paginaActual, estado.postsPorPagina);
      posts       = datos.posts;
      total       = datos.total;
    }

    if (estado.filtroEtiqueta) {
      posts = posts.filter(p => p.tags.includes(estado.filtroEtiqueta));
    }
    if (estado.filtroUsuario) {
      posts = posts.filter(p => p.userId === parseInt(estado.filtroUsuario));
    }

    estado.totalPosts    = total;
    cuadricula.innerHTML = '';

    if (posts.length === 0) {
      mostrarEstadoVacio(cuadricula, 'No se encontraron posts con esos filtros');
      return;
    }

    posts.forEach(post => {
      const tarjeta = renderizarTarjetaPost(post);

      tarjeta.querySelector('.boton-favorito').addEventListener('click', (e) => {
        toggleFavorito(post);
        const guardado          = obtenerFavoritos().some(f => f.id === post.id);
        e.currentTarget.textContent = guardado ? '★' : '☆';
        e.currentTarget.ariaLabel   = guardado ? 'Quitar de favoritos' : 'Guardar en favoritos';
        e.currentTarget.classList.toggle('guardado', guardado);
      });

      cuadricula.appendChild(tarjeta);
    });

    renderizarPaginacion(total);

  } catch (error) {
    mostrarEstadoError(cuadricula, 'No se pudo cargar el listado de posts');
  }
}

//Función que maneja la ditribución del contenido calculando el total de páginas y crea los botones de anterior y siguiente para navegar entre páginas.
function renderizarPaginacion(total) {
  const contenedor   = document.getElementById('controles_paginacion');
  if (!contenedor) return;

  const totalPaginas = Math.ceil(total / estado.postsPorPagina);
  if (totalPaginas <= 1) return;

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
      if (estado.paginaActual > 1) { estado.paginaActual--; cargarPosts(); }
    });

  document.getElementById('boton_pagina_siguiente')
    ?.addEventListener('click', () => {
      if (estado.paginaActual < totalPaginas) { estado.paginaActual++; cargarPosts(); }
    });
}

//Funciín que muestra La información completa de un post específico.
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
    const post          = await obtenerPostPorId(id);
    const etiquetasHTML = post.tags.map(e => `<span class="etiqueta">${e}</span>`).join('');
    const favoritos     = obtenerFavoritos();
    const esFavorito    = favoritos.some(f => f.id === post.id);

    contenidoDetalle.innerHTML = `
      <div class="contenido-detalle__etiquetas">${etiquetasHTML}</div>
      <h1 class="contenido-detalle__titulo">${post.title}</h1>
      <div class="contenido-detalle__meta">
        <span class="contenido-detalle__meta-item"><strong>ID:</strong> ${post.id}</span>
        <span class="contenido-detalle__meta-item"><strong>Autor:</strong> Usuario #${post.userId}</span>
        <span class="contenido-detalle__meta-item"><strong>Reacciones:</strong> 👍 ${post.reactions.likes} · 👎 ${post.reactions.dislikes}</span>
        <span class="contenido-detalle__meta-item"><strong>Vistas:</strong> ${post.views}</span>
        <span class="contenido-detalle__meta-item"><strong>Etiquetas:</strong> ${post.tags.join(', ')}</span>
        <span class="contenido-detalle__meta-item"><strong>Comentarios:</strong> disponibles en la API</span>
      </div>
      <p class="contenido-detalle__cuerpo">${post.body}</p>
      <div class="contenido-detalle__acciones">
        <button class="boton-favorito boton-favorito--detalle ${esFavorito ? 'guardado' : ''}"
          id="boton_favorito_detalle">
          ${esFavorito ? '★ En favoritos' : '☆ Guardar en favoritos'}
        </button>
        <a href="#editar/${post.id}" class="boton boton--principal">Editar</a>
        <button class="boton boton--peligro" id="boton_eliminar_post">Eliminar</button>
      </div>
    `;

    document.getElementById('boton_eliminar_post')?.addEventListener('click', () => {
      abrirModal(post.id);
    });

    document.getElementById('boton_favorito_detalle')?.addEventListener('click', (e) => {
      toggleFavorito(post);
      const guardado          = obtenerFavoritos().some(f => f.id === post.id);
      e.currentTarget.textContent = guardado ? '★ En favoritos' : '☆ Guardar en favoritos';
      e.currentTarget.classList.toggle('guardado', guardado);
    });

  } catch (error) {
    mostrarEstadoError(contenidoDetalle, 'No se pudo cargar el post');
  }
}

// Función que muestra el formulario para crear un nuevo post
export async function mostrarCrear() {
  const contenedor = document.getElementById('contenedor_app');
  const vista      = clonarPlantilla('plantilla_crear');
  contenedor.innerHTML = '';
  contenedor.appendChild(vista);

  document.getElementById('formulario_crear').addEventListener('submit', async (e) => {
    e.preventDefault();

    const { esValido, datos } = validarFormularioCrear();
    if (!esValido) return;

    const boton       = document.getElementById('boton_publicar');
    boton.disabled    = true;
    boton.textContent = 'Publicando...';

    try {
      await crearPost(datos);
      mostrarNotificacion('Post creado exitosamente', 'exito');
      window.location.hash = '#lista';
    } catch {
      mostrarNotificacion('No se pudo crear el post', 'error');
      boton.disabled    = false;
      boton.textContent = 'Publicar';
    }
  });
}

// Muestra el formulario de edición precargado con los datos del post
export async function mostrarEditar(id) {
  const contenedor = document.getElementById('contenedor_app');
  const vista      = clonarPlantilla('plantilla_editar');
  contenedor.innerHTML = '';
  contenedor.appendChild(vista);

  try {
    const post = await obtenerPostPorId(id);

    document.getElementById('editar_id').value        = post.id;
    document.getElementById('editar_titulo').value    = post.title;
    document.getElementById('editar_contenido').value = post.body;

    document.getElementById('boton_cancelar_edicion')?.addEventListener('click', () => {
      window.location.hash = `#detalle/${id}`;
    });

    document.getElementById('formulario_editar').addEventListener('submit', async (e) => {
      e.preventDefault();

      const { esValido, datos } = validarFormularioEditar();
      if (!esValido) return;

      const boton       = document.getElementById('boton_guardar_cambios');
      boton.disabled    = true;
      boton.textContent = 'Guardando...';

      try {
        await actualizarPost(id, datos);
        mostrarNotificacion('Post actualizado exitosamente', 'exito');
        window.location.hash = `#detalle/${id}`;
      } catch {
        mostrarNotificacion('No se pudo actualizar el post', 'error');
        boton.disabled    = false;
        boton.textContent = 'Guardar cambios';
      }
    });

  } catch {
    mostrarEstadoError(document.getElementById('contenedor_app'), 'No se pudo cargar el post para editar');
  }
}

// Función que muestra los posts guardados 
export async function mostrarFavoritos() {
  const contenedor = document.getElementById('contenedor_app');
  const vista      = clonarPlantilla('plantilla_favoritos');
  contenedor.innerHTML = '';
  contenedor.appendChild(vista);

  const cuadricula = document.getElementById('cuadricula_favoritos');
  const favoritos  = obtenerFavoritos();

  if (favoritos.length === 0) {
    mostrarEstadoVacio(cuadricula, 'No tienes posts guardados en favoritos');
    return;
  }

  favoritos.forEach(post => {
    const tarjeta = renderizarTarjetaPost(post);

    tarjeta.querySelector('.boton-favorito').addEventListener('click', () => {
      toggleFavorito(post);
      mostrarFavoritos();
    });

    cuadricula.appendChild(tarjeta);
  });
}

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


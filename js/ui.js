import { obtenerFavoritos } from './main.js';
export function renderizarTarjetaPost(post) {
  const tarjeta = document.createElement('article');
  tarjeta.classList.add('tarjeta-post');
 
  const etiquetasHTML = post.tags
    .map(etiqueta => `<span class="etiqueta">${etiqueta}</span>`)
    .join('');
 
  const resumen = post.body.length > 120
    ? post.body.substring(0, 120) + '...'
    : post.body;
 
  const favoritos  = obtenerFavoritos();
  const esFavorito = favoritos.some(f => f.id === post.id);
 
  tarjeta.innerHTML = `
    <div class="tarjeta-post__etiquetas">${etiquetasHTML}</div>
    <h3 class="tarjeta-post__titulo">${post.title}</h3>
    <p class="tarjeta-post__resumen">${resumen}</p>
    <div class="tarjeta-post__pie">
      <span class="tarjeta-post__autor">Usuario #${post.userId}</span>
      <div class="tarjeta-post__acciones">
        <button 
          class="boton-favorito ${esFavorito ? 'guardado' : ''}" 
          data-id="${post.id}"
          aria-label="${esFavorito ? 'Quitar de favoritos' : 'Guardar en favoritos'}"
        >${esFavorito ? '★' : '☆'}</button>
        <a href="#detalle/${post.id}" class="boton boton--principal boton--pequeno">Ver más</a>
      </div>
    </div>
  `;
 
  return tarjeta;
}
export function mostrarEsqueletos(contenedor, cantidad = 10) {
  contenedor.innerHTML = '';

  for (let i = 0; i < cantidad; i++) {
    const esqueleto = document.createElement('div');
    esqueleto.classList.add('tarjeta-esqueleto');
    esqueleto.innerHTML = `
      <div class="esqueleto esqueleto--etiqueta"></div>
      <div class="esqueleto esqueleto--titulo"></div>
      <div class="esqueleto esqueleto--linea esqueleto--completo"></div>
      <div class="esqueleto esqueleto--linea esqueleto--medio"></div>
      <div class="esqueleto esqueleto--linea esqueleto--corto"></div>
    `;
    contenedor.appendChild(esqueleto);
  }
}

export function mostrarEstadoVacio(contenedor, mensaje = 'No se encontraron publicaciones') {
  contenedor.innerHTML = `
    <div class="estado-vacio">
      <div class="estado-vacio__icono">📭</div>
      <h3 class="estado-vacio__titulo">${mensaje}</h3>
      <p>Intenta con otros filtros o crea una nueva publicación</p>
    </div>
  `;
}

export function mostrarEstadoError(contenedor, mensaje = 'Ocurrió un error al cargar los posts') {
  contenedor.innerHTML = `
    <div class="estado-error">
      <p>⚠️ ${mensaje}</p>
      <button class="boton boton--secundario" onclick="window.location.reload()">
        Reintentar
      </button>
    </div>
  `;
}

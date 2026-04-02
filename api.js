

const URL_BASE = 'https://dummyjson.com';

/* Funcióm que accede a la API y le hace una petición GET para acceder a la informaciónd de los posts. */
export async function obtenerPosts(pagina = 1, cantidad = 10) {
  const salto = (pagina - 1) * cantidad;
  const url   = `${URL_BASE}/posts?limit=${cantidad}&skip=${salto}`;

  try {
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      throw new Error(`Error al obtener posts: ${respuesta.status}`);
    }

    const datos = await respuesta.json();
    return datos;

  } catch (error) {
    throw error;
  }
}

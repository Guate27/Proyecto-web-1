

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


//Función que accede a la API y le hace una petición GET para acceder a la informaciónd de un post específico utilizando su id 
export async function obtenerPostPorId(id) {
  const url = `${URL_BASE}/posts/${id}`;
 
  try {
    const respuesta = await fetch(url);
 
    if (!respuesta.ok) {
      throw new Error(`Error al obtener el post ${id}: ${respuesta.status}`);
    }
 
    const datos = await respuesta.json();
    return datos;
 
  } catch (error) {
    throw error;
  }
}

// Hace una petición GET buscando posts por texto en el título o cuerpo
export async function buscarPosts(texto) {
  const url = `${URL_BASE}/posts/search?q=${encodeURIComponent(texto)}`;
 
  try {
    const respuesta = await fetch(url);
    if (!respuesta.ok) throw new Error(`Error al buscar posts: ${respuesta.status}`);
    return await respuesta.json();
  } catch (error) {
    throw error;
  }
}
 
// Hace una petición POST para crear una nueva publicación 
export async function crearPost(datos) {
  const url = `${URL_BASE}/posts/add`;
 
  try {
    const respuesta = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    if (!respuesta.ok) throw new Error(`Error al crear el post: ${respuesta.status}`);
    return await respuesta.json();
  } catch (error) {
    throw error;
  }
}
 
//Hace una petición PUT para actualizar una publicación existente
export async function actualizarPost(id, datos) {
  const url = `${URL_BASE}/posts/${id}`;
 
  try {
    const respuesta = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
    if (!respuesta.ok) throw new Error(`Error al actualizar el post ${id}: ${respuesta.status}`);
    return await respuesta.json();
  } catch (error) {
    throw error;
  }
}
 
//Hace una petición DELETE para eliminar una publicación
export async function eliminarPost(id) {
  const url = `${URL_BASE}/posts/${id}`;
 
  try {
    const respuesta = await fetch(url, { method: 'DELETE' });
    if (!respuesta.ok) throw new Error(`Error al eliminar el post ${id}: ${respuesta.status}`);
    return await respuesta.json();
  } catch (error) {
    throw error;
  }
}


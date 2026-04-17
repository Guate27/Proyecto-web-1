
function mostrarErrorCampo(idError, idCampo, mensaje) {
  const elementoError = document.getElementById(idError);
  const elementoCampo = document.getElementById(idCampo);
  if (elementoError) elementoError.textContent = mensaje;
  if (elementoCampo) elementoCampo.classList.add('campo-texto--error');
}

function limpiarErrorCampo(idError, idCampo) {
  const elementoError = document.getElementById(idError);
  const elementoCampo = document.getElementById(idCampo);
  if (elementoError) elementoError.textContent = '';
  if (elementoCampo) elementoCampo.classList.remove('campo-texto--error');
}

function limpiarTodosLosErrores(campos) {
  campos.forEach(({ idError, idCampo }) => limpiarErrorCampo(idError, idCampo));
}


export function validarFormularioCrear() {
  const titulo    = document.getElementById('crear_titulo');
  const contenido = document.getElementById('crear_contenido');
  const autor     = document.getElementById('crear_autor');

  limpiarTodosLosErrores([
    { idError: 'error_crear_titulo',    idCampo: 'crear_titulo'    },
    { idError: 'error_crear_contenido', idCampo: 'crear_contenido' },
    { idError: 'error_crear_autor',     idCampo: 'crear_autor'     }
  ]);

  let esValido = true;

  if (!titulo.value.trim()) {
    mostrarErrorCampo('error_crear_titulo', 'crear_titulo', 'El título es obligatorio');
    esValido = false;
  } else if (titulo.value.trim().length < 5) {
    mostrarErrorCampo('error_crear_titulo', 'crear_titulo', 'El título debe tener al menos 5 caracteres');
    esValido = false;
  }

  if (!contenido.value.trim()) {
    mostrarErrorCampo('error_crear_contenido', 'crear_contenido', 'El contenido es obligatorio');
    esValido = false;
  } else if (contenido.value.trim().length < 20) {
    mostrarErrorCampo('error_crear_contenido', 'crear_contenido', 'El contenido debe tener al menos 20 caracteres');
    esValido = false;
  }

  if (!autor.value.trim()) {
    mostrarErrorCampo('error_crear_autor', 'crear_autor', 'El nombre del autor es obligatorio');
    esValido = false;
  }

  if (esValido) {
    return {
      esValido: true,
      datos: {
        title : titulo.value.trim(),
        body  : contenido.value.trim(),
        userId: 1,
        tags  : ['general']
      }
    };
  }

  return { esValido: false, datos: null };
}


export function validarFormularioEditar() {
  const titulo    = document.getElementById('editar_titulo');
  const contenido = document.getElementById('editar_contenido');

  limpiarTodosLosErrores([
    { idError: 'error_editar_titulo',    idCampo: 'editar_titulo'    },
    { idError: 'error_editar_contenido', idCampo: 'editar_contenido' }
  ]);

  let esValido = true;

  if (!titulo.value.trim()) {
    mostrarErrorCampo('error_editar_titulo', 'editar_titulo', 'El título es obligatorio');
    esValido = false;
  } else if (titulo.value.trim().length < 5) {
    mostrarErrorCampo('error_editar_titulo', 'editar_titulo', 'El título debe tener al menos 5 caracteres');
    esValido = false;
  }

  if (!contenido.value.trim()) {
    mostrarErrorCampo('error_editar_contenido', 'editar_contenido', 'El contenido es obligatorio');
    esValido = false;
  } else if (contenido.value.trim().length < 20) {
    mostrarErrorCampo('error_editar_contenido', 'editar_contenido', 'El contenido debe tener al menos 20 caracteres');
    esValido = false;
  }

  if (esValido) {
    return {
      esValido: true,
      datos: {
        title : titulo.value.trim(),
        body  : contenido.value.trim()
      }
    };
  }

  return { esValido: false, datos: null };
}

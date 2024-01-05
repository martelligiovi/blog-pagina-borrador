const apiUrl = 'http://192.168.1.101:8080/api/publicacion'; // Reemplaza con la URL de tu API

document.addEventListener('DOMContentLoaded', () => {
  const content = document.getElementById('content');

  // Obtener y mostrar las publicaciones
  fetchPosts();

  async function fetchPosts() {
    try {
      const response = await fetch(apiUrl);
      console.log('Estado de la respuesta:', response.status);
      
      const responseData = await response.text();
      console.log('Cuerpo de la respuesta:', responseData);
  
      const data = JSON.parse(responseData);
      const posts = data.publicaciones;
      displayPosts(posts);
    } catch (error) {
      console.error('Error al obtener las publicaciones:', error);
    }
  }
  
  document.getElementById('newPostButton').addEventListener('click', function() {
    document.getElementById('newPostForm').style.display = 'block';
  });
  
  document.getElementById('newPostForm').addEventListener('submit', function(event) {
    event.preventDefault();
    var titulo = document.getElementById('titulo').value;
    var contenido = document.getElementById('contenido').value;
    var descripcion = document.getElementById('descripcion').value;
    sendPost(titulo, contenido, descripcion);
    console.log(JSON.stringify(post));
  });
  
  

  function displayPosts(posts) {
    content.innerHTML = ''; // Limpiar el contenido actual

    posts.forEach(post => {
      const postElement = createPostElement(post);
      content.appendChild(postElement);
    });
  }

  function createPostElement(post) {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
  
    const titleElement = document.createElement('h2');
    titleElement.textContent = post.titulo;
  
    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = post.descripcion;
  
    const contentElement = document.createElement('p');
    contentElement.textContent = truncateText(post.contenido, 204); // Limitar a 204 caracteres
    contentElement.style.minHeight = '72px'; // Establecer la altura mínima
  
    const readMoreButton = document.createElement('button');
    readMoreButton.textContent = 'Leer Más';
    readMoreButton.addEventListener('click', () => openPost(post.id));
  
    // Crear botones de editar y eliminar
    const editButton = document.createElement('button');
    const deleteButton = document.createElement('button');
  
    // Agregar texto a los botones
    editButton.textContent = 'Editar';
    deleteButton.textContent = 'Eliminar';

    // Crear contenedores para los botones
    const leftButtonContainer = document.createElement('div');
    const rightButtonContainer = document.createElement('div');

    // Asignar las clases a los contenedores
    leftButtonContainer.className = 'left-button-container';
    rightButtonContainer.className = 'right-button-container';

    // Agregar el botón de "Leer Más" al contenedor de la izquierda
    leftButtonContainer.appendChild(readMoreButton);

    // Agregar los botones de "Editar" y "Eliminar" al contenedor de la derecha
    rightButtonContainer.appendChild(editButton);
    rightButtonContainer.appendChild(deleteButton);

    // Agregar los contenedores de botones al elemento de la publicación
    postElement.appendChild(leftButtonContainer);
    postElement.appendChild(rightButtonContainer);

    // Limpiar el flotado
    const clearDiv = document.createElement('div');
    clearDiv.style.clear = 'both';
    postElement.appendChild(clearDiv);
  
    // Adjuntar eventos de clic a los botones
    editButton.addEventListener('click', () => {
      window.location.href = `edit_post.html?id=${post.id}`; // Redirige al usuario a la página de edición de publicaciones
    });
  
    deleteButton.addEventListener('click', () => {
      const url = `http://192.168.1.101:8080/api/publicacion/${post.id}`;
  
      fetch(url, {
        method: 'DELETE',
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al eliminar la publicación');
        }
        postElement.remove(); // Elimina la publicación del DOM
      })
      .catch(error => console.error('Error:', error));
    });
  
    postElement.appendChild(titleElement);
    postElement.appendChild(descriptionElement);
    postElement.appendChild(contentElement);
    
  
    return postElement;
  }
  
  // Función para truncar el texto y añadir "..."
  function truncateText(text, maxLength) {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  }
  
  function openPost(postId) {
    window.location.href = `post.html?id=${postId}`;
  }

  document.querySelector('.contenido').style.border = 'none';

  


  function sendPost(titulo, contenido, descripcion) {
    const url = `http://192.168.1.101:8080/api/publicacion`;
    const post = {
      titulo: titulo,
      contenido: contenido,
      descripcion: descripcion
    };
  
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(post)
    })
    .then(response => response.json())
    .then(post=> {
      console.log('Success:', post);
      location.reload();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  
  // Selecciona todos los botones de paginación
var pageButtons = document.querySelectorAll('.pageButton');

// Agrega un controlador de eventos a cada botón de paginación
for (var i = 0; i < pageButtons.length; i++) {
  pageButtons[i].addEventListener('click', function(event) {
    // Obtiene el número de página del atributo data-page del botón
    var pageNumber = event.target.getAttribute('data-page');

    // Carga las publicaciones de la página seleccionada
    loadPosts(pageNumber);
  });
}

// Función para cargar las publicaciones de una página específica
function loadPosts(pageNumber) {
  fetch(`http://192.168.1.101:8080/api/publicacion?pagenumber=${pageNumber}`)
    .then(response => response.json())
    .then(data => {
      // Muestra las publicaciones en la página
      // (necesitarás reemplazar esto con tu propio código para mostrar las publicaciones)
      console.log(data);
    })
    .catch(error => console.error('Error:', error));
}



});
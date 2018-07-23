// ejercicioCrud en firebase
let config = {
    apiKey: "AIzaSyBCu6E1u8eLveoO4RNeXkBdEbKVQfy8KXw",
    authDomain: "ejerciciocrud.firebaseapp.com",
    databaseURL: "https://ejerciciocrud.firebaseio.com",
    projectId: "ejerciciocrud",
    storageBucket: "ejerciciocrud.appspot.com",
    messagingSenderId: "430144992013"
  };
  
  firebase.initializeApp(config);
  let db = firebase.database(); // Convirtiendo database en variable 

  // Trayendo elementos HTML 
  let reviewForm = document.getElementById('reviewForm');
  let fullName   = document.getElementById('fullName');
  let message    = document.getElementById('message');
  let hiddenId   = document.getElementById('hiddenId');
  
  reviewForm.addEventListener('submit', (e) => { // Evento detonado por el formulario
    e.preventDefault();
    if (!fullName.value || !message.value ||  fullName.value === " " || message.value === " " ) {// Operador Lógico NOT realiza negacion , es aprueba de error
  
    alert("¡Llena los campos wey!")
    return null }
    let id = hiddenId.value || Date.now() // Jalando el valor y comparandolo con operador lógico OR Date.now genera un registro temporal
    
    db.ref('reviews/' + id).set({
      fullName: fullName.value,
      message: message.value
    });s
  
    fullName.value = '';
    message.value  = '';
    hiddenId.value = '';
  });
  
  
  
  let reviews = document.getElementById('reviews');
  let reviewsRef = db.ref('/reviews');
  
  // Indicando que se crea un elemento y se agrega al final
  reviewsRef.on('child_added', (data) => {
    let li = document.createElement('li')
    li.id = data.key;
    li.innerHTML = reviewTemplate(data.val())
    reviews.appendChild(li);
  });
  
  reviewsRef.on('child_changed', (data) => {
    let reviewNode = document.getElementById(data.key);
    reviewNode.innerHTML = reviewTemplate(data.val());
  });
  
  reviewsRef.on('child_removed', (data) => {
    let reviewNode = document.getElementById(data.key);
    reviewNode.parentNode.removeChild(reviewNode);
  });
  
  reviews.addEventListener('click', (e) => {
    let reviewNode = e.target.parentNode
  
    // Indicando que pasa si edita
    if (e.target.classList.contains('edit')) {
      fullName.value = reviewNode.querySelector('.fullName').innerText;
      message.value  = reviewNode.querySelector('.message').innerText;
      hiddenId.value = reviewNode.id;
    }
  
   // Indicando que pasa si borra
    if (e.target.classList.contains('delete')) {
      let id = reviewNode.id;
      db.ref('reviews/' + id).remove();
    }
  });
 // Llenando dinamicamente
  function reviewTemplate({fullName, message}) {
    return `
      <div class='fullName'>${fullName}</div>
      <div class='message'>${message}</div>
      <button class='delete'>Eliminar</button>
      <button class='edit'>Editar</button>
    `
  };
const listaProductosDiv = document.getElementById('listaProductos');
const carritoContadorSpan = document.getElementById('carrito-contador');
const verCarritoBtn = document.getElementById('verCarrito');

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function actualizarContadorCarrito() {
      carritoContadorSpan.textContent = carrito.reduce((acc, item) => acc + item.quantity, 0);
}

function agregarCarrito(arma) {
      const armaExistente = carrito.find((item) => item.id === arma.id);
      if (armaExistente) {
          armaExistente.quantity += 1;
      } else {
          carrito.push({...arma, quantity: 1});
      }
      localStorage.setItem("carrito", JSON.stringify(carrito));
      actualizarContadorCarrito();

      Toastify({
          text: `${arma.nombre} agregado al carrito`,
          duration: 3000,
          gravity: "bottom",
          position: "right",        
          style: {
            background: "linear-gradient(to right, #b05500ff, #000000ff)",
          },
          stopOnFocus: true,
      }).showToast()
}


function displayArmas(armas) {
      listaProductosDiv.innerHTML = "";
      armas.forEach((arma)=> {
          const cardArma = document.createElement("div");
          cardArma.classList.add("card-arma");
          cardArma.innerHTML = `
          <img src="${arma.img}"/>
          <h3>${arma.nombre}</h3>
          <p>Ataque: ${arma.ataque}</p>
          <p>Defensa: ${arma.defensa}</p>
          <p>Velocidad: ${arma.velocidad}</p>
          <p>$ ${arma.precio}</p>
          <button data-id="${arma.id}">Comprar</button>
          `;
          listaProductosDiv.appendChild(cardArma);
      });
      document.querySelectorAll(".card-arma button").forEach((button) => {
      button.addEventListener("click", (evt) => {
          const idArma = parseInt(evt.target.dataset.id, 10);
          const armaAgregada = armas.find((item) => item.id === idArma);
          if (idArma) {
              agregarCarrito(armaAgregada);
          }else{
            Swal.fire({
              title: "Error al agregar al carrito", icon: "error" ,
            });
          }
    })
  })
}

  

const fetchArmas = async () => {
  try {
    const respuesta = await fetch("../data/armas.json");
    if (!respuesta.ok) throw new Error("Error al cargar las armas");
    
    const armas = await respuesta.json();
    displayArmas(armas);
  } catch (error) {
    console.error("Error al cargar las armas:", error);
    Swal.fire({
      title: "Error",
      text: "No pudimos cargar los productos.",
      icon: "error",
    });
  }
};
function removerDelCarrito(idArma) {
  const idx = carrito.findIndex(item => item.id === idArma);
  if (idx === -1) return;
  if (carrito[idx].quantity > 1) {
    carrito[idx].quantity -= 1;
  } else {
    carrito.splice(idx, 1);
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
}

function mostrarCarrito() {
    if (carrito.length === 0) {
        Swal.fire({
            title: "Carrito Vacío",
            text: "No hay productos en el carrito.",
            icon: "info",
            customClass: {
            popup: 'carrito-modal',      
            title: 'carrito-title',       
            htmlContainer: 'carrito-html' 
      },
        });
        return;
    }
    let contenidoCarrito = '<ul class="carrito-lista">';
    let total = 0;


    carrito.forEach((item) => {
        contenidoCarrito += ` <li>
        <span>${item.nombre} -  Cantidad: ${item.quantity}  - Precio: $${item.precio * item.quantity}</span>
        <button class="remover-del-carrito-btn" data-id="${item.id}" style="cursor:pointer;">
          Remover
        </button>
      </li>`;
       total += item.precio * item.quantity
    });


    contenidoCarrito += `<p class="carrito-total">Total: $${total}</p>`;

    Swal.fire({
        title: "Carrito de Compras",
        html: contenidoCarrito,
        width: 600,
        showCancelButton: true,
        confirmButtonText: "Finalizar Compra",
        cancelButtonText: "Seguir Comprando",
        customClass: {
        popup: 'carrito-modal',      
        title: 'carrito-title',       
        htmlContainer: 'carrito-html' 
      },
        didOpen: () => {
            document.querySelectorAll(".remover-del-carrito-btn").forEach((btn) => {
              btn.addEventListener("click", (event) => {
                const idArmaRemover = parseInt(event.target.dataset.id, 10);
                removerDelCarrito(idArmaRemover);
                mostrarCarrito();                
            });
        });
      },
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: "Compra Exitosa",
                text: `Gracias por tu compra! Total: $${total}`,
                icon: "success",
                customClass: {
                popup: 'carrito-modal',      
                title: 'carrito-title',       
                htmlContainer: 'carrito-html' 
              },
            });
            carrito = [];
            localStorage.removeItem("carrito");
            actualizarContadorCarrito();
        }
    });
}

verCarritoBtn.addEventListener("click", mostrarCarrito);
fetchArmas();
actualizarContadorCarrito();
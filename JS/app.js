const criptomonedasSelect = document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

const objBusqueda = {
  moneda: "",
  criptomoneda: "",
};

//Creando una promesa
const obtenerCriptomoneda = (criptomonedas) =>
  new Promise((resolve) => {
    resolve(criptomonedas);
  });

//Todos los EventListener.
document.addEventListener("DOMContentLoaded", () => {
  consultarCriptomonedas();
  formulario.addEventListener("submit", submitFormulario);
  criptomonedasSelect.addEventListener("change", leerValor);
  monedaSelect.addEventListener("change", leerValor);
});

//Función que hago para consultar las criptomonedas mas usadas o buscadas por el usuario.
function consultarCriptomonedas() {
  const url =
    "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";
  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => obtenerCriptomoneda(resultado.Data))
    .then((criptomonedas) => selectCriptomonedas(criptomonedas));
}

//Función que hago para seleccionar una cripto y mostrar cada una.
function selectCriptomonedas(criptomonedas) {
  criptomonedas.forEach((cripto) => {
    const { FullName, Name } = cripto.CoinInfo;
    const option = document.createElement("option");
    option.value = Name;
    option.textContent = FullName;
    criptomonedasSelect.appendChild(option);
  });
}

//Función que hago para leer el valor correspondiente.
function leerValor(e) {
  objBusqueda[e.target.name] = e.target.value;
}

//Función que hago para la interacción del formulario.
function submitFormulario(e) {
  e.preventDefault();

  //Aca voy a validar
  const { moneda, criptomoneda } = objBusqueda;
  if (moneda === "" || criptomoneda === "") {
    mostrarAlerta("Ambos campos son obligatorios");
    return;
  }
  consultarAPI(moneda, criptomoneda);
}

//Funcion que hago para mostrar mensaje de Alerta (error).
function mostrarAlerta(mensaje) {
  // Crea el div
  const divMensaje = document.createElement("div");
  divMensaje.classList.add("error");
  divMensaje.textContent = mensaje;

  // Insertar en el DOM
  formulario.appendChild(divMensaje);
  setTimeout(() => divMensaje.remove(), 3000);
}

//Función que hago para hacer el llamado a la API.
function consultarAPI() {
  const { moneda, criptomoneda } = objBusqueda;

  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((cotizacion) => {
      mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
    });
}

//Funcion que hago para imprimir la cotizacion con el dato correspondiente despues de llamar a la API.
function mostrarCotizacionHTML(cotizacion) {
  Toastify({
    text: "Calculando la cripto escogida",
    duration: 3000,
    style: {
      background: "green",
    },
  }).showToast();
  limpiarHTML();

  setTimeout(function () {
    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;

    const precio = document.createElement("p");
    precio.classList.add("precio");
    precio.innerHTML = `El Precio es: <span> ${PRICE} </span>`;

    const precioAlto = document.createElement("p");
    precioAlto.innerHTML = `El Precio más alto del día : <span> ${HIGHDAY} </span>`;

    const precioBajo = document.createElement("p");
    precioBajo.innerHTML = `El Precio más bajo del día: <span> ${LOWDAY} </span>`;

    const ultimasHoras = document.createElement("p");
    ultimasHoras.innerHTML = `Variación últimas 24 Horas: <span> ${CHANGEPCT24HOUR}% </span>`;

    const ultimaActualizacion = document.createElement("p");
    ultimaActualizacion.innerHTML = `La última actualización: <span> ${LASTUPDATE} </span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(ultimasHoras);
    resultado.appendChild(ultimaActualizacion);
  }, 3000);
}

//Función que hago para limpiar el HTML y no sobrecargar de info.
function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

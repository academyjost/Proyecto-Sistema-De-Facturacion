// Usamos const para nuestra "base de datos" porque los arreglos no van a cambiar de tipo,
// solo les vamos a ir metiendo (push) nueva información adentro.
const facturas = [];
// Aquí guardamos lo que el cliente va comprando antes de facturar
const carrito = []; 
// Esta variable nos ayuda a que el número de factura aumente solito cada vez
let numeroComprobante = 1;

//funcion para ocultar secciones
function ocultarSecciones() {
    const secciones = document.querySelectorAll("section");
    secciones.forEach(sec => sec.classList.remove("activa"));
}

function mostrarSeccion(id) {
    ocultarSecciones();
    let seccion = document.getElementById(id);
    if (seccion) {
        seccion.classList.add("activa");
    } else {
        console.error("No se encontró el ID: " + id);
    }
}

// Función para guardar el cliente (El SRI siempre pide nombre y RUC/Cédula)



// Función facilita para ir separando lo que el cliente quiere comprar
function agregarAlCarrito() {
    const nombre = document.getElementById("ventaProd").value;
    const cantidad = document.getElementById("ventaCant").value;

    const compra = { nombre: nombre, cantidad: cantidad };
    carrito.push(compra);
    
    alert("Producto añadido a la compra actual.");
}

// ¡Aquí viene la magia de la factura!
function generarFactura() {
    // Para no enredarnos mucho por ahora, agarramos al último cliente que registramos
    const clienteActual = clientes[clientes.length - 1];

    if (!clienteActual) {
        alert(" Porfavor ingrese un usuario.");
        return;
    }

    let subtotal = 0;
    let detalleDeCompra = "";

    // Recorremos todo lo que metimos al carrito
    for (const item of carrito) {
        let precioUnitario = 0;
        const cantidadAVender = Number(item.cantidad);

        // Buscamos cuánto cuesta ese producto revisando nuestro inventario
        for (const prod of productos) {
            if (prod.nombre === item.nombre) {
                if(cantidadAVender > prod.stock){
            alert("No hay suficiente stock de " + prod.nombre);
            return;
        }
                precioUnitario = prod.precio;
                // Opcional: Si quisiéramos ser más pros, aquí le restamos la cantidad al stock del inventario
                prod.stock = prod.stock - cantidadAVender
            }
        }

        // Hacemos el cálculo multiplicando. Al multiplicar, JS automáticamente trata los textos como números.
        const totalPorProducto = item.cantidad * precioUnitario;
        subtotal = subtotal + totalPorProducto;

        detalleDeCompra = detalleDeCompra + item.cantidad + "x " + item.nombre + " ($" + totalPorProducto + ") --- ";
    }

    // Calculamos el IVA (En Ecuador el SRI maneja el 15%)
    const iva = subtotal * 0.15;
    const totalFinal = subtotal + iva;

    // ¡Aquí está la mejora! En lugar de texto plano, creamos una estructura HTML
    // Usamos las comillas invertidas (backticks ` `) que nos permiten mezclar texto y variables fácilmente
    const htmlFactura = `
        <div style="text-align: left; font-size: 16px;">
            <p><strong>Factura N°:</strong> 001-001-0000000${numeroComprobante}</p>
            <p><strong>Cliente:</strong> ${clienteActual.nombre}</p>
            <p><strong>RUC/CI:</strong> ${clienteActual.cedula}</p>
            <hr style="border-color: #334155;">
            <p><strong>Detalle:</strong> ${detalleDeCompra}</p>
            <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
            <p><strong>IVA (15%):</strong> $${iva.toFixed(2)}</p>
            <h3 style="color: #38bdf8;">TOTAL A PAGAR: $${totalFinal.toFixed(2)}</h3>
        </div>
    `;

    // Lo mostramos en la pantalla inyectando el HTML (ya no usamos innerText, sino innerHTML)
    document.getElementById("pantallaFactura").innerHTML = htmlFactura;

    // Guardamos la factura completa en nuestra base de datos de facturas
    facturas.push(htmlFactura);

    //guardamos los productos actualizados
    localStorage.setItem("productos", JSON.stringify(productos));

    // Aumentamos el número de comprobante
    numeroComprobante++;

    // Vaciamos el carrito
    carrito.length = 0;
    // Pintar los productos para que carguen de nuevo 
    pintarProductos();
}


function calificarTest(){

    let puntaje = 0; //variable para guardar el puntaje

    let respuestas = document.querySelectorAll(  //variable que guarda la busqueda de los elementos radio
        'input[type="radio"]:checked'
    );

    respuestas.forEach(respuesta => {  //recorre todos los elementos 
        puntaje += parseInt(respuesta.value); //acumula los puntos
    });

    document.getElementById("resultadoTest").innerHTML = //modifica el html para mostrar la calificacion
        "Tu calificación es: " + puntaje + " / 5";
}
// Esta funcion nos ayuda a que la apgina empieze vacia
window.onload = function() {
    cargarDatosPrueba();
    pintarClientes();
    pintarProductos();
    cargarClientesVenta();
    cargarProductosVenta();
    mostrarSeccion("clientes");
};

//Funcion para cargar los datos del archivo datosPrueba.js
function cargarDatosPrueba(){

    let datosCargados = false;

    if(localStorage.getItem("clientes") == null){
        localStorage.setItem(
            "clientes",
            JSON.stringify(clientesPrueba)
        );
        datosCargados = true;
    }
    if(localStorage.getItem("productos") == null){
        localStorage.setItem(
            "productos",
            JSON.stringify(productosPrueba)
        );
        datosCargados = true;
    }
    if(datosCargados){
        location.reload();
    }
}

//Function limpiar el local Storage y cargar los datos
function cargarDatosDemo(){
    localStorage.clear();
    localStorage.setItem(
        "clientes",
        JSON.stringify(clientesPrueba)
    );
    localStorage.setItem(
        "productos",
        JSON.stringify(productosPrueba)
    );
    location.reload();
}
//Funcion para cargar Clientes de Venta en seleccion 
function cargarClientesVenta(){
    let combo = document.getElementById("ventaCliente");
    combo.innerHTML = "";
    clientes.forEach(cliente => {
        combo.innerHTML += `
            <option value="${cliente.cedula}">
                ${cliente.nombre} ${cliente.apellido}
            </option>
        `;
    });
}

//funcion para llenar los productos automaticamente 
function cargarProductosVenta(){
    let combo = document.getElementById("ventaProd");
    combo.innerHTML = "";
    productos.forEach(producto => {
        combo.innerHTML += `
            <option value="${producto.nombre}">
                ${producto.nombre} - Stock: ${producto.stock}
            </option>
        `;
    });
}

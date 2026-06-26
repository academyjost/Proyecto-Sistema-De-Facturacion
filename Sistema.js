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
//funcion para mostrar secciones
function mostrarSeccion(id) {
    ocultarSecciones();
    let seccion = document.getElementById(id);
    if (seccion) {
        seccion.classList.add("activa");
    } else {
        console.error("No se encontró el ID: " + id);
    }
}
// Función facilita para ir separando lo que el cliente quiere comprar
function agregarAlCarrito() {
    let nombre = document.getElementById("ventaProd").value;
    let cantidad = Number(document.getElementById("ventaCant").value);
    
    let producto = productos.find(p => p.nombre === nombre);
    if (!producto) {
        alert("Producto no encontrado");
        return;
    }

    if (cantidad <= 0 || isNaN(cantidad)) {
        alert("Ingrese una cantidad válida");
        return;
    }

    if (cantidad > producto.stock) {
        alert("No hay suficiente stock de " + producto.nombre);
        return;
    }

    // SI ESTAMOS EDITANDO
    if (carritoEditando != -1) {
        // Validamos que no se duplique en otra fila y revisamos 
        let yaExiste = carrito.some((item, idx) => item.nombre === nombre && idx !== carritoEditando);
        if (yaExiste) {
            alert("El producto ya está en el carrito en otra fila");
            return;
        }

        // Reemplazamos los datos en la posición que guardamos
        carrito[carritoEditando].nombre = nombre;
        carrito[carritoEditando].cantidad = cantidad;

        carritoEditando = -1; // Limpiamos la variable de edición
        alert("Producto modificado correctamente");
    } 
    // Si es un producto nuevo revisamos y nos sale un alert si no
    else {
        let yaExiste = carrito.some(item => item.nombre === nombre);
        if (yaExiste) {
            alert("El producto ya está en el carrito");
            return;
        }

        let nuevoItem = {
            nombre: nombre,
            cantidad: cantidad
        };
        carrito.push(nuevoItem);
        alert("Producto agregado al carrito");
    }

    // Limpiamos la caja de cantidad y actualizamos la tabla
    document.getElementById("ventaCant").value = "";
    pintarCarrito();
}

// Aqui se encuentra el como se realizara la impresion de la factura
function generarFactura() {
    // Validacion para poder seleccionar el cliente para imprimir
    const cedulaSeleccionada =
    document.getElementById("ventaCliente").value;

    const clienteActual = clientes.find(c => c.cedula === cedulaSeleccionada); //find busca en el arreglo y devuelve la condicion

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

    // Lo mostramos en la pantalla inyectando el HTML
    document.getElementById("pantallaFactura").innerHTML = htmlFactura;

    // Guardamos la factura
    facturas.push(htmlFactura);

    //guardamos los productos actualizados
    localStorage.setItem("productos", JSON.stringify(productos));

    // Aumentamos el número de comprobante
    numeroComprobante++;

    // Vaciamos el carrito
    carrito.length = 0;
    // Pintar los productos para que carguen de nuevo 
    pintarProductos();
    borrarCarrito();
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
    cargarProductosVenta();
    cargarClientesVenta();
    mostrarSeccion("clientes");
};

//Funcion para cargar los datos del archivo datosPrueba.js
function cargarDatosPrueba(){

    let datosCargados = false;

    if(localStorage.getItem("clientes") == null){ //revisa que en local storage del navegador
        localStorage.setItem(            //no este el clientes lleno de datos
            "clientes",
            JSON.stringify(clientesPrueba) //transforma en cadena de texto
        );
        datosCargados = true; //avisa que se guardo informacion nueva
    }
    if(localStorage.getItem("productos") == null){ 
        localStorage.setItem(
            "productos",
            JSON.stringify(productosPrueba)
        );
        datosCargados = true;
    }
    if(datosCargados){
        location.reload(); //funciona para recargar la pagina web
    }
}

//Function limpiar el local Storage y cargar los datos
function cargarDatosDemo(){ 
    localStorage.clear(); //funcion para limpiar el local storage
    localStorage.setItem( //guarda la lista de clientes prueba en el almacenamiento
        "clientes",
        JSON.stringify(clientesPrueba)
    );
    localStorage.setItem(
        "productos",   //guarda la lista de productos
        JSON.stringify(productosPrueba)
    );
    location.reload();
}
//Funcion para cargar Clientes de Venta en seleccion de lista
function cargarClientesVenta(){  
    let combo = document.getElementById("ventaCliente"); //aqui se busca en el html el elemento de ventaCliente
    combo.innerHTML = "";  //limpieza
    clientes.forEach(cliente => { //rrecorre el arreglo clientes
        combo.innerHTML += `
            <option value="${cliente.cedula}">
                ${cliente.nombre} ${cliente.apellido}
            </option>
        `; // esto se ingresa para modificar el html desde combo.innerHTML
    });
}

//funcion para llenar los productos automaticamente 
function cargarProductosVenta(){ 
    let combo = document.getElementById("ventaProd"); //Busca el venta prod para modificar
    combo.innerHTML = ""; //limpia el html
    productos.forEach(producto => {
        combo.innerHTML += `
            <option value="${producto.nombre}">
                ${producto.nombre} - Stock: ${producto.stock}
            </option>
        `; //modifica el html
    });
}
//sirve este let para saber que no estamos editando nda
let carritoEditando = -1;

function pintarCarrito() {
    let tabla = document.getElementById("tablaCarrito");
    if (!tabla) return;

    // Buscamos el tbody de la tabla
    let cuerpo = tabla.querySelector("tbody");

    // Limpiamos la tabla antes de pintar
    cuerpo.innerHTML = ""; 

    let total = 0;

    // Recorremos el carrito usando el index para ver si tenemos algo 
    carrito.forEach((item, index) => {

        // Buscamos el producto en nuestro inventario
        //  para sacar su precio y poder editarlo
        let prodBD = productos.find(p => p.nombre === item.nombre);
        let precio = 0;
        if (prodBD) {
            precio = prodBD.precio;
        }

        let subtotal = precio * item.cantidad;
        total = total + subtotal;

        // Concatenamos la fila de forma sencilla como en tus otros archivos
        cuerpo.innerHTML += `
            <tr>
                <td>${item.nombre}</td>
                <td>${item.cantidad}</td>
                <td>$${precio.toFixed(2)}</td>
                <td>$${subtotal.toFixed(2)}</td>
                <td>
                    <button onclick="subirParaEditar(${index})">Editar</button>
                    <button onclick="eliminarDelCarrito(${index})">Eliminar</button>
                </td>
            </tr>
        `;
    });

    // Actualizamos el total general al final de la tabla
    let elementoTotal = document.getElementById("totalCarrito");
    if (elementoTotal) {
        elementoTotal.textContent = total.toFixed(2);
    }
}

// Función  para mandar los datos a los recuadros de arriba
function subirParaEditar(index) {
    let item = carrito[index];

    // Ponemos los valores de la fila en los inputs de arriba
    document.getElementById("ventaProd").value = item.nombre;
    document.getElementById("ventaCant").value = item.cantidad;

    // Guardamos la posición en nuestra variable global
    carritoEditando = index;
}

// Función para quitar un producto del carrito
function eliminarDelCarrito(index) {
    if (confirm("¿Desea eliminar este producto del carrito?")) {
        // Quita el elemento en esa posición
        carrito.splice(index, 1); 
        
        // sirve para limpiar el carrito en dado caso estemos editando hace una pregunta
        //para saber si los datos son correctos
        if (carritoEditando === index) {
            carritoEditando = -1;
        }
        
        pintarCarrito(); // Volvemos a dibujar la tabla actualizada
    }
}
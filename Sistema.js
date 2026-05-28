// Usamos const para nuestra "base de datos" porque los arreglos no van a cambiar de tipo,
// solo les vamos a ir metiendo (push) nueva información adentro.
const clientes = [];
const productos = [];
const facturas = [];
const carrito = []; // Aquí guardamos lo que el cliente va comprando antes de facturar

// Esta variable nos ayuda a que el número de factura aumente solito cada vez
let numeroComprobante = 1;

// Función para guardar el cliente (El SRI siempre pide nombre y RUC/Cédula)
function guardarCliente() {
    const nombre = document.getElementById("nombreCli").value;
    const cedula = document.getElementById("cedulaCli").value;

    const cliente = { nombre: nombre, cedula: cedula };
    clientes.push(cliente);
    
    alert("¡Cliente guardado en la base de datos!");
}

// Función para meter productos a nuestro inventario
function guardarProducto() {
    const nombre = document.getElementById("nombreProd").value;
    const precio = document.getElementById("precioProd").value;
    const stock = document.getElementById("stockProd").value;

    const producto = { nombre: nombre, precio: precio, stock: stock };
    productos.push(producto);
    
    alert("¡Producto agregado al inventario!");
}

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
        alert("¡Oye! Primero tienes que registrar un cliente.");
        return;
    }

    let subtotal = 0;
    let detalleDeCompra = "";

    // Recorremos todo lo que metimos al carrito
    for (const item of carrito) {
        let precioUnitario = 0;

        // Buscamos cuánto cuesta ese producto revisando nuestro inventario
        for (const prod of productos) {
            if (prod.nombre === item.nombre) {
                precioUnitario = prod.precio;
                // Opcional: Si quisiéramos ser más pros, aquí le restaríamos la cantidad al stock del inventario
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

    // Armamos el texto de la factura simulando el formato de numeración del SRI
    const textoFacturacion = 
        "Factura N° 001-001-0000000" + numeroComprobante + 
        " | Cliente: " + clienteActual.nombre + " | RUC/CI: " + clienteActual.cedula + 
        " | Detalle: " + detalleDeCompra + 
        " | Subtotal: $" + subtotal + 
        " | IVA (15%): $" + iva + 
        " | TOTAL A PAGAR: $" + totalFinal;

    // Lo mostramos en la pantalla inyectando el texto en nuestro h3
    document.getElementById("pantallaFactura").innerText = textoFacturacion;

    // Guardamos la factura completa en nuestra base de datos de facturas
    facturas.push(textoFacturacion);

    // Aumentamos el número para que la siguiente factura sea la 2, luego la 3, etc.
    numeroComprobante = numeroComprobante + 1;

    // Vaciamos el carrito (lo dejamos en tamaño cero) para dejarlo limpio para la siguiente venta
    carrito.length = 0;
}


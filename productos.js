// Usamos const para nuestra "base de datos" porque los arreglos no van a cambiar de tipo,
// solo les vamos a ir metiendo (push) nueva información adentro.
let productos =
JSON.parse(localStorage.getItem("productos")) || [];



// Función para meter productos a nuestro inventario
function guardarProducto() {
    const nombre = document.getElementById("nombreProd").value;
    const precio =  Number(document.getElementById("precioProd").value);
    const stock = Number(document.getElementById("stockProd").value);

    const producto = { 
        nombre: nombre, 
        precio: precio, 
        stock: stock 
    };
    productos.push(producto);

    //Guardamos lista de productos en el navegador
    localStorage.setItem("productos",JSON.stringify(productos))
    
    pintarProductos();
}

function pintarProductos() {

    let tabla = document.getElementById("tablaProductos");
    //Seguridad por si no se encuentra el elemento
    if(!tabla) return;

    tabla.innerHTML = "";

    productos.forEach(productos => {

        tabla.innerHTML += `
            <tr>
                <td>${productos.nombre}</td>
                <td>${productos.precio}</td>
                <td>${productos.stock}</td>
            </tr>
        `;

    });

}

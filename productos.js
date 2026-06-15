// Usamos const para nuestra "base de datos" porque los arreglos no van a cambiar de tipo,
// solo les vamos a ir metiendo (push) nueva información adentro.
let productos =
JSON.parse(localStorage.getItem("productos")) || [];
let productoEditando = -1;


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
     if(productoEditando == -1){

        productos.push(producto);

    }else{

        productos[productoEditando] = producto;
        productoEditando = -1;
    }

    //Guardamos lista de productos en el navegador
    localStorage.setItem("productos",JSON.stringify(productos))
    
    pintarProductos();
}

function pintarProductos() {

    let tabla = document.getElementById("tablaProductos");
    //Seguridad por si no se encuentra el elemento
    if(!tabla) return;

    tabla.innerHTML = "";

    productos.forEach((producto, indice) => {

        tabla.innerHTML += `
            <tr>
                <td>${producto.nombre}</td>
                <td>${producto.precio}</td>
                <td>${producto.stock}</td>

                <td>
                    <button onclick="editarProducto(${indice})">
                        Editar
                    </button>
                </td>

                <td>
                    <button onclick="eliminarProducto(${indice})">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    });
}
//Creacion de una funcion que me permita Editar el Producto
function editarProducto(indice){

    document.getElementById("nombreProd").value =
        productos[indice].nombre;

    document.getElementById("precioProd").value =
        productos[indice].precio;

    document.getElementById("stockProd").value =
        productos[indice].stock;

    productoEditando = indice;
}
//Creacion de una funcion que me permita Eliminar el Producto
function eliminarProducto(indice){

    if(confirm("Desea eliminar este producto?")){

        productos.splice(indice,1);

        localStorage.setItem(
            "productos",
            JSON.stringify(productos)
        );

        pintarProductos();
    }
}

// Usamos const para nuestra "base de datos" porque los arreglos no van a cambiar de tipo,
// solo les vamos a ir metiendo (push) nueva información adentro.
let productos =
JSON.parse(localStorage.getItem("productos")) || [];
let productoEditando = -1;


// Función para meter productos a nuestro inventario
function guardarProducto() {
    const nombre = document.getElementById("nombreProd").value; //toma texto de campo nombre producto
    const precio =  Number(document.getElementById("precioProd").value);
    if(precio > 100){
        alert("Se necesita autorizacion para ingresar un producto de mas de 100$");
        return;
    }
    const stock = Number(document.getElementById("stockProd").value);
    if(stock > 20){
        alert("Se necesita autorizacion para ingresar mas de 20 productos");
        return;
    }
    
    const producto = {  //se crea objeto con datos del producto
        nombre: nombre, 
        precio: precio, 
        stock: stock 
    };
     if(productoEditando == -1){ //en caso de que el producto valga -1 no se esta editando se esta creando un producto nuevo
        productos.push(producto);

    }else{

        productos[productoEditando] = producto; //sobreescribe el producto viejo con los nuevos datos que estan en la funcion editarProducto  
        productoEditando = -1; //hace que se ingrese nuevo el producto con los nuevos datos
    }

    //Guardamos lista de productos en el navegador
    localStorage.setItem("productos",JSON.stringify(productos))
    
    pintarProductos();
}

function pintarProductos() {

    let tabla = document.getElementById("tablaProductos"); //recupera la tabla del html
    //Seguridad por si no se encuentra el elemento
    if(!tabla) return; //en caso de no encontrar la tabla

    tabla.innerHTML = ""; //limpia la tabla

    productos.forEach((producto, indice) => { //busca el producto y se adiciona la variable indice que es la posicion del producto en el arreglo

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
        productos[indice].nombre; //busca el nombre puesto en nombre prod

    document.getElementById("precioProd").value =
        productos[indice].precio; //busca y lo llena con el precio del producto seleccionado

    document.getElementById("stockProd").value =
        productos[indice].stock;

    productoEditando = indice; //guarda la posicion del producto en la variable productoEditando
}
//Creacion de una funcion que me permita Eliminar el Producto
function eliminarProducto(indice){

    if(confirm("Desea eliminar este producto?")){

        productos.splice(indice,1); //quita elementos del arreglo con splice, indice indica la posicion y el 1 el numero de elementos quita productos

        localStorage.setItem( //actualiza el localStorage del navegador
            "productos",
            JSON.stringify(productos)
        );

        pintarProductos();
    }
}

/// Usamos const para nuestra "base de datos" porque los arreglos no van a cambiar de tipo,
// solo les vamos a ir metiendo (push) nueva información adentro.
const clientes = JSON.parse(localStorage.getItem("clientes")) || [];
// Función para guardar el cliente (El SRI siempre pide nombre y RUC/Cédula)
function guardarCliente() {
    const cedula = document.getElementById("cedulaCli").value;
    if (cedula.length != 10){
        alert("La cedula debe tener exactamente 10 dígitos");
        return;
    }
    const nombre = document.getElementById("nombreCli").value;
    const apellido = document.getElementById("apellidoCli").value;
    const existe = clientes.find(c => c.cedula === cedula); //para validar que no se ingresen la misma cedula 
    if(existe){
    alert("Ya existe un cliente con esa cédula");
    return;
    }
    const cliente = {   
        cedula: cedula,
        nombre: nombre,
        apellido: apellido
    };
    clientes.push(cliente);

    //Guardamos clientes en la lista de navegador
    localStorage.setItem("clientes", JSON.stringify(clientes))
    // Alerta en el navegador

    pintarClientes();
}
//Funcion para ver la lista de clientes en este caso tabla
function pintarClientes() { 

    let tabla = document.getElementById("tablaClientes"); //busca y recupera la tabla del html

    tabla.innerHTML = ""; //limpia la tabla

    clientes.forEach(cliente => {

        tabla.innerHTML += `
            <tr>
                <td>${cliente.cedula}</td>
                <td>${cliente.nombre}</td>
                <td>${cliente.apellido}</td>
            </tr>
        `;

    }); //escribe la tabla

}

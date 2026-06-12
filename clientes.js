function guardarCliente() {
    const cedula = document.getElementById("cedulaCli").value;
    if (cedula.length != 10){
        alert("La cedula debe tener exactamente 10 dígitos");
        return;
    }
    const nombre = document.getElementById("nombreCli").value;
    const apellido = document.getElementById("apellidoCli").value;
    

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

function pintarClientes() {

    let tabla = document.getElementById("tablaClientes");

    tabla.innerHTML = "";

    clientes.forEach(cliente => {

        tabla.innerHTML += `
            <tr>
                <td>${cliente.cedula}</td>
                <td>${cliente.nombre}</td>
                <td>${cliente.apellido}</td>
            </tr>
        `;

    });

}

let clientes = [];
let productos = [];
let facturas = [];

function GuardarCliente(nombre, apellido, cedula,) {
    const cliente = {
        nombre: nombre,
        apellido: apellido,
        cedula: cedula,
    };
    clientes.push(cliente);
    console.log("Cliente guardado:", cliente);
}if (typeof module !== 'undefined') {
    module.exports = {
        GuardarCliente,
    };
}

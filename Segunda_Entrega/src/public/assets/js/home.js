export function mostrarProductos(data) {

    console.log(data)

    let log = document.querySelector('#messageLogs')
    let productos = ''
    data.forEach( producto => {
        productos = productos + `${producto}<br>`
    })
    
    log.innerHTML = productos
   
    
}

const socket = io()

let prodSubmit  = document.querySelector('#prodSubmit')
let prodTitle   = document.querySelector('#prodTitle')
let prodDesc    = document.querySelector('#prodDesc')
let prodPrecio  = document.querySelector('#prodPrecio')
let prodStock   = document.querySelector('#prodStock')
let prodCat     = document.querySelector('#prodCat')
let prodCode    = document.querySelector('#prodCode')

prodSubmit.addEventListener('click', async (evt) => {

    const datosProd = []

    if(
        prodTitle.value.trim().length > 0   &&  prodDesc.value.trim().length     > 0  &&
        prodCode.value.trim().length  > 0   &&  prodPrecio.value.trim().length   > 0  &&
        prodStock.value.trim().length > 0   &&  prodCat.value.trim().length      > 0
    ){
        
        datosProd.push(prodTitle.value, prodDesc.value, prodCode.value, prodPrecio.value, prodStock.value, prodCat.value)
        socket.emit('nuevoProducto', { datosProd })

        prodTitle.value   = ''
        prodDesc.value    = '' 
        prodCode.value    = '' 
        prodPrecio.value  = ''
        prodStock.value   = '' 
        prodCat.value     = ''
         
    }else{

        Swal.fire({
            icon: "error",
            title: "Error! Faltan datos.",
            text: "Debe ingresar todos los campos solicitados.",
            allowOutsideClick: false 
        });

    }

    evt.preventDefault()
})

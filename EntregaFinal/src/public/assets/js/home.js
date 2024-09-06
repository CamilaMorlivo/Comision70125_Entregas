const socket = io()

socket.on('productosExistentes', data => {

    if(data.length === 0){

        let h1 = document.querySelector('#listProductsTitle')
        let p  = document.querySelector('#listProductP')

        h1.innerHTML = 'NO HAY PRODUCTOS AGREGADOS'
        p.innerHTML  = 'Por favor, agregue un producto a la lista.'

    }

    let log       = document.querySelector('#messageLogs')
    let productos = ''

    for (let i = 0; i < data.length; i++) {
        
       productos = productos + `
        <tr>
                <th>${data[i][0]}</th>
                <th>${data[i][1]}</th>
                <th>$${data[i][3]}</th>
                <th> 
                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-cart-plus-fill" viewBox="0 0 16 16">
                        <path d="M.5 1a.5.5 0 0 0 0 1h1.11l.401 1.607 1.498 7.985A.5.5 0 0 0 4 12h1a2 2 0 1 0 0 4 2 2 0 0 0 0-4h7a2 2 0 1 0 0 4 2 2 0 0 0 0-4h1a.5.5 0 0 0 .491-.408l1.5-8A.5.5 0 0 0 14.5 3H2.89l-.405-1.621A.5.5 0 0 0 2 1zM6 14a1 1 0 1 1-2 0 1 1 0 0 1 2 0m7 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0M9 5.5V7h1.5a.5.5 0 0 1 0 1H9v1.5a.5.5 0 0 1-1 0V8H6.5a.5.5 0 0 1 0-1H8V5.5a.5.5 0 0 1 1 0"/>
                        </svg>
                    </button>
                </th>
  
        </tr>
       `
    }

    log.innerHTML = productos

})


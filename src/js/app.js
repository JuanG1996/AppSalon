let pagina = 1;
const cita = {
    nombre: "",
    fecha: "",
    hora: "",
    servicios:[]
}

document.addEventListener("DOMContentLoaded", function(){
    inciarApp();

    
});


function inciarApp(){
    mostrarServicios();
    //Resalta el DIV actual segun el tab presionado
    mostrarSeccion();
    //Oculta o muestra una sección segun el tab preisonado
    cambiarSeccion();

    //Paginacion
    paginaSiguiente();

    paginaAnterior();

    //Comprueba la pagina actual para ocultar o mostrar la paginacion
    botonesPaginador();

    //Muestra el resumen de la cita o mnsj de error si no completa
    mostrarResumen();

    //Almacena el nombre de la cita en el objeto
    nombreCita();

    //Validar Fecha
    fechaCita();

    //Deshabilita dias pasados
    desabilitaFechaAnterior();

    //Almacena la hora de la cita en el objeto
    horaCita();
}

//UI
async function mostrarServicios(){
    try{
        const resultado = await fetch("./servicios.json");
        const db = await resultado.json();
        const { servicios } = db;
        const serviciosContenedor = document.querySelector("#servicios");

        //Generar HTML
        servicios.forEach(servicio => {
            const { id, nombre, precio } = servicio;

            const nombreServicio = document.createElement("p");
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add("nombre-servicio");

            const precioServicio = document.createElement("p");
            precioServicio.textContent = `$${precio}`;
            precioServicio.classList.add("precio-servicio");

            const servicioDiv = document.createElement("div");
            servicioDiv.classList.add("servicio");
            servicioDiv.dataset.idServicio = id;

            //Seleccionar un servicio
            servicioDiv.onclick = seleccionarServicio;


            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);
            serviciosContenedor.appendChild(servicioDiv);
        });

    }catch(error){
        console.log(error);
    }
}
function mostrarResumen(){
    // Destructuring
    const {nombre, fecha, hora, servicios} = cita;

    const resumenDiv = document.querySelector(".contenido-resumen");

    //Limpia el HTML Previo
    while(resumenDiv.firstChild){
        resumenDiv.removeChild(resumenDiv.firstChild);
    }
    // Vaidación de objeto
    if(Object.values(cita).includes("")){
        const noServicio = document.createElement("p");
        noServicio.textContent = "Faltan datos de cita por llenar";
        noServicio.classList.add("invalidar-cita");
        //Agregar a resumen div
        resumenDiv.appendChild(noServicio);
    }else{
        const headingCita = document.createElement("H3");
        headingCita.textContent = "Resumen de cita";

        const nombreCita = document.createElement("p");
        nombreCita.innerHTML = `<span>Nombre: </span> ${nombre}`;

        const fechaCita = document.createElement("p");
        fechaCita.innerHTML = `<span>Fecha: </span> ${fecha}`;

        const horaCita = document.createElement("p");
        horaCita.innerHTML = `<span>Hora: </span> ${hora}`;

        const serviciosCita = document.createElement("div");
        serviciosCita.classList.add("resumen-servicios");

        const headingServicios = document.createElement("H3");
        headingServicios.textContent = "Resumen de servicios";

        serviciosCita.appendChild(headingServicios);
        let cantidad     = 0;
        //Iterar sobre el arreglo de servicios
        servicios.forEach((servicio)=>{
            const {nombre, precio} = servicio;
            const contenedorServicio = document.createElement("div");
            contenedorServicio.classList.add("contenedor-servicio");

            const textoServicio = document.createElement("p");
            textoServicio.textContent = nombre;

            const precioServicio = document.createElement("p");
            precioServicio.textContent = precio;
            precioServicio.classList.add("precio");

            const totalServicio = precio.split("$");

            cantidad += parseInt(totalServicio[1].trim());

            contenedorServicio.appendChild(textoServicio);
            contenedorServicio.appendChild(precioServicio);
            serviciosCita.appendChild(contenedorServicio);
        })

        console.log(cantidad);

        resumenDiv.appendChild(headingCita);
        resumenDiv.appendChild(nombreCita);
        resumenDiv.appendChild(fechaCita);
        resumenDiv.appendChild(horaCita);

        resumenDiv.appendChild(serviciosCita);

        const cantidadPagar = document.createElement("p");
        cantidadPagar.classList.add("total");
        cantidadPagar.innerHTML = `<span>Total a pagar: $</span>${cantidad}`;

        resumenDiv.appendChild(cantidadPagar);
    }


}

function paginaSiguiente(){
    paginaSiguiente = document.querySelector("#siguiente");
    paginaSiguiente.addEventListener("click", ()=>{
        pagina ++;
        botonesPaginador();
    })
}

function paginaAnterior(){
    paginaAnterior = document.querySelector("#anterior");
    paginaAnterior.addEventListener("click", ()=>{
        pagina --;
        botonesPaginador();
    })
}

function desabilitaFechaAnterior(){
    const inputFecha = document.querySelector("#fecha");
    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = (fechaAhora.getMonth() < 10) ? ("0" + (fechaAhora.getMonth() + 1)) : (fechaAhora.getMonth() + 1);  
    const dia = (fechaAhora.getDate() < 10) ? ("0" + (fechaAhora.getDate() + 1)) : (fechaAhora.getDate() + 1);

    const fechaDesabilitar = `${year}-${mes}-${dia}`;
    inputFecha.min = fechaDesabilitar;
}


function botonesPaginador(){
    paginaSiguiente = document.querySelector("#siguiente");
    paginaAnterior = document.querySelector("#anterior");

    if(pagina === 1){
        paginaAnterior.classList.add("ocultar");
    }else if(pagina === 3){
        paginaSiguiente.classList.add("ocultar");
        paginaAnterior.classList.remove("ocultar");
        mostrarResumen();
    }else{
        paginaSiguiente.classList.remove("ocultar");
        paginaAnterior.classList.remove("ocultar");

    }

    mostrarSeccion();
    
}

function mostrarSeccion(){
    const seccionAnterior = document.querySelector(".mostrar-seccion");

    if(seccionAnterior){
        //eliminar seccion anterior
        seccionAnterior.classList.remove("mostrar-seccion");
    }

    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add("mostrar-seccion");
    
    //Eliminar clase actual en tab anterior
    const tabAnterior =document.querySelector(".tabs .actual");
    if (tabAnterior){
        tabAnterior.classList.remove("actual");
    }    
    //Resalta el tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add("actual");
}

function cambiarSeccion(){
    const enlaces = document.querySelectorAll(".tabs button");
    enlaces.forEach(enlace=>{
        enlace.addEventListener("click", e =>{
            e.preventDefault();
            pagina = parseInt(e.target.dataset.paso);
  
            mostrarSeccion();
            botonesPaginador();
        });
    });

}

function seleccionarServicio(e){
    let elemento;
    if(e.target.tagName === "P"){
        elemento = e.target.parentElement;
    }else{
        elemento = e.target;
    }

    if(elemento.classList.contains("seleccionado")){
        elemento.classList.remove("seleccionado");
        const id = parseInt(elemento.dataset.idServicio);
        eliminarServicio(id);
    }else{
        elemento.classList.add("seleccionado");
        servicioObj ={
            id: parseInt(elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent

        }
        agregarServicio(servicioObj);
    }
}
//Extraer datos
function nombreCita(){
    const nombreInput = document.querySelector("#nombre");
    nombreInput.addEventListener("input", (e)=>{
        const nombreTexto = e.target.value.trim();
        if(nombreTexto === "" || nombreTexto.length <3){
           mostrarAlerta("Mensaje no valido", "error")
        }else{
            alerta = document.querySelector(".alerta");
            if(alerta){
                alerta.remove();
            }
            cita.nombre = nombreTexto;
        }
    });
}

function fechaCita(){
    const fechaInput = document.querySelector("#fecha");
    fechaInput.addEventListener("input", e =>{
        const dia = new Date(e.target.value).getUTCDay();

        if([0].includes(dia)){
            e.preventDefault();
            fechaInput.value = "";
            mostrarAlerta("No hay citas en Domingo", "error");
        }else{
            cita.fecha = fechaInput.value;
        }
    })
}

function horaCita(){
    const inputHora = document.querySelector("#hora");
    inputHora.addEventListener("input", e=>{
        const horaCita = e.target.value;
        const hora = horaCita.split(":");
        if(hora[0] < 8 || hora[0] > 22){
           mostrarAlerta("Hora no valida", "error");
               inputHora.value = "";
        }else{
            cita.hora = horaCita;
        }
    })
}

//Utilidades
function mostrarAlerta(mensaje, tipo){
    //Si hay una alerta previa no crear otra
    alertaPrevia = document.querySelector(".alerta");
    if(!alertaPrevia){

        const alerta = document.createElement("div");
        alerta.textContent = mensaje;
        alerta.classList.add("alerta");
    
        if(tipo === "error"){
            alerta.classList.add("error");
        }
    
        // Insertar en el html
        const formulario = document.querySelector(".formulario");
        formulario.appendChild(alerta);

        setTimeout(()=>{
            alerta.remove();
        },3000)
    }

}

function eliminarServicio(id){
    const {servicios} = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id);
}

function agregarServicio(servicioObj){
    const {servicios} = cita;
   cita.servicios = [...servicios, servicioObj];
}
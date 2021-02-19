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
}



function botonesPaginador(){
    paginaSiguiente = document.querySelector("#siguiente");
    paginaAnterior = document.querySelector("#anterior");

    if(pagina === 1){
        paginaAnterior.classList.add("ocultar");
    }else if(pagina === 3){
        paginaSiguiente.classList.add("ocultar");
        paginaAnterior.classList.remove("ocultar");
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

function eliminarServicio(id){
    const {servicios} = cita;
    cita.servicios = servicios.filter(servicio => servicio.id !== id);
    console.log(cita);
}

function agregarServicio(servicioObj){
    const {servicios} = cita;
   cita.servicios = [...servicios, servicioObj];
   console.log(cita);
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

function mostrarResumen(){
    // Destructuring
    const {nombre, fecha, hora, servicios} = cita;

    const resumenDiv = document.querySelector(".contenido-resumen");

    // Vaidación de objeto
    if(Object.values(cita).includes("")){
        const noServicio = document.createElement("p");
        noServicio.textContent = "Faltan datos de cita por llenar";
        noServicio.classList.add("invalidar-cita");
        //Agregar a resumen div
        resumenDiv.appendChild(noServicio);
    }


}

function nombreCita(){
    const nombreInput = document.querySelector("#nombre");
    nombreInput.addEventListener("input", (e)=>{
        const nombreTexto = e.target.value.trim();
        if(nombreTexto === "" || nombreTexto.length <3){
           mostrarAlerta("Mensaje n valido", "error")
        }else{
            cita.nombre = nombreTexto;
        }
    });
}

function mostrarAlerta(mensaje){
    const alerta = document.createElement("div");
    alerta.textContent = mensaje;
    alerta.classList.add("alerta");

    if(tipo === "error"){
        alerta.classList.add("error");
    }

    // Insertar en el html
    const formulario = document.querySelector(".formulario");
    formulario.appendChild(alerta);
}
const API_URL_BASE = "https://holidayapi.com/v1/";
const API_KEY = "728032d6-0494-4817-921e-b0665fbcb3ae";

var txt_anio;
var cbx_pais;
var cbx_mes;
var div_resultados;

window.onload = function () {
    txt_anio = document.getElementById("txt_anio");
    cbx_pais = document.getElementById("cbx_pais");
    cbx_mes = document.getElementById("cbx_mes");
    div_resultados = document.getElementById("div_resultados");

    txt_anio.value = (new Date().getFullYear() - 1);
    div_resultados.style.display = "none";
}

function consultar() {
    div_resultados.style.display = "none";

    var request = new XMLHttpRequest();
    var URL_CONSULTA = API_URL_BASE + "holidays?" +
        "language=es" + "&key=" + API_KEY +
        "&country=" + cbx_pais.value +
        "&year=" + txt_anio.value +
        "&month=" + cbx_mes.value;
    console.log(URL_CONSULTA);
    request.open('GET', URL_CONSULTA, true);
    request.onload = function () {
        if (request.status >= 200 && request.status < 300) {
            var data = JSON.parse(this.response);
            console.log(data);
            mostrarDiasFestivos(data.holidays);
        } else {
            alert("No se puede conectar al servidor");
        }
    }
    request.onerror = function () {
        alert("El API_KEY solo permite consultar los días" +
            " feriados del año inmediato anterior");
    };
    request.send();
    return false;
}

function mostrarDiasFestivos(diasFestivos) {
    div_resultados.style.display = "block";
    div_resultados.innerHTML = "";
    let titulo = document.createElement("h2");
    titulo.innerHTML = "Días festivos de " +
        cbx_pais.options[cbx_pais.selectedIndex].text +
        " en " + cbx_mes.options[cbx_mes.selectedIndex].text +
        " del año " + txt_anio.value;
    div_resultados.appendChild(titulo);
    let tarjetas = "";
    diasFestivos.forEach((diaFestivo) => {
        tarjetas += generarTarjeta(diaFestivo);
    });

    if (tarjetas !== "") {
        tarjetas = '<div class="tarjetas">' + tarjetas + '</div>';
        div_resultados.insertAdjacentHTML("beforeend", tarjetas);
    } else {
        let mensaje = document.createElement("h3");
        mensaje.innerHTML = "No se encontraron días feriados para este mes";
        mensaje.className = "sinresultados";
        div_resultados.appendChild(mensaje);
    }
}

function generarTarjeta(datos){
    console.log(datos);
    return '<div class="tarjeta">' +
        '   <h3>' + datos.name + '</h3>' +
        '   <h4>' + datos.date + '</h4>' +
        '   <br>'+
        '   ' + datos.weekday.date.name + 
        '</div>';

}
var Conn = new Conexion();
class Login {
  constructor(usr, clv) {
    this.nombre = usr;
    this.clave = clv;
  }
  Login(){
    return this;
  }
}


$(function (){
  $('#clave').keyup(function(e){
    if(e.keyCode == 13) {
        Ingresar();
    }
  });

  Pace.on("done", function (){
    $("#xpage-pace").fadeIn(1500);
  });


});

function Ingresar(){
  if ($("#usuario").val() == ""){
    $.notify("No ha introducido usuario", "warn");
    $("#usuario").focus();
    $("#_login").attr("disabled", true);
    return false;
  }
  if ($("#clave").val() == ""){
    $.notify("No ha introducido clave", "warn");
    $("#clave").focus();
    $("#_login").attr("disabled", true);
    return false;
  }
  let login = new Login($("#usuario").val(), $("#clave").val());
  var xhttp = new XMLHttpRequest();
  $("#_cargando").show();

  xhttp.open("POST", Conn.URLSEC + "/ipsfa/app/api/wusuario/login");
  xhttp.onreadystatechange = function() {

    if (this.readyState === 4 && this.status === 200) {
     json = JSON.parse(xhttp.responseText);
     sessionStorage.setItem('ipsfaToken', json.token);

     var s = json.token.split(".");
     var MenuJS = JSON.parse(atob(s[1]));

     if(MenuJS.Usuario.modulo != undefined){
       var mod = Array.isArray(MenuJS.Usuario.modulo)==true?MenuJS.Usuario.modulo[0]:"afiliacion";
       $(location).attr("href", mod + "/starter.html");
     }else{
       $(location).attr("href","afiliacion/starter.html");
     }
   }else if(this.readyState === 4 && this.status === 403){
     $.notify("Debe verificar el usuario o clave para ingresar al sistema...", {
      	animate: {
      		enter: 'animated bounceIn',
      		exit: 'animated bounceOut'
      	},
        type: 'danger'
      });

     $("#_login").attr("disabled", true);
     $("#usuario").val("");
     $("#clave").val("");
     $("#usuario").focus();
     $("#_cargando").hide();
   }
  };
  xhttp.onerror = function() {
       if (this.readyState === 4 && this.status === 0) {

         $.notify("No se puede conectar al servidor");
         $("#_login").attr("disabled", true);
         $("#usuario").val("");
         $("#clave").val("");
         $("#usuario").focus();
         $("#_cargando").hide();
         //$.notify("Intente mas tarde", "success");
       }
   };

  xhttp.send(JSON.stringify(login.Login()));
}

function ActivarIniciar(){
  $("#_login").attr("disabled", false);
}

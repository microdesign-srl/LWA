<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Login.aspx.cs" Inherits="Logistica.Login" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <link rel="icon" href="icon/favicon.ico" type="image/ico" sizes="16x16" />

    <title>Logistica-Login</title>
    <!-- Stili statici -->
    <link href="style/w3.css" rel="stylesheet" />
    <!-- Script statici -->
    <script src="js/jquery-3.2.0.min.js"></script>
    <script src="js/injector.js"></script>
    
    <!-- Cache Busting -->
    <script>
        // CSS
        var styles = ["style/Login.css"];
        styles.forEach(function (item) { injectStyle(item); });
        // Scripts
        var scripts = ["js/Global.js", "js/ajax.js", "js/Login.js", "js/MediaQuery.js"];
        scripts.forEach(function (item) { injectScript(item); });
    </script>
</head>
<body class="w3-center" style="background-color: #EDEDED;">
    <script>
        window.addEventListener("load", function () {

            Ajax_GetDitta();

            Login_Media_Query();

            $("#pglogin").removeClass("w3-hide");

            // Visualizzazione della versione corrente
            $("#Versione").text("Versione: " + Versione);
            // Recupero la variabile di sessione oApp
            if (fU.GetSession("oApp") != null) oApp = fU.GetSession("oApp");

            // Se sono già loggato procedo su Logistica.aspx
            if (oApp.Logon)
                location.assign("Logistica.aspx");
            else
                // Altrimenti effettuo il reset di oApp
                oApp_Reset();

            // memorizzo il tipo di browser
            oApp.Browser = "<%=Request.Browser.Browser %>";

            // gestisco i cookies
            if (localStorage.Ricordami && localStorage.Ricordami != '') {
                $('#Ricordami').attr('checked', 'checked');
                $('#Cd_Operatore').val(localStorage.Cd_Operatore);
                $('#Password').val(localStorage.Password);
            } else {
                $('#Ricordami').removeAttr('checked');
                $('#Cd_Operatore').val('');
                $('#Password').val('');
            }

            $("input:visible:empty:first").focus();

            $("#pglogin input").keyup(function (e) {
                switch (e.which) {
                    case 13:    //Invio
                        Ajax_LoginValidate();
                        break;
                    default:
                        break;
                }
            });
        }, false);
    </script>
    <div id="pglogin" class="w3-hide" style="width: 100%">
        <div class="w3-center ">
            <img src="loghi/WOLTERSKLUWER_Logo.svg" class="lg-logowki" />
        </div>
        <div class="lg-logincard w3-white">
            <img src="loghi/ARCAEVOLUTION.svg" class="lg-logoarca" />
            <div class="lg-divinput">
                <label class="lg-loginfont w3-left">Username</label><br />
                <input id="Cd_Operatore" type="text" class="lg-input" />
                <br />
                <label class="lg-loginfont w3-left">Password</label><br />
                <input id="Password" type="password" class="lg-input" />
                <br />
                <button type="submit" class="lg-btnaccedi" onclick="Ajax_LoginValidate();">Accedi</button>
                <div class="w3-row lg-mt-10">
                    <label class="container w3-left">
                        <label class="lg-lblricordapw w3-left">Ricorda la password</label>
                        <input id="Ricordami" class="lg-ckricordapw" type="checkbox" checked="checked" />
                        <span class="checkmark"></span>
                    </label>
                    <label id="Terminale" class="lg-lblinfo w3-right"><%=Request.UserHostAddress %></label>
                </div>
            </div>
        </div>
        <div class="w3-row w3-center lg-mt-10">
            <%--<label class="lg-lblcondutil">Condizioni di utilizzo</label>--%>
        </div>
        <div class="w3-row w3-center">
            <label id="Versione" class="lg-lblinfo"></label>
            <br />
            <label id="Ditta" class="lg-lblinfo"></label>
        </div>
    </div>

        <%-- POPUP DEI MESSAGGI --%>
    <div id="PopupMsg" class="w3-modal">
        <div class="w3-modal-content lg-mw-500">
            <div class="w3-red" style="height: 4px;">
            </div>
            <div class="w3-container w3-center w3-margin-top" style="overflow-y:auto">
                <img style="height: 1.9em;" class="w3-margin-bottom" src="icon/WarningRed.svg" />
                <br />
                <label class="title lg-popuptitle">ERRORE</label>
                <br />
                <br />
                <label class="msg lg-popupdom"></label>
                <div class="div-btn w3-row w3-margin-bottom w3-center lg-mt-10">
                    <button class="btn-popupMsg lg-btn-blue" onclick="$('#PopupMsg').hide();">OK</button>
                </div>
            </div>
        </div>
    </div>
</body>
</html>

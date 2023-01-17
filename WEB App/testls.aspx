<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="testls.aspx.cs" Inherits="Logistica.testls" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <script src="js/jquery-3.2.0.min.js"></script>
    <script src="js/Global.js"></script>
    <link href="style/w3.css" rel="stylesheet" />
    <link href="style/Logistica.css" rel="stylesheet" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title></title>
</head>
<body>
    <div class="w3-center ">
        <img src="loghi/WOLTERSKLUWER_Logo.svg" class="lg-logowki" style="width:250px; height:auto;" />
    </div>
    <div id="Popup_ListenerTesting">
        <div style="height: 4px; background-color: #ffc107;">
        </div>
        <div class="w3-container w3-center w3-margin-top">
            <div class="w3-badge lg-badge" style="background-color: #ffc107;">
                <img style="height: 1.9em;" src="icon/Wifi.svg" />
            </div>
            <br />
            <label class="lg-popuptitle">VERIFICA COMUNICAZIONE</label>
            <br />
            <br />
            <div class="lg-mt-5">
                <label class="w3-margin-top">Selezionare il Listener:&nbsp;</label><br/>
                <select name='Listener' class="lg-input" style="width: 60%;">
                </select>
            </div>
            <br />
            <label class="output"></label>
            <div class="div-btn w3-row lg-divbutton">
                <button class="lg-btn-blue" onclick="Listener_Testing();">Verifica</button>
            </div>
        </div>
    </div>
</body>
</html>
<script>

    var dtxMOListener;

    $(document).ready(function () {

        Ajax_xMOListener();
        $(".output").text("");

    });

    function Ajax_xMOListener() {

        var out = false;

        var p = $("#Popup_ListenerTesting");
        $(p).find(".op-listener").remove();

        Params = JSON.stringify({
            Terminale: '',
            Cd_Operatore: ''
        });

        $.ajax({
            url: "testls.aspx/xMOListener",
            async: false,
            data: Params,
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (mydata) {
                if (!fU.IsEmpty(mydata.d)) {

                    dtxMOListener = $.parseJSON(mydata.d);

                    //Verifico che il dt abbia delle righe
                    if (dtxMOListener.length > 0) {
                        for (var i = 0; i < dtxMOListener.length; i++) {
                            $(p).find("select[name = 'Listener']").append($('<option>', {
                                class: "op-listener",
                                value: dtxMOListener[i].Cd_xMOListener,
                                text: dtxMOListener[i].Cd_xMOListener,
                                idx: i
                            }));
                        }
                    }

                    out = true;
                } else
                    //Nessun listener definito: errore
                    $(".output").text("ATTENZIONE! Nessun listener attivo per Logistica!");
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
            }
        });

        return out;
    }

    function Listener_Testing() {
        var cmd = '{MS= ' + $("#Popup_ListenerTesting select[name='Listener']").val() + ' ;}';
        Ajax_ListenerCoda_Add(cmd, 0, 0, $("#Popup_ListenerTesting select[name='Listener']").val());
    }

    // Aggiunge i comandi alla coda del listener
    function Ajax_ListenerCoda_Add(cmd, Listener) {
        var out = false;
        var ActiveListenerIdx = $("select[name = 'Listener']").find(":selected").attr("idx");

        Params = JSON.stringify({
            Terminale: ""
            , Cd_Operatore: ""
            , Cd_xMOListener: dtxMOListener[ActiveListenerIdx].Cd_xMOListener 
            , Comando: cmd //salva //"PM=" + Stato.DO[Stato.idxDO].Cd_DO + ",1,PrimoPDF}",  //salva e stampa documento
        });
        $.ajax({
            url: "testls.aspx/ListenerCoda_Add",
            async: false,
            data: Params,
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (mydata) {
                //nel mio array di stato metto tutti i fornitori
                var r = $.parseJSON(mydata.d);
                if (r[0].Result == 1) {
                    //Invia il comando al listner per avviare il salvataggio e/o la stampa
                    Ajax_Listener_WakeUp(r[0].Id_xMOListenerCoda);
                    out = true;
                }
                else
                    $(".output").html("ERRORE! " + r[0].Result + '<br />' + r[0].Messaggio);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                Local_Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
            }
        });
        return out;
    }

    // Mette in ascolto il listener
    function Ajax_Listener_WakeUp(Id_xMOListenerCoda) {

        var ActiveListenerIdx = $("select[name = 'Listener']").find(":selected").attr("idx");

        Params = JSON.stringify({
            IP: dtxMOListener[ActiveListenerIdx].IP,
            Port: dtxMOListener[ActiveListenerIdx].ListenPort,
            Id_xMOListenerCoda: Id_xMOListenerCoda
        });
        $.ajax({
            url: "testls.aspx/ListenerCoda_WakeUp",
            async: false,
            data: Params,
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                $(".output").text("MESSAGGIO! Verificare in Arca nella maschera del listener o nella coda, se la comunicazione è andata a buon fine");
                return true;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                Local_Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
            }
        });
    }

    //Gestione errori chiamate ajax / server
    function Local_Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown) {
        // Variabili di ritorno  
        var response = $.parseJSON(XMLHttpRequest.responseText).Message;
        var status = XMLHttpRequest.status;
        var statusTxt = XMLHttpRequest.statusText;
        // Messaggio restituito
        var text = "ERRORE \n" + response + "\n" + status + " - " + statusTxt;
        $(".output").html(statusTxt + '<br />' + text);
        // ### Sviluppare la pagina della pila dei messaggi 
    }
</script>

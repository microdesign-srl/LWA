/*
      Pers.js
      Contiene tutte le funzioni e gli oggetti della pagina logistica.aspx

       DATA ULTIMA MODIFICA
       13/11/2019

        #1.00 REGION: pgxMPIU
      
*/
function Init_Pers() {

    $("#pgxMPIU input[name='Id_DORig']").on("keypress", function (e) {
        if (e.keyCode == 13) // Invio 
        {
            Ajax_xmofn_xMOMPIU_IDDORig_DO_Info();
        }
    });

    $("#pgxMPIU input[name='Cd_AR']").on("keypress", function (e) {
        if (e.keyCode == 13) // Invio 
        {
            Ajax_xmofn_xMOMPIU_AR_Info();
        }
    });

    //$("#pgxMPIU input[name='Quantita']").on("focus", function (e) {
    //    if (!fU.IsEmpty($("#pgxMPIU input[name='Cd_AR']").val()))
    //        Ajax_xmofn_xMOMPIU_AR_Info();

    //});
}


// -------------------------------------------------
// #1.00 REGION: pgxMPIU
// -------------------------------------------------
function Ajax_xmofn_xMOMPIU_Aperte() {

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_xMOMPIU_Aperte",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            $("#" + oPrg.ActivePageId + " .nrpesateaperte").text(fU.IfEmpty(r[0].PesateAperte, 0));
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

function Ajax_xmofn_xMOMPIU_IDDORig_DO_Info() {

    var id = $("#" + oPrg.ActivePageId + " input[name='Id_DORig']").val()
    if ($.isNumeric(id)) {

        Params = JSON.stringify({
            Terminale: oApp.Terminale,
            Cd_Operatore: oApp.Cd_Operatore,
            Id_DORig: id
        });

        $.ajax({
            url: "Logistica.aspx/xmofn_xMOMPIU_IDDORig_DO_Info",
            async: false,
            data: Params,
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (mydata) {
                var dt = $.parseJSON(mydata.d);
                if (dt.length == 1) {
                    if (dt[0].QtaEvadibile > 0)
                        pgxMPIU_Id_DORig_DO_Info_Load(dt);
                    else
                        PopupMsg_Show("Errore", 1, "Quantita Evadibile 0. La riga specificata è stata evasa!");
                } else {
                    PopupMsg_Show("Errore", 1, "L'id riga letto non è valido!");
                    $("#" + oPrg.ActivePageId).find("input").val("");
                    $("#" + oPrg.ActivePageId + " .ardesc").text("");
                    $("#" + oPrg.ActivePageId + " .docinfo").text("");
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
            }
        });
    }
}

function pgxMPIU_Id_DORig_DO_Info_Load(dt) {
    var p = $("#" + oPrg.ActivePageId);
    $(p).find(".docinfo").text(dt[0].Cd_DO + " nr " + dt[0].NumeroDoc + " " + dt[0].Descrizione);
}

function Ajax_xmofn_xMOMPIU_AR_Info() {
    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Cd_AR: $("#" + oPrg.ActivePageId + " input[name='Cd_AR']").val(),
        Id_DORig: $("#" + oPrg.ActivePageId + " input[name='Id_DORig']").val()
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_xMOMPIU_AR_Info",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (!fU.IsEmpty(r)) {
                if (!fU.IsEmpty(r[0].Descrizione))
                    $("#" + oPrg.ActivePageId + " .ardesc").text(r[0].Descrizione);
            }
            else {
                PopupMsg_Show("Errore", 1, "L'articolo specificato non è parte della distinta base dell'articolo indicato nell'Id_DORig letto.");
                $("#" + oPrg.ActivePageId).find("input").val("");
                $("#" + oPrg.ActivePageId + " .ardesc").text("");
                $("#" + oPrg.ActivePageId + " .docinfo").text("");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

function Ajax_xmosp_xMOMPIU_Save() {
    var r = false;

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        TipoIU: $("#" + oPrg.ActivePageId + " select[name='TipoIU']").val(),
        Cd_AR: $("#" + oPrg.ActivePageId + " input[name='Cd_AR']").val(),
        Cd_ARLotto: $("#" + oPrg.ActivePageId + " input[name='Cd_ARLotto']").val(),
        Quantita: fU.ToDecimal($("#" + oPrg.ActivePageId + " input[name='Quantita']").val()),
        Cd_ARMisura: $("#" + oPrg.ActivePageId + " select[name='Cd_ARMisura']").val(),
        Id_DORig: $("#" + oPrg.ActivePageId + " input[name='Id_DORig']").val()
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMOMPIU_Save",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            r = $.parseJSON(mydata.d);
            if (r[0].Result > 0) {
                r = true;
                pgxMPIU_ResetUI();
                Ajax_xmofn_xMOMPIU_Aperte();
            } else {
                PopupMsg_Show("Errore", r[0].Result, r[0].Messaggio);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
    return r;
}

function pgxMPIU_ResetUI() {
    $("#pgxMPIU input").val("");
    $("#pgxMPIU .ardesc, #pgxMPIU .docinfo").text("");
    SetFocus();
}


function Ajax_xmofn_xMOBilancia() {
    
    // Pulisce il select
    $("#pgxMPIU select[name='Cd_xMOBilancia'] .op-bl").remove();

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,        
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_xMOBilancia",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            xMOBilancia_Load(dt);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

function xMOBilancia_Load(dt) {
    if (dt.length > 0) {
        for (var i = 0; i < dt.length; i++) {
            $("#pgxMPIU select[name='Cd_xMOBilancia']").append($('<option>', {
                class: "op-bl",
                PathName: dt[i].PathName,
                value: dt[i].Cd_xMOBilancia,
                text: dt[i].Descrizione
            })).on("select change", function () {
                localStorage.setItem("Cd_xMOBilancia", $("#pgxMPIU select[name='Cd_xMOBilancia']").val());
            });
        }
        // Seleziona la bilancia memorizzata nei cookie
        $("#pgxMPIU select[name='Cd_xMOBilancia']").val(localStorage.getItem("Cd_xMOBilancia"));
    }
}

function Ajax_ReadFile() {
    var r = false;

    Params = JSON.stringify({
        PathName: $("#pgxMPIU select[name='Cd_xMOBilancia'] option:selected").attr("PathName"),
    });

    $.ajax({
        url: "Logistica.aspx/ReadFile",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            $("#pgxMPIU input[name='Quantita']").val(dt[0]);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
    return r;
}

// -------------------------------------------------
// #1.00 ENDREGION: pgxMPIU
// -------------------------------------------------

// -------------------------------------------------
// #1.00 REGION: pgxAREtichette
// -------------------------------------------------
function Ajax_xmosp_xMOAREtichette_AR() {

    $("#pgxAREtichette .tr-aret, #pgxAREtichette .tr-ardesc").remove();

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: oPrg.Id_xMORL_Edit,
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMOAREtichette_AR",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            if (dt.length > 0) {
                xMOAREtichette_AR_Load(dt);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

function xMOAREtichette_AR_Load(dt) {
    $("#pgxAREtichette .msg").hide();
    if (dt.length > 0) {
        var tr = $("#pgxAREtichette .template").clone().removeAttr("style").addClass("tr-aret");
        var tr2 = $("#pgxAREtichette .template_ARDesc").clone().removeAttr("style").addClass("tr-ardesc");
        for (var i = 0; i < dt.length; i++) {
            $("#pgxAREtichette table").append(xMOAREtichette_AR_Template(tr.clone(), dt[i], i));
            $("#pgxAREtichette table").append(ARDesc_Template(tr2.clone(), dt[i].Cd_AR, dt[i].Descrizione));
        }
    }
    else { $("#pgxAREtichette .msg").text('Nessun articolo letto, per tanto non è possibile specificare le etichette da stampare!').show(); }
}

function xMOAREtichette_AR_Template(tr, item, key) {

    tr.attr("Id_xMOAREtichette", fU.IfEmpty(item.Id_xMOAREtichette, ""));

    tr.find(".Cd_AR").text(item.Cd_AR);
    tr.find(".Cd_ARLotto").text(item.Cd_ARLotto);
    tr.find(".Cd_ARMisura").text(item.Cd_ARMisura);
    tr.find(".Quantita").text(item.Quantita);
    tr.find("input[name='Etichette']").val(item.Etichette);

    // Se è il primo input della tabella gli aggiungo la classe per impostarci il focus
    if (key == 0) {
        tr.find("input[name='Etichette']").addClass("first-focus");
    }

    return tr;
}

function Ajax_xmosp_xMOAREtichette_Save() {

    var r = false;

    $("#pgxAREtichette .tr-aret").each(function (idx, tr) {

        Params = JSON.stringify({
            Terminale: oApp.Terminale,
            Cd_Operatore: oApp.Cd_Operatore,
            Cd_AR: $(tr).find(".Cd_AR").text(),
            Cd_ARLotto: $(tr).find(".Cd_ARLotto").text(),
            Etichette: parseInt(fU.IfEmpty($(tr).find("input[name='Etichette']").val(), 0)),
            Id_xMOAREtichette: parseInt(fU.IfEmpty($(tr).attr("Id_xMOAREtichette"), 0)),
            Id_xMORL: oPrg.Id_xMORL_Edit,
        });

        $.ajax({
            url: "Logistica.aspx/xmosp_xMOAREtichette_Save",
            async: false,
            data: Params,
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (mydata) {
                var res = $.parseJSON(mydata.d);
                if (res[0].Result > 0) {
                    $(tr).attr("Id_xMOAREtichette", res[0].Id_xMOAREtichette);
                    r = true;
                } else {
                    PopupMsg_Show("Errore", res[0].Result, res[0].Messaggio);
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
            }
        });

        if (r == false) {
            return;
        }
    })
    return r;
}

// -------------------------------------------------
// #1.00 ENDREGION: pgxAREtichette
// -------------------------------------------------

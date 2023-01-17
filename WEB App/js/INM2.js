// ---------------------------------------------------------------
// pgINM2Aperti
// ---------------------------------------------------------------
function Ajax_xmofn_xMOIN_Aperti_M2() {
    var out = false;

    // Pulisce la lista
    $("#pgINM2Aperti .li-inm2").remove();

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOIN: null
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_xMOIN_Aperti_M2",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            // Ha restituito delle righe
            if (dt.length > 0) {
                xMOIN_Aperti_M2_Load(dt);
            }
            else {
                // Se non ci sono inventari condivisi aperti abilito la pagina di testa disabilito quella
                // degli inventari aperti e faccio il next della page
                oPrg.Pages[oPrg.PageIdx(enumPagine.pgINM2)].Enabled = true;
                oPrg.Pages[oPrg.PageIdx(enumPagine.pgINM2Aperti)].Enabled = false;
                Nav.Next();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
    return out;
}

function xMOIN_Aperti_M2_Load(dt) {
    //Verifico che il dt abbia delle righe
    if (dt.length > 0) {
        var li = $("#pgINM2Aperti .template").clone().removeAttr("style").addClass("li-inm2");
        for (var i = 0; i < dt.length; i++) {
            $("#pgINM2Aperti ul").append(xMOIN_Aperti_M2_Template(li.clone(), dt[i], i));
        }
    }
}

function xMOIN_Aperti_M2_Template(li, item, key) {

    li.attr("id_xmoin", item.Id_xMOIN);
    li.attr("stato", item.Stato);

    li.find(".id").text(item.Id_xMOIN);
    // li.find(".cd_mgesercizio").text(item.Cd_MGEsercizio);
    li.find(".mges_descrizione").text(item.MGES_Descrizione);
    li.find(".cd_mg").text("Magazzino: " + item.Cd_MG);
    li.find(".cd_mgubicazione").text("Ubicazione: " + fU.ToString(item.Cd_MGUbicazione));
    li.find(".dataora").text(fU.DateJsonToTime(item.DataOra).substr(0, 10));

    // Stato da storicizzare
    if (item.Stato == 1) {
        li.find("img[delete]").hide();
        li.find("img.dastoricizzare").show();
        li.removeClass("mo-pointer");
    } else {
        li.find("img[delete]").show();
        li.find("img.dastoricizzare").hide();
    }

    li.on("click", function () {
        INAperti_M2_ClickIt($(this));
    });

    return li;
}

// Esegue il click sul li degli inventari aperti
// ATENZIONE il click sulle icone del li simulano il click del li!
function INAperti_M2_ClickIt(li) {
    switch (li.attr("data-action")) {
        //switch (li.find("img").attr('delete')) {
        case 'true':
            li.attr('data-action', 'false')
            if (fU.ToBool(li.find("img").attr('delete'))) {
                //Ho cliccato su DELETE e devo eseguire l'eliminazione del'IN
                li.find("img").attr('delete', 'false');
                //Apre il popup per la conferma
                $("#Popup_INAperti_M2_Del").attr("id_xmoin", li.attr("id_xmoin")).show();
            }
            if (fU.ToBool(li.find(".detail-op").attr('detail'))) {
                //Ho cliccato su OPERATORI quindi carico l'elenco op che stanno lavorando nell'iventario
                li.find(".detail-op").attr('detail', 'false');
                //Carica l'elenco op e apre il detail
                Ajax_xmofn_xMOIN_Aperti_Operatori_M2(li.attr("id_xmoin"));
            }
            break;
        case 'false':
            if (li.attr("stato") == 1) {
                return false;
            }
            // Disabilito la pagina di testa del prg
            oPrg.Pages[oPrg.PageIdx(enumPagine.pgINM2)].Enabled = false;
            oPrg.Id_xMOINM2_Edit = li.attr("id_xmoin");
            // Carica in drIN la testa dell' inventario selezionato        
            Ajax_xmofn_xMOIN_M2();
            // Abilita l'operatore all'inventario condiviso
            Ajax_xmosp_xMOIN_Op_Save_M2(oPrg.INM2.drIN.Id_xMOIN, oApp.Cd_Operatore, "", "", "", true);
            Nav.Next();
            break;
    }
}

// Restituisce una testa di IN MASSIVO Condiviso
function Ajax_xmofn_xMOIN_M2() {
    var out = false;

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOIN: oPrg.Id_xMOINM2_Edit
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_xMOIN_Aperti_M2",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var row = $.parseJSON(mydata.d);
            // Ha restituito la testa dell IN
            if (row != -1) {
                oPrg.INM2.drIN = row[0];
            }
            else {
                PopupMsg_Show("ATTENZIONE:", 1, "Problemi al caricamento dell'inventario");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
    return out;
}

// Richiama l'ajax per eliminare l'inventario condiviso
function INAperti_M2_DeleteIt(id_xmoin) {
    if (!fU.IsEmpty(id_xmoin)) {
        Ajax_xmosp_xMOIN_Delete_M2(id_xmoin);
    }
    $("#Popup_INAperti_M2_Del").hide();
}

function Ajax_xmosp_xMOIN_Delete_M2(id_xmoin) {

    var out = false;

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOIN: id_xmoin
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMOIN_Delete_M2",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result > 0) {
                if (r[0].Result == 10) {
                    popup_yna.show("Conferma eliminazione.", r[0].Messaggio + ".\nEliminare comunque?", null, 'yn', function () { INM2_xMOIN_OP_Disabled_Delete(id_xmoin); })
                } else {
                    // Refresh della lista degli IN condivisi aperti
                    Ajax_xmofn_xMOIN_Aperti_M2();
                }
                out = true;
            }
            else {
                PopupMsg_Show("ERRORE", r[0].Result, r[0].Messaggio);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}

function pgINM2_UI() {

    // Svuoto la label dell'Id_xMOIN
    $("#pgINM2 .lb-doc-id").text("");
    // Svuoto i campi del MG e UBI
    $("#pgINM2 input[name='Cd_MG']").val("");
    $("#pgINM2 input[name='Cd_MGUbicazione']").val("");

    // Imposto la data 
    $("#pgINM2 input[name='DataOra']").val(fU.DateFormatToBrowserLang(fU.ToDate($.now())));

    // Imposto i check dei campi gestiti per l'inventario
    fU.CheckIf($("#pgINM2 .ck-ubicazione"), oApp.xMOImpostazioni.MovInvUbicazione);
    fU.CheckIf($("#pgINM2 .ck-lotto"), oApp.xMOImpostazioni.MovInvLotto);
    fU.CheckIf($("#pgINM2 .ck-commessa"), oApp.xMOImpostazioni.MovInvCommessa);

    // Visualizzo il campo UBI se gestita
    fU.ShowIf($("#pgINM2 .div-mgubi"), oApp.xMOImpostazioni.MovInvUbicazione);

    // Carico la descrizione se impostata in Arca
    $("#pgINM2 input[name='Descrizione']").val(fU.ToString(oApp.xMOImpostazioni.MovInvDescrizione));

    // Pulisco la variabile globale contenente le info dell'inventario attivo 
    oPrg.INM2.ResetAll(true);
}

// Salva la testa dell'IN MASSIVO CONDIVISO
function Ajax_xmosp_xMOIN_Save_M2() {

    var out = false;

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Descrizione: fU.ToString($("#pgINM2 input[name='Descrizione']").val()),
        Cd_MGEsercizio: fU.ToString($("#pgINM2 select[name='Cd_MGEsercizio']").val()),
        DataOra: fU.DateToSql($("#pgINM2 input[name='DataOra']").val()),
        Cd_MG: fU.ToString($("#pgINM2 input[name='Cd_MG']").val()),
        Cd_MGUbicazione: fU.ToString($("#pgINM2 input[name='Cd_MGUbicazione']").val()),
        Id_xMOIN: fU.ToInt32(oPrg.Id_xMOINM2_Edit)
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMOIN_Save_M2",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result > 0) {
                //Memorizzo l'id in edit
                oPrg.Id_xMOINM2_Edit = r[0].Id_xMOIN;
                //Carica la testa salvata in drIN
                Ajax_xmofn_xMOIN_M2();
                // Visualizzo l'id di testa
                $("#pgIN .lb-doc-id").text(oPrg.Id_xMOINM2_Edit);
                //Rimuovo la pagina di testa IN e attivo l'elenco di Edit IN
                oPrg.Pages[oPrg.PageIdx(enumPagine.pgINM2)].Enabled = false;
                oPrg.Pages[oPrg.PageIdx(enumPagine.pgINM2Aperti)].Enabled = true;
                //Genera l'elenco degli IN aperti
                Ajax_xmofn_xMOIN_Aperti_M2();
                out = true;
            }
            else {
                PopupMsg_Show("ERRORE", r[0].Result, r[0].Messaggio);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}

function Ajax_xmofn_xMOINRig_M2() {
    var out = false;
    $("#pgINM2Rig .tr-inrig").remove();

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        All: !fU.IsChecked($("#pgINM2Rig .ck-inm2rig")), // Se true restituisce tutte le letture dell'iventario se false solo quelle dell operatore corrente
        Id_xMOIN: oPrg.Id_xMOINM2_Edit
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_xMOINRig_M2",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            if (dt.length > 0) {
                xMOINRig_M2_Load(dt);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}

function xMOINRig_M2_Load(dt) {
    //Verifico che il dt abbia delle righe
    if (dt.length > 0) {
        var tr1 = $("#pgINM2Rig .template").clone().removeAttr("style").addClass("tr-inrig");
        var tr2 = $("#pgINM2Rig .template_ARDesc").clone().removeAttr("style").addClass("tr-inrig tr-ardesc");
        for (var i = 0; i < dt.length; i++) {
            $("#pgINM2Rig table").append(pgINM2Rig_Template(tr1.clone(), dt[i], i));
            $("#pgINM2Rig table").append(ARDesc_Template(tr2.clone(), dt[i].Cd_AR, dt[i].Descrizione));
        }
    }
}

function pgINM2Rig_Template(tr, item, key) {

    tr.find(".Cd_AR").text(item.Cd_AR);
    tr.find(".QtaRilevata").text(item.QtaRilevata);
    tr.find(".Cd_ARMisura").text(item.Cd_ARMisura);

    return tr;
}

function INM2_xMOIN_OP_Disabled_Delete(id_xmoin) {
    var r = Ajax_xmosp_xMOIN_Op_Save_M2(id_xmoin);
    if (r) {
        Ajax_xmosp_xMOIN_Delete_M2(id_xmoin);
    }
}

// Disabilita/Abilita gli op per l'inventario o aggiorna l'articolo gestito dall'op
function Ajax_xmosp_xMOIN_Op_Save_M2(id_xmoin, cd_op, cd_ar, cd_mgubicazione, matricola, attivo) {
    var out = false;

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: fU.IfEmpty(cd_op, " "),
        Id_xMOIN: id_xmoin,
        Cd_AR: fU.IfEmpty(cd_ar, ""),
        Cd_MGUbicazione: fU.IfEmpty(cd_mgubicazione, ""),
        Cd_xMOMatricola: fU.IfEmpty(matricola, ""),
        Attivo: fU.IfEmpty(attivo, false),
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMOIN_Op_Save_M2",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result > 0) {
                if (r[0].UltimoOp == 1 && oPrg.ActivePageId == "pgINM2Piede") {
                    var risp = confirm("Non c'è più nessun operatore nell'inventario. Si desidera chiuderlo?");
                    if (risp) {
                        Ajax_xmosp_xMOIN_Close_M2();
                    }
                }
                out = true;
            } else {
                PopupMsg_Show("ERRORE", r[0].Result, r[0].Messaggio);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}


function Ajax_xmofn_xMOIN_Aperti_Operatori_M2(id_xmoin) {

    $("#Detail_INM2_Operatori .li-op").remove();

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOIN: id_xmoin,
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_xMOIN_Aperti_Operatori_M2",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            if (dt.length > 0) {
                // Caricare elenco operatori nel detail e visualizzarlo
                xMOIN_Aperti_Operatori_M2_Load(dt);
                $("#Detail_INM2_Operatori").show();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

function xMOIN_Aperti_Operatori_M2_Load(dt) {
    //Verifico che il dt abbia delle righe
    if (dt.length > 0) {
        var li = $("#Detail_INM2_Operatori .template").clone().removeAttr("style").addClass("li-op");
        for (var i = 0; i < dt.length; i++) {
            $("#Detail_INM2_Operatori ul").append(xMOIN_Aperti_Operatori_M2_Template(li.clone(), dt[i], i));
        }
    }
}

function xMOIN_Aperti_Operatori_M2_Template(li, item, key) {
    li.find(".cdoperatore").text(item.Cd_Operatore);
    li.find(".lbl-attivo").text(item.Attivo == 1 ? "Attivo" : "Disattivo");
    return li;
}

function Confirm_xMOINM2Rig_AR() {
    // Validazione dei campi necessari per validare la lettura
    if (fU.IsEmpty($("#" + oPrg.ActivePageId + " [name='Cd_AR']").val())) {
        PopupMsg_Show("Errore", 1, "Articolo errato o mancante.", $("#" + oPrg.ActivePageId + " [name='Cd_AR']"));
        return false;
    }
    if (fU.IsEmpty($("#" + oPrg.ActivePageId + " [name='QtaRilevata']").val())) {
        PopupMsg_Show("Errore", 1, "Quantità errata o mancante.", $("#" + oPrg.ActivePageId + " [name='Quantita']"));
        return false;
    }
    if (fU.IsEmpty($("#" + oPrg.ActivePageId + " [name='Cd_ARMisura'] :selected").text())) {
        PopupMsg_Show("Errore", 1, "Unità di misura errata.", $("#" + oPrg.ActivePageId + " [name='Cd_ARMisura']"));
        return false;
    }

    Ajax_xmosp_xMOINRig_AR_Save_M2();

}

function Ajax_xmosp_xMOINRig_AR_Save_M2() {

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOIN: oPrg.Id_xMOINM2_Edit,
        Cd_MG: oPrg.INM2.drIN.Cd_MG,
        Cd_MGUbicazione: $("#pgINM2Rig input[name='Cd_MGUbicazione']").val(),
        Cd_AR: $("#pgINM2Rig input[name='Cd_AR']").val(),
        Cd_ARLotto: $("#pgINM2Rig input[name='Cd_ARLotto']").val(),
        Cd_DOSottoCommessa: $("#pgINM2Rig input[name='Cd_DOSottoCommessa']").val(),
        QtaRilevata: parseFloat($("#pgINM2Rig input[name='QtaRilevata']").val().replace(',', '.')),
        Cd_ARMisura: $("#pgINM2Rig select[name='Cd_ARMisura'] :selected").val(),
        Cd_xMOMatricola: $("#pgINM2Rig input[name='Cd_xMOMatricola']").val(),
        ModSum: fU.ToBool($("#pgINM2Rig .mod-somma").hasClass("attiva")),
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMOINRig_AR_Save_M2",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            switch (r[0].Result) {
                case 1:
                    Ajax_xmofn_xMOINRig_M2();
                    pgINM2Rig_Clear();
                    break;
                default:
                    //errore
                    PopupMsg_Show("ERRORE", r[0].Result, r[0].Messaggio);
                    break;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

function pgINM2Rig_Clear() {
    var p = $("#" + oPrg.ActivePageId);
    $(p).find("input[name='Cd_MGUbicazione']").val("");
    $(p).find(".ar-aa").text("");
    $(p).find("input[name='Cd_AR']").val("");
    $(p).find(".AR_Descrizione").text("");
    $(p).find(".GiacContabile").text("");
    $(p).find(".QtaRilevata_O").text("");
    $(p).find(".QtaRilevata_T").text("");
    $(p).find(".GiacMatricola").text("");
    $(p).find("input[name='QtaRilevata']").val("");
    $(p).find("select .op-um").remove();
    $(p).find("input[name='Cd_ARLotto']").val("").attr("disabled", false);
    $(p).find("input[name='Cd_xMOMatricola']").val("").attr("disabled", false);
    $(p).find("input[name='Cd_DOSottoCommessa']").val("").attr("disabled", false);
    SetFocus();
}


// BC codificati in LWA per l'inventario
function Ajax_xmofn_MovIntBarcode() {
    var bc = $("#" + oPrg.ActivePageId).find(".barcode");
    if (!fU.IsEmpty(bc)) {
        //Reset BC 
        $(bc).find("option").remove();
        Params = JSON.stringify({
            Terminale: oApp.Terminale,
            Cd_Operatore: oApp.Cd_Operatore
        });
        $.ajax({
            url: "Logistica.aspx/xmofn_MovIntBarcode",
            async: false,
            data: Params,
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (mydata) {
                var dtBc = $.parseJSON(mydata.d);
                // Carico i BC nella struttura globale
                oPrg.BC = new Barcode(dtBc);
                // Carica i barcode  nel select
                Barcode_Load(bc);
                //Se il combo possiede bc automatizza la gestione
                if ($(bc).find("option").length > 0) {
                    // Codice 
                    Barcode_SelType();
                } else {
                    //Nessun bc definito: rimuove la gestione del bc
                    $("#" + oPrg.ActivePageId).find(".barcode").hide();
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
            }
        });
    }
}

function Ajax_xmosp_xMOIN_Close_M2() {
    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOIN: oPrg.Id_xMOINM2_Edit,
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMOIN_Close_M2",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result < 1) {
                PopupMsg_Show("ERRORE", r[0].Result, r[0].Messaggio);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

function pgINM2Piede_UI() {
    var p = $("#pgINM2Piede");

    p.find(".in-id").text(oPrg.INM2.drIN.Id_xMOIN);
    p.find(".in-data").text(fU.DateJsonToTime(oPrg.INM2.drIN.DataOra).substr(0, 10));
    p.find(".in-desc").text(oPrg.INM2.drIN.Descrizione);
    p.find(".in-mgesercizio").text(oPrg.INM2.drIN.Cd_MGEsercizio);
    p.find(".in-cdmg").text(oPrg.INM2.drIN.Cd_MG);
}

function Ajax_xmofn_xMOIN_AR_Giac_M2() {
    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Cd_MGEsercizio: oPrg.INM2.drIN.Cd_MGEsercizio,
        Cd_MG: $("#pgINM2Rig input[name='Cd_MG']").val(),
        Cd_MGUbicazione: fU.IfEmpty($("#pgINM2Rig input[name='Cd_MGUbicazione']").val(), ""),
        Cd_AR: $("#pgINM2Rig input[name='Cd_AR']").val(),
        Cd_xMOMatricola: fU.IfEmpty($("#pgINM2Rig input[name='Cd_xMOMatricola']").val(), ""),
        Id_xMOIN: oPrg.Id_xMOINM2_Edit,
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_xMOIN_AR_Giac_M2",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            if (dt.length > 0) {
                // Visualizzo le giacenze e le quantità rilevate per l'articolo preso in carico
                $("#pgINM2Rig .AR_Descrizione").text(dt[0].Descrizione);
                $("#pgINM2Rig .GiacContabile").text(dt[0].GiacContabile);
                $("#pgINM2Rig .QtaRilevata_O").text(dt[0].QtaRilevata_O);
                $("#pgINM2Rig .QtaRilevata_T").text(dt[0].QtaRilevata_T);
                fU.ShowIf($("#pgINM2Rig .giacmat"), !fU.IsEmpty(dt[0].GiacMatricola));
                $("#pgINM2Rig .GiacMatricola").text(dt[0].GiacMatricola);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

function Ajax_xmofn_xMOIN_Op_AR_Validate_M2() {
    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOIN: oPrg.Id_xMOINM2_Edit,
        Cd_AR: $("#pgINM2Rig input[name='Cd_AR']").val(),
        Cd_MGUbicazione: fU.IfEmpty($("#pgINM2Rig input[name='Cd_MGUbicazione']").val(), ""),
        Cd_xMOMatricola: fU.IfEmpty($("#pgINM2Rig input[name='Cd_xMOMatricola']").val(), "")
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_xMOIN_Op_AR_Validate_M2",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var Cd_Operatore_A = mydata.d;
            if (!fU.IsEmpty(Cd_Operatore_A)) {
                PopupMsg_Show("ATTENZIONE", 1, "L'articolo selezionato è in carico anche all'operatore " + Cd_Operatore_A);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

function pgINM2Rig_UI() {
    ActivePage().find("input[name='Cd_MG']").val(oPrg.INM2.drIN.Cd_MG);

    // Visualizzo il campo UBI se gestita
    if (oApp.xMOImpostazioni.MovInvUbicazione) {
        ActivePage().find(".div-mgubi").show();
        !fU.IsEmpty(oPrg.INM2.drIN.Cd_MGUbicazione) ? ActivePage().find("input[name='Cd_MGUbicazione']").val(oPrg.INM2.drIN.Cd_MGUbicazione).attr("disabled", true) : ActivePage().find("input[name='Cd_MGUbicazione']").attr("disabled", false);
    } else ActivePage().find(".div-mgubi").hide();

    fU.ShowIf(ActivePage().find(".giacmat"), false);
    fU.ShowIf(ActivePage().find(".div-lotto"), oApp.xMOImpostazioni.MovInvLotto);
    fU.ShowIf(ActivePage().find(".div-com"), oApp.xMOImpostazioni.MovInvCommessa);
    fU.ShowIf(ActivePage().find(".div-mat"), oApp.xMOImpostazioni.MatricolaAbilita);

    ActivePage().find(".mod-somma").attr("src", 'icon/PlusGreen.svg').addClass("attiva");
}


// Fa il toggle dell'attributo src per il bottone che attiva la modalità somma nell'inventario  fnl
function pgINM2Rig_ModSommaToggleSrc(obj) {
    if ($(obj).attr("src") == 'icon/PlusBlack.svg')
        $(obj).attr("src", 'icon/PlusGreen.svg').addClass("attiva");
    else
        $(obj).attr("src", "icon/PlusBlack.svg").removeClass("attiva");
    $("#" + oPrg.ActivePageId + '.focus').focus().select();
}

// Funzione che interpreta il codice SSCC letto e recupera i dati dell'articolo e controlla se la matricola è in carico ad altri OP
function Ajax_Sscc_Validate_INM2(bc_val) {

    var BCRes;

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOIN: fU.ToInt32(oPrg.Id_xMOINM2_Edit),
        Sscc: bc_val,
        Cd_MG: $("#pgINM2Rig input[name='Cd_MG']").val()
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_Sscc_Validate_M2",
        async: oPrg.BC.DetailOn,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            switch (r[0].Result) {
                case -998:
                case -999:
                    // 998 La matricola risulta ubicata in un altro magazzino
                    // 999 La matricola è già stata letta in passato
                    if (confirm(r[0].Messaggio + " Continuare la lettura della matricola? " + "[" + r[0].Result + "]")) {
                        BCRes = r[0];
                    } else {
                        pgINM2Rig_Clear();
                    }
                    break;
                case 1:
                    BCRes = r[0];
                    break;
                default:
                    //errore
                    PopupMsg_Show("ERRORE", r[0].Result, r[0].Messaggio);
                    break;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }

    });

    return BCRes;
}

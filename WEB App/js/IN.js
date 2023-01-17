﻿
// Elenco degli IN MASSIVI aperti
function Ajax_xmofn_xMOIN_Aperti() {
    var out = false;

    // Pulisce la lista
    $("#pgINAperti .li-in").remove();

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOIN: null
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_xMOIN_Aperti",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            // Ha restituito delle righe
            if (dt.length > 0) {
                xMOIN_Aperti_Load(dt);
            }
            else {
                // Se non ci sono inventari aperti abilito la pagina di testa disabilito quella
                // degli inventari aperti e faccio il next della page
                oPrg.Pages[oPrg.PageIdx(enumPagine.pgIN)].Enabled = true;
                oPrg.Pages[oPrg.PageIdx(enumPagine.pgINAperti)].Enabled = false;
                Nav.Next();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
    return out;
}

// Restituisce una testa di IN MASSIVI
function Ajax_xmofn_xMOIN() {
    var out = false;

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOIN: oPrg.Id_xMOIN_Edit
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_xMOIN_Aperti",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var row = $.parseJSON(mydata.d);
            // Ha restituito la testa dell IN
            if (row != -1) {
                oPrg.IN.drIN = row[0];
            }
            else {
                PopupMsg_Show("ATTENZIONE:", "", "Problemi al caricamento dell'inventario");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
    return out;
}

// Carica gli Esercizi di magazzino
function Ajax_xmofn_xMOMGEsercizio(idobj) {
    var out = false;

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        All: 0
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_xMOMGEsercizio",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            // Ha restituito delle righe
            if (dt.length > 0) {
                xMOMGEsercizio_Load(dt, idobj);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
    return out;
}

// Salva la testa dell'IN MASSIVO
function Ajax_xmosp_xMOIN_Save() {

    var out = false;

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Descrizione: fU.ToString($("#pgIN input[name='Descrizione']").val()),
        Cd_MGEsercizio: fU.ToString($("#pgIN select[name='Cd_MGEsercizio']").val()),
        DataOra: fU.DateToSql($("#pgIN input[name='DataOra']").val()),
        Cd_MG: fU.ToString($("#pgIN input[name='Cd_MG']").val()),
        Cd_MGUbicazione: fU.ToString($("#pgIN input[name='Cd_MGUbicazione']").val()),
        Top: (oPrg.IN.Tipo == 'M' ? fU.ToInt32($("#pgIN input[name='Top']").val()) : 1),
        Id_xMOIN: fU.ToInt32(oPrg.Id_xMOIN_Edit)
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMOIN_Save",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result > 0) {
                //Memorizzo l'id in edit
                oPrg.Id_xMOIN_Edit = r[0].Id_xMOIN;
                //Carica la testa salvata in drIN
                Ajax_xmofn_xMOIN();
                // Visualizzo l'id di testa
                $("#pgIN .lb-doc-id").text(oPrg.Id_xMOIN_Edit);
                //Rimuovo la pagina di testa IN e attivo l'elenco di Edit IN
                oPrg.Pages[oPrg.PageIdx(enumPagine.pgIN)].Enabled = false;
                oPrg.Pages[oPrg.PageIdx(enumPagine.pgINAperti)].Enabled = true;
                //Genera l'elenco degli IN aperti
                Ajax_xmofn_xMOIN_Aperti();
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

// Carica le giacenze dell'articolo in fase di inventario filtrando mg, lotto, ubi, commessa
function Ajax_xmofn_xMOGiacenza_IN_SelAr() {

    // Nascondo il messaggio ed elimino le righe della lista
    $("#pgINRig .mo-msg-argiac").hide();
    $("#pgINRig .tr-rig-argiac").remove();
    var out = false;

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Cd_MGEsercizio: oPrg.IN.drIN.Cd_MGEsercizio,
        Cd_MG: oPrg.IN.drIN.Cd_MG,
        Cd_AR: fU.ToString($("#pgINRig .div-detail .div-in-ar-new input[name='Cd_AR']").val()),
        Cd_MGUbicazione: fU.ToString($("#pgINRig .div-detail .div-in-ar-new input[name='Cd_MGUbicazione']").val()),
        Cd_ARLotto: fU.ToString($("#pgINRig .div-detail .div-in-ar-new input[name='Cd_ARLotto']").val()),
        Cd_DOSottoCommessa: fU.ToString($("#pgINRig .div-detail .div-in-ar-new input[name='Cd_DOSottoCommessa']").val()),
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_xMOGiacenza",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            if (dt.length > 0) {
                // Carica in una tabella le giacenze trovate per l'articolo 
                xMOGiacenza_Load(dt);
            }
            else {
                $("#pgINRig .mo-msg-argiac").show();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}

// Inserisce la lista degli AR da inventariare in xMOINRig e carica la lista
function Ajax_xmosp_xMOINRig_AR() {

    var out = false;

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOIN: fU.ToInt32(oPrg.Id_xMOIN_Edit),
        Cd_MGEsercizio: oPrg.IN.drIN.Cd_MGEsercizio,
        Cd_MG: oPrg.IN.drIN.Cd_MG,
        Cd_MGUbicazione: oPrg.IN.drIN.Cd_MGUbicazione
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMOINRig_AR",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result > 0) {
                // Carico l'elenco degli articoli da inventariare
                Ajax_xmofn_xMOINRig_AR();
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

// Elenco articoli da inventariare
// Id_xMOINRig viene passato forzosamente alla funzione solo quando 
// è necessario aggiornare una sola riga del dt
function Ajax_xmofn_xMOINRig_AR(Id_xMOINRig) {

    // svuoto la lista degli articoli
    $("#pgINRig .tbl-arlist .tr-inar").remove();
    $("#pgINRig .mo-msg-no-ar").hide();

    var out = false;

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOIN: fU.ToInt32(oPrg.Id_xMOIN_Edit),
        Cd_MG: oPrg.IN.drIN.Cd_MG,
        Cd_MGUbicazione: oPrg.IN.drIN.Cd_MGUbicazione,
        Id_xMOINRig: (fU.ToInt32(Id_xMOINRig) > 0 ? Id_xMOINRig : null)
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_xMOINRig_AR",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            // Ha restituito una riga, significa che ho aggiunto un ar alla lista
            if (!fU.IsEmpty(oPrg.IN.dtxMOINRig) && dt.length == 1) {
                oPrg.IN.dtxMOINRig.push(dt[0]);
                pgINRig_AR_Load(oPrg.IN.dtxMOINRig);
                out = true;
            }
            // Ha restituito + di 1 riga, significa che ho caricato l elenco di ar
            else if (dt.length > 0) {
                oPrg.IN.dtxMOINRig = dt;
                pgINRig_AR_Load(oPrg.IN.dtxMOINRig);
                out = true;
            }
            else {
                $("#pgINRig .mo-msg-no-ar").show();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
    return out;
}

// Carica la lista degli articoli in pgINRig per IN MASSIVO
function pgINRig_AR_Load(dt) {

    //Verifico che il dt abbia delle righe
    if (dt.length > 0) {
        var tr = $("#pgINRig .tbl-arlist .template").clone().removeClass("template").removeAttr("style").addClass("tr-inar");
        var trdesc = $("#pgINRig .template_ARDesc").clone().removeAttr("style").addClass("tr-inar tr-ardesc");
        for (var i = 0; i < dt.length; i++) {
            $("#pgINRig .tbl-arlist").append(pgINRig_AR_Template(tr.clone(), dt[i], i));
            $("#pgINRig .tbl-arlist").append(ARDesc_Template(trdesc.clone(), dt[i].Cd_AR, dt[i].Descrizione));
        }
    }
}

function pgINRig_AR_Template(tr, item, key) {

    // Assegno alla riga l'id del dt
    tr.attr("idx", key);
    tr.attr("Id_xMOINRig", item.Id_xMOINRig);

    tr.find(".Cd_AR").text(item.Cd_AR);
    tr.find(".Cd_ARLotto").text(item.Cd_ARLotto);
    tr.find(".Cd_MGUbicazione").text(item.Cd_MGUbicazione);
    tr.find(".Cd_DOSottoCommessa").text(item.Cd_DOSottoCommessa);
    tr.find(".Quantita").text(item.Quantita);
    tr.find(".QtaRilevata").text(item.QtaRilevata);
    tr.find(".QtaRettifica").text(item.QtaRettifica);
    tr.find(".Cd_ARMisura").text(item.Cd_ARMisura);

    tr.on("click", function () {
        oPrg.IN.idx = tr.attr("idx");
        //oPrg.IN.AddNew = false;
        Detail_pgINRig_Template_Edit();
    });

    return tr;
}

// Carica il ar cliccato dalla lista nel dettaglio (modalità edit)
function Detail_pgINRig_Template_Edit() {

    ActivePage().find('.icon-Menu').css('display', 'inline-block');

    // Riga dell'id corrente
    var dr = oPrg.IN.dtxMOINRig[oPrg.IN.idx];

    var p = $("#pgINRig .div-in-ar");

    // Nascondo il div-in-ar-new e mostro div-in-ar
    $("#pgINRig .div-in-ar-new").hide();
    $("#pgINRig .div-in-ar").show();

    // Codice articolo
    $("#pgINRig .div-detail input[name='Cd_AR']").val(dr.Cd_AR);
    // Inserisco i valori dell'AR nel detail 
    $(p).find(".Cd_AR").text(dr.Cd_AR);

    var info = "";
    if (dr.Cd_ARLotto) info = info.concat("Lotto: ", dr.Cd_ARLotto, "<br />");
    if (dr.Cd_MGUbicazione) info = info.concat("Ubicazione: ", dr.Cd_MGUbicazione, "<br />");
    if (dr.Cd_DOSottoCommessa) info = info.concat("SottoCommessa: ", dr.Cd_DOSottoCommessa, "<br />");
    $(p).find('.Info').html(info);

    !fU.IsEmpty(dr.Descrizione) ? $(p).find(".Cd_AR").append(' - ' + fU.ToString(dr.Descrizione)) : "";
    $(p).find(".Quantita").text("Giacenza Contabile: " + dr.Quantita);

    $(p).find(".QtaRilevata").text(fU.ToString(dr.QtaRilevata));

    // Mostro la x per la chiusura del div-detail nel caso di IN MASSIVO
    fU.ShowIf($("#pgINRig .icon-closedetail"), oPrg.IN.Tipo == 'M' ? true : false);

    // Mostro i bottoni per il salvataggio nel caso di IN MASSIVO
    fU.ShowIf($("#pgINRig .btn-inm"), oPrg.IN.Tipo == 'M' ? true : false);

    // Mostro i bottoni per il salvataggio nel caso di IN PUNTUALE
    fU.ShowIf($("#pgINRig .btn-inp"), oPrg.IN.Tipo == 'P' ? true : false);

    // Mostro il div per lo slideshow nel caso di IN MASSIVO
    fU.ShowIf($("#pgINRig .div-sequenziale"), oPrg.IN.Tipo == 'M' ? true : false);

    //Carica sempre l'UM
    ARARMisura_Set(dr.Cd_ARMisura);

    switch (oPrg.IN.Tipo) {
        case 'M':
            oPrg.IN.Id_xMOINRig = dr.Id_xMOINRig;
            // Visualizzo il numero della riga corrente rispetto al totale 
            $("#pgINRig .div-detail").find(".NRow").text((oPrg.IN.dtxMOINRig.indexOf(dr) + 1) + "/" + oPrg.IN.dtxMOINRig.length).show();

            SlideShow_Attiva($("#pgINRig .ck-sequenziale"));
            break;
    }

    $("#pgINRig .div-grid").hide();
    $("#pgINRig .div-detail").show();

    $(p).find("input[name='QtaRilevata']").val("");
    $(p).find("input[name='QtaRilevata']").focus().select();
}

// Attiva e disattiva lo scorrimento di AR dal detail
function SlideShow_Attiva(ck) {
    if (fU.IsChecked(ck)) {
        $("#pgINRig .div-detail .btn-slideshow").show();
    } else {
        $("#pgINRig .div-detail .btn-slideshow").hide();
    }

    $("#pgINRig .div-detail input[name='QtaRilevata']").focus();
}

function Detail_pgINRig_GoBack() {
    ActivePage().find('.icon-Menu').css('display', 'none');
    ActivePage().find('.div-in-ar').hide();
    ActivePage().find('.div-in-ar-new').show();
}

// Visualizza il div di inserimento di un AR nell'inventario siam M che P
function Detail_pgINRig_Load() {

    ActivePage().find('.icon-Menu').css('display', 'none');

    oPrg.IN.idx = null;
    var p = $("#pgINRig .div-in-ar-new");

    // Pulisco i campi 
    $(p).find(".lbl").text("");
    // Pulisco la lista delle giacenze
    $(p).find(".tbl-argiac tr.tr-rig-argiac").remove();

    // Attenzione gli input vanno svuotati solo se non disabilitati (ad esempio l'ubicazione potrebbe provenire dalla testa)
    $(p).find("input:enabled").val("");

    // Nascondo il div sequenziale
    $("#pgINRig .div-sequenziale").hide();

    // Mostro la parte del detail per la modalita addnew
    $("#pgINRig .div-in-ar").hide();
    $("#pgINRig .div-in-ar-new").show();

    if (oPrg.IN.Tipo == 'P') {
        // Nascondo la x 
        $("#pgINRig .icon-closedetail").hide();
        // Nascondo il check sequenziale 
        $("#pgINRig .div-sequenziale").hide();
    }

    // Nascondo la section grid
    $('#pgINRig .div-grid').hide();
    // Mostro la section detail
    $('#pgINRig .div-detail').show();
}

// Gestione button in-btn-new per l'aggiunta di un ar e in-ok
function Detail_pgINRig_AR_New() {
    var r = false;
    var m = "";
    switch (oPrg.IN.Tipo) {
        case 'M':
            // Aggiunge se non esiste l'ar alla lista
            r = pgINRig_AR_Add_New();
            if (!r) PopupMsg_Show("Attenzione", "01", "L'articolo selezionato è già presente nella lista");
            break;
        case 'P':
            // Carica la giacenza dell'ar dal server e imposta la riga corrente
            r = Ajax_xmofn_xMOGiacenza_IN();
            break;
    }
    // Se è andato a buon fine, carico il detail in modalità edit
    if (r) Detail_pgINRig_Template_Edit();
}

// Gestione del pulsante ok e degli eventi INVIO nel campo QtaRilevata in  base alle modalità attive
function Detail_pgINRig_AR_Confirm() {
    var q = $("#pgINRig .div-detail input[name='QtaRilevata']");

    if ($.isNumeric(q.val().replace(',', '.'))) {

        // Disattiva il campo per sicurezza
        q.attr("disabled", true);

        var qta = parseFloat(q.val().replace(',', '.'));
        var sumit = $("#pgINRig .mod-somma").hasClass("attiva");
        var qtaril;

        // Somma o aggionra la qta rilevata in base alla mod somma sia sul server che sul client
        qtaril = Detail_pgINRig_AR_Calcola(qta, sumit);

        switch (oPrg.IN.Tipo) {
            case 'M':
                Ajax_xmosp_xMOINRig_AR_Save(qtaril);
                // Summ == false e sequenziale == true --> va al successivo
                if (!sumit && fU.IsChecked($("#pgINRig .div-detail .ck-sequenziale"))) {
                    $("#pgINRig .div-detail .in-next").click();
                }
                // Summ == false e sequenziale == false --> mostro la griglia
                if (!sumit && !fU.IsChecked($("#pgINRig .div-detail .ck-sequenziale"))) {
                    $("#pgINRig .div-detail").hide();
                    $("#pgINRig .div-grid").show();
                }
                break;
        }

        q.attr("disabled", false).focus();
    }
}

// Aggiunge il nuovo AR alla lista degli ar da inventariare 
function pgINRig_AR_Add_New() {
    var r = false;
    // Cerca se l'AR da aggiungere esiste già nel dt
    var idx = Find_AR_InTo_dtxMOINRIg();

    //Se non trovo l'articolo lo aggiungo sul server e lo ricarico nel client
    if (fU.IsEmpty(idx)) {
        // Aggiungo AR in xMOINRig
        r = Ajax_xmosp_xMOINRig_AR_Add();
        if (r) {
            // Dopo aver aggiunto l'elemento recupero l'ultimo idx
            idx = oPrg.IN.dtxMOINRig.length - 1;

            //// Clono il tr template della tabella e append del tr senza ricaricare tutta la lista
            //var tr = $("#pgINRig .template").clone().removeClass("template").removeAttr("style").addClass("tr-inar");
            //$("#pgINRig table").append(pgINRig_AR_Template(tr, oPrg.IN.dtxMOINRig[idx], idx));
        }
    }
    // Memorizzo l'idx della nuova riga se non è vuoto  
    if (!fU.IsEmpty(idx)) { oPrg.IN.idx = idx; }
    return r;
}

// Cerca un AR nel dtxMOINRig
function Find_AR_InTo_dtxMOINRIg() {
    var Cd_AR = fU.ToStringNull($("#pgINRig .div-detail .div-in-ar-new input[name='Cd_AR']").val());
    var Cd_ARLotto = fU.ToStringNull($("#pgINRig .div-detail .div-in-ar-new input[name='Cd_ARLotto']").val());
    var Cd_MGUbicazione = fU.ToStringNull($("#pgINRig .div-detail .div-in-ar-new input[name='Cd_MGUbicazione']").val());
    var Cd_DOSottoCommessa = fU.ToStringNull($("#pgINRig .div-detail .div-in-ar-new input[name='Cd_DOSottoCommessa']").val());

    var ofind = null;

    // Se nel dt è presente la lista di ar da inventariare verifico se l'articolo da aggiungere è già presente nel dt
    if (!fU.IsEmpty(oPrg.IN.dtxMOINRig)) {
        $.grep(oPrg.IN.dtxMOINRig, function (o, idx) {
            if (o.Cd_AR == Cd_AR
                && o.Cd_ARLotto == Cd_ARLotto
                && o.Cd_MGUbicazione == Cd_MGUbicazione
                && o.Cd_DOSottoCommessa == Cd_DOSottoCommessa) {
                ofind = idx;
            }
            return (ofind != null);
        }, false);
    }

    //Se ofind <> null significa che ho trovato una riga di dtxMOINRig valida
    return ofind;
}

// Insert new AR nell'inventario
function Ajax_xmosp_xMOINRig_AR_Add() {
    var out = false;

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOIN: fU.ToInt32(oPrg.Id_xMOIN_Edit),
        Cd_MGEsercizio: oPrg.IN.drIN.Cd_MGEsercizio,
        Cd_MG: oPrg.IN.drIN.Cd_MG,
        Cd_AR: $("#pgINRig .div-detail .div-in-ar-new input[name='Cd_AR']").val(),
        Cd_MGUbicazione: fU.ToString($("#pgINRig .div-detail .div-in-ar-new input[name='Cd_MGUbicazione']").val()),
        Cd_ARLotto: $("#pgINRig .div-detail .div-in-ar-new input[name='Cd_ARLotto']").val(),
        Cd_DOSottoCommessa: $("#pgINRig .div-detail .div-in-ar-new input[name='Cd_DOSottoCommessa']").val()
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMOINRig_AR_Add",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result > 0) {
                // Salvo l'id della riga appena inserita
                oPrg.IN.Id_xMOINRig = r[0].Id_xMOINRig;
                // Carica la riga dal server 
                Ajax_xmofn_xMOINRig_AR(oPrg.IN.Id_xMOINRig);
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

// Imposta la giacenza di un articolo per l'INVENTARIO in oPrg.IN.dtxMOINRig
function Ajax_xmofn_xMOGiacenza_IN() {
    var out = false;

    Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Cd_MGEsercizio: oPrg.IN.drIN.Cd_MGEsercizio,
        Cd_MG: oPrg.IN.drIN.Cd_MG,
        Cd_AR: $("#pgINRig .div-in-ar-new input[name='Cd_AR']").val(),
        /*Cd_MGUbicazione: oPrg.IN.drIN.Cd_MGUbicazione,*/
        Cd_MGUbicazione: $("#pgINRig .div-in-ar-new input[name='Cd_MGUbicazione']").val(),
        Cd_ARLotto: $("#pgINRig .div-in-ar-new input[name='Cd_ARLotto']").val(),
        Cd_DOSottoCommessa: $("#pgINRig .div-in-ar-new input[name='Cd_DOSottoCommessa']").val(),
    };

    $.ajax({
        url: "Logistica.aspx/xmofn_xMOGiacenza_IN",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            if (dt.length > 0) {
                //Inserisce l'articolo nel dt delle righe dell'inventario
                oPrg.IN.dtxMOINRig = dt;
                //Punto alla riga corrente
                oPrg.IN.idx = oPrg.IN.dtxMOINRig.length - 1;
                out = true;
            }
            else {
                PopupMsg_Show("ERRORE", "", "Articolo non trovato");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
    return out;
}

// Calcola e/o Salva la quantita rilevata di un articolo
function Detail_pgINRig_AR_Calcola(qta, sumit) {

    var dr = oPrg.IN.dtxMOINRig[oPrg.IN.idx];

    var fatt = 1;
    fatt = parseFloat($("#pgINRig select[name='Cd_ARMisura'] :selected").attr("UMFatt"));

    //Sommo la quantità rilevata o la riassegno da zero
    qta = (sumit ? dr.QtaRilevata : 0) + (qta * fatt);

    //Assegna la quantità Rilevata al dt
    dr.QtaRilevata = qta;
    dr.QtaRettifica = dr.QtaRilevata - dr.Quantita;

    // Assegna la quantità Rilevata alla tabella in caso di IN MASSIVO
    if (oPrg.IN.Tipo == 'M') {
        var tr = $("#pgINRig .tr-inar[idx='" + oPrg.IN.idx + "']");
        $(tr).find(".QtaRilevata").text(dr.QtaRilevata);
        $(tr).find(".QtaRettifica").text(dr.QtaRettifica);
    }

    //Assegna la quantità Rilevata all'interfaccia'
    $("#pgINRig .div-detail .QtaRilevata").text(dr.QtaRilevata);

    // Reset del campo quantita del detail
    $("#pgINRig .div-detail input[name='QtaRilevata']").val("");

    return dr.QtaRilevata;
}

// Update della quantità rilevata per un AR
function Ajax_xmosp_xMOINRig_AR_Save(qtaril) {
    var out = false;

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOINRig: fU.ToInt32(oPrg.IN.Id_xMOINRig),
        QtaRilevata: qtaril
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMOINRig_AR_Save",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result > 0) {
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

// Salvataggio inventario PUNTUALE
function Ajax_xmosp_xMOIN_MakeOne_MGMov(todo) {

    //Deve essere pieno il campo LABEL QtaRilevata e vuoto il testo QtaRilevata (l'operatore ha effettivamente confermato con invio)
    if (!fU.IsEmpty(oPrg.IN.dtxMOINRig[oPrg.IN.idx].QtaRilevata) && fU.IsEmpty($("#pgINRig input[name='QtaRilevata']").val())) {

        var out = false;

        Params = JSON.stringify({
            Terminale: oApp.Terminale,
            Cd_Operatore: oApp.Cd_Operatore,
            Descrizione: oPrg.IN.drIN.Descrizione,
            Cd_MGEsercizio: oPrg.IN.drIN.Cd_MGEsercizio,
            DataOra: fU.DateToSql($("#pgIN input[name='DataOra']").val()),
            Cd_MG: oPrg.IN.drIN.Cd_MG,
            Cd_MGUbicazione: $("#pgINRig .div-in-ar-new input[name='Cd_MGUbicazione']").val(),//oPrg.IN.drIN.Cd_MGUbicazione,
            Cd_ARLotto: $("#pgINRig .div-in-ar-new input[name='Cd_ARLotto']").val(),
            Cd_DOSottoCommessa: $("#pgINRig .div-in-ar-new input[name='Cd_DOSottoCommessa']").val(),
            Cd_AR: $("#pgINRig .div-in-ar-new input[name='Cd_AR']").val(),
            QtaRilevata: oPrg.IN.dtxMOINRig[oPrg.IN.idx].QtaRilevata
        });

        $.ajax({
            url: "Logistica.aspx/xmosp_xMOIN_MakeOne_MGMov",
            async: false,
            data: Params,
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (mydata) {
                var r = $.parseJSON(mydata.d);
                if (r[0].Result > 0) {
                    // Gestisce la modalità di chiusura scelta al salvataggio (continua, nuovo, chiudi)
                    IN_Modalità_Chiusura(todo);
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
    } else {
        //La quantità potrebbe non essere stata confermata: reimposto il focus sul campo
        $("#pgINRig .div-qtaum").find(".msg").text("Confermare la quantità con invio prima di salvare");
        setTimeout(function () {
            $("#pgINRig .div-qtaum").find(".msg").text("");
        }, 2500);
        $("#pgINRig input[name='QtaRilevata']").focus();
    }
}

// Cicla gli articoli da inventariare (chiamata al click delle frecce) 
function SlideShow(dt, idx, n) {

    var index = n + fU.ToInt32(idx);
    if (index > dt.length - 1) { index = 0; }
    if (index < 0) { index = dt.length - 1; }

    return index;

    //var i;
    //var index = n + fU.ToInt32(oPrg.IN.idx);
    //if (index > oPrg.IN.dtxMOINRig.length - 1) { index = 0; }
    //if (index < 0) { index = oPrg.IN.dtxMOINRig.length - 1; }

    //$("#pgINRig tr[idx='" + index + "']").click();
}

// Elimina un inventario aperto
function Ajax_xmosp_xMOIN_Delete(id_xmoin) {

    var out = false;

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOIN: id_xmoin
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMOIN_Delete",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result > 0) {
                // Refresh della lista degli IN aperti
                Ajax_xmofn_xMOIN_Aperti();
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

// Salva i dati della pagina di testa nel drIN senza passare per il server
function xMOIN_SaveTo_drIN() {
    oPrg.IN.drIN = {
        "Descrizione": $("#pgIN input[name='Descrizione']").val(),
        "Cd_MGEsercizio": $("#pgIN select[name='Cd_MGEsercizio']").val(),
        "Cd_MG": $("#pgIN input[name='Cd_MG']").val(),
        "Cd_MGUbicazione": $("#pgIN input[name='Cd_MGUbicazione']").val(),
    }
    return true;
}

// Gestione della modalità di chiusura scelta nel salvataggio 
function IN_Modalità_Chiusura(todo) {
    switch (todo) {
        case 'CON':     //Continua
            //Reset variabili
            oPrg.IN.ResetAll(false);
            //Va alla pagina xMOINRig
            Nav.GoToPage(PageIdx_For_GoToPage(enumPagine.pgINRig));
            break;
        case 'NEW':     //Nuovo inventario
            //Reset variabili
            oPrg.ResetPages();
            oPrg.IN.ResetAll(true);
            oPrg.Id_xMOIN_Edit = null;
            //Va alla pagina xMOIN
            Nav.GoToPage(PageIdx_For_GoToPage(enumPagine.pgIN));
            break;
        case 'END':     //Fine (go home)
            GoHome();
            break;
    }
}

// Restituisce dall'enumeratore della pagina l'idx corrispondente nel dt delle pagine
// Utile per passare l'idx della pagina alla funzione GoToPage
function PageIdx_For_GoToPage(enumPg) {

    for (var i = 0; i < oPrg.Pages.length; i++) {
        if (oPrg.Pages[i].Value == enumPg)
            return i;
    }
}

// Salvataggio dell'inventario MASSIVO
function Ajax_xmosp_xMOIN_Make_MGMov(btn, todo) {
    var out = false;

    //se il bottone è attivo esege il salvataggio
    if (!$(btn).hasClass("w3-gray")) {

        Params = JSON.stringify({
            Terminale: oApp.Terminale
            , Cd_Operatore: oApp.Cd_Operatore
            , Id_xMOIN: oPrg.Id_xMOIN_Edit
            , INRig_AllOut: false		                // Vero smarca tutte le righe come validate
            , IN_Chiudi: (todo != 'CON' ? true : false)   // Vero chiude la testa dell'inventario
        });

        $.ajax({
            url: "Logistica.aspx/xmosp_xMOIN_Make_MGMov",
            async: false,
            data: Params,
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (mydata) {
                var r = $.parseJSON(mydata.d);
                // Se r = 0: nessuna rettifica ma Ok; se r = 1 Ok
                if (r[0].Result >= 0) {
                    // Gestisce la modalità di chiusura scelta al salvataggio (continua, nuovo, chiudi)
                    IN_Modalità_Chiusura(todo);
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
    }


    return out;

}

// Fa il toggle dell'attributo src per il bottone che attiva la modalità somma nell'inventario  fnl
function ModSommaToggleSrc(obj) {
    if ($(obj).attr("src") == 'icon/PlusBlack.svg') {
        $(obj).attr("src", 'icon/PlusGreen.svg').addClass("attiva");
    }
    else {
        $(obj).attr("src", "icon/PlusBlack.svg").removeClass("attiva");
    }
    $("#" + oPrg.ActivePageId + '.focus').focus().select();
}


// Inserisce i dati della riga selezionata dalla tabella della giacenza dell'ar nei campi input del div-detail 
function pgINRig_RigDataIntoInput(item) {
    var p = $("#pgINRig .div-detail .div-in-ar-new");
    $(p).find("input[name='Cd_DOSottoCommessa']").val(item.Cd_DOSottoCommessa);
    $(p).find("input[name='Cd_ARLotto']").val(item.Cd_ARLotto);
    $(p).find("input[name='Cd_MGUbicazione']").val(item.Cd_MGUbicazione);
}
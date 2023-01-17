function pgRS_Load() {
    // Svuota tutto
    ActivePage().empty();
    // Creo i div iniziali
    ActivePage().append(
        $('<div>', { 'data-key': "Lista" }),
        $('<div>', { 'data-key': "Testa", style: "display: none;" }),
        $('<div>', { 'data-key': "Partenza", style: "display: none;" }),
        $('<div>', { 'data-key': "Arrivo", style: "display: none;" })
    );
    // Recupero i dati
    Ajax_xmofn_xMORS_Get();
    // Render della lista
    pgRS_Render_Lista();
}

/* RENDERING */
function pgRS_Render_Lista() {
    // Pagina
    var divPagina = ActivePage().find('div[data-key="Lista"]');
    // Svuoto la pagina
    divPagina.empty();
    // Rendering
    divPagina.append(
        $('<div>', { class: "mo-intestazione", style: 'margin-bottom: 10px;' }).append($('<label>').text('REINTEGRO SCORTE'))
    );
    var makeCard = function (index) {
        var item = oPrg.RS.items[index];
        var tipo = oPrg.RS.getTipo(item.RSTipo);
        return $('<div>', {
            class: "w3-card template card-sp",
            style: "margin-bottom: 10px; padding: 5px;"
        }).append(
            $('<div>', { id: 'id_mors_' + item.Id_xMORS, class: 'w3-container w-100 mo-pointer' }).append(
                $('<div>', { class: 'w3-bar-item', style: 'float: left;' }).append(
                    $('<span>', { class: 'text-muted d-block text-small' }).text(tipo.toUpperCase()),
                    $('<div>', { class: 'w-100', style: 'margin-bottom: 5px;' }),
                    $('<span>', { class: 'lg-tag w3-tag', style: "margin-right: 5px;" }).text(item.Id_xMORS),
                    $('<span>', { class: 'text-muted' }).text(item.Descrizione),
                    $('<div>', { class: 'w-100', style: 'margin-bottom: 5px;' }),
                    $('<span>', { class: 'text-muted d-block' }).text('Stoccaggio: '.concat(item.Cd_MG_P)),
                    $('<span>', { class: 'text-muted d-block' }).text(''.concat(item.RSTipo == 'A' ? 'Picking: ' : 'Stoccaggio: ', item.Cd_MG_A)),
                    $('<span>', { class: 'text-muted d-block' }).text(item.InCarico ? 'Movimentato da: '.concat(item.InCarico) : ''),
                ),
                $('<button>', { id: 'btnRicaricaDoc', class: "btn-confirm w3-margin-top mo-pointer w3-right" + (item.ArticoliEsclusi ? ' w3-red' : '') }).text('Documenti ' + item.Docs).click(function (event) {
                    if ($(event.target).hasClass("btn-confirm"))
                        pgRS_HandleRicaricaDocs(item.Id_xMORS);
                }),
            )
        ).click(function (event) {
            if (!$(event.target).hasClass("btn-confirm"))
                pgRS_HandleLoadPartenza(item.Id_xMORS, index);
        });
    }

    oPrg.RS.items.forEach(function (item, index) {
        divPagina.append(makeCard(index));
    });
    // Mostro la pagina
    divPagina.show();
}

function pgRS_Render_Testa() {
    var testa = oPrg.RS.items[oPrg.RS.index];
    var divTesta = ActivePage().find('div[data-key="Lista"]');
    divTesta.empty();
    divTesta.append(
        $('<div>', { class: "mo-intestazione" }).append(
            $('<label>').text(testa.Descrizione.concat(' [ID: ', testa.Id_xMORS, ']')),
            $('<span>', { class: 'lg-tag w3-tag w3-green', style: "margin-left: 5px;" }).text(oPrg.RS.Issue ? (oPrg.RS.Issue.items.length > 0 ? oPrg.RS.Issue.items.length : '') : ''),
            $('<img>', {
                class: "detail-letture mo-pointer w3-margin-right w3-right",
                src: "icon/MenuWhite.svg",
                style: "width: 17px;"
            }).click(function () {
                // Ricarica tutto
                pgRS_Load()
            })
        )
    );
    divTesta.show();
}

function pgRS_Render_Partenza() {
    // Elemento di testa
    var testa = oPrg.RS.items[oPrg.RS.index];
    // Elemento della partenza
    var partenza = oPrg.RS.Partenza.items[oPrg.RS.Partenza.index];
    // Pagina
    var divPartenza = ActivePage().find('div[data-key="Partenza"]');
    // Unbind eventi
    divPartenza.find('button').unbind('click');
    // Svuoto la pagina
    divPartenza.empty();
    // Render partenza
    if (partenza) {
        // Colonna con il contatore delle partenze
        // Disponibile sono su 'Trasferimento'
        var colCounter = null;
        if (oPrg.RS.items[oPrg.RS.index].RSTipo == 'T')
            colCounter = $('<div>', { class: "w3-col s4", style: "text-align: right;" }).append(
                $('<h3>', { class: "rs-counter-p" })
                    .text("".concat(oPrg.RS.Partenza.index + 1, "/", oPrg.RS.Partenza.items.length))
                    .click(function () {
                        pgRS_HandleNextPartenza();
                    })
            );

        // Issue corrispondente
        var issue = oPrg.RS.Issue.getItemByAR(partenza.Cd_AR);
        divPartenza.append(
            $('<div>', { class: "mo-intestazione", style: "background-color: #81cb5b;" }).append(
                $('<label>').html(''.concat('PARTENZA (ID: ', partenza.Id_xMORS_P, ')')),
                $('<label>', { class: "mo-pointer lg-fontred lg-underline text-small w3-right" }).text('Escludi')
                    .click(function () {
                        if (confirm("Sei sicuro di voler procedere con l'esclusione?"))
                            pgRS_HandleEscludiPartenza();
                    }),
            ),
            $('<div>', { class: "w3-row" }).append(
                $('<div>', { class: "w3-col s8" }).append(
                    $('<label>', { class: "lg-lbl-da d-block" }).html('MAGAZZINO: '.concat('<b>', partenza.Cd_MG_P, '</b>')),
                    $('<label>', { class: "lg-lbl-da d-block" }).html('ARTICOLO: '.concat('<b>', partenza.Cd_AR, '</b>', ' - ', partenza.AR_Descrizione)),
                    $('<label>', { class: "lg-lbl-da d-block", style: !partenza.Cd_ARLotto ? 'display: none' : '' }).html('LOTTO: '.concat('<b>', partenza.Cd_ARLotto, '</b>')),
                    $('<label>', { class: "lg-lbl-da d-block", style: !partenza.Cd_DOSottoCommessa ? 'display: none' : '' }).html('SOTTOCOMMESSA: '.concat('<b>', partenza.Cd_DOSottoCommessa, '</b>')),
                    $('<label>', { class: "lg-lbl-da d-block" }).html('QTA: '.concat('<b>', partenza.Quantita, ' / ', issue.P_Qta4A, ' ', partenza.Cd_ARMisura, '</b>')),
                    $('<label>', { class: "lg-lbl-da d-block" }).html('<b>'.concat(issue.Righe, '</b>', ' DOC DA EVAD: ', '<b', (issue.QtaEvadibile > issue.P_Qta4A ? ' style="color: red;"' : ''), '>', issue.QtaEvadibile, ' ', issue.Cd_ARMisura, '</b>'))
                ),
                colCounter
            ),
        );
        // Inputs
        var divPartenzaInput = $('<div>', { style: "text-align: center;" }).append(
            $('<div>', { 'data-key': "Ubicazione", style: "margin: 20px 0px;" }).append(
                //$('<label>', { class: "lg-lbl-da" }).text('UBICAZIONE '),
                $('<label>', { class: "mo-pointer lg-fontblue", style: "margin-left: 5px; font-weight: bold; font-size: 20px;" })
                    .text(partenza.Cd_MGUbicazione_P_T)
                    .click(function () {
                        divPartenza.find('input[name="Cd_MGUbicazione_P"]').val(partenza.Cd_MGUbicazione_P_T).change().focus().select();
                    }),
                $('<input>', {
                    type: 'text',
                    name: 'Cd_MGUbicazione_P',
                    class: "keypressexec first-focus lg-input d-block mx-auto",
                    style: "width: 60%;"
                }).val(partenza.Cd_MGUbicazione_P)
                    .change(function (event) { partenza.Cd_MGUbicazione_P = event.target.value; })
                    .keydown(function (event) {
                        if (event.key == 'Enter') pgRS_HandleConfermaPartenza();
                    }),
            ),
            $('<button>', { class: "btn-confirm lg-rlrigconfirm w3-margin-bottom mx-auto", 'data-key': 'Conferma' }).text('Conferma').click(function () {
                pgRS_HandleConfermaPartenza();
            }),
            $('<button>', { class: "btn-confirm lg-rlrigconfirm w3-margin-bottom mx-auto", style: "display: none;", 'data-key': 'Nuovo' }).text('Nuovo').click(function () {
                pgRS_HandleNuovaPartenza();
            }),
            $('<button>', {
                class: "btn-confirm lg-rlrigconfirm w3-margin-bottom mx-auto",
                style: oPrg.RS.items[oPrg.RS.index].RSTipo == 'T' && oPrg.RS.Partenza.daConfermare().length == 0 ? "display: block;" : "display: none;"
            })
            .html('Arrivo<i class="fas fa-arrow-right" style="margin-left: 10px;"></i>')
            .click(function () {
                // Nascondo la partenza
                ActivePage().find('div[data-key="Partenza"]').hide();
                // Render della pagina di arrivo
                pgRS_Render_Arrivo();
            }),
        );
        // Append input
        divPartenza.append(divPartenzaInput);
    } else {
        divPartenza.append(
            $('<label>', { class: "lg-lbl-da d-block", style: "margin-top: 10px;" }).text("Nessun ".concat(testa.RSTipo == 'A' ? 'abbassamento' : 'trasferimento', " necessario"))
        );
    }
    // Mostro la pagina
    divPartenza.show();
    // Focus
    divPartenza.find('.first-focus').focus().select();
}

function pgRS_Render_Arrivo() {
    // Elemento di arrivo
    var partenza = oPrg.RS.Partenza.items[oPrg.RS.Partenza.index];
    oPrg.RS.Arrivo.itemsOfP = oPrg.RS.items[oPrg.RS.index].RSTipo == 'T'
        ? oPrg.RS.Arrivo.items
        : oPrg.RS.Arrivo.items.filter(function (item) {
            return item.Id_xMORS_P == partenza.Id_xMORS_P
        });
    if (oPrg.RS.Arrivo.index == null) oPrg.RS.Arrivo.index = 0;
    var arrivo = oPrg.RS.Arrivo.itemsOfP[oPrg.RS.Arrivo.index];
    var issue = oPrg.RS.Issue.getItemByAR(partenza.Cd_AR);
    // Pagina
    var divArrivo = ActivePage().find('div[data-key="Arrivo"]');
    // Unbind eventi
    divArrivo.find('button').unbind('click');
    // Svuoto la pagina
    divArrivo.empty();
    if (arrivo) {
        // Render elementi
        divArrivo.append(
            $('<div>', { class: "mo-intestazione", style: "background-color: #8b5bcb;" }).append(
                $('<label>').text(''.concat('ARRIVO (ID: ', arrivo.Id_xMORS_A, ')'))
            ),
            $('<div>', { class: "w3-row" }).append(
                $('<div>', { class: "w3-col s8" }).append(
                    $('<label>', { class: "lg-lbl-da d-block" }).html('MAGAZZINO: '.concat('<b>', arrivo.Cd_MG_A, '</b>')),
                    $('<label>', { class: "lg-lbl-da d-block" }).html('ARTICOLO: '.concat('<b>', arrivo.Cd_AR, '</b>', ' - ', arrivo.AR_Descrizione)),
                    $('<label>', { class: "lg-lbl-da d-block", style: !arrivo.Cd_ARLotto ? 'display: none' : '' }).html('LOTTO: '.concat('<b>', arrivo.Cd_ARLotto, '</b>')),
                    $('<label>', { class: "lg-lbl-da d-block", style: !arrivo.Cd_DOSottoCommessa ? 'display: none' : '' }).html('SOTTOCOMMESSA: ', '<b>', arrivo.Cd_DOSottoCommessa, '</b>'),
                    $('<label>', { class: "lg-lbl-da d-block" }).html('QUANTITA: '.concat('<b>', arrivo.Quantita, ' / ', issue.P_Qta4A, ' ', arrivo.Cd_ARMisura, '</b>')),
                    $('<label>', { class: "lg-lbl-da d-block" }).html(''.concat(issue.Righe, ' DOC DA EVAD: ', '<b', (issue.QtaEvadibile > issue.P_Qta4A ? ' style="color: red;"' : ''), '>', issue.QtaEvadibile, ' ', issue.Cd_ARMisura, '</b>'))
                ),
                $('<div>', { class: "w3-col s4", style: "text-align: right;" }).append(
                    $('<h3>', { class: "rs-counter-a" })
                        .text("".concat(oPrg.RS.Arrivo.index + 1, '/', oPrg.RS.Arrivo.itemsOfP.length))
                        .click(function () {
                            pgRS_HandleNextArrivo();
                        })
                )
            ),
        );
        var divArrivoInput = $('<div>', { style: "text-align: center;" }).append(
            $('<div>', { 'data-key': "Ubicazione", style: "margin: 20px 0px;" }).append(
                //$('<label>', { class: "lg-lbl-da" }).text('UBICAZIONE'),
                $('<label>', { class: "mo-pointer lg-fontblue", style: "margin-left: 5px; font-weight: bold; font-size: 20px;" })
                    .text(arrivo.Cd_MGUbicazione_A_T)
                    .click(function () {
                        divArrivo.find('input[name="Cd_MGUbicazione_A"]').val(arrivo.Cd_MGUbicazione_A_T).change().focus().select();
                    }),
                $('<input>', {
                    type: 'text',
                    name: 'Cd_MGUbicazione_A',
                    class: "keypressexec first-focus lg-input d-block mx-auto",
                    style: "width: 60%;"
                }).val(arrivo.Cd_MGUbicazione_A)
                    .change(function (event) {
                        oPrg.RS.Arrivo.items[oPrg.RS.Arrivo.items.indexOf(arrivo)].Cd_MGUbicazione_A = event.target.value;
                    })
                    .keydown(function (event) {
                        if (event.key == 'Enter') pgRS_HandleConfermaArrivo();
                    }),
            ),
            $('<button>', { class: "btn-confirm lg-rlrigconfirm w3-margin-bottom mx-auto" }).text('Conferma').click(function () {
                pgRS_HandleConfermaArrivo()
            }),
            $('<label>', { class: "mo-pointer lg-fontblue lg-underline text-small d-block" }).text('< Indietro')
                .click(function () { pgRS_HandleAnnullaArrivo(); })
        );
        // Append input
        divArrivo.append(divArrivoInput);
        // Mostro la pagina
    } else {
        divArrivo.append(
            $('<label>', { class: "lg-lbl-da d-block", style: "margin-top: 10px;" }).text("ANOMALIA Partenza senza arrivo!!")
        );
    }
    divArrivo.show();
    // Focus
    divArrivo.find('.first-focus').focus().select();
}

/* EVENTI */
function pgRS_HandleLoadPartenza(Id_xMORS, index) {
    // Aggiorno l'indice
    oPrg.RS.index = index;

    // Memorizzo il record di testa
    var testa = oPrg.RS.items[oPrg.RS.index];

    // Recupero le liste di Partenza e Arrivo
    Ajax_xmofn_xMORS_P_Get();
    Ajax_xmofn_xMORS_A_Get();

    // Funzione di rendering
    var renderPagina = function () {
        ActivePage().find('div[data-key="Lista"]').hide();
        pgRS_Render_Testa();
        pgRS_Render_Partenza();
    }

    // Se non ci sono record di partenza
    // Chiamo la funzione di abbassamento/trasferimento
    // Altrimenti effettuo il render
    if (oPrg.RS.Partenza.items.length == 0) {
        if (testa.RSTipo == 'A')
            Ajax_xmosp_xMORS_Abbassa(function () { renderPagina(); });
        else
            Ajax_xmosp_xMORS_Trasferisci(function () { renderPagina(); });
    }
    else Ajax_xmofn_xMORS_AR(function () { renderPagina(); });
}

function pgRS_HandleRicaricaDocs(Id_xMORS) {
    ActivePage().find("#id_mors_" + Id_xMORS).find("#btnRicaricaDoc").text("Ricarico...");
    setTimeout(function () {
        var nDocs = 0;
        nDocs = Ajax_xmosp_xMORS_DoTess_Save(Id_xMORS);
        ActivePage().find("#id_mors_" + Id_xMORS).find("#btnRicaricaDoc").text("Documenti " + nDocs).removeClass("w3-red");
    }, 250);
}

function pgRS_HandleEscludiPartenza() {
    // Escludo la partenza
    Ajax_xmosp_xMORS_P_Save(true);

    // Abbassamento
    if (oPrg.RS.items[oPrg.RS.index].RSTipo == 'A') {
        Ajax_xmosp_xMORS_Abbassa(function () {
            pgRS_Render_Testa();
            pgRS_Render_Partenza();
        });
    }
    // Trasferimento
    else {
        // Recupero gli array di Partenza e Arrivo
        Ajax_xmofn_xMORS_P_Get();
        Ajax_xmofn_xMORS_A_Get();
        // Aggiorno l'indice
        oPrg.RS.Partenza.index = oPrg.RS.Partenza.items.length - 1;
        // Rendering
        pgRS_Render_Testa();
        pgRS_Render_Partenza();
    }
}

function pgRS_HandleConfermaPartenza() {
    // Verifico la presenza dell'ubicazione
    if (fU.IsEmpty(oPrg.RS.Partenza.items[oPrg.RS.Partenza.index].Cd_MGUbicazione_P)) {
        PopupMsg_Show("Ubicazione mancante", null, "Per procedere devi impostare un'ubicazione");
        return;
    }

    // Effettuo il salvataggio
    Ajax_xmosp_xMORS_P_Save(false);

    // Abbassamento
    if (oPrg.RS.items[oPrg.RS.index].RSTipo == 'A') {
        // Nascondo la partenza
        ActivePage().find('div[data-key="Partenza"]').hide();
        // Render della pagina di arrivo
        pgRS_Render_Arrivo();
    }
    // Trasferimento
    else {
        // Render della pagina di arrivo
        pgRS_Render_Partenza();
        // Switch dei bottoni Conferma/Nuovo
        ActivePage().find('[data-key="Partenza"] .btn-confirm[data-key="Conferma"]').hide();
        ActivePage().find('[data-key="Partenza"] .btn-confirm[data-key="Nuovo"]').show();
    }
}

function pgRS_HandleNuovaPartenza() {
    // Verifico se la partenza corrente è 'Confermata'
    if (!oPrg.RS.Partenza.items[oPrg.RS.Partenza.index].Cd_MGUbicazione_P) {
        PopupMsg_Show("Ubicazione mancante", null, "Per procedere devi impostare confermare la partenza corrente");
        return;
    }

    // Genero una nuova 'Partenza'
    var oldPartenzaLength = oPrg.RS.Partenza.items.length;
    Ajax_xmosp_xMORS_Trasferisci(function () {
        if (oPrg.RS.Partenza.items.length > oldPartenzaLength) {
            oPrg.RS.Partenza.index = oPrg.RS.Partenza.items.length - 1;
            pgRS_Render_Testa();
            pgRS_Render_Partenza();
            // Switch dei bottoni Conferma/Nuovo
            ActivePage().find('[data-key="Partenza"] .btn-confirm[data-key="Nuovo"]').hide();
            ActivePage().find('[data-key="Partenza"] .btn-confirm[data-key="Conferma"]').show();
        } else {
            PopupMsg_Show("Info", null, "Nessun trasferimento necessario");
            return;
        }
    });
}

function pgRS_HandleNextPartenza() {
    if (oPrg.RS.Partenza.index < oPrg.RS.Partenza.items.length - 1)
        oPrg.RS.Partenza.index++;
    else
        oPrg.RS.Partenza.index = 0;

    pgRS_Render_Partenza();
}

function pgRS_HandleNextArrivo() {
    if (oPrg.RS.Arrivo.index < oPrg.RS.Arrivo.itemsOfP.length - 1)
        oPrg.RS.Arrivo.index++;
    else
        oPrg.RS.Arrivo.index = 0;

    pgRS_Render_Arrivo();
}

function pgRS_HandleConfermaArrivo() {
    // Verifico la presenza dell'ubicazione
    if (fU.IsEmpty(oPrg.RS.Arrivo.itemsOfP[oPrg.RS.Arrivo.index].Cd_MGUbicazione_A)) {
        PopupMsg_Show("Ubicazione mancante", null, "Per procedere devi impostare un'ubicazione");
        return;
    }

    // Confermo l'arrivo
    Ajax_xmosp_xMORS_A_Save(function () {
        // Torno alla partenza
        if (oPrg.RS.Arrivo.index == oPrg.RS.Arrivo.itemsOfP.length - 1) {
            Ajax_xmosp_xMORS_Abbassa(function () {
                ActivePage().find('div[data-key="Arrivo"]').hide();
                pgRS_Render_Partenza();
            });
        } else {
            // Vado al prossimo arrivo
            oPrg.RS.Arrivo.index++;
            pgRS_Render_Arrivo();
        }
    });
}

function pgRS_HandleAnnullaArrivo() {
    ActivePage().find('div[data-key="Arrivo"]').hide();
    pgRS_Render_Partenza();
}

/* CHIAMATE AJAX */
function Ajax_xmofn_xMORS_Get() {
    var Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
    };
    $.ajax({
        url: "Logistica.aspx/xmofn_xMORS_Get",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var data = $.parseJSON(mydata.d);
            oPrg.RS.items = data == '' ? [] : data;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

function Ajax_xmofn_xMORS_P_Get() {
    var testa = oPrg.RS.items[oPrg.RS.index];
    var Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORS: testa.Id_xMORS
    };
    $.ajax({
        url: "Logistica.aspx/xmofn_xMORS_P_Get",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var data = $.parseJSON(mydata.d);
            oPrg.RS.Partenza.items = !fU.IsEmpty(data) && data instanceof Array ? data : [];
            oPrg.RS.Partenza.index = oPrg.RS.Partenza.items.length > 0 ? 0 : null;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

function Ajax_xmofn_xMORS_A_Get() {
    var testa = oPrg.RS.items[oPrg.RS.index];
    var Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORS: testa.Id_xMORS
    };
    $.ajax({
        url: "Logistica.aspx/xmofn_xMORS_A_Get",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var data = $.parseJSON(mydata.d);
            oPrg.RS.Arrivo.items = !fU.IsEmpty(data) && data instanceof Array ? data : [];
            oPrg.RS.Arrivo.index = null;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

function Ajax_xmosp_xMORS_Abbassa(callback) {
    $('div.preloader').show();

    var testa = oPrg.RS.items[oPrg.RS.index];
    var Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORS: testa.Id_xMORS,
        Cd_MG_da: null,
        Cd_MGUbicazione_da: null,
        Cd_AR_F: null
    };

    $.ajax({
        url: "Logistica.aspx/xmosp_xMORS_Abbassa",
        async: true,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var data = $.parseJSON(mydata.d);
            oPrg.RS.Issue.items = data == '' ? [] : data;

            Ajax_xmofn_xMORS_P_Get();
            Ajax_xmofn_xMORS_A_Get();

            if (callback) callback();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        },
        complete: function () {
            $('div.preloader').hide();
        }
    });
}

function Ajax_xmosp_xMORS_Trasferisci(callback) {
    $('div.preloader').show();

    var testa = oPrg.RS.items[oPrg.RS.index];
    var Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORS: testa.Id_xMORS,
        Cd_MG_da: null,
        Cd_MGUbicazione_da: null,
        Cd_AR_F: null
    };

    $.ajax({
        url: "Logistica.aspx/xmosp_xMORS_Trasferisci",
        async: true,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var data = $.parseJSON(mydata.d);
            oPrg.RS.Issue.items = data == '' ? [] : data;

            Ajax_xmofn_xMORS_P_Get();
            Ajax_xmofn_xMORS_A_Get();
            if (callback) callback();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        },
        complete: function () {
            $('div.preloader').hide();
        }
    });
}

function Ajax_xmofn_xMORS_AR(callback) {
    $('div.preloader').show();

    var testa = oPrg.RS.items[oPrg.RS.index];
    var Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORS: testa.Id_xMORS,
        Cd_AR_F: null
    };

    $.ajax({
        url: "Logistica.aspx/xmofn_xMORS_AR",
        async: true,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var data = $.parseJSON(mydata.d);
            oPrg.RS.Issue.items = data == '' ? [] : data;
            if (callback) callback();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        },
        complete: function () {
            $('div.preloader').hide();
        }
    });
}


function Ajax_xmosp_xMORS_DoTess_Save(Id_xMORS, callback) {
    var out = 0;

    var Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORS: Id_xMORS,
        CaricaOrdini: true
    };
    $.ajax({
        url: "Logistica.aspx/xmosp_xMORS_DoTess_Save",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var data = $.parseJSON(mydata.d)[0];
            if (data.Result >= 0) {
                out = data.Result;
                if (callback) callback();
            } else PopupMsg_Show("ERRORE", data.Result, data.Messaggio);
            if (callback) callback();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    }
    );
    return out;
}

function Ajax_xmosp_xMORS_P_Save(escluso) {
    var partenza = oPrg.RS.Partenza.items[oPrg.RS.Partenza.index];
    var Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORS: partenza.Id_xMORS,
        Id_xMORS_P: partenza.Id_xMORS_P,
        Cd_MGUbicazione_P: partenza.Cd_MGUbicazione_P,
        Escluso: escluso
    };
    $.ajax({
        url: "Logistica.aspx/xmosp_xMORS_P_Save",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var data = $.parseJSON(mydata.d)[0];
            if (data.Result != 1)
                PopupMsg_Show("ERRORE", data.Result, data.Messaggio);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

function Ajax_xmosp_xMORS_A_Save(callback) {
    var arrivo = oPrg.RS.Arrivo.itemsOfP[oPrg.RS.Arrivo.index];
    var Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORS: arrivo.Id_xMORS,
        Id_xMORS_P: arrivo.Id_xMORS_P,
        Id_xMORS_A: arrivo.Id_xMORS_A,
        Cd_MGUbicazione_A: arrivo.Cd_MGUbicazione_A
    };
    $.ajax({
        url: "Logistica.aspx/xmosp_xMORS_A_Save",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var data = $.parseJSON(mydata.d)[0];
            if (data.Result > 0) {
                if (callback) callback();
            } else
                PopupMsg_Show("ERRORE", data.Result, data.Messaggio);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}
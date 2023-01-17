var issue = {
    "data": {
        "Result": null,
        "Messaggio": null,
        "Id_xMORLRig_T": null,
        "Cd_AR": null,
        "AR_Descrizione": null,
        "Cd_ARAlias": null,
        "Cd_ARLotto": null,
        "Quantita": null,
        "QtaEvadibile": null,
        "QtaResidua": null,
        "QtaLetta": null,
        "Cd_ARMisura": null,
        "QtaLabel": null,           // contiene l'etichetta per la quantità se l'unità di misura è presa dall'alias
        "Cd_xMOMatricola": null,
        "Cd_MG": null,
        "Cd_MGUbicazione": null,
        "ARLotti": null,
    },
    "resetData": function () {
        Object.keys(this.data).forEach(function (key) {
            issue.data[key] = null;
        });
    },
    "ciclo": null,
    "start": function () {
        //Chiude sempre il div DoveSei
        DivToggle_Execute(ActivePage().find(".div-dove-sei"), false);
        // Memorizza l'avvio delle issue
        oPrg.RL.issueOn = true;
        oPrg.RL.issueId = 0;
        //se il ciclo è diverso da quello precedente resetta le variabili
        if (this.ciclo !== oPrg.drDO.xMOIssueTipo.substring(0, 2).toLowerCase())
            this.resetData();
        //memorizza il ciclo
        this.ciclo = oPrg.drDO.xMOIssueTipo.substring(0, 2).toLowerCase();
        //Avvia la richiesta
        switch (this.ciclo) {
            case 'cp':
                // carica i dati della pagina: la prima richiesta è quale articolo si vuole stoccare
                issue.cp.loadUI()
                break;
            case 'ad':
                Ajax_xMORLRig_T_ad_Issue();
                break;
            case 'ca':
                // esegue subito la richiesta di issue disponibile
                Ajax_xMORLRig_T_ca_Issue(function () { issue.ca.getSingle() });
                break;
        }
    },
    "restart": function () {
        if (confirm("Inizializzare nuovamente le proposte includendo nuovamente quelle ignorate?"))
            Ajax_xMORLRig_T_restart();
    },
    "close": function () {
        // Si chiude
        this.toggle()
        // Stop issue
        this.resetData();
        // Pulisco i dati
        this.ciclo = null;
        oPrg.RL.issueOn = false;
    },
    "toggle": function () {
        var popup = $('#Popup_Issue_' + this.ciclo);
        var isOpen = popup.css('display') === 'block';
        if (!isOpen) popup.show();
        else popup.hide();
        return;
    },
    "cp": {
        "roll": [],   // Contiene la lista del roll definiti per il percorso
        "roll_Idx": 0,
        "clear": function () {
            issue.resetData();
            this.clearLabels();
            this.roll_Idx = 0;
            this.bcRoll();
        },
        "clearLabels": function () {
            var popup = $('#Popup_Issue_cp');
            // Pulisco i valori sul DOM
            Object.keys(issue.data).forEach(function (key) {
                var el = popup.find('[data-key="' + key + '"]');
                if (el.length > 0) el.text("");
            });
        },
        "loadUI": function () {
            // Variabili
            var popup = $('#Popup_Issue_cp');
            var bcInput = popup.find('input[name="BC"]');

            // Unbinding eventi ubicazione
            bcInput.unbind('change');
            bcInput.unbind('keydown');

            // Titolo
            popup.find(".lg-popuptitle").text("Vai a ubicazione (" + oPrg.drDO.xMOIssueTipo + ")");

            // Eventi
            bcInput.keydown(function (event) {
                if (event.key === 'Enter') issue.cp.bcValidate();
            });

            // Gestisce la packing
            fU.ShowIf(popup.find('div.PackListRef'), oPrg.drDO.PkLstEnabled);
            if (oPrg.drDO.PkLstEnabled)
                popup.find('label[data-key="PackListRef"]').text(ActivePage().find("select[name='PackListRef']").val());

            // Mostro il Popup
            issue.toggle();

            // Avvia il roll
            switch (oApp.LicF_Id) {
                case 33076: // MD
                case 33284: // BEPER
                    this.roll = ["Cd_AR", "Cd_ARLotto", "Cd_MGUbicazione"];
                    break;
                default:
                    this.roll = ["Cd_AR", "Cd_ARLotto", "Quantita", "Cd_MGUbicazione"];
                    break;
            }
            this.roll_Idx = 0;

            // Pulisce il DOM
            this.clearLabels();

            // Devo leggere ancora qualcosa? se non ho completato la quatità residua sì 
            // mi sposto sul lotto o sulla quantità 
            if (issue.data.Result && issue.data.QtaResidua - issue.data.Quantita > 0) {
                issue.data.Quantita = null;
                popup.find('[data-key="Quantita"]').text('');
                if (issue.data.Cd_ARLotto) {
                    issue.data.Cd_ARLotto = null;
                    popup.find('[data-key="Cd_ARLotto"]').text('');
                    this.roll_Idx = this.roll.indexOf('Cd_ARLotto');
                } else
                    this.roll_Idx = this.roll.indexOf('Quantita');
                // Mostra i valori a video passando per l'alias o l'articolo
                this.arUI(issue.data.Cd_ARAlias ? issue.data.Cd_ARAlias : issue.data.Cd_AR);
            } else
                issue.resetData(); // Cancella tutti i dati

            //Avvia il Roll
            this.bcRoll();
        },
        "arUI": function (Cd_AR) {
            var r = false;
            var popup = $('#Popup_Issue_cp');
            //Verifica se esiste l'articolo nei prelievi
            var ar;
            //Variabile di ricerca AAA
            var item = { Cd_AR: Cd_AR, Descrizione: "", Cd_ARMisura: "", FattoreToUM1: 1 };
            ar = oPrg.RL.dtRLRig_AR.find(function (ele) {
                return item.Cd_AR.trim().toLowerCase() === ele.Cd_AR.trim().toLowerCase()
            });
            if (!ar) {
                // Articolo non trovato nei prelievi: recupera il Cd_AR 
                // dall'eventuale alias o codice alternativo passato alla funzione
                item = Ajax_xmofn_Get_AR_From_AAA_Easyway(item.Cd_AR, $("#pgRL input[name='Cd_CF']").val());
                ar = oPrg.RL.dtRLRig_AR.find(function (ele) {
                    return item.Cd_AR.trim().toLowerCase() === ele.Cd_AR.trim().toLowerCase()
                });
                // Memorizzo l'ALIAS
                if (ar)
                    issue.data.Cd_ARAlias = Cd_AR;
            }
            if (ar) {
                // Verifica l'um e il fattore di conversione se abbiamo letto un alias
                if (item.Cd_ARMisura !== "" && item.Cd_ARMisura.trim().toLowerCase() !== ar.Cd_ARMisura.trim().toLowerCase()) {
                    //Converte la quantità proposta in quella dell'um letta che proviene da AAA
                    //Memorizza l'etichetta della quantità
                    issue.data.Quantita = item.FattoreToUM1;
                    issue.data.QtaLabel = '<span class="w3-xsmall">&nbsp;(1 ' + item.Cd_ARMisura.trim() + ' = ' + item.FattoreToUM1 + ' ' + ar.Cd_ARMisura + ')</span>';
                }
                issue.data.Cd_AR = ar.Cd_AR;
                issue.data.Cd_ARMisura = ar.Cd_ARMisura;
                // Scrivo i valori sul DOM
                popup.find('label[data-key="Cd_AR"]').text(ar.Cd_AR);
                popup.find('[data-key="QtaLetta"]').text(ar.QtaEvadibile - ar.QtaResidua);
                popup.find('[data-key="QtaEvadibile"]').text(ar.QtaEvadibile);
                popup.find('[data-key="Cd_ARMisura"]').text(ar.Cd_ARMisura);
                r = true;
            }

            return r
        },
        "bcRoll": function () {
            var popup = $('#Popup_Issue_cp');
            var bcLabel = popup.find('label[data-key="BC_Label"]');
            var bcInput = popup.find('input[name="BC"]');
            var bcError = popup.find('label[data-key="BC_Error"]');
            bcError.text("");
            bcInput.val("");
            bcLabel.removeAttr('class');
            popup.find("button[data-id='issue_ignore_ub']").hide()
            //Imposto la posizione attuale
            switch (this.roll[this.roll_Idx]) {
                case "Cd_MGUbicazione":
                    bcLabel.text("UBICAZIONE");
                    popup.find("button[data-id='issue_ignore_ub']").show()
                    this.request();
                    break;
                case "Cd_AR":
                    bcLabel.text("ARTICOLO");
                    break;
                case "Cd_ARLotto":
                    bcLabel.text("LOTTO");
                    break;
                case "Quantita":
                    if (issue.data.Quantita && issue.data.Quantita > 0)
                        bcInput.val(issue.data.Quantita);
                    bcLabel.html("QUANTITÀ" + (issue.data.QtaLabel ? issue.data.QtaLabel : ''));
                    break;
                default:
                    //Non so dove rollare...
                    bcLabel.text("???");
                    break;
            }
            //Assegna le classi
            bcLabel.addClass(popup.find('label[data-key="' + this.roll[this.roll_Idx] + '"]')[0].className).removeClass("w3-large").removeClass("w3-xlarge");
            // Focus su bc
            bcInput.focus().select();

            if (this.roll_Idx === (this.roll.length - 1))
                popup.find("button[data-id='issue_roll_confirm']").show();
            else
                popup.find("button[data-id='issue_roll_confirm']").hide();
            return;
        },
        "bcValidate": function () {
            //Valida ed esegue il roll
            var popup = $('#Popup_Issue_cp');
            var bcInput = popup.find('input[name="BC"]');
            var bcError = popup.find('label[data-key="BC_Error"]');

            bcError.text("");

            var value = bcInput.val().toUpperCase();
            var canRoll = true;
            switch (this.roll[this.roll_Idx]) {
                case "Cd_AR":
                    if (bcInput.val().trim() !== "") {
                        if (!this.arUI(value)) {
                            canRoll = false;
                            bcError.text("Codice articolo non trovato nei prelievi!");
                        }
                    } else {
                        canRoll = false;
                        bcError.text("Inserire un codice articolo!");
                    }
                    break;
                case "Cd_ARLotto":
                    issue.data.Cd_ARLotto = value;
                    popup.find('label[data-key="Cd_ARLotto"]').text(value);
                    break;
                case "Quantita":
                    issue.data.Quantita = value;
                    break;
                case "Cd_MGUbicazione":
                    issue.data.Cd_MGUbicazione = value;
                    break;
                default:
                    canRoll = false;
                    bcError.text("COME??");
                    break;
            }
            if (canRoll) {
                if (this.roll_Idx == this.roll.length - 1) {
                    //Fine roll: conferma la modifica
                    this.confirm();
                } else {
                    this.roll_Idx = this.roll_Idx + 1;
                    this.bcRoll();
                }
            } else
                bcInput.focus().select();
        },
        "justArrived": function () {
            // Ora mi sono spostato... riassegno dove sono 
            // lo mostro a video
            var popup = $('#Popup_Issue_cp');
            oPrg.doveSei.Cd_MG = popup.find("label[data-key='Cd_MG']").text()
            oPrg.doveSei.Cd_MGUbicazione = popup.find("input[name='Cd_MGUbicazione']").val()
            doveSono_Text();
        },
        "request": function () {
            // esegue la richiesta di issue disponibile per l'articolo/lotto corrente
            var params = {
                Terminale: oApp.Terminale,
                Cd_Operatore: oApp.Cd_Operatore,
                Id_xMORL: oPrg.drRL.Id_xMORL,
                Cd_MG_da: fU.ToString(ActivePage().find('.div-dove-sei input[name="Cd_MG"]').val()),
                Cd_MGUbicazione_da: fU.ToString(ActivePage().find('.div-dove-sei input[name="Cd_MGUbicazione"]').val()),
                Cd_AR: issue.data.Cd_AR,
                Cd_ARLotto: issue.data.Cd_ARLotto,
                Quantita: fU.ToDecimal(issue.data.Quantita),
                Cd_ARMisura: issue.data.Cd_ARMisura,
                IssueTipo: oPrg.drDO.xMOIssueTipo
            }
            Ajax_xMORLRig_T_cp_Issue(params, function () { issue.cp.getSingle() }, function () { issue.cp.clear() });
        },
        "getSingle": function () {
            Ajax_xMORLRig_T_GetSingle(function () {
                var popup = $('#Popup_Issue_cp');
                // Scrivo i valori sul DOM
                if (issue.data.Result > 0) {
                    // Scrivo i valori sul DOM
                    Object.keys(issue.data).forEach(function (key) {
                        var el = popup.find('[data-key="' + key + '"]');
                        if (el.length > 0) el.text(issue.data[key]);
                    });
                }
                popup.find('input[name="BC"]').focus().select();
            });
        },
        "confirm": function () {

            // Eseguo 'Modifica' per scrivere i valori sul DOM
            this.modify();
            // Eseguo la conferma della lettura
            Confirm_Read();
            return;
        },
        "skip": function () {
            Ajax_xMORLRig_T_Issue_Skip(false, function () {
                // Richiede una nuova ubicazione
                issue.cp.request();
            });
        },
        "modify": function () {
            // Scrivo i valori sul DOM
            ActivePage().find('input[name="Cd_AR"]').setVal(issue.data.Cd_AR);
            ActivePage().find('input[name="Quantita"]').setVal(issue.data.Quantita).focus().select();
            ActivePage().find('input[name="Cd_ARMisura"]').setVal(issue.data.Cd_ARMisura);

            var mg = oPrg.isMGArrivo() ? '_A' : '_P';
            ActivePage().find("".concat('input[name="Cd_MG', mg, '"]')).setVal(issue.data.Cd_MG);
            ActivePage().find("".concat('input[name="Cd_MGUbicazione', mg, '"]')).setVal(issue.data.Cd_MGUbicazione);

            ActivePage().find('input[name="Cd_ARLotto"]').setVal(issue.data.Cd_ARLotto);
            ActivePage().find('input[name="Matricola"]').setVal(issue.data.Cd_xMOMatricola);
            // Mi sposto
            issue.ca.justArrived();
            // Nascondo il Popup
            issue.toggle();
        },
    },
    "ca": {
        //Variabili    
        "roll": [],   // Contiene la lista del roll definiti per il percorso
        "roll_Idx": 0,
        "loadUI": function () {
            // Copia di 'this' da utilizzare nelle funzioni nidificate
            var _self = this;

            // Memorizza l'issue corrente
            // La salva anche sulla lettura corrente
            oPrg.RL.issueId = issue.data.Id_xMORLRig_T;
            // Variabili
            var popup = $('#Popup_Issue_ca');
            var bcInput = popup.find('input[name="BC"]');

            // Unbinding eventi ubicazione
            bcInput.unbind('change');
            bcInput.unbind('keydown');
            // Scrivo i valori sul DOM
            Object.keys(issue.data).forEach(function (key) {
                var el = popup.find('[data-key="' + key + '"]');
                if (el.length > 0) el.text(issue.data[key]);
            });
            // Gestione dei lotti
            var sl = popup.find('.ar-lotti');
            sl.empty();
            if (issue.data['ARLotti']) {
                var lotti = JSON.parse(issue.data['ARLotti'])
                if (lotti.length > 0) {
                    lotti.forEach(function (lotto, index) {
                        sl.append($('<option>', {
                            class: "op-lotto",
                            value: lotto.Cd_ARLotto,
                            text: lotto.Cd_ARLotto,
                            idx: index
                        }));
                    });
                }
            }
            this.lottiShow(false);

            popup.find(".lg-popuptitle").text("Vai a ubicazione (" + oPrg.drDO.xMOIssueTipo + ")");
            bcInput.keydown(function (event) {
                if (event.key === 'Enter') _self.bcValidate();
            });

            // Gestisce la packing
            fU.ShowIf(popup.find('div.PackListRef'), oPrg.drDO.PkLstEnabled);
            if (oPrg.drDO.PkLstEnabled)
                popup.find('label[data-key="PackListRef"]').text(ActivePage().find("select[name='PackListRef']").val());

            //Svuota le info aggiuntive
            popup.find("label[name='InfoExt']").html("");
            // Mostra le descrizioni aggiuntive
            if (Nav.ShowInfo())
                Ajax_xmosp_xMORLRig_Issue_InfoEx("ca");

            // Mostro il Popup
            issue.toggle();

            // Avvia il roll
            switch (oApp.LicF_Id) {
                //case 39340: // WKI MB
                case 33056: // HP ITALIA
                    this.roll = ["Cd_AR", "Cd_ARLotto", "Quantita"];
                    break;
                case 33076: // MD
                case 33284: // BEPER
                    this.roll = ["Cd_MGUbicazione", "Cd_AR", "Quantita"];
                    break;
                default:
                    this.roll = ["Cd_MGUbicazione", "Cd_AR", "Cd_ARLotto", "Quantita"];
                    break;
            }
            this.roll_Idx = 0;
            this.bcRoll();
        },
        "bcRoll": function () {
            var popup = $('#Popup_Issue_ca');
            var bcLabel = popup.find('label[data-key="BC_Label"]');
            var bcInput = popup.find('input[name="BC"]');
            var bcError = popup.find('label[data-key="BC_Error"]');
            bcError.text("");
            bcInput.val("");
            bcLabel.removeAttr('class');

            switch (this.roll[this.roll_Idx]) {
                case "Cd_MGUbicazione":
                    bcLabel.text("UBICAZIONE");
                    break;
                case "Cd_AR":
                    bcLabel.text("ARTICOLO");
                    break;
                case "Cd_ARLotto":
                    // Effetua di nuovo il roll se il lotto è vuoto
                    if (fU.IsEmpty(issue.data.Cd_ARLotto))
                        this.bcValidate();
                    else
                        bcLabel.text("LOTTO");
                    break;
                case "Quantita":
                    bcLabel.text("QUANTITA'");
                    // Propone la quantità
                    bcInput.val(issue.data.Quantita);
                    break;
                default:
                    //Non so dove rollare...
                    bcLabel.text("???");
                    break;
            }
            //Assegna le classi
            bcLabel.addClass(popup.find('label[data-key="' + this.roll[this.roll_Idx] + '"]')[0].className).removeClass("w3-large").removeClass("w3-xlarge");
            // Focus su bc
            bcInput.focus().select();

            if (this.roll_Idx == (this.roll.length - 1)) {
                popup.find("button[data-id='issue_roll_confirm']").show()
            } else {
                popup.find("button[data-id='issue_roll_confirm']").hide()

            }
            return;
        },
        "bcValidate": function () {
            //Valida ed esegue il roll
            var popup = $('#Popup_Issue_ca');
            var bcInput = popup.find('input[name="BC"]');
            var bcError = popup.find('label[data-key="BC_Error"]');

            bcError.text("");

            var canRoll = true;
            switch (this.roll[this.roll_Idx]) {
                case "Cd_MGUbicazione":
                    if (issue.data.Cd_MGUbicazione.trim() !== bcInput.val().trim()) {
                        canRoll = false;
                        bcError.text("Ubicazione dichiarata è diversa da " + issue.data.Cd_MGUbicazione);
                    }
                    break;
                case "Cd_AR":
                    if (bcInput.val().trim() !== "") {
                        var item = { Cd_AR: "", Descrizione: "", Cd_ARMisura: "", FattoreToUM1: 1 };
                        item.Cd_AR = bcInput.val();
                        if (item.Cd_AR.trim().toLowerCase() !== issue.data.Cd_AR.trim().toLowerCase()) {
                            // Articolo inserito diverso da quello proposto: recupera il Cd_AR 
                            // dall'eventuale alias o codice alternativo passato alla funzione
                            item = Ajax_xmofn_Get_AR_From_AAA_Easyway(item.Cd_AR, $("#pgRL input[name='Cd_CF']").val());
                        }
                        if (item.Cd_AR.trim().toLowerCase() !== issue.data.Cd_AR.trim().toLowerCase()) {
                            canRoll = false;
                            bcError.text("L'articolo letto [" + item.Cd_AR.trim() + "] è diverso da quello proposto [" + issue.data.Cd_AR.trim() + "]");
                        } else {
                            //BEPER VUOLE IL TOTALE PRELEVABILE
                            if (oApp.LicF_Id != 33284) {
                                // Verifica l'um e il fattore di conversione se abbiamo letto un alias
                                if (item.Cd_ARMisura !== "" && item.Cd_ARMisura.trim().toLowerCase() !== issue.data.Cd_ARMisura.trim().toLowerCase()) {
                                    //Converte la quantità proposta in quella dell'um letta che proviene da AAA
                                    issue.data.Quantita = item.FattoreToUM1;
                                    issue.data.QtaLabel = '<span class="w3-xsmall">&nbsp;(1 ' + item.Cd_ARMisura.trim() + ' = ' + item.FattoreToUM1 + ' ' + ar.Cd_ARMisura + ')</span>';
                                }
                            }
                        }
                    } else {
                        canRoll = false;
                        bcError.text("Inserire un codice articolo!");
                    }
                    break;
                case "Cd_ARLotto":
                    if (fU.IsEmpty(issue.data.Cd_ARLotto))
                        break;
                    // Valido il Cd_ARLotto per verificarne la corrispondenza con CD_AR
                    var Cd_AR = issue.data.Cd_AR;
                    var Cd_ARLotto = bcInput.val().trim();
                    if (Ajax_xmofn_ARLottoValidate(Cd_AR, Cd_ARLotto, issue.data.Cd_MGUbicazione) !== "") {
                        issue.data.Cd_ARLotto = Cd_ARLotto;
                    } else {
                        canRoll = false;
                        bcError.text("Il lotto letto è diverso da quello proposto ".concat(issue.data.Cd_ARLotto, " o non è un lotto dell'articolo ", Cd_AR, "!"));
                    }
                    break;
                case "Quantita":
                    if (fU.IsZeroVal(bcInput.val())) {
                        canRoll = false;
                        bcError.text("Quantità errata o mancante!");
                    } else {
                        // Riassegna la quantità
                        issue.data.Quantita = bcInput.val();
                    }
                    break;
                default:
                    canRoll = false;
                    bcError.text("COME??");
                    break;
            }
            if (canRoll) {
                if (this.roll_Idx == this.roll.length - 1) {
                    //Fine roll: conferma la modifica
                    this.confirm();
                } else {
                    this.roll_Idx = this.roll_Idx + 1;
                    this.bcRoll();
                }
            } else
                bcInput.focus().select();
        },
        "justArrived": function () {
            // Ora mi sono spostato... riassegno dove sono 
            // lo mostro a video
            var popup = $('#Popup_Issue_ca');
            oPrg.doveSei.Cd_MG = popup.find("label[data-key='Cd_MG']").text()
            oPrg.doveSei.Cd_MGUbicazione = popup.find("input[name='Cd_MGUbicazione']").val()
            doveSono_Text();
        },
        "getSingle": function () {
            Ajax_xMORLRig_T_GetSingle(function () { issue.ca.loadUI() });
        },
        "confirm": function () {
            // Eseguo 'Modifica' per scrivere i valori sul DOM
            this.modify();
            // Eseguo la conferma della lettura
            Confirm_Read();
        },
        "skip": function (skipAR) {
            Ajax_xMORLRig_T_Issue_Skip(skipAR, function () {
                // Nascondo il Popup
                issue.toggle();
                // Prossima Issue
                setTimeout(function () { issue.start(); }, 250);
            });
        },
        "lottiShow": function (userSel) {
            var popup = $('#Popup_Issue_ca');
            var sl = popup.find('.ar-lotti');
            var lb = popup.find('[data-key="Cd_ARLotto"]');
            if (userSel) {
                lb.hide();
                sl.show().focus();
            } else {
                lb.show();
                sl.hide();
                popup.find('input[name="BC"]').focus().select();
            }
        },
        "lottiSelect": function () {
            var popup = $('#Popup_Issue_ca');
            var sl = popup.find('.ar-lotti');
            var lb = popup.find('[data-key="Cd_ARLotto"]');
            //Riassegna il lotto selezionato
            issue.data.Cd_ARLotto = sl.select().val();
            lb.text(issue.data.Cd_ARLotto);
            this.lottiShow(false);
        },
        "modify": function () {
            // Scrivo i valori sul DOM
            ActivePage().find('input[name="Cd_AR"]').setVal(issue.data.Cd_AR);
            ActivePage().find('input[name="Quantita"]').setVal(issue.data.Quantita).focus().select();
            ActivePage().find('input[name="Cd_ARMisura"]').setVal(issue.data.Cd_ARMisura);

            var mg = oPrg.isMGArrivo() ? '_A' : '_P';
            ActivePage().find("".concat('input[name="Cd_MG', mg, '"]')).setVal(issue.data.Cd_MG);
            ActivePage().find("".concat('input[name="Cd_MGUbicazione', mg, '"]')).setVal(issue.data.Cd_MGUbicazione);

            ActivePage().find('input[name="Cd_ARLotto"]').setVal(issue.data.Cd_ARLotto);
            ActivePage().find('input[name="Matricola"]').setVal(issue.data.Cd_xMOMatricola);
            // Mi sposto
            issue.ca.justArrived();
            // Nascondo il Popup
            issue.toggle();
        },
    }
}

function Ajax_xMORLRig_T_cp_Issue(params, callback, callfail) {
    $('div.preloader').show();
    oPrg.RL.issueId = 0;
    $.ajax({
        url: "Logistica.aspx/xmosp_xMORLRig_T_cp_Issue",
        async: true,
        data: JSON.stringify(params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var data = JSON.parse(mydata.d);
            if (!(data instanceof Array) || data.length === 0) {
                PopupMsg_Show("ERRORE", -1, 'Ajax_xMORLRig_T_' + oPrg.drDO.xMOIssueTipo + '_Issue() non ha restituito valori validi!!');
            } else {
                issue.data.Result = data[0].Result;
                issue.data.Messaggio = data[0].Messaggio;
                issue.data.Id_xMORLRig_T = data[0].Id_xMORLRig_T;
                switch (true) {
                    case issue.data.Result < 0:
                        PopupMsg_Show("ERRORE", issue.data.Result, issue.data.Messaggio);
                        if (callfail) callfail();
                        break;
                    case issue.data.Result == 0:
                        // se il server non restituisce più issue il lavoro è terminato
                        PopupMsg_Show("STOP", issue.data.Result, issue.data.Messaggio);
                        if (callfail) callfail();
                        break;
                    case issue.data.Result > 0:
                        oPrg.RL.issueId = data[0].Id_xMORLRig_T;
                        if (callback) callback();
                        break;
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        },
        complete: function () {
            $('div.preloader').hide();
        }
    });

}

function Ajax_xMORLRig_T_ad_Issue(callback) {
    alert("...in sviluppo.")
}


function Ajax_xMORLRig_T_ca_Issue(callback) {
    $('div.preloader').show();
    oPrg.RL.issueId = 0;
    var Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: oPrg.drRL.Id_xMORL,
        Cd_MG_da: fU.ToString(ActivePage().find('.div-dove-sei input[name="Cd_MG"]').val()),
        Cd_MGUbicazione_da: fU.ToString(ActivePage().find('.div-dove-sei input[name="Cd_MGUbicazione"]').val()),
        IssueTipo: oPrg.drDO.xMOIssueTipo
    };
    $.ajax({
        url: "Logistica.aspx/xmosp_xMORLRig_T_ca_Issue",
        async: true,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var data = JSON.parse(mydata.d);
            if (!(data instanceof Array) || data.length === 0) {
                PopupMsg_Show("ERRORE", -1, 'Ajax_xMORLRig_T_' + oPrg.drDO.xMOIssueTipo + '_Issue() non ha restituito valori validi!!');
            } else {
                //Memorizza i dati ricevuti
                issue.data.Result = data[0].Result;
                issue.data.Messaggio = data[0].Messaggio;
                issue.data.Id_xMORLRig_T = data[0].Id_xMORLRig_T;
                switch (true) {
                    case issue.data.Result < 0:
                        PopupMsg_Show("ERRORE", issue.data.Result, issue.data.Messaggio);
                        break;
                    case issue.data.Result == 0:
                        // se il server non restituisce più issue il lavoro è terminato
                        PopupMsg_Show("STOP", issue.data.Result, issue.data.Messaggio);
                        break;
                    case issue.data.Result > 0:
                        oPrg.RL.issueId = data[0].Id_xMORLRig_T;
                        if (callback) callback();
                        break;
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        },
        complete: function () {
            $('div.preloader').hide();
        }
    });

}

function Ajax_xMORLRig_T_Issue_Skip(Skip_AR, callback) {
    $('div.preloader').show();
    var Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: oPrg.Id_xMORL_Edit,
        Id_xMORLRig_T: issue.data.Id_xMORLRig_T,
        Skip_AR: Skip_AR
    };
    $.ajax({
        url: "Logistica.aspx/xmosp_xMORLRig_T_Issue_Skip",
        async: true,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var data = JSON.parse(mydata.d);
            if (callback) callback(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        },
        complete: function () {
            $('div.preloader').hide();
        }
    });
}

function Ajax_xMORLRig_T_restart(callback) {
    $('div.preloader').show();
    var Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: oPrg.Id_xMORL_Edit,
    };
    $.ajax({
        url: "Logistica.aspx/xmosp_xMORLRig_T_Issue_Restart",
        async: true,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var data = JSON.parse(mydata.d);
            if (callback) callback(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        },
        complete: function () {
            $('div.preloader').hide();
        }
    });
}

function Ajax_xMORLRig_T_GetSingle(callback) {
    $('div.preloader').show();
    var Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: oPrg.Id_xMORL_Edit,
        Id_xMORLRig_T: oPrg.RL.issueId,
    };
    $.ajax({
        url: "Logistica.aspx/xmofn_xMORLRig_T_GetSingle",
        async: true,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var data = JSON.parse(mydata.d);
            //Carica i dati provenienti dal server in issue.data
            Object.keys(issue.data).forEach(function (key) {
                if (data[0].hasOwnProperty(key)) //verifica che l'oggetto data collimi con issue per riempirlo
                    issue.data[key] = data[0][key];
            });
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

//Valorizzo la label InfoExt con le info delle UM disponibili
function Ajax_xmosp_xMORLRig_Issue_InfoEx(xx) {

    var popup = $('#Popup_Issue_' + xx);

    Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit),
        Cd_AR: issue.data.Cd_AR,
        Cd_MG_P: issue.data.Cd_MG,
        Cd_MGUbicazione_P: issue.data.Cd_MGUbicazione,
        Cd_MG_A: '',
        Cd_MGUbicazione_A: '',
        Cd_ARLotto: issue.data.Cd_ARLotto,
        DataScadenza: '',
        Matricola: issue.data.Cd_xMOMatricola,
        Cd_ARMisura: issue.data.Cd_ARMisura,
        Quantita: issue.data.Quantita,
        Cd_DOSottoCommessa: '' //issue.data.Cd_DOSottoCommessa,
    };
    $.ajax({
        url: "Logistica.aspx/xmosp_xMORLRig_InfoEx",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            popup.find("label[name='InfoExt']").html(r[0].extra_info);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}
/*
      Logistica.js
      Contiene tutte le funzioni e gli oggetti della pagina logistica.aspx

        #1.00 REGION: FUNZIONI BASE
        #1.10 REGION: CHIAMATE AJAX
            #1.11 AJAX SEARCH
            #1.12 AJAX DETAILS
        #1.20 REGION: BARCODE
        #1.30 REGION: FUNZIONI UI
        #1.40 REGION: FUNZIONI LOAD
        #1.50 REGION: TEMPLATE            
        #1.60 REGION: CLEAR PAGE
        #1.80 REGION: EVENTI KEYPRESS
        #1.90 REGION: EXECUTE
        #2.00 REGION: COMANDI LISTENER
        #2.10 REGION: FUNZIONALITA' GENERICHE
        #2.20 REGION: SPEDIZIONE
        #2.30 REGION: ACQUISIZIONE ALIAS
        #2.40 REGION: PRELIEVO DA ID RIGA
        #2.50 REGION: STOCCAGGIO MERCE
        #2.60 REGION: INFO MAGAZZINO AR/MAT
*/

// -------------------------------------------------
// #1.00 REGION: FUNZIONI BASE
// -------------------------------------------------

// Init di Logistica.aspx
function Init() {

    Media_Query();

    // Init dei contatori
    oPrg.Counter.Init();

    // Nascondo tutto
    $(".mo-page").hide();

    // Carico la variabile oApp
    // ATTENZIONE la variabile oAPP va subito testata se nulla (non è possibile testarne i valori delle var interne)
    oApp = fU.GetSession("oApp");
    if (fU.IsNull(oApp)) {
        //oApp non valida: esco al log-in
        location.assign("default.htm");
        return false;
    }

    // Verifico se l'utente è loggato (va sempre testato dopo la verifica che oApp != null)
    if (fU.ToBool(oApp.Logon) == false) {
        location.assign("default.htm");
        return false;
    }

    //Recupero le configurazioni locali da LocalStorage
    oApp.LocalConfig = oApp_GetLocalConfig();

    // Init dei preferiti
    UserPref.items = UserPref.getLocal();

    // Se il browser è explorer ed è impostato in inglese mostro un messaggio all'operatore per informarlo che le date dovranno essere inserite secondo il formato inglese
    if (oApp.BrowserType == enumBrowser.Explorer && navigator.language.substr(0, 2).toLowerCase() == 'en') {
        $("#PopupMsg .title").text("ATTENZIONE");
        $("#PopupMsg .msg").text("Il browser è impostato in lingua inglese, quindi le date dovranno essere formattate MM/GG/AAAA");
        $("#PopupMsg").show();
    }

    // ASSEGNAZIONE EVENTI Begin

    // ### swipe!

    // Al resize della finestra browser chiama la funzione di media query
    $(window).resize(function () {
        Media_Query();
    });

    // Allo scroll della pagina visulizza il bottone per tornare al top page se esistente nella pagina attiva
    window.onscroll = function () { When_PageScroll() };

    $(window).on("orientationchange", function () {
        Media_Query();
    });

    // Click sulla label logistica
    $(".lg-headerlogo").on("click", function () {
        //Reset del sottomenù selezionato
        oApp.SottoMenuAttivo = null;
        //Va alla home page
        GoHome();
    });

    // Click menu principale
    $("li.menu-principale").on("click", function () {
        //Nasconde i preferiti
        Nav.prefUserHide();
        // Mostra la sezione
        switch ($(this).attr("id")) {
            case 'menu-ca':
            case 'menu-cp':
            case 'menu-ad':
            case 'menu-in':
            case 'menu-tr':
            case 'menu-intmg':
            case 'menu-prd':
                // Gestisco il sotto menu
                GoToSottoMenu($(this).attr("id"));
                break;
            case 'menu-da':
                // Carico il programma dei documenti aperti
                oPrg.Load("DA");
                break;
            //case 'menu-tr':
            //    oPrg.Load("TI");
            //    break;
            case 'menu-sm':
                oPrg.Load("SM");
                break;
            case 'menu-mi':
                break;
            case 'menu-rs':
                oPrg.Load('RS');
                break;
            case 'menu-pr':
                oPrg.Load('PR');
                break;
            //case 'menu-in':
            //    oPrg.Load('IN');
            //    break;
            case 'menu-sp':
                oPrg.Load('SP');
                break;
            case 'menu-aa':
                oPrg.Load('AA');
                break;
            case "menu-log":
                oPrg.Load("LOG");
                break;
            case 'menu-lo':
                LogOff();
                break;
            default:
                //Errore di programmazione
                PopupMsg_Show("Messaggio", 1, "Identificativo del menù non gestito!! " + $(this).attr("id"));
                break;
        }
    });

    //Mostra le info-ext e poi le nasconde se l'utente non le vuole vedere
    $(".info-ext").show();
    if (!Nav.ShowInfo())
        $(".info-ext").hide();

    //Click delle icone per le ricerche
    $(".search").on("click", function () {
        Search_Open($(this));
    });

    //Salva il focus del campo
    $(".save-focus").on("click", function () {
        oPrg.saveFocus.Set($(this));
    });

    //Click dei bottoni di conferma per avviare la validazione e il salvataggio della pagina
    $(".validate").on("click", function () {
        fPage.Validate();
    });

    //Click del check che seleziona di tutti i documenti prelevabili
    $("#pgDOPrelievi .ck-documenti").on("click", function () {
        // Seleziona tutti i check delle righe di tamplate non disabilitati
        $("#pgDOPrelievi .template").find(":checkbox:not(:disabled)").prop('checked', this.checked);
    });


    $("img.search").parent().find("input").keydown(function (e) {
        if (e.keyCode == 114) {   //F3
            setTimeout(Search_Open, 250, $(this).parent().find("img"));
            return false;
        }
    });

    // Click sui campi Search .filtro
    $(".filtro").keydown(function (e) {
        if (e.keyCode == 114) {   //F3
            return false;
        }
    });

    // Click sui campi Search .filtro
    $(".filtro").keyup(function (e) {
        var do_search = true;
        var select_first = false;
        switch (e.keyCode) {
            case 13:    //Invio
                //Se il campo non è vuoto seleziona la prima ricerca della lista
                select_first = true;
                break;
            case 114:   //F3
                do_search = false;
                $("#" + oPrg.ActiveSearchId).hide();
                break;
            default:
                break;
        }
        //Esegue la ricerca

        if (do_search) setTimeout(Filtro_Execute, 500, $(this), $(this).val(), select_first);
    });

    // Click dell'icon dettaglio cliente visibile in pgRL solo se in modalità edit 
    $("#pgRL .detail").on("click", function () {
        Detail_Ajax_xmovs_CF($("#pgRL input[name='Cd_CF']").val());
    });

    // Click dei bottoni nel popup delle azioni del dettaglio della packing list
    $("#Popup_PKListAR_DelShift button").on("click", function () {

        switch ($(this).attr('action')) {
            case 'shift':
                Ajax_xmosp_xMORLRigPackList_Shift();
                break;
            case 'delete':
                Ajax_xmosp_xMORLRigPackList_Del();
                break;
        }

        $('#Popup_PKListAR_DelShift').hide();
    });

    // Click dei bottoni nel popup delle azioni del dettaglio della packing list
    $("#Popup_PKListUL_Shift button").on("click", function () {
        switch ($(this).attr('action')) {
            case 'shift':
                Ajax_xmosp_xMORLPackListRef_P_Save();
                break;
            case 'change':
                Ajax_xmosp_xMORLPackListRef_Update();
                break;
        }
        $('#Popup_PKListUL_Shift').hide();
    });

    //focus degli input
    $("input[type='text']").on('focus', function () {
        $(this).select();
        if (DEBUG) { $(".debug").text($(this).val()); }
    });

    // Focusout dell'input con classe input-label.
    // Viene aggiornata la label correlata al campo con il val dell'input
    $(".input-label").on('focusout', function () {
        var name = $(this).attr("name");
        ActivePage().find("label." + name.toLowerCase() + "").text($(this).val());
    });

    //Gestione del keypress execute 
    $("input.keypressexec").on("keypress", function (e) {
        KeyPress_Execute(e.keyCode, $(this));
    });


    $("#pgTR_UBPA .enter-gonext").on("keypress", function (e) {
        if (e.keyCode == '13') {
            pgTR_UBPA_Focus();
        }
    });

    $("#pgRLRig input[name='Cd_AR']").on("keypress", function (e) {
        if (e.keyCode == '13') {
            // Sull invio del campo articolo svuoto la label contenente alias alternativo o cd ar per ricalcolare il tutto (Ar, um, ecc)
            ActivePage().find(".ar-aa").text("");
            ARARMisura_Set("");
        }
    });

    $("#Popup_VaiAUbi input[name='Cd_MGUbicazione_a']").on("keypress", function (e) {
        if (e.keyCode == '13') {
            // Sull invio del campo seleziono l'ubicazione
            doveVado_Set(false);
        }
    });

    // Click dettaglio BC in pgRLRig
    $("#pgRLRig .detail-bc").on("click", function () {
        Detail_Barcode();
    });

    // Click dettaglio Giacenza in pgRLRig
    $(".detail-giacubi").on("click", function () {

        var Cd_AR = null;
        var Cd_MG = null;

        if (oPrg.ActivePageId == "pgTRMP_C_AR") {
            Cd_AR = ActivePage().find("label.Cd_AR_C").text();
            Cd_MG = ActivePage().find("label.Cd_MG_P").text();
        } else {
            Cd_AR = ActivePage().find("input[name='Cd_AR']").val();
            Cd_MG = fU.ToString(fMG.Mg4Find(ActivePage().find("input[name='Cd_MG_P']").val(), ActivePage().find("input[name='Cd_MG_A']").val()));
        }

        if (!Cd_AR || Cd_AR.trim() == "")
            PopupMsg_Show("ATTENZIONE", 1, "Inserire un articolo");
        else
            Detail_Ajax_xmofn_ARMGUbicazione_Giac(Cd_AR, Cd_MG);
    });

    // Click dettaglio AR Giacenza per Ubicazione
    $(".detail-giacar").on("click", function () {
        Detail_MGUbicazioneAR_Giac('')
    });
    $(".detail-giacar-p").on("click", function () {
        Detail_MGUbicazioneAR_Giac('_p')
    });
    $(".detail-giacar-a").on("click", function () {
        Detail_MGUbicazioneAR_Giac('_a')
    });

    function Detail_MGUbicazioneAR_Giac(_pa) {
        var Cd_MG = null;
        var Cd_MGUbicazione = null;
        Cd_MG = ActivePage().find("input[name='Cd_MG".concat(_pa ? _pa.toUpperCase() : "", "']")).val();
        Cd_MGUbicazione = ActivePage().find("input[name='Cd_MGUbicazione".concat(_pa ? _pa.toUpperCase() : "", "']")).val();


        if (fU.IsEmpty(Cd_MG) || fU.IsEmpty(Cd_MGUbicazione))
            PopupMsg_Show("ATTENZIONE", 1, "Inserire il magazzino e l'ubicazione!");
        else {
            //Assegna le variabili
            oPrg.DetailGiacenzaUbicazione.Cd_MG = Cd_MG;
            oPrg.DetailGiacenzaUbicazione.Cd_MGUbicazione = Cd_MGUbicazione;
            oPrg.DetailGiacenzaUbicazione._pa = _pa;
            //Mostra i dati
            Detail_Ajax_xmofn_MGUbicazioneAR_Giac();
        }
    }

    // Click sulla lista articoli
    $("#pgRLRig_T .toggle-lista-ar").on("click", function () {
        // Se devo mostrare la lista
        if (!$("#pgRLRig_T .lista-ar table").is(":visible")) {
            $("#pgRLRig_T img.toggle-lista-ar").attr("src", "icon/ArrowUp.svg");
        } else {
            $("#pgRLRig_T img.toggle-lista-ar").attr("src", "icon/ArrowDown.svg");
            $("#pgRLRig_T input[name='Cd_xMOMatricola']").val("").focus();
        }

        $("#pgRLRig_T .lista-ar table").toggle();
        $("#pgRLRig_T div.RLRig input[name='Cd_xMOMatricola']").focus().select();

    });


    $("#pgRLRig_T .ApriListaAR").on("click", function () {
        $("#pgRLRig_T .toggle-lista-ar").click();
    });

    // Click dettaglio letture in pgRLRig
    $(".detail-letture").on("click", function () {

        switch (oPrg.ActivePageValue) {
            case enumPagine.pgRLRigID:
            case enumPagine.pgRLRig:
                Detail_Ajax_xmovs_xMORLRig();
                break;
            case enumPagine.pgRLRig_T:
                if ($("#pgRLRig_T .lista-ar table").is(":visible")) {
                    $("#pgRLRig_T .lista-ar table").hide();
                    $("#pgRLRig_T img.toggle-lista-ar").attr("src", "icon/ArrowDown.svg");
                }
                Detail_Ajax_xmovs_xMORLRig();
                break;
            case enumPagine.pgTRRig_P:
                Detail_Ajax_xmovs_xMOTRRig_P();
                break;
            case enumPagine.pgTRRig_A:
                Detail_Ajax_xmovs_xMOTRRig_A();
                break;
        }

        $("html, body").animate({ scrollTop: 0 }, "fast");
        $("#Detail_Letture").show();
    });

    // Visualizza pgRLPK in modalità detail 
    $(".detail-pklistref").on("click", function () {
        oPrg.PK.RLPKDetail = true;
        // Prendo il packlistref selezionato
        oPrg.PK.PackListRef = ActivePage().find("select[name='PackListRef']").val();
        // Simulo il next page
        Nav.Next();
        // Nascondo i bottoni back e next
        Nav.NavbarShowIf(false, false);
    });

    $(".detail-pklist").on("click", function () {
        // Ajax che carica i dati
        Detail_Ajax_xmofn_xMORLRigPackingList_AR();
        $("#Detail_PackingList").show();
    });

    //Gestione del toggle delle sezioni div
    $("div.div-accordion").find(".header").on("click", function (event) {
        //Verifico che l'elemento che ha scatenato il click sia l'header del div toggle
        //serve per inibire il click del toggle se ho eseguito click su icone di azioni 
        if ($(event.target).hasClass("header") || $(event.target).hasClass("icon")) {
            DivToggle_Execute($(this).parent());
        }
    });

    // Interpretazione dei barcode 
    $(".barcode").find("input").on("keydown", function (e) {
        if (e.keyCode == '13') {    //INVIO
            var r = false;
            switch (oPrg.ActivePageValue) {
                case enumPagine.pgRLRigID:
                    if ($.isNumeric($(this).val()))
                        r = true;
                    else
                        PopupMsg_Show("Err Barcode_Enter", 1, "Il barcode letto non valido.");
                    break;
                default:
                    r = true
                    break;
            }
            if (r) {
                Barcode_Enter(this, $(this.parentElement).find("select"));
            }
        }
    });

    // Invio nel campo QtaRilevata
    $("#pgINRig .div-detail input[name='QtaRilevata']").keypress(function (e) {
        if (e.keyCode == 13)  // INVIO
        {
            // Gestisce l'invio nel campo QtaRilevata
            Detail_pgINRig_AR_Confirm();
        }
    });

    // Click keys arrow per lo scorrimento tra gli articoli da inventariare nel detail
    $("#pgINRig .div-detail, #pgINRig .btn-slideshow").on("keydown", "click", (function (e) {
        if (fU.IsChecked($("#pgINRig .div-detail .ck-sequenziale"))) {
            var index;
            switch (e.keyCode) {
                case 37: // arrow left
                    index = SlideShow(oPrg.IN.dtxMOINRig, oPrg.IN.idx, -1);
                    break;
                case 39: // arrow right
                    index = SlideShow(oPrg.IN.dtxMOINRig, oPrg.IN.idx, 1);
                    break;
            }
            $("#pgINRig tr[idx='" + index + "']").click();
        }
    }));

    // Click bottoni slide per lo scorrimento tra gli articoli da inventariare nel detail
    $("#pgINRig .btn-slideshow").on("click", function () {
        var n;
        var index;
        switch ($(this).attr("data-slide")) {
            case "left": // arrow left
                n = -1;
                break;
            case "right": // arrow right
                n = 1;
                break;
        }
        index = SlideShow(oPrg.IN.dtxMOINRig, oPrg.IN.idx, n);
        $("#pgINRig tr[idx='" + index + "']").click();
    });

    $("#pgTRMP_C_AR .btn-slideshow").on("click", function () {
        var n;
        var index;
        switch ($(this).attr("data-slide")) {
            case "left": // arrow left
                n = -1;
                break;
            case "right": // arrow right
                n = 1;
                break;
        }
        //recupera la chiave dalla riga corrente
        var key = fU.ToInt32($("#pgTRMP_C_AR .TRMP_C tr[Id_DORig_C='" + oPrg.TRMP.Id_DORig_C + "']").attr("key"));
        key = key + n;
        if (key > oPrg.TRMP.dtDORig_C.length - 1)
            key = 0;
        if (key < 0)
            key = oPrg.TRMP.dtDORig_C.length - 1;
        $("#pgTRMP_C_AR .TRMP_C tr[key='" + key + "']").click();

    });

    // All'invio sul btn-confirm di pgRLRig confermo la lettura
    $("#pgRLRig .btn-confirm").keydown(function (btn) {
        if (btn.keyCode == 13) // INVIO
            //se la quantità è vuota si ferma sul campo
            if (fU.IsEmpty(ActivePage().find("input[name='Quantita']").val()))
                setTimeout(function () { ActivePage().find("input[name='Quantita']").focus(); }, 250);
            else
                Confirm_Read();
    });

    // Check nella ricerca dei lotti che li filtra per giacenza
    $("#SearchARLotto .ck-giacpositiva").on("click", function () {
        Search_Ajax_xmofn_ARLotto();
    });

    // Check nella ricerca dei lotti che li filtra per giacenza
    $("#SearchMGUbicazione .ck-ubinoncom").on("click", function () {
        Search_Ajax_xmofn_MGUbicazione();
    });

    $("#pgINRig .div-in-ar-new input[name='Cd_AR']").on("keypress", function (e) {
        if (e.keyCode == 13) {
            Ajax_xmofn_Get_AR_From_AAA($(this).val());
        }
    });

    // In fase di selezione per l'aggiunta di un ar all'inventario verifico la giacenza e carico la tabella che la mostra all'operatore
    $("#pgINRig .div-in-ar-new input").on("change", function () {
        setTimeout(function () {
            Ajax_xmofn_xMOGiacenza_IN_SelAr();
        }, 1000);
    });

    // Al onvaluchange della linea di produzione se necessario cambia il magazzino
    $("#pgRL select[name='Cd_xMOLinea']").on("change", function () {
        Set_LineaMG();
    });

    // Check nella ricerca degli articoli che permette di nascondere o mostrare gli ar fittizi 1 = visibili 0 = nascosti
    $("#SearchAR .ck-fittizi").on("click", function () {
        Search_Ajax_xmofn_AR();
    });

    $("input[name='Cd_AR']").on("change", function () {
        // Reset ar-aa e svuota um
        ActivePage().find(".ar-aa").text("");
        ARARMisura_Set("");
        // Carico le info sulla quantità
        ActivePage().find(".ar-qta-info").text(AR_InfoPrel());
    });

    // Compila il campo CF e cerca il codice corrispondente
    $("input[name='Cd_CF']").on("keypress keydown", function (e) {
        if (e.keyCode == 9 || e.keyCode == 13) // TAB or INVIO
        {
            var cfval = ActivePage().find("input[name='Cd_CF']").val();
            var codcf = cfval.substr(1);

            if (codcf.length < 6) {
                for (var i = 0; codcf.length < 6; i++) {
                    codcf = '0' + codcf;
                }
            }
            codcf = cfval.substring(0, 1).concat(codcf);
            var CF = Ajax_xmofn_CF(codcf);
            if (!fU.IsEmpty(CF)) {
                ActivePage().find("input[name = 'Cd_CF']").val(CF.Cd_CF);
                ActivePage().find("label[name='CF_Descrizione']").text(CF.Descrizione);
            } else {
                ActivePage().find("label[name='CF_Descrizione']").text("");
            }
        }
    });

    // Compila il campo Cd_Vettore_1 e cerco il codice corrispondente
    $("input[name='Cd_DoVettore_1']").on("keypress keydown", function (e) {
        if (e.keyCode == 9 || e.keyCode == 13) // TAB or INVIO
        {
            //reset dati
            ActivePage().find("label[name='Cd_DoVettore_1_Descrizione']").text("").removeClass("w3-red");

            var usertext = ActivePage().find("input[name='Cd_DoVettore_1']").val();
            if (!fU.IsEmpty(usertext)) {
                //Ricerca vettore
                var dt = Ajax_xmofn_DoVettore(usertext);
                if (!fU.IsEmpty(dt[0])) {
                    ActivePage().find("input[name='Cd_DoVettore_1']").val(dt[0].Cd_DoVettore);
                    ActivePage().find("label[name='Cd_DoVettore_1_Descrizione']").text(dt[0].Descrizione);
                    setTimeout(function () { ActivePage().find("input[name='Vettore1DataOra']").focus(); }, 250)
                } else {
                    ActivePage().find("label[name='Cd_DoVettore_1_Descrizione']").text("NON TROVATO").addClass("w3-red");
                    setTimeout(function () { ActivePage().find("input[name='Cd_DoVettore_1']").focus().select(); }, 250)
                }
            }

        }
    });

    // Compila il campo Cd_Vettore_2 e cerco il codice corrispondente
    $("input[name='Cd_DoVettore_2']").on("keypress keydown", function (e) {
        if (e.keyCode == 9 || e.keyCode == 13) // TAB or INVIO
        {
            //reset dati
            ActivePage().find("label[name='Cd_DoVettore_2_Descrizione']").text("").removeClass("w3-red");

            var usertext = ActivePage().find("input[name='Cd_DoVettore_2']").val();
            if (!fU.IsEmpty(usertext)) {
                //Ricerca vettore
                var dt = Ajax_xmofn_DoVettore(usertext);
                if (!fU.IsEmpty(dt[0])) {
                    ActivePage().find("input[name='Cd_DoVettore_2']").val(dt[0].Cd_DoVettore);
                    ActivePage().find("label[name='Cd_DoVettore_2_Descrizione']").text(dt[0].Descrizione);
                    setTimeout(function () { ActivePage().find("input[name = 'Vettore2DataOra']").focus(); }, 250)
                } else {
                    ActivePage().find("label[name='Cd_DoVettore_2_Descrizione']").text("NON TROVATO").addClass("w3-red");
                    setTimeout(function () { ActivePage().find("input[name='Cd_DoVettore_2']").focus().select(); }, 250)
                }
            }
        }
    });

    // Recupero prelievo da ID_DORig
    $("#pgRLRigID input[name='Id_DORig']").on("change", function (e) {
        Ajax_xmofn_xMORLRig_FIDOR_Dati($(this).val());
    });


    $("#pgPrelievi input[name='Id_DOTes']").on("keypress", function (e) {
        if (e.keyCode == 13) // Invio 
        {
            Ajax_xmofn_DOTes_Prel_4PR();
            // imposta il focus sulla pagina 
            SetFocus();
        }
    });

    // Stoccaggio Merce recupera i dati dopo la lettura dell'sscc
    $("#pgSM input[name='Cd_xMOMatricola']").on("keypress", function (e) {
        if (!fU.IsEmpty(e.target.value))
            if (e.keyCode == 9 || e.keyCode == 13) // TAB or INVIO
                Ajax_xmosp_xMOTRRig_PT_SM_Save(fU.SsccToMatricola($(this).val()), oApp.CPIeUbica);
    });

    // Stoccaggio Merce recupera i dati dopo la lettura dell'sscc
    $("#pgSM input[name='Cd_MGUbicazione_A']").on("keypress", function (e) {
        if (e.keyCode == 13) // INVIO
            if (oApp_GetLocalProperty("pgSM", "AutoConfirm"))
                SM_Save(true);
    });


    $("#pgINTMG_MAT input[name='Cd_xMOMatricola']").on("keypress", function (e) {
        if (e.keyCode == 9 || e.keyCode == 13) { // TAB or INVIO
            // Carica i dati della matricola se esistono altrimenti da la possibilità all op di crearla nuova
            var mat = fU.SsccToMatricola($(this).val())
            setTimeout(function () { Ajax_xmofn_xMOMatricola_Info(mat, 'pgINTMG_MAT'); }, 250);
        }
    });

    $("#pgINSSCC input[name='Cd_xMOMatricola']").on("keypress", function (e) {
        if (e.keyCode == 9 || e.keyCode == 13) { // TAB or INVIO
            var mat = fU.SsccToMatricola($(this).val());
            $("#pgINSSCC input[name='Cd_xMOMatricola']").val(mat);
            // Carica i dati della matricola se esistono altrimenti da la possibilità all op di crearla nuova
            setTimeout(function () { Ajax_xmofn_xMOMatricola_Info(mat, 'pgINSSCC'); }, 250);
        }
    });

    $("#pgTRSSCC input[name='Cd_xMOMatricola']").on("keypress", function (e) {
        if (e.keyCode == 9 || e.keyCode == 13) { // TAB or INVIO
            // Carica i dati della matricola se esistono altrimenti da la possibilità all op di crearla nuova
            var mat = fU.SsccToMatricola($(this).val())
            setTimeout(function () { Ajax_xmofn_xMOMatricola_Info(mat, 'pgTRSSCC'); }, 250);
        }
    });

    $("#pgINTMG_AR input[name='Cd_AR']").on("keypress", function (e) {
        if (e.keyCode == 13) {
            Ajax_xmofn_Get_AR_From_AAA($(this).val());
        }
    });

    // Trasferimenti per produzione: change della linea di produzione ricarica elenco dei P filtrati
    $("#pgTRMP_P select[name='Cd_xMOLinea']").on("change", function () {
        Ajax_xmofn_DORig_GetP();
    });


    // Trasferimenti per produzione: salvataggio del movimento interno in arca
    $("#pgTRMP_C_AR .TRMP_AR").find("input").on("keypress", function (e) {
        if (e.keyCode == 13) {
            var p = "#" + oPrg.ActivePageId + " .TRMP_AR";

            if (!fU.IsEmpty($(p).find("input[name='Cd_xMOMatricola']").val()) && !fU.IsEmpty($(p).find("input[name='Cd_xMOLinea']").val())) {

                // Controllo che la matricola è valida
                var res = Ajax_xmosp_TRMP_xMOMatricola_Validate();
                if (!res) return;

                // Controllo che la linea letta corrisponda con quella proposta
                if ($(p).find("input[name='Cd_xMOLinea']").val() == $(p).find(".Cd_xMOLinea").text()) {
                    // Genero il movimento interno in Arca
                    Ajax_xmosp_xMOTRRig_P_To_MGMov_Save();
                    // Mando il comando al listener che abbassa il residuo dell'ordine lavorazione
                    var cmd = Listener_OLI_Edit_QtaEvadibile_C();
                    Ajax_ListenerCoda_Add(cmd, 0, oPrg.Id_xMOTR_Edit);
                } else {
                    PopupMsg_Show("ERRORE", 1, 'La linea di destinazione non corrisponde a quella proposta');
                }
            }
        }
    });

    // Trasferimenti per produzione: salvataggio del movimento interno in arca
    $("#pgTRRM input[name='Cd_xMOMatricola']").on("keypress", function (e) {
        if (e.keyCode == 13) {
            if ($("#pgTRRM input[name='Cd_xMOMatricola']").val() != "")
                Ajax_xmosp_TRRM_xMOTRRig_PT_Save();
        }
    });

    // Stoccaggio Merce recupera i dati dopo la lettura dell'sscc
    $("#pgTRRM input[name='Cd_MGUbicazione_A']").on("keypress", function (e) {
        if (e.keyCode == 13) // INVIO
            if (oApp_GetLocalProperty("pgTRRM", "AutoConfirm"))
                Ajax_xmosp_TRRM_xMOTRRig_A_MGMovInt_Save(true);
    });

    // Al cambio del tipo di documento da generare deseleziona i documenti non coerenti con il nuovo doc da generare in base al flusso documentale
    $("#pgSP select").on("change", function () {
        var dosel = $(this).val();
        $("#pgSP .ck-sp:checked").each(function () {
            var docs = $(this).attr("Cd_DOs").split(",");
            var find = false;
            $.each(docs, function (key, val) {
                if (val == dosel) {
                    find = true;
                }
            });
            if (!find) $(this).prop("checked", false);
        });
    });

    // Evento per effettuare i controlli sullo stato del cliente di Arca
    $("input[name='Cd_CF']").on("change", function () {
        // Chiamata Ajax per controllare se risulta bloccato
        Ajax_xmosp_CF_Validate($(this).val());
    });

    $("#pgINM2Rig input[name='Cd_AR'").on("change", function () {
        // Verifica che l'articolo preso in carico non sia in carico ad altri OP, nel caso visualizza un messaggio
        Ajax_xmofn_xMOIN_Op_AR_Validate_M2();
        // Salva che l'operatore ha preso in carico l'articolo
        Ajax_xmosp_xMOIN_Op_Save_M2(oPrg.Id_xMOINM2_Edit, oApp.Cd_Operatore, $(this).val(), $("#pgINM2Rig input[name='Cd_MGUbicazione']").val(), fU.SsccToMatricola($("#pgINM2Rig input[name='Cd_xMOMatricola']").val()), true);
        // Recupera la giacenza e le quantità rilevate per l'articolo
        Ajax_xmofn_xMOIN_AR_Giac_M2();
    });

    // All'invio sul btn-confirm di pgRLRig confermo la lettura
    $("#pgINM2Rig .btn-confirm").keydown(function (btn) {
        if (btn.keyCode == 13) // INVIO
            Confirm_xMOINM2Rig_AR();
    });


    // Inizializzazione eventi personalizzati
    Init_Pers();

    // ATTENZIONE: Questo evento deve essere assegnato come ultimo !!!!!! 
    // ATTENZIONE: L'evento NON viene bindato agli oggetti che hanno l'attributo "tabman=true" in quanto getiscono il focus manualmente!!!
    $("[tabindex][tabman!='true']").keypress(function (e) {
        if (e.keyCode == 13) {
            Find_Next_Tabindex();
        }
    });

    $("#DetailGiacenza header img.update").click(function (e) {
        e.preventDefault();
        // Svuoto e temporizzo per far capire all'operatore che è avvunuto il refresh
        $("#DetailGiacenza .tr-giac").remove();
        setTimeout(function () {
            Detail_Ajax_xmofn_ARMGUbicazione_Giac(oPrg.DetailGiacenza.Cd_AR, oPrg.DetailGiacenza.Cd_MG);
        }, 250);
    });

    $("#DetailGiacenza input.ck-pkpesi").change(function () {
        Detail_Giacenza_Filtro();
    });

    $("#DetailGiacenzaUbicazione header img.update").click(function (e) {
        e.preventDefault();
        // Svuoto e temporizzo per far capire all'operatore che è avvunuto il refresh
        $("#DetailGiacenzaUbicazione .tr-giac").remove();
        setTimeout(function () {
            Detail_Ajax_xmofn_MGUbicazioneAR_Giac();
        }, 250);
    });

    // Click sui campi Search .filtro
    $("#pgTRMP_P input[name='Query']").keydown(function (e) {
        if (e.keyCode == 13)   //Enter
            pgTRMP_P_Filter();
    });

    $("#pgTRMP_C_AR input[name='Query']").keydown(function (e) {
        if (e.keyCode == 13)   //Enter
            pgTRMP_C_AR_Filter();
    });

    $("#pgRLPK_R input[name='PackListRef_R']").on("keypress", function (e) {
        if (e.keyCode == 13) {
            // Se sono in edit eseguo il check del dato
            if (oPrg.Id_xMORL_Edit > 0)
                Ajax_xmosp_xMORLPackListRef_R_Check($(this).val());
            else
                Ajax_xmosp_xMORLPackListRef_R_FirstValidate($(this).val());
        }
    });

    // ASSEGNAZIONE EVENTI End

    //Nascondo tutti i check per Ubicazione Completata
    if (!oApp.xMOImpostazioni.MagUbiCompleta) {
        Array.prototype.slice.call($(".ck-xMOCompleta")).forEach(function (item) {
            item.disabled = true;
            $(item.parentElement).hide();
        });
    }

    //Assegno all'UI i dati di LocalStorage
    if (oApp.LocalConfig) {
        //pgSM
        document.querySelector("#pgSM .ck-autoconfirm").checked = oApp_GetLocalProperty("pgSM", "AutoConfirm");
        //pgTRRM
        document.querySelector("#pgTRRM .ck-autoconfirm").checked = oApp_GetLocalProperty("pgTRRM", "AutoConfirm");
        //pgGENCARICHI
        document.querySelector("#pgGENCARICHI .ck-autoconfirm").checked = oApp_GetLocalProperty("pgGENCARICHI", "AutoConfirm");
        //pgTRSSCC
        document.querySelector("#pgTRSSCC .ck-autoconfirm").checked = oApp_GetLocalProperty("pgTRSSCC", "AutoConfirm");
    }




    // Gestione del menù
    Menu_Init();

    // Gestione del sotto menu
    SottoMenu_Init();

    // Gestisce le pers
    LWA_Pers();

    // Vado alla home page
    GoHome();

        // Contro
        // vedi anche Logistica.Popup_PackList_New_Load() per il focus
        switch (oApp.LicF_Id) {
            case 33076: //MD
            case 99370: //Versya
                $('div[name="ctlPackListBC"]').show();

                $('input[name="ckPackListBC"]')
                    .prop("checked", UserParam.getLocal("ctlPackListBCEnabled", false, Boolean))
                    .on('click', function (e) {
                        UserParam.setLocal("ctlPackListBCEnabled", e.target.checked)
                    })
                    .on("change", function () {
                        $('input[name="PackListBC"]').prop('disabled', !UserParam.getLocal("ctlPackListBCEnabled", false, Boolean));
                        if (UserParam.getLocal("ctlPackListBCEnabled", false, Boolean)) {
                            $('#Popup_PackList_New input[name="PackListBC"]').focus().select();
                        } else {
                            $('input[name="PackListBC"]').removeClass("w3-red");
                            $('input[name="PackListBC"]').val("");
                            $('input[name="PackListRef"]').focus().select();
                        }
                    }).change();

                $('input[name="PackListBC"]').on("keypress", function (e) {
                    if (e.which == 13) {
                        $('select[name="Cd_xMOUniLog"] > option').each(function () {
                            this.selected = (this.value.toUpperCase() == e.target.value.toUpperCase());
                        });
                        if ($('select[name="Cd_xMOUniLog"] > option:selected').val() === '') {
                            $('input[name="PackListBC"]').focus().select();
                            $('input[name="PackListBC"]').addClass("w3-red");
                        } else {
                            $('input[name="PackListBC"]').val("");
                            $('input[name="PackListBC"]').removeClass("w3-red");
                            $('input[name="PackListRef"]').focus().select();
                        };
                        $('input[name="ckPackListBC"]').val('');
                    }
                })

                $('input[name="PackListRef"]').on('focus', function () {
                    if (UserParam.getLocal("ctlPackListBCEnabled", false, Boolean)
                        && $('input[name="PackListBC"]').val() === '')
                        $('input[name="ckPackListBC"]').focus().select();
                })
                break;
        }
    
}

function LWA_Pers() {
    if (oApp.LicF_Id == 2173090) {
        $(".lg-menuavanti").hide();
    }
}

// Logout
function LogOff() {
    oApp.Logon = false;
    fU.SetSession(oApp);
    location.assign("default.htm");
}

// Torna alla home page e ripulisce le variabili
function GoHome(force) {

    if (fU.ToBool(force))
        oApp.SottoMenuAttivo = null;

    switch (oPrg.ActivePageId) {
        case "pgTR":
        case "pgTRRig_P":
        case "pgTRRig_A":
        case "pgTRPiede":
            break;
        case "pgSM":
            // Lo stoccaggio cancella sempre l'eventuale TR in edit in quanto ne apre sempre uno
            if (fU.ToInt32(oPrg.Id_xMOTR_Edit) > 0)
                Ajax_xmosp_xMOTR_Delete(oPrg.Id_xMOTR_Edit);
            break;
        default:
            break;
    }

    // Reset della variabile oPrg
    oPrg.Reset();
    // Pulisco tutte le pagine
    oPrg.ResetPages();

    // Hide della navigazione
    $(".nav-next").hide();
    $(".nav-back").hide();

    //Mostra i preferiti e nasconda il settaggio dei preferiti
    Nav.prefShow();

    // Nascondo la section c1 dell'header 
    $("#header .c1").addClass("w3-hide"); // fnl

    // Verifico se devo andare al sotto menu (solo se la direzione è indietro)
    if (!fU.IsNull(oApp.SottoMenuAttivo)) {
        // Show della pagina sotto menu
        fPage.Show("pgSottoMenu");
    } else {
        // Recupero il numero di Documenti Aperti
        Ajax_xmofn_DOAperti();

        // Se ci sono doc. aperti mostro il numero sulla voce di menu
        if (!oPrg || oPrg.DA.length == 0)
            $("#pgHome #ulMenu li#menu-da .lg-tag").hide();
        else {
            $("#pgHome #ulMenu li#menu-da .lg-tag").text(oPrg.DA.length);
            $("#pgHome #ulMenu li#menu-da .lg-tag").show();
        }

        // Show della home page e reset della navigazione
        fPage.Show("pgHome");
        Nav.OnNav = false;
    }
}

// Gestisce il sotto menu
function GoToSottoMenu(c) {
    // Memorizzo il sotto menu corretto
    oApp.SottoMenuAttivo = c;
    // Show del sotto menu
    $("#ulSottoMenu li.menu-doc").hide();
    $("#ulSottoMenu li." + c).show();
    // Visualizzo il sotto menu corretto
    GoHome();
}

// Inizializzazione del Menù 
function Menu_Init() {

    //rimuove gli eventuali menù personalizzati
    $("#pgHome li.menu-us").remove();

    //Se esistono menù personalizzati li genera dal template
    if (!fU.IsEmpty(oApp.dtxMOMenu)) {
        // clono il li di template
        var li = $("#menu-us-template").clone().removeAttr("id").removeAttr("style").addClass("menu-us");

        $.each(oApp.dtxMOMenu, function (key, dr) {
            $(Menu_Template(li.clone(), dr, key)).insertAfter("#menu-us-template");
        });
    }

    //Se esistono pers attive le carica a menù
    switch (oApp.LicF_Id) {
        case 33076: //MD
        case 48275: //CASH
        case 23938:
        case 4361:

            // Aggiunge la pers per Cash
            var li = $("#menu-pers-template").clone().removeAttr("id").removeAttr("style").addClass("menu-pers");
            li.clone()
            li.attr('key', 'CHS00012').attr('onclick', 'oPrg.Load("CHS00012");');
            li.find('span').text('SCELTA');
            $(li).insertAfter("#menu-pers-template");
            break;
    }

    //Nasconde il template
    $("#menu-us-template").hide();

    //Mostra l'utente corrente
    $("#pgHome").find("#username").text("Utente attivo: " + oApp.Cd_Operatore + " - " + oApp.Ditta + " - Ver. " + Versione);
}

// Creo un elemento del menu
function Menu_Template(li, item, key) {

    li.attr("key", key).attr("onclick", "oPrg.Load('" + fU.UpTrim(item.Cd_xMOProgramma) + "', '" + item.Cd_DO + "');");
    //li.attr("key", key).attr("onclick", "oPrg.Load('" + fU.UpTrim(item.Cd_xMOProgramma) + "', '" + fU.ToString(item.Cd_DO) + "', '', '')");
    li.addClass("menu-us");
    li.attr("id", "menu-us-" + fU.LoTrim(item.Cd_xMOProgramma));
    if (!fU.IsEmpty(item.Icona)) {
        li.find(".lg-menuico").attr("src", item.Icona);
    }
    if (!fU.IsEmpty(item.Colore)) {
        li.find("i").css("background-color", "#" + item.Colore);
    } else {
        li.find("i").addClass("mo-teal");
    }
    li.find("span").text(item.Descrizione);
    return li;
}

// Inizializzazione dei documenti nel sottomenu
function SottoMenu_Init() {
    // clono il li di template
    var li = $("#SottomenuTemplate").clone().removeAttr("id").removeAttr("style").addClass("menu-doc");

    if (!fU.IsNull(oApp.dtDO)) {

        //Aggiunge TUTTI I DOC CONFIGURATI IN ARCA 
        $.each(oApp.dtDO, function (key, dr) {
            $("#ulSottoMenu").append(Sottomenu_Template(li.clone(), dr, key));
        });

        // Se l'inventario è disabilitato nascondo la voce di menu
        if (!fU.ToBool(oApp.xMOImpostazioni.MovInvAbilita)) {
            $("#menu-in").hide();
        }

        // Se i trasferimenti sono disabilitati nascondo la voce di menu
        if (!fU.ToBool(oApp.xMOImpostazioni.MovTraAbilita)) {
            $("#menu-tr").hide();
        }
    }

    //INVENTARIO: Aggiunge le voci di inventario massivo - puntuale - matricola (fisse)
    $("#ulSottoMenu").append(Sottomenu_Template(li.clone(), Sottomenu_IN_Massivo(), -1));
    $("#ulSottoMenu").append(Sottomenu_Template(li.clone(), Sottomenu_IN_Puntuale(), -2));
    $("#ulSottoMenu").append(Sottomenu_Template(li.clone(), Sottomenu_IN_Matricola(), -3));
    $("#ulSottoMenu").append(Sottomenu_Template(li.clone(), Sottomenu_INM2(), -4));

    //TRASFERIMENTI: Aggiunge le voci di trasferimenti interni - matricola - produzione (fisse)
    $("#ulSottoMenu").append(Sottomenu_Template(li.clone(), Sottomenu_TR(), -1));
    $("#ulSottoMenu").append(Sottomenu_Template(li.clone(), Sottomenu_TR_Matricola(), -2));
    $("#ulSottoMenu").append(Sottomenu_Template(li.clone(), Sottomenu_TR_UBPA(), -3));
    $("#ulSottoMenu").append(Sottomenu_Template(li.clone(), Sottomenu_RS(), -4));

    //Interrogazione Magazzino: Aggiunge le voci matricola - articolo (fisse)
    $("#ulSottoMenu").append(Sottomenu_Template(li.clone(), Sottomenu_IntMG_AR(), -2));
    if (oApp.xMOImpostazioni.MatricolaAbilita) {
        $("#ulSottoMenu").append(Sottomenu_Template(li.clone(), Sottomenu_IntMG_Matricola(), -1));
        $("#ulSottoMenu").append(Sottomenu_Template(li.clone(), Sottomenu_IntMG_UbiMat(), -3));
    }

    // Se attivi nella configurazione in arca abilito la voce trasferimenti per produzione e per rientro merce da prod.
    if (fU.ToBool(oApp.xMOImpostazioni.PrdAbilita) && !fU.IsEmpty(oApp.xMOImpostazioni.PrdCd_MG) && !fU.IsEmpty(oApp.xMOImpostazioni.PrdCd_DO)) {
        $("#ulSottoMenu").append(Sottomenu_Template(li.clone(), Sottomenu_TRMP(), -3));
        if (oApp.LicF_Id != 66809) //Consorzio Logic non vuole il menù --> faranno il rientro con Sdoppia matricola
            $("#ulSottoMenu").append(Sottomenu_Template(li.clone(), Sottomenu_TRRM(), -4));
    }
    //Produzione: Avvio Consumo e Generazione Carichi (fisse)
    $("#ulSottoMenu").append(Sottomenu_Template(li.clone(), Sottomenu_GenCarichi(), -2));
    $("#ulSottoMenu").append(Sottomenu_Template(li.clone(), Sottomenu_Consumo(), -1));

    if (oApp.LicF_Id == 76670 || oApp.LicF_Id == 4361 || oApp.LicF_Id == 33076)
        $("#ulSottoMenu").append(Sottomenu_Template(li.clone(), Sottomenu_PRTR(), -5));

    //Gestione voci di menù principali 

    //1) I doc con programma PR attivano il menù principale dei Prelievi
    if ($("#ulSottoMenu [xCd_xMOProgramma='PR']").length == 0) { $("#menu-pr").hide(); }

    //1.1) I doc con programma PR vengono nascosti
    //$("#ulSottoMenu [xCd_xMOProgramma='PR']").remove(); 

    //2.0) I doc con programma SP attivano il menù principale delle spedizioni se l'impostazione spedizione è abilitata
    if ($("#ulSottoMenu [xCd_xMOProgramma='SP']").length == 0 || !oApp.xMOImpostazioni.SpeAbilita) {
        //Non sono presenti Doc con Programma SP: nasconde la voce di menù
        $("#menu-sp").hide();
    }

    //Stoccaggio merce abilitato solo se la gestione matricola è attiva
    if (!oApp.xMOImpostazioni.MatricolaAbilita) {
        $("#menu-sm").hide();
    }

    //Produzione documentale P e C abilitato solo se i carichi sono abilitati
    if (!oApp.xMOImpostazioni.PrdAbilita) {
        $("#menu-prd").hide();
    }

    //2.1) I doc con programma SP attivano il menù principale delle spedizioni
    //e vengono quindi eliminati come programmi del ciclo attivo, passivo o altro
    $("#ulSottoMenu [xCd_xMOProgramma='SP']").remove();

    //3.0) I doc con programma LC attivano il menù principale delle liste di carico
    if ($("#ulSottoMenu [xCd_xMOProgramma='LC']").length == 0) {
        //Non sono presenti Doc con Programma LC: nasconde la voce di menù
        $("#menu-us-lc").hide();
    }
    //3.1) I doc con programma LC attivano il menù principale delle liste di carico
    //e vengono quindi eliminati come programmi del ciclo attivo, passio o altro
    $("#ulSottoMenu [xCd_xMOProgramma='LC']").remove();

    //6) Disattiva le voci di menù principali se non hanno doc all'interno
    if ($("#ulSottoMenu .menu-cp").length == 0) { $("#menu-cp").hide(); }
    if ($("#ulSottoMenu .menu-ca").length == 0) { $("#menu-ca").hide(); }
    if ($("#ulSottoMenu .menu-ad").length == 0) { $("#menu-ad").hide(); }
    if ($("#ulSottoMenu .menu-tr").length == 0) { $("#menu-tr").hide(); }
    if ($("#ulSottoMenu .menu-in").length == 0) { $("#menu-in").hide(); }
}

// Creo un elemento del sotto menu
function Sottomenu_Template(li, item, key) {

    li.attr("key", key).attr("onclick", "oPrg.Load('" + fU.UpTrim(item.xCd_xMOProgramma) + "', '" + item.Cd_DO + "')");
    li.attr("xCd_xMOProgramma", fU.UpTrim(item.xCd_xMOProgramma));
    li.addClass("menu-" + item.Ciclo + " menu-doc");
    li.find(".doc-nome").text(item.Cd_DO);
    li.find(".doc-desc").text(item.DO_Descrizione.length > 35 ? item.DO_Descrizione.substring(0, 30) + '...' : item.DO_Descrizione);
    // Carico l'icona del documento in base al ciclo di appartenenza
    li.find(".lg-menuico").attr("src", "icon/Documento" + item.Ciclo + ".svg");

    return li;
};

// Dr per Template Inventario Massivo
function Sottomenu_IN_Massivo() {
    var drInMas = {
        "xCd_xMOProgramma": "INM"
        , "Cd_DO": "MASSIVO"
        , "Ciclo": "in"
        , "DO_Descrizione": "Inventario Massivo"
    }
    return drInMas;
}

// Dr per Template Inventario Puntuale
function Sottomenu_IN_Puntuale() {
    var drInPun = {
        "xCd_xMOProgramma": "INP"
        , "Cd_DO": "PUNTUALE"
        , "Ciclo": "in"
        , "DO_Descrizione": "Inventario Puntuale"
    }
    return drInPun;
}

function Sottomenu_IN_Matricola() {
    var drInMat = {
        "xCd_xMOProgramma": "INMAT"
        , "Cd_DO": "MATRICOLA"
        , "Ciclo": "in"
        , "DO_Descrizione": "Inventario Per Matricola"
    }
    return drInMat;
}

function Sottomenu_INM2() {
    var drInm2 = {
        "xCd_xMOProgramma": "INM2"
        , "Cd_DO": "CONDIVISO"
        , "Ciclo": "in"
        , "DO_Descrizione": "Inventario Condiviso"
    }
    return drInm2;
}

// Dr per Template Trasferimenti Interni
function Sottomenu_TR() {
    var drTr = {
        "xCd_xMOProgramma": "TI"
        , "Cd_DO": "TRASFERIMENTI"
        , "Ciclo": "tr"
        , "DO_Descrizione": "Trasferimenti Interni"
    }
    return drTr;
}

// Dr per Template Trasferimenti Interni per Matricola
function Sottomenu_TR_Matricola() {
    var drTrMat = {
        "xCd_xMOProgramma": "TIMAT"
        , "Cd_DO": "MATRICOLA"
        , "Ciclo": "tr"
        , "DO_Descrizione": "Trasferimenti Per Matricola"
    }
    return drTrMat;
}

// Dr per Template Trasferimenti Interni
function Sottomenu_TR_UBPA() {
    var drTr_UBPA = {
        "xCd_xMOProgramma": "TR-UBPA"
        , "Cd_DO": "TRASFERIMENTO INTERNO UBICAZIONE"
        , "Ciclo": "tr"
        , "DO_Descrizione": "Trasferimento Interno ubicazione"
    }
    return drTr_UBPA;
}

// Dr per Template Reintegro scorta
function Sottomenu_RS() {
    var drTrMat = {
        "xCd_xMOProgramma": "RS-AT"
        , "Cd_DO": "RS-AT"
        , "Ciclo": "tr"
        , "DO_Descrizione": "Reintegro scorta"
    }
    return drTrMat;
}

// Dr per Template Trasferimenti Per produzione
function Sottomenu_TRMP() {
    var drTrMp = {
        "xCd_xMOProgramma": "TRMP"
        , "Cd_DO": "PRODUZIONE"
        , "Ciclo": "prd"
        , "DO_Descrizione": "Trasferimenti Per Produzione"
    }
    return drTrMp;
}

function Sottomenu_TRRM() {
    var drTrRm = {
        "xCd_xMOProgramma": "TRRM"
        , "Cd_DO": "RIENTRO COMPONENTI"
        , "Ciclo": "prd"
        , "DO_Descrizione": "Rientro componenti da prod."
    }
    return drTrRm;
}

function Sottomenu_IntMG_Matricola() {
    var drIntMGMat = {
        "xCd_xMOProgramma": "INTMGMAT"
        , "Cd_DO": "MATRICOLA"
        , "Ciclo": "intmg"
        , "DO_Descrizione": "Matricola"
    }
    return drIntMGMat;
}

function Sottomenu_IntMG_AR() {
    var drIntMGAR = {
        "xCd_xMOProgramma": "INTMGAR"
        , "Cd_DO": "ARTICOLO"
        , "Ciclo": "intmg"
        , "DO_Descrizione": "Articolo"
    }
    return drIntMGAR;
}

function Sottomenu_IntMG_UbiMat() {
    var drIntMGUbiMat = {
        "xCd_xMOProgramma": "INTMGUM"
        , "Cd_DO": "UBIMAT"
        , "Ciclo": "intmg"
        , "DO_Descrizione": "Ubicazione - Matricole"
    }
    return drIntMGUbiMat;
}

function Sottomenu_Consumo() {
    var drConsumo = {
        "xCd_xMOProgramma": "AC"
        , "Cd_DO": "PRD"
        , "Ciclo": "prd"
        , "DO_Descrizione": "Avvio Consumo"
    }
    return drConsumo;
}

function Sottomenu_PRTR() {
    return {
        "xCd_xMOProgramma": "PRTR"
        , "Cd_DO": "PRD"
        , "Ciclo": "prd"
        , "DO_Descrizione": "BOLLA - Trasfer. mat. x fase"
    }
}

function Sottomenu_GenCarichi() {
    var drGenCar = {
        "xCd_xMOProgramma": "GENCAR"
        , "Cd_DO": "PRD"
        , "Ciclo": "prd"
        , "DO_Descrizione": "Generazione Carichi"
    }
    return drGenCar;
}

// Apertura del programma Documenti Aperti
function DocAperti_Apri(li) {
    // Load del programma
    oPrg.Load(li.attr('keyprg'));
}

// Carica la ricerca in base all'icona cliccata 
function Search_Open(icon) {

    //Svuoto tutti i campi filtro dei modal di ricerca
    $(".filtro").text("");

    //Chiave di ricerca 
    var searchkey = icon.attr("searchkey");
    oPrg.ActiveSearchOutField = searchkey; //Memorizzo la serchkey del campo

    //Valore presente nel campo di output di ricerca
    var searchvalue = fU.ToString($("#" + oPrg.ActivePageId).find("input[name='" + searchkey + "']").val())
    //Se il campo di ricerca è pieno lo inserisce in modo da scatenare la selezione del valore
    oPrg.ActiveSearchValue = searchvalue;

    //Titolo della ricerca
    var searchtitle = fU.ToString(icon.attr("searchtitle"));

    switch (searchkey) {
        case "Cd_CF":
            // Imposta il titolo del modal di ricerca come cliente o fornitore
            if (fU.IsNull(oPrg.drDO)) $("#SearchCF .title").text("Clienti / Fornitori");
            else if (oPrg.drDO.CliFor == 'C') $("#SearchCF .title").text("Clienti");
            else if (oPrg.drDO.CliFor == 'F') $("#SearchCF .title").text("Fornitori");
            else $("#SearchCF .title").text("?? CF ??");
            // fnl
            //switch (oPrg.drDO.xMOPrelievo) {
            //    case 0:
            //        $("#SearchCF .title").append(" (senza Prelievo)");
            //        break;
            //    case 1:
            //        $("#SearchCF .title").append(" (con " + (oPrg.drDO.xMOPrelievoObb ? " obbligo di " : " possibile ") + "Prelievo)");
            //        break;
            //    case 2:
            //        $("#SearchCF .title").append(" (con " + (oPrg.drDO.xMOPrelievoObb ? " obbligo di " : " possibile ") + "Copia Righe)");
            //        break;
            //}
            oPrg.ActiveSearchId = "SearchCF";   //Memorizza la ricerca corrente
            Search_Ajax_xmofn_CF();
            break;
        case "Cd_CFDest":
            oPrg.ActiveSearchId = "SearchCFDest";   //Memorizza la ricerca corrente
            Search_Ajax_xmofn_CFDest();
            break;
        case "Cd_AR":
            //Memorizza la ricerca corrente
            oPrg.ActiveSearchId = "SearchAR";   //Memorizza la ricerca corrente
            Search_Ajax_xmofn_AR();
            break;
        case "Cd_MG":
        case "Cd_MG_P":
        case "Cd_MG_A":
            oPrg.ActiveSearchId = "SearchMG";   //Memorizza la ricerca corrente
            $("#SearchMG .title").text(searchtitle);
            Search_Ajax_xmofn_MG();
            break;
        case "Cd_MGUbicazione":
        case "Cd_MGUbicazione_P":
        case "Cd_MGUbicazione_A":
            $("#SearchMGUbicazione .title").text(searchtitle);
            //ATTENZIONE la ricerca funziona sia per Partenza, Arrivo che spersonalizzato! Sarà Search_Close ad assegnare il campo corretto
            oPrg.ActiveSearchId = "SearchMGUbicazione"; //Memorizza la ricerca corrente
            Search_Ajax_xmofn_MGUbicazione();
            break;
        case "Cd_ARLotto":
            oPrg.ActiveSearchId = "SearchARLotto";  //Memorizza la ricerca corrente
            Search_Ajax_xmofn_ARLotto();
            break;
        case "Cd_DOSottoCommessa":
            oPrg.ActiveSearchId = "SearchDOSottoCommessa";
            Search_Ajax_xmofn_xMODOSottoCommessa();
            break;
        case "Cd_DOCaricatore":
            oPrg.ActiveSearchId = "SearchDOSdTAnag";
            oPrg.ActiveSearchContext = "Caricatore"
            Search_Ajax_xmofn_DOSdTAnag('DOCaricatore');
            break;
        case "Cd_DoCommittente":
            oPrg.ActiveSearchId = "SearchDOSdTAnag";
            oPrg.ActiveSearchContext = "Committente"
            Search_Ajax_xmofn_DOSdTAnag('DoCommittente');
            break;
        case "Cd_DoProprietarioMerce":
            oPrg.ActiveSearchId = "SearchDOSdTAnag";
            oPrg.ActiveSearchContext = "Proprietario Merce"
            Search_Ajax_xmofn_DOSdTAnag('DoProprietarioMerce');
            break;
        case "Cd_DoLuogoCarico":
            oPrg.ActiveSearchId = "SearchDOSdTAnag";
            oPrg.ActiveSearchContext = "Luogo Carico"
            Search_Ajax_xmofn_DOSdTAnag('DoLuogoCarico');
            break;
        case "Cd_DoLuogoScarico":
            oPrg.ActiveSearchId = "SearchDOSdTAnag";
            oPrg.ActiveSearchContext = "Luogo Scarico"
            Search_Ajax_xmofn_DOSdTAnag('DoLuogoScarico');
            break;
        case "Cd_DoTrasporto":
            oPrg.ActiveSearchId = "SearchCdDes";
            oPrg.ActiveSearchContext = "Trasporto"
            Search_Ajax_xmofn_CdDes('DoTrasporto');
            break;
        case "Cd_DoSped":
            oPrg.ActiveSearchId = "SearchCdDes";
            oPrg.ActiveSearchContext = "Spedizione"
            Search_Ajax_xmofn_CdDes('DoSped');
            break;
        case "Cd_DoPorto":
            oPrg.ActiveSearchId = "SearchCdDes";
            oPrg.ActiveSearchContext = "Porto"
            Search_Ajax_xmofn_CdDes('DoPorto');
            break;
        case "Cd_DoAspBene":
            oPrg.ActiveSearchId = "SearchCdDes";
            oPrg.ActiveSearchContext = "Aspetto Beni"
            Search_Ajax_xmofn_CdDes('DoAspBene');
            break;
        case "Cd_xMOCodSpe":
            oPrg.ActiveSearchId = "SearchxMOCodSpe"; //Memorizza la ricerca corrente
            Search_Ajax_xmofn_Spedizione();
            break;
        case "Cd_ARMisura":
            oPrg.ActiveSearchId = "SearchARARMisura"; //Memorizza la ricerca corrente
            Search_Ajax_xmofn_ARARMisura();
            break;
        case "Cd_DoVettore_1": case "Cd_DoVettore_2":
            oPrg.ActiveSearchId = "SearchCd_DoVettore"; //Memorizza la ricerca corrente
            Search_Ajax_xmofn_DoVettore();
            break;
        default:
            PopupMsg_Show("ERRORE", 1, "Errore di gestione del Search_Open() del campo " + searchkey);
            break;
    }

    if (oPrg.ActiveSearchId != "") {
        //Imposto già il focus sulla pagina chiamante
        ActivePage().find("input[name='" + oPrg.ActiveSearchOutField + "']").focus();
        //Apro la ricerca
        $("#" + oPrg.ActiveSearchId).show();
        $("#" + oPrg.ActiveSearchId + " .filtro").focus().select();
        $("#" + oPrg.ActiveSearchId + " .filtro").val(oPrg.ActiveSearchValue);
    }
}

// Pulisce la ricerca
function Search_Clear() {
    $("#" + oPrg.ActiveSearchId).find(".mo-search").val("").focus().select();
    setTimeout(Filtro_Execute, 250, $("#" + oPrg.ActiveSearchId).find(".mo-search"), "", false);
}
// Chiude il modal della ricerca e riempe i campi nella pg corrente
function Search_Close(itemsel) {
    if (!fU.IsNull(itemsel)) {
        //La ricerca si è conclusa con un elemento da assegnare
        switch (oPrg.ActiveSearchId) {
            case 'SearchCF':
                // Assegna il CF
                ActivePage().find("input[name='" + oPrg.ActiveSearchOutField + "']").val(itemsel.attr("Cd_CF")).focus();
                ActivePage().find("label[name='CF_Descrizione']").text(itemsel.attr("Descrizione"));
                // Gestione del CFDest
                // Show del campo SO se ci sono destinazioni per il cliente selezionato
                fU.ShowIf(ActivePage().find(".div-dest"), fU.ToBool(itemsel.attr("Destinazioni")));
                // Se esiste destinazione di default la inserisce nel campo SO
                ActivePage().find("input[name='Cd_CFDest']").val(fU.ToString(itemsel.attr("CFDest_Default")));
                ActivePage().find("label[name='CFDest_Descrizione']").text(fU.ToString(itemsel.attr("CFDest_Descrizione")));
                break;
            case 'SearchCFDest':
                ActivePage().find("input[name='" + oPrg.ActiveSearchOutField + "']").val(fU.ToString(itemsel.attr("Cd_CFDest"))).focus();
                ActivePage().find("label[name='CFDest_Descrizione']").text(fU.ToString(itemsel.attr("Descrizione")));
                ActivePage().find("input[name='Cd_CF']").val(fU.ToString(fU.ToString(itemsel.attr("Cd_CF"))));
                ActivePage().find("label[name='CF_Descrizione']").text(fU.ToString(itemsel.attr("CF_Descrizione")));
                break;
            case 'SearchAR':
                ActivePage().find("select[name='Cd_ARMisura'] .op-um").remove();
                ActivePage().find("input[name='" + oPrg.ActiveSearchOutField + "']").val(itemsel.attr("Cd_AR")).focus().change();
                ActivePage().find("label[name='" + oPrg.ActiveSearchOutField + "']").html(itemsel.attr("Cd_AR"));
                ActivePage().find("label[name='AR_Descrizione']").html(itemsel.attr("Descrizione"));
                break;
            case 'SearchMG':
                //Assegna il valore del magazzino selezionato
                ActivePage().find("input[name='" + oPrg.ActiveSearchOutField + "']").val(itemsel.attr("Cd_MG")).focus();
                //Assegna l'etichetta come il valore del magazzino selezionato 
                ActivePage().find("." + oPrg.ActiveSearchOutField.toLowerCase()).text(itemsel.attr("Cd_MG"));
                break;
            case 'SearchMGUbicazione':
                ActivePage().find("input[name='" + oPrg.ActiveSearchOutField + "']").val(itemsel.attr("Cd_MGUbicazione")).focus();
                //Discrimina se il magazzino è quello di partenza, di arrivo o un codice Cd_MG per assegnare il valore corretto
                var mgPA = fMG.Mg4PA(oPrg.ActiveSearchOutField);
                ActivePage().find("input[name='Cd_MG" + mgPA + "']").val(itemsel.attr("Cd_MG"));
                break;
            case 'SearchARLotto':
                ActivePage().find("input[name='" + oPrg.ActiveSearchOutField + "']").val(itemsel.attr("Cd_ARLotto")).focus();
                ActivePage().find("input[name='Cd_AR']").val(itemsel.attr("Cd_AR"));
                if (ActivePage().find("input[name='Cd_MG_P']").is(":visible") && fU.IsEmpty(ActivePage().find("input[name='Cd_MG_P']").val())) {
                    ActivePage().find("input[name='Cd_MG_P']").val(itemsel.attr("Cd_MG"));
                    ActivePage().find("input[name='Cd_MGUbicazione_P']").val(itemsel.attr("Cd_MGUbicazione"));
                }
                else if (ActivePage().find("input[name='Cd_MG_A']").is(":visible") && fU.IsEmpty(ActivePage().find("input[name='Cd_MG_A']").val())) {
                    ActivePage().find("input[name='Cd_MG_A']").val(itemsel.attr("Cd_MG"));
                    ActivePage().find("input[name='Cd_MGUbicazione_A']").val(itemsel.attr("Cd_MGUbicazione"));
                }
                break;
            case 'SearchDOSottoCommessa':
                ActivePage().find("input[name='" + oPrg.ActiveSearchOutField + "']").val(itemsel.attr("Cd_DOSottoCommessa")).focus();
                break;
            case 'SearchCdDes':
            case 'SearchDOSdTAnag':
                switch (oPrg.ActiveSearchContext) {
                    case 'Caricatore':
                    case 'Committente':
                    case 'Luogo Carico':
                    case 'Luogo Scarico':
                    case 'Proprietario Merce':
                    case 'Spedizione':
                    case 'Trasporto':
                    case 'Porto':
                    case 'Aspetto Beni':
                        ActivePage().find("input[name='" + oPrg.ActiveSearchOutField + "']").val(itemsel.attr("cd")).focus();
                        ActivePage().find("label[name='" + oPrg.ActiveSearchOutField + "_Descrizione']").text(fU.ToString(itemsel.attr("des")));
                        break;
                }
                break;
            case "SearchxMOCodSpe":
                ActivePage().find("input[name='" + oPrg.ActiveSearchOutField + "']").val(itemsel.attr("Cd_xMOCodSpe")).focus();
                Spedizione_Load();
                break;
            case "SearchARARMisura":
                ActivePage().find("input[name='" + oPrg.ActiveSearchOutField + "']").val(itemsel.attr("Cd_ARMisura"));
                break;
            case "SearchCd_DoVettore":
                ActivePage().find("input[name='" + oPrg.ActiveSearchOutField + "']").val(itemsel.attr("Cd_DoVettore_1"));
                ActivePage().find("label[name='" + oPrg.ActiveSearchOutField + "_Descrizione']").text(fU.ToString(itemsel.attr("Descrizione")));
                break;
            default:
                PopupMsg_Show("ERRORE", 1, "Errore di gestione del Search_Close() del modal " + oPrg.ActiveSearchId);
                break;
        }
        //Scateno l'onkeyup
        ActivePage().find("input[name='" + oPrg.ActiveSearchOutField + "']").keyup().change();
    }

    //Chiudo la ricerca e svuoto la lista
    $("#" + oPrg.ActiveSearchId).hide();
    $("#" + oPrg.ActiveSearchId + " .li-search").remove();
    // fnl
    ActivePage().show();

    //Scateno l'evento 'Quantita_Onfocus' per valorizzare la Qta
    Quantita_Onfocus();

    //SetFocus();
    Find_Next_Tabindex();
}

var SearcExtFld = {
    "source": null,     //tavola SQL
    "dest": null,       //campo di destinazione    
    "dt": null,
    "open": function (source, inpname, title) {
        var dest = ActivePage().find(".div-extfld").find("input[name='" + inpname + "']");
        var val = dest.val()
        //Memorizza i dati
        SearcExtFld.source = source;
        SearcExtFld.dest = dest;
        // Carica la ricerca in base all'icona cliccata 
        var pg = $("#SearchExtFld");
        //Svuoto tutti i campi filtro dei modal di ricerca
        pg.find(".title").text(title);
        pg.find(".filtro").val(val);
        pg.find(".filtro").focus().select();
        pg.find(".ricerca").text("Ricerca...");
        //Carica la lista
        this.ajax();
        //Apro la ricerca
        pg.show();
    },
    "enter": function () {
        var pg = $("#SearchExtFld");
        var liall = pg.find(".li-search");
        var li2hide = $(liall).filter(function () {
            var filtro = pg.find(".filtro").val().toLowerCase();
            // Tutti quelli che non rispettano la ricerca
            return $(this).attr('Des').toLowerCase().indexOf(filtro) < 0;
        });
        li2hide.hide();
        var li2show = $(liall).filter(function () {
            var filtro = pg.find(".filtro").val().toLowerCase();
            // Tutti quelli che rispettano la ricerca
            return $(this).attr('Des').toLowerCase().indexOf(filtro) > -1;
        });
        li2show.show();
        //input[name ^= 'news']
    },
    "clear": function () {
        // Pulisce la ricerca
        var pg = $("#SearchExtFld");
        pg.find(".filtro").val("").focus().select();
        // Ricarica i dati
        this.loadEle();
    },
    "close": function (itemsel) {
        // Chiude il modal della ricerca e riempe i campi nella pg corrente
        var pg = $("#SearchExtFld");
        if (!fU.IsNull(itemsel)) {
            $(SearcExtFld.dest).val(itemsel.attr("codice"));
        }

        //Chiudo la ricerca e svuoto la lista
        pg.hide();
        pg.find(".li-search").remove();

        //SetFocus();
        Find_Next_Tabindex();
    },
    "loadEle": function () {
        var pg = $("#SearchExtFld");
        // Pulizia
        pg.find(".li-search").remove();
        //Ricarica
        var dt = SearcExtFld.dt;
        if (dt.length > 0) {
            pg.find(".ricerca").text("");
            var ul = pg.find("ul");
            var litemp = pg.find(".template").clone().addClass("li-search").removeAttr("style");
            dt.forEach(function (item) {
                var li = litemp.clone();
                li.attr("codice", item.Codice);
                li.attr("descrizione", item.Descrizione);
                li.find(".codice").text(item.Codice);
                li.find(".descrizione").text(item.Descrizione);
                ul.append(li);
            });
        } else
            pg.find(".ricerca").text("Nessun record...");
    },
    "ajax": function () {
        Params = JSON.stringify({
            Terminale: oApp.Terminale,
            Cd_Operatore: oApp.Cd_Operatore,
            ExtFldSource: SearcExtFld.source
        });

        $.ajax({
            url: "Logistica.aspx/ExtFld4Searc",
            async: false,
            data: Params,
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (mydata) {
                SearcExtFld.dt = $.parseJSON(mydata.d);
                SearcExtFld.loadEle();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
            }
        });
    }
}


// -------------------------------------------------
// ENDREGION: FUNZIONI BASE
// -------------------------------------------------
// -------------------------------------------------
// #1.10 REGION: CHIAMATE AJAX
// -------------------------------------------------

// Elenco Documenti Aperti 
function Ajax_xmofn_DOAperti() {

    var out = false;

    $("#pgDocAperti .li-doc").remove();

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Filtro: $("#pgDocAperti .filtro").val()
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_DOAperti",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            oPrg.DA = dt;
            DOAperti_Load(dt);

            out = true;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}

// Elenco Documenti Stampabili
function Ajax_xmofn_DORistampa() {

    var out = false;

    $("#pgDocRistampa .li-doc").remove();

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Filtro: $("#pgDocRistampa .filtro").val()
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_DORistampa",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            DORistampa_Load(dt);
            out = true;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}

//Carica una lista di linee di produzione
function Ajax_xmofn_xMOLinea() {

    var out = false;

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore
    });

    var p = $('#' + oPrg.ActivePageId);
    var linee = $(p).find(".linee");
    $(linee).find(".linea").remove();

    $.ajax({
        url: "Logistica.aspx/xmofn_xMOLinea",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            if (mydata.d != '') {
                var dt = $.parseJSON(mydata.d);
                if (dt.length > 0) {
                    var div = $(linee).find(".template").clone().removeAttr("style").addClass("linea");
                    // aggiunge il pulsante per cancellare il codice linea
                    var cdiv = div.clone().removeClass("w3-blue").addClass("w3-orange");
                    $(cdiv).html("<img src='icon/EliminaBianco.svg' style='height: 18px !important;' />");
                    $(cdiv).on("click", function () {
                        $(p).find("input[name='Cd_xMOLinea']").val("").change();
                        $(p).find("input[name='Cd_xMOLinea']").focus().select();
                    });
                    $(linee).append(cdiv);
                    // aggiunge le linee
                    $.each(dt, function (key, item) {
                        var xdiv = div.clone();
                        $(xdiv).html(item.Cd_xMOLinea);
                        $(xdiv).on("click", function () {
                            $(p).find("input[name='Cd_xMOLinea']").val(item.Cd_xMOLinea).change();
                            $(p).find("input[name='Cd_xMOLinea']").focus().select();
                            //scateno il focus sul prossimo controllo
                            Find_Next_Tabindex();
                        });
                        $(linee).append(xdiv);
                    });

                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}


// Validazione e Salvataggio di xMOConsumo
function Ajax_xmosp_xMOConsumo_Save() {

    var out = false;

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Cd_xMOLinea: fU.ToString($("#pgAvviaConsumo select[name='Cd_xMOLinea'] option:selected").val()),
        DataOra: fU.DateToSql($("#pgAvviaConsumo input[name='DataOra']").val()),
        Cd_AR: fU.ToString($("#pgAvviaConsumo input[name='Cd_AR']").val()),
        Cd_ARLotto: fU.ToString($("#pgAvviaConsumo input[name='Cd_ARLotto']").val())
    });
    //###! inserire la matricola!

    $.ajax({
        url: "Logistica.aspx/xmosp_xMOConsumo_Save",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            if (mydata.d != '') {
                var r = $.parseJSON(mydata.d);
                if (r[0].Result < 0)
                    PopupMsg_Show("ERRORE", r[0].Result, r[0].Messaggio);
                else {
                    //Tutto ok: svuota gli inpuit di avvio consumo
                    $("#pgAvviaConsumo input").val("");
                    PopupMsg_Show("Info", 1, r[0].Messaggio, "ID " + r[0].Id_xMOConsumo);
                    out = true;
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}

// Validazione e Salvataggio di xMOConsumo per tutti gli articoli del documento che si sta creando (shortcut)
function Ajax_xmosp_xMOConsumoFromRL_Save() {
    var out = false;

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit)
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMOConsumoFromRL_Save",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result < 0)
                PopupMsg_Show("ERRORE", r[0].Result, r[0].Messaggio);
            else
                out = true;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}

// Validazione e Salvataggio della testa della rilevazione
function Ajax_xmosp_xMORL_Save() {

    var out = false;

    //Reset della riga di testa delle rilevazioni
    oPrg.drRL = null;

    Params = JSON.stringify({
        Cd_Operatore: oApp.Cd_Operatore,
        Terminale: oApp.Terminale,
        Cd_DO: oPrg.drDO.Cd_DO,
        DataDoc: fU.DateToSql($("#pgRL [name='DataDoc']").val()),
        Cd_CF: fU.ToString($("#pgRL [name='Cd_CF']").val()),
        Cd_CFDest: fU.ToString($("#pgRL [name='Cd_CFDest']").val()),
        Cd_xMOLinea: ($("#pgRL [name='Cd_xMOLinea']").is(":visible") == true ? fU.ToString($("#pgRL [name='Cd_xMOLinea'] option:selected").val()) : ''),
        NumeroDocRif: fU.ToString($("#pgRL [name='NumeroDocRif']").val()),
        DataDocRif: fU.DateToSql($("#pgRL [name='DataDocRif']").val()),
        Cd_MG_P: fU.ToString($("#pgRL [name='Cd_MG_P']").val()),
        Cd_MG_A: fU.ToString($("#pgRL [name='Cd_MG_A']").val()),
        Cd_DOSottoCommessa: fU.ToString($("#pgRL input[name='Cd_DOSottoCommessa']").val()),
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit)
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMORL_Save",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result > 0) {
                //Memorizzo l'id in edit
                oPrg.Id_xMORL_Edit = r[0].Id_xMORL;
                // Visualizzo l'id di testa
                $("#pgRL .lb-doc-id").text(oPrg.Id_xMORL_Edit);
                //Carico i dati di drRL
                out = Ajax_xmovs_xMORL();
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

// Carica la testa del documento
function Ajax_xmovs_xMORL() {
    var out = false;

    Params = JSON.stringify({
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit)
    });

    $.ajax({
        url: "Logistica.aspx/xmovs_xMORL",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            //Memorizzo il record di testa RL
            var r = $.parseJSON(mydata.d);
            oPrg.drRL = r[0];
            out = true;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}

// Elenco dei Documenti Prelevabili a partire da un Id_DOTes
function Ajax_xmofn_DOTes_Prel() {

    var out = false;

    $("#pgDOPrelievi .tr-prel").remove();

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Cd_DO: oPrg.drDO.Cd_DO,
        Cd_CF: oPrg.drRL.Cd_CF,
        Cd_CFDest: oPrg.drRL.Cd_CFDest,
        Cd_DOSottoCommessa: oPrg.drRL.Cd_DOSottoCommessa,
        Id_xMORL: fU.ToInt32(oPrg.drRL.Id_xMORL)
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_DOTes_Prel",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            DOPrel_Load(dt);
            out = true;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}

// Elenco di Tutti i Documenti Prelevabili
function Ajax_xmofn_DOTes_Prel_4PR() {

    var out = false;

    $("#pgPrelievi .li-prel").remove();

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Cd_DO: fU.ToString($("#pgPrelievi select[name='Cd_DO']").val()),
        Cd_DO_Prel: fU.ToString($("#pgPrelievi input[name='Cd_DO']").val()),
        Cd_CF: fU.ToString($("#pgPrelievi input[name='Cd_CF']").val()),
        Cd_CFDest: fU.ToString($("#pgPrelievi input[name='Cd_CFDest']").val()),
        DataConsegna: fU.DateToSql($("#pgPrelievi input[name='DataConsegna']").val()),
        Id_DOTes: $("#pgPrelievi input[name='Id_DOTes']").val(),
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit),
        xCd_xMOProgramma: fU.IsEmpty(oPrg.drDO) ? 'PR' : fU.UpTrim(oPrg.drDO.xCd_xMOProgramma),  // il programma lo passa solo se viene chiamata dal flusso di prelievo da id riga se invece il pr è PR non passa niente
        //xCd_xMOProgramma: fU.UpTrim(oPrg.drDO.xCd_xMOProgramma),
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_DOTes_Prel_4PR",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            DOPrel_All_Load(dt);
            out = true;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}

// Salva le teste dei documenti prelevabili selezionati
function Ajax_xmosp_xMORLPrelievo_Save(Id_DOTess) {

    var out = false;

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit),
        Id_DOTess: Id_DOTess
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMORLPrelievo_Save",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result < 0)
                PopupMsg_Show("ERRORE", r[0].Result, r[0].Messaggio);
            else {
                out = true;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}

// Salvataggio di xMORL e xMORLPrelievo da Spedizione
function Ajax_xmosp_xMOSpedizione_SaveRL(Id_DOTess, Cd_DO) {

    var out = false;

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_DOTess: Id_DOTess.join(','),
        Cd_DO: Cd_DO
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMOSpedizione_SaveRL",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result < 0)
                PopupMsg_Show("ERRORE", r[0].Result, r[0].Messaggio);
            else {
                //Carico i dati per la generazione del documento
                oPrg.LoadDO(Cd_DO);
                //Memorizzo l'id in edit
                oPrg.Id_xMORL_Edit = r[0].Id_xMORL;
                //Carico i dati di drRL
                out = Ajax_xmovs_xMORL();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;

}

// Update Documenti Aperti
function Ajax_xmosp_xMORL_Delete(idxmorl) {

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: fU.ToInt32(idxmorl)
    });
    $.ajax({
        url: "Logistica.aspx/xmosp_xMORL_Delete",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result != 1) {
                //Nessun mesaggio se il risultato è ok
                PopupMsg_Show("MESSAGGIO", r[0].Result, r[0].Messaggio);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

// Elenco Spedizioni 
function Ajax_xmofn_xMOCodSpe() {

    var out = false;

    // Memorizzo le righe selezionate
    // Resetto il dt
    // Pulisco il DOM
    var selezionati = oPrg.SP.dt.filter(function (item) { return item.Selezionato }).map(function (item) { return item.Id_DOTes });
    oPrg.SP.dt = null;
    Spedizione_Unload();

    $('div.preloader').show();
    //£££ DA riscrivere lato client e vanno cancellate F_Cd_xMOCodSpe e F_FinoAOggi
    var Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        F_Cd_xMOCodSpe: "",
        F_FinoAOggi: fU.IsChecked(ActivePage().find("input[name='checkFilterDate']")),
        Ordinamento: fU.ToInt32(localStorage.getItem("SPFiltro"))
    };
    $.ajax({
        url: "Logistica.aspx/xmofn_xMOCodSpe",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            // Memorizzo il dt in locale
            // Aggiungo il campo Selezionato per gestire il click
            // Carico il DOM
            oPrg.SP.dt = $.parseJSON(mydata.d);
            if (fU.IsObject(oPrg.SP.dt)) {
                oPrg.SP.dt.forEach(function (item) {
                    item['Selezionato'] = selezionati.includes(item.Id_DOTes);
                });
                Spedizione_Load();
            }
            out = true;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        },
        complete: function () {
            $('div.preloader').hide();
        }
    });
    return out;
}

// Salvataggio Righe Documento
function Ajax_xmosp_xMORLRig_Save(extfld) {

    var out = false;
    var p = "#" + oPrg.ActivePageId;

    var Barcode = (!fU.IsNull(oPrg.BC) ? fU.ToString(oPrg.BC.BarcodeXml()) : "");
    var Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit),
        Cd_AR: fU.ToString($(p).find("input[name='Cd_AR']").val()),
        Cd_MG_P: fU.ToString($(p).find("input[name='Cd_MG_P']").val().trim()),
        Cd_MGUbicazione_P: fU.ToString($(p).find("input[name='Cd_MGUbicazione_P']").val()),
        Cd_MG_A: fU.ToString($(p).find("input[name='Cd_MG_A']").val().trim()),
        Cd_MGUbicazione_A: fU.ToString($(p).find("input[name='Cd_MGUbicazione_A']").val()),
        Cd_ARLotto: fU.ToString($(p).find("input[name='Cd_ARLotto']").val()),
        DataScadenza: fU.DateToSql($(p).find("input[name='DataScadenza']").val()),
        Matricola: fU.ToString($(p).find("input[name='Matricola']").val()),
        Cd_ARMisura: fU.ToString($(p).find("select[name='Cd_ARMisura'] :selected").val()),
        Quantita: fU.ToString(parseFloat($(p).find("input[name='Quantita']").val().replace(',', '.'))),
        Barcode: Barcode,
        Cd_DOSottoCommessa: fU.ToString($(p).find("input[name='Cd_DOSottoCommessa']").val()),
        PackListRef: oPrg.drDO.PkLstEnabled ? $(p).find("select[name='PackListRef']").val() : "",
        Id_DORig: fU.ToInt32(0),
        Id_xMORLRig_T: fU.ToInt32(oPrg.RL.issueId),
        ExtFld: fU.IfEmpty(extfld, ""),
        Id_xMORLRig: oPrg.RL.Id_xMORLRig_Edit,
        StepCtrl: fU.ToInt32(oPrg.RL.StepCtrl)
    };

    $.ajax({
        url: "Logistica.aspx/xmosp_xMORLRig_Save",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);

            oPrg.RL.StepCtrl = fU.ToInt32(r[0].StepCtrl);

            // (>1):richiesto intervento dell'operatore
            if (r[0].Result > 1 && r[0].Result < 1000) {
                // Chiedo conferma all'operatore
                setTimeout(function () { $("#Popup_Button_OpConfirm").show().find(".msg").text(r[0].Result + ": " + r[0].Messaggio) }, 250);
            } else {
                // (1):tutto ok
                if (r[0].Result == 1) {
                    if (r[0].msguserinfo && !fU.IsEmpty(r[0].msguserinfo)) {
                        setTimeout(function () { PopupMsg_Show("USER INFO", 1, "Lotto: " + r[0].msguserinfo); }, 150);
                    }
                    // Esege una nuova issue
                    if (oPrg.RL.issueOn == true)
                        setTimeout(function () { issue.start() }, 250);
                    out = true;
                } else {
                    PopupMsg_Show("ERRORE", r[0].Result, r[0].Messaggio);
                }
                //Aggiorno le righe lette
                Ajax_xmofn_xMORLRig_AR();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}

// Elenco Righe Lette raggruppate per Articolo
function Ajax_xmofn_xMORLRig_AR() {
    // Pulisce le righe della tabella
    var p = "#" + oPrg.ActivePageId
    $(p).find("tr.tr-rigprel").remove();
    oPrg.RL.dtRLRig_AR = [];

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit)
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_xMORLRig_AR",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var data = JSON.parse(mydata.d);
            //Memorizza la lista delle righe
            oPrg.RL.dtRLRig_AR = data == "" ? [] : data;
            // Refresh delle righe
            pgRLRig_AR_Load(oPrg.RL.dtRLRig_AR);
            // Refresh del numero di righe lette
            Ajax_select_xMORLRig_NRows();
        },
        error: function (XMLHttpBarcode_LoadRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

}

// Effettua i controlli prima di andare al piede della rilevazione 
function Ajax_xmosp_xMORLPiede_Controlli_Before() {

    var out = false;

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit),
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMORLPiede_Controlli_Before",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            // (2):richiesto intervento dell'operatore
            if (r[0].Result == 2) {
                $("#Popup_Button_OpConfirm").show().find(".msg").text(r[0].Result + ": " + r[0].Messaggio);
            } else {
                // (1):tutto ok
                if (r[0].Result == 1) {
                    out = true;
                } else {
                    PopupMsg_Show("ERRORE", r[0].Result, r[0].Messaggio);
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}


// Elenco righe lette nei trasferimenti di partenza
function Ajax_xmofn_xMOTRRig_P_AR() {

    // Pulisce le righe della tabella
    var p = "#pgTRRig_P";
    $(p).find("table .tr-rigp").remove();

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOTR: fU.ToInt32(oPrg.Id_xMOTR_Edit),
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_xMOTRRig_P_AR",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            // Refresh delle righe
            pgTRRig_P_AR_Load($.parseJSON(mydata.d));
            // Refresh del numero di righe lette
            Ajax_select_xMOTRRig_P_NRows();
        },
        error: function (XMLHttpBarcode_LoadRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

// Elenco righe lette nei trasferimenti di arrivo
function Ajax_xmofn_xMOTRRig_A_AR() {

    var p = "#pgTRRig_A";
    $(p).find(".tr-riga").remove();

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOTR: fU.ToInt32(oPrg.Id_xMOTR_Edit),
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_xMOTRRig_A_AR",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            // Refresh delle righe
            var dt = $.parseJSON(mydata.d)
            pgTRRig_A_AR_Load(dt);
            // Refresh del numero di righe lette
            Ajax_select_xMOTRRig_A_NRows();
        },
        error: function (XMLHttpBarcode_LoadRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

// Elenco barcode utilizzabili nel documento
function Ajax_xmofn_DOBarcode() {

    //Detail: elimina l'elenco dei bc letti
    $("#DetailBarcode li.bc").remove();
    oPrg.BC = null;

    //cerca la gestione BC nella pagina corrente
    var bc = $("#" + oPrg.ActivePageId).find(".barcode");
    if (!fU.IsEmpty(bc)) {

        //Reset BC 
        $(bc).find("option").remove();

        Params = JSON.stringify({
            Terminale: oApp.Terminale,
            Cd_Operatore: oApp.Cd_Operatore,
            Cd_DO: oPrg.drDO.Cd_DO
        });

        $.ajax({
            url: "Logistica.aspx/xmofn_DOBarcode",
            async: false,
            data: Params,
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (mydata) {
                var dtBc = JSON.parse(mydata.d); //$.parseJSON(mydata.d);

                oPrg.BC = new Barcode(dtBc);
                oPrg.BC.Detail_Clear();         //Prima di annullare il BC pulisco il detail 
                // Carica i barcode 
                Barcode_Load(bc);
                //Se il combo possiede bc automatizza la gestione
                if ($(bc).find("option").length > 0) {
                    // Codice 
                    Barcode_SelType();
                } else {
                    //Nessun bc definito: rimuove la gestione del bc
                    $("#" + oPrg.ActivePageId).find(".div-barcode").hide();
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
            }
        });
    }
}

// Elenco UM dell 'ARTICOLO selezionato
function Ajax_xmofn_ARARMisura(TipoARMisura, xMOUmDef) {

    var out = false;

    // Pulisce il select
    ActivePage().find("select[name='Cd_ARMisura'] .op-um").remove();

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Cd_AR: fU.ToString(ActivePage().find("input[name='Cd_AR']").val()),
        TipoARMisura: TipoARMisura,
        xMOUmDef: xMOUmDef
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_ARARMisura",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            if (dt.length == 0) {
                PopupMsg_Show("ERRORE", 1, "Impossibile recuperare l'elenco delle unità di misura per l'articolo " + Params.Cd_AR + "!!");
                //    // ATTENZIONE: se il dt è vuoto è successo qualcosa di strano 
                //    // quindi lo ricarico con le UM generiche del login
                //    // dt = oApp.dtxMOARMisura;
                out = false;
            } else {
                ARARMisura_Load(dt);
                out = true;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
    return out;
}

// Recupera l'um dell'alias letto e la seleziona
function Ajax_xmofn_ARAlias_ARMisura() {

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Cd_AR: fU.ToString(ActivePage().find("input[name='Cd_AR']").val()),
        Alias: fU.ToString(ActivePage().find(".ar-aa").text()),
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_ARAlias_ARMisura",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (!fU.IsEmpty(r[0].Cd_ARMisura)) {
                ActivePage().find("select[name='Cd_ARMisura']").val(r[0].Cd_ARMisura.toUpperCase());
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

// Elenco UM dell 'ARTICOLO selezionato per i popup
function Ajax_xmofn_ARARMisura_Popup(idpopup) {

    var out = false;

    // Pulisce il select
    $("#" + idpopup + " select[name='Cd_ARMisura'] .op-um").remove();

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Cd_AR: fU.ToString($("#" + idpopup + " .Cd_AR").text()),
        TipoARMisura: "",
        xMOUmDef: ""
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_ARARMisura",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            ARARMisura_Popup_Load(dt, idpopup);
            out = true;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
    return out;
}

//EntityTable   = Tabella DMS (xMOCodSpe, DOTes, ecc...)
//EntityId      = Codice o Id (SP001, 151561, ecc...)
//Tipo          = tipologia di DMS da filtrare (R, P, ecc...)
//Append        = aggiunge alla lista dei DMS caricata
function Ajax_xmofn_DMS_List(EntityTable, EntityId, Tipo, Append) {
    var out = false;

    if (!Append) oPrg.DMS.resetAll()

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        EntityTable: EntityTable,
        EntityId: EntityId,
        Tipo: Tipo
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_DMS_List",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r.length > 0)
                r.forEach(function (item) {
                    oPrg.DMS.dtDMS.push(item);
                })
            out = true;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
    return out;
}

function Ajax_xmofn_DoTes_Note(Id_xMORL, Id_DoTes) {
    if (Id_xMORL > 0 || Id_DoTes > 0) {
        Params = JSON.stringify({
            Terminale: oApp.Terminale,
            Cd_Operatore: oApp.Cd_Operatore,
            Id_xMORL: Id_xMORL,
            Id_DoTes: Id_DoTes
        });

        $.ajax({
            url: "Logistica.aspx/xmofn_DoTes_Note",
            async: false,
            data: Params,
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (mydata) {
                var data = $.parseJSON(mydata.d);
                Popup_Note_Load(data);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
            }
        });
    }
}

// Delete ultima Lettura del DO in pgRLRig
function Ajax_xmosp_xMORLLast_Del() {
    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL_Del: fU.ToInt32(oPrg.Id_xMORL_Edit)
    });
    $.ajax({
        url: "Logistica.aspx/xmosp_xMORLLast_Del",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result > 0) {
                switch (oPrg.ActivePageValue) {
                    case enumPagine.pgRLRigID:
                        Ajax_xmofn_xMORLRig_FIDOR_AR();
                        break;
                    default:
                        // Ricarica le letture della pagina da DB e refresh della tabella
                        Ajax_xmofn_xMORLRig_AR();
                        break;
                }
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

// Numero di Letture effettuate  in pgRLRig
function Ajax_select_xMORLRig_NRows() {
    var out = false;

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit)
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_xMORLRig_Info_Letture_AR ",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            if (dt.length > 0) {
                oPrg.RL.ARIncompleti = dt[0].ArticoliIncompleti;
                oPrg.RL.ARCompleti = dt[0].ArticoliCompleti;
                oPrg.RL.Letture = dt[0].Letture;

            }
            // Gestione icon delete e dettagglio in base alla presenza di letture
            pgRLRig_Letture_UI();
            out = true;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}

// Numero di Letture effettuate in pgTRRig_P
function Ajax_select_xMOTRRig_P_NRows() {
    var out = false;

    Params = JSON.stringify({
        Id_xMOTR: fU.ToInt32(oPrg.Id_xMOTR_Edit)
    });

    $.ajax({
        url: "Logistica.aspx/select_xMOTRRig_P_NRows",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            // Gestione icon delete e dettaglio in base alla presenza di letture
            if (r[0].NRows == 0) {
                $("#pgTRRig_P .div-letture .delete").hide();
                $("#pgTRRig_P .div-letture .detail-letture").hide();
            }
            else {
                $("#pgTRRig_P .div-letture .delete").show();
                $("#pgTRRig_P .div-letture .detail-letture").show();
            }
            $("#pgTRRig_P .letture").text(r[0].NRows);
            out = true;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}

// Numero di Letture effettuate in pgTRRig_A
function Ajax_select_xMOTRRig_A_NRows() {
    var out = false;

    Params = JSON.stringify({
        Id_xMOTR: fU.ToInt32(oPrg.Id_xMOTR_Edit)
    });

    $.ajax({
        url: "Logistica.aspx/select_xMOTRRig_A_NRows",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            // Gestione icon delete e dettaglio in base alla presenza di letture
            if (r[0].NRows == 0) {
                $("#pgTRRig_A .div-letture .delete").hide();
                $("#pgTRRig_A .div-letture .detail-letture").hide();
            }
            else {
                $("#pgTRRig_A .div-letture .delete").show();
                $("#pgTRRig_A .div-letture .detail-letture").show();
            }
            $("#pgTRRig_A .letture").text(r[0].NRows);
            out = true;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}

function Ajax_xmofn_xMORLPiede_PesoVolume(LNV) {

    var p = "#" + oPrg.ActivePageId;
    var val = 0;

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit),
        LNV: LNV
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_xMORLPiede_PesoVolume",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            val = r[0].Result;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    switch (LNV) {
        case "L":
            $(p).find("input[name='PesoLordo']").val(val);
            break;
        case "N":
            $(p).find("input[name='PesoNetto']").val(val);
            break;
        case "V":
            $(p).find("input[name='VolumeTotale']").val(val);
            break;

    }
}

// Salvataggio Piede  Documento
function Ajax_xmosp_xMORLPiede_Save() {

    var out = false;
    var Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit),
        Targa: fU.ToString(ActivePage().find("input[name='Targa']").val()),
        Cd_DOCaricatore: fU.ToString(ActivePage().find("input[name='Cd_DOCaricatore']").val()),
        PesoExtraMks: fU.IfEmpty(ActivePage().find("input[name='PesoExtraMks']").val(), 0),
        VolumeExtraMks: fU.IfEmpty(ActivePage().find("input[name='VolumeExtraMks']").val(), 0),
        Colli: fU.IfEmpty(ActivePage().find("input[name='Colli']").val(), 0),
        PesoLordo: fU.IfEmpty(ActivePage().find("input[name='PesoLordo']").val(), 0),
        PesoNetto: fU.IfEmpty(ActivePage().find("input[name='PesoNetto']").val(), 0),
        VolumeTotale: fU.IfEmpty(ActivePage().find("input[name='VolumeTotale']").val(), 0),
        NotePiede: ActivePage().find("textarea[name='NotePiede']").val(),
        Cd_DoVettore_1: fU.ToString(ActivePage().find("input[name='Cd_DoVettore_1']").val()),
        Vettore1DataOra: fU.DateTimeToSql(ActivePage().find("input[name='Vettore1DataOra']").val()),
        Cd_DoVettore_2: fU.ToString(ActivePage().find("input[name='Cd_DoVettore_2']").val()),
        Vettore2DataOra: fU.DateTimeToSql(ActivePage().find("input[name='Vettore2DataOra']").val()),
        Cd_DoTrasporto: fU.ToString(ActivePage().find("input[name='Cd_DoTrasporto']").val()),
        TrasportoDataora: fU.DateTimeToSql(ActivePage().find("input[name='TrasportoDataora']").val()),
        Cd_DoSped: fU.ToString(ActivePage().find("input[name='Cd_DoSped']").val()),
        Cd_DoPorto: fU.ToString(ActivePage().find("input[name='Cd_DoPorto']").val()),
        Cd_DoAspBene: fU.ToString(ActivePage().find("input[name='Cd_DoAspBene']").val()),
        Cd_DoCommittente: fU.ToString(ActivePage().find("input[name='Cd_DoCommittente']").val()),
        Cd_DoProprietarioMerce: fU.ToString(ActivePage().find("input[name='Cd_DoProprietarioMerce']").val()),
        Cd_DoLuogoCarico: fU.ToString(ActivePage().find("input[name='Cd_DoLuogoCarico']").val()),
        Cd_DoLuogoScarico: fU.ToString(ActivePage().find("input[name='Cd_DoLuogoScarico']").val()),
    };

    $.ajax({
        url: "Logistica.aspx/xmosp_xMORLPiede_Save",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result == 1) {
                /* Se l'operatore ha chiesto di salvare il documento (senza stampare)
                o se non sono presenti moduli di stampa
                salva il documento e torna alla Home*/
                if (!fU.IsChecked(ActivePage().find(".ck-print")) || (oPrg.drDO.Moduli <= 0)) {
                    //Salvo lo stato del documento accodandolo al listener
                    var cmd = Listener_RLSave(oPrg.Id_xMORL_Edit);
                    Ajax_ListenerCoda_Add(cmd, oPrg.Id_xMORL_Edit);
                    oPrg.Pages[oPrg.ActivePageIdx].GoHome = true;
                }
                else {
                    oPrg.Pages[oPrg.ActivePageIdx].GoHome = false;
                    //Carico i dati di drRL
                    oPrg.drRL = null;
                    out = Ajax_xmovs_xMORL();
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

// Elenco Devices 
function Ajax_xmofn_xMOListenerDevice() {

    // Svuota il select dei device 
    $("#pgStampaDocumento .op-lsdevice").remove();

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Cd_xMOListener: $("#pgStampaDocumento select[name='Listener']").val()
    });
    $.ajax({
        url: "Logistica.aspx/xmofn_xMOListenerDevice",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            ListenerDevice_Load(dt);
            Ajax_xmofn_xMOListener_Moduli();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }

    });
}

// Elenco Moduli Stampa
function Ajax_xmofn_xMOListener_Moduli() {

    // Svuoto la lista dei moduli
    $("#pgStampaDocumento .li-modulo").remove();

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Cd_xMOListener: $("#pgStampaDocumento select[name='Listener']").val(),
        Cd_DO: oPrg.drDO.Cd_DO
    });
    $.ajax({
        url: "Logistica.aspx/xmofn_xMOListener_Moduli",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            dt = $.parseJSON(mydata.d);
            Listener_Moduli_Load(dt);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }

    });
}

// Informazioni sulle Letture visibili in pgRLPiede
function Ajax_xmofn_xMORLRig_Totali() {
    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit)
    });
    $.ajax({
        url: "Logistica.aspx/xmofn_xMORLRig_Totali",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var row = $.parseJSON(mydata.d);
            // Carica i dati nella pagina
            xMORLRig_Totali_Template(row[0]);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }

    });
}

// Edita la lettura
function xMORLRig_Edit(Key_Edit) {

    var p = $("#" + oPrg.ActivePageId);
    var item = oPrg.RL.dtRLRig[Key_Edit]

    oPrg.RL.Id_xMORLRig_Edit = item.Id_xMORLRig;


    //   $("#pgRLRig input[name='Quantita']").attr("rigakey", tr.attr("key")).focus().select();

    // Imposta l'articolo da editare
    $(p).find(".ar-aa").text(""); //lo svuoto per far ricaricare le UM
    $(p).find("label.ar-aa").addClass("w3-green");  //lo rendo verde per riconoscere l'edit
    $(p).find("input[name='Cd_AR']").focus().select();
    $(p).find("input[name='Cd_AR']").val(item.Cd_AR);
    $(p).find("label[name='AR_Descrizione']").text(item.Descrizione);

    //Imposta la quantità per scatenare il caricamento del'UM
    $(p).find("input[name='Quantita']").val(item.Quantita);
    ARARMisura_Set(item.Cd_ARMisura.toUpperCase());
    //Carica gli altri dati da editare
    $(p).find("input[name='Cd_MG_P']").val(item.Cd_MG_P);
    $(p).find("input[name='Cd_MGUbicazione_P']").val(item.Cd_MGUbicazione_P);
    $(p).find("input[name='Cd_MG_A']").val(item.Cd_MG_A);
    $(p).find("input[name='Cd_MGUbicazione_A']").val(item.Cd_MGUbicazione_A);
    $(p).find("input[name='Cd_ARLotto']").val(item.Cd_ARLotto);
    $(p).find("input[name='DataScadenza']").val(fU.DateJsonToStandard(item.DataScadenza));
    $(p).find("input[name='Matricola']").val(item.Matricola);
    $(p).find("input[name='Cd_DOSottoCommessa']").val(item.Cd_DOSottoCommessa);

    Quantita_Onfocus();

    //Nasconde il detail delle letture
    $("#Detail_Letture").hide();

}

// Delete Lettura del DO
function Ajax_xmosp_xMORLRig_Del(Id_xMORLRig_Del) {

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORLRig_Del: fU.ToInt32(Id_xMORLRig_Del),
    });
    $.ajax({
        url: "Logistica.aspx/xmosp_xMORLRig_Del",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var result = $.parseJSON(mydata.d);
            if (result[0].Result > 0) {
                switch (oPrg.ActivePageValue) {
                    case enumPagine.pgRLRigID:
                        Ajax_xmofn_xMORLRig_FIDOR_AR();
                        break;
                    case enumPagine.pgRLRig_T:
                        Ajax_xmofn_xMORLRig_T_List();
                        break;
                    default:
                        // Aggiorno le letture sulla tabella 
                        Ajax_xmofn_xMORLRig_AR();
                        break;
                }
            }
            //Aggiorno la lista del dettaglio delle letture
            Detail_Ajax_xmovs_xMORLRig();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

// Verifica e valida la coerenza dei documenti da prelevare selezionati in pgPrelievi
function Ajax_xmosp_xMORLPrelievo_Validate(Id_DOTess, Cd_DO) {

    var out = false;

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Cd_DO: fU.ToString(Cd_DO),
        Id_DOTess: fU.ToString(Id_DOTess)
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMORLPrelievo_Validate",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            // ### Sviluppare il caso in cui il result == 2 in cui si richiede l'intervento dell'operatore 
            //per la scelta dei dati di testa del documento che risultano incorenti tra quelli selezionati per il prelievo 
            if (r[0].Result != 1)
                PopupMsg_Show("ERRORE", r[0].Result, r[0].Messaggio);
            else {
                out = true;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}

// Salva la RL dei prelievi validati precedentemente da  'Ajax_xmosp_xMORLPrelievo_Validate'
function Ajax_xmosp_xMORLPrelievo_SaveRL(Id_DOTess, Cd_DO) {
    var out = false;

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Cd_DO: fU.ToString(Cd_DO),
        Id_DOTess: fU.ToString(Id_DOTess),
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit)
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMORLPrelievo_SaveRL",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result < 0)
                PopupMsg_Show("ERRORE", r[0].Result, r[0].Messaggio);
            else {
                // Carico i parametri del tipo di DO da creare
                oPrg.LoadDO(Cd_DO);
                // Memorizzo in edit l'id della testa appena creata
                oPrg.Id_xMORL_Edit = r[0].Id_xMORL;
                out = true;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}

// Salva la TR del trasferimento interno
function Ajax_xmosp_xMOTR_Save() {
    var out = false;

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Descrizione: fU.ToString($("#pgTR input[name='Descrizione']").val()),
        DataMov: fU.DateToSql($("#pgTR input[name='DataMov']").val()),
        Cd_MG_P: fU.ToString($("#pgTR input[name='Cd_MG_P']").val()),
        Cd_MGUbicazione_P: fU.ToString($("#pgTR input[name='Cd_MGUbicazione_P']").val()),
        Cd_MG_A: fU.ToString($("#pgTR input[name='Cd_MG_A']").val()),
        Cd_MGUbicazione_A: fU.ToString($("#pgTR input[name='Cd_MGUbicazione_A']").val()),
        Cd_DOSottoCommessa: fU.ToString($("#pgTR input[name='Cd_DOSottoCommessa']").val()),
        Id_xMOTR: fU.ToInt32(oPrg.Id_xMOTR_Edit),
        Cd_xMOProgramma: fU.UpTrim(oApp.dtPrograms[oPrg.Key].Key)
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMOTR_Save",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result < 0)
                PopupMsg_Show("ERRORE", r[0].Result, r[0].Messaggio);
            else {
                // Memorizzo in edit l'id della testa del TI appena creata
                oPrg.Id_xMOTR_Edit = r[0].Id_xMOTR;
                // Visualizzo l'id in pgTR
                $("#pgTR .lb-doc-id").text(fU.ToString(oPrg.Id_xMOTR_Edit))
                out = true;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;

}

// Salva la TR del trasferimento ubicazione interno
function Ajax_xmosp_xMOTR_UBPA_Save() {
    var out = false;

    //var f;
    //var m;
    //f = ActivePage().find("input[name='DataMov']");
    //if (!fU.IsDate(f.val())) { m += '\nLa data del movimento non è nel formato richiesto (GG/MM/AAAA).'; break; }
    //f = ActivePage().find("input[name='Cd_MG_P']");
    //if (fU.IsEmpty(f.val())) { m += '\nMagazzino di partenza errato o mancante.'; break; }
    //f = ActivePage().find("input[name='Cd_MGUbicazione_P']");
    //if (fU.IsEmpty(f.val())) { m += '\nUbicazione del magazzino di partenza errato o mancante.'; break; }
    //f = ActivePage().find("input[name='Cd_MG_A']");
    //if (fU.IsEmpty(f.val())) { m += '\nMagazzino di arrivo errato o mancante.'; break; }
    //f = ActivePage().find("input[name='Cd_MGUbicazione_A']");
    //if (fU.IsEmpty(f.val())) { m += '\nUbicazione del magazzino di arrivo errato o mancante.'; break; }
    //if (m != "") {
    //    PopupMsg_Show("Errore", "", m);
    //    return;
    //}


    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Descrizione: fU.ToString(ActivePage().find("input[name='Descrizione']").val()),
        DataMov: fU.DateToSql(ActivePage().find("input[name='DataMov']").val()),
        Cd_MG_P: fU.ToString(ActivePage().find("input[name='Cd_MG_P']").val()),
        Cd_MGUbicazione_P: fU.ToString(ActivePage().find("input[name='Cd_MGUbicazione_P']").val()),
        Cd_MG_A: fU.ToString(ActivePage().find("input[name='Cd_MG_A']").val()),
        Cd_MGUbicazione_A: fU.ToString(ActivePage().find("input[name='Cd_MGUbicazione_A']").val()),
        NotePiede: fU.ToString(ActivePage().find("textarea[name='NotePiede']").val()),
        Cd_xMOProgramma: fU.UpTrim(oApp.dtPrograms[oPrg.Key].Key),
        Cd_xMOListener: ActivePage().find('select[name="Listener"]').val(),
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMOTR_UBPA_Save",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result < 0)
                PopupMsg_Show("ERRORE", r[0].Result, r[0].Messaggio, undefined, function () { pgTR_UBPA_Focus(); });
            else {
                // Tutto ok svuota la pagina
                PopupMsg_Show("ESEGUITO", r[0].Result, r[0].Messaggio, undefined, function () { pgTR_UBPA_UI(); });
                out = true;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;

}

// Salva le Righe del TR di PARTENZA
function Ajax_xmosp_xMOTRRig_P_Save() {
    var out = false;
    var p = "#" + oPrg.ActivePageId;

    //var Barcode = (!fU.IsNull(oPrg.BC) ? fU.ToString(oPrg.BC.BarcodeXml()) : "");

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOTR: fU.ToInt32(oPrg.Id_xMOTR_Edit),
        Cd_AR: fU.ToString($(p).find("input[name='Cd_AR']").val()),
        Cd_ARLotto: fU.ToString($(p).find("input[name='Cd_ARLotto']").val()),
        Quantita: fU.ToString(parseFloat($(p).find("input[name='Quantita']").val().replace(',', '.'))),
        Cd_ARMisura: fU.ToString($(p).find("select[name='Cd_ARMisura'] :selected").val()),
        Cd_MG_P: fU.ToString($(p).find("input[name='Cd_MG_P']").val().trim()),
        Cd_MGUbicazione_P: fU.ToString($(p).find("input[name='Cd_MGUbicazione_P']").val().trim()),
        Id_xMOTRRig_P: fU.ToInt32(0),
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMOTRRig_P_Save",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result == 1) {
                out = true;
            }
            else {
                PopupMsg_Show("ERRORE", r[0].Result, r[0].Messaggio);
            }
            //Aggiorno le righe lette
            Ajax_xmofn_xMOTRRig_P_AR();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}

// Elimina l'ultima lettura effettuata nei TR di PARTENZA
function Ajax_xmosp_xMOTRRig_P_Last_Del() {

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOTR_Del: fU.ToInt32(oPrg.Id_xMOTR_Edit)
    });
    $.ajax({
        url: "Logistica.aspx/xmosp_xMOTRRig_P_Last_Del",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result != 1) {
                PopupMsg_Show("ERRORE", r[0].Result, r[0].Messaggio);
            }
            // Ricarica le letture della pagina da DB e refresh della tabella
            Ajax_xmofn_xMOTRRig_P_AR();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

function Ajax_xmosp_xMOTRRig_P_Del(Id_xMOTRRig_P_Del) {

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOTRRig_P_Del: fU.ToInt32(Id_xMOTRRig_P_Del)
    });
    $.ajax({
        url: "Logistica.aspx/xmosp_xMOTRRig_P_Del",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result != 1)
                PopupMsg_Show("ERRORE", r[0].Result, r[0].Messaggio);
            // Aggiorno le letture sulla tabella 
            Ajax_xmofn_xMOTRRig_P_AR();
            //Aggiorno la lista del dettaglio delle letture
            Detail_Ajax_xmovs_xMOTRRig_P();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

// Salva le Righe del TR di PARTENZA
function Ajax_xmosp_xMOTRRig_A_Save() {
    var out = false;
    var p = "#" + oPrg.ActivePageId;

    //var Barcode = (!fU.IsNull(oPrg.BC) ? fU.ToString(oPrg.BC.BarcodeXml()) : "");

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOTR: fU.ToInt32(oPrg.Id_xMOTR_Edit),
        Id_xMOTRRig_P: fU.ToInt32($(p).find("input[name='Cd_AR']").attr("Id_xMOTRRig_P")),
        Quantita: fU.ToString(parseFloat($(p).find("input[name='Quantita']").val().replace(',', '.'))),
        Cd_ARMisura: fU.ToString($(p).find("select[name='Cd_ARMisura'] :selected").val()),
        Cd_MG_A: fU.ToString($(p).find("input[name='Cd_MG_A']").val().trim()),
        Cd_MGUbicazione_A: fU.ToString($(p).find("input[name='Cd_MGUbicazione_A']").val().trim()),
        UbiCompleta: fU.ToBool(0),
        Id_xMOTRRig_A: fU.ToInt32(0)
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMOTRRig_A_Save",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result == 1) {
                out = true;
            }
            else {
                PopupMsg_Show("ERRORE", r[0].Result, r[0].Messaggio);
            }
            //Aggiorno le righe lette
            Ajax_xmofn_xMOTRRig_A_AR();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}

// Elimina l'ultima lettura effettuata nei TR di ARRIVO
function Ajax_xmosp_xMOTRRig_A_Last_Del() {

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOTR_Del: fU.ToInt32(oPrg.Id_xMOTR_Edit)
    });
    $.ajax({
        url: "Logistica.aspx/xmosp_xMOTRRig_A_Last_Del",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result != 1) {
                PopupMsg_Show("ERRORE", r[0].Result, r[0].Messaggio);
            }
            // Ricarica le letture della pagina da DB e refresh della tabella
            Ajax_xmofn_xMOTRRig_A_AR();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

function Ajax_xmosp_xMOTRRig_A_Del(Id_xMOTRRig_A_Del) {

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOTRRig_A_Del: fU.ToInt32(Id_xMOTRRig_A_Del)
    });
    $.ajax({
        url: "Logistica.aspx/xmosp_xMOTRRig_A_Del",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result != 1)
                PopupMsg_Show("ERRORE", r[0].Result, r[0].Messaggio);
            // Aggiorno le letture sulla tabella 
            Ajax_xmofn_xMOTRRig_A_AR();
            //Aggiorno la lista del dettaglio delle letture
            Detail_Ajax_xmovs_xMOTRRig_A();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

// Se esiste restituisce l'Id_xMOTR di un trasferimento ancora aperto
function Ajax_xmofn_xMOTR_To_Edit() {
    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOTR: fU.ToInt32(oPrg.Id_xMOTR_Edit)

    });
    $.ajax({
        url: "Logistica.aspx/xmofn_xMOTR_To_Edit",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var row = $.parseJSON(mydata.d);
            if (!fU.IsEmpty(row[0].Id_xMOTR)) {
                oPrg.Id_xMOTR_Edit = row[0].Id_xMOTR;
                oPrg.drTR = row[0];
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

// Dati riepilogo per pgTRPiede
function Ajax_xmofn_xMOTRRig_Totali() {
    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOTR: fU.ToInt32(oPrg.Id_xMOTR_Edit)
    });
    $.ajax({
        url: "Logistica.aspx/xmofn_xMOTRRig_Totali",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var row = $.parseJSON(mydata.d);
            // Carica i dati nella pagina
            xMOTRRig_Totali_Template(row[0]);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }

    });
}

// Salvataggio del piede del trasferimento
function Ajax_xmosp_xMOTRPiede_Save() {

    var out = false;

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOTR: fU.ToInt32(oPrg.Id_xMOTR_Edit)
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMOTRPiede_Save",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result == 1) {
                //Salvo lo stato del documento accodandolo al listener
                var cmd = Listener_TRSave(oPrg.Id_xMOTR_Edit);
                Ajax_ListenerCoda_Add(cmd, 0, oPrg.Id_xMOTR_Edit);
                //Vado alla Home
                oPrg.Pages[oPrg.ActivePageIdx].GoHome = true;
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

function Ajax_xmofn_Get_AR_From_AAA(Cd_AR, Cd_CF) {
    //Imposta i parametri
    Params = {
        Cd_AR: Cd_AR,
        Cd_CF: fU.IfEmpty(Cd_CF, "")
    };
    $.ajax({
        url: "Logistica.aspx/xmofn_Get_AR_From_AAA",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var item = $.parseJSON(mydata.d)[0];
            if (item) {
                // Mette il codice immesso dall'op nella label alias/codici alternativi'
                ActivePage().find(".ar-aa").text(Params.Cd_AR);
                // Sotituisce il valore dell'input con il Cd_AR effettivo restituito dalla funzione
                ActivePage().find("input[name='Cd_AR']").val(item.Cd_AR);
                // Carica la descrizione
                ActivePage().find("label[name='AR_Descrizione']").text(item.Descrizione);
            }
            else {
                // verifica se è abilitata l'acquisizione alias avvia il popup per l'insert
                if (oApp.dtDO[oPrg.drDO.Cd_DO].xMOAA) {
                    // Visualizzo il popup per andare alla pagina di inserimento degli alias
                    popup_yna.show("Gestione alias/alternativi", "Nessuna corrispondenza trovata per il codice:&nbsp;" + Cd_AR + "\nCodificare Alias o Alternativo?", null, 'yna', function () { GoTo_Prg_AA('ALI'); }, 'Alias', function () { GoTo_Prg_AA('ALT'); }, 'Alternativi');
                }
                else {
                    ActivePage().find("input[name='Cd_AR']").val("");
                    PopupMsg_Show("ERRORE", 1, "Articolo " + Cd_AR + " non trovato");
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

function Ajax_xmofn_Get_AR_From_AAA_Easyway(Cd_AR, Cd_CF) {
    var item = { Cd_AR: "", Descrizione: "", Cd_ARMisura: "", FattoreToUM1: 1 };
    //Imposta i parametri
    Params = {
        Cd_AR: Cd_AR,
        Cd_CF: fU.IfEmpty(Cd_CF, "")
    };
    $.ajax({
        url: "Logistica.aspx/xmofn_Get_AR_From_AAA",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var res = $.parseJSON(mydata.d)[0];
            // restituisce il codice letto
            if (res) item = res;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
    return item;
}

function Ajax_xmosp_xMORLPackListRef_R_FirstValidate(PackListRef_R) {

    var out = false;

    //Imposta i parametri
    Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Cd_DO: oPrg.Cd_DO,
        PackListRef_R_First: PackListRef_R
    };
    $.ajax({
        url: "Logistica.aspx/xmosp_xMORLPackListRef_R_FirstValidate",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            // Lista
            var divLista = ActivePage().find('.listPaking');
            // Svuoto 
            divLista.empty();
            //Richiesto intervento dell'operatore
            if (r[0].Id_DoTes > 0) {
                var msg = "La Packing List è associata al documento con ID: " + r[0].Id_DoTes + " intestato a " + r[0].CF_Descrizione;
                msg = msg + "Data documento: " + r[0].DataDoc + " Numero documento: " + r[0].NumeroDoc;

                //U
                popup_yna.show("Conferma packing list.", msg, null, 'yn', function () {
                    Ajax_xmosp_xMORLPackListRef_R_Load(PackListRef_R, r[0].Id_DoTes)
                    //Note con conferma
                    if (oPrg.drDO.xMONoteUICheck)
                        Ajax_xmofn_DoTes_Note(oPrg.Id_xMORL_Edit, r[0].Id_DoTes);
                });
            }
            else
                PopupMsg_Show("ERRORE", 1, r[0].Messaggio);


        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}


//Recupero l'id del prelievo
function Ajax_xmosp_xMORLPackListRef_R_Load(PackListRef_R, Id_DoTes) {

    //Reset della riga di testa delle rilevazioni
    oPrg.drRL = null;

    //Imposta i parametri
    Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Cd_DO: oPrg.Cd_DO,
        Id_DoTes: Id_DoTes,
        PackListRef_R_Check: PackListRef_R
    };
    $.ajax({
        url: "Logistica.aspx/xmosp_xMORLPackListRef_R_Load",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result > 0 && r[0].Id_xMORL > 0) {
                //Memorizzo l'id in edit
                oPrg.Id_xMORL_Edit = r[0].Id_xMORL;
                // Mosta l'elenco delle PK lette o da leggere 
                xMORL_RLPK_R_Load();
            } else
                PopupMsg_Show("ERRORE", 1, r[0].Messaggio);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

}

//Controllo la Packing List e cambio di stato
function Ajax_xmosp_xMORLPackListRef_R_Check(PackListRef_R) {

    //Imposta i parametri
    Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: oPrg.Id_xMORL_Edit,
        PackListRef_R_Check: PackListRef_R
    };


    $.ajax({
        url: "Logistica.aspx/xmosp_xMORLPackListRef_R_Check",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            ActivePage().find("label[id='id_mors_" + PackListRef_R + "']").parent().find(":nth-child(2)").removeClass("w3-gray");
            ActivePage().find("label[id='id_mors_" + PackListRef_R + "']").parent().find(":nth-child(2)").addClass("w3-green");

            //Contatori
            ActivePage().find('.pk-ul-da').text(ActivePage().find("i.w3-green").length);
            ActivePage().find('.pk-ul-a').text(ActivePage().find("i").length);

            ActivePage().find("input[name='PackListRef_R']").val("");
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

}

//Estraggo l'elenco delle Packing List collegate
function Ajax_xmovs_xMORLPackListRef_R(Id_xMORL) {

    //Imposta i parametri
    Params = {
        Id_xMORL: Id_xMORL
    };
    $.ajax({
        url: "Logistica.aspx/xmovs_xMORLPackListRef_R",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            // Lista
            var divLista = ActivePage().find('.listPaking');
            // Svuoto 
            divLista.empty();
            var makePk = function (item) {
                return $('<div>').append(
                    $('<label>', { id: 'id_mors_' + item.PackListRef_R, class: 'text-muted' }).text(item.PackListRef_R),
                    $('<i>', { class: item.Checked ? 'fas fa-check lg-ml-20 w3-green' : 'fas fa-check lg-ml-20 w3-gray' }),
                );
            }

            r.forEach(function (item) {
                divLista.append(makePk(item));
            });

            //Contatori
            ActivePage().find('.pk-ul-da').text(ActivePage().find("i.w3-green").length);
            ActivePage().find('.pk-ul-a').text(ActivePage().find("i").length);

            //Svuoto il campo packing list
            ActivePage().find("input[name='PackListRef_R']").val("");

            //Visualizzo l'ID del prelievo nella barra
            ActivePage().find(".titolo").next().text(Id_xMORL);
            SetFocus();

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }

    });

}

function Ajax_xmosp_xMORLRig_R_Save() {

    var out = false;

    //Imposta i parametri
    Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: oPrg.Id_xMORL_Edit
    };
    $.ajax({
        url: "Logistica.aspx/xmosp_xMORLRig_R_Save",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result == 1)
                out = true; // tutto ok
            else
                PopupMsg_Show("ERRORE", r[0].Result, r[0].Messaggio);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}

// Recupera le pklRef se esistono
function Ajax_xmofn_xMORLRigPackingList() {

    ActivePage().find("select[name='PackListRef'] .op-pklref").remove();

    Params = JSON.stringify({
        Terminale: oApp.Terminale
        , Cd_Operatore: oApp.Cd_Operatore
        , Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit)
    });
    $.ajax({
        url: "Logistica.aspx/xmofn_xMORLRigPackingList",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            if (dt.length > 0) {
                PackListRef_Load(dt);
            } else {
                // Se non sono stati trovati PackListRef ne propongo uno nuovo
                Popup_PackList_New_Load();
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

// Recupera il codice successivo da proporre come nuovo pklRef
function Ajax_xmofn_xMORLRigPackingList_GetNew() {

    Params = JSON.stringify({
        Terminale: oApp.Terminale
        , Cd_Operatore: oApp.Cd_Operatore
        , Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit)
        , Cd_xMOUniLog: $("#Popup_PackList_New select[name='Cd_xMOUniLog']").val()
    });
    $.ajax({
        url: "Logistica.aspx/xmofn_xMORLRigPackingList_GetNew",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var PK = mydata.d;
            if (!fU.IsEmpty(PK)) {
                // Inserisco il codice restituito dalla sp nell'input del popup
                $("#Popup_PackList_New input[name='PackListRef']").val(PK);
                $('#Popup_PackList_New input[name="PackListRef"]').focus().select();
            }
            else {
                PopupMsg_Show("ATTENZIONE", 1, "Nessun PackList nuovo è stato generato");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

function Ajax_xmosp_xMORLRigPackList_Del() {
    var out = false;

    var p = $("#Popup_PKListAR_DelShift");

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORLRig: fU.ToInt32(p.attr("Id_xMORLRig")),
        Id_xMORLRigPackList_Del: fU.ToInt32(p.attr("Id_xMORLRigPackList")),
        Qta_Del: parseFloat($(p).find("input[name='Qta']").val().replace(',', '.'))
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMORLRigPackList_Del",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result == 1) {
                // Refresh del dettaglio e del select dei packlistref
                Detail_Ajax_xmofn_xMORLRigPackingList_AR();
                Ajax_xmofn_xMORLRigPackingList();
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

function Ajax_xmosp_xMORLRigPackList_Shift() {

    var out = false;

    var p = $("#Popup_PKListAR_DelShift");

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: oPrg.Id_xMORL_Edit,
        Id_xMORLRig: fU.ToInt32(p.attr("Id_xMORLRig")),
        Id_xMORLRigPackList: fU.ToInt32(p.attr("Id_xMORLRigPackList")),
        PackListRef_New: p.find("select[name='PackListRef']").val(),
        Qta_New: parseFloat($(p).find("input[name='Qta']").val().replace(',', '.'))
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMORLRigPackList_Shift",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result == 1) {
                // Refresh del dettaglio e del select dei packlistref
                Detail_Ajax_xmofn_xMORLRigPackingList_AR();
                Ajax_xmofn_xMORLRigPackingList();
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

// Elenco tipologie di UL
function Ajax_xmofn_xMOUniLog() {
    var dt = [];
    var Params = {
        Terminale: oApp.Terminale
        , Cd_Operatore: oApp.Cd_Operatore
    };
    $.ajax({
        url: "Logistica.aspx/xmofn_xMOUniLog",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            dt = $.parseJSON(mydata.d);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
    return dt;
}

// Elenco UL Padre
function Ajax_xmofn_xMORLPackListRef_P() {

    $("#Popup_PackList_New input[name='PackListRef_P']").val("");
    $("#Popup_PackList_New .op-unilog-p").remove();

    var Params = {
        Terminale: oApp.Terminale
        , Cd_Operatore: oApp.Cd_Operatore
        , Id_xMORL: oPrg.Id_xMORL_Edit
    };
    $.ajax({
        url: "Logistica.aspx/xmofn_xMORLPackListRef_P",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            if (dt.length > 0) {
                PackListRef_P_Load(dt);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

function PackListRef_AddP() {
    if (fU.IsChecked($("#Popup_PackList_New .ck-pk-add-p")))
        $("#Popup_PackList_New .bt-pk-add").html("Inserisci padre");
    else
        $("#Popup_PackList_New .bt-pk-add").html("Inserisci");
}

// Aggiorna PackListRef su un PackListRef_P
function Ajax_xmosp_xMORLPackListRef_P_Save() {
    var out = false;

    var p = $('#Popup_PKListUL_Shift');
    var PackListRef = p.find("label[name='PackListRef']").text();
    var PackListRef_P = p.find("select[name='PackListRef_P']").val();

    var Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit),
        PackListRef: PackListRef,
        PackListRef_P: PackListRef_P,
    };

    $.ajax({
        url: "Logistica.aspx/xmosp_xMORLPackListRef_P_Save",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result == 1) {
                // Nascondo il popup
                HideAndFocus('Popup_PKListUL_Shift');
                // Ricarica il dettaglio
                $("#Detail_PackingList").hide();
                Detail_Ajax_xmofn_xMORLRigPackingList_AR();
                $("#Detail_PackingList").show();
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

function Ajax_xmosp_xMORLPackListRef_Update() {
    var out = false;

    var p = $('#Popup_PKListUL_Shift');
    var PackListRef = p.find("label[name='PackListRef']").text();
    var Cd_xMOUniLog = p.find("select[name='Cd_xMOUniLog']").val();

    var Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit),
        PackListRef: PackListRef,
        Cd_xMOUniLog: Cd_xMOUniLog,
    };

    $.ajax({
        url: "Logistica.aspx/xmosp_xMORLPackListRef_Update",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result == 1) {
                // Nascondo il popup
                HideAndFocus('Popup_PKListUL_Shift');
                // Ricarica il dettaglio
                $("#Detail_PackingList").hide();
                Detail_Ajax_xmofn_xMORLRigPackingList_AR();
                $("#Detail_PackingList").show();
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

// Update/Insert di un nuovo PackListRef e avvia la issue
function Ajax_xmosp_xMORLPackListRef_Add_And_Issue() {
    if (Ajax_xmosp_xMORLPackListRef_Add())
        issue.start();
}
// Update/Insert di un nuovo PackListRef 
function Ajax_xmosp_xMORLPackListRef_Add() {
    var out = false;

    var PackListRef_P = "";
    // padre non carica P
    // se non è un padre carica anche il P se l'utente l'ha selezionato
    if (fU.IsChecked($("#Popup_PackList_New .ck-pk-add-p")))
        PackListRef_P = "";
    else
        PackListRef_P = $("#Popup_PackList_New select[name='PackListRef_P']").val();
    var Cd_xMOUniLog = $("#Popup_PackList_New select[name='Cd_xMOUniLog']").val();
    var PackListRef = $("#Popup_PackList_New input[name='PackListRef']").val();

    if (fU.IsChecked($("#Popup_PackList_New .ck-pk-add-p")) && (!PackListRef || !Cd_xMOUniLog)) {
        PopupMsg_Show("Errore", 0, "Per creare una UL padre bisogna specificare un codice e un tipo di UL!");
        return out;
    }
    if (PackListRef.length > 14) {
        PopupMsg_Show("Errore", 0, "Lunghezza massima per il codice packing è di 14 caratteri!");
        return out;
    }

    var Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit),
        PackListRef_P: PackListRef_P,
        Cd_xMOUniLog: Cd_xMOUniLog,
        PackListRef: PackListRef,
    };

    $.ajax({
        url: "Logistica.aspx/xmosp_xMORLPackListRef_Add",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result == 1) {
                // se è un padre lo salva, lo seleziona e rimane nella pagina
                if (fU.IsChecked($("#Popup_PackList_New .ck-pk-add-p"))) {
                    // Reset pagina
                    Popup_PackList_New_Load();
                    // Seleziona il padre creato
                    $("#Popup_PackList_New select[name='PackListRef_P']").val(PackListRef);
                } else {
                    // Aggiunge il pklRef se non è già presente nel select ed esce
                    xMORLPackListRef_Add_Client(PackListRef, PackListRef_P);
                    // Seleziona il PackListRef modificato o aggiunto
                    ActivePage().find("select[name='PackListRef']").val(PackListRef);
                    //nasconde il popup
                    HideAndFocus('Popup_PackList_New');
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

// Elenco dei PKListRef del doc corrente per la pgRLPK
function Ajax_xmofn_xMORLPackListRef() {

    oPrg.PK.ResetAll();

    Params = JSON.stringify({
        Terminale: oApp.Terminale
        , Cd_Operatore: oApp.Cd_Operatore
        , Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit)
        , PackListRef: fU.ToString(oPrg.PK.PackListRef)
    });
    $.ajax({
        url: "Logistica.aspx/xmofn_xMORLPackListRef",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            if (dt.length > 0) {
                oPrg.PK.dtxMORLPK = dt;
                oPrg.PK.idx = 0;
            }
            else {
                PopupMsg_Show("ATTENZIONE", 1, "Nessun PackListRef trovato");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

}

function Ajax_xmosp_xMORLPackListRef_Save() {
    var out = false;

    // Se la packing non è gestita esce
    if (!oPrg.PK.dtxMORLPK)
        return true;

    var p = $("#pgRLPK");
    var Cd_xMOUniLog = p.find(".Cd_xMOUniLog").text() == 'Nessuno' ? "" : fU.ToString(p.find(".Cd_xMOUniLog").text());
    var PesoTaraMks = fU.ToDecimal(p.find("input[name='PesoTaraMks']").val());
    var PesoNettoMks = fU.ToDecimal(p.find("input[name='PesoNettoMks']").val());
    var PesoLordoMks = fU.ToDecimal(p.find("input[name='PesoLordoMks']").val());
    var AltezzaMks = fU.ToDecimal(p.find("input[name='AltezzaMks']").val());
    var LunghezzaMks = fU.ToDecimal(p.find("input[name='LunghezzaMks']").val());
    var LarghezzaMks = fU.ToDecimal(p.find("input[name='LarghezzaMks']").val());

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORLPackListRef: fU.ToInt32(oPrg.PK.dtxMORLPK[oPrg.PK.idx].Id_xMORLPackListRef),
        Cd_xMOUniLog: Cd_xMOUniLog,
        PesoTaraMks: PesoTaraMks,
        PesoNettoMks: PesoNettoMks,
        PesoLordoMks: PesoLordoMks,
        AltezzaMks: AltezzaMks,
        LunghezzaMks: LunghezzaMks,
        LarghezzaMks: LarghezzaMks,
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMORLPackListRef_Save",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result == 1) {
                //Aggiorno i dati sul client
                oPrg.PK.dtxMORLPK[oPrg.PK.idx].Cd_xMOUniLog = Cd_xMOUniLog;
                oPrg.PK.dtxMORLPK[oPrg.PK.idx].PesoTaraMks = PesoTaraMks;
                oPrg.PK.dtxMORLPK[oPrg.PK.idx].PesoNettoMks = PesoNettoMks;
                oPrg.PK.dtxMORLPK[oPrg.PK.idx].PesoLordoMks = PesoLordoMks;
                oPrg.PK.dtxMORLPK[oPrg.PK.idx].AltezzaMks = AltezzaMks;
                oPrg.PK.dtxMORLPK[oPrg.PK.idx].LunghezzaMks = LunghezzaMks;
                oPrg.PK.dtxMORLPK[oPrg.PK.idx].LarghezzaMks = LarghezzaMks;

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

// Stoccaggio merce: crea il tr, trrigp e trrigt per il trasferimento di stoccaggio 
function Ajax_xmosp_xMOTRRig_PT_SM_Save(Cd_xMOMatricola, setCPIeUbica) {

    //Per sicurezza sanifico la matricola
    Cd_xMOMatricola = fU.SsccToMatricola(Cd_xMOMatricola);
    //memorizza se al termine dello stoccaggio devo ritornare allla dichiarazione di produzione CPI
    oApp.CPIeUbica = setCPIeUbica;

    $('div.preloader').show();
    Params = {
        Terminale: oApp.Terminale
        , Cd_Operatore: oApp.Cd_Operatore
        , Cd_xMOMatricola: fU.ToString(Cd_xMOMatricola),
    };
    $.ajax({
        url: "Logistica.aspx/xmosp_xMOTRRig_PT_SM_Save",
        async: true,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = JSON.parse(mydata.d);
            if (r[0].MatricolaJson)
                r[0].MatricolaJson = JSON.parse(r[0].MatricolaJson);
            console.log(r);
            //KDKD02002100111
            //KDKD0200210011X
            if (r[0].Result > 0 && !fU.IsEmpty(r[0].Id_xMOTRRig_T)) {
                oPrg.Id_xMOTR_Edit = r[0].Id_xMOTR;
                // Carica le informazioni dell'sscc letto e dei riferimenti al trasferimento
                // per richiedere l'ubicazione all'operatore
                console.log(r[0].MatricolaJson);
                pgSM_SSCC_Load(r[0].MatricolaJson);
            }
            else {
                PopupMsg_Show("ATTENZIONE", r[0].Result, !fU.IsEmpty(r[0].Messaggio) ? r[0].Messaggio : "Nessun dato trovato per la matricola letta!");
                //if (oApp.CPIeUbica == true) {
                //    // Reset variabile
                //    oApp.CPIeUbica = false;
                //    // ritorna alla generazione del CPI per la priduzione
                //    oPrg.Load("GENCAR", "PRD");
                //    //scateno il focus sul prossimo controllo
                //    Find_Next_Tabindex();
                //}
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

// Stoccaggio merce: Salva la riga di trasferimento di arrivo e genera in arca il movimento interno 
function Ajax_xmosp_xMOTRRig_A_MGMovInt_Save() {

    if (!fU.IsEmpty($("#pgSM input[name='Cd_MGUbicazione_A']").val())) {
        var Params = JSON.stringify({
            Terminale: oApp.Terminale
            , Cd_Operatore: oApp.Cd_Operatore
            , Id_xMOTR: fU.ToInt32(oPrg.Id_xMOTR_Edit)
            , Id_xMOTRRig_P: fU.ToInt32($("#pgSM .Id_xMOTRRig_P").text())
            , Cd_MG_A: fU.ToString($("#pgSM .Cd_MG_A").text())
            , Cd_MGUbicazione_A: fU.ToString($("#pgSM input[name='Cd_MGUbicazione_A']").val().toUpperCase())
            , xMOCompleta: fU.IsChecked($("#pgSM .ck-xMOCompleta"))
        });
        $.ajax({
            url: "Logistica.aspx/xmosp_xMOTRRig_A_MGMovInt_Save",
            async: false,
            data: Params,
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (mydata) {
                var r = $.parseJSON(mydata.d);
                if (r[0].Result > 0) {
                    // Aggiorna il contatore delle letture
                    oPrg.Counter.Set(1);
                    //Messaggio esito
                    $("#pgSM .lbl-esito").html(fU.Adesso() + "<br /> [" + r[0].Cd_xMOMatricola + "] stoccata in " + $("#pgSM input[name='Cd_MGUbicazione_A']").val().toUpperCase());
                    //Pulizia form
                    pgSM_Clear();
                    setTimeout(function () {
                        if (oApp.CPIeUbica == true) {
                            // Reset variabile
                            oApp.CPIeUbica = false;
                            // ritorna alla generazione del CPI per la priduzione
                            oPrg.Load("GENCAR", "PRD");
                            //scateno il focus sul prossimo controllo
                            Find_Next_Tabindex();
                        }

                    }, 1500);
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
    else {
        PopupMsg_Show("ERRORE", 1, "Salvataggio non effettuato a causa di nessuna ubicazione specificata");
    }
}

// Elimina il trasferimento 
// Utilizzata sia nello stoccaggio merce che nei trasferimenti aperti
function Ajax_xmosp_xMOTR_Delete(idxmotr) {

    var r = [];

    Params = JSON.stringify({
        Terminale: oApp.Terminale
        , Cd_Operatore: oApp.Cd_Operatore
        , Id_xMOTR_Del: fU.IsEmpty(idxmotr) ? fU.ToInt32(oPrg.Id_xMOTR_Edit) : idxmotr
    });
    $.ajax({
        url: "Logistica.aspx/xmosp_xMOTR_Delete",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            r = $.parseJSON(mydata.d);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
    return r;
}

function pgRLRig_T_UI() {

    //Gestione eventi

    //Enter o Tab su barcode matricola
    var bcMat = $("#pgRLRig_T input[name='Cd_xMOMatricola']");
    bcMat.unbind('change');
    bcMat.change(function (event) {
        var sscc = event.target.value;
        if (sscc !== '') {
            // Resetta il valore e lo invia al server
            event.target.value = ''
            Ajax_xmosp_xMORLRig_T_To_xMORLRig(fU.SsccToMatricola(sscc));
        }
    });

    // Click bottoni slide per lo scorrimento tra le righe temporanee da prelevare
    var btSlideShow = $("#pgRLRig_T .btn-slideshow");
    btSlideShow.unbind('click');
    btSlideShow.click(function () {
        // Calcola il nuovo indice rotativo
        oPrg.RL.idx_t = SlideShow(oPrg.RL.dtRLRig_T, oPrg.RL.idx_t, ($(this).attr("data-slide") === "left" ? -1 : 1));  //Left -1; Right 1
        // Carica i dati della nuova riga articolo
        pgRLRig_T_MoveTo();

    });
}

// Giro Prelievo: prepara le righe temporanee in rig_t per il giro di prelievo in mg delle righe da evadere
function Ajax_xmosp_xMORLRig_T_Save() {
    var r = [];
    Params = JSON.stringify({
        Terminale: oApp.Terminale
        , Cd_Operatore: oApp.Cd_Operatore
        , Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit)
    });
    $.ajax({
        url: "Logistica.aspx/xmosp_xMORLRig_T_Save",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            r = $.parseJSON(mydata.d);
            switch (r[0].Result) {
                // Carica i dati delle righe da prelevare
                case 1:
                case 2:
                    // Caso 2 alcune righe non potranno essere completamente evase per mancanza di matricole in MG quindi viene avvisato l'operatore con Qta Rossa
                    Ajax_xmofn_xMORLRig_T_List();
                    break;
                // Nessuna riga può essere evasa quindi mostra l'errore, cancella xmorl e torna alla HOME
                case -100:
                    // Eliminare xmorl e far gotohome();
                    Ajax_xmosp_xMORL_Delete(fU.ToInt32(oPrg.Id_xMORL_Edit));
                    PopupMsg_Show("ERRORE", r[0].Result, r[0].Messaggio);
                    $("#PopupMsg button").on("click", function () { GoHome(); });
                    break;
                // Gestione di errori generici
                default:
                    PopupMsg_Show("ERRORE", r[0].Result, r[0].Messaggio);
                    break;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
    return r[0].Result;
}

// Giro Prelievo: carica l'elenco delle righe da evadere ordinate secondo il giro di magazzino
// Il result passato alla funzione è il result della sp che ha salvato le righe in T 
function Ajax_xmofn_xMORLRig_T_List() {
    Params = JSON.stringify({
        Terminale: oApp.Terminale
        , Cd_Operatore: oApp.Cd_Operatore
        , Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit)
    });
    $.ajax({
        url: "Logistica.aspx/xmofn_xMORLRig_T_List",
        async: true,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            if (dt.length > 0) {
                oPrg.RL.dtRLRig_T = dt;
                pgRLRig_T_FindPosition(null, null);

                //Carica la lista delle letture effettuate
                Ajax_xmofn_xMORLRig_T_AR();
            }
            else {
                PopupMsg_Show("ATTENZIONE", 1, "Nessuna riga di prelievo trovata");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

// Giro Prelievo: elenco righe da leggere raggruppate per AR+ARLotto
function Ajax_xmofn_xMORLRig_T_AR() {
    Params = JSON.stringify({
        Terminale: oApp.Terminale
        , Cd_Operatore: oApp.Cd_Operatore
        , Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit)
    });
    $.ajax({
        url: "Logistica.aspx/xmofn_xMORLRig_T_AR",
        async: true,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            if (dt.length > 0) {
                pgRLRig_T_AR_Load(dt);
            }
            else {
                PopupMsg_Show("ATTENZIONE", 1, "Nessuna riga di prelievo trovata");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

// Giro Prelievo: salva la riga temporanea in definitivo 
function Ajax_xmosp_xMORLRig_T_To_xMORLRig(mat) {
    var Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit),
        Cd_xMOMatricola: fU.ToString(mat)
    };

    $.ajax({
        url: "Logistica.aspx/xmosp_xMORLRig_T_To_xMORLRig",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result > 0) {
                $("#pgRLRig_T .lbl-esito").html(fU.Adesso() + "<br />" + r[0].Messaggio).addClass("w3-text-green");
                //Rimuove il verde
                setTimeout(function () {
                    $("#pgRLRig_T .lbl-esito").removeClass("w3-text-green");
                }, 2000);

                // Aggiornamento del dt
                var Id_xMORLRig_T = r[0].Id_xMORLRig_T;

                if (Id_xMORLRig_T != null && Id_xMORLRig_T > 0) {
                    var RLRig = oPrg.RL.dtRLRig_T.find(function (item) { return item.Id_xMORLRig_T == Id_xMORLRig_T });
                    RLRig.Cd_xMOMatricola = mat; // La matricola letta è andata a buon fine e la riassegna
                    RLRig.Id_xMORLRig = r[0].Id_xMORLRig;
                }
                oPrg.RL.dtRLRig_T.forEach(function (item) { item.Letture_L += 1 });

                pgRLRig_T_FindPosition(Id_xMORLRig_T, null);

                //ricarica l'elenco degli articoli letti
                Ajax_xmofn_xMORLRig_T_AR();

            } else {
                PopupMsg_Show("ERRORE", r[0].Result, r[0].Messaggio);
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}



// Inventario Matricola: carica tutte le informazioni della matricola letta
function Ajax_xmofn_xMOMatricola_Info(mat, page_id) {

    var dt = [];

    Params = JSON.stringify({
        Terminale: oApp.Terminale
        , Cd_Operatore: oApp.Cd_Operatore
        , Cd_xMOMatricola: fU.ToString(mat)
    });
    $.ajax({
        url: "Logistica.aspx/xmofn_xMOMatricola_Info",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            dt = $.parseJSON(mydata.d);
            if (dt && dt.length > 0)
                switch (page_id) {
                    case 'pgINTMG_MAT':
                        pgINTMG_MAT_Load(dt);
                        break;
                    case 'pgINSSCC':
                        pgINSSCC_Load(dt);
                        break;
                    case 'pgTRSSCC':
                        pgTRSSCC_Load(dt);
                        break;
                }
            else
                PopupMsg_Show("ERRORE", 0, 'Nessun valore valido per la matricola [' + mat + '].');
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
    return dt;
}



function Ajax_xmosp_xMOINSSCC_MakeOne_MGMov() {
    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Descrizione: oPrg.IN.drIN.Descrizione,
        Cd_MGEsercizio: oPrg.IN.drIN.Cd_MGEsercizio,
        DataOra: fU.DateToSql($("#pgIN input[name='DataOra']").val()),
        Cd_MG: oPrg.IN.drIN.Cd_MG,
        Cd_MGUbicazione: fU.ToString($("#pgINSSCC input[name='Cd_MGUbicazione']").val().toUpperCase()),
        Cd_xMOMatricola: fU.SsccToMatricola(fU.ToString($("#pgINSSCC input[name='Cd_xMOMatricola']").val())),
        QtaRilevata: $("#pgINSSCC input[name='Quantita']").val(),
        Cd_ARMisura: fU.ToString($("#pgINSSCC select[name='Cd_ARMisura']").val()),
    });
    $.ajax({
        url: "Logistica.aspx/xmosp_xMOINSSCC_MakeOne_MGMov",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result > 0) {
                pgINSSCC_UI();
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

function Ajax_xmosp_xMOTR_To_MGMov_Save() {

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Descrizione: oApp.xMOImpostazioni.MovTraDescrizione + " (Matricole)",
        Cd_MG_P: fU.ToString($("#pgTRSSCC input[name='Cd_MG_P']").val()),
        Cd_MGUbicazione_P: fU.ToString($("#pgTRSSCC input[name='Cd_MGUbicazione_P']").val()),
        Cd_MG_A: fU.ToString($("#pgTRSSCC input[name='Cd_MG_A']").val()),
        Cd_MGUbicazione_A: fU.ToString($("#pgTRSSCC input[name='Cd_MGUbicazione_A']").val()),
        xMOCompleta: fU.IsChecked($("#pgTRSSCC .ck-xMOCompleta")),
        Cd_DOSottoCommessa: "",
        Cd_xMOProgramma: oPrg.Key,
        Cd_xMOMatricola: fU.ToString($("#pgTRSSCC .Cd_xMOMatricola").text()),
        Cd_AR: fU.ToString($("#pgTRSSCC input[name='Cd_AR']").val()),
        Cd_ARLotto: fU.ToString($("#pgTRSSCC input[name='Cd_ARLotto']").val()),
        Quantita: $("#pgTRSSCC input[name='Quantita']").val(),
        Cd_ARMisura: $("#pgTRSSCC select[name='Cd_ARMisura']").val(),
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMOTR_To_MGMov_Save",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result > 0) {
                pgTRSSCC_UI();
                $("#pgTRSSCC .lbl-esito").text("Movimento interno: " + r[0].Id_MGMovInt + " generato in Arca Evolution.");
                setTimeout(function () {
                    $("#pgTRSSCC .lbl-esito").text("");
                }, 2000);
                SetFocus();
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

// Stoccaggio Merce: Propone un'altra ubicazione dove poter stoccare la merce
function Ajax_xmosp_xMOTRRig_T_RicercaUbicazione_Escludi() {
    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOTRRig_P: fU.ToInt32(ActivePage().find(".Id_xMOTRRig_P").text()),
        Cd_MG_A: fU.ToString(ActivePage().find(".Cd_MG_A").text()),
        Cd_MGUbicazione_A_Escludi: fU.ToString(ActivePage().find(" .Cd_MGUbicazione_A").text())
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMOTRRig_T_RicercaUbicazione_Escludi",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result > 0) {
                if (!fU.IsEmpty(r[0].Cd_MGUbicazione)) {
                    // Visualizzo la nuova ubicazione proposta nella label
                    $("#" + oPrg.ActivePageId).find(".Cd_MGUbicazione_A").text(r[0].Cd_MGUbicazione);
                    $("#" + oPrg.ActivePageId).find("input[name='Cd_MGUbicazione_A']").focus();
                } else {
                    PopupMsg_Show("ATTENZIONE", r[0].Result, "Impossibile proporre una nuova ubicazione valida. Ubicazioni complete o escluse dall'utente!");
                }
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

function Ajax_xmofn_DORig_GetP() {
    // Cancella tutte le righe
    $("#pgTRMP_P .tr-rig").remove();

    var Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Cd_xMOLinea: fU.ToString(ActivePage().find(".filtri input[name='Cd_xMOLinea']").val()),
    };

    $.ajax({
        url: "Logistica.aspx/xmofn_DORig_GetP",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            if (dt.length > 0) {
                pgTRMP_P_Load(dt);
            }
            else {
                PopupMsg_Show("ERRORE", 1, "Nessun padre da produrre");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

function Ajax_xmofn_DORig_GetC() {
    // Cancella tutte le righe
    $("#pgTRMP_C_AR .tr-rig").remove();

    $("#pgTRMP_C_AR .TRMP_AR").hide();

    $("#pgTRMP_C_AR #lblP").html("COMPONENTI - " + oPrg.TRMP.DocRif);
    $("#pgTRMP_C_AR .TRMP_C").show();

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_DOTes: oPrg.TRMP.Id_DOTes,
        Id_DORig_P: oPrg.TRMP.Id_DORig_P,
        P_From: oPrg.TRMP.P_From,
        P_To: oPrg.TRMP.P_To
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_DORig_GetC",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            if (dt.length > 0) {
                oPrg.TRMP.dtDORig_C = dt;
                pgTRMP_C_AR_Load();
            }
            else {
                PopupMsg_Show("ERRORE", 1, "Nessun padre da produrre");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

function Ajax_xmosp_xMOTR_MP_Save() {

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_DORig_P: oPrg.TRMP.Id_DORig_P,
        Id_DORig_C: oPrg.TRMP.Id_DORig_C,
        Cd_xMOProgramma: fU.UpTrim(oPrg.Key)
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMOTR_MP_Save",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var res = $.parseJSON(mydata.d);
            if (res[0].Result > 0) {
                oPrg.Id_xMOTR_Edit = res[0].Id_xMOTR;
                oPrg.TRMP.Id_xMOTRRig_P = res[0].Id_xMOTRRig_P;
                // Carica i dettagli per il trasferimento della riga C
                Ajax_xmofn_TRMP_xMOTRRig_P_AR();
            }
            else {
                PopupMsg_Show("ERRORE", res[0].Result, res[0].Messaggio);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

function Ajax_xmofn_TRMP_xMOTRRig_P_AR() {
    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOTR: fU.ToInt32(oPrg.Id_xMOTR_Edit)
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_TRMP_xMOTRRig_P_AR",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            if (dt.length > 0) {
                pgTRMP_AR_Load(dt);
            }
            else {
                PopupMsg_Show("ERRORE", 1, "Nessun padre da produrre");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

function Ajax_xmosp_TRMP_xMOMatricola_Validate() {

    var res = false;

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOTR: oPrg.Id_xMOTR_Edit,
        Id_xMOTRRig_P: oPrg.TRMP.Id_xMOTRRig_P,
        Cd_xMOMatricola: fU.SsccToMatricola($("#pgTRMP_C_AR .TRMP_AR").find("input[name='Cd_xMOMatricola']").val()),
        Cd_ARLotto: $("#pgTRMP_C_AR .TRMP_AR label.Cd_ARLotto").text().trim(),
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_TRMP_xMOMatricola_Validate",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result > 0) {
                $("#pgTRMP_C_AR .TRMP_AR .Cd_MGUbicazione_P").text(r[0].Cd_MGUbicazione);
                res = true;
            }
            else {
                PopupMsg_Show("ERRORE", r[0].Result, r[0].Messaggio);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
    return res;
}

function Ajax_xmosp_xMOTRRig_P_To_MGMov_Save() {

    $("#pgTRMP_C_AR .TRMP_AR .lg-tranextar").hide();

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOTR: oPrg.Id_xMOTR_Edit,
        Id_xMOTRRig_P: oPrg.TRMP.Id_xMOTRRig_P,
        Cd_xMOMatricola: fU.SsccToMatricola($("#pgTRMP_C_AR .TRMP_AR").find("input[name='Cd_xMOMatricola']").val()),
        Cd_xMOLinea: fU.ToString($("#pgTRMP_C_AR .TRMP_AR").find("input[name='Cd_xMOLinea']").val().toUpperCase()),
        Cd_xMOProgramma: fU.UpTrim(oPrg.Key)
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMOTRRig_P_To_MGMov_Save",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result > 0) {
                $("#pgTRMP_C_AR .TRMP_AR .lbl-esito").html(fU.Adesso() + "<br />Movimento interno " + r[0].Id_MGMovInt + " generato");
                setTimeout(function () {
                    // Memorizzo l'ulimo articolo e lotto letto
                    oPrg.TRMP.Last_Cd_AR = $("#pgTRMP_C_AR .TRMP_AR .Cd_AR").text();
                    oPrg.TRMP.Last_Cd_ARLotto = $("#pgTRMP_C_AR .TRMP_AR .Cd_ARLotto").text();
                    // Torno all'elenco dei C
                    pgTRMP_C_AR_UI();
                    Ajax_xmofn_DORig_GetC();
                }, 2000);

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

function Ajax_xmosp_TRRM_xMOTRRig_PT_Save() {

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Cd_xMOMatricola: fU.SsccToMatricola($("#pgTRRM input[name='Cd_xMOMatricola']").val()),
        Cd_xMOLinea: fU.ToString($("#pgTRRM input[name='Cd_xMOLinea']").val().toUpperCase())
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_TRRM_xMOTRRig_PT_Save",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result > 0) {
                pgTRRM_Load(r[0]);
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

function Ajax_xmosp_TRRM_xMOTRRig_A_MGMovInt_Save() {

    var Cd_xMOMatricola = fU.SsccToMatricola($("#pgTRRM input[name='Cd_xMOMatricola']").val());
    var Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOTR: $("#pgTRRM .div-dati").attr("Id_xMOTR"),
        Id_xMOTRRig_P: $("#pgTRRM .Id_xMOTRRig_P").text(),
        Quantita: $("#pgTRRM .div-dati input[name='Quantita']").val(),
        Cd_ARMisura: $("#pgTRRM .div-dati select[name='Cd_ARMisura']").val().toUpperCase(),
        Cd_MG_A: fU.ToString($("#pgTRRM .div-dati .Cd_MG_A").text()),
        Cd_MGUbicazione_A: fU.ToString($("#pgTRRM .div-dati input[name='Cd_MGUbicazione_A']").val()),
        xMOCompleta: fU.IsChecked($("#pgTRRM .ck-xMOCompleta"))
    };

    $.ajax({
        url: "Logistica.aspx/xmosp_TRRM_xMOTRRig_A_MGMovInt_Save",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result > 0) {
                $("#pgTRRM .div-dati").hide();
                $("#pgTRRM .div-linea").show();
                $("#pgTRRM .div-linea .msg").text(fU.Adesso() + " Trasferimento " + r[0].Id_MGMovInt + " salvato in Arca per " + Cd_xMOMatricola + " in " + Params.Cd_MG_A + (Params.Cd_MGUbicazione_A != '' ? "." + Params.Cd_MGUbicazione_A : ""));
                setTimeout(function () {
                    pgTRRM_UI();
                }, 500);
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

function Ajax_xmofn_xMOMGGiacContabile(mgpa) {

    mgpa = fU.IfEmpty(mgpa, "");
    var giac = 0;

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Cd_AR: ActivePage().find("input[name = 'Cd_AR']").val(),
        Cd_MG: ActivePage().find("input[name='Cd_MG" + mgpa + "']").val(),
        Cd_MGUbicazione: fU.ToString(ActivePage().find("input[name='Cd_MGUbicazione" + mgpa + "']").val()),
        Cd_ARLotto: fU.ToString(ActivePage().find("input[name='Cd_ARLotto']").val())
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_xMOMGGiacContabile",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            dt = $.parseJSON(mydata.d);
            if (dt.length > 0) {
                giac = fU.IfEmpty(dt[0].GiacContabile, 0) + dt[0].Cd_ARMisura;
            }
            else {
                giac = 0;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return giac;
}

function Ajax_xmofn_xMOCheckEAN(Cd_xMOMatricola) {

    $('div.preloader').show();
    var Params = {
        Cd_xMOMatricola: fU.SsccToMatricola(Cd_xMOMatricola)
    };

    $.ajax({
        url: "Logistica.aspx/xmofn_xMOCheckEAN",
        async: true,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);

            if (r[0].xMOCheckEAN) {
                ActivePage().find('div[data-key="EAN"]').show();
                ActivePage().find('input[name="EAN"]').focus().select();
            } else {
                if (ActivePage().find(".ck-autoconfirm").prop("checked") == true) {
                    Ajax_xmosp_xMOMatricola_CPI_Validate(true);
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

// Controlla se la matricola da inserire nel carico di produzione non sia già presente in un altro carico 
function Ajax_xmosp_xMOMatricola_CPI_Validate(Ubica) {

    function setMessage(message) {
        ActivePage().find(".log").html(fU.Adesso());
        ActivePage().find(".msg").text(message);
    }

    var incompleto = null;
    var msg = '';

    setMessage("Attendere...");

    var Cd_xMOLinea = ActivePage().find("input[name='Cd_xMOLinea']").val();
    var matricola = fU.SsccToMatricola(ActivePage().find("input[name='Cd_xMOMatricola']").val());
    var Cd_xMOMatricola = JSON.parse(JSON.stringify(matricola));
    var EAN = ActivePage().find("input[name='EAN']").val();

    if (fU.IsEmpty(Cd_xMOLinea) || fU.IsEmpty(Cd_xMOMatricola)) {
        setMessage("Inserire tutti i dati");
        return;
    }

    $('div.preloader').show();
    var Params = {
        Cd_xMOLinea: Cd_xMOLinea
        , Cd_xMOMatricola: Cd_xMOMatricola
        , EAN: EAN
    };

    $.ajax({
        url: "Logistica.aspx/xmosp_xMOMatricola_CPI_Validate",
        async: true,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            switch (r[0].Result) {
                case 1:
                    // Creo il comando da inviare al listener per generare il carico
                    var cmd = Listener_CPI_Create(Cd_xMOLinea, Cd_xMOMatricola);
                    Ajax_ListenerCoda_Add(cmd);
                    msg = "Matricola [" + Cd_xMOMatricola + "] su linea [" + Cd_xMOLinea + "] inviata al listenere per la creazione del carico.";
                    // Aggiorna il contatore delle letture
                    oPrg.Counter.Set(1);
                    break;
                case -501:
                    //La matricola necessita dell'EAN
                    incompleto = true;
                    msg = r[0].Messaggio;
                    ActivePage().find("input[name='EAN']").val("").focus().select();  //Si posiziona sull'EAN
                    break;
                default:
                    Ubica = false;
                    msg = r[0].Messaggio;
                    break;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ubica = false;
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        },
        complete: function () {
            $('div.preloader').hide();
            setMessage(msg);
            if (!incompleto) {
                // Svuoto tutti i campi tranne la linea
                ActivePage().find("input[name='Cd_xMOMatricola']").val("").focus().select();
                ActivePage().find("input[name='EAN']").val("");
                ActivePage().find('div[data-key="EAN"]').hide();
                // Solo se è andato tutto bene è possibile ubicare
                if (Ubica == true) {
                    // Carica lo stoccaggio merce
                    oPrg.Load("SM");
                    // Imposta la matricola
                    $("#pgSM input[name='Cd_xMOMatricola']").val(Cd_xMOMatricola);
                    // Scatena lo stoccaggio
                    Ajax_xmosp_xMOTRRig_PT_SM_Save(Cd_xMOMatricola, true);
                }
            }
        }
    });


}

// Recupera le note di piede dei documenti che si stanno prelevando nella rilevazione Id_xMORL
function Ajax_xmofn_xMORLPrelievo_NotePiede() {

    // Svuotare il detail 
    $("#Detail_NotePiede li.li-note").remove();

    Params = JSON.stringify({
        Id_xMORL: oPrg.Id_xMORL_Edit
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_xMORLPrelievo_NotePiede",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            Detail_NotePiede_Load(dt);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
    $("#Detail_NotePiede").show();
}

function Ajax_xmosp_CF_Validate(Cd_CF) {

    var r = false;
    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Cd_CF: Cd_CF,
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_CF_Validate",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            if (dt.length > 0) {
                // Controllo che il tipostato: se è nullo proseguo, se non è nullo controllo che tipo è, e visualizzo il messaggio
                if (fU.IsEmpty(dt[0].TipoStato)) {
                    r = true;
                }
                else {
                    switch (dt[0].TipoStato.trim().toUpperCase()) {
                        case 'B':
                            PopupMsg_Show("Impossibile Continuare", 1, dt[0].Msg);
                            break;
                        case 'S':
                            PopupMsg_Show("Attenzione", 1, dt[0].Msg);
                            r = true;
                            break;
                        case 'N':
                        default:
                            r = true;
                            break;
                    }
                }
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
    return r
}

// Elenco di tutti i BC codificati in LWA esclusi i tipi SSCC
function Ajax_xmofn_xMOBarcode() {
    var bc = $("#" + oPrg.ActivePageId).find(".barcode");
    if (!fU.IsEmpty(bc)) {
        //Reset BC 
        $(bc).find("option").remove();
        Params = JSON.stringify({
            Codice: ''
        });
        $.ajax({
            url: "Logistica.aspx/xmofn_xMOBarcode",
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

function Ajax_xmofn_DO() {
    var out = false;

    Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
    };

    $.ajax({
        url: "Logistica.aspx/xmofn_DO",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            out = $.parseJSON(mydata.d);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }

    });
    return out;
}

// -------------------------------------------------
// #1.11 AJAX SEARCH
// -------------------------------------------------

// Elenco Articoli

function Search_Ajax_xmofn_AR() {

    var out = false;

    //Svuota la lista degli articoli
    $("#SearchAR .li-search").remove();
    $("#SearchAR .mo-msg").text("Ricerca...").show();

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit),        // Utile per la selezione degli articoli in fase di prelievo
        Filtro: fU.ToString(oPrg.ActiveSearchValue),
        Fittizio: fU.IsChecked($("#" + oPrg.ActiveSearchId + " .ck-fittizi"))  // Se selezionato visualizzo anche gli ar fittizi
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_AR",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            Search_Articolo_Load(dt);
            out = true;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }

    });
    return out;
}

// Elenco Spedizioni
function Search_Ajax_xmofn_Spedizione() {
    var out = false;

    $("#SearchxMOCodSpe .li-search").remove();

    var Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        F_Cd_xMOCodSpe: fU.ToString(oPrg.ActiveSearchValue),
        F_FinoAOggi: fU.IsChecked(ActivePage().find("input[name='checkFilterDate']")),
    };
    $.ajax({
        url: "Logistica.aspx/xmofn_xMOCodSpe_Search",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            Search_Spedizione_Load(dt);
            out = true;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }

    });

    return out;
}

// Elenco Lotti
function Search_Ajax_xmofn_ARLotto() {

    var out = false;

    $("#SearchARLotto .li-search").remove();

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit),
        Cd_AR: fU.ToString(ActivePage().find("input[name='Cd_AR']").val()),
        Cd_MG: fU.ToString(fMG.Mg4Find(ActivePage().find("input[name='Cd_MG_P']").val(), ActivePage().find("input[name='Cd_MG_A']").val())),
        Cd_MGUbicazione: fU.ToString(fMG.Mg4Find(ActivePage().find("input[name='Cd_MGUbicazione_P']").val(), ActivePage().find("input[name='Cd_MGUbicazione_A']").val())),
        Filtro: fU.ToString(oPrg.ActiveSearchValue),
        GiacPositiva: fU.IsChecked($("#" + oPrg.ActiveSearchId + " .ck-giacpositiva"))
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_ARLotto",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            Search_ARLotto_Load(dt);
            out = true;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }

    });

    return out;
}

// Elenco Clienti/Fornitori
function Search_Ajax_xmofn_CF() {

    var out = false;
    var Params;

    $("#SearchCF .li-search").remove();

    //oPrg.Programma
    switch (oPrg.Key) {
        case "AA":
        case "CFARLIST":
            Params = {
                Terminale: oApp.Terminale,
                Cd_Operatore: oApp.Cd_Operatore,
                TipoCF: '',
                Cd_DO: '',
                TipoPrelievo: 0,
                Filtro: fU.ToString(oPrg.ActiveSearchValue)
            };
            break;
        default:
            Params = {
                Terminale: oApp.Terminale,
                Cd_Operatore: oApp.Cd_Operatore,
                TipoCF: oPrg.drDO ? fU.ToString(oPrg.drDO.CliFor) : '',      // Potrei non avere nessun programma
                Cd_DO: oPrg.drDO ? oPrg.drDO.Cd_DO : '',
                TipoPrelievo: oPrg.drDO ? oPrg.drDO.xMOTipoPrelievo : 0,    // 0 = Nessun prelievo; 1 = Prelievo non obbligatorio; 2 = Prelievo obbligatorio;
                Filtro: fU.ToString(oPrg.ActiveSearchValue)
            };
            break;
    }

    $.ajax({
        url: "Logistica.aspx/xmofn_CF",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            Search_CF_Load(dt, Params.TipoPrelievo);
            out = true;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }

    });

    return out;
}

// Ricerca CF in base al filtro passato (usato per la ricerca quando viene utilizzato lo shortcut nel campo CF)
function Ajax_xmofn_CF(filtro) {

    var dt;

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        TipoCF: '',     // Potrei non avere nessun programma
        Cd_DO: '',
        TipoPrelievo: 0,    // 0 = Nessun prelievo; 1 = Prelievo non obbligatorio; 2 = Prelievo obbligatorio;
        Filtro: filtro
    });
    $.ajax({
        url: "Logistica.aspx/xmofn_CF",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            dt = $.parseJSON(mydata.d);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }

    });

    return dt[0];
}

// Elenco Destinazioni dei CF
function Search_Ajax_xmofn_CFDest() {
    var out = false;

    $("#SearchCFDest .li-search").remove();

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        TipoCF: fU.ToString(oPrg.drDO.CliFor),
        Cd_CF: fU.ToString(ActivePage().find("input[name='Cd_CF']").val()),
        Cd_DO: oPrg.drDO.Cd_DO,
        TipoPrelievo: 0,      //oPrg.drDO.xMOPrelievo,
        Filtro: fU.ToString(oPrg.ActiveSearchValue)
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_CFDest",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            Search_CFDest_Load(dt);
            out = true;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }

    });

    return out;
}

// Elenco Magazzini
function Search_Ajax_xmofn_MG() {

    var out = false;

    $("#SearchMG .li-search").remove();

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Filtro: fU.ToString(oPrg.ActiveSearchValue)
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_MG",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            Search_MG_Load(dt);
            out = true;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }

    });

    return out;
}

// Elenco Ubicazioni
function Search_Ajax_xmofn_MGUbicazione() {

    var out = false;

    $("#SearchMGUbicazione .li-search").remove();

    //Seleziona il magazzino corrente
    var mgPA = fMG.Mg4PA(oPrg.ActiveSearchOutField);

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Cd_MG: fU.ToString(ActivePage().find("input[name='Cd_MG" + mgPA + "']").val()),
        Cd_AR: fU.ToString(ActivePage().find("input[name='Cd_AR']").val()),
        Filtro: fU.ToString(oPrg.ActiveSearchValue.trim()),
        UbiNonCom: fU.IsChecked($("#" + oPrg.ActiveSearchId + " .ck-ubinoncom"))
    });
    $.ajax({
        url: "Logistica.aspx/xmofn_MGUbicazione",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d)
            Search_MGUbicazione_Load(dt);
            out = true;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}

// Elenco Sottocommesse
function Search_Ajax_xmofn_xMODOSottoCommessa() {

    var out = false;

    $("#SearchDOSottoCommessa .li-search").remove();

    Params = JSON.stringify({
        Filtro: fU.ToString(oPrg.ActiveSearchValue)
    });
    $.ajax({
        url: "Logistica.aspx/xmofn_xMODOSottoCommessa",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d)
            Search_DOSottoCommessa_Load(dt);
            out = true;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}

function Search_Ajax_xmofn_CdDes(context) {

    var out = false;

    $("#SearchCdDes .li-search").remove();
    $("#SearchCdDes .lg-title").text(oPrg.ActiveSearchContext);

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Context: context,
        Filtro: fU.ToString(oPrg.ActiveSearchValue)
    });
    $.ajax({
        url: "Logistica.aspx/xmofn_CdDes",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            Search_CdDes_Load(dt);
            out = true;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}

function Search_Ajax_xmofn_DOSdTAnag(context) {

    var out = false;

    $("#SearchDOSdTAnag .li-search").remove();
    $("#SearchDOSdTAnag .lg-title").text(oPrg.ActiveSearchContext);

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Filtro: fU.ToString(oPrg.ActiveSearchValue)
    });
    $.ajax({
        url: "Logistica.aspx/xmofn_" + context,
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            Search_DOSdTAnag_Load(dt);
            out = true;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}

// Elenco UM dell'articolo passato alla funzione
function Search_Ajax_xmofn_ARARMisura() {
    var out = false;

    $("#SearchARARMisura .li-search").remove();

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Cd_AR: fU.ToString(ActivePage().find("input[name='Cd_AR']").val()),
        TipoARMisura: "",
        xMOUmDef: "",
    });
    $.ajax({
        url: "Logistica.aspx/xmofn_ARARMisura",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d)
            Search_ARARMisura_Load(dt);
            out = true;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}

// -------------------------------------------------
// #1.12 AJAX DETAILS
// -------------------------------------------------

// Dettaglio elenco Giacenze dell'AR
function Detail_Ajax_xmofn_ARMGUbicazione_Giac(Cd_AR, Cd_MG) {

    $("#DetailGiacenza .tr-giac").remove();
    $("#DetailGiacenza .tr-tot").remove();

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Cd_AR: Cd_AR,
        Cd_MG: Cd_MG,
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_ARMGUbicazione_Giac",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            if (dt != '') {
                oPrg.DetailGiacenza.dt = dt;
                oPrg.DetailGiacenza.Cd_AR = Cd_AR;
                oPrg.DetailGiacenza.Cd_MG = Cd_MG;
                Detail_Giacenza_Load();
            }
            else
                PopupMsg_Show("Messaggio", 1, "L'articolo non è presente in nessun magazzino");
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }

    });
}

function Detail_Ajax_xmofn_MGUbicazioneAR_Giac() {

    $("#DetailGiacenzaUbicazione .tr-giac").remove();

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Cd_MG: oPrg.DetailGiacenzaUbicazione.Cd_MG,
        Cd_MGUbicazione: oPrg.DetailGiacenzaUbicazione.Cd_MGUbicazione,
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_MGUbicazioneAR_Giac",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            if (dt != '') {
                oPrg.DetailGiacenzaUbicazione.dt = dt;
                Detail_GiacenzaUbicazione_Load();
            }
            else
                PopupMsg_Show("Messaggio", 1, "L'ubicazione è vuota!");
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }

    });
}

// Dettaglio del CF 
function Detail_Ajax_xmovs_CF(Cd_CF) {

    // Svuota il detail
    $("#DetailCF .lbl").text("");

    Params = JSON.stringify({
        Cd_CF: Cd_CF
    });
    $.ajax({
        url: "Logistica.aspx/xmovs_CF",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            // Carica il detail con i dati
            DetailCF_Template(dt[0]);
            $("#DetailCF").show();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }

    });
}

// Dettaglio della CFDest 
function Detail_Ajax_xmovs_CFDest(Cd_CF, Cd_CFDest) {

    // Svuota il detail
    $("#DetailCFDest .lbl").text("");

    Params = JSON.stringify({
        Cd_CF: Cd_CF,
        Cd_CFDest: Cd_CFDest
    });
    $.ajax({
        url: "Logistica.aspx/xmovs_CFDest",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            // Carica il detail con i dati
            DetailCFDest_Template(dt[0]);
            $("#DetailCFDest").show();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }

    });
}

// Dettaglio del DO: recupera la testa
function Detail_Ajax_xmovs_DOTes(Id_DOTes) {
    // Svuota il detail
    $("#DetailDO .lbl").text("");
    $("#DetailDO .tr-dorig").remove();

    Params = JSON.stringify({
        Id_DOTes: Id_DOTes
    });
    $.ajax({
        url: "Logistica.aspx/xmovs_DOTes",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            // Carica il detail con i dati
            DetailDOTes_Template(dt[0]);
            // Carica le righe del DO
            Detail_Ajax_xmovs_DORig(Id_DOTes);
            // Rimuovo lo scroll alla pagina
            fU.Overflow(oPrg.ActivePageId, "hidden");
            DivToggle_Execute($("#DetailDO .div-notepiede"), false);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }

    });
}

// Dettaglio del DO: recupera le righe
function Detail_Ajax_xmovs_DORig(Id_DOTes) {

    Params = JSON.stringify({
        Id_DOTes: Id_DOTes
    });
    $.ajax({
        url: "Logistica.aspx/xmovs_DORig",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            // Carica il detail con i dati
            DetailDORig_Load(dt);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }

    });

}

// Dettaglio delle Letture effettuate in RL
function Detail_Ajax_xmovs_xMORLRig() {

    // Svuoto il dettaglio
    oPrg.RL.dtRLRig = [];
    $("#Detail_Letture .li-rig").remove();
    $("#Detail_Letture .mo-msg").hide();

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit)
    });
    $.ajax({
        url: "Logistica.aspx/xmovs_xMORLRig",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            oPrg.RL.dtRLRig = $.parseJSON(mydata.d);
            // Carica il detail delle letture effettuate con i dati
            if (oPrg.RL.dtRLRig.length > 0) {
                var li = $("#Detail_Letture .template").clone().removeAttr("style").addClass("li-rig");
                for (var i = 0; i < oPrg.RL.dtRLRig.length; i++) {
                    $("#Detail_Letture ul").prepend(DetailRLRig_Template(li.clone(), oPrg.RL.dtRLRig[i], i));
                }
            }
            else {
                $("#Detail_Letture .mo-msg").show();
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

// Dettaglio delle letture effettuate in TR di PARTENZA
function Detail_Ajax_xmovs_xMOTRRig_P() {

    // Svuoto il dettaglio
    $("#Detail_Letture .li-rig").remove();

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOTR: fU.ToInt32(oPrg.Id_xMOTR_Edit)
    });
    $.ajax({
        url: "Logistica.aspx/xmovs_xMOTRRig_P",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            // Carica il detail delle letture effettuate con i dati
            DetailTRRig_P_Load(dt);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }

    });
}

// Dettaglio delle letture effettuate in TR di ARRIVO
function Detail_Ajax_xmovs_xMOTRRig_A() {

    // Svuoto il dettaglio
    $("#Detail_Letture .li-rig").remove();

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMOTR: fU.ToInt32(oPrg.Id_xMOTR_Edit)
    });
    $.ajax({
        url: "Logistica.aspx/xmovs_xMOTRRig_A",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            // Carica il detail delle letture effettuate con i dati
            DetailTRRig_A_Load(dt);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }

    });
}

function Detail_Ajax_xmofn_xMORLRigPackingList_AR() {
    // Svuoto il dettaglio
    $("#Detail_PackingList .pk-dati").remove();
    // Svuoto i totali dei pesi
    $("#Detail_PackingList .tr-pktotali td").text("");

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit)
    });
    $.ajax({
        url: "Logistica.aspx/xmofn_xMORLRigPackingList_AR",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            // Carica il detail della packing
            DetailPackingList_Load(dt);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }

    });

}

// -------------------------------------------------
// ENDREGION: CHIAMATE AJAX
// -------------------------------------------------
// -------------------------------------------------
// #1.20 REGION: BARCODE
// -------------------------------------------------

// Carica i tipi di Barcode
function Barcode_Load(div_bc) {
    var i = 0;
    var s = $(div_bc).find("select");

    //aggiunge un elemento vuoto
    s.append($('<option>', {
        value: "",
        text: "",
        pos: 0,
        tipo: "",
        num: 0
    }));

    //aggiunge tutti i bc alla lista 
    $.each(oPrg.BC.BarcodeList, function (key, obj) {
        s.append($('<option>', {
            value: obj.Cd_xMOBC,
            text: obj.Descrizione,
            pos: obj.Posizione,
            tipo: obj.Tipo,
            num: (i += 1)
        }));
    });
    //Seleziona il primo elemento con posizione più bassa
    $(s).val($(s).find("[pos='1']:first").val());

    if ($(div_bc).find("option:first").attr("Tipo") == 2) {
        $(div_bc).find(".ck-autoconfirm").attr("disabled", "disabled").attr("checked", false);
    }
    else {
        $(div_bc).find(".ck-autoconfirm").removeAttr("disabled").attr("checked", true);
    }
}

function BarcodeDetail_Update(id_lettura, Result, Messaggio) {
    //Salva la lettura letta
    if (Result == 1) {
        //Tutto ok
        // fnl i -> img and change the attribute src
        $("#DetailBarcode li[lettura=" + id_lettura + "]").find("img").attr("src", "icon/Valido.svg");
    } else {
        //Errore
        // fnl i -> img and change the attribute src
        $("#DetailBarcode li[lettura=" + id_lettura + "]").find(".messaggio").html(Messaggio);
        $("#DetailBarcode li[lettura=" + id_lettura + "]").find("img").attr("src", "icon/NonValido.svg");
        var nErr = fU.ToInt32($("#DetailBarcode label.err").text());
        $("#DetailBarcode label.err").text(nErr + 1);
    }

}

// Validazione di un codice BC di tipo SSCC 
function Ajax_Sscc_Validate_xMORLRig_Save(bc_val, id_lettura) {
    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit),
        Cd_xMOBC: oPrg.BC.CurrentBC.Cd_xMOBC,
        Sscc: bc_val,
        StepCtrl: fU.ToInt32(oPrg.RL.StepCtrl),
        id_lettura: id_lettura
    });

    //------------------------------------------------------------
    // ATTENZIONE! La funzione è sincrona se il Detail è chiuso!!!
    //------------------------------------------------------------


    $.ajax({
        url: "Logistica.aspx/xmosp_Sscc_Validate_xMORLRig_Save",
        async: oPrg.BC.DetailOn,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);

            // (2):richiesto intervento dell'operatore
            if (r[0].Result > 1) {
                oPrg.RL.StepCtrl = fU.ToInt32(r[0].StepCtrl);
                //Memorizza gli attributi pa ripassare alla funzione Ajax_Sscc_Validate_xMORLRig_Save
                $("#Popup_Sscc_OpConfirm .sscc-ok").attr("bc_val", bc_val).attr("id_lettura", id_lettura);
                //Apre il popup per la conferma operatore
                $("#Popup_Sscc_OpConfirm").show().find(".msg").text(r[0].Result + ": " + r[0].Messaggio);

            } else {

                //Aggiorna il detail 
                if (oPrg.BC.CurrentBC.Detail) {
                    BarcodeDetail_Update(id_lettura, r[0].Result, r[0].Messaggio)
                }

                //Se il detail non è aperto ed è presente un errore lo mostra
                if (!oPrg.BC.DetailOn && r[0].Result <= 0) {
                    //Mostra l'errore
                    PopupMsg_Show("ERRORE", r[0].Result, r[0].Messaggio);
                }
                //Aggiorna le righe delle letture
                Ajax_xmofn_xMORLRig_AR();
            }

        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }

    });
}

// Creazione SSCC
function Barcode_Detail_AddBc(bc_val) {
    //Restituisce la posizione inserita del Bc
    return oPrg.BC.Detail_BcAdd(bc_val);
}

//Seleziona il barcode da posizione e numero
function Barcode_SelByPos(pos, num) {
    var p = $("#" + oPrg.ActivePageId);

    var bc_next = $(p).find(".barcode select").find("[pos='" + pos + "'][num='" + num + "']").val();
    var setIt = !fU.IsEmpty(bc_next);
    if (setIt) {
        //Imposta il bc
        $(p).find(".barcode select").val(bc_next);
        //Riposizione la classe BC alla selezione
        Barcode_SelType();
    }

    return (setIt);
}

// Gestisce la selezione del barcode per automatizzare l'interfaccia 
function Barcode_SelType() {
    //Memorizza l'idx corrente
    oPrg.BC.SetCurrentBC(fU.ToString($("#" + oPrg.ActivePageId).find(".barcode option:selected").val()));
    //Se il BC corrente possiede il detail mostra l'incona per l'inserimento
    if ($("#" + oPrg.ActivePageId).find(".barcode .detail-bc").val() != "")
        if (oPrg.BC.CurrentBC && oPrg.BC.CurrentBC.Detail)
            fU.ShowIf($("#" + oPrg.ActivePageId).find(".barcode .detail-bc"), oPrg.BC.CurrentBC.Detail);
    $("#" + oPrg.ActivePageId).find("input[name='xMOBarcode']").focus().select();
}

// Apre il detail dell'inserimento dei Bc 
function Detail_Barcode() {
    //Richiama la funzione centralizzata del detail del barcode
    oPrg.BC.Detail_Open()
}

// Lettura dei barcode 
function Barcode_Interpreter(bc_val, id_lettura, callback) {
    // Recupero il barcode selezionato
    var barcodeSelect = ActivePage().find(".barcode select");

    // Handler per la gestione del PopUp
    var handleBarcodePupup = function (barcodes) {
        var popupBC = $('#Popup_BC_Select');
        popupBC.find('button').unbind('click');
        var popupBC_Close = function () {
            popupBC.hide();
            barcodeList.empty();
            barcodeSelect.val('');
        }
        var barcodeList = popupBC.find('ol[data-key="BarcodeList"]');
        barcodeList.empty();
        barcodes.forEach(function (barcode) {
            barcodeList.append($('<li>')
                .text(barcode.resultText)
                .click(function () {
                    handleBarcodeSet(barcode);
                    handleBarcode(id_lettura);
                    popupBC_Close();
                    if (callback) callback();
                }));
        });
        popupBC.find('button').click(function () {
            popupBC_Close();
            ActivePage().find('input[name="xMOBarcode"]').focus().select();
        });
        popupBC.show();
    }

    try {
        // Se il barcode non è selezionato, verifico tutti quelli con Posizione = 0
        if (barcodeSelect.val().trim() == '') {
            // Interpreto il barcode con tutte le tipologie
            var barcodes = readAllBarcodes(oPrg.BC, bc_val);
            // Verifico che ci siano risultati
            if (barcodes.length == 0)
                throw new Error("Barcode non interpretato. Selezionare manualmente un barcode!!");
            // Se c'è un solo barcode, lo seleziono
            if (barcodes.length == 1) {
                handleBarcodeSet(barcodes[0]);
                handleBarcode(id_lettura);
                if (callback) callback();
                return;
            }
            // Mostro il PopUp di selezione
            handleBarcodePupup(barcodes);
        } else {
            if (!oPrg.BC.Read(bc_val))
                throw new Error("Barcode non interpretato!!");
            if (oPrg.BC.Results.length > 1) {
                var barcodes = [];
                oPrg.BC.Results.forEach(function (result) {
                    barcodes.push({
                        value: oPrg.BC.CurrentStr,
                        barcode: oPrg.BC.CurrentBC,
                        result: result,
                        resultText: barcodeResultToString(result),
                        detailOn: oPrg.BC.DetailOn,
                        resultIsValid: oPrg.BC.ResultIsValid
                    });
                });
                handleBarcodePupup(barcodes);
            } else {
                handleBarcode(id_lettura);
                if (callback) callback();
            }
        }
    } catch (err) {
        console.log(err);
        // Mostra l'errore nel dettaglio (se gestito dal BC)
        if (id_lettura)
            BarcodeDetail_Update(id_lettura, -999, err);
        // Mostra l'errore se il dettaglio è chiuso
        if (!$("#DetailBarcode").is(":visible"))
            PopupMsg_Show("Errore Barcode", 1, err.message);
    }
}

// Interpreta l'alias nel barcode letto  
function Barcode_Interpreter_Alias(bc_val) {
    var err = "";
    var p = $("#" + oPrg.ActivePageId);
    // verifica se la struttura del BC è codificata e quindi risulta interpretabile
    if (oPrg.BC.Read(bc_val)) {
        //Interpreta il tipo di barcode
        switch (oPrg.BC.CurrentBC.Tipo) {
            case SSCC:
                break;
            case STD:
            case GS1:
                //lettura effettuata a buon fine
                for (var key in oPrg.BC.Result) {
                    if (key.toLowerCase() == 'cd_ar') {
                        //ASSEGNA il valore al cmapo ALI o ALT contenuto in oApp.TipoAA.toUpperCase()
                        $(p).find("input[name='" + oApp.TipoAA.toUpperCase() + "']").val(oPrg.BC.Result[key]);
                        return;
                    }
                }
                break;
            default:
                err = "ENUM di interpretazione del Barcode inesistente!!";
        }
    } else {
        err = 'Barcode non interpretabile!';
    }

    return (fU.IsEmpty(err));
}

// -------------------------------------------------
// ENDREGION: BARCODE
// -------------------------------------------------
// -------------------------------------------------
// #1.30 REGION: FUNZIONI UI
// -------------------------------------------------

function pgGENCARICHI_UI() {
    ActivePage().find('div[data-key="EAN"]').hide();
    // Consorzio Logic
    if (oApp.LicF_Id == 66809 || true) {
        // Nascondo il pulsante ubica
        ActivePage().find(".btn-conferma").hide();
        //Ubind degli eventi
        ActivePage().find("input[name='Cd_xMOMatricola']").unbind('focusout');
        ActivePage().find("input[name='EAN']").unbind('focusout');
        //Attivo la verifica dell'EAN
        ActivePage().find("input[name='Cd_xMOMatricola']").on('focusout', function () {
            if ($(this).val() != "")
                Ajax_xmofn_xMOCheckEAN($(this).val());
        });
        ActivePage().find("input[name='EAN']").on('focusout', function () {
            if ($(this).val() != "")
                if (ActivePage().find(".ck-autoconfirm").prop("checked") == true) {
                    Ajax_xmosp_xMOMatricola_CPI_Validate(true);
                }
        });
    }
}

function pgAvviaConsumo_UI() {
    //Carico le line di produzione
    Linea_Load();

    //Propongo nel campo data la data odierna
    $("#pgAvviaConsumo [name='DataOra']").val(fU.ToDate($.now()));
}

function pgRL_UI() {

    //Pulizia dei campi della pagina corrente
    fPage.Clear();

    // Rendo visibile il campo della destinazione (potrebbe essere stato nascosto in modalità edit)
    $("#pgRL .div-dest").show();

    //Carico la label dell'input cliente/fornitore
    if (oPrg.drDO.CliFor == "F") { $("#pgRL .title").text("FORNITORE"); }
    else if (oPrg.drDO.CliFor == "C") { $("#pgRL .title").text("CLIENTE"); }
    else $("#pgRL .title").text("CLIENTE/FORNITORE");

    //Carico i dati di testa della pagina
    $("#pgRL .lb-doc-id").text(fU.IsEmpty(oPrg.Id_xMORL_Edit) ? "" : oPrg.Id_xMORL_Edit);
    $("#pgRL .lb-doc-name").text(oPrg.drDO.Cd_DO);
    $("#pgRL .lb-doc-desc").text(oPrg.drDO.DO_Descrizione);

    //Visualizza l'icona di ricerca del campo
    $("#pgRL [searchkey='Cd_CF']").show();
    //Carico il CF e la descrizione (se impostato come daufault)
    $("#pgRL [name='Cd_CF']").val(oPrg.drDO.xMOCd_CF);
    $("#pgRL [name='CF_Descrizione']").text(oPrg.drDO.xMOCF_Descrizione);

    // Nascono icona del dettaglio CF
    $("#pgRL .detail").hide();

    // Carico CFDest e la descrizione (se impostata come default)
    $("#pgRL [name='Cd_CFDest']").val(oPrg.drDO.xMOCd_CFDest);
    $("#pgRL [name='CFDest_Descrizione']").text(oPrg.drDO.xMOCFDest_Descrizione);

    //Propongo nel campo data quella odierna
    $("#pgRL [name='DataDoc']").val(fU.DateFormatToBrowserLang(fU.ToDate($.now())));

    //Imposto i Check di Gestione
    fU.CheckIf($("#pgRL .ck-prelievo"), (oPrg.drDO.xMOPrelievo > 0 ? true : false));
    fU.CheckIf($("#pgRL .ck-ubicazione"), oPrg.drDO.xMOUbicazione);
    fU.CheckIf($("#pgRL .ck-lotto"), oPrg.drDO.xMOLotto);

    //Fuori lista
    fU.CheckIf($("#pgRL .ck-fuorilista"), oPrg.drDO.xMOFuoriLista);

    //Cambio l'etichetta dei fuori lista
    switch (oPrg.drDO.xMOFuoriLista) {
        case 0:
            $("#pgRL .fuorilista .etichetta").html("Fuori lista");
            break;
        case 1:
            $("#pgRL .fuorilista .etichetta").html("Fuori lista (Cod. e Qta)");
            break;
        case 2:
            $("#pgRL .fuorilista .etichetta").html("Fuori lista (Qta)");
            break;
    }

    //Mostro il check fuorilista solo se il prelievo è attivo  
    fU.ShowIf($("#pgRL .fuorilista"), fU.IsPrelievoUI(oPrg.drDO.xMOPrelievo));

    //Cambia l'etichetta se il prelievo è obbligatorio
    switch (oPrg.drDO.xMOPrelievo) {
        case 0:
            $("#pgRL .prelievo .etichetta").text("No prelievo");
            break;
        case 1:
            $("#pgRL .prelievo .etichetta").text(oPrg.drDO.xMOPrelievoObb ? "Prelievo Obbligatorio" : "Prelievo");
            break;
        case 2:
            $("#pgRL .prelievo .etichetta").text(oPrg.drDO.xMOPrelievoObb ? "Copia righe Obbligatoria" : "Copia righe");
            break;
        case 3:
            $("#pgRL .prelievo .etichetta").text("Preleva automaticamente dal più vecchio.");
            break;
    }

    //Mostra le linee di produzione se gestite dal doc
    fU.ShowIf($("#pgRL .div-linea"), oPrg.drDO.xMOLinea);
    //Carico le linee di produzione
    Linea_Load();

    // Magazzino di Partenza
    if (oPrg.drDO.MagPFlag) {
        $("#pgRL .div-mgp").show();
        //Carica il magazzino e l'ubicazione se impostato nel documento
        $("#pgRL input[name='Cd_MG_P']").val(oPrg.drDO.Cd_MG_P);
        $("#pgRL input[name='Cd_MGUbicazione_P']").val(oPrg.drDO.Cd_MGUbicazione_P);
        //Se il magazzino è fisso lo blocco e nascondo l'icona di ricerca
        fU.DisableIf($("#pgRL input[name='Cd_MG_P']"), oPrg.drDO.UIMagPFix);
        fU.ShowIf($("#pgRL i[searchkey='Cd_MG_P']"), !oPrg.drDO.UIMagPFix);
    }
    else { $("#pgRL .div-mgp").hide(); }

    // Magazzino di Arrivo
    if (oPrg.drDO.MagAFlag) {
        $("#pgRL .div-mga").show();
        //Carica il magazzino e l'ubicazione se impostato nel documento
        $("#pgRL input[name='Cd_MG_A']").val(oPrg.drDO.Cd_MG_A);
        $("#pgRL input[name='Cd_MGUbicazione_A']").val(oPrg.drDO.Cd_MGUbicazione_A);
        //Se il magazzino è fisso lo blocco e nascondo l'icona di ricerca
        fU.DisableIf($("#pgRL input[name='Cd_MG_A']"), oPrg.drDO.UIMagAFix);
        fU.ShowIf($("#pgRL i[searchkey='Cd_MG_A']"), !oPrg.drDO.UIMagAFix);
    }
    else { $("#pgRL .div-mga").hide(); }

    // Se nessuno dei due mg sono gestiti nascondo anche l'intestazione
    fU.ShowIf($("#pgRL .div-magazzini"), !oPrg.drDO.MagAFlag && !oPrg.drDO.MagPFlag == true ? false : true);

    // Visualizzo il campo Commessa se gestito
    fU.ShowIf($("#pgRL .div-com"), oPrg.drDO.xMODOSottoCommessa);

    // Gestione EDIT della pagina
    pgRL_UI_Edit();

}

function pgRL_UI_Edit() {

    var InEdit = (fU.ToInt32(oPrg.Id_xMORL_Edit) > 0 ? true : false);

    //Visualizza la descrizione del DO che sto creando 
    if (InEdit) {

        // Nascondo l'icona di ricerca del campo CF
        $("#pgRL [searchkey='Cd_CF']").hide();
        // Mostro l'icona del dettaglio CF
        $("#pgRL .detail").show();

        // Show del campo SO se ci sono destinazioni per il cliente selezionato
        fU.ShowIf($("#pgRL .div-dest"), !fU.IsEmpty(oPrg.drRL.Cd_CFDest));

        $("#pgRL .lb-doc-id").text(oPrg.Id_xMORL_Edit);
        $("#pgRL [name='Cd_CF']").val(oPrg.drRL.Cd_CF);
        $("#pgRL [name='CF_Descrizione']").text(oPrg.drRL.CF_Descrizione);
        $("#pgRL [name='Cd_CFDest']").val(oPrg.drRL.Cd_CFDest);
        $("#pgRL [name='CFDest_Descrizione']").text(oPrg.drRL.CFDest_Descrizione);
        $("#pgRL [name='Cd_DOSottoCommessa']").val(oPrg.drRL.Cd_DOSottoCommessa);
        $("#pgRL [name='DataDoc']").val(fU.DateFormatToBrowserLang(fU.ToDate(oPrg.drRL.DataDoc)));
        $("#pgRL [name='NumeroDocRif']").val(oPrg.drRL.NumeroDocRif);
        $("#pgRL [name='DataDocRif']").val(fU.DateFormatToBrowserLang(fU.ToDate(oPrg.drRL.DataDocRif)));
        $("#pgRL [name='Cd_MG_P']").val(oPrg.drRL.Cd_MG_P);
        $("#pgRL [name='Cd_MG_A']").val(oPrg.drRL.Cd_MG_A);
        $("#pgRL [name='Cd_xMOLinea']").val(oPrg.drRL.Cd_xMOLinea);
    }

    //Disabilita i campi in edit
    $("#pgRL [name='Cd_CF']").prop('disabled', InEdit);
    $("#pgRL [name='Cd_CF'] .mi").prop('disabled', InEdit);
}

function pgRLRig_UI() {


    // Se non esiste prelievo per la rilevazione nascondo la colonna evadibile
    fU.ShowIf(ActivePage().find(".lg-table .QtaEvadibile"), oPrg.drRL.CountPrelievi <= 0 ? false : true)

    // Visualizzo il div della packing se abilitata per il documento corrente
    // e reset variabile dettaglio PK
    fU.ShowIf(ActivePage().find(".div-packinglist"), (oPrg.drDO.PkLstEnabled));
    oPrg.PK.PackListRef = '';

    // Visualizzo la commessa se gestita 
    fU.ShowIf(ActivePage().find(".div-com"), oPrg.drDO.xMODOSottoCommessa);

    // Se la commessa è stata inserita sulla testa del DO blocco il campo e ripropongo quella selezionata e nascondo la ricerca
    if (!fU.IsEmpty(ActivePage().find("input[name='Cd_DOSottoCommessa']").val())) {
        ActivePage().find("input[name='Cd_DOSottoCommessa']").val($("#pgRL input[name='Cd_DOSottoCommessa']").val()).prop("disabled", 'disabled');
        ActivePage().find("img[searchkey='Cd_DOSottoCommessa']").hide();
    }
    else {
        ActivePage().find("input[name='Cd_DOSottoCommessa']").val("").prop("disabled", "");
        ActivePage().find("img[searchkey='Cd_DOSottoCommessa']").show();
    }

    // Mostra il campo barcode se ci sono barcode codificati nel DB
    fU.ShowIf(ActivePage().find(".div-barcode"), !fU.IsEmpty(oPrg.drDO.xMOBarcode));

    //// Seleziona unità di misura definita
    // ATTENZIONE VENIVA IMPOSTATA L'UM CON IL CAMPO DEL DEFAUTL DEL DOC: NO SENSE!!
    //ActivePage().find("select[name='Cd_ARMisura']").val((fU.ToString(oPrg.drDO.xMOUmDef)).toLowerCase());
    //alert(fU.ToString(oPrg.drDO.xMOUmDef));

    // Imposta il check dell'autoconferma in base alla parametrizzazione del documento
    fU.CheckIf(ActivePage().find(".ck-autoconfirm"), oPrg.drDO.xMOAutoConfirm);

    // Svuota la label contenente l'alias/alternativo/AR
    ActivePage().find(".ar-aa").text("");
    ActivePage().find(".ar-qta-info").text("");

    // Svuota il select delle UM
    ActivePage().find("select[name='Cd_ARMisura'] .op-um").remove();

    //Svuota le info aggiuntive
    ActivePage().find("label[name='InfoExt']").html("");

    // Mostra il campo lotto se gestito
    fU.ShowIf(ActivePage().find(".div-lotto"), fU.ToBool(oPrg.drDO.xMOLotto));
    //Il lotto gestisce la data scadenza se può essere auto generato
    fU.ShowIf(ActivePage().find(".lotto-scad"), fU.ToBool(oPrg.drDO.xMOLotto) && (oPrg.drDO.ARLottoAuto == 0 ? false : true));

    // Mostra la scadenza del lotto se gestito
    fU.ShowIf(ActivePage().find(".div-lotto"), fU.ToBool(oPrg.drDO.xMOLotto));

    // Mostra il campo matricole se gestite
    fU.ShowIf(ActivePage().find(".div-matricola"), fU.ToBool(oPrg.drDO.MtrEnabled));

    // Varibile che serve per identificare il magazzino da cui recuperare la giacenza contabile
    var mgpa_g = "";
    // Mostra il MG PARTENZA se gestito
    if (fU.ToBool(oPrg.drDO.MagPFlag)) {
        // Disabilita l'input del mgp se fisso
        fU.DisableIf(ActivePage().find("input[name='Cd_MG_P']"), fU.ToBool(oPrg.drDO.UIMagPFix));
        // Carico mgp dal default della testa
        ActivePage().find("input[name='Cd_MG_P']").val($("#pgRL input[name='Cd_MG_P']").val());

        // Se il magazzino di p è ancora vuoto imposto quello di default del documento da creare 
        if (fU.IsEmpty(ActivePage().find("input[name='Cd_MG_P']").val()))
            ActivePage().find("input[name='Cd_MG_P']").val(oPrg.drDO.Cd_MG_P);

        if (fU.IsEmpty(ActivePage().find("input[name='Cd_MGUbicazione_P']").val()))
            ActivePage().find("input[name='Cd_MGUbicazione_P']").val(oPrg.drDO.Cd_MGUbicazione_P);

        // Scrive nella lbl del header il contenuto dell'input 
        ActivePage().find(".cd_mg_p").text(ActivePage().find("input[name='Cd_MG_P']").val());
        // Mostro l'icona di ricerca del campo se mgp non è fisso fnl i --> img
        fU.ShowIf(ActivePage().find("img[searchkey='Cd_MG_P']"), !fU.ToBool(oPrg.drDO.UIMagPFix));

        // Ubicazione proposta solo se attiva nel documento
        fU.ShowIf(ActivePage().find('[data-key="MacroUbi_P"]'), (oPrg.drDO.MacroUbi_P != 'N' ? true : false));

        // Se il magazzino è stato indicato racchiudo l'accordion (solo se non è stato richiesto di proporre l'ubicazione)
        var mostra_P;
        mostra_P = fU.IsEmpty(ActivePage().find("input[name='Cd_MG_P']").val()) || fU.ToBool(oPrg.drDO.xMOUbicazione);
        DivToggle_Execute(ActivePage().find(".div-mgp"), mostra_P);
        ActivePage().find(".div-mgp").show();

        mgpa_g = "_P";
    }
    else {
        ActivePage().find(".div-mgp").hide();
    }

    // Mostra il MG ARRIVO se gestito
    if (fU.ToBool(oPrg.drDO.MagAFlag)) {

        // Disabilita l'input del mga se fisso
        fU.DisableIf(ActivePage().find("input[name='Cd_MG_A']"), fU.ToBool(oPrg.drDO.UIMagAFix));
        // Carico mga dal default della testa
        ActivePage().find("input[name='Cd_MG_A']").val($("#pgRL input[name='Cd_MG_A']").val());

        // Se il magazzino di A è ancora vuoto imposto quello di default del documento da creare 
        if (fU.IsEmpty(ActivePage().find("input[name='Cd_MG_A']").val()))
            ActivePage().find("input[name='Cd_MG_A']").val(oPrg.drDO.Cd_MG_A);

        if (fU.IsEmpty(ActivePage().find("input[name='Cd_MGUbicazione_A']").val()))
            ActivePage().find("input[name='Cd_MGUbicazione_A']").val(oPrg.drDO.Cd_MGUbicazione_A);

        // Scrive nella lbl del header il contenuto dell'input 
        ActivePage().find(".cd_mg_a").text(ActivePage().find("input[name='Cd_MG_A']").val());
        // Mostro l'icona di ricerca del campo se mga non è fisso   fnl i --> img
        fU.ShowIf(ActivePage().find("img[searchkey='Cd_MG_A']"), !fU.ToBool(oPrg.drDO.UIMagAFix));

        // Ubicazione proposta solo se attiva nel documento
        fU.ShowIf(ActivePage().find('[data-key="MacroUbi_A"]'), (oPrg.drDO.MacroUbi_A != 'N' ? true : false));

        // Se il magazzino è stato indicato racchiudo l'accordion (solo se non è stato richiesto di proporre l'ubicazione)
        var mostra_A;
        mostra_A = fU.IsEmpty(ActivePage().find("input[name='Cd_MG_A']").val()) || fU.ToBool(oPrg.drDO.xMOUbicazione);
        DivToggle_Execute(ActivePage().find(".div-mga"), mostra_A);
        ActivePage().find(".div-mga").show();

        mgpa_g = fU.IfEmpty(mgpa_g, "_A");
    }
    else {
        ActivePage().find(".div-mga").hide();
    }

    //Gestione dove sei
    var ShowDoveSei = ((fU.ToBool(oPrg.drDO.xMOUbicazione) && (oPrg.drDO.MacroUbi_P != "N" || oPrg.drDO.MacroUbi_A != "N")) ? true : false)
    fU.ShowIf(ActivePage().find(".div-dove-sei"), ShowDoveSei)
    fU.ShowIf(ActivePage().find(".macroubi-p-exe"), ShowDoveSei && oPrg.drDO.MacroUbi_P != "N");
    fU.ShowIf(ActivePage().find(".macroubi-a-exe"), ShowDoveSei && oPrg.drDO.MacroUbi_A != "N");
    //Attiva le issue solo se è presente il prelievo e il tipo di issue 
    var ShowIssue = (oPrg.drDO.xMOPrelievo && oPrg.drDO.xMOIssueTipo != "NPN" ? true : false)
    fU.ShowIf(ActivePage().find(".span-dovesono-issue"), ShowIssue);
    fU.ShowIf($("#Popup_PackList_New").find(".bt-pk-add-and-issue"), ShowIssue);
    if (ShowDoveSei) {
        DivToggle_Execute(ActivePage().find(".div-dove-sei"), false);
        doveSono_Text();
    }

    // Mostro le ubicazioni e la ricerca ubicazioni se gestite
    fU.ShowIf(ActivePage().find(".div-mgubip"), fU.ToBool(oPrg.drDO.xMOUbicazione));
    fU.ShowIf(ActivePage().find(".div-mgubia"), fU.ToBool(oPrg.drDO.xMOUbicazione));

    // Svuota la label dell'ultima lettura
    ActivePage().find(".lastread").text("");

    // Crea e Visualizza i campi personalizzati configurati nel documento secondo la struttura presente nell'xml
    ExtFld_Load();

    // Se attivo il check abilita generazione rettifiche visualizza il link che apre il popup per generare rettifiche di magazzino
    ActivePage().find(".div-mgret").hide();
    ActivePage().find(".giaccontabile").text("");
    if (oPrg.drDO.xMOMGRetAbilita) {
        ActivePage().find(".div-mgret").show();
        ActivePage().find("input[name='Quantita']").on("focus", function () {
            // Caricare giacenza contabile dell'articolo selezionato se l'input ar non è vuoto
            if (!fU.IsEmpty(ActivePage().find("input[name='Cd_AR']").val())) {
                var giac = Ajax_xmofn_xMOMGGiacContabile(mgpa_g);
                ActivePage().find(".giaccontabile").text(giac);
            }
        });
    }

    //Info
    ActivePage().find("#rlrinfo").text("[" + oPrg.Id_xMORL_Edit + "] - " + oApp.Cd_Operatore + " - " + oApp.Ditta + " - Ver. " + Versione);

    //Note con conferma
    if (oPrg.drDO.xMONoteUICheck)
        Ajax_xmofn_DoTes_Note(oPrg.Id_xMORL_Edit, 0);

    // Pers. GHELFI - P00009211
    if (fU.checkPers(oPrg.drDO.xMOPers, 9350))
        P00009211_pgRLRig_UI();
}

// Gestione icon delete e dettagglio in base alla presenza di letture
function pgRLRig_Letture_UI() {
    var p = "#" + oPrg.ActivePageId;
    $(p).find(".letture").text(oPrg.RL.Letture);
    if (oPrg.RL.Letture == 0) {
        $(p).find(".div-letture .delete").hide();
        $(p).find(".div-letture .detail-letture").hide();
    } else {
        $(p).find(".div-letture .delete").show();
        $(p).find(".div-letture .detail-letture").show();
    }
}

function pgRLPiede_UI() {

    // Se non esistono moduli per il tipo di doc nascondo lo stampa
    fU.ShowIf(ActivePage().find(".btn-stampa"), oPrg.drDO.Moduli > 0 ? true : false);
    fU.ShowIf(ActivePage().find(".btn-stampa"), oPrg.drDO.Moduli > 0 ? true : false);

    // Se non esiste prelievo per la rilevazione nascondo le card di riepilogo
    fU.ShowIf(ActivePage().find(".div-riepilogo"), oPrg.drRL.CountPrelievi <= 0 ? false : true)

    ActivePage().find(".rlp-cddo").text(oPrg.drDO.Cd_DO);
    ActivePage().find(".rlp-iddo").text(oPrg.Id_xMORL_Edit);
    ActivePage().find(".rlp-descdo").text(oPrg.drDO.DO_Descrizione);
    ActivePage().find(".rlp-datado").text(fU.DateJsonToDate(oPrg.drRL.DataDoc));
    //ActivePage().find(".rlp-clido").html(oPrg.drRL.Cd_CF + '&nbsp;' + (!fU.ToString(oPrg.drRL.CFDest_Descrizione).trim() ? fU.ToString(oPrg.drRL.CF_Descrizione) : fU.ToString(oPrg.drRL.CFDest_Descrizione)));
    var cfDati = '<span class="w3-blue">'.concat(oPrg.drRL.Cd_CF + '</span>'
        , '<span>&nbsp;-&nbsp;', fU.ToString(oPrg.drRL.CF_Descrizione).trim() + '</span>')
    if (fU.IsEmpty(oPrg.drRL.CFDest_Descrizione))
        cfDati = cfDati.concat('<span class="w3-small">&nbsp;-&nbsp;', fU.ToString(oPrg.drRL.CF_Indirizzo).trim(), '</span>');
    else
        cfDati = cfDati.concat('<br />'
            , '<span class="w3-green">', oPrg.drRL.Cd_CFDest + '</span>'
            , '<span>&nbsp;-&nbsp;', fU.ToString(oPrg.drRL.CFDest_Descrizione).trim() + '</span>'
            , '<span class="w3-small">&nbsp;-&nbsp;', fU.ToString(oPrg.drRL.CFDest_Indirizzo).trim(), '</span>')
    ActivePage().find(".rlp-clido").html(cfDati);

    var div;
    div = ActivePage().find("#divDatiSpedizione");
    //Spedizione
    ActivePage().find("input[name='Targa']").val(oPrg.drRL.Targa);
    ActivePage().find("input[name='Cd_DoTrasporto']").val(oPrg.drRL.Cd_DoTrasporto);
    ActivePage().find("input[name='TrasportoDataora']").val(fU.DateJsonToStandard(oPrg.drRL.TrasportoDataora, true));
    ActivePage().find("input[name='Cd_DoVettore_1']").val(fU.ToString(oPrg.drRL.Cd_DoVettore_1));
    ActivePage().find("label[name='Cd_DoVettore_1_Descrizione']").text(fU.ToString(oPrg.drRL.Ds_DoVettore_1));
    ActivePage().find("input[name='Vettore1DataOra']").val(fU.DateJsonToStandard(oPrg.drRL.Vettore1DataOra, true));
    ActivePage().find("input[name='Cd_DoVettore_2']").val(fU.ToString(oPrg.drRL.Cd_DoVettore_2));
    ActivePage().find("label[name='Cd_DoVettore_2_Descrizione']").text(fU.ToString(oPrg.drRL.Ds_DoVettore_2));
    ActivePage().find("input[name='Vettore2DataOra']").val(fU.DateJsonToStandard(oPrg.drRL.Vettore2DataOra, true));
    ActivePage().find("input[name='Cd_DoSped']").val(oPrg.drRL.Cd_DoSped);
    ActivePage().find("input[name='Cd_DoPorto']").val(oPrg.drRL.Cd_DoPorto);
    ActivePage().find("input[name='Cd_DoAspBene']").val(oPrg.drRL.Cd_DoAspBene);
    DivToggle_Execute(div, UserParam.getLocal(oPrg.Cd_DO + $(div).attr("id"), false, Boolean));

    //Scheda di trasporto
    div = ActivePage().find("#divDatiSpedizioneExt");
    ActivePage().find("input[name='Cd_DOCaricatore']").val(oPrg.drRL.Cd_DOCaricatore);
    ActivePage().find("input[name='Cd_DoCommittente']").val(oPrg.drRL.Cd_DoCommittente);
    ActivePage().find("input[name='Cd_DoProprietarioMerce']").val(oPrg.drRL.Cd_DoProprietarioMerce);
    ActivePage().find("input[name='Cd_DoLuogoCarico']").val(oPrg.drRL.Cd_DoLuogoCarico);
    ActivePage().find("input[name='Cd_DoLuogoScarico']").val(oPrg.drRL.Cd_DoLuogoScarico);
    DivToggle_Execute(div, UserParam.getLocal(oPrg.Cd_DO + $(div).attr("id"), false, Boolean));
    fU.ShowIf(div, oPrg.drRL.SchedaTrasporto);

    //Mostra/Nasconde i campi di inserimento pesi/volumi/colli se non presente la PK
    div = ActivePage().find(".div-cpvstd");
    DivToggle_Execute(div, UserParam.getLocal(oPrg.Cd_DO + $(div).attr("id"), false, Boolean));
    fU.ShowIf(div, !oPrg.drDO.PkLstEnabled);

    // Mostra i campi per peso e volume di UL aggiuntivi se gestita la PK nel documento
    fU.ShowIf(ActivePage().find(".div-pkpv"), oPrg.drDO.PkLstEnabled);
    ActivePage().find("input[name='PesoExtraMks']").val(oPrg.drRL.PesoExtraMks);
    ActivePage().find("input[name='VolumeExtraMks']").val(oPrg.drRL.VolumeExtraMks);

    // Mostra il bottone per Avvio Consumo se gestite le linee nel documento
    fU.ShowIf(ActivePage().find(".div-avvioconsumo"), oPrg.drDO.xMOLinea);

    // Se la linea è gestita ed è stata selezionata sulla testa mostro il check selezionato 
    if (oPrg.drDO.xMOLinea && !fU.IsEmpty($("#pgRL select[name='Cd_xMOLinea'] option:selected").val())) {
        ActivePage().find(".ck-avvioconsumo").prop("checked", true).attr("disabled", false);
        ActivePage().find(".lg-lblavvioconsumo").removeClass("w3-text-gray")
    }
    else {
        ActivePage().find(".ck-avvioconsumo").prop("checked", false).attr("disabled", true);
        ActivePage().find(".lg-lblavvioconsumo").addClass("w3-text-gray");
    }

    // Carica tutti i listener (anche senza devices config.) e seleziona quello corrente 
    Listener_Load(false);

    // Controlla se ci sono devices configurati per il listener selezionato senno nascondo il btn di stampa
    ActivePage().find("select[name='Listener']").on("change", function () {
        fU.ShowIf(ActivePage().find(".btn-stampa"), $(this).find("option:selected").attr("devices") > 0 ? true : false);
        ActivePage().find(".ck-print").prop("checked", $(this).attr("devices") > 0 ? true : false);
    });

    //Note
    ActivePage().find("textarea[name='NotePiede']").val(fU.ToString(oPrg.drRL.NotePiede));

    //Note con conferma
    if (oPrg.drDO.xMONoteUICheck)
        Ajax_xmofn_DoTes_Note(oPrg.Id_xMORL_Edit, 0);

}

function TrasportoDataora_Now() {
    ActivePage().find("input[name = 'TrasportoDataora']").val(new Date().toISOString().substring(0, 16));
}
function pgStampaDocumento_UI() {
    // Carica i Listener (con devices configurati) nel select e seleziona il primo option
    Listener_Load(true);
    // Carica i devices e i moduli del listener selezionato
    Ajax_xmofn_xMOListenerDevice();
}

function pgPrelievi_UI_Edit() {

    var InEdit = (fU.ToInt32(oPrg.Id_xMORL_Edit) > 0 ? true : false);

    //Visualizza la descrizione del DO che sto creando 
    if (InEdit) {
        $("#pgPrelievi select[name='Cd_DO']").prop("disabled", "disabled").append($('<option>', {
            value: oPrg.drDO.Cd_DO,
            text: oPrg.drDO.Cd_DO,
            class: "op-cddo"
        }));
    }
}

function pgTR_UBPA_UI() {
    // Carico la descrizione di default impostata in arca
    ActivePage().find("input[name='Descrizione']").val(oApp.xMOImpostazioni.MovTraDescrizione);

    // Mostro la data odierna nel campo 
    ActivePage().find("input[name='DataMov']").val(fU.DateFormatToBrowserLang(fU.ToDate($.now())));

    // Gestione dei magazzini dei trasferimenti
    ActivePage().find("input[name='Cd_MG_P']").val(oApp.xMOImpostazioni.MovTraCd_MG_P);
    ActivePage().find("input[name='Cd_MGUbicazione_P']").val("");
    ActivePage().find("input[name='Cd_MG_A']").val(oApp.xMOImpostazioni.MovTraCd_MG_A);
    ActivePage().find("input[name='Cd_MGUbicazione_A']").val("");

    // Carica tutti i listener (anche senza devices config.) e seleziona quello corrente 
    Listener_Load(false);

    // Imposta il focus
    pgTR_UBPA_Focus();

    return true;
}

function pgTR_UBPA_Focus() {
    var inputs = ["Cd_MG_P", "Cd_MGUbicazione_P", "Cd_MG_A", "Cd_MGUbicazione_A", "NotePiede"]
    var f;
    for (const e of inputs) { // You can use `let` instead of `const` if you like
        if (ActivePage().find("[name='" + e + "']").val() == "") {
            f = ActivePage().find("[name='" + e + "']");
            setTimeout(function () { ActivePage().find("[name='" + e + "']").focus().select(); }, 200);
            break;
        }
    }
    return f;
}

function pgTR_UI() {

    // Imposto i check delle impostazioni generali dei movimenti interni
    ActivePage().find(".ck-lotto").prop("checked", oApp.xMOImpostazioni.MovTraLotto);
    ActivePage().find(".ck-ubicazione").prop("checked", oApp.xMOImpostazioni.MovTraUbicazione);
    ActivePage().find(".ck-sottocommessa").prop("checked", oApp.xMOImpostazioni.MovTraCommessa);

    // Carico la descrizione di default impostata in arca
    ActivePage().find("input[name='Descrizione']").val(oApp.xMOImpostazioni.MovTraDescrizione);

    // Mostro la data odierna nel campo 
    ActivePage().find("input[name='DataMov']").val(fU.DateFormatToBrowserLang(fU.ToDate($.now())));

    // Gestione dei magazzini dei trasferimenti
    ActivePage().find("input[name='Cd_MG_P']").text("");
    ActivePage().find("input[name='Cd_MG_A']").text("");
    ActivePage().find("input[name='Cd_MG_P']").val(oApp.xMOImpostazioni.MovTraCd_MG_P);
    ActivePage().find("input[name='Cd_MG_A']").val(oApp.xMOImpostazioni.MovTraCd_MG_A);

    // Mostro i campi Ubicazione se gestita 
    fU.ShowIf(ActivePage().find(".div-mgubip"), oApp.xMOImpostazioni.MovTraUbicazione);
    fU.ShowIf(ActivePage().find(".div-mgubia"), oApp.xMOImpostazioni.MovTraUbicazione);
    fU.ShowIf(ActivePage().find(".div-com"), oApp.xMOImpostazioni.MovTraCommessa);

    pgTR_Edit_UI();

}

function pgTR_Edit_UI() {

    if (fU.ToInt32(oPrg.Id_xMOTR_Edit) > 0) {
        // Visualizzo l'id in pgTR
        $("#pgTR .lb-doc-id").text(fU.ToString(oPrg.Id_xMOTR_Edit));

        $("#pgTR input[name='Descrizione']").val(oPrg.drTR.Descrizione);
        $("#pgTR input[name='DataMov']").val(fU.DateFormatToBrowserLang(fU.ToDate(oPrg.drTR.DataMov)));
        $("#pgTR input[name='Cd_DOSottoCommessa']").val(oPrg.drTR.Cd_DOSottoCommessa);

        $("#pgTR input[name='Cd_MG_P']").val(oPrg.drTR.Cd_MG_P);
        $("#pgTR input[name='Cd_MGUbicazione_P']").val(oPrg.drTR.Cd_MGUbicazione_P);
        $("#pgTR .cd_mg_p").text($("#pgTR input[name='Cd_MG_P']").val());


        $("#pgTR input[name='Cd_MG_A']").val(oPrg.drTR.Cd_MG_A);
        $("#pgTR input[name='Cd_MGUbicazione_A']").val(oPrg.drTR.Cd_MGUbicazione_A);
        $("#pgTR .cd_mg_a").text($("#pgTR input[name='Cd_MG_A']").val());

    }
}

function pgTRRig_P_UI() {

    // Mostro il campo lotto se è gestito 
    fU.ShowIf($("#pgTRRig_P .div-lotto"), oApp.xMOImpostazioni.MovTraLotto);
    // Mostro la colonna lotto della tabella se gestita 
    fU.ShowIf($("#pgTRRig_P table .Cd_ARLotto"), oApp.xMOImpostazioni.MovTraLotto);

    // Mostro l'Ubicazione se gestita
    fU.ShowIf($("#pgTRRig_P .div-mgubip"), oApp.xMOImpostazioni.MovTraUbicazione);

    // Compilo il campo mgp se riempito nella testa
    $("#pgTRRig_P input[name='Cd_MG_P']").val($("#pgTR input[name='Cd_MG_P']").val());
    // Visualizzo nella lbl il contenuto del campo magazzino
    $("#pgTRRig_P .cd_mg_p").text($("#pgTRRig_P input[name='Cd_MG_P']").val());

    // Nascondo il div del magazzino se scelto nella testa del trasferimento
    DivToggle_Execute($("#pgTRRig_P .div-mgp"), !fU.IsEmpty($("#pgTRRig_P input[name='Cd_MG_P']").val()) ? false : true)

    // Compilo il campo ubip se riempito nella testa
    $("#pgTRRig_P input[name='Cd_MGUbicazione_P']").val($("#pgTR input[name='Cd_MGUbicazione_P']").val());
}

function pgTRRig_A_UI() {

    // Mostro la colonna lotto della tabella se gestita 
    fU.ShowIf($("#pgTRRig_A table .Cd_ARLotto"), oApp.xMOImpostazioni.MovTraLotto);

    // Mostro l'Ubicazione se gestita
    fU.ShowIf($("#pgTRRig_A .div-mgubia"), oApp.xMOImpostazioni.MovTraUbicazione);

    // Compilo il campo mga se riempito nella testa
    $("#pgTRRig_A input[name='Cd_MG_A']").val($("#pgTR input[name='Cd_MG_A']").val());
    // Visualizzo nella lbl il contenuto del campo magazzino
    $("#pgTRRig_A .cd_mg_a").text($("#pgTRRig_A input[name='Cd_MG_A']").val());

    // Nascondo il div del magazzino se scelto nella testa del trasferimento
    DivToggle_Execute($("#pgTRRig_A .div-mga"), !fU.IsEmpty($("#pgTRRig_A input[name='Cd_MG_A']").val()) ? false : true)

    // Compilo il campo ubia se riempito nella testa
    $("#pgTRRig_A input[name='Cd_MGUbicazione_A']").val($("#pgTR input[name='Cd_MGUbicazione_A']").val());
}

function pgTRPiede_UI() {

    $("#pgTRPiede .trp-descdo").text($("#pgTR input[name='Descrizione']").val());
    $("#pgTRPiede .trp-iddo").text(oPrg.Id_xMOTR_Edit);
    $("#pgTRPiede .trp-datado").text($("#pgTR input[name='DataMov']").val());

    // Carica tutti i listener (anche senza devices config.) e seleziona quello corrente 
    Listener_Load(false);
}

function pgSP_UI() {

    $("#pgSP .i").hide();
    $("#pgSP .sp-no").show();
    //Pulizia dei campi della pagina corrente 
    $("#pgSP input[name='Cd_xMOCodSpe']").val("");
    $("#pgSP select option").remove();
}

// Carica la lista della messaggistica
function pgLog_UI() {
    // Elimina tutti i messaggi
    $("#pgLog li.msg").remove();

    //Mostra i messaggi
    var li = $("#pgLog li.template").clone().removeClass("template").removeAttr("style").addClass("msg");
    $.each(oApp.Messages, function (key, msg) {
        var newli = li.clone()
        $(newli).find(".datetime").html(msg.DateTime);
        $(newli).find(".title").text(msg.Title.toUpperCase() + ":");
        $(newli).find(".message").html(msg.Message);
        $("#pgLog ul").append(newli);
    });
}

function pgINPiede_UI() {
    // Verifico se ci sono righe nella lista ar 
    if (!fU.IsEmpty(oPrg.IN.dtxMOINRig)) {
        // Imposto il numero di letture eseguite
        var nEle = fU.ToInt32(oPrg.IN.dtxMOINRig.filter(function (el) {
            return el.QtaRettifica != null;
        }).length);
        $("#pgINPiede .lbl-inm-let").text(nEle);
    }
    else {
        $("#pgINPiede .lbl-inm-let").text("Nessuna");
    }
}

function pgIN_UI() {

    // Svuoto la label dell'Id_xMOIN
    $("#pgIN .lb-doc-id").text("");

    // Imposto la data 
    $("#pgIN input[name='DataOra']").val(fU.DateFormatToBrowserLang(fU.ToDate($.now())));

    // Imposto il Top delle righe a 100 (valore di default)
    $("#pgIN input[name='Top']").val(100);

    // Imposto i check dei campi gestiti per l'inventario
    fU.CheckIf($("#pgIN .ck-ubicazione"), oApp.xMOImpostazioni.MovInvUbicazione);
    fU.CheckIf($("#pgIN .ck-lotto"), oApp.xMOImpostazioni.MovInvLotto);
    fU.CheckIf($("#pgIN .ck-commessa"), oApp.xMOImpostazioni.MovInvCommessa);

    // Visualizzo il cmapo UBI se gestita
    fU.ShowIf($("#pgIN .div-mgubi"), oApp.xMOImpostazioni.MovInvUbicazione);

    // Carico la descrizione se impostata in Arca
    $("#pgIN input[name='Descrizione']").val(fU.ToString(oApp.xMOImpostazioni.MovInvDescrizione));

    // Nel caso di inventario per matricola modifico la decrizione 
    if ((oApp.dtPrograms[oPrg.Key].Key) == 'INMAT') {
        $("#pgIN input[name='Descrizione']").val(fU.ToString(oApp.xMOImpostazioni.MovInvDescrizione + " (Matricola)"));
    }

    // Visualizzo il campo per il top delle righe nel caso di IN MASSIVO
    fU.ShowIf($("#pgIN .div-rig"), oPrg.IN.Tipo == 'M' ? true : false);

    // Pulisco la variabile globale contenente le info dell'inventario attivo 
    oPrg.IN.ResetAll(true);
}

function pgINRig_UI() {

    $("#pgINRig .mo-msg").hide();
    $("#pgINRig .mo-msg-argiac").hide();

    // Svuoto la tabella contenente le giacenze dell'articolo filtrato in New ar
    $("#pgINRig .tr-rig-argiac").remove();


    // Visualizzo il mg selezionato nella testa 
    $("#pgINRig .cd_mg").text(oPrg.IN.drIN.Cd_MG);

    // Nascondo la quantita Rettificata 
    $("#pgINRig .tbl-arlist .col-qtarilevata").show();
    $("#pgINRig .tbl-arlist .col-qtarettifica").hide();


    // *** PERS || oApp.LicF_Id == 3967
    if (oApp.LicF_Id == 2318) {     // Datamate -- Prima era 3258 hardware poi hanno cambiato con la corrente
        $("#pgINRig .div-qtaum .Quantita").hide();
    }

    // Imposto nel relativo input il magazzino selezionato sulla testa
    $("#pgINRig input[name='Cd_MG']").val(fU.ToString(oPrg.IN.drIN.Cd_MG));

    var MGUBIVisible = false;

    // Controllo se UBI è gestita
    if (oApp.xMOImpostazioni.MovInvUbicazione) {

        // Show dei campi ubicazione
        $("#pgINRig .div-mgubi, #pgINRig .Cd_MGUbicazione").show();

        // Se l'UBI è stata selezionata sulla testa blocco il campo di ricerca nelle rig
        if (!fU.IsEmpty(oPrg.IN.drIN.Cd_MGUbicazione)) {
            $("#pgINRig input[name='Cd_MGUbicazione']").val(fU.ToString(oPrg.IN.drIN.Cd_MGUbicazione));
            $("#pgINRig input[name='Cd_MGUbicazione']").attr('disabled', true);
            $("#pgINRig .div-mgubi img").hide();
            $("#pgINRig .tbl-arlist .Cd_MGUbicazione").hide();
            MGUBIVisible = false;
        }
        else {
            $("#pgINRig input[name='Cd_MGUbicazione']").val("");
            $("#pgINRig input[name='Cd_MGUbicazione']").attr('disabled', false);
            $("#pgINRig .div-mgubi img").show();
            $("#pgINRig .tbl-arlist .Cd_MGUbicazione").show();
            MGUBIVisible = true;
        }
    }
    else {
        // Hide dei campi ubicazione
        $("#pgINRig .div-mgubi, #pgINRig .Cd_MGUbicazione").hide();
    }

    // Visualizza il lotto se abilitato
    fU.ShowIf($("#pgINRig .div-lotto, #pgINRig .Cd_ARLotto"), oApp.xMOImpostazioni.MovInvLotto);
    // Visualizza la commessa se abilitata
    fU.ShowIf($("#pgINRig .div-com, #pgINRig .Cd_DOSottoCommessa"), oApp.xMOImpostazioni.MovInvCommessa);

    // Se è gestita sia l'ubi che la commessa e l'ubi è visibile rendo le colonne scambiabili
    if (oApp.xMOImpostazioni.MovInvCommessa && oApp.xMOImpostazioni.MovInvUbicazione && MGUBIVisible) {
        $("#pgINRig th.Cd_DOSottoCommessa ").text("COMMESSA").on("click", function () {
            $('#pgINRig .tbl-arlist .Cd_DOSottoCommessa').hide();
            $('#pgINRig .tbl-arlist .Cd_MGUbicazione').show();
        });

        $("#pgINRig th.Cd_MGUbicazione").text("UBICAZIONE").on("click", function () {
            $('#pgINRig .tbl-arlist .Cd_MGUbicazione').hide();
            $('#pgINRig .tbl-arlist .Cd_DOSottoCommessa').show();
        });

        $("#pgINRig .tbl-arlist .Cd_DOSottoCommessa").hide();
    }
    else {
        $("#pgINRig .tbl-arlist th.Cd_DOSottoCommessa ").text("COMMESSA");
        $("#pgINRig .tbl-arlist th.Cd_MGUbicazione").text("UBICAZIONE");
    }

    // Nascondo i pulsanti 
    $("#pgINRig .btn-inp").hide();
    // Nascondo le frecce per lo slideshow
    $("#pgINRig .btn-slideshow").hide();
    // Nascondo il numero di riga (viene visualizzato solo in caso di IN massivo)
    $("#pgINRig .NRow").hide();

    switch (oPrg.IN.Tipo) {
        case 'M':
            // Se il ck sequenziale è attivo mostro le frecce
            fU.ShowIf($("#pgINRig .btn-slideshow"), fU.IsChecked($("#pgINRig .ck-sequenziale")));
            // Nascondo la section detail della pagina
            $("#pgINRig .div-detail").hide();
            // Mostro la section grid della pagina
            $("#pgINRig .div-grid").show();
            DivToggle_Execute($("#pgINRig .div-filtri"), false);
            break;
        case 'P':
            oPrg.IN.AddNew = true;
            Detail_pgINRig_Load();
            break;
    }
}

function pgRLPK_UI() {

    // Mostro il btn CHIUDI se è in modalità detail
    fU.ShowIf($("#pgRLPK .btn-pkref-save"), oPrg.PK.RLPKDetail);

    // Mostro le frecce se non sono in modalità detail 
    fU.ShowIf($("#pgRLPK .div-arrow"), !oPrg.PK.RLPKDetail);
    // Mostro la label degli elementi se non sono in modalità detail
    fU.ShowIf($("#pgRLPK .NRow"), !oPrg.PK.RLPKDetail);

    if (!fU.IsEmpty(oPrg.PK.idx)) {
        // Carica i dati dell' oggetto del dt nella pagina
        pgRLPK_Template();
    }
}

function pgAA_UI() {

    var p = $("#" + oPrg.ActivePageId);

    switch (oApp.TipoAA.toUpperCase()) {
        case "ALI":
            // Nascondo tutti i campi che hanno la classe codalt
            $(p).find(".codalt").hide();
            // Visualizzo tutti i campi che hanno la classe alias
            $(p).find(".alias").show();
            break;
        case "ALT":
            // Nascondo tutti i campi che hanno la classe alias
            $(p).find(".alias").hide();
            // Visualizzo tutti i campi che hanno la classe codalt
            $(p).find(".codalt").show();
            $(p).find("input[name='Cd_CF']").attr("disabled", false);
            break;
    }

    $(p).find("input").val("");
    $(p).find(".descrizione").text("");
    setTimeout(function () {
        $(p).find(".msg").text("");
    }, 2500);

    $(p).find(".barcode").show();
    $(p).find(".switch").show();
    $(p).find(".first-focus:visible").first().focus().select(); // Inutile? .addClass("mo-br-orange");
}

function pgSM_UI() {
    var p = $("#" + oPrg.ActivePageId);
    //Mostra il div della matricola
    $(p).find(".div-sscc").show();
    $(p).find(".div-infosscc").hide();
}

function pgRLRigID_UI() {

    // Pulisco la pagina
    pgRLRigID_Clear();

    // Svuota il link al documento di prelievo
    $("#pgRLRigID .doprel").text("").hide();

    // Svuota la label contenente il codice CF
    $("#pgRLRigID .lb-cli").text("");

    // Visualizzo la commessa se gestita 
    fU.ShowIf($("#pgRLRigID .div-com"), oPrg.drDO.xMODOSottoCommessa);

    // Mostra il campo lotto se gestito
    fU.ShowIf($("#pgRLRigID .div-lotto"), fU.ToBool(oPrg.drDO.xMOLotto));
    //Il lotto gestisce la data scadenza se può essere auto generato
    fU.ShowIf($("#pgRLRigID .lotto-scad"), fU.ToBool(oPrg.drDO.xMOLotto) && (oPrg.drDO.ARLottoAuto == 0 ? false : true));

    $("#pgRLRigID .col-qtaresidua").hide();
    $("#pgRLRigID .col-commessa").hide();

    //Carico i dati di testa della pagina
    $("#pgRLRigID .lb-doc-id").text(fU.IsEmpty(oPrg.Id_xMORL_Edit) ? "" : oPrg.Id_xMORL_Edit);
    $("#pgRLRigID .lb-doc-name").text(oPrg.drDO.Cd_DO);

    // Abilita il check di autoconferma in base a come impostato dalla configurazione in Arca
    fU.CheckIf($("#pgRLRigID .ck-autoconfirm"), oPrg.drDO.xMOAutoConfirm);

    // Crea e Visualizza i campi personalizzati configurati nel documento secondo la struttura presente nell'xml
    ExtFld_Load();

    if (oPrg.Id_xMORL_Edit > 0) {
        $("#pgRLRigID .lb-cli").text(oPrg.drRL.Cd_CF + " - " + oPrg.drRL.CF_Descrizione);
    }
}

function pgTRSSCC_UI() {

    // Imposto la pagina con i default 
    ActivePage().find("input").val("");
    ActivePage().find(".op-um").remove();
    ActivePage().find(".Cd_xMOMatricola, #pgTRSSCC .cd_mg_p").text("");

    ActivePage().find(".div-sscc").removeClass("w3-hide");
    ActivePage().find(".div-info").addClass("w3-hide");

    //Ubind degli eventi
    ActivePage().find("input[name='Cd_MGUbicazione_A']").unbind('focusout');
    //Bind eventi
    ActivePage().find("input[name='Cd_MGUbicazione_A']").on('focusout', function () {
        if ($(this).val() != "")
            if (ActivePage().find(".ck-autoconfirm").prop("checked") == true) {
                Ajax_xmosp_xMOTR_To_MGMov_Save();
            }
    });

}

function pgINSSCC_UI() {

    // Pulisco i campi
    ActivePage().find("input").val("");
    ActivePage().find(".Quantita").text("");
    ActivePage().find(".op-um").remove();

    // Se ubi è stata selezionata sulla testa la riporto sulle righe
    if (!fU.IsEmpty($("#pgIN input[name='Cd_MGUbicazione']").val()))
        ActivePage().find("input[name='Cd_MGUbicazione']").val($("#pgIN input[name='Cd_MGUbicazione']").val()).attr("disabled", true);
    else
        ActivePage().find("input[name='Cd_MGUbicazione']").attr("disabled", false);
}

function pgINTMG_AR_UI() {
    DivToggle_Execute($("#pgINTMG_AR .div-accordion"), true);
    $("#pgINTMG_AR").find(".ar-aa, .filtri").text("");
    $("#pgINTMG_AR").find("input").val("");
    $("#pgINTMG_AR .div-giac").hide();
    oPrg.saveFocus.Exe()
}

function pgINTMG_UbiMat_UI() {
    DivToggle_Execute($("#pgINTMG_UbiMat .div-accordion"), true);
    $("#pgINTMG_UbiMat").find(".ar-aa, .filtri").text("");
    $("#pgINTMG_UbiMat").find("input").val("");
    $("#pgINTMG_UbiMat .div-giac").hide();
    oPrg.saveFocus.Exe()
}

function pgTRMP_P_UI() {
    //Carico le line di produzione
    Linea_Load();
}

function pgTRMP_C_AR_UI() {

    $("#pgTRMP_C_AR .TRMP_C").show();
    $("#pgTRMP_C_AR .TRMP_AR").hide();

    $("#pgTRMP_C_AR input").val("");
    $("#pgTRMP_C_AR .lbl-esito").text("");

    $("#pgTRMP_C_AR .TRMP_AR .lg-tranextar").show();
}

function pgTRRM_UI() {

    $("#pgTRRM input").val("");
    $("#pgTRRM .Cd_xMOMatricola .Cd_AR .AR_Descrizione .Cd_ARLotto .DataScadenza .Cd_MG_A .Cd_MGUbicazione_A").text("");

    $("#pgTRRM .div-dati").attr("Id_xMOTR", "").attr("Id_xMOTRRig_P", "");
    $("#pgTRRM .mo-intestazione .Id_xMOTRRig_P").text("");

    $("#pgTRRM .div-linea").show();
    $("#pgTRRM .div-dati").hide();

    SetFocus();
}

// -------------------------------------------------
// ENDREGION Funzioni UI
// -------------------------------------------------
// -------------------------------------------------
// #1.40 REGION: FUNZIONI LOAD
// -------------------------------------------------

// Crea i campi input personalizzati in base alla struttura dell'xml presente nella configurazione del documento e li visualizza
function ExtFld_Load() {

    var p = $("#" + oPrg.ActivePageId);
    var dt = oPrg.drDO.xMOExtFld;

    // Cancello tutti i campi personalizzati già presentinella pagina
    $(p).find(".div-extfld-pers").remove();

    if (!fU.IsEmpty(oPrg.drDO.xMOExtFld)) {

        // Copio il template
        var input = $(p).find(".div-extfld").find(".template_extfld").clone().removeAttr("style").addClass("div-extfld-pers");

        // Se obj.rows.row contiene + di un oggetto è un arry allora faccio il for per generare gli input
        // altrimenti obj.rows.row è direttamente l'oggetto.
        // Per ogni row dell'xml creo un div contenente una label e un input configurandoli secondo la struttura indicata nell'xml
        for (var i = 0; i < dt.length; i++) {
            var div = $(input).clone();
            $(div).find("label").text(dt[i].descrizione);
            $(div).find("img").attr("data-idx", i);
            var inp = div.find("input");
            $(inp).attr("type", dt[i].tipo);
            $(inp).attr("name", dt[i].nome);
            $(inp).attr("descr", dt[i].descrizione);
            $(inp).attr("data-required", fU.ToBool(dt[i].richiesto));
            if (dt[i].maxlength)
                $(inp).attr("maxlength", dt[i].maxlength);
            if (dt[i].class)
                $(inp).attr("class", dt[i].class);
            if (dt[i].step)
                $(inp).attr("step", dt[i].step);
            if (dt[i].default && $(inp).val() === "") {
                $(inp).attr("data-default", dt[i].default);
                switch (dt[i].default) {
                    case 'now()':
                        $(inp).val(fU.DateToInput(new Date()));
                        break;
                    default:
                        $(inp).val(dt[i].default);
                        break;
                }
            }
            if (dt[i].source) {
                $(div).find("img").on("click", function (event) {
                    var dr = oPrg.drDO.xMOExtFld[$(this).attr("data-idx")];
                    SearcExtFld.open(dr.source, dr.nome, dr.descrizione);
                });
            }
            else
                $(div).find("img").hide();
            $(p).find(".div-extfld").append(div);
        }
    }
}

function Linea_Load() {
    ActivePage().find(".op-linea").remove();
    if (oApp.dtxMOLinea.length > 0) {
        for (var i = 0; i < oApp.dtxMOLinea.length; i++) {
            ActivePage().find("select[name='Cd_xMOLinea']").append($('<option>', {
                class: "op-linea",
                key: i,
                value: oApp.dtxMOLinea[i].Cd_xMOLinea,
                text: oApp.dtxMOLinea[i].Cd_xMOLinea + " - " + oApp.dtxMOLinea[i].Descrizione,
                LineaMG: oApp.dtxMOLinea[i].Cd_MG
            }));
        }
    }
}

function Search_Articolo_Load(dt) {

    if (dt.length > 0) {
        //Nascono il messaggio 'articoli non trovati'
        $("#" + oPrg.ActiveSearchId + " .mo-msg").hide();

        var li = $("#" + oPrg.ActiveSearchId + " .template").clone().addClass("li-search").removeAttr("style");
        for (var i = 0; i < dt.length; i++) {
            $("#" + oPrg.ActiveSearchId + " ul").append(Search_Articolo_Template(li.clone(), dt[i], i));
        }
    }
    else {
        //Messaggio nel caso non è stato trovato nessun articolo
        $("#" + oPrg.ActiveSearchId + " .mo-msg").text("Nessun record.").show();
    }
}

function Search_ARLotto_Load(dt) {

    if (dt.length > 0) {
        //Nascono il messaggio 'lotti non trovati'
        $("#" + oPrg.ActiveSearchId + " .mo-msg").hide();

        var li = $("#" + oPrg.ActiveSearchId + " .template").clone().addClass("li-search").removeAttr("style");
        for (var i = 0; i < dt.length; i++) {
            $("#" + oPrg.ActiveSearchId + " ul").append(Search_ARLotto_Template(li.clone(), dt[i], i));
        }
    }
    else {
        //Messaggio nel caso non è stato trovato nessun lotto
        $("#" + oPrg.ActiveSearchId + " .mo-msg").text("Nessun lotto.").show();
    }
}

function Search_Spedizione_Load(dt) {
    if (dt.length > 0) {
        //Nascono il messaggio nessun record
        $("#" + oPrg.ActiveSearchId + " .mo-msg").hide();
        var li = $("#" + oPrg.ActiveSearchId + " .template").clone().removeClass("template").addClass("li-search").removeAttr("style");
        for (var i = 0; i < dt.length; i++) {
            $("#" + oPrg.ActiveSearchId + " ul").append(Search_Spedizione_Template(li.clone(), dt[i], i));
        }
    }
    else {
        //Messaggio nel caso non è stato trovata nessuna spedizione
        $("#" + oPrg.ActiveSearchId + " .mo-msg").text("Nessuna spedizione trovata.").show();
    }
}

function Search_CF_Load(dt, TipoPrelievo) {

    if (dt.length > 0) {
        //Nascono il messaggio 'clienti/fornitori non trovati'
        $("#" + oPrg.ActiveSearchId + " .mo-msg").hide();

        var li = $("#" + oPrg.ActiveSearchId + " .template").clone().addClass("li-search").removeAttr("style");
        for (var i = 0; i < dt.length; i++) {
            $("#" + oPrg.ActiveSearchId + " ul").append(Search_CF_Template(li.clone(), dt[i], i, TipoPrelievo));
        }

        if (TipoPrelievo == 0) {
            $("#" + oPrg.ActiveSearchId).find("#info-prelievo").hide();
        }

    }
    else {
        //Messaggio nel caso non è stato trovato nessun cliente/fornitore
        $("#" + oPrg.ActiveSearchId + " .mo-msg").text("Nessun record!").show();
    }
}

function Search_CFDest_Load(dt) {

    if (dt.length > 0) {
        //Nascono il messaggio 'nessuna destinazione trovata'
        $("#" + oPrg.ActiveSearchId + " .mo-msg").hide();

        var li = $("#" + oPrg.ActiveSearchId + " .template").clone().addClass("li-search").removeAttr("style");
        for (var i = 0; i < dt.length; i++) {
            $("#" + oPrg.ActiveSearchId + " ul").append(Search_CFDest_Template(li.clone(), dt[i], i));
        }
    }
    else {
        //Messaggio nel caso non è stata trovata nessuna destinazione
        $("#" + oPrg.ActiveSearchId + " .mo-msg").text("Nessuna destinazione!").show();
    }
}

function Search_MG_Load(dt) {

    if (dt.length > 0) {
        //Nascono il messaggio 'clienti/fornitori non trovati'
        $("#" + oPrg.ActiveSearchId + " .mo-msg").hide();

        var li = $("#" + oPrg.ActiveSearchId + " .template").clone().addClass("li-search").removeAttr("style");
        for (var i = 0; i < dt.length; i++) {
            $("#" + oPrg.ActiveSearchId + " ul").append(Search_MG_Template(li.clone(), dt[i], i));
        }
    }
    else {
        //Messaggio nel caso non è stato trovato nessun magazzino
        $("#" + oPrg.ActiveSearchId + " .mo-msg").text("Nessun magazzino.").show();
    }
}

function Search_MGUbicazione_Load(dt) {
    if (dt.length > 0) {
        //Nascono il messaggio 'Ubicazioni non trovate'
        $("#" + oPrg.ActiveSearchId + " .mo-msg").hide();

        var li = $("#" + oPrg.ActiveSearchId + " .template").clone().addClass("li-search").removeAttr("style");
        for (var i = 0; i < dt.length; i++) {
            $("#" + oPrg.ActiveSearchId + " ul").append(Search_MGUbicazione_Template(li.clone(), dt[i], i));
        }
    }
    else {
        //Messaggio nel caso non è stato trovato nessuna ubicazione
        $("#" + oPrg.ActiveSearchId + " .mo-msg").text("Nessuna ubicazione.").show();
    }
}

function Search_DOSottoCommessa_Load(dt) {
    if (dt.length > 0) {
        //Nascono il messaggio
        $("#" + oPrg.ActiveSearchId + " .mo-msg").hide();

        var li = $("#" + oPrg.ActiveSearchId + " .template").clone().addClass("li-search").removeAttr("style");
        for (var i = 0; i < dt.length; i++) {
            $("#" + oPrg.ActiveSearchId + " ul").append(Search_DOSottoCommessa_Template(li.clone(), dt[i], i));
        }
    }
    else {
        //Messaggio nel caso non è stato trovato nessuna ubicazione
        $("#" + oPrg.ActiveSearchId + " .mo-msg").text("Nessuna sottocommessa.").show();
    }
}

function Search_CdDes_Load(dt) {
    if (dt.length > 0) {
        //Nascono il messaggio
        $("#" + oPrg.ActiveSearchId + " .mo-msg").hide();
        var li = $("#" + oPrg.ActiveSearchId + " .template").clone().addClass("li-search").removeAttr("style");
        for (var i = 0; i < dt.length; i++)
            $("#" + oPrg.ActiveSearchId + " ul").append(Search_CdDes_Template(li.clone(), dt[i], i));
    }
    else
        $("#" + oPrg.ActiveSearchId + " .mo-msg").text("Nessun elemento trovato...").show();
}

function Search_DOSdTAnag_Load(dt) {
    if (dt.length > 0) {
        //Nascono il messaggio
        $("#" + oPrg.ActiveSearchId + " .mo-msg").hide();
        var li = $("#" + oPrg.ActiveSearchId + " .template").clone().addClass("li-search").removeAttr("style");
        // Stesso Cd e Descrizione di CdDes
        for (var i = 0; i < dt.length; i++)
            $("#" + oPrg.ActiveSearchId + " ul").append(Search_CdDes_Template(li.clone(), dt[i], i));
    }
    else
        $("#" + oPrg.ActiveSearchId + " .mo-msg").text("Nessun elemento trovato...").show();
}

function Search_ARARMisura_Load(dt) {
    if (dt.length > 0) {
        //Nascono il messaggio
        $("#" + oPrg.ActiveSearchId + " .mo-msg").hide();

        var li = $("#" + oPrg.ActiveSearchId + " .template").clone().addClass("li-search").removeAttr("style");
        for (var i = 0; i < dt.length; i++) {
            $("#" + oPrg.ActiveSearchId + " ul").append(Search_ARARMisura_Template(li.clone(), dt[i], i));
        }
    }
    else {
        //Messaggio nel caso non è stato trovato nessuna UM
        $("#" + oPrg.ActiveSearchId + " .mo-msg").text("Nessun UM. Selezionare un articolo").show();
    }
}

function DOAperti_Load(dt) {
    $("#pgDocAperti .msg").text("");
    //Verifico che il dt abbia delle righe
    if (dt.length > 0) {
        var li = $("#pgDocAperti .template").clone().removeAttr("style").addClass("li-doc");
        for (var i = 0; i < dt.length; i++) {
            $("#pgDocAperti ul").append(DOAperti_Template(li.clone(), dt[i], i));
        }
    } else {
        $("#pgDocAperti .msg").text("Nessun documento aperto.");
    }
}

function DORistampa_Load(dt) {
    //Verifico che il dt abbia delle righe
    if (dt.length > 0) {
        var li = $("#pgDocRistampa .template").clone().removeAttr("style").addClass("li-doc");
        for (var i = 0; i < dt.length; i++) {
            $("#pgDocRistampa ul").append(DORistampa_Template(li.clone(), dt[i], i));
        }
    }
    else { $("#pgDocRistampa .msg").text('Nessun Documento trovato!'); }
}

function DOPrel_Load(dt) {
    var count = 0;
    if (dt.length > 0) {
        var tr = $("#pgDOPrelievi .template").clone().removeAttr("style").addClass("tr-prel");
        for (var i = 0; i < dt.length; i++) {
            $("#pgDOPrelievi table").append(DOPrel_Template(tr.clone(), dt[i], i));
        }

        $("pgDOPrelievi tr-prel").each(function () {
            if (!$(this).hasClass("non-prelevabile"))
                count += 1;
        });
    }
    if (count > 0) {
        $("#pgDOPrelievi .toggle-disabled").show();
        //Nascondo le righe non prelevabili
        $("#pgDOPrelievi table .non-prelevabile").hide();
    }
    else {
        $("#pgDOPrelievi .toggle-disabled").hide();
        //Nascondo le righe non prelevabili
        $("#pgDOPrelievi table .non-prelevabile").show();
    }
}

function DOPrel_All_Load(dt) {
    if (dt.length > 0) {
        $("#pgPrelievi .msg").text("");
        var li = $("#pgPrelievi .template").clone().removeAttr("style").addClass("li-prel");
        for (var i = 0; i < dt.length; i++) {
            $("#pgPrelievi ul").append(DOPrel_All_Template(li.clone(), dt[i], i));
        }

        // Controlla se tra i documenti caricati ce ne sono alcuni già selezionati
        $("#pgPrelievi .li-prel input[type='checkbox']").each(function () {
            var idx = oPrg.RL.dtDOSelPR.indexOf($(this).attr("Id_DOTes"));
            if (idx != -1) {
                fU.CheckIf($(this), true);
            }
        });

        // Se è stato applicato un filtro e il dt.length è 1 seleziono automaticamente l'elemento
        if (dt.length == 1) $("#pgPrelievi .li-prel input[type='checkbox']").click().change();
    }
    else
        $("#pgPrelievi .msg").text("Nessun documento prelevabile!");
}

function Spedizione_Load() {
    // Pulisco il DOM
    Spedizione_Unload();

    // Filtro il l'array con il codice della spedizione
    var xCd_xMOCodSpe = ActivePage().find('input[name="Cd_xMOCodSpe"]').val();
    var dt = oPrg.SP.dt.filter(function (item) {
        return xCd_xMOCodSpe != '' ? item.xCd_xMOCodSpe == xCd_xMOCodSpe : true;
    });

    if (dt.length > 0) {
        // Gruppi di spedizione
        var gruppi = dt.map(function (item) {
            return {
                xCd_xMOCodSpe: item.xCd_xMOCodSpe,
                Descrizione: item.Descrizione,
                DataSpedizione: item.DataSpedizione
            }
        }).filter(function (item, index, self) {
            var elem = self.find(function (gruppo) {
                return gruppo.xCd_xMOCodSpe == item.xCd_xMOCodSpe
            });
            return self.indexOf(elem) === index;
        });

        // Per ogni gruppo di spedizione
        // Aggiungo il tag del gruppo
        // Filtro le spedizioni relative al gruppo
        // Creo la card e la aggiungo al DOM
        if (dt.length > 0) {
            var div = ActivePage().find('div.spedizioni');
            var template = ActivePage().find('div.spedizioni .template').clone().removeAttr("style").addClass("card-sp");
            gruppi.forEach(function (gruppo) {
                div.append($("<h5>", { "data-key": "Cd_xMOCodSpe" }).text(gruppo.xCd_xMOCodSpe));
                if (gruppo.DataSpedizione)
                    div.append($("<label>", { "data-key": "DataSpedizione" }).text(fU.DateJsonToDate(gruppo.DataSpedizione)));
                div.append($("<label>", { "data-key": "Descrizione" }).text(gruppo.Descrizione));

                dt.filter(function (item) {
                    return item.xCd_xMOCodSpe == gruppo.xCd_xMOCodSpe;
                }).forEach(function (item, index, self) {
                    var elem = Spedizione_Template(template.clone(), item);
                    if (index == self.length - 1) elem.css("margin-bottom", "10px");
                    div.append(elem);
                })
            });
        }
    } else {
        if (xCd_xMOCodSpe != '')
            PopupMsg_Show("SP", 1, "Spedizione " + xCd_xMOCodSpe + " non presente nella lista!");
    }
}

// Template della Spedizione
function Spedizione_Template(template, item) {
    var dataDoc = new Date(fU.DateJsonToStandard(item.DataDoc));

    template.attr("Id_DOTes", item.Id_DOTes);
    template.attr("Cd_xMOCodSpe", item.Cd_xMOCodSpe);

    template.find('[data-key="xMOSpePresa"]').text((item.xMOSpePresa ? item.xMOSpePresa : "")); //.concat(!fU.IsEmpty(item.DataConsegna) ? " consegna " + fU.DateJsonToDate(item.DataConsegna) : ""));
    template.find('[data-key="CF_Descrizione"]').text(item.CF_Descrizione);
    template.find('[data-key="Doc"]').text(item.Testo.trim());
    template.find('[data-key="Doc"]').click(function () {
        Detail_Ajax_xmovs_DOTes(item.Id_DOTes);
        $("#DetailDO").show();
    });
    template.find(".ck-sp").attr("Id_DOTes", item.Id_DOTes);
    template.find(".ck-sp").attr("Cd_xMOCodSpe", item.xCd_xMOCodSpe);
    template.find(".ck-sp").attr("Cd_DOs", item.Cd_DOs);
    template.find(".ck-sp").prop('checked', item.Selezionato);
    template.find(".ck-sp").click(function () {
        Spedizione_Check_SP(item.Id_DOTes);
    });

    // DMS
    if (item.DMS)
        template.find('[data-key="DMS"]').on("click", function () {
            Popup_DMS_Load('xMOCodSpe', item.xCd_xMOCodSpe, '', false);
        });
    else
        template.find('[data-key="DMS"]').css('visibility', 'hidden');

    // NOTE
    if (item.Note)
        template.find('[data-key="Note"]').on("click", function () {
            Ajax_xmofn_DoTes_Note(0, item.Id_DOTes);
        });
    else
        template.find('[data-key="Note"]').css('visibility', 'hidden');

    //Gestione errori prelevabilità
    //1) La riga è prelevata da altri doc
    //2) La riga non ha documenti definiti in arca per il prelievo
    var err_msg = "";
    if (!fU.IsEmpty(item.PrelevatoDa)) err_msg += "Documento prelevato da:<br />" + item.PrelevatoDa + "<br />";
    if (fU.IsEmpty(item.Cd_DOs)) err_msg += "Documento non correttamente configurato con i documenti di prelievo di Arca!<br />";

    if (!fU.IsEmpty(err_msg))
        template.find('[data-key="error"]').on("click", function () {
            PopupMsg_Show("info", 1, err_msg);
        });

    fU.ShowIf(template.find('[data-key="error"]'), !fU.IsEmpty(err_msg));
    fU.ShowIf(template.find('[data-key="check"]'), fU.IsEmpty(err_msg));

    return template;
}

function Spedizione_Unload() {
    ActivePage().find(".card-sp").remove();
    ActivePage().find('h5[data-key="Cd_xMOCodSpe"]').remove();
    ActivePage().find('label[data-key="DataSpedizione"]').remove();
    ActivePage().find('label[data-key="Descrizione"]').remove();
}

function pgRLRig_AR_Load(dt) {
    //Verifico che il dt abbia delle righe
    if (dt.length > 0) {
        var tr1 = ActivePage().find(".template").clone().removeAttr("style").addClass("tr-rigprel");
        var tr2 = ActivePage().find(".template_ARDesc").clone().removeAttr("style").addClass("tr-rigprel tr-ardesc");
        for (var i = 0; i < dt.length; i++) {
            if (dt[i].Ultima == 1) {
                // Inserisco i dati dell'utlima lettura effettuata nella label lastread
                ActivePage().find(".lastread").html(dt[i].Descrizione + ":&nbsp;" + dt[i].Quantita + " " + dt[i].Cd_ARMisura);
            }
            ActivePage().find("table").append(pgRLRig_AR_Template(tr1.clone(), dt[i], i));
            ActivePage().find("table").append(ARDesc_Template(tr2.clone(), dt[i].Cd_AR, dt[i].Descrizione));
        }

    }
}

function pgTRRig_P_AR_Load(dt) {
    //Verifico che il dt abbia delle righe
    if (dt.length > 0) {
        var tr = $("#pgTRRig_P .template").clone().removeAttr("style").addClass("tr-rigp").removeClass("template");
        for (var i = 0; i < dt.length; i++) {
            $("#pgTRRig_P table").append(pgTRRig_P_AR_Template(tr.clone(), dt[i], i));
        }
    }
}

function pgTRRig_A_AR_Load(dt) {
    //Verifico che il dt abbia delle righe
    if (dt.length > 0) {
        var tr = $("#pgTRRig_A .template").clone().removeAttr("style").addClass("tr-riga").removeClass("template");
        for (var i = 0; i < dt.length; i++) {
            $("#pgTRRig_A table").append(pgTRRig_A_AR_Template(tr.clone(), dt[i], i));
        }
    }
}

function ARARMisura_Load(dt) {
    // Recupero il select
    var select = $(ActivePage()).find("select[name='Cd_ARMisura']");
    //Verifico che il dt abbia delle righe
    if (dt.length > 0) {
        for (var i = 0; i < dt.length; i++) {
            $(select).append($('<option>', {
                class: "op-um",
                Cd_AR: dt[i].Cd_AR,
                Cd_ARMisura: dt[i].Cd_ARMisura.toUpperCase(),
                UMFatt: dt[i].UMFatt,
                value: dt[i].Cd_ARMisura.toUpperCase(),
                text: dt[i].Cd_ARMisura.toUpperCase()
            }));
        }
        // Al cambio di valore
        $(select).change(function () {
            // Recupero il fattore di conversione
            var UMFatt = $(this).find('option:checked').attr('UMFatt');
            // Recupero il campo nascosto più vicino
            var input = $(select).siblings('input[type="hidden"][data-bind="FattoreToUM1"]');
            // Se l'ho trovato
            if ($(input).length > 0)
                input.val(UMFatt);
        });

        // Assegno il primo valore così da scatenare l'evento
        $(select).val(dt[0].Cd_ARMisura).change();
    }
}

function ARARMisura_Popup_Load(dt, idpopup) {
    var p = "#" + idpopup;
    //Verifico che il dt abbia delle righe
    if (dt.length > 0) {
        for (var i = 0; i < dt.length; i++) {
            $(p).find("select[name='Cd_ARMisura']").append($('<option>', {
                class: "op-um",
                Cd_AR: dt[i].Cd_AR,
                Cd_ARMisura: dt[i].Cd_ARMisura.toUpperCase(),
                UMFatt: dt[i].UMFatt,
                value: dt[i].Cd_ARMisura.toUpperCase(),
                text: dt[i].Cd_ARMisura.toUpperCase()
            }));
        }
    }
}

function Detail_GiacenzaUbicazione_Load() {
    //Memorizzo il datatable
    var dt = oPrg.DetailGiacenzaUbicazione.dt;

    var table = $("#DetailGiacenzaUbicazione table");
    var tr = null;

    //Verifico che il dt abbia delle righe
    if (dt.length > 0) {
        tr = $("#DetailGiacenzaUbicazione .template.tr-link").clone().removeAttr("style").addClass("tr-giac");

        //Aggiungo l'elemento alla tabella
        for (var i = 0; i < dt.length; i++)
            $(table).append(Detail_GiacenzaUbicazione_Template(tr.clone(), dt[i]));
    }

    //Imposto l'header
    var th = document.querySelector("#DetailGiacenzaUbicazione table thead tr th");
    th.innerText = oPrg.DetailGiacenzaUbicazione.Cd_MG + " > " + oPrg.DetailGiacenzaUbicazione.Cd_MGUbicazione;

    //Imposto il rolling sulla table
    rolling.tableSet($("#DetailGiacenzaUbicazione table"));

    //Filtra l'elenco
    Detail_GiacenzaUbicazione_Filter();

    //Mostro il detail
    $("#DetailGiacenzaUbicazione").show();
}

function Detail_GiacenzaUbicazione_Filter() {
    var page = $("#DetailGiacenzaUbicazione");
    if (fU.IsChecked(page.find(".ck-qtapos")))
        page.find("tr.qta-assente").hide();
    else
        page.find("tr.qta-assente").show();
}



function Detail_Giacenza_Load() {
    //Memorizzo il datatable
    var dt = oPrg.DetailGiacenza.dt;

    var table = $("#DetailGiacenza table");
    var tr = null;

    //Verifico che il dt abbia delle righe
    if (dt.length > 0) {
        tr = $("#DetailGiacenza .template.tr-link").clone().removeAttr("style").addClass("tr-giac");

        //Aggiungo l'elemento alla tabella
        for (var i = 0; i < dt.length; i++)
            $(table).append(Detail_Giacenza_Template(tr.clone(), dt[i], i));
    }

    Detail_Giacenza_Totali()

    //Imposto l'header
    var totQuantita = oPrg.DetailGiacenza.dt.map(function (item) { return item.Quantita }).reduce(function (tot, num) { return tot + num; });
    var th = document.querySelector("#DetailGiacenza table thead tr th");
    th.innerText = oPrg.DetailGiacenza.Cd_AR + " - " + dt[0].AR_Descrizione + " | Qta. tot: " + totQuantita + " " + dt[0].Cd_ARMisura;

    //Imposto il rolling sulla table
    rolling.tableSet($("#DetailGiacenza table"));

    //Imposto i filtri sulle qta
    if (oApp_GetLocalProperty("DetailGiacenza", "Quantita"))
        $('#DetailGiacenza table thead .Quantita .ck-pkpesi').prop('checked', true).change();

    if (oApp_GetLocalProperty("DetailGiacenza", "QuantitaDisp"))
        $('#DetailGiacenza table thead .QuantitaDisp .ck-pkpesi').prop('checked', true).change();

    if (oApp_GetLocalProperty("DetailGiacenza", "QuantitaDImm"))
        $('#DetailGiacenza table thead .QuantitaDImm .ck-pkpesi').prop('checked', true).change();

    //Mostro il detail
    $("#DetailGiacenza").show();
}

function Detail_GiacenzaUbicazione_Row_Click(item, _pa) {
    var focusTo;
    var input;
    switch (oPrg.Key) {
        case "TI":
            switch (oPrg.ActivePageId) {
                case "pgTRRig_P":
                    input = ActivePage().find("input[name='Cd_AR']")
                    if (input.is(':visible')) input.val(item.Cd_AR);
                    input = ActivePage().find("input[name='Cd_ARLotto']");
                    if (input.is(':visible')) input.val(item.Cd_ARLotto);
                    focusTo = ActivePage().find("input[name='Quantita']");
                    break;
                case "pgTRRig_A":
                    // Nessuna azione
                    break;
            }
            break;
        default:
            input = ActivePage().find("input[name='Cd_AR']")
            if (input.is(':visible')) input.val(item.Cd_AR);
            input = ActivePage().find("input[name='Cd_MG" + _pa + "']")
            if (input.is(':visible')) input.val(item.Cd_MG);
            input = ActivePage().find("input[name='Cd_MGUbicazione" + _pa + "']");
            if (input.is(':visible')) input.val(item.Cd_MGUbicazione);
            input = ActivePage().find("input[name='Cd_ARLotto']");
            if (input.is(':visible')) input.val(item.Cd_ARLotto);
            input = ActivePage().find("input[name='DataOra']");
            if (input.is(':visible')) input.val(item.DataScadenza);
            focusTo = ActivePage().find("input[name='Quantita']");
            break;
    }

    //Chiudo il modal
    HideAndFocus('DetailGiacenzaUbicazione', focusTo);
}

function Detail_Giacenza_Row_Click(Cd_ARLotto, Cd_MG, Cd_MGUbicazione, DataScadenza, Cd_AR) {
    //F -> Arrivo (MagAFlag -> true) altrimenti Partenza
    //C -> Partenza (MagPFlag -> true) altrimenti Arrivo

    var input = null;

    switch (oPrg.Key) {
        case "PR":
        case "DO":
        case "GP":
        case "PI":
        case "SP":
        case "SPA":

            //Selettore input Quantita
            oPrg.RL.dtRLRig_AR.forEach(function (item) {
                if (item['Cd_AR'].trim() == Cd_AR.trim()) {
                    input = ActivePage().find("input[name='Quantita']");
                    input.val(item['QtaResidua']);
                    item['QtaEvadibile']
                }
            });

            //Selettore input Partenza/Arrivo in base al ciclo documentale
            var pa = oPrg.drDO.CliFor == "F"
                ? oPrg.drDO.MagAFlag ? "A" : "P"
                : oPrg.drDO.MagPFlag ? "P" : "A";

            //Magazzino solo se non fisso
            if ((pa == "A" && !oPrg.drDO.UIMagAFix) || (pa == "P" && !oPrg.drDO.UIMagPFix)) {
                input = ActivePage().find("input[name='Cd_MG_" + pa + "']");
                input.val(Cd_MG);
            }

            //Ubicazione solo se visibile
            if (oPrg.drDO.xMOUbicazione) {
                input = ActivePage().find("input[name='Cd_MGUbicazione_" + pa + "']");
                input.val(Cd_MGUbicazione);
                // Mostra il div dei magazzini p o a
                ActivePage().find("div.div-mg" + pa.toLowerCase() + " div.content").show();
            }

            //Lotto e data solo se visibile
            if (oPrg.drDO.xMOLotto) {
                input = ActivePage().find("input[name='Cd_ARLotto']");
                input.val(Cd_ARLotto);

                input = ActivePage().find("input[name='DataScadenza']");
                input.val(DataScadenza);
            }

            break;
        case "PRTR":
            ActivePage().find("label[data-bind='Cd_MG_P']").text(Cd_MG);
            ActivePage().find("label[data-bind='Cd_MGUbicazione_P']").text(Cd_MGUbicazione);
            break;
        case "TI":
            input = ActivePage().find("input[name='Cd_MG_P']");
            input.val(Cd_MG);
            //Ubicazione solo se visibile
            if (oApp.xMOImpostazioni.MovTraUbicazione) {
                input = ActivePage().find("input[name='Cd_MGUbicazione_P']");
                input.val(Cd_MGUbicazione);
            }

            //Lotto e data solo se visibile
            if (oApp.xMOImpostazioni.MovTraLotto) {
                input = ActivePage().find("input[name='Cd_ARLotto']");
                input.val(Cd_ARLotto);

                input = ActivePage().find("input[name='DataOra']");
                input.val(DataScadenza);
            }

            break;
        case "TIMAT":
            input = ActivePage().find("input[name='Cd_MG_A']");
            input.val(Cd_MG);
            //Ubicazione solo se visibile
            if (oApp.xMOImpostazioni.MovTraUbicazione) {
                input = ActivePage().find("input[name='Cd_MGUbicazione_A']");
                input.val(Cd_MGUbicazione);
            }

            //Lotto e data solo se visibile
            if (oApp.xMOImpostazioni.MovTraLotto) {
                input = ActivePage().find("input[name='Cd_ARLotto']");
                input.val(Cd_ARLotto);

                input = ActivePage().find("input[name='DataOra']");
                input.val(DataScadenza);
            }

            break;
        case "TRMP":
            if (oPrg.ActivePageId == "pgTRMP_C_AR") {
                ActivePage().find("label.Cd_ARLotto").text(Cd_ARLotto);
                ActivePage().find("label.Cd_MGUbicazione_P").text(Cd_MGUbicazione);
            }
            break;
        default:

            //Selettore input Quantita
            oPrg.RL.dtRLRig_AR.forEach(function (item) {
                input = ActivePage().find("input[name='Quantita']");
                input.val(item['QtaResidua']);
                item['QtaEvadibile']
            });

            //Magazzino
            input = ActivePage().find("input[name='Cd_MG']");
            input.val(Cd_MG);

            //Ubicazione (solo se visibile)
            input = ActivePage().find("input[name='Cd_MGUbicazione']");

            if (input[0].parentElement.style.display != "none")
                input.val(Cd_MGUbicazione);

            //Lotto e data solo se visibile
            input = ActivePage().find("input[name='Cd_ARLotto']");

            if (input[0].parentElement.style.display != "none")
                input.val(Cd_ARLotto);

            input = ActivePage().find("input[name='DataOra']");

            if (input[0].parentElement.style.display != "none")
                input.val(DataScadenza);

            break;
    }

    //Chiudo il modal
    HideAndFocus('DetailGiacenza');
}

function Detail_Giacenza_Filtro() {
    //Checkboxes
    var qta = document.querySelector("#DetailGiacenza table thead .Quantita .ck-pkpesi").checked;
    var qtaDisp = document.querySelector("#DetailGiacenza table thead .QuantitaDisp .ck-pkpesi").checked;
    var qtaDImm = document.querySelector("#DetailGiacenza table thead .QuantitaDImm .ck-pkpesi").checked;

    //Recupero le righe della tabella
    var items = Array.prototype.slice.call($("#DetailGiacenza table").find("tr.tr-giac"));

    //Ciclo le righe
    items.forEach(function (item) {
        //Memorizzo i valori
        var Quantita = parseInt($(item).find("td.Quantita")[0].innerText);
        var QuantitaDisp = parseInt($(item).find("td.QuantitaDisp")[0].innerText);
        var QuantitaDImm = parseInt($(item).find("td.QuantitaDImm")[0].innerText);

        //Mostro/nascondo la riga
        if ((qta && Quantita <= 0) || (qtaDisp && QuantitaDisp <= 0) || (qtaDImm && QuantitaDImm <= 0))
            $(item).hide();
        else
            $(item).show();
    });

    //Ricalcolo i totali
    Detail_Giacenza_Totali();

    //Local storage
    oApp_SetLocalProperty("DetailGiacenza", "Quantita", qta);
    oApp_SetLocalProperty("DetailGiacenza", "QuantitaDisp", qtaDisp);
    oApp_SetLocalProperty("DetailGiacenza", "QuantitaDImm", qtaDImm);
}

function Listener_Load(withdevices) {
    ActivePage().find(".op-listener").remove();

    //Verifico che il dt abbia delle righe
    if (oApp.dtxMOListener.length > 0) {
        for (var i = 0; i < oApp.dtxMOListener.length; i++) {
            if (withdevices == false || oApp.dtxMOListener[i].Devices > 0) {
                ActivePage().find("select[name = 'Listener']").append($('<option>', {
                    class: "op-listener",
                    value: oApp.dtxMOListener[i].Cd_xMOListener,
                    text: oApp.dtxMOListener[i].Cd_xMOListener,
                    idx: i,
                    devices: oApp.dtxMOListener[i].Devices
                }));
            }
        }
        // Seleziona il listener corrente (quello salvato nella variabile globale) 
        ActivePage().find("select[name='Listener']").val(oApp.dtxMOListener[oApp.ActiveListenerIdx].Cd_xMOListener);
    }
}

function ListenerDevice_Load(dt) {
    var ld = $("#pgStampaDocumento select[name='ListenerDevice']");
    //Aggiunge una riga vuota
    ld.append($('<option>', {
        class: "op-lsdevice"
        , value: ""
        , text: "Default Device"
        , copie: ""
    }));
    //Verifico che il dt abbia delle righe
    if (dt.length > 0) {
        for (var i = 0; i < dt.length; i++) {
            ld.append($('<option>', {
                class: "op-lsdevice"
                , value: dt[i].Device.trim()     //Id_xMOListenerDevice
                , text: dt[i].Device.trim()
                , copie: fU.IsEmpty(dt[i].NumeroCopie) ? "" : dt[i].NumeroCopie
            }));
        }
    }
}

function Listener_Moduli_Load(dt) {
    //Verifico che il dt abbia delle righe
    if (dt.length > 0) {
        var li = $("#pgStampaDocumento .template").clone().removeAttr("style").addClass("li-modulo");
        for (var i = 0; i < dt.length; i++) {
            $("#pgStampaDocumento ul").append(Listener_Moduli_Template(li.clone(), dt[i], i));
        }
    }
}

function DetailDORig_Load(dt) {
    $("#DetailDO .tr-dorig").remove();
    //Verifico che il dt abbia delle righe
    if (dt.length > 0) {
        var tr = $("#DetailDO .template").clone().removeAttr("style").addClass("tr-dorig");
        for (var i = 0; i < dt.length; i++) {
            //Riga Codice articolo
            $("#DetailDO table").append(DetailDORig_Template(tr.clone(), dt[i], i, "ROW1"));
            //Riga Descrizione
            $("#DetailDO table").append(DetailDORig_Template(tr.clone(), dt[i], i, "ROW2"));
        }
    }
}


function DetailTRRig_P_Load(dt) {
    //Verifico che il dt abbia delle righe
    if (dt.length > 0) {
        $("#Detail_Letture .mo-msg").hide();
        var tr = $("#Detail_Letture .template").clone().removeAttr("style").addClass("li-rig");
        for (var i = 0; i < dt.length; i++) {
            $("#Detail_Letture ul").append(DetailTRRig_P_Template(tr.clone(), dt[i], i));
        }
    }
    else {
        $("#Detail_Letture .mo-msg").show();
    }
}

function DetailTRRig_A_Load(dt) {
    //Verifico che il dt abbia delle righe
    if (dt.length > 0) {
        $("#Detail_Letture .mo-msg").hide();
        var tr = $("#Detail_Letture .template").clone().removeAttr("style").addClass("li-rig");
        for (var i = 0; i < dt.length; i++) {
            $("#Detail_Letture ul").append(DetailTRRig_A_Template(tr.clone(), dt[i], i));
        }
    }
    else {
        $("#Detail_Letture .mo-msg").show();
    }
}

function PackListRef_Load(dt) {

    if (dt.length > 0) {
        for (var i = 0; i < dt.length; i++) {
            var opt;
            opt = $('<option>', {
                class: "op-pklref"
                , value: dt[i].PackListRef
                , text: dt[i].PackListRef
            });
            opt.attr('data-pklref_p', fU.ToString(dt[i].PackListRef_P));
            ActivePage().find(" select[name='PackListRef']").prepend(opt);
        }
    }
}

function Popup_PackList_New_Load() {

    //Nasconde il popup se aperto
    $("#Popup_PKListAR_DelShift").hide();

    // Pulisce il campo
    $("#Popup_PackList_New input[name='PackListRef']").val("");
    // Recupera i padri
    Ajax_xmofn_xMORLPackListRef_P();
    // Recupera le tipologie di UL e carica il select
    $("#Popup_PackList_New input[name='Cd_xMOUniLog']").val("");
    $("#Popup_PackList_New .op-unilog").remove();
    var ULDefault = "";
    var dtUniLog = Ajax_xmofn_xMOUniLog();
    if (dtUniLog.length > 0) ULDefault = xMOUniLog_Load(dtUniLog);
    // Propone sempre un figlio
    $("#Popup_PackList_New .ck-pk-add-p").prop("checked", false);
    $("#Popup_PackList_New .bt-pk-add").html("Inserisci");

    // Show del detail
    $("#Popup_PackList_New").show();
    // Seleziona il sel
    setTimeout(function () {
        if (ULDefault == "")
            $("#Popup_PackList_New select[name='Cd_xMOUniLog']").focus();
        else
            $("#Popup_PackList_New input[name='PackListRef']").focus().select();

        // Vedi anche nell'init
        switch (oApp.LicF_Id) {
            case 33076: //MD
            case 99370: //Versya
                if (UserParam.getLocal("ctlPackListBCEnabled", false, Boolean))
                    $('#Popup_PackList_New input[name="PackListBC"]').focus().select();
                break;
        }
    }, 250);


}

function DetailPackingList_Load(dt) {
    $("#Detail_PackingList .mo-msg").hide();

    if (dt.length > 0) {

        var PackListRef_P = "";
        var PackListRef = "";

        //tr: testa UL corrente che contiene 
        var trULHead = $("#Detail_PackingList tr.template-ul-header").clone().removeAttr("style").removeClass("template-ul-header").addClass("pk-dati");
        var trUL_PHead = $("#Detail_PackingList tr.template-ul-p-header").clone().removeAttr("style").removeClass("template-ul-p-header").addClass("pk-dati");
        //tr: tabella della testa delle righe
        var trULHeadRows = $("#Detail_PackingList .template-ul-rows").clone().removeAttr("style").removeClass("template-ul-rows").addClass("pk-dati");
        //tr: delle righe UL
        var trULRow = $("#Detail_PackingList .template-ar").clone().removeAttr("style").removeClass("template-ar");

        for (i = 0; i < dt.length; i++) {
            // Se l'unità logistica padre e è diversa dalla precedente crea un nuovo li
            if (PackListRef_P != dt[i].PackListRef_P && !fU.IsEmpty(dt[i].PackListRef_P)) {

                //Memorizzo l'UL corrente
                PackListRef_P = dt[i].PackListRef_P;

                //Genero head dell'UL_P
                _trULHead = trUL_PHead.clone()
                _trULHead.attr("PackListRef_P", PackListRef_P);
                _trULHead.find(".PackListRef_P").text("(" + dt[i].Riga_P + ") " + PackListRef_P);

                //Aggiungo l'Head dell'UL_P
                $("#Detail_PackingList .pk-all").append(_trULHead);
            }

            // Se l'unità logica è diversa dalla precedente creo un nuovo li 
            if (PackListRef != dt[i].PackListRef) {

                //Memorizzo l'UL corrente
                PackListRef = dt[i].PackListRef;

                //Genero head dell'UL
                _trULHead = trULHead.clone();

                //Se non ha padre lo colora di giallo tenue
                if (fU.IsEmpty(dt[i].PackListRef_P))
                    _trULHead.addClass("w3-light-yellow");

                //Se non ha PK lo colora di grigio
                if (fU.IsEmpty(dt[i].PackListRef))
                    _trULHead.addClass("w3-gray");

                if (PackListRef) {
                    _trULHead.attr("PackListRef", PackListRef).find(".PackListRef").text(PackListRef);
                    _trULHead.attr("Cd_xMOUniLog", dt[i].Cd_xMOUniLog);
                    _trULHead.attr("Descrizione", dt[i].Descrizione);

                    var img = _trULHead.find("img");
                    img.attr("PackListRef", PackListRef);
                    img.attr("Cd_xMOUniLog", dt[i].Cd_xMOUniLog);
                    img.attr("Descrizione", dt[i].Descrizione);
                    img.on("click", function () {
                        Popup_PKList_P_Shift_Load($(this).attr("PackListRef"), $(this).attr("Cd_xMOUniLog"), $(this).attr("Descrizione"));
                    });

                    if (!fU.IsEmpty(dt[i].PackListRef_P))
                        _trULHead.find("img").addClass("w3-margin-left");

                } else {
                    _trULHead.attr("PackListRef", PackListRef).find(".PackListRef").text("NO UL");
                }

                _trULHeadRows = trULHeadRows.clone();
                //Aggiungo l'Head dell'UL e l'Head delle righe dell'UL
                $("#Detail_PackingList .pk-all").append(_trULHead).append(_trULHeadRows);
            }

            // Articolo dell'unità logistica corrente'
            _trULRow = DetailPackingList_ULAR_Template(trULRow.clone(), dt[i], i);

            // Append del tr nella tabella della corrispondente UL
            _trULHeadRows.find("table").append(_trULRow);

            //Totali pesi e volumi di UL e di tutta la packing
            Sum_Pesi_Volumi(_trULHead, _trULHeadRows, dt[i]);

        }

        // Nascondo le colonne dati2 che comprende i pesi e i volumi
        if ($("#Detail_PackingList .ck-pkpesi").prop("checked") == true) {
            $("#Detail_PackingList .dati2").show();
            $("#Detail_PackingList .dati1").hide();
        }
        else {
            $("#Detail_PackingList .dati1").show();
            $("#Detail_PackingList .dati2").hide();
        }
    }
    else { $("#Detail_packingList .mo-msg").show(); }
}

function Popup_PKListAR_DelShift_Load(tr) {

    var p = $('#Popup_PKListAR_DelShift');

    p.attr('Id_xMORLRig', tr.attr('Id_xMORLRig'));
    p.attr('Id_xMORLRigPackList', tr.attr('Id_xMORLRigPackList'));

    p.find(".Cd_AR").text(tr.find(".Cd_AR").text());
    p.find("input[name='Qta']").val(tr.find(".Qta").text());
    p.find(".Cd_ARMisura").text(tr.find(".Cd_ARMisura").text());

    //Blocca la Qta se l'articolo non ha PK
    //p.find("input[name='Qta']").attr("disabled", fU.IsZeroVal(tr.attr('Id_xMORLRigPackList')));

    p.find("select").remove();
    p.find(".div-container").append(ActivePage().find("select[name='PackListRef']").clone());

    p.show();
}

function Popup_PKList_P_Shift_Load(PackListRef, Cd_xMOUniLog, Descrizione) {
    var p = $('#Popup_PKListUL_Shift');
    p.find('label[name="PackListRef"]').text(PackListRef);
    p.find('label[name="Descrizione"]').text(' - '.concat(Cd_xMOUniLog, ' [', Descrizione, ']'));

    // UL Padre
    p.find("select[name='PackListRef_P'] option").remove();
    var unitaPadre = Array.from(ActivePage().find("select[name='PackListRef']").find("option"))
        .map(function (item) {
            return item.dataset.pklref_p
        }).filter(function (item, index, self) {
            if (!item) return false;
            var elem = self.find(function (unita) { return unita == item });
            return self.indexOf(elem) === index;
        });
    var sel = p.find("select[name='PackListRef_P']");
    sel.append($('<option>', { value: null, text: "" }));
    unitaPadre.forEach(function (item) {
        p.find("select[name='PackListRef_P']").append($('<option>', { value: item, text: item }));
    });

    // UL Tipo
    var dtUniLog = Ajax_xmofn_xMOUniLog();
    sel = p.find("select[name='Cd_xMOUniLog']");
    sel.val(null);
    sel.find('option').remove();
    sel.append($('<option>', { value: null, text: "" }));
    dtUniLog.forEach(function (item) {
        var opt = $('<option>', { class: "op-unilog", value: item.Cd_xMOUniLog, text: item.Cd_xMOUniLog + " - " + item.Descrizione });
        opt.attr('data-prefix', item.PreFix);
        opt.attr('data-suffix', item.SufFix)
        sel.append(opt);
    });
    p.show();
}

function xMOMGEsercizio_Load(dt, idobj) {
    if (dt.length > 0) {
        for (var i = 0; i < dt.length; i++) {
            $("#" + idobj + " select[name='Cd_MGEsercizio']").append($('<option>', {
                class: "op-mges"
                , value: dt[i].Cd_MGEsercizio
                , text: dt[i].Cd_MGEsercizio + " - " + dt[i].Descrizione
            }));
        }
    }
}

function xMOIN_Aperti_Load(dt) {
    //Verifico che il dt abbia delle righe
    if (dt.length > 0) {
        var li = $("#pgINAperti .template").clone().removeAttr("style").addClass("li-in");
        for (var i = 0; i < dt.length; i++) {
            $("#pgINAperti ul").append(xMOIN_Aperti_Template(li.clone(), dt[i], i));
        }
    }
}

// Load select dei tipi di UL
function PackListRef_P_Load(dt) {

    var sel = $("#Popup_PackList_New select[name='PackListRef_P']");
    var opt;
    if (dt.length > 0) {
        for (var i = 0; i < dt.length; i++) {
            opt = $('<option>', {
                class: "op-unilog-p"
                , value: dt[i].PackListRef
                , text: dt[i].PackListRef + " [" + dt[i].Cd_xMOUniLog + "]"
            });
            sel.append(opt);
        }
    }
}

// Load select dei tipi di UL
function xMOUniLog_Load(dt) {
    var ULDefault = "";
    var sel = $("#Popup_PackList_New select[name='Cd_xMOUniLog']");
    var opt;
    if (dt.length > 0) {
        for (var i = 0; i < dt.length; i++) {
            opt = $('<option>', {
                class: "op-unilog"
                , value: dt[i].Cd_xMOUniLog
                , text: dt[i].Cd_xMOUniLog + " - " + dt[i].Descrizione
            });
            opt.attr('data-prefix', dt[i].PreFix);
            opt.attr('data-suffix', dt[i].SufFix)
            sel.append(opt);
            // Memorizza l'UL di default dando precedenza a quella eventualmente impostata nella configurazione del doc
            if (oPrg.drRL && oPrg.drRL.Cd_xMOUniLog) {
                if (ULDefault == "" && oPrg.drRL.Cd_xMOUniLog == dt[i].Cd_xMOUniLog) ULDefault = oPrg.drRL.Cd_xMOUniLog;
            } else {
                if (ULDefault == "" && dt[i].ULDefault) ULDefault = dt[i].Cd_xMOUniLog;
            }
        }
    }
    //seleziona l'UL di default (anche se vuota)
    $("#Popup_PackList_New select[name='Cd_xMOUniLog']").val(ULDefault);
    // Recupera il nuovo numero della packing
    Ajax_xmofn_xMORLRigPackingList_GetNew();
    // Restituisce l'UL di default 
    return ULDefault;
}

// Load delle giacenze nella tabella
function xMOGiacenza_Load(dt) {
    if (dt.length > 0) {
        var tr = ActivePage().find(".tbl-argiac .template").clone().removeAttr("style").addClass("tr-rig-argiac");
        for (var i = 0; i < dt.length; i++) {
            ActivePage().find(".tbl-argiac").append(xMOGiacenza_Template(tr.clone(), dt[i], i));
        }
    }
}

function pgSM_SSCC_Load(mat) {

    $("#pgSM .div-sscc").hide();

    $("#pgSM .Id_xMOTR").text(mat.Id_xMOTR);
    $("#pgSM .Id_xMOTRRig_P").text(mat.Id_xMOTRRig_P);
    $("#pgSM .Cd_xMOMatricola").text(mat.Cd_xMOMatricola);
    $("#pgSM .Cd_AR").text(mat.Cd_AR);
    $("#pgSM .AR_Descrizione").text(mat.AR_Descrizione);
    $("#pgSM .Cd_ARLotto").text(mat.Cd_ARLotto);
    $("#pgSM .DataScadenza").text(fU.DateJsonToDate(mat.DataScadenza));
    $("#pgSM .Cd_MG_A").text(mat.Cd_MG);

    if (oApp.xMOImpostazioni.MagUbiCompleta)
        $("#pgSM .Cd_MGUbicazione_A").text(mat.Cd_MGUbicazione);

    $("#pgSM .lbl-esito").html("");

    $("#pgSM .div-infosscc").show();
    SetFocus();
    //$("#pgSM input[name='Cd_MGUbicazione']").focus();

}

function pgRLRig_T_FindPosition(Id_xMORLRig_T, Id_DORig) {
    // Cerca la prima riga da leggere con Id maggiore del corrente letto
    var tmp = oPrg.RL.dtRLRig_T.find(function (item) {
        if (Id_xMORLRig_T)
            return item.Id_xMORLRig == null && item.Id_xMORLRig_T > Id_xMORLRig_T;
        else if (Id_DORig)
            return item.Id_xMORLRig == null && item.Id_DORig == Id_DORig;
        else
            return item.Id_xMORLRig == null;
    });

    // Nulla se non ho trovato la riga imposto a null (potrei aver letto tutto)
    oPrg.RL.idx_t = tmp ? oPrg.RL.dtRLRig_T.indexOf(tmp) : null;

    // Se non ho trovato la riga
    if (!oPrg.RL.idx_t) {
        // Ricerco dalla prima non completa
        tmp = oPrg.RL.dtRLRig_T.find(function (item) {
            return item.Id_xMORLRig == null;
        });

        // Se non ho trovato la riga (completato tutto) mi sposto sull'ultima
        oPrg.RL.idx_t = tmp ? oPrg.RL.dtRLRig_T.indexOf(tmp) : oPrg.RL.dtRLRig_T.length - 1;
    }

    if (oPrg.RL.idx_t > oPrg.RL.dtRLRig_T.length || oPrg.RL.idx_t < 0)
        oPrg.RL.idx_t = 0;

    //Ricarica la lista
    pgRLRig_T_MoveTo();

}

function pgRLRig_T_MoveTo() {

    var item = oPrg.RL.dtRLRig_T[oPrg.RL.idx_t];

    ActivePage().find(".rigtcurtot").text((oPrg.RL.idx_t + 1) + "/" + oPrg.RL.dtRLRig_T.length);
    ActivePage().find(".numero-riga").text(item.Letture_L);

    $("#pgRLRig_T div.RLRig .Id_DORig").text(item.Id_DORig);
    $("#pgRLRig_T div.RLRig .Id_xMORLRig_T").text(item.Id_xMORLRig_T);

    $("#pgRLRig_T div.RLRig .Cd_AR").text(item.Cd_AR);
    $("#pgRLRig_T div.RLRig .lbl-matricola").text("MATRICOLA [" + item.Cd_xMOMatricola + "]");
    $("#pgRLRig_T div.RLRig .ARQtaT").text("/" + item.Letture_T);
    $("#pgRLRig_T div.RLRig .Cd_ARMisura").text(item.Cd_ARMisura);

    $("#pgRLRig_T div.RLRig .AR_Descrizione").text(item.AR_Descrizione);
    $("#pgRLRig_T div.RLRig .Cd_ARLotto").text(item.Cd_ARLotto);
    $("#pgRLRig_T div.RLRig .Cd_MG").text(item.Cd_MG);
    $("#pgRLRig_T div.RLRig .Cd_MGUbicazione").text(fU.IsEmpty(item.Cd_MGUbicazione) ? "Articolo non ubicato" : item.Cd_MGUbicazione);

    if (item.Id_xMORLRig)
        $("#pgRLRig_T img.Letto").show();
    else
        $("#pgRLRig_T img.Letto").hide();

    $("#pgRLRig_T div.RLRig input[name='Cd_xMOMatricola']").val("").focus();

    //Mostro il bottone Completato se ho letto tutte le righe
    if (item.Letture_L == item.Letture_T) {
        $("#pgRLRig_T .div-btncompletato").show();
    } else {
        $("#pgRLRig_T .div-btncompletato").hide();
    }
}

function pgRLRig_T_AR_Load(dt) {
    // Rimuovo tutte le righe
    $("#pgRLRig_T .lista-ar table tbody tr.tr-ar").remove();

    // Tabella alla quale aggiungo le righe
    var tr = null;
    var n = 0;
    // Ciclo le righe da leggere
    dt.forEach(function (item) {

        tr = $("#pgRLRig_T .lista-ar table tbody tr.template").clone().removeClass("template").removeAttr("style").addClass("tr-ar");
        if (item.Tipo == 1) {
            tr.find(".Cd_AR").text(item.Cd_AR);
            tr.find(".Quantita").addClass("lg-bold");
            n += 1;
        }
        if (item.Qta_T < item.Qta_R) {
            tr.find(".Quantita").text(item.Qta_L + "/" + item.Qta_T + "/" + item.Qta_R + " " + item.Cd_ARMisura);
            tr.find(".Quantita").addClass("w3-text-red");
        } else {
            tr.find(".Quantita").text(item.Qta_L + "/" + item.Qta_T + " " + item.Cd_ARMisura);
        }
        tr.find(".Cd_ARLotto").text(item.Cd_ARLotto);

        if (item.Qta_L > 0 && item.Qta_L >= item.Qta_T)
            tr.find(".Quantita").addClass("w3-text-green");

        $(tr).on("click", function () {
            pgRLRig_T_FindPosition(null, item.Id_DoRig);
        });

        $("#pgRLRig_T .lista-ar table").append(tr);
    });

    $("#pgRLRig_T .artot").text(n);
}

function pgTRSSCC_Load(dt) {

    // Reset della pagina
    pgTRSSCC_UI();

    if (dt.length > 0) {

        var item = dt[0];

        $("#pgTRSSCC .Cd_xMOMatricola").text(item.Cd_xMOMatricola);

        $("#pgTRSSCC input[name='Cd_AR']").val(item.Cd_AR);
        $("#pgTRSSCC input[name='Cd_ARLotto']").val(item.Cd_ARLotto);

        $("#pgTRSSCC input[name='Quantita']").val(item.QtaEvadibile);
        $("#pgTRSSCC .Quantita").text(item.QtaEvadibile);
        Quantita_Onfocus();
        $("#pgTRSSCC select[name='Cd_ARMisura']").val(item.Cd_ARMisura.toUpperCase());

        $("#pgTRSSCC input[name='Cd_MG_P']").val(item.Cd_MG);
        $("#pgTRSSCC input[name='Cd_MGUbicazione_P']").val(item.Cd_MGUbicazione);
        $("#pgTRSSCC .cd_mg_p").text(item.Cd_MG + "." + item.Cd_MGUbicazione);
        DivToggle_Execute($("#pgTRSSCC .div-mgp"), false);

        $("#pgTRSSCC input[name='Cd_MG_A']").val(item.Cd_MG);
    }

    $("#pgTRSSCC .div-info").removeClass("w3-hide");
    $("#pgTRSSCC .div-sscc").addClass("w3-hide");
    SetFocus();

}

function pgINSSCC_Load(dt) {

    if (dt.length > 0) {

        var item = dt[0];

        $("#pgINSSCC input[name='Cd_AR']").val(item.Cd_AR);
        $("#pgINSSCC input[name='Quantita']").val(item.QtaEvadibile);
        $("#pgINSSCC .Quantita").text(item.QtaEvadibile);
        Quantita_Onfocus();
        $("#pgINSSCC select[name='Cd_ARMisura']").val(item.Cd_ARMisura.toUpperCase());
        //SetFocus();
    } else {
        PopupMsg_Show("ERRORE", 1, "Matricola non valida");
    }
}

function pgINTMG_MAT_Load(dt) {

    if (dt.length > 0) {

        $("#pgINTMG_MAT .Cd_xMOMatricola").text(dt[0].Cd_xMOMatricola);

        if (fU.ToBool(dt[0].Attiva)) {
            $("#pgINTMG_MAT .Attiva").text("Attiva");
            $("#pgINTMG_MAT .AttivaIcon").attr("src", "icon/Enable.svg");
        } else {
            $("#pgINTMG_MAT .Attiva").text("Disattiva");
            $("#pgINTMG_MAT .AttivaIcon").attr("src", "icon/Disable.svg");
        }
        $("#pgINTMG_MAT .Cd_AR").text(dt[0].Cd_AR);
        $("#pgINTMG_MAT .AR_Descrizione").text(dt[0].AR_Descrizione);
        $("#pgINTMG_MAT .Cd_ARLotto").text(dt[0].Cd_ARLotto);
        $("#pgINTMG_MAT .DataScadenza").text(fU.IfEmpty(fU.DateJsonToDate(dt[0].DataScadenza), "Nessuna Data Scadenza"));
        $("#pgINTMG_MAT .QtaEvadibile").text(dt[0].QtaEvadibile);
        $("#pgINTMG_MAT .Cd_ARMisura").text(dt[0].Cd_ARMisura.toUpperCase());
        $("#pgINTMG_MAT .Cd_MG").text(dt[0].Cd_MG);
        $("#pgINTMG_MAT .Cd_MGUbicazione").text(fU.IsEmpty(dt[0].Cd_MGUbicazione) ? "Non ubicata" : dt[0].Cd_MGUbicazione);
        if (!fU.IsEmpty(dt[0].Cd_xMOLinea)) {
            $("#pgINTMG_MAT .div-linea").show();
            $("#pgINTMG_MAT .Cd_xMOLinea").text(dt[0].Cd_xMOLinea);
        }
        else {
            $("#pgINTMG_MAT .div-linea").hide();
        }

        $("#pgINTMG_MAT .div-infosscc").show();
        $("#pgINTMG_MAT input[name='Cd_xMOMatricola']").val("").focus();

    }
    else {
        $("#pgINTMG_MAT").find(".Cd_xMOMatricola, .Cd_AR, .AR_Descrizione, .Cd_ARLotto, .DataScadenza, .QtaEvadibile, .Cd_ARMisura, .Cd_MG, .Cd_MGUbicazione").text("");
        PopupMsg_Show("ATTENZIONE", 1, "Codice matricola non trovato");
    }
}

function pgTRMP_P_Load(dt) {
    //Verifico che il dt abbia delle righe
    if (dt.length > 0) {
        $("#pgTRMP_P .mo-msg").hide();
        var tr1 = $("#pgTRMP_P .da-produrre .template").clone().removeAttr("style").addClass("tr-rig");
        var tr2 = $("#pgTRMP_P .template_ARDesc").clone().removeAttr("style").addClass("tr-rig tr-ardesc");
        for (var i = 0; i < dt.length; i++) {
            $("#pgTRMP_P table").append(pgTRMP_P_Template(tr1.clone(), dt[i], i));
            $("#pgTRMP_P table").append(pgTRMP_P_Desc_Template(tr2.clone(), dt[i], i));
        }

        //Applico i filtri
        pgTRMP_P_Filter();
    }
    else {
        $("#pgTRMP_P .mo-msg").text("Nessun padre da produrre").show();
    }
}

function pgTRMP_P_Filter() {
    var page = $("#" + oPrg.ActivePageId);
    var input = $(page).find(".filtri input[name='Query']");
    var query = $(input).val();

    var rows = Array.prototype.slice.call($(page).find("table.tbl-arlist tbody tr.tr-rig"));
    var filtered = [];

    rows.forEach(function (item) {

        var Cd_AR = $(item).attr("cd_ar");
        var Id_DOTes = $(item).attr("id_dotes");
        var Id_DORig_P = $(item).attr("id_dorig_p");

        if (query.trim() == "" || (Cd_AR == query || Id_DOTes == query || Id_DORig_P == query)) {
            $(item).show();
            filtered.push(item);
        }
        else {
            $(item).hide();
        }
    });

    $(input).select();

    setTimeout(function () {
        //Verifico 2 perchè la riga di descrizione è sempre presente
        if (filtered.length == 2)
            $(filtered[0]).click();
    }, 500)
}

function pgTRMP_C_AR_Filter() {
    var page = $("#" + oPrg.ActivePageId);
    var input = $(page).find(".filtri input[name='Query']");
    var query = $(input).val();

    var rows = Array.prototype.slice.call($(page).find("table tbody tr.tr-rig"));
    var filtered = [];

    var ckAll = document.querySelector("#" + oPrg.ActivePageId + " input.ck-all").checked;

    rows.forEach(function (item) {

        if (!ckAll && $(item).attr("completo"))
            return;

        var Cd_AR = $(item).attr("cd_ar");

        if (query.trim() == "" || Cd_AR == query) {
            $(item).show();
            filtered.push(item);
        }
        else {
            $(item).hide();
        }
    });

    $(input).select();

    setTimeout(function () {
        //Verifico 2 perchè la riga di descrizione è sempre presente
        if (filtered.length == 2)
            $(filtered[0]).click();
    }, 500)
}

function pgTRMP_C_AR_Load() {

    var dt = oPrg.TRMP.dtDORig_C;

    //Verifico che il dt abbia delle righe
    if (dt.length > 0) {
        $("#pgTRMP_C_AR .mo-msg").hide();
        var tr1 = $("#pgTRMP_C_AR .template").clone().removeAttr("style").addClass("tr-rig");
        var tr2 = $("#pgTRMP_C_AR .template_ARDesc").clone().removeAttr("style").addClass("tr-rig tr-ardesc");
        for (var i = 0; i < dt.length; i++) {
            $("#pgTRMP_C_AR table").append(pgTRMP_C_AR_Template(tr1.clone(), dt[i], i));
            $("#pgTRMP_C_AR table").append(pgTRMP_C_AR_ARDesc_Template(tr2.clone(), dt[i]));
        }

        //Imposta il rolling alla tabella e alle colonne th-rolling
        rolling.tableSet($("#pgTRMP_C_AR .lg-table"));

        // Visualizza i tr in base al filtro
        pgTRMP_C_AR_All($("#pgTRMP_C_AR .ck-all").prop("checked"));

    }
    else {
        $("#pgTRMP_C_AR .mo-msg").text("Nessun componente da traferire").show();
    }
}

function pgTRMP_AR_Load(dt) {

    var p = $("#pgTRMP_C_AR .TRMP_AR");

    p.find(".tra-cxp-title").text("TRA.COM. (C " + dt[0].Riga_C + " x P " + dt[0].Riga_P + ") [" + dt[0].Cd_DO_P + " " + dt[0].Id_DOTes_P + "]");
    p.find(".Cd_AR_P").text(dt[0].Cd_AR_P);
    p.find(".Ds_AR_P").text(dt[0].Ds_AR_P);
    p.find(".Qta_P").text(dt[0].QtaEvasa_P + "/" + dt[0].Qta_P + " " + dt[0].Cd_ARMisura_P);
    p.find(".Cd_AR_C").text(dt[0].Cd_AR_C);
    p.find(".Ds_AR_C").text(dt[0].Ds_AR_C);
    p.find(".Qta_C").text(dt[0].QtaEvasa_C + "/" + dt[0].Qta_C + " " + dt[0].Cd_ARMisura_C);

    p.find(".Cd_ARLotto").text(dt[0].Cd_ARLotto);
    p.find(".Cd_MG_P").text(dt[0].Cd_MG_P);
    p.find(".Cd_MGUbicazione_P").text(dt[0].Cd_MGUbicazione_P);
    p.find(".Cd_xMOLinea").text(dt[0].Cd_xMOLinea);
    //Consorzio logic ### inserire il controllo chiave
    p.find("input[name='Cd_xMOLinea']").val(dt[0].Cd_xMOLinea);
    p.find("input[name='Cd_xMOLinea']").attr("disabled", "disabled");

    /* Modifica del lotto */
    var lblCd_ARLotto = $("#pgTRMP_C_AR .TRMP_AR label.Cd_ARLotto");

    if (dt[0].SetARLotto) {
        $("#pgTRMP_C_AR .TRMP_AR .detail-giacubi").show();
        lblCd_ARLotto.removeClass("read-only");
        lblCd_ARLotto.addClass("editable");

        $(lblCd_ARLotto).click(function () {
            $("#pgTRMP_C_AR .TRMP_AR .detail-giacubi").click();
        });
    }
    else {
        $("#pgTRMP_C_AR .TRMP_AR .detail-giacubi").hide();
        lblCd_ARLotto.removeClass("editable");
        lblCd_ARLotto.addClass("read-only");

        lblCd_ARLotto.off('click');
    }

    $("#pgTRMP_C_AR .TRMP_C").hide();
    $("#pgTRMP_C_AR .TRMP_AR").show();
}

function pgTRMP_C_AR_Show() {
    $("#pgTRMP_C_AR .TRMP_AR").hide();
    $("#pgTRMP_C_AR .TRMP_C").show();
}

function pgTRRM_Load(item) {

    var mat = fU.SsccToMatricola($("#pgTRRM input[name= 'Cd_xMOMatricola']").val());
    $("#pgTRRM .Cd_xMOMatricola").text(mat);
    $("#pgTRRM .Cd_AR").text(item.Cd_AR);
    $("#pgTRRM input[name='Cd_AR']").val(item.Cd_AR);
    $("#pgTRRM .AR_Descrizione").text(item.AR_Descrizione);
    $("#pgTRRM .Cd_ARLotto").text(item.Cd_ARLotto);
    $("#pgTRRM .DataScadenza").text(item.DataScadenza);
    ARARMisura_Set(item.Cd_ARMisura.toUpperCase());
    $("#pgTRRM input[name='Quantita']").val(item.QtaEvadibile);

    //Disabilito Qta e Cd_Ar
    pgTRRM_Set_Edit(false);

    Quantita_Onfocus();
    //$("#pgTRRM select[name='Cd_ARMisura']").val(item.Cd_ARMisura.toUpperCase());
    $("#pgTRRM .Cd_MG_A").text(item.Cd_MG_A);

    if (oApp.xMOImpostazioni.MagUbiCompleta)
        $("#pgTRRM .Cd_MGUbicazione_A").text(item.Cd_MGUbicazione_A);

    $("#pgTRRM .div-dati").attr("Id_xMOTR", item.Id_xMOTR);
    $("#pgTRRM .Id_xMOTRRig_P").text(item.Id_xMOTRRig_P);

    $("#pgTRRM .div-linea").hide();
    $("#pgTRRM .div-dati").show();
}

function pgTRRM_Set_Edit(enabled) {
    $("#pgTRRM input[name='Quantita']").prop('disabled', !enabled);
    $("#pgTRRM select[name='Cd_ARMisura']").prop('disabled', !enabled);

    if (enabled)
        $("#pgTRRM label[name='SetEdit']").hide();
    else
        $("#pgTRRM label[name='SetEdit']").show();
}

//Carica il popup DMS
function Popup_DMS_Load(EntityTable, EntityId) {
    switch (EntityTable) {
        case 'xMOCodSpe':
            //Carica il codice spedizione
            Ajax_xmofn_DMS_List(EntityTable, EntityId, '', false);
            break;
    }
    if (oPrg.DMS.dtDMS.length > 0) {
        // Pulisco gli elementi
        $("#Popup_DMS ul.dms li.dms").remove();

        var li = $("#Popup_DMS .template").clone().removeClass("template").removeAttr("style").addClass("dms");
        for (var i = 0; i < oPrg.DMS.dtDMS.length; i++) {
            $("#Popup_DMS ul").append(DMS_Template(li.clone(), oPrg.DMS.dtDMS[i], i));
        }

        // Visualizzo il popup
        $("#Popup_DMS").show();
    } else {
        PopupMsg_Show('DMS', 'Errore', 'Nessun DMS per il codice corrente: ' + EntityId)
    }
}


// fnl interamente cambiata
function DMS_Template(li, item, key) {
    li.find(".id").text(item.Id_DmsDocument);
    li.find(".descrizione").text(item.Descrizione);
    li.on("click", function () {

        $.ajax({
            url: "Logistica.aspx/xmofn_DMS_Download",
            async: false,
            data: JSON.stringify({ Id_DmsDocument: item.Id_DmsDocument }),
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (mydata) {
                window.open(mydata.d, '_blank');
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
            }
        });
    });

    return li;
}

//Carica il popup DMS
function Popup_Note_Load(data) {
    // Oggetti del DOM
    var popup = $("#Popup_Note");
    var ul = popup.find('ul');
    var template = ul.find('li.template').clone().removeClass("template").removeAttr("style").addClass("nota");

    // Rimuovo le note
    ul.find('li.nota').remove();


    if (data && data.length > 0) {
        // Aggiungo le note del documento
        data.forEach(function (nota) {
            ul.append(Note_Template(template.clone(), nota))
        });
        // Mostro il popup
        popup.show();
    }
}

function Note_Template(li, item) {
    li.find(".descrizione").text(item.Descrizione);
    li.find(".nota").text(item.Nota);
    return li;
}

function Popup_MGRettifica_Load(idpg) {

    // Svuoto il popup 
    $("#Popup_MGRettifica input").val("");
    $("#Popup_MGRettifica .Cd_AR, #Popup_MGRettifica .Cd_MG").text("");
    // Carico gli esercizi
    Ajax_xmofn_xMOMGEsercizio("Popup_MGRettifica");
    // Recupero l'articolo dalla pagina
    $("#Popup_MGRettifica .Cd_AR").text($("#" + idpg + " input[name='Cd_AR']").val());
    // Verifica se prendere mg_p o mg_a
    var mgpa;
    if (!fU.IsEmpty($("#" + idpg + " input[name='Cd_MG_P']").val())) mgpa = "_P";
    else if (!fU.IsEmpty($("#" + idpg + " input[name='Cd_MG_A']").val())) mgpa = "_A";
    else mgpa = "";

    // Recupero il magazzino dalla pagina 
    $("#Popup_MGRettifica .Cd_MG").attr("mgpa", mgpa).text($("#" + idpg + " input[name='Cd_MG" + mgpa + "']").val());

    // Se è stata specificata un ubicazione nella pagina la recupero e la indico nel popup altrimenti nascondo il div-ubi del popup
    fU.IsEmpty($("#" + idpg + " input[name='Cd_MGUbicazione" + mgpa + "']").val()) ? $("#Popup_MGRettifica .div-mgubi").hide() : $("#Popup_MGRettifica .div-mgubi").show().find(".Cd_MGUbicazione").text($("#" + idpg + " input[name='Cd_MGUbicazione" + mgpa + "']").val());

    // Recupero il lotto della pagina se è stato indicato
    fU.IsEmpty($("#" + idpg + " input[name='Cd_ARLotto']").val()) ? $("#Popup_MGRettifica .div-lotto").hide() : $("#Popup_MGRettifica .div-lotto").show().find(".Cd_ARLotto").text($("#" + idpg + " input[name='Cd_ARLotto']").val());

    // Imposto una descrizione di default
    $("#Popup_MGRettifica input[name='Descrizione']").val("Rettifica su prelievo");

    // Recupera la giacenza per ar-mg-ubi-lotto
    var giac = Ajax_xmofn_xMOMGGiacContabile(mgpa);
    $("#Popup_MGRettifica .Giacenza").text(giac);

    // Visualizzo il popup
    $("#Popup_MGRettifica").show();
    $("#Popup_MGRettifica input[name='Quantita']").focus();
}

function Detail_NotePiede_Load(dt) {

    if (dt.length > 0) {
        $("#Detail_NotePiede .mo-msg").hide();
        var li = $("#Detail_NotePiede .template").clone().removeAttr("style").addClass("li-note");
        for (var i = 0; i < dt.length; i++) {
            $("#Detail_NotePiede ul").append(Detail_NotePiede_Template(li.clone(), dt[i], i));
        }
    }
    else {
        $("#Detail_NotePiede .mo-msg").text("Nessuna nota presente").show();
    }
}

// -------------------------------------------------
// ENDREGION: Funzioni Load
// -------------------------------------------------
// -------------------------------------------------
// #1.50 REGION: TEMPLATE
// -------------------------------------------------

function ARDesc_Template(obj, AR, ARDesc) {
    obj.attr("Cd_AR", AR);
    obj.find(".Descrizione").text(ARDesc);

    return obj;
}

function Search_Articolo_Template(li, item, key) {
    li.attr("Cd_AR", item.Cd_AR);
    li.attr("Descrizione", item.Descrizione);
    li.attr("Cd_ARMisura", item.Cd_ARMisura);
    // fnl 
    li.find(".cd").text(item.Cd_AR);
    li.find(".desc").html(item.Descrizione);

    return li;
}

function Search_ARLotto_Template(li, item, key) {

    li.attr("Cd_AR", item.Cd_AR);
    li.attr("Cd_ARLotto", item.Cd_ARLotto);
    li.attr("Cd_MG", item.Cd_MG);
    li.attr("Cd_MGUbicazione", item.Cd_MGUbicazione);

    fU.ShowIf(li.find(".qta-lotto"), !fU.IsEmpty(item.Quantita));
    fU.ShowIf(li.find(".cdubi-lotto"), !fU.IsEmpty(item.Cd_MGUbicazione));

    li.find(".cd-lotto").text(item.Cd_ARLotto);
    li.find(".desc-lotto").text(item.Descrizione);
    li.find(".ar-lotto").text(item.Cd_AR);
    li.find(".qta-lotto").html(item.Quantita);
    li.find(".um-lotto").html(item.Cd_ARMisura);
    li.find(".scadenza-lotto").text(fU.DateJsonToDate(item.DataScadenza));
    li.find(".cdubi-lotto").html("UBI:&nbsp;" + item.Cd_MGUbicazione);

    return li;

}

function Search_Spedizione_Template(li, item, key) {
    li.attr("Cd_xMOCodSpe", item.Cd_xMOCodSpe);

    li.find(".cd").html(item.Cd_xMOCodSpe);
    li.find(".desc").text(item.Descrizione);
    li.find(".sp-ndocs").text("Nr Documenti: " + item.NDocs);

    return li;
}

function Search_CF_Template(li, item, key, TipoPrelievo) {

    li.attr("Cd_CF", item.Cd_CF);
    li.attr("Destinazioni", item.Destinazioni);
    li.attr("CFDest_Default", item.CFDest_Default);
    li.attr("Descrizione", item.Descrizione);
    li.attr("CFDest_Descrizione", item.CFDest_Descrizione);
    li.attr("HaPrelievi", item.HaPrelievi);

    li.find(".cd-cf").html(item.Cd_CF + "&nbsp;-&nbsp;");
    if (TipoPrelievo > 0 && item.HaPrelievi == true) {
        li.find("label").addClass("lg-bold");
    }
    li.find(".desc-cf").text(item.Descrizione); //(item.Descrizione).length > 40 ? item.Descrizione.substring(0, 35) + '...' : item.Descrizione);

    li.find(".detail").attr("Cd_CF", item.Cd_CF);

    li.find(".detail").on("click", function () {
        Detail_Ajax_xmovs_CF($(this).attr("Cd_CF"));
    });

    switch (fU.IfEmpty(item.TipoStato, "").trim().toUpperCase()) {
        case 'B':
            li.find(".cfstato").text("Bloccato").css("color", "red");
            break;
        case 'S':
            li.find(".cfstato").text("Segnala").css("color", "orange");
            break;
        default:
            li.find(".cfstato").text("");
            break;
    }

    li.find(".cfstato").attr("Cd_CF", item.Cd_CF);

    li.find(".cfstato").on("click", function () {
        Ajax_xmosp_CF_Validate($(this).attr("Cd_CF"));
    });

    li.on("click", function (event) {
        //Verifico che l'elemento che ha scatenato il click sia il li e non un'icona
        if (!$(event.target).hasClass("detail") && !$(event.target).hasClass("cfstato")) {
            Search_Close($(this));
        }
    });

    return li;
}

function Search_CFDest_Template(li, item, key) {

    li.attr("Cd_CFDest", item.Cd_CFDest);
    li.attr("Descrizione", item.Descrizione);
    li.attr("Cd_CF", item.Cd_CF);
    li.attr("CF_Descrizione", item.CF_Descrizione);

    li.find(".cd-cfdest").text(item.Cd_CFDest);
    li.find(".desc-cfdest").text(item.Descrizione);
    li.find(".cd-cf").html(item.Cd_CF + '&nbsp;-&nbsp;' + item.CF_Descrizione);

    li.find(".detail").attr("Cd_CF", item.Cd_CF);
    li.find(".detail").attr("Cd_CFDest", item.Cd_CFDest);

    li.find(".detail").on("click", function () {
        Detail_Ajax_xmovs_CFDest($(this).attr("Cd_CF"), $(this).attr("Cd_CFDest"));
    });

    li.on("click", function (event) {
        //Verifico che l'elemento che ha scatenato il click sia il li e non un'icona
        if (!$(event.target).hasClass("detail")) {
            Search_Close($(this));
        }
    });

    return li;
}

function Search_MG_Template(li, item, key) {

    li.attr("Cd_MG", item.Cd_MG);
    // fnl
    li.find(".cd").text(item.Cd_MG);
    li.find(".desc").text(item.Descrizione);

    return li;
}

function Search_MGUbicazione_Template(li, item, key) {

    li.attr("Cd_MGUbicazione", item.Cd_MGUbicazione);
    li.attr("Cd_MG", item.Cd_MG);

    // fnl
    li.find(".cd").text(item.Cd_MGUbicazione);
    li.find(".desc").text(item.Descrizione);
    li.find(".cd_mg").text(item.Cd_MG);
    li.find(".xmocompleta").html(fU.ToBool(item.xMOCompleta) ? "&nbsp;COMPLETA" : "");

    // fnl
    if (fU.ToBool(item.DefaultMGUbicazione) == true) {
        li.find(".ubidefault").removeClass("w3-hide");
    }
    return li;
}

function Search_DOSottoCommessa_Template(li, item, key) {

    li.attr("Cd_DOSottoCommessa", item.Cd_DOSottoCommessa);

    // fnl
    li.find(".cd").text(item.Cd_DOSottoCommessa);
    li.find(".desc").text(item.Descrizione);

    return li;
}

function Search_CdDes_Template(li, item, key) {

    li.attr("Cd", item.Cd);
    li.attr("Des", item.Des);
    li.find(".cd").text(item.Cd);
    li.find(".des").text(item.Des);

    return li;
}

function Search_ARARMisura_Template(li, item, key) {

    li.attr("Cd_ARMisura", item.Cd_ARMisura);
    li.find(".cd").html(item.Cd_ARMisura);

    return li;
}

// fnl interamente cambiata
function DOAperti_Template(li, item, key) {
    switch (fU.UpTrim(item.xCd_xMOProgramma)) {
        case 'TI':
        case 'TIMAT':
            li.attr("prgexe", fU.UpTrim(item.xCd_xMOProgramma)).attr("cd_do", "").attr("prgid", item.Id_xMOTR);
            li.find(".cd-do").text("Tra.Int.");
            li.find(".id").text(item.Id_xMOTR);
            li.attr("doinfo", "Tra.Int. nr° " + item.Id_xMOTR + " del " + fU.DateJsonToDate(item.DataDoc).substring(0, 10));
            li.find("span.w3-tag").addClass("w3-green")
            break;
        case 'TR-UBPA':
            li.attr("prgexe", fU.UpTrim(item.xCd_xMOProgramma)).attr("cd_do", "").attr("prgid", item.Id_xMOTR);
            li.find(".cd-do").text("Tra.Ub.Int.");
            li.find(".id").text(item.Id_xMOTR);
            li.attr("doinfo", "Tra.Int. nr° " + item.Id_xMOTR + " del " + fU.DateJsonToDate(item.DataDoc).substring(0, 10));
            li.find("span.w3-tag").addClass("w3-orange")
            break;
        case 'TRMP':
        case 'TRRM':
            li.attr("prgexe", fU.UpTrim(item.xCd_xMOProgramma)).attr("cd_do", "").attr("prgid", item.Id_xMOTR);
            li.find(".cd-do").text("Tra.Prd.");
            li.find(".id").text(item.Id_xMOTR);
            li.attr("doinfo", "Tra.Prd. nr° " + item.Id_xMOTR);
            break;
        case "SM":
            li.attr("prgexe", fU.UpTrim(item.xCd_xMOProgramma)).attr("cd_do", item.Cd_DO).attr("prgid", item.Id_xMOTR);
            li.find(".cd-do").text("SM");
            li.find(".id").text(item.Id_xMOTR);
            li.attr("doinfo", "SM nr° " + item.Id_xMOTR);
            break;
        default:
            li.attr("prgexe", fU.UpTrim(item.xCd_xMOProgramma)).attr("cd_do", item.Cd_DO).attr("prgid", item.Id_xMORL);
            li.find(".cd-do").text(item.Cd_DO);
            li.find(".id").text(item.Id_xMORL);

            var do_info = "";
            do_info = " del " + fU.DateJsonToDate(item.DataDoc).substring(0, 10)
            li.find(".do-info").text($.trim(do_info));

            li.attr("doinfo", item.Cd_DO + " nr° " + item.Id_xMORL + do_info);

            var cf_desc = "";
            cf_desc = item.Cd_CF + " - " + item.CF_Descrizione;
            li.find(".cf-info").text($.trim(cf_desc));

            break;
    }

    if (!fU.IsEmpty(item.ListenerErrore)) {
        li.find(".listnererror").text(item.ListenerErrore);
    }
    li.find(".do-rows-info").text("N° letture " + item.R_Tot + " - " + item.D_Info);

    if (item.Stato == 1) {
        //Documento chiuso ma non ancora creato (non può essere modificato ne eliminato)
        li.addClass("lg-darkgray").removeClass("lg-pointer").find("img").hide();
    }
    else {
        // Se cd_do è vuoto è un trasferimento
        if (fU.IsEmpty(item.Cd_DO)) {
            li.on("click", function () {
                DocAperti_TRClickIt($(this));
            });
        }
        else {
            li.on("click", function () {
                DocAperti_RLClickIt($(this));
            });
        }
    }

    return li;
}

function DORistampa_Template(li, item, key) {

    fU.ShowIf($(li).find(".div-dest"), !fU.IsEmpty(item.Cd_CFDest));

    li.find(".dor-iddotes").text(item.Id_DOTes);
    li.find(".dor-datado").text(fU.DateJsonToDate(item.DataDoc));
    li.find(".dor-cddo").text(item.Cd_DO);
    li.find(".dor-descdo").text(item.DO_Descrizione);
    li.find(".dor-cfdo").html(fU.IfEmpty(item.Cd_CF) + "&nbsp;" + fU.IfEmpty(item.CF_Descrizione));
    li.find(".dor-cfdest").html(item.Cd_CFDest + "&nbsp;" + item.CFDest_Descrizione);

    li.on("click", function () {
        $("#pgDocRistampa label[name='Cd_DO']").text(item.Cd_DO);
        $("#pgDocRistampa label[name='Id_DOTes']").text(item.Id_DOTes);
        $("#pgDocRistampa label[name='Id_xMORL_Edit']").text(item.Id_xMORL);
        Nav.Next();
    });

    return li;
}

// Template doc prelevabili partendo da una DOTes
function DOPrel_Template(tr, item, key) {

    tr.attr("key", item.Id_DOTes);

    //Assegna i filtri alla riga UPPERCASE
    tr.attr("F_Doc", item.F_Doc.toUpperCase()).attr("F_Cd_ARs", item.F_Cd_ARs.toUpperCase());
    //Assegna i valori dei doc 
    tr.find(".ck-documenti").prop("checked", false);
    tr.find(".ck-documento").attr("Id_DOTes", item.Id_DOTes).prop("checked", item.Selezionato);
    tr.find(".Cd_DO").text(item.Cd_DO);
    tr.find(".Descrizione").text(item.Descrizione);
    tr.find(".NumeroDoc").text(item.NumeroDoc);
    tr.find(".DataDoc").text(fU.DateJsonToDate(item.DataDoc));
    tr.find(".Cd_MGEsercizio").text(item.Cd_MGEsercizio);
    //tr.find(".Cd_DOSottoCommessa").text(item.Cd_DOSottoCommessa);

    tr.find(".Cd_DO").on("click", function () {
        // Carica i dati del detail
        Detail_Ajax_xmovs_DOTes(item.Id_DOTes);
        $("#DetailDO").show();
    });

    //Se il documento è già stato prelevato disabilito la riga
    if (!fU.IsNull(item.PrelevatoDa)) {
        // fnl
        tr.addClass("lg-darkgray").find(".ck-documento").removeClass("mo-pointer").prop("disabled", "disabled");
        //Se il documento non è stato prelevato da me è NON PRELEVABILE
        if (item.Selezionato == false) {
            tr.addClass("non-prelevabile");
            tr.find(".container").addClass("w3-hide");
        }
    }
    return tr;
}

// Template di tutti i documenti prelevabili 
function DOPrel_All_Template(li, item, key) {
    fU.ShowIf(li.find(".numerodoc"), !fU.IsEmpty(item.NumeroDoc));
    fU.ShowIf(li.find(".datadoc"), !fU.IsEmpty(item.DataDoc));
    fU.ShowIf(li.find(".dataconsegna"), !fU.IsEmpty(item.DataConsegna));

    li.find(".ck-documento").attr("Id_DOTes", item.Id_DOTes).attr("Cd_DOs", item.Cd_DOs).prop("checked", item.Selezionato);
    // Se il documento è già selezionato perchè fa parte già dei prelievi lo inserisco nel dt
    if (item.Selezionato) {
        oPrg.RL.dtDOSelPR.push(item.Id_DOTes);
    }

    li.find(".id-dotes").text(item.Id_DOTes);
    li.find(".cd-do").text(item.Cd_DO);
    li.find(".do-desc").text(item.DO_Descrizione);
    // Modifica apportata per terminali da 3.2 pollici ### da migliorare in base alle dimensioni dello schermo 
    // Se la desc è troppo lunga scopare il check per selezionare il documento
    li.find(".cd-cf").text(item.Cd_CF + " - " + (item.CF_Descrizione.length > 20 ? item.CF_Descrizione.substring(0, 17) + "..." : item.CF_Descrizione));
    li.find(".numerodoc").html("N.Documento: " + item.NumeroDoc + "&nbsp;&nbsp;&nbsp;");
    li.find(".datadoc").text("DEL: " + fU.DateJsonToDate(item.DataDoc));
    li.find(".dataconsegna").text("CONSEGNA IL: " + fU.DateJsonToDate(item.DataConsegna));

    // Se il doc viene selezionato inserisco l'id nel dt dei doc da prelevare se viene deselezionato lo elimina
    li.find(".ck-documento").change(function () {
        var iddotes = $(this).attr("Id_DOTes");

        if (this.checked) {
            if (oPrg.RL.dtDOSelPR.indexOf(iddotes) == -1)
                oPrg.RL.dtDOSelPR.push(iddotes);
        }
        else {
            var idx = oPrg.RL.dtDOSelPR.indexOf(iddotes);
            if (idx != -1)
                oPrg.RL.dtDOSelPR.splice(idx, 1);
        }

        $("#pgPrelievi .DOSel").text(oPrg.RL.dtDOSelPR.length);
        // Gestione dell'icona deselezionatutto
        if (oPrg.RL.dtDOSelPR.length > 0) {
            $("#pgPrelievi .i-dotescked").attr("src", "icon/Checkbox.svg");
        } else {
            $("#pgPrelievi .i-dotescked").attr("src", "icon/UnCheckbox.svg");
        }

    });

    li.find(".cd-do").on("click", function () {
        // Carica i dati del detail
        Detail_Ajax_xmovs_DOTes(item.Id_DOTes);
        $("#DetailDO").show();
    });

    //Se il documento è già stato prelevato disabilito la riga
    if (!fU.IsNull(item.PrelevatoDa)) {
        // fnl
        li.addClass("lg-darkgray").find(".ck-documento").removeClass("mo-pointer").prop("disabled", "disabled");
        //Se il documento non è stato prelevato da me è NON PRELEVABILE
        if (item.Selezionato == false) {
            li.addClass("non-prelevabile");
            li.find(".container").addClass("w3-hide");
        }
    }

    return li;
}

function pgRLRig_AR_Template(tr, item, key) {
    tr.find('.Cd_ARMisura').on("click", function () {
        pgRLRig_InputData_Load($(this).parent());
    });

    tr.attr("key", key);
    tr.attr("data-cd-ar", item.Cd_AR.trim());
    tr.find(".Cd_AR").text(item.Cd_AR.trim());
    tr.find(".Descrizione").text(item.Descrizione);
    tr.find(".Cd_ARMisura").text(item.Cd_ARMisura);

    if (item.Quantita >= item.QtaEvadibile) {
        tr.find(".Cd_ARMisura").attr("style", "background-color: lightgrey");
    }

    tr.find(".Quantita").text(item.Quantita);
    tr.find(".QtaEvadibile").text(item.QtaEvadibile);
    if (item.Cd_Ar_Class)
        tr.find(".Cd_AR").addClass(item.Cd_Ar_Class.trim());
    return tr;
}

function pgTRRig_P_AR_Template(tr, item, key) {
    tr.find('.Cd_ARMisura').on("click", function () {
        pgTRRig_P_InputData_Load($(this).parent());
    });

    tr.find(".Cd_AR").text(item.Cd_AR);
    tr.find(".Cd_ARLotto").text(fU.ToString(item.Cd_ARLotto));
    tr.find(".Cd_ARMisura").text(item.Cd_ARMisura);
    tr.find(".Quantita").text(item.Quantita);
    tr.find(".Cd_MG_P").text(item.Cd_MG_P);
    return tr;
}

function pgTRRig_A_AR_Template(tr, item, key) {
    tr.attr("Id_xMOTRRig_P", item.Id_xMOTRRig_P);

    tr.find('.Cd_ARMisura').on("click", function () {
        pgTRRig_A_InputData_Load($(this).parent());
    });
    tr.find('.Residua').on("click", function () {
        pgTRRig_A_InputData_Load($(this).parent());
        ActivePage().find('input[name="Quantita"]').val($(this).text());
    });

    tr.find(".Cd_AR").text(item.Cd_AR);
    tr.find(".Cd_ARLotto").text(fU.ToString(item.Cd_ARLotto));
    tr.find(".Cd_ARMisura").text(item.Cd_ARMisura);
    tr.find(".Quantita").text(item.Quantita_A);
    tr.find(".Residua").text(item.Quantita_R)
    tr.find(".Cd_MG_P").text(item.Cd_MG_P);

    return tr;
}

function Detail_Giacenza_Template(tr, item, key) {
    tr.find(".Cd_MG").text(item.Cd_MG);
    tr.find(".Cd_MGUbicazione").text(item.Cd_MGUbicazione);
    tr.find(".Descrizione").text(item.Descrizione);
    tr.find(".Cd_ARLotto").html(fU.ToString(item.Cd_ARLotto) + (item.DataScadenza ? '<br /><span class="w3-blue">' + fU.DateJsonToDate(item.DataScadenza) + '</span>' : ''));
    tr.find(".Cd_DOSottoCommessa").text(item.Cd_DOSottoCommessa);
    tr.find(".Quantita").text(item.Quantita + (item.Quantita_T > 0 ? ' (' + item.Quantita_T + ')' : ''));
    tr.find(".QuantitaDImm").text(item.QuantitaDImm);
    tr.find(".QuantitaDisp").text(item.QuantitaDisp);

    if (tr.xMOTipo === 'P')
        tr.find(".Cd_MGUbicazione").addClass('w3-orange');

    //Bindo il click sulla riga
    $(tr).on("click", function () {
        Detail_Giacenza_Row_Click(item.Cd_ARLotto, item.Cd_MG, item.Cd_MGUbicazione, item.DataScadenza, item.Cd_AR);
    });

    // Colora l'UBI di default  fnl
    if (item.DefaultMGUbicazione)
        tr.find(".ubidefault").removeClass("w3-hide");

    return tr;
}

function Detail_GiacenzaUbicazione_Template(tr, item) {
    tr.find(".Cd_AR").text(item.Cd_AR);
    tr.find(".AR_Descrizione").text(item.AR_Descrizione);
    tr.find(".Cd_ARLotto").text(item.Cd_ARLotto);
    tr.find(".Cd_DOSottoCommessa").text(item.Cd_DOSottoCommessa);
    tr.find(".Quantita").text(item.Quantita + (item.Quantita_T > 0 ? ' (' + item.Quantita_T + ')' : ''));
    //tr.find(".QuantitaDImm").text(item.QuantitaDImm);
    //tr.find(".QuantitaDisp").text(item.QuantitaDisp);
    tr.find(".Cd_ARMisura").text(item.Cd_ARMisura);
    if (item.Quantita <= 0)
        tr.addClass("qta-assente");

    //Bindo il click sulla riga
    $(tr).on("click", function () {
        Detail_GiacenzaUbicazione_Row_Click(item, oPrg.DetailGiacenzaUbicazione._pa);
    });

    return tr;
}

function Detail_Giacenza_Totali() {
    //Rimuovo la riga del totale
    $("#DetailGiacenza .tr-tot").remove();
    //Preparo la riga da aggiungeere
    tr = $("#DetailGiacenza .template.totali").clone().removeAttr("style").addClass("tr-tot");

    //Recupero le righe della tabella
    var rows = Array.prototype.slice.call($("#DetailGiacenza .tr-giac"));
    //Filtro solo le righe visibili
    rows = rows.filter(function (item) { return item.style.display != "none"; });
    //Mappo l'array per avere i valori
    rows = rows.map(function (item) {
        return {
            Quantita: parseInt($(item).find(".Quantita").text()),
            QuantitaDImm: parseInt($(item).find(".QuantitaDImm").text()),
            QuantitaDisp: parseInt($(item).find(".QuantitaDisp").text()),
        }
    });

    //Calcolo i totali
    var totQuantita = rows.length > 0 ? rows.map(function (item) { return item.Quantita }).reduce(function (tot, num) { return tot + num; }) : 0;
    var totQuantitaDImm = rows.length > 0 ? rows.map(function (item) { return item.QuantitaDImm }).reduce(function (tot, num) { return tot + num; }) : 0;
    var totQuantitaDisp = rows.length > 0 ? rows.map(function (item) { return item.QuantitaDisp }).reduce(function (tot, num) { return tot + num; }) : 0;

    //Aggiungo i totali alla riga
    tr.find(".Quantita").text(totQuantita);
    tr.find(".QuantitaDImm").text(totQuantitaDImm);
    tr.find(".QuantitaDisp").text(totQuantitaDisp);

    $("#DetailGiacenza table").append(tr);
}

/*
 * Mostra/nasconde le righe di una tabella filtrando un valore = 0
 * Parametri:
 *      table: oggetto jQuery della tabella (es. $("#table"))
 *      selector: selettore CSS dell'elemento da verificare (es. "tr.tr-giac td.Quantita")
 *      NB: nel selettore escludere il template!!!
 */
function filterZeroRows(table, selector) {
    //Recupero gli element da filtrare
    var items = Array.prototype.slice.call($(table).find(selector));

    //Filtro l'array
    var rows = items.filter(function (item) {
        return item.innerText == "0";
    });

    //Se ci sono righe da filtrare
    if (rows.length > 0) {
        //Flag per mostrare/nascondere
        var display = rows[0].parentElement.style.display == "none";

        //Nascondo le righe filtrate
        rows.forEach(function (item) {
            if (display)
                $(item.parentElement).show();
            else
                $(item.parentElement).hide();
        });
    }
}

function Listener_Moduli_Template(li, item, key) {

    li.attr("RptDocName", item.RptDocName);

    // se check vien selezionato allora si imposta il numero di copie = 1
    li.find(".ck-stampa").on("click", function () {
        if (fU.IsChecked($(this))) {
            var copie = li.find("input[name='NumeroCopie']").val();
            fU.IsEmpty(copie) || fU.ToInt32(copie) == 0 ? li.find("input[name='NumeroCopie']").val("1") : "";
        }
        else
            li.find("input[name='NumeroCopie']").val("");
    });

    li.find("select[name='ListenerDevice']").on("change", function () {
        var copie = $(this).find("option:selected").attr('copie');
        if (fU.IsEmpty(copie)) {
            if (fU.IsChecked(li.find(".ck-stampa")))
                copie = 1;
            else
                copie = '';
        }
        li.find("input[name='NumeroCopie']").val(copie);
    });

    //Imposta la stampante da utilizzare (anche vuoto)
    li.find("select[Name='ListenerDevice']").val(fU.ToString(item.Device));
    //Descrizione del modulo
    li.find(".descrizione").text(item.Descrizione);
    //Copie da eseguire
    li.find("input[name='NumeroCopie']").val(item.NumeroCopie);
    //Attiva/Disattiva la stampa come per il modulo di Arca
    li.find(".ck-stampa").prop("checked", item.NumeroCopie == 0 ? false : true);

    return li;
}

function DetailCF_Template(item) {

    $("#DetailCF .cd-cf").text(item.Cd_CF + ' - ' + item.Descrizione);
    $("#DetailCF .indirizzo").text(fU.ToString(item.Indirizzo));
    $("#DetailCF .localita").text(fU.ToString(item.Localita));
    $("#DetailCF .cap").html(fU.ToString(item.Cap) + "&nbsp;" + fU.ToString(item.Cd_Provincia) + "&nbsp;" + fU.ToString(item.Cd_Nazione));
}

function DetailCFDest_Template(item) {

    fU.ShowIf($("#DetailCFDest .div-indirizzo"), !fU.IsEmpty(item.Indirizzo));
    fU.ShowIf($("#DetailCFDest .div-agente"), !fU.IsEmpty(item.Agente));
    fU.ShowIf($("#DetailCFDest .div-telefono"), !fU.IsEmpty(item.Telefono));

    $("#DetailCFDest .cd-cfdest").text(item.Cd_CFDest + ' - ' + item.Descrizione);
    $("#DetailCFDest .indirizzo").text(fU.ToString(item.Indirizzo));
    $("#DetailCFDest .localita").text(fU.ToString(item.Localita));
    $("#DetailCFDest .cap").html(fU.ToString(item.Cap) + "&nbsp;" + fU.ToString(item.Cd_Provincia) + "&nbsp;" + fU.ToString(item.Cd_Nazione));
    $("#DetailCFDest .agente").text(item.Agente);
    $("#DetailCFDest .telefono").text(item.Telefono);

}

function DetailDOTes_Template(item) {
    var d = $("#DetailDO");

    d.find(".doc-numero").html(item.Cd_DO + "&nbsp;" + item.NumeroDoc + " &nbsp;" + fU.DateJsonToDate(item.DataDoc) + " &nbsp;[" + item.Id_DOTes + "]");
    d.find(".cf-descrizione").html(item.Cd_CF + "&nbsp;" + item.CF_Descrizione);

    d.find(".indirizzo").html(fU.ToString(item.Indirizzo) + "&nbsp;" + fU.ToString(item.Localita) + "&nbsp;" + fU.ToString(item.Cap) + "&nbsp;" + fU.ToString(item.Cd_Provincia) + "&nbsp;" + fU.ToString(item.Cd_Nazione));
    d.find(".cd-mgesercizio").text(item.Cd_MGEsercizio);

    fU.ShowIf(d.find(".div-dataconsegna"), !fU.IsEmpty(item.DataConsegna));
    d.find(".dataconsegna").text(fU.DateJsonToDate(item.DataConsegna));

    fU.ShowIf(d.find(".div-sottocommessa"), !fU.IsEmpty(item.Cd_DOSottoCommessa));
    d.find(".cd-dosottocommessa").text(item.Cd_DOSottoCommessa);

    fU.ShowIf(d.find(".div-riferimento"), !fU.IsEmpty(item.NumeroDocRif));
    d.find(".numerodocrif").text(item.NumeroDocRif);
    d.find(".datadocrif").text(fU.DateJsonToDate(item.DataDocRif));

    fU.ShowIf(d.find(".div-prelevatoda"), !fU.IsEmpty(item.PrelevatoDa));
    d.find(".prelevatoda").text(item.PrelevatoDa);

    fU.ShowIf(d.find(".div-cdpg"), !fU.IsEmpty(item.Cd_PG));
    d.find(".cd-pg").text(item.Cd_PG + " - " + item.Ds_PG);

    fU.ShowIf(d.find(".div-notepiede"), !fU.IsEmpty(item.NotePiede));
    d.find(".notepiede").text(item.NotePiede);

    $("#DetailDO").show();
}

function DetailDORig_Template(tr, item, key, rowname) {
    switch (rowname) {
        case "ROW1":
            //Articolo
            tr.find(".Cd_AR").text(item.Cd_AR);
            tr.find(".Cd_ARLotto").text(item.Cd_ARLotto);
            // Se il programma è pi e il detail è stato chiamato dalla pagina pgrlrig mostro il bottone sull'um nella griglia del detail
            if (oPrg.ActivePageValue == enumPagine.pgRLRigID) {
                tr.find(".col-armisura").hide();
                tr.find(".btn-armisura").show().on("click", function () {
                    var e = jQuery.Event("keypress");
                    e.which = 13; //choose the one you want
                    e.keyCode = 13;
                    ActivePage().find("input[name='xMOBarcode']").val(item.Id_DORig).focus().trigger(e);
                    HideAndFocus('DetailDO');
                });

            } else {
                tr.find(".btn-armisura").hide();
                tr.find(".col-armisura").show();
            }
            tr.find(".Cd_ARMisura").text(item.Cd_ARMisura);
            tr.find(".QtaEvadibile").text(item.QtaEvadibile);
            break;
        case "ROW2":
            tr = "<tr class = 'tr-dorig w3-small'> <td colspan='4'>" + item.Descrizione + "</td></tr > ";
            break;
    }

    return tr;
}

function xMORLRig_Totali_Template(row) {
    var p = $("#" + oPrg.ActivePageId);

    p.find(".ar-totali").text(row.Ar_Totali);
    p.find(".ar-prelievo").text(row.Ar_Prelievo);
    p.find(".ar-noncongrui").text(row.Ar_NonCongrui);
    p.find(".ar-fuorilista").text(row.Ar_Fuorilista);

    p.find(".div-card").removeClass("lg-br-orange");

    // Se ci sono articoli non congrui la card corrispondente verrà messa in arancione
    if (row.Ar_NonCongrui > 0) { p.find(".div-noncongrui").addClass("lg-br-orange"); }

}

function DetailRLRig_Template(li, item, key) {

    fU.ShowIf(li.find(".div-operatore"), (item.Cd_Operatore == oApp.Cd_Operatore ? false : true));
    fU.ShowIf(li.find(".div-mgp"), !fU.IsEmpty(item.Cd_MG_P));
    fU.ShowIf(li.find(".ubip"), !fU.IsEmpty(item.Cd_MGUbicazione_P));
    fU.ShowIf(li.find(".div-mga"), !fU.IsEmpty(item.Cd_MG_A));
    fU.ShowIf(li.find(".ubia"), !fU.IsEmpty(item.Cd_MGUbicazione_A));
    fU.ShowIf(li.find(".div-lotto"), !fU.IsEmpty(item.Cd_ARLotto));
    fU.ShowIf(li.find(".div-matricola"), !fU.IsEmpty(item.Matricola));
    fU.ShowIf(li.find(".div-quantita"), !fU.IsEmpty(item.Quantita));
    fU.ShowIf(li.find(".div-barcode"), !fU.IsEmpty(item.Barcode));

    li.find(".num").text(key + 1);
    li.find(".id-rig").text(item.Id_xMORLRig);
    li.find(".cd-operatore").text(item.Cd_Operatore);
    li.find(".ar-cddesc").text(item.Cd_AR + " - " + item.Descrizione);
    li.find(".dataora").text(fU.DateJsonToTime(item.DataOra));
    li.find(".cd-mg-p").text(item.Cd_MG_P);
    li.find(".cd-mgubicazione-p").text(fU.ToString(item.Cd_MGUbicazione_P));
    li.find(".cd-mg-a").text(item.Cd_MG_A);
    li.find(".cd-mgubicazione-a").text(fU.ToString(item.Cd_MGUbicazione_A));
    li.find(".cd-arlotto").text(item.Cd_ARLotto);
    li.find(".quantita").html(item.Quantita + "&nbsp;" + item.Cd_ARMisura);
    li.find(".matricola").text(item.Matricola);
    li.find(".barcode").text(item.Barcode);

    li.find(".delete").on("click", function () {
        $("#Popup_Del_Lettura").attr("Id_Del", item.Id_xMORLRig).show();
    });

    //Non posso editare in GP
    if (oPrg.Key != "GP") {
        li.find(".edit").on("click", function () {
            $("#Popup_Edit_Lettura").attr("Key_Edit", key).show();
        });
    } else {
        li.find(".edit").remove();
    }

    return li;
}

function DetailTRRig_P_Template(li, item, key) {

    fU.ShowIf(li.find(".div-operatore"), (item.Cd_Operatore == oApp.Cd_Operatore ? false : true));
    fU.ShowIf(li.find(".div-mgp"), !fU.IsEmpty(item.Cd_MG_P));
    fU.ShowIf(li.find(".ubip"), !fU.IsEmpty(item.Cd_MGUbicazione_P));
    fU.ShowIf(li.find(".div-lotto"), !fU.IsEmpty(item.Cd_ARLotto));
    fU.ShowIf(li.find(".div-quantita"), !fU.IsEmpty(item.Quantita));

    // Nascondo i campi del detail perchè nei trasferimenti di partenza non vengono gestiti
    fU.ShowIf(li.find(".div-mga"), false);
    fU.ShowIf(li.find(".ubia"), false);
    fU.ShowIf(li.find(".div-matricola"), false);
    fU.ShowIf(li.find(".div-barcode"), false);

    li.find(".id-rig").text(item.Id_xMOTRRig_P);
    li.find(".cd-operatore").text(item.Cd_Operatore);
    li.find(".ar-cddesc").text(item.Cd_AR + " - " + item.Descrizione);
    li.find(".dataora").text(fU.DateJsonToTime(item.DataOra));
    li.find(".mgp-ubip").text(item.Cd_MG_P);
    li.find(".cd-mgubicazione-p").text(fU.ToString(item.Cd_MGUbicazione_P));
    li.find(".cd-arlotto").text(item.Cd_ARLotto);
    li.find(".quantita").html(item.Quantita + "&nbsp;" + item.Cd_ARMisura);

    li.find(".delete").on("click", function () {
        $("#Popup_Del_Lettura").attr("Id_Del", item.Id_xMOTRRig_P).show();
    });

    return li;
}

function DetailTRRig_A_Template(li, item, key) {

    fU.ShowIf(li.find(".div-operatore"), (item.Cd_Operatore == oApp.Cd_Operatore ? false : true));
    fU.ShowIf(li.find(".div-mga"), !fU.IsEmpty(item.Cd_MG_A));
    fU.ShowIf(li.find(".ubia"), !fU.IsEmpty(item.Cd_MGUbicazione_A));
    fU.ShowIf(li.find(".div-quantita"), !fU.IsEmpty(item.Quantita));

    // Nascondo i campi del detail perchè nei trasferimenti di partenza non vengono gestiti
    fU.ShowIf(li.find(".div-mgp"), false);
    fU.ShowIf(li.find(".ubip"), false);
    fU.ShowIf(li.find(".div-matricola"), false);
    fU.ShowIf(li.find(".div-barcode"), false);
    fU.ShowIf(li.find(".div-lotto"), false);

    li.find(".id-rig").text(item.Id_xMOTRRig_A);
    li.find(".cd-operatore").text(item.Cd_Operatore);
    li.find(".ar-cddesc").text(item.Cd_AR + " - " + item.Descrizione);
    li.find(".dataora").text(fU.DateJsonToTime(item.DataOra));
    li.find(".mgp-ubia").text(item.Cd_MG_A);
    li.find(".cd-mgubicazione-a").text(fU.ToString(item.Cd_MGUbicazione_A));
    li.find(".quantita").html(item.Quantita + "&nbsp;" + item.Cd_ARMisura);

    li.find(".delete").on("click", function () {
        $("#Popup_Del_Lettura").attr("Id_Del", item.Id_xMOTRRig_A).show();
    });

    return li;
}

function xMOTRRig_Totali_Template(row) {

    var p = $("#" + oPrg.ActivePageId);

    p.find(".ar-totali").text(row.Ar_Totali);
    p.find(".ar-incompleti").text(row.Ar_Incompleti);
}

// Carica nel select di pgPrelievi i tipi di documenti che posso creare 
// in base ai doc selezionati per il prelievo
function Select_Cd_DO_Template(ck) {
    var p = "#" + oPrg.ActivePageId;

    //Caricamento documenti generabili
    var docs = $(ck).attr("Cd_DOs").split(",");
    var find = false;

    if (docs.length > 0) {
        for (var i = 0; i < docs.length; i++) {
            $(p).find("select[name='Cd_DO'] option").each(function () {
                if ($(this).val() == docs[i])
                    find = true;
            });

            if (!find) {
                $(p).find("select[name='Cd_DO']").append($('<option>', {
                    value: docs[i],
                    text: docs[i],
                    class: "op-cddo"
                }));
            }
        }
    }
}

function DetailPackingList_ULAR_Template(tr, item, key) {

    tr.attr("Id_xMORLRig", item.Id_xMORLRig);
    tr.attr("Id_xMORLRigPackList", item.Id_xMORLRigPackList);

    tr.find(".Cd_AR").text(item.Cd_AR);
    tr.find(".Qta").text(item.Qta);
    tr.find(".Cd_ARMisura").text(item.Cd_ARMisura);
    tr.find(".PesoNettoKg").text(item.PesoNettoKg);
    tr.find(".PesoLordoKg").text(item.PesoLordoKg);
    tr.find(".VolumeM3").text(item.VolumeM3);

    // fnl i --> img
    tr.find("img").on("click", function () {
        Popup_PKListAR_DelShift_Load(tr);
    });

    return tr;
}

function xMOIN_Aperti_Template(li, item, key) {

    li.attr("Id_xMOIN", item.Id_xMOIN);

    li.find(".id").text(item.Id_xMOIN);
    // fnl
    // li.find(".cd_mgesercizio").text(item.Cd_MGEsercizio);
    li.find(".mges_descrizione").text(item.MGES_Descrizione);
    li.find(".cd_mg").text("Magazzino: " + item.Cd_MG);
    li.find(".cd_mgubicazione").text("Ubicazione: " + fU.ToString(item.Cd_MGUbicazione));
    li.find(".dataora").text(fU.DateJsonToTime(item.DataOra));

    li.on("click", function () {
        INAperti_ClickIt($(this));
    });

    return li;
}

// Aggiunge il nuovo packlistref creato al select della pagina corrente
function xMORLPackListRef_Add_Client(pklRef, pklRef_P) {

    var find = false;

    // Verifica se il pklRef esiste già nel select
    ActivePage().find("select[name='PackListRef']").find('option').each(function () {
        if ($(this).val() == pklRef) {
            find = true;
            return find;
        }
    });

    // Se non esiste lo aggiungo
    if (!find) {
        var opt;
        opt = $('<option>', {
            class: "op-pklref"
            , value: pklRef
            , text: pklRef
        });
        opt.attr('data-pklref_p', pklRef_P);
        ActivePage().find(" select[name='PackListRef']").prepend(opt);
    }

}

function pgRLPK_Template() {

    var pklref = oPrg.PK.dtxMORLPK[oPrg.PK.idx];
    var key = oPrg.PK.idx;
    var length = oPrg.PK.dtxMORLPK.length;


    var p = $("#pgRLPK");

    p.find(".NRow").text((key + 1) + "/" + length);

    p.find(".PackListRef").text(pklref.PackListRef);
    p.find(".Cd_xMOUniLog").text(!fU.IsEmpty(pklref.Cd_xMOUniLog) ? pklref.Cd_xMOUniLog : 'Nessuno');
    p.find("input[name='PesoTaraMks']").val(pklref.PesoTaraMks);
    p.find("input[name='PesoNettoMks']").val(pklref.PesoNettoMks);
    p.find("input[name='PesoLordoMks']").val(pklref.PesoLordoMks);
    p.find("input[name='AltezzaMks']").val(pklref.AltezzaMks);
    p.find("input[name='LunghezzaMks']").val(pklref.LunghezzaMks);
    p.find("input[name='LarghezzaMks']").val(pklref.LarghezzaMks);

}

function xMOGiacenza_Template(tr, item, key) {

    tr.find(".argiac-dosottocommessa").text(fU.ToString(item.Cd_DOSottoCommessa));
    tr.find(".argiac-arlotto").text(fU.ToString(item.Cd_ARLotto));
    tr.find(".argiac-mgubicazione").text(fU.ToString(item.Cd_MGUbicazione));
    tr.find(".argiac-quantita").text(fU.IfEmpty(item.Quantita, 0));
    tr.find(".argiac-armisura").text(fU.ToString(item.Cd_ARMisura));

    tr.on("click", function () {
        // Inserisce i dati della riga selezionata nei campi di input
        pgINRig_RigDataIntoInput(item);
        Detail_pgINRig_AR_New();
    });

    return tr;
}

function pgTRMP_P_Template(tr, item, key) {

    tr.attr("Cd_AR", item.Cd_AR);
    tr.attr("Id_DOTes", item.Id_DOTes);
    tr.attr("Id_DORig_P", item.Id_DORig_P);
    tr.attr("P_From", item.P_From);
    tr.attr("P_To", item.P_To);

    tr.find(".DocRif").html(fU.ToString(item.DocRif) + " [" + item.Cd_xMOLinea + "]<br> " + fU.DateJsonToShortDate(item.DataDoc));
    tr.find(".Cd_AR").text(fU.ToString(item.Cd_AR));
    tr.find(".Descrizione").text(fU.ToString(item.Descrizione));
    //tr.find(".Cd_xMOLinea").text(item.Cd_xMOLinea);
    tr.find(".Quantita").text(fU.IfEmpty(item.QtaEvasa, 0) + "/" + fU.IfEmpty(item.Quantita, 0));
    tr.find(".Cd_ARMisura").text(fU.ToString(item.Cd_ARMisura));
    item.InCarico ? tr.find(".InCarico img").show() : tr.find(".InCarico img").hide();

    tr.on("click", function () {

        //oPrg.TRMP.DocRifP = $(this).attr("DocRif");
        oPrg.TRMP.DocRif = item.DocRif;
        oPrg.TRMP.Id_DOTes = item.Id_DOTes;
        oPrg.TRMP.Id_DORig_P = item.Id_DORig_P;
        oPrg.TRMP.P_From = item.P_From;
        oPrg.TRMP.P_To = item.P_To;

        // Va alla pagina successiva dove vengono visualizzati i C del P selezionato
        Nav.Next();
    });

    return tr;
}

function pgTRMP_P_Desc_Template(tr, item, key) {
    tr.attr("Cd_AR", item.Cd_AR);
    tr.attr("Id_DOTes", item.Id_DOTes);
    tr.attr("Id_DORig_P", item.Id_DORig_P);

    tr.find(".Descrizione").text(item.Descrizione);

    return tr;
}

function pgTRMP_C_AR_Template(tr, item, key) {

    tr.attr("Cd_AR", item.Cd_AR);
    tr.attr("Id_DOTes", item.Id_DOTes);
    tr.attr("Id_DORig_C", item.Id_DORig);
    tr.attr("InCarico", item.InCarico);
    tr.attr("key", key);

    //tr.find(".Riga").text(fU.ToString(item.Riga) + " - ");
    tr.find(".Cd_AR").text(fU.ToString(item.Cd_AR));
    tr.find(".Descrizione").text(fU.ToString(item.Descrizione));
    tr.find(".Cd_ARLotto").text(fU.ToString(item.Cd_ARLotto));
    tr.find(".Cd_MG").text(fU.ToString(item.Cd_MG));
    tr.find(".Cd_MGUbicazione").text(fU.ToString(item.Cd_MGUbicazione));
    tr.find(".Quantita").text(item.QtaTrasferita + "/" + item.Qta);
    if (item.QtaTrasferita >= item.Qta) {
        tr.css("background-color", "#86C486").attr("completo", "true");
    }
    tr.find(".Cd_ARMisura").text(fU.ToString(item.Cd_ARMisura));
    item.InCarico ? tr.find(".InCarico img").show() : tr.find(".InCarico img").hide();

    //Se l'articolo e lotto sono gli ultimi salvati la riga è gialla
    if (oPrg.TRMP.Last_Cd_AR == item.Cd_AR && oPrg.TRMP.Last_Cd_ARLotto == item.Cd_ARLotto)
        tr.css("border", "1px solid red");

    //Se l'articolo è ubicato sul magazzino materie prime lo scrive in grassetto
    if (item.Cd_MG != oApp.xMOImpostazioni.PrdCd_MG) {
        tr.find(".Cd_MG").addClass("w3-text-blue");
        tr.find(".Cd_AR").addClass("w3-text-blue");
    }

    tr.on("click", function () {
        oPrg.TRMP.Id_DORig_C = $(this).attr("Id_DORig_C");
        if (!fU.ToBool($(this).attr("InCarico"))) {
            Ajax_xmosp_xMOTR_MP_Save();
            SetFocus();
        } else {
            PopupMsg_Show("ERRORE", 1, "Impossibile continuare: componente già in carico ad un altro operatore!");
        }
    });

    return tr;
}

function Detail_NotePiede_Template(li, item, key) {

    li.find(".do-info").html(item.Descrizione);
    li.find(".notepiede").text(item.Nota);

    return li;
}
// -------------------------------------------------
// #1.60 REGION: CLEAR PAGE
// -------------------------------------------------

function pgRLRig_Clear() {

    // Se presente un edit lo annulla
    oPrg.RL.Id_xMORLRig_Edit = 0;
    oPrg.RL.StepCtrl = 1;
    ActivePage().find("label.ar-aa").removeClass("w3-green");

    // Reset valori dei campi ||| ATTENZIONE --> uno alla volta perché alcuni non vanno svuotati!!
    ActivePage().find("input[name='Cd_AR']").val("");
    ActivePage().find("input[name='Quantita']").val("");
    ActivePage().find("input[name='Cd_ARLotto']").val("");
    ActivePage().find("input[name='Cd_MGUbicazione_P']").val("");
    ActivePage().find("input[name='Cd_MGUbicazione_A']").val("");
    ActivePage().find("input[name='DataScadenza']").val("");
    ActivePage().find("input[name='Matricola']").val("");
    ActivePage().find("input[name='Cd_DOSottoCommessa']").val("");
    ActivePage().find(".op-um").remove();
    ActivePage().find(".ar-aa").text("");
    ActivePage().find(".ar-qta-info").text("");
    ActivePage().find(".descrizione").text("");
    ActivePage().find(".giaccontabile").text("");
    ActivePage().find("select[name='Cd_ARMisura'] .op-um").remove();
    // Svuota i campi personalizzati
    ActivePage().find(".div-extfld-pers input").val("");
    // Assegna i default
    var extflddef = ActivePage().find('.div-extfld-pers input[data-default]:not([data-default=""])');
    $(extflddef).each(function (i, inp) {
        switch ($(inp).attr("data-default")) {
            case 'now()':
                $(inp).val(fU.DateToInput(new Date()));
                break;
            default:
                $(inp).val($(inp).attr("data-default"));
                break;
        }
    });

    // Se la sottocommessa è stata selezionata sulla testa la imposto nuovamente nel campo
    ActivePage().find("input[name='Cd_DOSottoCommessa']").val(oPrg.drRL.Cd_DOSottoCommessa);

    // Se c'è il barcode (e vi sono bc da ciclare) seleziona il primo secondo la codifica
    Barcode_SelByPos("1", "1");

    SetFocus();
}

function pgTRRig_PA_Clear() {

    // Reset valori dei campi ||| ATTENZIONE --> uno alla volta perché alcuni non vanno svuotati!!
    ActivePage().find("input[name='Cd_AR']").val("");
    ActivePage().find("input[name='Quantita']").val("");
    ActivePage().find("input[name='Cd_ARLotto']").val("");
    ActivePage().find("input[name='DataScadenza']").val("");
    ActivePage().find(".op-um").remove();
    ActivePage().find(".ar-aa").text("");
    ActivePage().find(".descrizione").text("");
    ActivePage().find("select[name='Cd_ARMisura'] .op-um").remove();
    ActivePage().find("input[name='Cd_MGUbicazione_P']").val("");
    ActivePage().find("input[name='Cd_MGUbicazione_A']").val("");
    ActivePage().find("input[name='Cd_DOSottoCommessa']").val("");

    // Se c'è il barcode (e vi sono bc da ciclare) seleziona il primo secondo la codifica
    Barcode_SelByPos("1", "1");

    SetFocus();

}

function pgRLRigID_Clear() {
    var p = "#" + oPrg.ActivePageId;

    $(p).find(".lb-idriga").text("");
    $(p).find("input[name='xMOBarcode']").val("");
    $(p).find("input[name='Id_DORig']").val("");
    $(p).find("input[name='Cd_AR']").val("");
    $(p).find("input[name='Quantita']").val("");
    $(p).find("input[name='Cd_ARLotto']").val("");
    $(p).find("input[name='Cd_DOSottoCommessa']").val("");
    $(p).find("input[name='DataScadenza']").val("");
    $(p).find("input[name='Matricola']").val("");
    $(p).find(".op-um").remove();
    $(p).find(".ar-aa").text("");
    $(p).find(".descrizione").text("");
    $(p).find("select[name='Cd_ARMisura'] .op-um").remove();
    $(p).find(".div-extfld-pers input").val("");

    SetFocus();
}

function pgPrelievi_ClearFilter() {
    var p = "#" + oPrg.ActivePageId;
    $(p).find(".div-filtri input").val("");

    Ajax_xmofn_DOTes_Prel_4PR();
}

function pgSM_Clear() {
    //Reset campi form
    $("#pgSM").find(".Id_xMOTR, .Id_xMOTRRig_P, .Cd_xMOMatricola, .Cd_AR, .AR_Descrizione, .Cd_ARLotto, .DataScadenza, .Cd_MG_A, .Cd_MGUbicazione_A").text("");
    $("#pgSM input[name='Cd_MGUbicazione_A'], #pgSM input[name='Cd_xMOMatricola'] ").val("");
    fU.CheckIf($("#pgSM .ck-xMOCompleta"), false);
    $("#pgSM .div-infosscc").hide();
    // Se stocco e ubico devo tornare indietro
    if (!oApp.CPIeUbica) {
        $("#pgSM .div-sscc").show();
        SetFocus();
    }
}

// -------------------------------------------------
// ENDREGION: CLEAR PAGE
// -------------------------------------------------

// -------------------------------------------------
// #1.80 REGION: EVENTI KEYPRESS
// -------------------------------------------------

function KeyPress_Execute(keycode, input) {
    if (keycode == '13') {    //INVIO
        var err = false;
        switch (oPrg.ActivePageValue) {
            case enumPagine.pgSP:
                switch (input.attr("name")) {
                    case "Cd_xMOCodSpe":
                        //Filtra la spedizione
                        Spedizione_Load();
                        break;
                    case "Id_DOTes":
                        //Seleziona in automatico la lista di carico 
                        if (!fU.IsEmpty($(input).val())) {
                            Spedizione_Check_SP($(input).val());
                        }
                        break;
                    default:
                        err = true;
                        break;
                }
                break;
            default:
                //evento invio non gestito per la pagina
                err = true;
                break;
        }
        if (err) PopupMsg_Show("ERRORE", 1, "Errore di gestione del KeyPress_Execute() del campo " + input.attr("name"));
    }
}

//  Gestione keypress su Barcode
//  e = keycode
//  imp = imput barcode
//  sel = select del tipo di barcode
function Barcode_Enter(inp, sel) {

    //Memorizza il barcode letto
    var barcode = $(inp).val().trim();

    if (!fU.IsEmpty(barcode)) {
        // Se il bc interpretato corrisponde alla stringa |CONF| abilito o disabilito il check di autoconferma
        if (barcode.toUpperCase() == "CONF") {
            $(".ck-autoconfirm").prop("checked") == true ? $(".ck-autoconfirm").prop("checked", false) : $(".ck-autoconfirm").prop("checked", true);
            SetFocus("xMOBarcode");
            return;
        }
        // Se il bc interpretato corrisponde alla stringa |SAVE| abilito o disabilito il check di autoconferma
        if (barcode.toUpperCase() == "SAVE") {
            setTimeout(function () { ActivePage().find(".btn-confirm").click(); }, 450);
            return;
        }

        var interpreterCallback = function () {
            // Reset del valore del campo BC
            $(inp).val("");
            var pos = $(sel).find("option:selected").attr("pos"); //posizione attuale del bc
            var num = $(sel).find("option:selected").attr("num"); //numero corrente bc
            //Verifica se esistono altri Bc (maggiori di ZERO) con la stessa posizione (cicla tra i bc configurati)
            if (pos > 0 && Barcode_SelByPos(pos, fU.ToInt32(num) + 1)) {
                //Focus sul bc
                $(inp).focus().select();
            }
            // Terminati i barcode da ciclare se ho il check confirm automatico attivo effettuo il click del conferma
            else {
                var confirm = false;
                confirm = fU.IsChecked(("#" + oPrg.ActivePageId + " .ck-autoconfirm"));
                //se la quantità è vuota si ferma sul campo
                if (fU.IsEmpty(ActivePage().find("input[name='Quantita']").val()))
                    setTimeout(function () { ActivePage().find("input[name='Quantita']").focus(); }, 250);

                //Conferma automatica
                if (confirm && !fU.IsEmpty(ActivePage().find("input[name='Quantita']").val())) {
                    setTimeout(function () { ActivePage().find(".btn-confirm").click(); }, 450);
                }
            }
        }

        var bc_ok = false;
        switch (oPrg.ActivePageValue) {
            case enumPagine.pgRLRig:
            case enumPagine.pgRLRigID:
            case enumPagine.pgTRRig_P:
            case enumPagine.pgTRRig_A:
            case enumPagine.pgINM2Rig:
                var id_lettura = -1;
                //Se il barcode è di tipo Detail lo aggiunge alla lista e ne gestisce l'UI
                if (oPrg.BC.CurrentBC && oPrg.BC.CurrentBC.Detail) {
                    id_lettura = Barcode_Detail_AddBc(barcode);
                }
                //Interpreta il barcode letto
                Barcode_Interpreter(barcode, id_lettura, function () {
                    interpreterCallback();
                });
                break;
            case enumPagine.pgAA:
                //Interpreta il barcode letto
                bc_ok = Barcode_Interpreter_Alias(barcode);
                // Imposto il focus sul bottone inserisci
                $("#pgAA").find("button").focus().select();
                break;
            default:
                //evento invio non gestito!
                break;
        }

        //Gestione del focus after lettura bc ..........................................
        if (bc_ok) {
            interpreterCallback();
        }
    }
}

// -------------------------------------------------
// ENDREGION: Eventi KeyPress
// -------------------------------------------------
// -------------------------------------------------
// #1.90 REGION: EXECUTE
// -------------------------------------------------

function Filtro_Execute(input, val, select_first) {

    // Il val passato alla funzione è quello di 500 millisecondi fa...
    // JQuery recupera il val attuale dell'imput e viene confrontato con iol vecchio...
    // SEEE I VALORI COINCIDONO significa che l'operatore si è fermato a digitare: filtro

    if (val == $(input).val()) {

        var filterkey = input.attr('filterkey');

        //Assegno alla varibile filtro corrente il valore in modo da utilizzarlo in tutte le ricerche lato server
        oPrg.ActiveSearchValue = val;
        //Filtri lato Server
        switch (filterkey) {
            case 'DocAperti_DO':
                Ajax_xmofn_DOAperti();
                break;
            case 'DocRistampa_DO':
                Ajax_xmofn_DORistampa();
                break;
            case 'Search_AR':
                Search_Ajax_xmofn_AR();
                break;
            case 'Search_ARLotto':
                Search_Ajax_xmofn_ARLotto();
                break;
            case 'Search_CF':
                Search_Ajax_xmofn_CF();
                break;
            case 'Search_CFDest':
                Search_Ajax_xmofn_CFDest();
                break;
            case 'Search_MG':
                Search_Ajax_xmofn_MG();
                break;
            case 'Search_MGUbi':
                Search_Ajax_xmofn_MGUbicazione();
                break;
            case 'Search_DOSdTAnag':
                switch (oPrg.ActiveSearchContext) {
                    case "Caricatore":
                        Search_Ajax_xmofn_DOSdTAnag('DOCaricatore');
                        break;
                    case 'Committente':
                        Search_Ajax_xmofn_DOSdTAnag('DoCommittente');
                        break;
                    case 'Luogo Carico':
                        Search_Ajax_xmofn_DOSdTAnag('DoLuogoCarico');
                        break;
                    case 'Luogo Scarico':
                        Search_Ajax_xmofn_DOSdTAnag('DoLuogoScarico');
                        break;
                    case 'Proprietario Merce':
                        Search_Ajax_xmofn_DOSdTAnag('DoProprietarioMerce');
                        break;
                }
                break;
            case 'Search_CdDes':
                switch (oPrg.ActiveSearchContext) {
                    case "Trasporto":
                        Search_Ajax_xmofn_CdDes('DoTrasporto');
                        break;
                    case 'Spedizione':
                        Search_Ajax_xmofn_CdDes('DoSped');
                        break;
                    case 'Porto':
                        Search_Ajax_xmofn_CdDes('DoPorto');
                        break;
                    case 'Aspetto Beni':
                        Search_Ajax_xmofn_CdDes('DoAspBene');
                        break;
                }
                break;
            case 'Search_DOSC':
                Search_Ajax_xmofn_xMODOSottoCommessa();
                break;
            case 'Search_xMOCodSpe':
                Search_Ajax_xmofn_Spedizione();
                break;
            case "SearchCd_DoVettore":
                Search_Ajax_xmofn_DoVettore();
                break;
        }

        //Filtri lato client
        var filterval = input.val().toUpperCase();    //Il valore da ricercare deve essere sempre in maiuscolo lato client!
        var selettore = (fU.IsEmpty(filterval) ? "!=" : "*=");
        switch (filterkey) {
            case 'Prelievi_DO':
                Prelievi_DO_Filtro(selettore, filterval);
                break;
            case 'Prelievi_AR':
                Prelievi_AR_Filtro(selettore, filterval);
                break;
        }

        if (select_first) {
            var li = $("#" + oPrg.ActiveSearchId + " .li-search:first");
            if (!fU.IsEmpty($(input).val()) && !fU.IsEmpty(li.attr(oPrg.ActiveSearchOutField))) {
                Search_Close(li);
            }
        }

    }
}

// -------------------------------------------------
// ENDREGION: Execute
// -------------------------------------------------
// -------------------------------------------------
// #2.00 REGION: COMANDI LISTENER 
// -------------------------------------------------

function Popup_ListenerTesting_Load() {

    var p = $("#Popup_ListenerTesting");

    $(p).find(".op-listener").remove();

    //Verifico che il dt abbia delle righe
    if (oApp.dtxMOListener.length > 0) {
        for (var i = 0; i < oApp.dtxMOListener.length; i++) {
            $(p).find("select[name = 'Listener']").append($('<option>', {
                class: "op-listener",
                value: oApp.dtxMOListener[i].Cd_xMOListener,
                text: oApp.dtxMOListener[i].Cd_xMOListener,
                idx: i
            }));
        }
        // Seleziona il listener corrente (quello salvato nella variabile globale) 
        $(p).find("select[name='Listener']").val(oApp.dtxMOListener[oApp.ActiveListenerIdx].Cd_xMOListener);
    }
    $("#Popup_ListenerTesting").show();
}

function Listener_Testing() {
    var cmd = '{MS= ' + $("#Popup_ListenerTesting select[name='Listener']").val() + ' ;}';
    Ajax_ListenerCoda_Add(cmd, 0, 0, $("#Popup_ListenerTesting select[name='Listener']").val());
    $("#Popup_ListenerTesting").hide();
    PopupMsg_Show("MESSAGGIO", 1, "Verificare in Arca nella maschera del listener o nella coda, se la comunicazione è andata a buon fine");
}

function Listener_Sel_Idx(select, refresh_devices) {

    //Seleziona il listener corrente dal select
    oApp.ActiveListenerIdx = $(select).find(":selected").attr("idx");

    if (refresh_devices) {
        // Svuota il select
        $(select).empty();
        //Aggiorna la lista dei devices associati al listener
        Ajax_xmofn_xMOListenerDevice();
    }
}

// Aggiunge i comandi alla coda del listener
function Ajax_ListenerCoda_Add(cmd, Id_xMORL2Close, Id_xMOTR2Close, Listener) {
    var out = false;
    Params = JSON.stringify({
        Terminale: oApp.Terminale
        , Cd_Operatore: oApp.Cd_Operatore
        , Cd_xMOListener: fU.IsEmpty(Listener) ? oApp.dtxMOListener[oApp.ActiveListenerIdx].Cd_xMOListener : Listener
        , Comando: cmd //salva //"PM=" + Stato.DO[Stato.idxDO].Cd_DO + ",1,PrimoPDF}",  //salva e stampa documento
        , Id_xMORL2Close: fU.ToInt32(Id_xMORL2Close)
        , Id_xMOTR2Close: fU.ToInt32(Id_xMOTR2Close)
    });
    $.ajax({
        url: "Logistica.aspx/ListenerCoda_Add",
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
                PopupMsg_Show("ERRORE", r[0].Result, r[0].Messaggio);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
    return out;
}

// Mette in ascolto il listener
function Ajax_Listener_WakeUp(Id_xMOListenerCoda) {
    // Invia il comando solo le la porta è stata configurata
    if (fU.ToInt32(oApp.dtxMOListener[oApp.ActiveListenerIdx].ListenPort) > 0) {
        Params = JSON.stringify({
            IP: oApp.dtxMOListener[oApp.ActiveListenerIdx].IP,
            Port: oApp.dtxMOListener[oApp.ActiveListenerIdx].ListenPort,
            Id_xMOListenerCoda: Id_xMOListenerCoda
        });
        $.ajax({
            url: "Logistica.aspx/ListenerCoda_WakeUp",
            async: false,
            data: Params,
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                return true;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
            }
        });
    }
}

// Creazione del comando di Salvataggio
function Listener_TRSave(Id_xMOTR) {
    var cmd = '{CT=' + Id_xMOTR + ';}';
    return cmd;
}

// Creazione del comando di Salvataggio
function Listener_RLSave(Id_xMORL) {
    var cmd = '{CD=' + Id_xMORL + ';}';
    return cmd;
}

// Creazione del comando di Stampa  
function Listener_RLRePrint(Id_DOTes, ulModuli) {
    //comando da eseguire
    var cmd = ''
    ulModuli = $(ulModuli).find(".li-modulo");
    $(ulModuli).each(function (i, li) {
        //Se il modulo è da stampare
        if ($(li).find(".ck-stampa").is(":checked") && $(this).find("input[name='NumeroCopie']").val() > 0) {
            cmd += "PD=" + Id_DOTes + ","   //Print Document CON Id_DOTes
            cmd += $(li).attr("RptDocName") + ","    //Modulo di stampa
            cmd += $(this).find("input[name='NumeroCopie']").val() + ","       //Numero copie
            //se la stampante è definita aggiungo il comando, altrimenti errore
            if (!fU.IsEmpty($(li).find("select[name='ListenerDevice']").val())) {
                cmd += $(this).find("select[name='ListenerDevice']").val() //Device di stampa
            } else {
                //Stampante di DEFAULT!!
            }
            cmd += ";";
        }
    });
    //Completo il comando se valido
    cmd = (!fU.IsEmpty(cmd) ? '{' + cmd + '}' : '');
    return cmd;
}

// Creazione del comando di Salva e Stampa
function Listener_RLSaveAndPrint(Id_xMORL, liModuli) {
    //comando da eseguire 
    //CREAZIONE
    var cmd = '{CD=' + Id_xMORL + ';';
    //STAMPA
    $(liModuli).each(function (idx, li) {
        //Se il modulo è da stampare
        if (fU.ToBool($(li).find(".ck-stampa").is(":checked")) && fU.ToInt32($(li).find("input[name='NumeroCopie']").val()) > 0) {
            cmd += "PD=,";   //Print Document SENZA Id_DOTes
            cmd += $(li).attr("RptDocName") + ",";    //Modulo di stampa
            cmd += $(li).find("input[name='NumeroCopie']").val() + ",";       //Numero copie
            //se la stampante è definita aggiungo il comando, altrimenti errore
            if (!fU.IsEmpty($(li).find("select[name='ListenerDevice']").val())) {
                cmd += $(this).find("select[name='ListenerDevice']").val(); //Device di stampa
            } else {
                //Stampante di DEFAULT!!
                cmd += '';
            }
            cmd += ";";
        }
    });
    //chiudo il comando
    cmd += '}';
    return cmd;
}

// Creazione del comando di Modifca QTA Evadibile dei C nell'oli
function Listener_OLI_Edit_QtaEvadibile_C() {
    //comando da eseguire 
    var cmd = '{MPCOLI=';
    cmd += oPrg.TRMP.Id_xMOTRRig_P;

    //chiudo il comando
    cmd += ';}';
    return cmd;
}

function Listener_CPI_Create(Cd_xMOLinea, Cd_xMOMatricola) {
    //comando da eseguire 
    var cmd = '{GENCPI=' + Cd_xMOLinea.trim() + ',' + Cd_xMOMatricola.trim();
    //chiudo il comando
    cmd += ';}';
    return cmd;
}

// -------------------------------------------------
// ENDREGION: COMANDI LISTENER 
// -------------------------------------------------

// -------------------------------------------------
// #2.10 REGION: FUNZIONALITA' GENERICHE
// -------------------------------------------------

function Prelievi_DO_Filtro(selettore, filterval) {
    //Nascondo tutte le righe della tabella
    $("#pgDOPrelievi table .tr-prel").hide();
    $("#pgDOPrelievi table .tr-prel[F_Doc" + selettore + "'" + filterval + "']").show();
}

function Prelievi_AR_Filtro(selettore, filterval) {
    //Nascondo tutte le righe della tabella
    $("#pgDOPrelievi table .tr-prel").hide();
    $("#pgDOPrelievi table .tr-prel[F_Cd_ARs" + selettore + "'" + filterval + "']").show();
}

// Apre/Chiude un div toggle 
// Se passato alla funzione "force_open" (bool) forza l'apertura (true) o la chiusura (false)
function DivToggle_Execute(div, force_open) {
    var open = false;
    //Verifica l'apertura o la chiusura forzosa del div
    if (force_open != undefined)
        open = force_open;
    else
        //Imposto open a rovescio dello stato corrente del div
        open = ($(div).find(".icon").attr("state") == "down" ? true : false)

    if (open == true) {
        $(div).find(".icon").attr("src", "icon/ArrowUp.svg").attr("state", "up");
        $(div).find(".content").show();
        switch (oPrg.ActivePageValue) {
            case enumPagine.pgPrelievi:
                // quando viene aperto il div-filtri sposta più in basso la lista dei documenti
                ActivePage().find(".pgmain").addClass("lg-moved-y105");
                break;
        }

    } else {
        $(div).find(".icon").attr("src", "icon/ArrowDown.svg").attr("state", "down");
        $(div).find(".content").hide();
        switch (oPrg.ActivePageValue) {
            case enumPagine.pgPrelievi:
                // quando viene chiuso il div filtri sposta più in alto la lista dei documenti
                ActivePage().find(".pgmain").removeClass("lg-moved-y105");
                break;
        }
    }

    if ($(div).hasClass("div-letture")) {
        fU.ShowIf($(".lastread"), !open);
    }
    switch (oPrg.ActivePageValue) {
        case enumPagine.pgRLPiede:
            UserParam.setLocal(oPrg.Cd_DO + $(div).attr("id"), open);
            break;
    }
}

// Riempe i campi di pgRLRig al click dell'Um nell tabella   Set_Input_TopgRLRig
function pgRLRig_InputData_Load(tr) {
    ActivePage().find("input[name='Cd_AR']").focus();
    ActivePage().find(".ar-aa").text("");
    ActivePage().find(".ar-qta-info").text("");
    ActivePage().find("input[name='Cd_AR']").val(tr.find(".Cd_AR").text());
    ActivePage().find("label[name='AR_Descrizione']").html(tr.find(".Descrizione").text());

    // Controllo la quantità da proporre 
    if (oPrg.drDO.xMOQuantitaDef == 1) ActivePage().find("input[name='Quantita']").val("1");

    // Se xMOQuantitaDef è impotata al totale prelevabile carico la quantià EVAD nel campo
    var QtaDaEvadere = tr.find(".QtaEvadibile").text() - tr.find(".Quantita").text();

    if (oPrg.drDO.xMOQuantitaDef == 2) {
        ActivePage().find("input[name='Quantita']").val(QtaDaEvadere);
    }

    ARARMisura_Set(tr.find(".Cd_ARMisura").text());

    ActivePage().find("input[name='Quantita']").attr("rigakey", tr.attr("key")).focus().select();
}

// Riepe i campi di pgTRRig_P al click dell'Um nella tabella
function pgTRRig_P_InputData_Load(tr) {
    $("#pgTRRig_P input[name='Cd_AR']").val(tr.find(".Cd_AR").text());

    ARARMisura_Set(tr.find(".Cd_ARMisura").text());

    //Riempio il campo Quantità a seconda di quello che ho impostato nelle impostazioni
    // Controllo la quantità da proporre 
    if (oApp.xMOImpostazioni.MovTraQuantitaDef == 1) ActivePage().find("input[name='Quantita']").val("1");

    // Se xMOQuantitaDef è impotata al totale prelevabile carico la quantià EVAD nel campo
    var QtaDaEvadere = tr.find(".Quantita").text();

    if (oApp.xMOImpostazioni.MovTraQuantitaDef == 2) {
        ActivePage().find("input[name='Quantita']").val(QtaDaEvadere);
    }

    $("#pgTRRig_P input[name='Quantita']").focus().select();
}

// Riepe i campi di pgTRRig_P al click dell'Um nella tabella
function pgTRRig_A_InputData_Load(tr) {
    $("#pgTRRig_A input[name='Cd_AR']").val(tr.find(".Cd_AR").text()).attr("Id_xMOTRRig_P", tr.attr("Id_xMOTRRig_P"));

    ARARMisura_Set(tr.find(".Cd_ARMisura").text());

    //Riempio il campo Quantità a seconda di quello che ho impostato nelle impostazioni
    // Controllo la quantità da proporre 
    if (oApp.xMOImpostazioni.MovTraQuantitaDef == 1) ActivePage().find("input[name='Quantita']").val("1");

    // Se xMOQuantitaDef è impotata al totale prelevabile carico la quantià EVAD nel campo
    var QtaDaEvadere = tr.find(".Residua").text(); - tr.find(".Quantita").text();

    if (oApp.xMOImpostazioni.MovTraQuantitaDef == 2) {
        ActivePage().find("input[name='Quantita']").val(QtaDaEvadere);
    }

    $("#pgTRRig_A input[name='Quantita']").focus().select();
}

// Esegue il click sul li dei documenti aperti
// ATENZIONE il click sulle icone del li simulano il click del li!
function DocAperti_RLClickIt(li) {
    // Controlla se il click si avvenuto effettivamente sul li e non sull'icona del delete
    // fnl modificato i con img
    switch (li.find("img").attr('delete')) {
        case "true":
            // fnl
            //Ho cliccato su DELETE e devo eseguire l'eliminazione del doc
            li.find("img").attr('delete', 'false');
            //Imposta gli attributi per avviare il programma giusto e apre il popup per la conferma
            $("#Popup_DocAperti_Del").attr("Tipo", "RL").attr("iddoc", li.attr("prgid")).find(".do-info").text(li.attr("doinfo"));
            $("#Popup_DocAperti_Del").show();
            break;
        case "false":
            //Rilevazione in Edit
            oPrg.Id_xMORL_Edit = li.attr('prgid');
            //Carica il programma
            switch (li.attr('prgexe')) {
                case "SP":
                case "LC":
                    // Load del programma SP (senza la prima pagina)
                    oPrg.Load("SPA", li.attr("cd_do"), li.attr("prgid"), "RL");
                    break;
                default:
                    oPrg.Load(li.attr('prgexe'), li.attr('cd_do'), li.attr('prgid'), 'RL');
                    break;
            }
            break;
    }
}

function DocAperti_TRClickIt(li) {
    // Controlla se il click si avvenuto effettivamente sul li e non sull'icona del delete
    switch (li.find("img").attr('delete')) {
        case "true":
            //Ho cliccato su DELETE e devo eseguire l'eliminazione del doc
            li.find("img").attr('delete', 'false');
            //Imposta gli attributi per avviare il programma giusto e apre il popup per la conferma
            $("#Popup_DocAperti_Del").attr("Tipo", "TR").attr("iddoc", li.attr("prgid")).find(".do-info").text(li.attr("doinfo"));
            $("#Popup_DocAperti_Del").show();
            break;
        case "false":
            oPrg.Load(li.attr('prgexe'), li.attr('cd_do'), li.attr('prgid'), 'TR');
            break;
    }
}

// Richiama l'ajax per eliminare il doc
function DocAperti_DeleteIt(id_doc) {
    if (!fU.IsEmpty(id_doc)) {
        switch ($("#Popup_DocAperti_Del").attr("Tipo")) {
            case 'RL':
                Ajax_xmosp_xMORL_Delete(id_doc);
                break;
            case 'TR':
                var r = Ajax_xmosp_xMOTR_Delete(id_doc);
                if (r[0].Result > 0) PopupMsg_Show("MESSAGGIO", r[0].Result, r[0].Messaggio);
                break;
        }
        //Aggiorno la lista dei doc aperti
        Ajax_xmofn_DOAperti();
    }
    HideAndFocus("Popup_DocAperti_Del");
}

// Esegue il click sul li degli inventari aperti
// ATENZIONE il click sulle icone del li simulano il click del li!
function INAperti_ClickIt(li) {
    switch (li.find("img").attr('delete')) {
        case 'true':
            //Ho cliccato su DELETE e devo eseguire l'eliminazione del'IN
            // Cambiato il tag da i a img fnl
            li.find("img").attr('delete', 'false');
            //Apre il popup per la conferma
            $("#Popup_INAperti_Del").attr("id_xmoin", li.attr("id_xmoin")).show();
            break;
        case 'false':
            // Disabilito la pagina di testa del prg
            oPrg.Pages[oPrg.PageIdx(enumPagine.pgIN)].Enabled = false;
            oPrg.Id_xMOIN_Edit = li.attr("id_xmoin");
            // Carica in drIN la testa dell' inventario selezionato        
            Ajax_xmofn_xMOIN();
            Nav.Next();
            break;
    }
}

// Richiama l'ajax per eliminare l'inventario
function INAperti_DeleteIt(id_xmoin) {
    if (!fU.IsEmpty(id_xmoin)) {
        Ajax_xmosp_xMOIN_Delete(id_xmoin);
    }
    $("#Popup_INAperti_Del").hide();
}

function ARARMisura_Set(um) {
    // Voglio assegnare una um: pulisce il select perché solo se chiamo ARARMisura_Build con il Focus su Quantità lo potro assegnare
    ActivePage().find("select[name='Cd_ARMisura'] .op-um").remove();
    // Memorizzo l'um da selezionare
    ActivePage().find("select[name='Cd_ARMisura']").attr("um2set", um.toUpperCase());
}

function ARARMisura_Build() {

    // Controllo che sia stato selezionato un articolo e la lista delle UM sia vuota
    if (!fU.IsEmpty(ActivePage().find("input[name='Cd_AR']").val()) && ActivePage().find("select[name='Cd_ARMisura'] option").length == 0) {

        var TipoARMisura = "";
        var xMOUmDef = "";

        // Solo se sto eseguendo le letture di un documento passo i parametri alla ricerca (altrimenti drDO non esiste)
        if (oPrg.ActivePageId == 'pgRLRig') {
            TipoARMisura = oPrg.drDO.TipoARMisura;
            xMOUmDef = oPrg.drDO.xMOUmDef;
        }
        Ajax_xmofn_ARARMisura(TipoARMisura, xMOUmDef);

        // Se um2set non è vuoto seleziona l'um predeterminata
        var um;
        um = ActivePage().find("select[name='Cd_ARMisura']").attr("um2set");
        if (!fU.IsEmpty(um)) {
            ActivePage().find("select[name='Cd_ARMisura']").val(um);
        }
        ActivePage().find("select[name='Cd_ARMisura']").attr("um2set", "");

        // Se l'operatore ha letto un alias o alternativo seleziona l'UM di riferimento
        if (ActivePage().find("input[name='Cd_AR']").val().trim() != ActivePage().find(".ar-aa").text().trim()) {
            Ajax_xmofn_ARAlias_ARMisura();
        }
    }
}

// Elimina l'ultima lettura effettuata in base alla pagina in cui mi trovo
function Delete_Last_Read() {

    switch (oPrg.ActivePageValue) {
        case enumPagine.pgRLRigID:
        case enumPagine.pgRLRig:
            Ajax_xmosp_xMORLLast_Del();
            break;

        case enumPagine.pgTRRig_P:
            Ajax_xmosp_xMOTRRig_P_Last_Del();
            break;

        case enumPagine.pgTRRig_A:
            Ajax_xmosp_xMOTRRig_A_Last_Del();
            break;
    }

    HideAndFocus("Popup_Delete_Last_Read");
}

// Elimina la lettura selezionata dal dettaglio delle letture
function Delete_Lettura(Id_Del) {

    switch (oPrg.ActivePageValue) {
        case enumPagine.pgRLRigID:
        case enumPagine.pgRLRig:
        case enumPagine.pgRLRig_T:
            Ajax_xmosp_xMORLRig_Del(Id_Del);
            break;
        case enumPagine.pgTRRig_P:
            Ajax_xmosp_xMOTRRig_P_Del(Id_Del);
            break;
        case enumPagine.pgTRRig_A:
            Ajax_xmosp_xMOTRRig_A_Del(Id_Del);
            break;
    }

    $('#Popup_Del_Lettura').hide();
}

// Edita la lettura selezionata dal dettaglio delle letture
function Edit_Lettura(Key_Edit) {

    switch (oPrg.ActivePageValue) {
        case enumPagine.pgRLRigID:
        case enumPagine.pgRLRig_T:
        case enumPagine.pgTRRig_P:
        case enumPagine.pgTRRig_A:
            break;
        case enumPagine.pgRLRig:
            xMORLRig_Edit(Key_Edit);
            break;
    }

    $('#Popup_Edit_Lettura').hide();
}
// Getione del bottone conferma in base alla pagina
function Confirm_Read() {

    // Validazione dei campi necessari per validare la lettura
    if (fU.IsEmpty(ActivePage().find("[name='Cd_AR']").val())) {
        PopupMsg_Show("Errore Confirm_Read", 1, "Articolo errato o mancante.", ActivePage().find("[name='Cd_AR']"));
        return false;
    }
    if (fU.IsEmpty(ActivePage().find("[name='Quantita']").val())) {
        PopupMsg_Show("Errore Confirm_Read", 1, "Quantità errata o mancante.", ActivePage().find("[name='Quantita']"));
        return false;
    }
    if (fU.IsZeroVal(ActivePage().find("[name='Quantita']").val())) {
        if (!confirm("Quantità letta 0 (zero). Continuare?")) {
            return false;
        }
    }
    if (fU.IsEmpty(ActivePage().find("[name='Cd_ARMisura'] :selected").text())) {
        PopupMsg_Show("Errore Confirm_Read", 1, "Unità di misura errata.", ActivePage().find("[name='Cd_ARMisura']"));
        return false;
    }

    var xml;
    // Costruisce xml campi personalizzati per il salvataggio e verifica se i campo obbligatori sono stati valorizzati altrimenti esce e visualizza il messaggio
    if (!fU.IsEmpty(oPrg.drDO) && !fU.IsEmpty(oPrg.drDO.xMOExtFld)) {
        xml = "<rows>";
        var res = true;
        ActivePage().find(".div-extfld-pers").each(function (idx, obj) {
            if (fU.ToBool($(obj).find("input").attr("data-required")) && fU.IsEmpty($(obj).find("input").val())) {
                PopupMsg_Show("Errore Confirm_Read", 1, "Specificare un valore per " + $(obj).find("label").text());
                res = false;
            }
            xml += "<row nome='" + $(obj).find("input").attr("name") + "' valore='" + $(obj).find("input").val() + "' descrizione= '" + $(obj).find("input").attr("descr") + "' />";
        });
        xml += "</rows>";
        // Se si è scatenato un messaggio esce
        if (!res)
            return false;
    }

    var r;
    switch (oPrg.ActivePageValue) {
        case enumPagine.pgRLRig:
            if (fU.ToBool(oPrg.drDO.MagPFlag) && fU.IsEmpty(ActivePage().find("input[name='Cd_MG_P']").val())) {
                PopupMsg_Show("Errore Confirm_Read", 1, "Nessun magazzino di partenza selezionato.");
                return false;
            }
            if (fU.ToBool(oPrg.drDO.MagAFlag) && fU.IsEmpty(ActivePage().find("input[name='Cd_MG_A']").val())) {
                PopupMsg_Show("Errore Confirm_Read", 1, "Nessun magazzino di arrivo selezionato.");
                return false;
            }
            r = Ajax_xmosp_xMORLRig_Save(xml);
            break;

        case enumPagine.pgRLRigID:
            r = Ajax_xmosp_xMORLRig_FIDOR_Save(xml);
            break;

        case enumPagine.pgTRRig_P:
            if (fU.IsEmpty(ActivePage().find("input[name='Cd_MG_P']").val())) {
                PopupMsg_Show("Errore Confirm_Read", 1, "Nessun magazzino di partenza selezionato.");
                return false;
            }
            r = Ajax_xmosp_xMOTRRig_P_Save();
            break;

        case enumPagine.pgTRRig_A:
            if (fU.IsEmpty(ActivePage().find("input[name='Cd_MG_A']").val())) {
                PopupMsg_Show("Errore Confirm_Read", 1, "Nessun magazzino di arrivo selezionato.");
                return false;
            }
            r = Ajax_xmosp_xMOTRRig_A_Save();
            break;
        case enumPagine.pgxMPIU:
            if (fU.IsEmpty(ActivePage().find("input[name='Id_DORig']").val())) {
                PopupMsg_Show("Errore Confirm_Read", 1, "Nessun codice id riga specificato.");
                return false;
            }
            if (fU.IsEmpty(ActivePage().find("input[name='Cd_ARLotto']").val())) {
                PopupMsg_Show("Errore Confirm_Read", 1, "Nessun lotto specificato.");
                return false;
            }
            r = Ajax_xmosp_xMOMPIU_Save();
            break;
    }

    if (r) {
        // Azzero i campi e imposto il focus sul campo
        switch (oPrg.ActivePageValue) {
            case enumPagine.pgRLRig:
                pgRLRig_Clear();
                break;
            case enumPagine.pgRLRigID:
                pgRLRigID_Clear();
                break;
            case enumPagine.pgTRRig_P:
            case enumPagine.pgTRRig_A:
                pgTRRig_PA_Clear();
                break;
        }
    }

    // scrolla la pagina al top 
    window.scrollTo(0, 0);
    // Chiamo la funzione setfocus in modo da riportare il focus nel primo campo con la classe first-focus 
    //SetFocus();

    return r;
}

// Al focus nel campo quantità seleziona tutta la qta
function Quantita_Onfocus(inp_qta) {
    // Se non è aperto il popup gestisco il codice della quantità
    var Cd_CF = "";
    var Cd_AR = "";
    var find_aa = true;
    switch (oPrg.ActivePageValue) {
        case enumPagine.pgRLRig:
            Cd_CF = $("#pgRL input[name='Cd_CF']").val();
            Cd_AR = ActivePage().find("input[name='Cd_AR']").val();
            find_aa = fU.IsEmpty(ActivePage().find(".ar-aa").text());       // imposto il semaforo a false se non ho cambiato articolo
            // Mostra le descrizioni aggiuntive
            if (Nav.ShowInfo())
                Ajax_xmosp_xMORLRig_InfoEx();
            else
                ActivePage().find("label[name='InfoExt']").html("");
            break;
        case enumPagine.pgINRig:
            Cd_AR = $("#pgINRig .div-detail input[name='Cd_AR']").val();
            Cd_CF = "";
            break;
        default:
            Cd_AR = ActivePage().find("input[name='Cd_AR']").val();
            Cd_CF = "";
            break;
    }

    // Semaforo per ricalcolare l'alias alternativo e le unità di misura
    if (find_aa) {

        if (!fU.IsEmpty(Cd_AR)) {
            // Recupera il Cd_AR corrispondente all'eventuale alias o codice alternativo passato alla funzione
            Ajax_xmofn_Get_AR_From_AAA(Cd_AR, Cd_CF);
        }

        //Ricarica l'elenco delle unità di misura dell'articolo corrente
        ARARMisura_Build();

        //Se la quantità è vuota imposta i valori
        if (!fU.IsEmpty(inp_qta) && inp_qta.val() == "") {
            //Imposta i default dalla parametrizzazione del DOC
            switch (oPrg.drDO.xMOQuantitaDef) {
                case 0: //nessuno 
                    break;
                case 1: //Una unita
                    inp_qta.val("1");
                    break;
                case 2: //Totale prelevabile;
                    inp_qta.val(QtaTotalePrelevabile());
                    break;
            }
            //Seleziona il contenuto di tutto il campo
            inp_qta.select();
        }
    }
}

// Al focus nel campo quantità seleziona tutta la qta
function Quantita_Onfocus_Popup(inp_qta, idpopup) {
    // Se non è aperto il popup gestisco il codice della quantità
    var Cd_CF = "";
    var Cd_AR = "";
    var inp_qta;

    Cd_AR = fU.IfEmpty($("#" + idpopup + " .Cd_AR").text(), "");
    Cd_CF = fU.IfEmpty($("#" + idpopup + " input[name='Cd_CF']").val(), "");

    if (!fU.IsEmpty(Cd_AR)) {
        // Caricare le um
        Ajax_xmofn_ARARMisura_Popup(idpopup);

        // Se um2set non è vuoto seleziona l'um predeterminata
        var um;
        um = $("#" + idpopup + " select[name='Cd_ARMisura']").attr("um2set");
        if (!fU.IsEmpty(um)) {
            $("#" + idpopup + " select[name='Cd_ARMisura']").val(um);
        }
        $("#" + idpopup + " select[name='Cd_ARMisura']").attr("um2set", "");
    }


    //Se la quantità è vuota imposta i valori
    if (!fU.IsEmpty(inp_qta) && inp_qta.val() == "") {
        //Imposta i default dalla parametrizzazione del DOC
        switch (oPrg.drDO.xMOQuantitaDef) {
            case 0: //nessuno 
                break;
            case 1: //Una unita
                inp_qta.val("1");
                break;
            case 2: //Totale prelevabile;
                inp_qta.val(QtaTotalePrelevabile());
                break;
        }
        //Seleziona il contenuto di tutto il campo
        inp_qta.select();
    }
}

// Calcola i totali dei pesi e dei volumi per ogni unità logistica e per tutta la packing
function Sum_Pesi_Volumi(UL, AR, item) {

    // Tot Peso Netto
    UL.find(".pnul").text((Number(UL.find(".pnul").text()) + item.PesoNettoKg).toFixed(3));

    // Tot Peso Lordo
    UL.find(".plul").text((Number(UL.find(".plul").text()) + item.PesoLordoKg).toFixed(3));

    // Tot Volume
    UL.find(".vul").text((Number(UL.find(".vul").text()) + item.VolumeM3).toFixed(3));


    // TOTALI PESI E VOLUME PER PACKING LIST
    var p = $("#Detail_PackingList");

    p.find(".netto").text((Number(p.find(".netto").text()) + item.PesoNettoKg).toFixed(3));
    p.find(".lordo").text((Number(p.find(".lordo").text()) + item.PesoLordoKg).toFixed(3));
    p.find(".volume").text((Number(p.find(".volume").text()) + item.VolumeM3).toFixed(3));
}

function DetailPackinList_OnOffPesi(check) {

    if (check.attr("checked") == "checked") {
        check.removeAttr("checked", "checked");
        $("#Detail_PackingList .dati1").show();
        $("#Detail_PackingList .dati2").hide();
    } else {
        check.attr("checked", "checked");
        $("#Detail_PackingList .dati1").hide();
        $("#Detail_PackingList .dati2").show();
    }
}

// Allo scroll della pagina viene visualizato il button
function When_PageScroll() {
    switch (oPrg.ActivePageValue) {
        case enumPagine.pgINRig:
            if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
                ActivePage().find(".btn-top").css("display", "block");
            } else {
                ActivePage().find(".btn-top").css("display", "none");
            }
            break;
    }
}

// Al click del button lo scroll torna al top
function GoTo_TopPage() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function INRig_Client_Filter() {
    var rows, col, ar, ubi;

    // elenco delle righe
    rows = $("#pgINRig table tr.tr-inar");
    // Valore codice articolo
    ar = $("#pgINRig .div-grid .Cd_AR").val();
    ubi = $("#pgINRig .div-grid input[name='Cd_MGUbicazione']").val();

    // mostro tutte le righe
    rows.hide();

    $.each(rows, function (idx, row) {
        var show_ar, show_ubi = false;

        // filtro per Cd_AR
        show_ar = ($(row).find(".Cd_AR").text().toUpperCase().indexOf(ar.toUpperCase()) >= 0);
        // filtro per Cd_MGUbicazione
        show_ubi = ($(row).find(".Cd_MGUbicazione").text().toUpperCase().indexOf(ubi.toUpperCase()) >= 0);

        // Se non è una riga appartenente alla condizione di filtro la nascondo
        if (show_ar == true && show_ubi == true) $(row).show();
    });
}

// Scorre i PcakListRef nella pagina pgRLPK
function Slideshow_PKRef(n) {
    var i;
    var index = n + fU.ToInt32(oPrg.PK.idx);
    if (index > oPrg.PK.dtxMORLPK.length - 1) {
        index = oPrg.PK.dtxMORLPK.length - 1;
    }
    if (index < 0) { index = 0; }
    // Salvo le modifiche effettuate al packlistref prima di scorrere la lista
    Ajax_xmosp_xMORLPackListRef_Save();
    oPrg.PK.idx = index;
    pgRLPK_Template();
}

function PackListRef_Save() {
    Ajax_xmosp_xMORLPackListRef_Save();
    // Rimetto mode detail a false 
    oPrg.PK.RLPKDetail = false;
    oPrg.PK.PackListRef = "";
    // Simulo il back della pagina
    Nav.Back();
    //SetFocus();
}

function PKPesi_Calcola(input) {

    // Prendo i valori dai campi
    PN = fU.ToDecimal(ActivePage().find("input[name='PesoNettoMks']").val());
    PL = fU.ToDecimal(ActivePage().find("input[name='PesoLordoMks']").val());
    PT = fU.ToDecimal(ActivePage().find("input[name='PesoTaraMks']").val());

    // In base al valore cambiato effettuo i calcoli
    switch (input.attr("name")) {
        case 'PesoTaraMks':
        case 'PesoNettoMks':
            PL = PT + PN;
            break;
        case 'PesoLordoMks':
            PN = PL - PT;
            break;
    }

    // Inserisco i nuovi valori nei campi
    ActivePage().find("input[name='PesoNettoMks']").val(PN);
    ActivePage().find("input[name='PesoLordoMks']").val(PL);
    ActivePage().find("input[name='PesoTaraMks']").val(PT);
}

function Set_LineaMG() {
    // Se il documento gestisce la linea e la linea è selezionata
    if (oPrg.drDO.xMOLinea && !fU.IsEmpty(ActivePage().find("select[name='Cd_xMOLinea'] option:selected").val())) {
        // Verifica confiogurazione documento causale di Partenza:
        // 1) se gestito il MG_P 
        // 2) se non è fisso 
        // 3) se è vuoto
        if (oPrg.drDO.MagPFlag && !oPrg.drDO.UIMagPFix && fU.IsEmpty(oPrg.drDO.Cd_MG_P))
            // Imposto il magazzino della linea selezionata
            ActivePage().find("input[name='Cd_MG_P']").val(ActivePage().find("select[name='Cd_xMOLinea'] option:selected").attr("LineaMG"));
        // Altrimenti verifica confiogurazione documento causale di Arrivo:
        // 1) se gestito il MG_A 
        // 2) se non è fisso 
        // 3) se è vuoto
        else if (oPrg.drDO.MagAFlag && !oPrg.drDO.UIMagAFix && fU.IsEmpty(oPrg.drDO.Cd_MG_A))
            // imposto il mg_a come mg della linea selezionata
            ActivePage().find("input[name='Cd_MG_A']").val(ActivePage().find("select[name='Cd_xMOLinea'] option:selected").attr("LineaMG"));
    }
}

// -------------------------------------------------
// ENDREGION: FUNZIONALITA' GENERICHE
// -------------------------------------------------

// -------------------------------------------------
// #2.20 REGION: SPEDIZIONE
// -------------------------------------------------

// Seleziona la spedizione
function Spedizione_Check_SP(Id_DOTes) {
    // Recupero la spedizione corrente su cui ho fatto click
    // Memorizzo il prossimo stato della selezione
    var current = oPrg.SP.dt.find(function (item) {
        return item.Id_DOTes == Id_DOTes
    });
    var nextStatus = !current.Selezionato;

    // Elemento del DOM con i Cd_DOs
    var domSelect = ActivePage().find('select[name="Cd_DO"]');

    // Recupero i Cd_DOs utilizzabili dai doc selezionati
    var Cd_DOs_Selected = domSelect.val();
    var Cd_DOs_Selectable = domSelect.find('option').toArray().map(function (item) { return item.value });
    var Cd_DOs = current.Cd_DOs.replaceAll(' ', '').split(',');

    // Ci sono Cd_DOs nel combo
    // Carico i Cd_DOs del current nel combo
    if (Cd_DOs_Selectable.length == 0 && nextStatus) {
        Cd_DOs.forEach(function (item) {
            domSelect.append($('<option>', {
                value: item,
                text: item
            }));
        });
    }

    // Se ci sono Cd_DOs nel combo
    // E il Cd_DO selezionato non è contenuto in quelli del current
    // Mostro un messaggio di errore
    if (Cd_DOs_Selectable.length > 0 && nextStatus) {
        if (!Cd_DOs.includes(Cd_DOs_Selected)) {
            nextStatus = false;
            PopupMsg_Show("ERRORE", 1, "Non è possibile selezionare il documento a causa di incongruenza sul tipo di documento da generare!");
        }
    }

    // Assegno lo stato al current
    current.Selezionato = nextStatus;

    // Recupero il filtro corrente
    // Se vuoto, lo assegno con la spedizione corrente
    var Cd_xMOCodSpeDOM = ActivePage().find('input[name="Cd_xMOCodSpe"]');
    if (Cd_xMOCodSpeDOM.val() == '')
        Cd_xMOCodSpeDOM.val(current.xCd_xMOCodSpe);

    // Se non ci sono righe selezionate
    // Svuoto il combo
    // Svuoto il filtro
    if (oPrg.SP.dt.filter(function (item) { return item.Selezionato; }).length == 0) {
        Cd_xMOCodSpeDOM.val('');
        domSelect.find('option').remove();
    }

    // Ricarico tutto il DOM
    Spedizione_Load();
}

function pgSP_PulisciFiltri() {
    ActivePage().find('input[name="Cd_xMOCodSpe"]').val('');
    ActivePage().find('input[name="Id_DOTes"]').val('');
    ActivePage().find('select[name="Cd_DO"] option').remove();
    if (fU.IsObject(oPrg.SP.dt)) {
        oPrg.SP.dt.forEach(function (item) { item.Selezionato = false });
        Spedizione_Load();
    }
}

function pgSP_OrderTable() {
    // Recupero l'ordinamento
    // Inizializzo la variabile se vuota
    // Cambio l'ordinamento e lo salvo in locale
    var order = localStorage.getItem('SPFiltro');
    order = (order ? order : 0);
    localStorage.setItem('SPFiltro', order ^= 1);

    // Carico la lista delle SP ordinate con l'order selezionato
    Ajax_xmofn_xMOCodSpe();
}

// -------------------------------------------------
// ENDREGION: SPEDIZIONE
// -------------------------------------------------

// -------------------------------------------------
// #2.30 REGION: ACQUISIZIONE ALIAS
// -------------------------------------------------

// Avvia il programma AA dalla pagina delle letture 
function GoTo_Prg_AA(TipoAA) {

    // Prendo il valore nel campo Cd_AR della pagina corrente
    var cd_ar = $("#" + oPrg.ActivePageId).find("input[name='Cd_AR']").val();
    var cd_cf = oPrg.drRL.Cd_CF;
    var cf_desc = oPrg.drRL.CF_Descrizione;

    oApp.TipoAA = TipoAA;
    // Carica momentaneamente il programma AA
    oPrg.LoadTemporaryPrg("AA");

    $("#pgAA .barcode").hide();
    $("#pgAA .switch").hide();
    $("#pgAA input[name='" + oApp.TipoAA + "']").val(cd_ar);

    if (oApp.TipoAA.toUpperCase() == 'ALT') {
        $("#pgAA input[name='Cd_CF']").val(cd_cf).attr("disabled", true);
        $("#pgAA label[name='CF_Descrizione']").text(cf_desc);
        $("#pgAA img[searchkey='Cd_CF']").hide();
    }

    $("#pgAA .first-focus:visible").first().focus().select(); // Inutile? .addClass("mo-br-orange");
}

// Inserisce il nuovo alias per l'articolo 
function Ajax_xmosp_ARAlias_Save() {
    var out = false;

    var p = $("#" + oPrg.ActivePageId);

    Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Cd_AR: fU.ToString($(p).find("input[name='Cd_AR']").val()),
        Cd_ARMisura: fU.ToString($(p).find("input[name='Cd_ARMisura']").val()),
        Alias: fU.ToString($(p).find("input[name='ALI']").val()),
    };

    $.ajax({
        url: "Logistica.aspx/xmosp_ARAlias_Save",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result == 1) {
                $(p).find(".msg").text("Alias " + Params.Alias + " inserito.");
                // Svuota i campi della pagina
                pgAA_UI();
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

// Inserisce il nuovo alias per l'articolo 
function Ajax_xmosp_ARCodCF_Save() {
    var out = false;

    var p = $("#" + oPrg.ActivePageId);

    var Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Cd_AR: fU.ToString($(p).find("input[name='Cd_AR']").val()),
        Cd_CF: fU.ToString($(p).find("input[name='Cd_CF']").val()),
        ARCodCF: fU.ToString($(p).find("input[name='ALT']").val()),
        Descrizione: fU.ToString($(p).find("input[name='Descrizione']").val()),
    }

    $.ajax({
        url: "Logistica.aspx/xmosp_ARCodCF_Save",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result == 1) {
                // Svuota i campi della pagina
                $(p).find("input").val("");
                $(p).find(".descrizione").text("");
                $(p).find(".msg").text("Codice Alternativo " + Params.ARCodCF + " inserito.");
                setTimeout(function () {
                    $(p).find(".msg").text("");
                }, 2500);
                SetFocus();
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

// Cambia la visualizzazione della pagina al click sul bottone slide
function pgAA_Change_TipoAA(codalt) {
    if (codalt) {
        oApp.TipoAA = 'ALT';
    } else {
        oApp.TipoAA = 'ALI';
    }
    pgAA_UI();
}


// -------------------------------------------------
// ENDREGION: ACQUISIZIONE ALIAS
// -------------------------------------------------

// -------------------------------------------------
// #2.40 REGION: PRELIEVO DA ID RIGA
// -------------------------------------------------

// Recupera i dati dell'Id_DORig letto   --> xMORLRig_From_Id_DORig_Dati()
// Recupera i dati dell'Id_DORig letto   --> xmofn_xMORLRig_FIDOR_Dati()
function Ajax_xmofn_xMORLRig_FIDOR_Dati(Id_DORig) {

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_DORig: fU.ToInt32(Id_DORig),
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit)
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_xMORLRig_FIDOR_Dati",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            if (dt.length == 1) {
                //Imposta i dati della riga nei campi
                xmofn_xMORLRig_FIDOR_Dati_Load(dt[0]);
            }
            else {
                // ATTENZIONE: se si scatena l'errore in questo punto e si ha l'autoconferma attiva sulla lettura l'utente non riesce a leggerlo
                // in quanto il popup usato nei controlli in Confirm_read è lo stesso e verrebbe sovrascritto.
                PopupMsg_Show("ERRORE FIDOR_Dati", 1, "Nessuna riga trovata per l'id letto!");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

function xmofn_xMORLRig_FIDOR_Dati_Load(row) {

    // Se è la prima lettura (la testa non esiste) chiedo a l'operatore se iniziare il documento per il cf recuperato dall'id riga letto
    // in modo da evitare che venga creata la testa nel caso l'opratore abbia letto un id sbagliato
    var r = true;
    if (fU.IsZeroVal(oPrg.Id_xMORL_Edit)) {
        var ck = fU.IsChecked($("#pgRLRigID .ck-autoconfirm"));
        fU.CheckIf($("#pgRLRigID .ck-autoconfirm"), false);
        r = confirm("Iniziare il " + oPrg.drDO.Cd_DO + " per " + row.CF_Descrizione + " (" + row.Cd_CF + ") ?");
        if (r) fU.CheckIf($("#pgRLRigID .ck-autoconfirm"), ck);
    }
    if (r) {
        $("#pgRLRigID .lb-cli").text(row.Cd_CF + " - " + row.CF_Descrizione.substring(0, 18) + (row.CF_Descrizione.length > 18 ? + ".." : ""));
        $("#pgRLRigID .lb-idriga").text(row.Id_DORig);
        // Imposta i campi della riga del documento recuperati dal BC nella pagina
        $("#pgRLRigID input[name='Cd_AR']").val(row.Cd_AR).change();
        ARARMisura_Set(row.Cd_ARMisura);
        $("#pgRLRigID input[name='Quantita']").val(row.QtaEvadibile).focus().select();

        $("#pgRLRigID input[name='Cd_ARLotto']").val(row.Cd_ARLotto).attr("disabled", !fU.IsEmpty(row.Cd_ARLotto)).focus().select();
        $("#pgRLRigID input[name='DataScadenza']").attr("disabled", !fU.IsEmpty(row.Cd_ARLotto));
        $("#pgRLRigID input[name='Cd_DOSottoCommessa']").val(row.Cd_DOSottoCommessa).attr("disabled", !fU.IsEmpty(row.Cd_DOSottoCommessa)).focus().select();
        $("#pgRLRigID img[searchkey='Cd_ARLotto']").css("display", !fU.IsEmpty(row.Cd_ARLotto) ? "none" : "");
        $("#pgRLRigID img[searchkey='Cd_DOSottoCommessa']").css("display", !fU.IsEmpty(row.Cd_DOSottoCommessa) ? "none" : "");
        // Se la conferma è automatica riscateno il focus sul BC
        if (fU.IsChecked(ActivePage().find(".ck-autoconfirm")))
            SetFocus();
    }
    else {
        pgRLRigID_Clear();
    }
}

function Ajax_xmosp_xMORLRig_FIDOR_Save(extfld) {
    var out = false;
    var p = "#" + oPrg.ActivePageId;

    var Barcode = (!fU.IsNull(oPrg.BC) ? fU.ToString(oPrg.BC.BarcodeXml()) : "");

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Barcode: Barcode,
        Id_DORig: fU.ToInt32($(p).find("input[name='Id_DORig']").val()),
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit),
        Cd_DO: oPrg.drDO.Cd_DO,
        Quantita: fU.ToString(parseFloat($(p).find("input[name='Quantita']").val().replace(',', '.'))),
        Cd_ARMisura: fU.ToString($(p).find("select[name='Cd_ARMisura'] :selected").val()),
        Cd_ARLotto: fU.ToString($(p).find("input[name='Cd_ARLotto']").val()),
        DataScadenza: fU.DateToSql($(p).find("input[name='DataScadenza']").val()),
        Cd_DOSottoCommessa: fU.ToString($(p).find("input[name='Cd_DOSottoCommessa']").val()),
        ExtFld: fU.IfEmpty(extfld, "")
    });

    $.ajax({
        url: "Logistica.aspx/xmosp_xMORLRig_FIDOR_Save",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result > 0) {
                out = true;
                oPrg.Id_xMORL_Edit = r[0].Id_xMORL;
                // Carico la testa in drRL
                xMORL_FIDOR_Load();
                //Aggiorno le righe lette
                Ajax_xmofn_xMORLRig_FIDOR_AR();
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

// Elenco Righe Lette raggruppate per Articolo
function Ajax_xmofn_xMORLRig_FIDOR_AR() {

    // Pulisce le righe della tabella
    var p = "#" + oPrg.ActivePageId
    $(p).find("tr.tr-rigprel").remove();

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit),
    });
    $.ajax({
        url: "Logistica.aspx/xmofn_xMORLRig_FIDOR_AR",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            // Refresh delle righe
            pgRLRigID_AR_Load($.parseJSON(mydata.d));
            // Refresh del numero di righe lette
            Ajax_select_xMORLRig_NRows();
        },
        error: function (XMLHttpBarcode_LoadRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

}

function pgRLRigID_AR_Load(dt) {

    // Svuoto la label contenente i dati dell'ultima lettura effettuata
    $("#pgRLRigID .lastread").text("");

    //Verifico che il dt abbia delle righe
    if (dt.length > 0) {
        var tr1 = $("#pgRLRigID .template").clone().removeAttr("style").addClass("tr-rigprel");
        var tr2 = $("#pgRLRigID .template_ARDesc").clone().removeAttr("style").addClass("tr-rigprel tr-ardesc");
        for (var i = 0; i < dt.length; i++) {
            if (dt[i].Ultima == 1) {
                // Inserisco i dati dell'utlima lettura effettuata nella label lastread
                $("#pgRLRigID .lastread").html(dt[i].Descrizione + ":&nbsp;" + dt[i].Quantita + " " + dt[i].Cd_ARMisura);
            }
            $("#pgRLRigID table").append(pgRLRigID_AR_Template(tr1.clone(), dt[i], i));
            $("#pgRLRigID table").append(ARDesc_Template(tr2.clone(), dt[i].Cd_AR, dt[i].Descrizione));
        }
    }
}

function pgRLRigID_AR_Template(tr, item, key) {
    //tr.find('.Cd_ARMisura').on("click", function () {
    //    pgRLRig_InputData_Load($(this).parent());
    //});

    tr.attr("key", key);
    tr.attr("Id_DOTes", item.Id_DOTes);
    tr.find(".Id_DORig").text(item.Id_DORig);
    tr.find(".Cd_AR").text(item.Cd_AR);
    tr.find(".Descrizione").text(item.Descrizione);
    tr.find(".Cd_ARMisura").text(item.Cd_ARMisura);
    tr.find(".Quantita").text(item.Quantita);
    tr.find(".QtaResidua").text(item.QtaEvadibile - item.Quantita);
    tr.find(".Cd_ARLotto").text(item.Cd_ARLotto);
    tr.find(".Cd_DOSottoCommessa").text(item.Cd_DOSottoCommessa);
    tr.find(".DocRif").text(item.Cd_DO + " nr." + item.NumeroDoc);


    tr.find(".DocRif").on("click", function () {
        // Carica i dati del detail
        Detail_Ajax_xmovs_DOTes(item.Id_DOTes);
        $("#DetailDO").show();
    });

    return tr;
}

function xMORL_FIDOR_Load() {
    // Carico i dati di testa 
    var out = Ajax_xmovs_xMORL();
    $("#pgRLRigID .lb-doc-id").text(oPrg.Id_xMORL_Edit);
    $("#pgRLRigID .lb-cli").text(oPrg.drRL.Cd_CF + " - " + oPrg.drRL.CF_Descrizione);
}

function pgRLPK_R_UI() {
    // Lista
    var divLista = ActivePage().find('.listPaking');
    // Svuoto 
    divLista.empty();
    //Contatori
    ActivePage().find('.pk-ul-da').text("0");
    ActivePage().find('.pk-ul-a').text("0");
    //Id prelievo
    ActivePage().find(".titolo").text("PRELIEVO DA PACKING LIST - " + oPrg.Cd_DO).next().text("");

    //Carico la RL solo se già esistente
    if (fU.ToInt32(oPrg.Id_xMORL_Edit) > 0)
        // Edita i dati della pagina
        xMORL_RLPK_R_Load();

}

function xMORL_RLPK_R_Load() {
    //Carico i dati di drRL
    Ajax_xmovs_xMORL();
    // Carico i dati
    Ajax_xmovs_xMORLPackListRef_R(oPrg.Id_xMORL_Edit);
}

// -------------------------------------------------
// ENDREGION: PRELIEVO DA ID RIGA
// -------------------------------------------------


function GestioneFocusPK() {

    if (ActivePage().find("input[name='xMOBarcode']").is(":visible")) {
        SetFocus();
    }
    else {
        HideAndFocus('Popup_PackList_New');
    }
}

// Deseleziona tutti i documenti selezionati nella pagina pgPrelievi
function PrelDOSel() {
    oPrg.RL.dtDOSelPR = [];
    $("#pgPrelievi .li-prel :checkbox:not(:disabled)").prop("checked", false);
    $("#pgPrelievi .i-dotescked").attr("src", "icon/UnCheckbox.svg");
    $("#pgPrelievi .DOSel").text(oPrg.RL.dtDOSelPR.length);
}

// -------------------------------------------------
// #2.50 REGION: STOCCAGGIO MERCE
// -------------------------------------------------

function SM_Save(test_ub) {
    if (fU.ToBool(test_ub)) {
        //Memorizzo l'ubicazione proposta
        var Cd_MGUbicazione_Prop = $("#pgSM .Cd_MGUbicazione_A").text();

        //Verifica che l'ubicazione letta sia coerente con quella proposta
        if (Cd_MGUbicazione_Prop.trim() != "" && Cd_MGUbicazione_Prop != $("#pgSM input[name='Cd_MGUbicazione_A']").val())
            //Ubicazione diversa: chiede conferma all'operatore
            popup_yna.show("Conferma ubicazione.", "L'ubicazione scelta è diversa da quella proposta.\nContinuare?", null, 'yn', function () { SM_Save(false); })
    }

    //Salva la matricola (se non c'è un messaggio di conferma utente)
    if (!popup_yna.visible) Ajax_xmosp_xMOTRRig_A_MGMovInt_Save();
}

function SM_Delete() {
    var r = Ajax_xmosp_xMOTR_Delete();
    if (r[0].Result >= 0)
        pgSM_Clear();
    else
        PopupMsg_Show("ERRORE", r[0].Result, r[0].Messaggio);
}

// -------------------------------------------------
// ENDREGION: STOCCAGGIO MERCE
// -------------------------------------------------

// -------------------------------------------------
// #2.60 REGION: INFO MAGAZZINO AR, MAT, UBI-MAT
// -------------------------------------------------

function Confirm_INTMG_AR() {

    $("#pgINTMG_AR tr").remove(".tr-mgdisp");
    $("#pgINTMG_AR .filtri").text("");

    // Verifica che sia stato inserito almeno un filtro
    if (fU.IsEmpty($("#pgINTMG_AR [name='Cd_AR']").val()) && fU.IsEmpty($("#pgINTMG_AR [name='Cd_MG']").val()) && fU.IsEmpty($("#pgINTMG_AR [name='Cd_MGUbicazione']").val())) {
        PopupMsg_Show("Errore", 1, "Impostare almeno un filtro");

    } else {

        fU.ShowIf($("#pgINTMG_AR .AR"), fU.IsEmpty($("#pgINTMG_AR [name='Cd_AR']").val()));
        DivToggle_Execute($("#pgINTMG_AR .div-accordion"), false);
        $("#pgINTMG_AR .div-giac").show();
        Ajax_xmofn_INTMG_AR();
    }
}

function Ajax_xmofn_INTMG_AR() {

    $("#pgINTMG_AR .msg").text("");
    $("#pgINTMG_AR tr").remove(".tr-mgdisp");

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Cd_MG: fU.ToString($("#pgINTMG_AR input[name='Cd_MG']").val()),
        Cd_MGUbicazione: fU.ToString($("#pgINTMG_AR input[name='Cd_MGUbicazione']").val()),
        Cd_AR: fU.ToString($("#pgINTMG_AR input[name='Cd_AR']").val()),
        QtaPositiva: fU.IsChecked(ActivePage().find(".ck-qtapos"))
    });
    $.ajax({
        url: "Logistica.aspx/xmofn_INTMG_AR",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            if (dt.length > 0) {
                oPrg.INTMG_AR.dtINTMG_AR = dt;
                INTMG_AR_Load(dt);
            }
            else {
                $("#pgINTMG_AR .msg").text("Nessuna giacenza trovata");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

}

function INTMG_AR_Load(dt) {
    //Calcolo il totale
    var qtaTot = dt.map(function (item) {
        return item.Quantita;
    }).reduce(function (total, num) {
        return total + num;
    });

    if (!fU.IsEmpty($("#pgINTMG_AR [name='Cd_AR']").val()))
        $("#pgINTMG_AR .filtri").text($("#pgINTMG_AR [name='Cd_AR']").val() + " - " + dt[0].AR_Descrizione);

    //Mostro Totale e Um
    $("#pgINTMG_AR .info").text("Tot: " + qtaTot + " " + dt[0].Cd_ARMisura);

    var tr_ar = $("#pgINTMG_AR .template_ar").clone().removeAttr("style").addClass("tr-mgdisp");
    var tr_ardesc = $("#pgINTMG_AR .template_ardesc").clone().removeAttr("style").addClass("tr-mgdisp");
    var tr_mgubi = $("#pgINTMG_AR .template_mgubi").clone().removeAttr("style").addClass("tr-mgdisp");

    var last_cd_ar = '';
    for (var i = 0; i < dt.length; i++) {
        if (dt[i].Ordinamento == 1)
            $("#pgINTMG_AR table").append(INTMG_AR_MGUbi_Template(tr_mgubi.clone(), dt[i]));

        $("#pgINTMG_AR table").append(INTMG_AR_Template(tr_ar.clone(), dt[i], (last_cd_ar != dt[i].Cd_AR ? true : false)));

        if (last_cd_ar != dt[i].Cd_AR) {
            if (fU.IsEmpty($("#pgINTMG_AR [name='Cd_AR']").val())) {
                $("#pgINTMG_AR table").append(MGDispARDesc_Template(tr_ardesc.clone(), dt[i]));
            }
        }

        last_cd_ar = dt[i].Cd_AR;
    }

    rolling.tableSet($("#pgINTMG_AR table"));
}

function MGDispARDesc_Template(tr, item) {

    tr.find(".Descrizione").text(item.AR_Descrizione);

    return tr;
}

function INTMG_AR_MGUbi_Template(tr, item) {

    tr.find(".MGUbi").html(fU.IfEmpty(item.Cd_MG, "&nbsp;"));

    if (item.Cd_MGUbicazione == null)
        tr.find(".MG_Descrizione").html(fU.IfEmpty(item.MG_Descrizione, ""));
    else
        tr.find(".MG_Descrizione").html(item.Cd_MGUbicazione + " - " + item.MGUbi_Descrizione);

    return tr;
}

function INTMG_AR_Template(tr, item, show_ar) {

    tr.find(".MGUbi").text("");
    if (show_ar) tr.find(".Cd_AR").text(item.Cd_AR);
    tr.find(".Cd_ARLotto").text(item.Cd_ARLotto);
    tr.find(".Cd_DOSottoCommessa").text(item.Cd_DOSottoCommessa ? item.Cd_DOSottoCommessa + " - " + item.SC_Descrizione : "");
    tr.find(".Cd_ARMisura").text(item.Cd_ARMisura);
    tr.find(".Quantita").text(item.Quantita);

    if (item.ATO)
        tr.find(".Cd_DOSottoCommessa").text("ATO");

    //tr.find(".QuantitaDisp").text(item.QuantitaDisp);
    //tr.find(".QuantitaDimm").text(item.QuantitaDimm);

    return tr;
}

function Confirm_INTMG_UbiMat() {

    $("#pgINTMG_UbiMat tr").remove(".tr-mgdisp");
    $("#pgINTMG_UbiMat .filtri").text("");

    // Verifica che sia stato inserito almeno un filtro
    if (fU.IsEmpty($("#pgINTMG_UbiMat [name='Cd_AR']").val()) && fU.IsEmpty($("#pgINTMG_UbiMat [name='Cd_MG']").val()) && fU.IsEmpty($("#pgINTMG_UbiMat [name='Cd_MGUbicazione']").val())) {
        PopupMsg_Show("Errore", 1, "Impostare almeno un filtro");

    } else {

        fU.ShowIf($("#pgINTMG_UbiMat .AR"), fU.IsEmpty($("#pgINTMG_UbiMat [name='Cd_AR']").val()));
        DivToggle_Execute($("#pgINTMG_UbiMat .div-accordion"), false);
        $("#pgINTMG_UbiMat .div-giac").show();
        Ajax_xmofn_INTMG_UbiMat();
    }
}

function Ajax_xmofn_INTMG_UbiMat() {

    $("#pgINTMG_UbiMat .msg").text("");
    $("#pgINTMG_UbiMat tr").remove(".tr-mgdisp");

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Cd_MG: fU.ToString($("#pgINTMG_UbiMat input[name='Cd_MG']").val()),
        Cd_MGUbicazione: fU.ToString($("#pgINTMG_UbiMat input[name='Cd_MGUbicazione']").val()),
        Cd_AR: fU.ToString($("#pgINTMG_UbiMat input[name='Cd_AR']").val()),
        Cd_xMOMatricola: fU.SsccToMatricola($("#pgINTMG_UbiMat input[name='Cd_xMOMatricola']").val())
    });
    $.ajax({
        url: "Logistica.aspx/xmofn_INTMG_UbiMat",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            if (dt.length > 0) {
                INTMG_UbiMat_Load(dt);
            }
            else {
                $("#pgINTMG_UbiMat .msg").text("Nessuna giacenza trovata");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

function INTMG_UbiMat_Load(dt) {
    if (!fU.IsEmpty($("#pgINTMG_UbiMat [name='Cd_AR']").val())) {
        $("#pgINTMG_UbiMat .filtri").text($("#pgINTMG_UbiMat [name='Cd_AR']").val() + " - " + dt[0].Descrizione);
    }
    var tr_ar = $("#pgINTMG_UbiMat .template_ar").clone().removeAttr("style").addClass("tr-mgdisp");
    var tr_ardesc = $("#pgINTMG_UbiMat .template_ardesc").clone().removeAttr("style").addClass("tr-mgdisp");
    var tr_mgubi = $("#pgINTMG_UbiMat .template_mgubi").clone().removeAttr("style").addClass("tr-mgdisp");


    var last_cd_ar = '';
    for (var i = 0; i < dt.length; i++) {
        if (dt[i].Ordinamento == 1) {
            $("#pgINTMG_UbiMat table").append(INTMG_UbiMat_MGUbi_Template(tr_mgubi.clone(), dt[i]));
        }
        $("#pgINTMG_UbiMat table").append(INTMG_UbiMat_Template(tr_ar.clone(), dt[i], (last_cd_ar != dt[i].Cd_AR ? true : false)));

        if (last_cd_ar != dt[i].Cd_AR) {
            if (fU.IsEmpty($("#pgINTMG_UbiMat [name='Cd_AR']").val())) {
                $("#pgINTMG_UbiMat table").append(MGDispARDesc_Template(tr_ardesc.clone(), dt[i]));
            }
        }

        last_cd_ar = dt[i].Cd_AR;
    }
}

function INTMG_UbiMat_MGUbi_Template(tr, item) {

    tr.find(".MGUbi").html(fU.IfEmpty(item.Cd_MG, "") + "&nbsp;&nbsp;" + fU.IfEmpty(item.Cd_MGUbicazione, ""));

    return tr;
}

function INTMG_UbiMat_Template(tr, item, show_ar) {

    tr.find(".MGUbi").text("");
    tr.find(".Cd_xMOMatricola").text(item.Cd_xMOMatricola);
    if (show_ar) tr.find(".Cd_AR").text(item.Cd_AR);
    tr.find(".Cd_ARLotto").text(item.Cd_ARLotto);
    //tr.find(".Cd_ARMisura").text(item.Cd_ARMisura);
    tr.find(".Quantita").text(item.QtaEvadibile + item.Cd_ARMisura);
    //tr.find(".QuantitaDisp").text(item.QuantitaDisp);
    //tr.find(".QuantitaDimm").text(item.QuantitaDimm);

    return tr;
}

// -------------------------------------------------
// ENDREGION: INFO MAGAZZINO AR/MAT
// -------------------------------------------------

// -------------------------------------------------
// REGION: TRASFERIMENTO COMPONENTI IN PROD.
// -------------------------------------------------

function pgTRMP_C_AR_All(chk) {
    if (chk) {
        $("#pgTRMP_C_AR table tr[Completo = 'true']").show();
    } else {
        $("#pgTRMP_C_AR table tr[Completo = 'true']").hide();
    }

    pgTRMP_C_AR_Filter();
}

function pgTRMP_C_AR_ARDesc_Template(obj, item) {
    obj.attr("Cd_AR", item.Cd_AR);
    obj.find(".Descrizione").text(item.Descrizione);
    if (item.QtaTrasferita >= item.Qta) obj.attr("Completo", "true");

    return obj;
}
// -------------------------------------------------
// ENDREGION: TRASFERIMENTO COMPONENTI IN PROD.
// -------------------------------------------------

// -------------------------------------------------
// REGION: DETTAGLIO PRELIEVI
// -------------------------------------------------


// Elenco di Tutti i Documenti Prelevabili
function Ajax_xmofn_DOTes_Prel_4Detail() {

    var out = false;

    $("#Detail_Prelievi .li-prel").remove();

    if (oPrg.Id_xMORL_Edit > 0) {
        $("#Detail_Prelievi input[name='Cd_CF']").val(oPrg.drRL.Cd_CF);
    } else {
        $("#Detail_Prelievi input[name='Cd_CF']").val("");
    }

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Cd_DO: oPrg.drDO.Cd_DO,
        Cd_DO_Prel: $("#Detail_Prelievi input[name='Cd_DO']").val(),
        Cd_CF: fU.ToString($("#Detail_Prelievi input[name='Cd_CF']").val()),
        Cd_CFDest: fU.ToString($("#Detail_Prelievi input[name='Cd_CFDest']").val()),
        DataConsegna: fU.DateToSql($("#Detail_Prelievi input[name='DataConsegna']").val()),
        Id_DOTes: $("#Detail_Prelievi input[name='Id_DOTes']").val(),
        Cd_DOSottoCommessa: "",
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit),
        xCd_xMOProgramma: fU.UpTrim(oPrg.drDO.xCd_xMOProgramma),
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_DOTes_Prel",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            Detail_Prelievi_Load(dt);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
    $("#Detail_Prelievi").show();
}


function Detail_Prelievi_Load(dt) {
    if (dt.length > 0) {
        $("#Detail_Prelievi .msg").text("");
        var li = $("#Detail_Prelievi .template").clone().removeAttr("style").addClass("li-prel");
        for (var i = 0; i < dt.length; i++) {
            $("#Detail_Prelievi ul").append(Detail_Prelievo_Template(li.clone(), dt[i], i));
        }

        // Controlla se tra i documenti caricati ce ne sono alcuni già selezionati
        $("#Detail_Prelievi .li-prel input[type='checkbox']").each(function () {
            var idx = oPrg.RL.dtDOSelPR.indexOf($(this).attr("Id_DOTes"));
            if (idx != -1) {
                fU.CheckIf($(this), true);
            }
        });

        // Se è stato applicato un filtro e il dt.length è 1 seleziono automaticamente l'elemento
        if (dt.length == 1) $("#Detail_Prelievi .li-prel input[type='checkbox']").click().change();
    }
    else
        $("#Detail_Prelievi .msg").text("Nessun documento prelevabile!");
}

// Template di tutti i documenti prelevabili 
function Detail_Prelievo_Template(li, item, key) {

    fU.ShowIf(li.find(".numerodoc"), !fU.IsEmpty(item.NumeroDoc));
    fU.ShowIf(li.find(".datadoc"), !fU.IsEmpty(item.DataDoc));
    fU.ShowIf(li.find(".dataconsegna"), !fU.IsEmpty(item.DataConsegna));

    li.find(".ck-documento").attr("do-info", item.Cd_DO + " " + item.NumeroDoc);
    li.find(".ck-documento").attr("Id_DOTes", item.Id_DOTes).attr("Cd_DOs", item.Cd_DOs).prop("checked", item.Selezionato);
    // Se il documento è già selezionato perchè fa parte già dei prelievi lo inserisco nel dt
    if (item.Selezionato) {
        oPrg.RL.dtDOSelPR.push(item.Id_DOTes);
    }

    li.find(".id-dotes").text(item.Id_DOTes);
    li.find(".cd-do").text(item.Cd_DO);
    li.find(".do-desc").text(item.DO_Descrizione);
    // Modifica apportata per terminali da 3.2 pollici ### da migliorare in base alle dimensioni dello schermo 
    // Se la desc è troppo lunga scopare il check per selezionare il documento
    li.find(".cd-cf").text(item.Cd_CF + " - " + (item.CF_Descrizione.length > 20 ? item.CF_Descrizione.substring(0, 17) + "..." : item.CF_Descrizione));
    li.find(".numerodoc").html("N.Documento: " + item.NumeroDoc + "&nbsp;&nbsp;&nbsp;");
    li.find(".datadoc").text("DEL: " + fU.DateJsonToDate(item.DataDoc));
    li.find(".dataconsegna").text("CONSEGNA IL: " + fU.DateJsonToDate(item.DataConsegna));

    // Se il doc viene selezionato salvare il prelievo in xmorlprelievo e poi chiudere il detail e riportare il link al dettaglio nella pagina
    li.find(".ck-documento").change(function () {
        if (this.checked) {
            // Salva il documento come in prelievo
            $("#pgRLRigID .doprel").text($(this).attr("do-info")).show().on("click", function () {
                // Carica i dati del detail
                Detail_Ajax_xmovs_DOTes(item.Id_DOTes);
                // Chiude il detail 
                $("#DetailDO").show();
            });
        }
        $("#Detail_Prelievi").hide();
    });

    li.find(".cd-do").on("click", function () {
        // Carica i dati del detail
        Detail_Ajax_xmovs_DOTes(item.Id_DOTes);
        $("#DetailDO").show();
    });

    //Se il documento è già stato prelevato disabilito la riga
    if (!fU.IsNull(item.PrelevatoDa)) {
        // fnl
        li.addClass("lg-darkgray").find(".ck-documento").removeClass("mo-pointer").prop("disabled", "disabled");
        //Se il documento non è stato prelevato da me è NON PRELEVABILE
        if (item.Selezionato == false) {
            li.addClass("non-prelevabile");
            li.find(".container").addClass("w3-hide");
        }
    }

    return li;
}

// Elenco di Tutti i Documenti Prelevabili
function Ajax_xmofn_LSArticolo() {

    ActivePage().find("table").hide();

    var Params = {
        Cd_CF: ActivePage().find("input[name='Cd_CF']").val()
        , Cd_AR: ActivePage().find("input[name='Cd_AR']").val()
    };

    if (Params.Cd_CF == '' || Params.Cd_AR == '') {
        PopupMsg_Show("Attenzione", 1, "Inserire un codice cliente/fornitore e il codice articolo!");
        return;
    }

    $.ajax({
        url: "Logistica.aspx/xmofn_LSArticolo",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var data = $.parseJSON(mydata.d);
            pgCFARLIST_Load(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    ActivePage().find("table").show();
}

function pgCFARLIST_UI() {
    // Memorizzo la tabella di destinazione
    // Rimuovo le righe presenti
    var table = ActivePage().find('table');
    table.find('tr').remove();
    table.hide();
}

function pgCFARLIST_Load(data) {
    // Memorizzo la tabella di destinazione
    // Rimuovo le righe presenti
    var table = ActivePage().find('table');
    table.find('tr').remove();

    // Creo un array col distinct dei listini
    // Mappo l'oggeto restituito per avere solo Codice e Descrizione
    var listini = data.filter(function (item, index, self) {
        var elem = self.find(function (listino) { return listino.Cd_LS == item.Cd_LS });
        return self.indexOf(elem) === index;
    }).map(function (item) {
        return {
            Cd_LS: item.Cd_LS,
            LS_Descrizione: item.LS_Descrizione,
            AScaglioni: item.AScaglioni
        };
    });

    // Funzione per generare un elemento di tipo th
    var th = function (text) {
        return $('<th>', {
            class: 'w3-small lg-lbl-da'
        }).text(text);
    }

    // Funzione per generare un elemento di tipo td
    var td = function (text) {
        return $('<td>', {
            class: 'w3-small lg-lbl-da w3-right-align'
        }).text(text);
    }

    // Per ogni listno
    // Creo una riga nella tabella con intestazione
    listini.forEach(function (listino) {
        var tr = $('<tr>').append(
            $('<td>', {
                class: 'w3-small lg-lbl-da',
                style: 'font-weight: bold;',
                colspan: '4'
            }).text(listino.Cd_LS.concat(' - ', listino.LS_Descrizione))
        );
        table.append(tr);

        tr = $('<tr>').append([th('Prezzo'), th('Sconto'), th('Prezzo')]);

        if (listino.AScaglioni)
            tr.append(th('Qta fino a...'));

        table.append(tr);

        // Per ogni riga del listino
        // Creo una riga nella tabella
        data.filter(function (item) {
            return item.Cd_LS == listino.Cd_LS
        }).forEach(function (item) {
            tr = $('<tr>').append([
                td('€ '.concat(fU.ToStringNumber(item.Prezzo))),
                td(item.Sconto),
                td('€ '.concat(fU.ToStringNumber(item.PrezzoScontato)))
            ]);

            if (listino.AScaglioni)
                tr.append(td(fU.ToStringNumber(item.FinoAQta)))

            table.append(tr);
        });
    });
}

function Ajax_xmofn_xMORLPrelievo_Azzera() {
    // Pulisce le righe della tabella
    ActivePage().find(".ar-ele").remove();
    ActivePage().find("label .Id_xMORL").text("PRELIEVI [id: " + oPrg.Id_xMORL_Edit + "]");

    var Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: oPrg.Id_xMORL_Edit
    };

    $.ajax({
        url: "Logistica.aspx/xmofn_xMORLPrelievo_Azzera",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r.length > 0) {
                pgRLPrelievo_Load(r);
                pgRLPrelievo_UI();
            } else {
                // Nessuna evasione, vado alla pagina successiva in modo temporizzato perchè sto navigando
                setTimeout(function () { Nav.Next(); }, 150);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

function pgRLPrelievo_UI() {
    // Gestione della pagina di prelievo
    if (oPrg.drDO.xMOResiduoInPrelievo != 2) {
        ActivePage().find("label.titolo").text("RIEPILOGO PRELIEVI");
        ActivePage().find("input:checkbox").attr("disabled", true);
        ActivePage().find(".selall").hide();
    } else {
        ActivePage().find("label.titolo").text("FORZA AZZERAMENTO RIGHE NON EVASE");
        ActivePage().find("input:checkbox").attr("disabled", false);
        ActivePage().find(".selall").show();
    }
}


function pgRLPrelievo_Load(data) {
    // Creo un array col distinct degli articoli
    // Mappo l'oggeto restituito per avere solo Codice e Descrizione
    var articoli = data.filter(function (item, index, self) {
        var elem = self.find(function (elemento) { return elemento.ArGruppo == item.ArGruppo });
        return self.indexOf(elem) === index;
    }).map(function (item) {
        return {
            ArGruppo: item.ArGruppo,
            Cd_AR: item.Cd_AR,
            Descrizione: item.Descrizione,
            QtaLetta: item.QtaLetta,
            Cd_ARMisura: item.Cd_ARMisura
        };
    });

    // Funzione per generare un elemento di tipo th
    var th = function (text) {
        return $('<th>', {
            class: 'lg-lbl-da',
            style: 'font-weight: bold;',
        }).text(text);
    }

    // Funzione per generare un elemento di tipo td
    var td = function (text) {
        return $('<td>', {
            class: 'w3-small lg-lbl-da'
        }).text(text);
    }

    // Tabella degli articoli
    var table = ActivePage().find('table.articoli');

    // Rimuovo tutte le righe
    table.find('tr').remove();

    articoli.forEach(function (articolo) {
        var tr = $('<tr>').append(
            th(""),
            $('<th>').append($('<span>', {
                'text': articolo.Cd_AR.concat(' - ', articolo.Descrizione),
                'class': "lg-lbl-da editable",
                'data-cd_ar': articolo.Cd_AR,
                click: function () {
                    pgRLPrelievo_Check('data-cd_ar', articolo.Cd_AR, true);
                }
            })),
            th().addClass('w3-right-align')
                .append(''.concat('<span class="lg-tag w3-tag w3-margin-left">', articolo.QtaLetta, ' ', articolo.Cd_ARMisura, '</span>')),
        ).css('background-color', '#FAFAFA');
        table.append(tr);
        // Creo un array col distinct dei documenti
        // Mappo l'oggeto restituito per avere solo Id e Descrizione
        var docs = data.filter(function (item, index, self) {
            var elem = self.find(function (doc) { return doc.Id_DOTes == item.Id_DOTes && doc.ArGruppo == articolo.ArGruppo });
            return self.indexOf(elem) === index;
        }).map(function (doc) {
            return {
                Id_DOTes: doc.Id_DOTes,
                NumeroDoc: doc.NumeroDoc,
                Cd_AR: articolo.Cd_AR
            };
        });

        docs.forEach(function (doc) {
            tr = $('<tr>').append(
                $('<th>'),
                th(doc.NumeroDoc).attr('colspan', 2).addClass('w3-small')
            );
            table.append(tr);

            // Creo un array con le righe filtrate
            var righe = data.filter(function (riga) {
                return riga.Id_DOTes == doc.Id_DOTes && riga.ArGruppo == articolo.ArGruppo;
            });

            righe.forEach(function (riga) {
                tr = $('<tr>').append(
                    $('<td>').append($('<input>', {
                        type: 'checkbox',
                        'checked': riga.Azzera,
                        'data-cd_ar': riga.Cd_AR,
                        'data-id_dotes': riga.Id_DOTes,
                        'data-id_dorig': riga.Id_DORig,
                        click: function () {
                            pgRLPrelievo_Check('data-id_dorig', riga.Id_DORig, $(this).prop('checked'));
                        }
                    })),
                    td('Riga'.concat(' ', riga.Riga, ' - Cons: ', fU.DateJsonToDate(riga.DataConsegna))),
                    td(riga.QtaEvadibile.toString().concat(' ', riga.Cd_ARMisura)).addClass('w3-right-align'),
                )
                table.append(tr);
            });
        })
    });
}

function pgRLPrelievo_Check(attributes, values, checked) {
    if (typeof attributes == 'string') attributes = new Array(attributes);
    if (typeof values == 'string') values = new Array(values);

    var selector = attributes.map(function (attribute, idx) {
        return ''.concat('[', attribute, '=', '"', values[idx], '"', ']')
    }).join('');

    ActivePage().find('table.articoli '.concat(selector)).prop('checked', checked);
}

function pgRLPrelievo_CheckAll() {
    ActivePage().find(".articoli input:checkbox").prop("checked", fU.IsChecked(ActivePage().find(".ck-all")));
}

function Ajax_xmosp_xMORLPrelievo_AzzeraSave() {

    var out = false;

    var righe = Array.from(ActivePage().find('table.articoli input[data-id_dorig]')).map(function (input) {
        return {
            //Cd_AR: input.attributes['data-cd_ar'].value,
            Id_DORig: Number(input.attributes['data-id_dorig'].value),
            Azzera: input.checked
        }
    });

    var Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: oPrg.Id_xMORL_Edit,
        righe: righe
    };

    $.ajax({
        url: "Logistica.aspx/xmosp_xMORLPrelievo_AzzeraSave",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            //non testo i risultati
            out = true;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}


/*
      LogisticaWKI.js
      Contiene tutte le funzioni e gli oggetti della pagina logistica.aspx
 
       DATA ULTIMA MODIFICA
       10/07/2020
 
*/

//Valorizzo la label InfoExt con le info delle UM disponibili
function Ajax_xmosp_xMORLRig_InfoEx() {

    Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit),
        Cd_AR: fU.ToString(ActivePage().find("input[name='Cd_AR']").val()),
        Cd_MG_P: fU.ToString(ActivePage().find("input[name='Cd_MG_P']").val()),
        Cd_MGUbicazione_P: fU.ToString(ActivePage().find("input[name='Cd_MGUbicazione_P']").val()),
        Cd_MG_A: fU.ToString(ActivePage().find("input[name='Cd_MG_A']").val()),
        Cd_MGUbicazione_A: fU.ToString(ActivePage().find("input[name='Cd_MGUbicazione_A']").val()),
        Cd_ARLotto: fU.ToString(ActivePage().find("input[name='Cd_ARLotto']").val()),
        DataScadenza: fU.DateToSql(ActivePage().find("input[name='DataScadenza']").val()),
        Matricola: fU.ToString(ActivePage().find("input[name='Cd_xMOMatricola']").val()),
        Cd_ARMisura: fU.ToString(ActivePage().find("select[name='Cd_ARMisura'] :selected").val()),
        Quantita: fU.ToString(fU.ToDecimal(ActivePage().find("input[name='Quantita']").val().replace(',', '.'))),
        Cd_DOSottoCommessa: fU.ToString(ActivePage().find("input[name='Cd_DOSottoCommessa']").val()),
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
            ActivePage().find("label[name='InfoExt']").html(r[0].extra_info);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}



// Elenco Lotti
function Search_Ajax_xmofn_ARLottoSP() {

    var out = false;

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit),
        Cd_AR: fU.ToString($("#" + oPrg.ActivePageId + " input[name='Cd_AR']").val()),
        Cd_MG: fU.ToString(fMG.Mg4Find($("#" + oPrg.ActivePageId + " input[name='Cd_MG_P']").val(), $("#" + oPrg.ActivePageId + " input[name='Cd_MG_A']").val())),
        Cd_MGUbicazione: '',
        Filtro: '',
        GiacPositiva: true
    });

    $.ajax({
        url: "Logistica.aspx/xmofn_ARLotto",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var dt = $.parseJSON(mydata.d);
            ActivePage().find("input[name='Cd_ARLotto']").val(dt[0].Cd_ARLotto);
            ActivePage().find("input[name='DataScadenza']").val(fU.DateJsonToDateRev(dt[0].DataScadenza));
            out = true;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }

    });

    return out;
}

// Ricerca Vettori in base al filtro passato 
function Ajax_xmofn_DoVettore(filtro) {

    var out = '';

    Params = JSON.stringify({
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Filtro: filtro
    });
    $.ajax({
        url: "Logistica.aspx/xmofn_DoVettore",
        async: false,
        data: Params,
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            out = $.parseJSON(mydata.d);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }

    });

    return out;
}

// Elenco Vettori passato alla funzione per il search
function Search_Ajax_xmofn_DoVettore() {

    //Pulisce il search
    $("#SearchCd_DoVettore .li-search").remove();

    //carica i vettori passando il filtro utente se presente
    var dt = Ajax_xmofn_DoVettore(fU.ToString(oPrg.ActiveSearchValue));
    if (dt.length > 0) {
        //Nascondo il messaggio
        $("#" + oPrg.ActiveSearchId + " .mo-msg").hide();
        //Carica i vettori
        var li = $("#" + oPrg.ActiveSearchId + " .template").clone().addClass("li-search").removeAttr("style");
        for (var i = 0; i < dt.length; i++) {
            $("#" + oPrg.ActiveSearchId + " ul").append(Search_DoVettore_Template(li.clone(), dt[i], i));
        }
    }
    else {
        //Messaggio nel caso non è stato trovato nessuna vettore
        $("#" + oPrg.ActiveSearchId + " .mo-msg").text("Nessun Vettore").show();
    }

    return true;
}

function Search_DoVettore_Template(li, item, key) {

    li.attr("Cd_DoVettore_1", item.Cd_DoVettore);
    li.attr("Descrizione", item.Descrizione);

    li.find(".cd").html(item.Cd_DoVettore);
    li.find(".desc").text(item.Descrizione);

    return li;
}

// L'utente chiede di proporre l'ubicazione P
function xMOMacroUbi_P_Exe() {
    if (Ajax_xmosp_xMOMacroUbi_P())
        doveVado_Show();
}

// L'utente chiede di proporre l'ubicazione A
function xMOMacroUbi_A_Exe() {
    if (Ajax_xmosp_xMOMacroUbi_A())
        doveVado_Show();
}


//Partenza dove-sei <> dove-vai-ubicazione
function Ajax_xmosp_xMOMacroUbi_P() {

    var out = false;

    // Memorizzo l'oggetto corrente 
    // e dove devo salvare i dati 
    oPrg.doveVai.focusin = document.activeElement;
    oPrg.doveVai.PA = 'P';

    //Reset campi form
    ActivePage().find(".dove-vado").text("");

    if (fU.IsEmpty(oPrg.doveSei.Cd_MG)) {
        ActivePage().find(".dove-vado").text("< Dove sei?");
        return
    }

    var Params = {
        Cd_xMOMacroUbi: oPrg.drDO.Cd_xMOMacroUbi_P,
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit),
        TSP: oPrg.drDO.MacroUbi_P,
        Cd_AR: fU.ToString(ActivePage().find("input[name='Cd_AR']").val()),
        Cd_ARLotto: fU.ToString(ActivePage().find("input[name='Cd_ARLotto']").val()),
        Matricola: fU.ToString(ActivePage().find("input[name='Cd_xMOMatricola']").val()),
        Cd_ARMisura: fU.ToString(ActivePage().find("select[name='Cd_ARMisura'] :selected").val()),
        Quantita: fU.ToString(fU.ToDecimal(ActivePage().find("input[name='Quantita']").val().replace(',', '.'))),
        Cd_DOSottoCommessa: fU.ToString(ActivePage().find("input[name='Cd_DOSottoCommessa']").val()),
        //Parto da dove sono oppure dal magazzino di partenza 
        Cd_MG_da: oPrg.doveSei.Cd_MG,
        Cd_MGUbicazione_da: oPrg.doveSei.Cd_MGUbicazione,
        //Una ubicazione del magazzino di arrivo
        Cd_MG_a: fU.ToString(ActivePage().find("input[name='Cd_MG_P']").val()),
    };

    $.ajax({
        url: "Logistica.aspx/xmosp_xMOMacroUbi_execute",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d)[0];
            //Memorizza i dati proposti
            oPrg.doveVai.Cd_MG_a = r.Cd_MG_a;
            oPrg.doveVai.Cd_MGUbicazione_a = r.Cd_MGUbicazione_a;
            switch (true) {
                case (r.Result < 0):
                    //Errore!
                    doveVado_Text("Err!");
                    break;
                case (r.Result == 0):
                    //Non ho un risultato valido
                    doveVado_Text("???");
                    break;
                case (r.Result == 1):
                    //Trovato
                    doveVado_Text((oPrg.doveSei.Cd_MG == r.Cd_MG_a ? '' : r.Cd_MG_a) + ">" + r.Cd_MGUbicazione_a);
                    out = true;
                    break;
                default:
                    doveVado_Text("Res " + r.Result + "??");
                    break;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;

}

//Arrivo dove-sei <> dove-vai-ubicazione
function Ajax_xmosp_xMOMacroUbi_A() {

    var out = false;

    // Memorizzo l'oggetto corrente 
    // e dove devo salvare i dati 
    oPrg.doveVai.focusin = document.activeElement;
    oPrg.doveVai.PA = 'A';

    //Reset campi form
    ActivePage().find(".dove-vado").text("");

    if (fU.IsEmpty(oPrg.doveSei.Cd_MG)) {
        ActivePage().find(".dove-vado").text("< Dove sei?");
        return
    }

    var Params = {
        Cd_xMOMacroUbi: oPrg.drDO.Cd_xMOMacroUbi_A,
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit),
        TSP: oPrg.drDO.MacroUbi_A,
        Cd_AR: fU.ToString(ActivePage().find("input[name='Cd_AR']").val()),
        Cd_ARLotto: fU.ToString(ActivePage().find("input[name='Cd_ARLotto']").val()),
        Matricola: fU.ToString(ActivePage().find("input[name='Cd_xMOMatricola']").val()),
        Cd_ARMisura: fU.ToString(ActivePage().find("select[name='Cd_ARMisura'] :selected").val()),
        Quantita: fU.ToString(fU.ToDecimal(ActivePage().find("input[name='Quantita']").val().replace(',', '.'))),
        Cd_DOSottoCommessa: fU.ToString(ActivePage().find("input[name='Cd_DOSottoCommessa']").val()),
        //Parto da dove sono oppure dal magazzino di partenza 
        Cd_MG_da: oPrg.doveSei.Cd_MG,
        Cd_MGUbicazione_da: oPrg.doveSei.Cd_MGUbicazione,
        //Una ubicazione del magazzino di arrivo
        Cd_MG_a: fU.ToString(ActivePage().find("input[name='Cd_MG_A']").val()),
    };

    $.ajax({
        url: "Logistica.aspx/xmosp_xMOMacroUbi_execute",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d)[0];
            //Memorizza i dati proposti
            oPrg.doveVai.Cd_MG_a = r.Cd_MG_a;
            oPrg.doveVai.Cd_MGUbicazione_a = r.Cd_MGUbicazione_a;
            switch (true) {
                case (r.Result < 0):
                    //Errore!
                    doveVado_Text("Err!");
                    break;
                case (r.Result == 0):
                    //Non ho un risultato valido
                    doveVado_Text("???");
                    break;
                case (r.Result == 1):
                    //Trovato
                    doveVado_Text((oPrg.doveSei.Cd_MG == r.Cd_MG_a ? '' : r.Cd_MG_a) + ">" + r.Cd_MGUbicazione_a);
                    out = true;
                    break;
                default:
                    doveVado_Text("Res " + r.Result + "??");
                    break;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}

function doveSono_Sel() {
    DivToggle_Execute(ActivePage().find(".div-dove-sei"), true);
    ActivePage().find('input[name="Cd_MGUbicazione"]').focus().select();
    if (ActivePage().find('input[name="Cd_MG"]').val() == "") {
        ActivePage().find('input[name="Cd_MG"]').focus().select();
    }
}

function doveSono_Set() {
    ActivePage().find(".dove-sono").text("???");
    oPrg.doveSei.Cd_MG = ActivePage().find("input[name='Cd_MG']").val();
    oPrg.doveSei.Cd_MGUbicazione = ActivePage().find("input[name='Cd_MGUbicazione']").val();
    if (!fU.IsEmpty(oPrg.doveSei.Cd_MG)) {
        ActivePage().find(".dove-sono").text(oPrg.doveSei.Cd_MG);
        if (!fU.IsEmpty(oPrg.doveSei.Cd_MGUbicazione))
            ActivePage().find(".dove-sono").text(oPrg.doveSei.Cd_MG + ">" + oPrg.doveSei.Cd_MGUbicazione);
    }
    DivToggle_Execute(ActivePage().find(".div-dove-sei"), false);

}



function Ajax_xmofn_ARLottoValidate(Cd_AR, Cd_ARLotto) {
    var lotto = "";
    //Imposta i parametri
    Params = {
        Cd_AR: Cd_AR,
        Cd_ARLotto: Cd_ARLotto
    };
    $.ajax({
        url: "Logistica.aspx/query_ARLottoValidate",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var item = $.parseJSON(mydata.d)[0];
            // restituisce il codice letto
            if (item) lotto = item.Cd_ARLotto;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
    return lotto;
}

//Mostra il testo
function doveSono_Text() {
    if (!fU.IsEmpty(oPrg.doveSei.Cd_MG)) {
        ActivePage().find(".dove-sono").text(oPrg.doveSei.Cd_MG);
        if (!fU.IsEmpty(oPrg.doveSei.Cd_MGUbicazione))
            ActivePage().find(".dove-sono").text(oPrg.doveSei.Cd_MG + ">" + oPrg.doveSei.Cd_MGUbicazione);
    } else {
        ActivePage().find(".dove-sono").text("???");
    }
    ActivePage().find("input[name='Cd_MG']").val(oPrg.doveSei.Cd_MG);
    ActivePage().find("input[name='Cd_MGUbicazione']").val(oPrg.doveSei.Cd_MGUbicazione);
}

//Mostra il testo
function doveVado_Text(m) {
    ActivePage().find(".dove-vado").text(m + (m != "" ? " (" + oPrg.doveVai.PA + ")" : ""));
}

function doveVado_Shortcut() {
    var popup = $("#Popup_VaiAUbi");
    popup.find("input[name='Cd_MGUbicazione_a']").val(oPrg.doveVai.Cd_MGUbicazione_a);
    doveVado_Set();
}

//Mostra dove può andare l'operatore
function doveVado_Show() {
    setTimeout(function () {
        var popup = $("#Popup_VaiAUbi");
        popup.find("input[name='Cd_MG_a']").val(fU.ToString(oPrg.doveVai.Cd_MG_a));
        popup.find(".vai-a-ubicazione").text(fU.ToString(oPrg.doveVai.Cd_MGUbicazione_a));
        popup.find("label.info").text(fU.ToString(oPrg.doveVai.info));
        // Mostro il popup
        popup.show();
        popup.find("input[name='Cd_MGUbicazione_a']").val("").focus();
    }, 250);
}

//L'operatore ha scelto l'ubicazione che viene settata su P o su A in base a chi ha chiamato il popup
function doveVado_Set(noubi) {
    var popup = $("#Popup_VaiAUbi");
    var mgPA = (oPrg.doveVai.PA != "" ? "_" + oPrg.doveVai.PA : "");

    // Ora mi sono spostato... riassegno dove sono 
    // lo mostro a video
    oPrg.doveSei.Cd_MG = popup.find("input[name='Cd_MG_a']").val();
    oPrg.doveSei.Cd_MGUbicazione = (noubi ? "" : popup.find("input[name='Cd_MGUbicazione_a']").val());
    doveSono_Text();

    //Aggiorno i dati della pagina
    ActivePage().find("input[name='Cd_MG" + mgPA + "']").val(oPrg.doveSei.Cd_MG);
    ActivePage().find("input[name='Cd_MGUbicazione" + mgPA + "']").val(oPrg.doveSei.Cd_MGUbicazione);
    doveVado_Text("");

    //Chiudo il popup e riassegno il focus
    popup.hide();

    //Se P deve Avviare A riparte
    if (oPrg.doveVai.PexeA)
        setTimeout(function () {
            if (Ajax_xmosp_xMOMacroUbi_A())
                doveVado_Show();
        }, 250); //Va temporizzata per far scatenare il fuoco sull'oggetto successivo
    else
        setTimeout(function () { $(oPrg.doveVai.focusin).focus(); }, 250);
}

//Nessuna scelta
function doveVado_Hide() {
    var popup = $("#Popup_VaiAUbi");
    popup.hide();
    //Aggiorno i dati della pagina
    doveVado_Text("");
    setTimeout(function () { $(oPrg.doveVai.focusin).focus(); }, 250);
}

// BC codificati in LWA per il trasferimento di partenza
function Ajax_xmofn_MovTraBarcode_P() { Ajax_xmofn_MovTraBarcode("P"); }
function Ajax_xmofn_MovTraBarcode_A() { Ajax_xmofn_MovTraBarcode("A"); }
function Ajax_xmofn_MovTraBarcode(PA) {
    var bc = $("#" + oPrg.ActivePageId).find(".barcode");
    if (!fU.IsEmpty(bc)) {
        //Reset BC 
        $(bc).find("option").remove();
        var Params = {
            Terminale: oApp.Terminale,
            Cd_Operatore: oApp.Cd_Operatore
        };
        $.ajax({
            url: "Logistica.aspx/xmofn_MovTraBarcode_" + PA,
            async: false,
            data: JSON.stringify(Params),
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (mydata) {
                var dtBc = $.parseJSON(mydata.d);
                if (Object.keys(dtBc).length) {
                    // Carico i BC nella struttura globale
                    oPrg.BC = new Barcode(dtBc);
                    // Carica i barcode  nel select
                    Barcode_Load(bc);
                }
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

// Priduzione Avanzata Trasferimento materiale bolle
function PRTRAttivita_Load() {
    // Pagina
    var page = $('#' + oPrg.ActivePageId);

    // Oggetto del combo
    var select = $(page).find("select[data-bind='Cd_PrRisorsa']");
    $(select).find("option").remove();

    //A standard selezione le bolle interne da trasferire
    $(ActivePage()).find('input[data-bind="Interne"]').prop('checked', UserParam.getLocal("PRTR_Interne", true, Boolean));
    $(ActivePage()).find('input[data-bind="DaTrasferire"]').prop('checked', UserParam.getLocal("PRTR_DaTrasferire", true, Boolean));

    //Aggiunge l'elemento vuoto
    var o = document.createElement('option');
    $(o).text('Tutte');
    o.setAttribute('value', null);
    $(select).append(o);

    var linee = [];
    // Distinct delle linee di produzione
    if (fU.IsObject(oPrg.PRAV.dtBLA)) {
        oPrg.PRAV.dtBLA.forEach(function (item) {
            if (!linee.includes(item.Cd_PrRisorsa)) {
                linee.push(item.Cd_PrRisorsa)
                // Creo l'elemento
                var option = document.createElement('option');
                option.setAttribute('value', item.Cd_PrRisorsa);
                option.setAttribute('data-interno', item.Interno);
                if (!item.Interno)
                    option.setAttribute('class', 'w3-light-gray');
                $(option).text(item.Cd_PrRisorsa);
                // Aggiungo l'elemento al combo
                $(select).append(option);
            }
        });
    }

    // Carico gli elementi
    PRTRAttivita_Load_Items();
}

function PRTRAttivita_Load_Items() {
    // Elimina tutti gli elementi
    $(ActivePage()).find("li.attivita").remove();

    // Memorizzo i filtri
    var Cd_PrRisorsa = $(ActivePage()).find('select[data-bind="Cd_PrRisorsa"]').val();
    if (!fU.IsEmpty(Cd_PrRisorsa)) {
        // Imposta Interno/Esterno a seconda della risorsa selezionata 
        $(ActivePage()).find('input[data-bind="Interne"]').prop('checked', $(ActivePage()).find('select[data-bind="Cd_PrRisorsa"] option:checked').attr('data-interno') == "true");
    }

    var searchQuery = $(ActivePage()).find('input[data-bind="SearchQuery"]').val();
    var ckInterne = $(ActivePage()).find('input[data-bind="Interne"]').prop('checked');
    var ckTrasferita = !$(ActivePage()).find('input[data-bind="DaTrasferire"]').prop('checked');
    //Salva le preferenze
    UserParam.setLocal("PRTR_Interne", ckInterne);
    UserParam.setLocal("PRTR_DaTrasferire", !ckTrasferita);

    // Copio gli elementi per applicare i filtri senza modificare l'originale
    var dt = oPrg.PRAV.dtBLA.slice();

    if (!fU.IsEmpty(searchQuery)) {
        // Nascondo gli altri filtri
        $(ActivePage()).find('[data-key="Filtri"]').hide();

        //Elimina gli eventuali zeri a sinistra
        while (searchQuery.charAt(0) == "0") { searchQuery = searchQuery.slice(1); }

        // Formatto il valore
        searchQuery = searchQuery.toLowerCase().trim();

        // Filtro gli elementi
        dt = dt.filter(function (item) {
            return item.Bolla.toLowerCase().includes(searchQuery)
                || item.Articolo.toLowerCase().includes(searchQuery)
                || item.Descrizione.toLowerCase().includes(searchQuery)
                || item.Id_PrBL.toString() == searchQuery
                || "f" + item.Id_PrBLAttivita.toString() == searchQuery;
        });
    } else {
        // Mostro i filtri
        $(ActivePage()).find('[data-key="Filtri"]').show();

        // Filtro gli elementi
        if (!fU.IsEmpty(Cd_PrRisorsa))
            dt = dt.filter(function (item) { return item.Cd_PrRisorsa == Cd_PrRisorsa; });

        dt = dt.filter(function (item) { return item.Interno == ckInterne; });
        dt = dt.filter(function (item) { return item.Trasferita == ckTrasferita; });
    }

    // Template dell'elemento
    var template = $(ActivePage()).find("li.template").clone().removeClass("template").removeAttr("style").addClass("attivita");

    // Lista degli elementi
    var ul = $(ActivePage()).find("ul");

    // Per ogni elemento
    dt.forEach(function (item) {
        // Clono il template
        var li = $(template).clone();
        // Imposto i valori
        $(li).find('[data-bind="Id_PrBL"]').html(item.Id_PrBL);
        $(li).find('[data-bind="Id_PrBLAttivita"]').html(item.Id_PrBLAttivita);
        $(li).find('[data-bind="Bolla"]').html("Bolla " + item.Bolla);
        $(li).find('[data-bind="Articolo"]').html(item.Articolo);
        $(li).find('[data-bind="Cd_PrRisorsa"]').html(item.Cd_PrRisorsa);
        $(li).find('[data-bind="DataObiettivo"]').html(fU.ToDate(item.DataObiettivo));
        $(li).find('[data-bind="Descrizione"]').html(item.Descrizione);
        $(li).on('click', function () {
            oPrg.PRAV.keyBLA = oPrg.PRAV.dtBLA.indexOf(item);
            Nav.Next();
        });
        // Aggiungo l'elemento alla lista
        $(ul).append(li);
    });
}

function Ajax_xmofn_xMOPRBLAttivita() {

    var out = false;

    oPrg.PRAV.dtBLA = {};
    $(ActivePage()).find('input[data-bind="SearchQuery"]').val("");

    var Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
    };

    $.ajax({
        url: "Logistica.aspx/xmofn_xMOPRBLAttivita",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            oPrg.PRAV.dtBLA = $.parseJSON(mydata.d);
            PRTRAttivita_Load();
            out = true;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    $(ActivePage()).find('input[data-bind="SearchQuery"]').focus().select();

    return out;
}

function Ajax_xmofn_xMOPRBLMateriali() {
    if (oPrg.PRAV.keyBLA >= 0) {
        var Params = {
            Terminale: oApp.Terminale,
            Cd_Operatore: oApp.Cd_Operatore,
            Id_PRBLAttivita: oPrg.PRAV.dtBLA[oPrg.PRAV.keyBLA].Id_PrBLAttivita
        };

        $.ajax({
            url: "Logistica.aspx/xmofn_xMOPRBLMateriali",
            async: false,
            data: JSON.stringify(Params),
            type: "POST",
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (mydata) {
                oPrg.PRAV.dtBLM = $.parseJSON(mydata.d);
                PRTRMateriali_Load();
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
            }
        });
    }
}

function PRTRMateriali_Load() {
    // Elemento dell'attività
    var attivita = oPrg.PRAV.dtBLA[oPrg.PRAV.keyBLA];

    // ID dell'attività
    $(ActivePage()).find('span[data-bind="Id_PrBL"]').text(attivita.Id_PrBL);
    $(ActivePage()).find('span[data-bind="Id_PrBLAttivita"]').text(attivita.Id_PrBLAttivita);

    // Valorizzo il riepilogo dell'attività
    $(ActivePage()).find('[data-key="Riepilogo"] label[data-bind="Bolla"]').text(attivita.Bolla);
    $(ActivePage()).find('[data-key="Riepilogo"] label[data-bind="Articolo"]').text(attivita.Articolo);
    $(ActivePage()).find('[data-key="Riepilogo"] label[data-bind="Qta"]').text(attivita.QuantitaProdotta + "/" + attivita.Quantita + " " + attivita.Cd_ARMisura);
    $(ActivePage()).find('[data-key="Piede"] label[data-bind="NoteBL"]').html((attivita.NotePrBL ? attivita.NotePrBL + "<br />" : "") + (attivita.NotePrBLAttivita ? attivita.NotePrBLAttivita : ""));

    // Memorizzo la tabella
    var table = $(ActivePage()).find('table[data-key="Materiali"]');

    // Elimina tutte le righe
    $(table).find("tr.tr-rig").remove();

    // Template della riga
    var t_r1 = $(table).find('tr.template-r1').clone().removeClass("template-r1").removeAttr("style").addClass("tr-rig");
    var t_r2 = $(table).find('tr.template-r2').clone().removeClass("template-r2").removeAttr("style").addClass("tr-rig");

    var renderBL = function (array) {
        array.forEach(function (item) {
            // Clono il template
            var tr = $(t_r1).clone();
            // Imposto i valori
            $(tr).find('[data-bind="Cd_AR"]').text(item.Cd_AR);
            $(tr).find('[data-bind="Cd_ARLotto"]').text(item.Cd_ARLotto);
            $(tr).find('[data-bind="Cd_MGUbicazione"]').text(item.Cd_MGUbicazione_P ? item.Cd_MGUbicazione_P : item.Cd_MGUbicazione_D);
            $(tr).find('[data-bind="Qta"]').text(item.QtaTrasferita + '/' + item.Consumo);
            $(tr).find('[data-bind="Cd_ARMisura"]').text(item.Cd_ARMisura);
            if (!item.PRTREscluso) {
                $(tr).on('click', function () {
                    oPrg.PRAV.keyBLM = oPrg.PRAV.dtBLM.indexOf(item);
                    PRTRMateriali_Trasferimento_Load();
                });
            }
            // Trasferimento completato
            if (item.QtaTrasferita >= item.Consumo)
                $(tr).css('color', '#31ab13');
            else if (item.Giacenza <= (item.Consumo - item.QtaTrasferita))
                $(tr).css('color', 'red');

            // Aggiungo la riga alla tabella
            $(table).append(tr);

            // Descrizione
            var tr = $(t_r2).clone();

            // Imposto i valori
            $(tr).find('[data-bind="AR_Descrizione"]').text(item.Descrizione);

            if (!item.PRTREscluso) {
                $(tr).on('click', function () {
                    oPrg.PRAV.keyBLM = oPrg.PRAV.dtBLM.indexOf(item);
                    PRTRMateriali_Trasferimento_Load();
                });
            }
            // Trasferimento completato
            if (item.QtaTrasferita >= item.Consumo)
                $(tr).css('color', '#31ab13');

            // Aggiungo la riga alla tabella
            $(table).append(tr);
        });
    }

    // Gruppi di bolle
    var BL = oPrg.PRAV.dtBLM.filter(function (item) {
        return !item.MagVerticale && !item.PRTREscluso
    });
    var BL_MGVert = oPrg.PRAV.dtBLM.filter(function (item) {
        return item.MagVerticale
    });
    var BL_Escluso = oPrg.PRAV.dtBLM.filter(function (item) {
        return item.PRTREscluso
    });

    // Rendering
    renderBL(BL);

    // Magazzino verticale
    if (BL_MGVert.length > 0) {
        // Intestazione
        table.append($('<tr>', { class: 'tr-rig' }).append($('<td>', { class: 'lg-lbl-da w3-blue', style: 'text-transform: uppercase;', colspan: 4 }).text('Magazzino Verticale')));
        // Pers GHELFI
        if (fU.checkPers(oApp.xMOImpostazioni.PrdPers, 9350)) P00009211_PRTRMateriali_Load();
        // Render
        renderBL(BL_MGVert);
    }

    // Escluse
    if (BL_Escluso.length > 0) {
        // Intestazione
        table.append($('<tr>', { class: 'tr-rig' }).append($('<td>', { class: 'lg-lbl-da w3-purple', style: 'text-transform: uppercase;', colspan: 5 }).text('ESCLUSI')));
        // Pers GHELFI
        if (fU.checkPers(oApp.xMOImpostazioni.PrdPers, 9350)) P00009211_PRTRMateriali_Load_Esclusi();
        // Render
        renderBL(BL_Escluso);
    }

    //Imposto il rolling sulla table
    rolling.tableSet(table);

    // Switch dei div
    $(ActivePage()).find('[data-key="Trasferimento"]').hide();
    $(ActivePage()).find('[data-key="Lista"]').show();

}

function PRTRMateriali_Trasferimento_Load() {
    // Pulizia degli input della pagina
    $(ActivePage()).find('input, textarea').val('');

    // Materiale
    var materiale = oPrg.PRAV.dtBLM[oPrg.PRAV.keyBLM];

    // Mostro i valori sulla pagina
    $(ActivePage()).find('[data-bind="Cd_AR"]').text(materiale.Cd_AR);
    $(ActivePage()).find('input[name="Cd_AR"]').val(materiale.Cd_AR);
    $(ActivePage()).find('[data-bind="Descrizione"]').text(materiale.Descrizione);
    $(ActivePage()).find('[data-bind="Cd_ARLotto"]').text(materiale.Cd_ARLotto);
    $(ActivePage()).find('[data-bind="Cd_MG_P"]').text(materiale.Cd_MG_P);
    $(ActivePage()).find('[data-bind="Cd_MGUbicazione_P"]').text(materiale.Cd_MGUbicazione_P ? materiale.Cd_MGUbicazione_P : materiale.Cd_MGUbicazione_D);
    $(ActivePage()).find('[data-bind="Cd_MG_A"]').text(materiale.Cd_MG_A);
    //$(ActivePage()).find('[data-bind="Cd_MGUbicazione_A"]').text(materiale.Cd_MGUbicazione_A);

    // Setto la quantità
    $(ActivePage()).find('input[name="QtaRilevata"]').val((materiale.Consumo > materiale.QtaTrasferita ? materiale.Consumo - materiale.QtaTrasferita : 0));

    // Label della linea
    var lblCd_PrRisorsa = $(ActivePage()).find('label[data-bind="Cd_PrRisorsa"]');
    $(lblCd_PrRisorsa).text(materiale.Cd_PrRisorsa);

    // Carico le unità di misura
    if (Ajax_xmofn_ARARMisura('', ''))
        ActivePage().find("select[name='Cd_ARMisura']").val(materiale.Cd_ARMisura);

    // Switch dei div
    $(ActivePage()).find('[data-key="Lista"]').hide();
    $(ActivePage()).find('[data-key="Trasferimento"]').show();

    // Focus
    setTimeout(function () { $(ActivePage()).find('input[name="QtaRilevata"]').focus().select(); }, 250);
}

function Ajax_xmosp_xMOPRTRMateriale_Save() {
    // Dati statici
    var attivita = oPrg.PRAV.dtBLA[oPrg.PRAV.keyBLA];
    var materiale = oPrg.PRAV.dtBLM[oPrg.PRAV.keyBLM];

    // Recupero i valori della pagina
    var trasferimento = GetBindedValues('[data-key="Trasferimento"]');

    var Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_PrBLAttivita: attivita.Id_PrBLAttivita,
        Id_PrBLMateriale: materiale.Id_PrBLMateriale,
        Cd_PrRisorsa: attivita.Cd_PrRisorsa,
        Cd_ARLotto: trasferimento.Cd_ARLotto,
        Quantita: trasferimento.QtaRilevata,
        Cd_ARMisura: trasferimento.Cd_ARMisura,
        FattoreToUM1: fU.ToDecimal(trasferimento.FattoreToUM1),
        Cd_MG_P: trasferimento.Cd_MG_P,
        Cd_MGUbicazione_P: trasferimento.Cd_MGUbicazione_P,
        Cd_MG_A: trasferimento.Cd_MG_A,
        Cd_MGUbicazione_A: "", //trasferimento.Cd_MGUbicazione_A, PER ORA VUOTA
        Note: trasferimento.Note,
    };

    $.ajax({
        url: "Logistica.aspx/xmosp_xMOPRTRMateriale_Save",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r[0].Result > 0) {
                Ajax_xmofn_xMOPRBLMateriali();
            } else {
                PopupMsg_Show("ERRORE", r[0].Result, r[0].Messaggio);
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

function VerificaPin(callback) {
    var errorMessage = "Il PIN inserito non è valido!!";
    //var xMOCodSblocco = prompt("Inserisci PIN per continuare");
    var xMOCodSblocco = $('#Popup_PIN').find("#Popup_PIN_input").val();

    if (fU.IsEmpty(xMOCodSblocco)) {
        PopupMsg_Show("ERRORE", -1, errorMessage);
        return;
    }

    Ajax_xmofn_xMOSblocco(xMOCodSblocco, function (data) {
        if (!data.Res) {
            PopupMsg_Show("ERRORE", -1, errorMessage);
            return;
        }
        if (callback) callback();
    });

    // Azzero il valore della casella di testo del popup per il PIN
    $('#Popup_PIN').find("#Popup_PIN_input").val('');
}

function Ajax_xmofn_xMOSblocco(xMOCodSblocco, callback) {
    $('div.preloader').show();
    var Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        CodSblocco: xMOCodSblocco
    };
    $.ajax({
        url: "Logistica.aspx/xmofn_xMOSblocco",
        async: true,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var data = JSON.parse(mydata.d)[0];
            if (callback) callback(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
    $('div.preloader').hide();
}

function QtaTotalePrelevabile() {
    var q = 0;
    if (oPrg.ActivePageId == 'pgRLRig' && oPrg.drDO.xMOPrelievo > 0) {
        //Cerca il totale prelevabile
        var Cd_AR = $("#" + oPrg.ActivePageId).find("input[name='Cd_AR']").val();
        var ar = oPrg.RL.getARItemByAR(Cd_AR);
        if (ar && ar.QtaResidua)
            q = ar.QtaResidua ? ar.QtaResidua : 0;
    }
    return q
}

function AR_InfoPrel() {
    var info = '';
    if (oPrg.ActivePageId == "pgRLRig") {
        //Cerca il totale prelevabile
        var Cd_AR = $("#" + oPrg.ActivePageId).find("input[name='Cd_AR']").val();
        var ar = oPrg.RL.getARItemByAR(Cd_AR.trim());
        if (ar && ar.QtaResidua)
            info = ar.QtaResidua > 0 ? " [RESIDUO ".concat(ar.QtaResidua, " ", ar.Cd_ARMisura, "]") : "";
    }
    return info;
}

function Ajax_xmosp_xMORL_AR_Rettifica_Save(callback) {
    var Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Cd_DO: ActivePage().find('select[name="Cd_DO"]').val(),
        Cd_CF: ActivePage().find('input[name="Cd_CF"]').val(),
        Cd_AR: ActivePage().find('input[name="Cd_AR"]').val(),
        Cd_ARLotto: ActivePage().find('input[name="Cd_ARLotto"]').val(),
        Quantita: ActivePage().find('input[name="Quantita"]').val(),
        Cd_ARMisura: ActivePage().find('label[name="Cd_ARMisura"]').text().toUpperCase(),
        NotePiede: ActivePage().find('textarea[name="NotePiede"]').val(),
        Cd_xMOListener: ActivePage().find('select[name="Listener"]').val(),
    };
    $.ajax({
        url: "Logistica.aspx/xmosp_xMORL_AR_Rettifica_Save",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var data = $.parseJSON(mydata.d)[0];
            if (data.Result > 0) callback();
            else PopupMsg_Show("ERRORE", data.Result, data.Messaggio);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
}

// Recupero pagamento e totale del documento
function Ajax_xmofn_xMORLRig_R_PagamentoTotale() {

    var out = false;

    //Imposta i parametri
    Params = {
        Terminale: oApp.Terminale,
        Cd_Operatore: oApp.Cd_Operatore,
        Id_xMORL: fU.ToInt32(oPrg.Id_xMORL_Edit)
    };
    $.ajax({
        url: "Logistica.aspx/xmofn_xMORLRig_R_PagamentoTotale",
        async: false,
        data: JSON.stringify(Params),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (mydata) {
            var r = $.parseJSON(mydata.d);
            if (r.length > 0) {
                out = true; // tutto ok
                $("#divDatiTotali").css("display", "block");
                $("#des_pagamento").text(r[0].Des_Pagamento);
                $("#totImponibileV").text(r[0].TotImponibileV);
            }
            else $("#divDatiTotali").css("display", "none");
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });

    return out;
}




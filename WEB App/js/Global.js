/*
    // Global.js
    // Contiene tutte le funzioni e gli oggetti globali del programma

    // ULTIMA VERSIONE RILASCIATA E DATA CREAZIONE SETUP

*/

var DEBUG = false;
var Versione = "0.059 (0.197)";

/* Enumeratore delle pagine di Logistica */
var enumPagine = {
    "pgHome": 1
    , "pgRL": 2
    , "pgTR": 3
    , "pgDocAperti": 4
    , 'pgTRRig_P': 5
    , 'pgTRRig_A': 6
    , 'pgDOPrelievi': 7             // Pagina dei doc prelevabili di una DOTes già definita (prg DO)
    , 'pgRLRig': 8
    , 'pgSscc': 9
    , 'pgRLPiede': 10
    , 'pgStampaDocumento': 11
    , 'pgAvviaConsumo': 12          // Produzione: Dichiarazione di inizio consumo della materia prima lotto dichiarata
    , 'pgSottoMenu': 13
    , 'pgLog': 15                   // Pagina di log
    , 'pgDocRistampa': 16           // Pagina fittizia che avvia pgListener quando clicco su 'Stampa Doc' del menu laterale
    , 'pgPrelievi': 17              // Pagina del prg PR contenente tutti i doc prelevabili
    , 'pgTRPiede': 18
    , 'pgIN': 19                    // Pagina di testa dell'inventario
    , 'pgINRig': 20                 // Righe dell'inventario con l'elenco degli articoli da inventariare
    , 'pgINPiede': 21
    , 'pgINAperti': 22              // Elenco degli inventari aperti
    , 'pgSP': 23                    // Spedizione
    , 'pgRLPK': 24                  // Pack List
    , 'pgAA': 25                    // Acquisizione alias
    , 'pgRLRigID': 26               // Prelievo da Id_DORig
    , 'pgxMPIU': 27                 // Pagina pers. Pesate MP
    , 'pgxAREtichette': 28          // Pagina pers. etichette
    , 'pgSM': 29                    // Stoccaggio merce (materie prime e prodotti finiti) da codice SSCC
    , 'pgRLRig_T': 30               // Evasione ordini: evasione delle righe doc con ubicazione proposta
    , 'pgINSSCC': 31                // Inventario per Matricola: inventario con lettura SSCC 
    , 'pgTRSSCC': 32                // Trasferimento per Matricola
    , 'pgINTMG_MAT': 33             // Informazioni della Matricola
    , 'pgINTMG_AR': 34              // Informazioni dell'articolo 
    , 'pgTRMP_P': 35                // Trasferimento materie prime in produzione: elenco dei P da produrre
    , 'pgTRMP_C_AR': 36             // Trasferimento materie prime in produzione: elenco dei C da portare in produzione in base al P selezionato e salvataggio del trasferimento
    , 'pgTRRM': 37                  // Trasferimento per rientro materie prime da produzione
    , 'pgINTMG_UbiMat': 38          // Interrogazione Magazzino: Ubicazione - Matricole 
    , 'pgGENCARICHI': 39            // Produzione: Generazione carichi di produzione immediati
    , 'pgINM2Aperti': 40            // Inventario Contemporaneo: inventari aperti
    , 'pgINM2': 41                  // Inventario Contemporaneo: testa dell'inventario
    , 'pgINM2Rig': 42               // Inventario Contemporaneo: righe dell'inventario
    , 'pgINM2Piede': 43             // Inventario Contemporaneo: piede dell'inventario
    , 'pgCFARLIST': 44              // Listini CF/AR
    , 'pgRLPrelievo': 45            // Azzera prelievo selettivo
    , 'pgPRTRAttivita': 47          // Pagina trasferimento materiali attività
    , 'pgPRTRMateriale': 48         // Pagina trasferimento materiali 
    , 'pgCHS00012': 49              // Pers selezionatura CASH
    , 'pgRS': 50                    // Pagina reintegro scorta
    , 'pgRLPK_R': 51                // Pagina della creazione di documenti da prelievo per packing list
    , 'pgTR_UBPA': 52               // Trasferimento ubicazione interno
};

//Enumeratore browser
var enumBrowser = {
    "Unknow": 0
    , "Chrome": 1
    , "Explorer": 2
    , "Mozilla": 3
}

/**
 * Oggetto oApp:
 * Contiene tutte le variaibli e gli oggetti necessari per la gestione dell'applicazione
 * viene ripulita in fase di Login
 */
var oApp = {
    "Debug": false,                         // Se true sono in Debug
    "Ditta": null,                          // Nome della ditta di Arca
    "Logon": false,                         // = true se il login è andato a buon fine.
    "Cd_Operatore": null,                   // Codice dell'operatore loggato
    "Terminale": null,                      // Indirizzo ip del terminale loggato
    "Browser": null,                        // Tipo di browser
    "BrowserType": null,                    // 0 = Unknow, 1 = Chrome, 2 = Explorer, 3 = Mozilla
    //### DA CAMBIARE CON LA GESTIONE DEL Id_xMOListener e non ListenerIP!
    "ListenerIP": null,                     // Indirizzo ip del listener
    "SetFocus": null,                       //Tipologia di set focus del terminale (0 = disattivo; 1 = tipologia 1(?) standard)
    "LicF_Id": null,                        // Cod lic
    "PressTimer": 0,                        // Timer usato per intercettare il long press (detail packing list) per replicare l'evento taphold
    "SottoMenuAttivo": null,                // Elementi da visualizzare nel sotto menu, indica anche che in GoHome devo gestire il sotto menu se != null
    "xMOImpostazioni": {},                  // Oggetto impostazioni globali di Logistica
    "dtPrograms": null,                     // Array dei pgrogrammi utilizzati per la navigazione tra le pagine di Logistica
    "dtDO": null,                           // Array dei documenti gestiti da Logistica (sotto menu)
    "dtxMOLinea": null,                     // Array delle liene di produzione
    "dtxMOListener": null,                  // Array dei listener disponibili
    "ActiveListenerIdx": null,              // Idx dell'Array dei listener 
    "dtxMOMenu": null,                      // Array dei menù utente disponibili 
    "Messages": null,                       // Messaggi della sessione corrente
    "TipoAA": 'ALI',                        // Indica la modalità di visualizzazione della pagina pgAA per inserimento alias (ALI) o alternativo (ALT), parametro inserito in oApp in modo che rimanga impostato per tutta la sessione
    "CPIeUbica": false,                     // Il carico di produzione esegui immediatamente una ubicazione
    "LocalConfig": oApp_GetLocalConfig(),   // Impostazioni di configurazione locale
}

var UserPref = {
    "items": [],
    "add": function (keyprg, Cd_DO, Id_toEdit, Edit_Area, prefName) {
        // Elemento da aggiungere
        var item = {
            keyprg: keyprg,
            Cd_DO: Cd_DO,
            Id_toEdit: Id_toEdit,
            Edit_Area: Edit_Area,
            prefName: prefName
        };

        // Se l'elemento non è già presente
        if (!this.items.includes(item)) {
            // Rimuovo il primo e shifto gli altri
            if (this.items.length == 3)
                this.items.shift();
            // Aggiungo l'elemento
            this.items.push(item);
            // Salvo in locale
            this.setLocal();
        }
    },
    "remove": function (keyprg) {
        if (keyprg) {
            var item = this.items.find(function (item) { return item.keyprg == keyprg; });

            if (item)
                this.items.splice(this.items.indexOf(item), 1);
        } else {
            this.items = [];
        }
        // Salvo in locale
        this.setLocal();
    },
    "getLocal": function () {
        var uPref = localStorage.getItem("UserPref_" + oApp.Cd_Operatore);
        uPref = uPref ? JSON.parse(uPref) : null;
        return uPref ? uPref : [];
    },
    "setLocal": function () {
        localStorage.setItem("UserPref_" + oApp.Cd_Operatore, JSON.stringify(this.items));
    }
}

var UserParam = {
    "getLocal": function (name, def, type) {
        var uParam = localStorage.getItem("UserParam_" + oApp.Cd_Operatore + "_" + name);
        var value = uParam ? uParam : def;
        if (type != undefined) {
            if (type == Boolean) value = value === 'true';
            else value = new type(value);
        }
        return value;
    },
    "setLocal": function (name, val) {
        localStorage.setItem("UserParam_" + oApp.Cd_Operatore + "_" + name, val);
    }
}

// Si occupa del reset delle variabili dell'oggetto
function oApp_Reset() {
    oApp.Logon = false;
    oApp.Cd_Operatore = null;
    oApp.Terminale = null;
    oApp.Browser = null;
    oApp.BrowserType = 0;
    oApp.SetFocus = null;
    oApp.LicF_Id = null;
    oApp.PressTimer = 0;
    oApp.dtPrograms = null;
    oApp.dtDO = null;
    oApp.dtxMOLinea = null;
    oApp.dtxMOListener = null;
    oApp.ActiveListenerIdx = null;
    oApp.dtxMOMenu = null;
    oApp.dixMOARMisura = null;
    // xMOImpostazioni
    oApp.xMOImpostazioni = {};
    // NON SVUOTO MAI LA CODA DEI MESSAGGI oApp.Messages = [];
    oApp.TipoAA = 'ALI';
    oApp.CPIeUbica = false;
    oApp.LocalConfig = null;
}

function oApp_GetLocalConfig() {
    return JSON.parse(localStorage.getItem("LogConfig"));
}

function oApp_SetLocalConfig() {
    localStorage.setItem("LogConfig", JSON.stringify(oApp.LocalConfig));
}

function oApp_SetLocalProperty(page, key, value) {
    //Inizializzo l'oggetto se nullo
    if (!oApp.LocalConfig)
        oApp.LocalConfig = {};

    //Inizializzo la pagina se nulla
    if (!oApp.LocalConfig.hasOwnProperty(page))
        oApp.LocalConfig[page] = {};

    //Setto la property
    oApp.LocalConfig[page][key] = value;

    //Salvo il local storage
    oApp_SetLocalConfig();
}

function oApp_GetLocalProperty(page, key) {
    //Verifico l'oggetto se nullo
    if (!oApp.LocalConfig)
        return null;

    //Verifico la pagina se nulla
    if (!oApp.LocalConfig.hasOwnProperty(page))
        return null;

    //Restituisco la property
    return oApp.LocalConfig[page][key];
}

// Oggetto contenente il programma precedente se necessario tornare indietro
// viene clonato dall'oggetto oPrg
var oPrg_Back;

// Si occupa di aggiungere un programma al dtPrograms
function oApp_AddProg(prog) {
    if (fU.IsNull(oApp.dtPrograms)) oApp.dtPrograms = {};
    var prg = { "Key": prog, "Pages": [], "ActivePageIdx": -1, "ActivePageId": "", "ActivePageValue": null };
    oApp.dtPrograms[prog] = prg;
}

// Si occupa di aggiungere le pagine ad un elemento del dtPrograms
function oApp_AddPage2Prog(prog, page, enabled) {
    page = { "Key": fPage.GetPageKey(parseInt(page)), "Value": parseInt(page), "Enabled": enabled, "Next": false, "Back": true, "GoHome": false };
    //Verifica se è la prima pagina
    if (oApp.dtPrograms[prog].Pages && oApp.dtPrograms[prog].Pages.length == 0) {
        // Assegno l'indice
        oApp.dtPrograms[prog].ActivePageIdx = 0;
        // Assegno il nome
        oApp.dtPrograms[prog].ActivePageId = page.Key;
        // Assegno il value
        oApp.dtPrograms[prog].ActivePageValue = page.Value;
        //Ultima pagina: GoHome = true
        oApp.dtPrograms[prog].GoHome = true;
    } else {
        //Le pagina corrente (maggiore di zero) abilita il next alla pagina precedente
        var lastpage = oApp.dtPrograms[prog].Pages.length - 1;
        oApp.dtPrograms[prog].Pages[lastpage].Next = true;
    }
    // Aggiungo la pagina al programma
    oApp.dtPrograms[prog].Pages.push(page);
}

/**
 * Oggetto oPrg:
 * Contiene il programma attivo in questo momento, viene interamente gestito dall'oggetto Nav
 * viene ripulita nella home
 */
var oPrg = {

    // TUTTE LE VARIABILI DEVONO ESSERE GESTITE NEL RESET!

    "Key": null,                                // Key del programma corrente
    "Pages": null,                              // Array contenente le pagine 
    "ActivePageIdx": null,                      // Indice della pagina correntemente attiva
    "ActivePageId": null,                       // Nome della pagina correntemente attiva
    "ActivePageValue": null,                    // Valore equivalente a enumPagine per la pagina corrente (es. ActivePageId = "pgRL"; ActivePageValue = 3)
    "Id_xMORL_Edit": null,                      // Identificativo univoco della testa del documento di Logistica che sto editando  
    "Id_xMOTR_Edit": null,                      // Identificativo univoco della testa del trasferimento di Logistica che sto editando  
    "Id_xMOIN_Edit": null,                      // Identificativo univoco della testa dell'inventario
    "Id_xMOINM2_Edit": null,                    // Identificativo univoco della testa dell'inventario condiviso
    "Id_DOTes": null,                           // Identificativo univoco della testa del documento di ARCA che sto editando in questo momento (es.: utile alla ristampa, ecc)
    "Cd_DO": "",                                // Contiene il codice documento corrente
    "drDO": null,                               // Riga dell'array oApp.dtDO selezionato
    "isMGPartenza": function () {
        return this.drDO ? this.drDO.MagPFlag === true : false;
    },
    "isMGArrivo": function () {
        return this.drDO ? this.drDO.MagAFlag === true && this.drDO.MagPFlag === false : false;
    },
    "drRL": null,                               // Riga della testa della rilevazione
    "drTR": null,                               // Riga della testa del Trasferimento
    "BC": null,                                 // Barcode abilitati per il programma 
    "ActiveSearchId": null,                     // Indice della pagina correntemente attiva
    "ActiveSearchContext": null,                // Contesto della ricerca
    "ActiveSearchOutField": null,               // Contiene il nome del campo utile per l'aggiornamento dei dati selezionati nella pagina corrente
    "ActiveSearchValue": null,                  // Contiene il valore selezionato esternamente alla ricerca
    "DMS": {
        "dtDMS": [],
        "resetAll": function () {
            this.dtDMS = [];
        }
    },
    "RL": {
        "ARIncompleti": 0,                      // Articoli del prelievo non completamente evasi
        "ARCompleti": 0,                        // Articoli del prelievo completamente evasi
        "Letture": 0,                           // Numero di letture effettuate nel prelievo corrente
        "dtDOSelPR": [],                        // dt dei documenti selezionati per il prelievo in pgPrelievi 
        "dtRLRig": [],                          // dt delle letture effettuate (riempito da elenco letture)
        "dtRLRig_T": [],                        // dt contenente le righe temporanee di prelievo n.b. necessario x proposta ubi
        "dtRLRig_AR": [],                       // dt contenente le righe della funzione xMORLRig_AR
        "getARItemByAR": function (Cd_AR) {
            return this.dtRLRig_AR.find(function (item) { return item.Cd_AR.trim() == Cd_AR.trim(); });
        },
        "idx_t": -1,                            // Id del record riga temporanea visualizzato nella pagina xMORLRig_T n.b. necessario x proposta ubi
        "Id_xMORLRig_Edit": 0,                  // Identificativo in modifica
        "StepCtrl": 1,                          // Identificatio dello step dei controlli lato server (bloccanti o conferma si/no)
        "issueOn": false,                       // Vero se l'operatore ha chiesto di eseguire issue di proposte
        "issueId": 0,                           // Identificativo dell'issue
        "ResetAll": function () {
            this.ARIncompleti = 0;
            this.ARCompleti = 0;
            this.Letture = 0;
            this.dtDOSelPR = [];
            this.dtRLRig = [];
            this.dtRLRig_T = [];
            this.dtRLRig_AR = [];
            this.idx_t = -1;
            this.Id_xMORLRig_Edit = 0;
            this.StepCtrl = 1;
            this.issueOn = false;
            this.issueId = 0;
        }
    },
    "PK": {
        "dtxMORLPK": null,                      // Array contenente l'elenco dei PackListRef del documento sulla quale si sta facendo pack list   
        "idx": null,                            // Indice del dtxMORLPK corrente
        "PackListRef": "",                      // Numero del pacco di cui visualizzare il detail dei pesi e volumi (se vuoto voglio tutti i packlistref del documento)
        "RLPKDetail": false,                    // Variabile per aperire la pgRLPK come detail (true visualizza i dati solo del packlistref selezionato sul select di pgRLRig)
        "ResetAll": function () {
            this.dtxMORLPK = null;
            this.idx = null;
        }
    },
    "IN": {                                     // Gestione INVENTARIO
        "Tipo": "",                             // M --> Inventario Massivo, P --> Inventario Puntuale
        "drIN": null,                           //Dati di testa di IN 
        "dtxMOINRig": null,                     // Array contenente l'elenco degli articoli da inventariare
        "idx": null,                            // Id riferito alla posizione nel dt degli AR della riga visualizzata nel dettaglio
        //Utili per l'inserimento di una nuova riga di inventario
        "AddNew": false,                        // Modalità con cui è aperto il dettaglio dell'inventario (false = modalita dettaglio riga esistente, true = modalità add new ar)
        "Id_xMOINRig": null,                    // Id della riga inserita in xMOINRig
        "ResetAll": function (head) {
            if (head == true) {
                this.drIN = null;
            }
            this.dtxMOINRig = null;
            this.idx = null;
            this.AddNew = false;
            this.Id_xMOINRig = null;
        }
    },
    "INM2": {
        "drIN": null,                           //Dati di testa di IN 
        //"dtxMOINRig": null,                     // Array contenente l'elenco degli articoli da inventariare
        //"idx": null,                            // Id riferito alla posizione nel dt degli AR della riga visualizzata nel dettaglio
        ////Utili per l'inserimento di una nuova riga di inventario
        //"AddNew": false,                        // Modalità con cui è aperto il dettaglio dell'inventario (false = modalita dettaglio riga esistente, true = modalità add new ar)
        //"Id_xMOINRig": null,                    // Id della riga inserita in xMOINRig
        "ResetAll": function (head) {
            if (head == true) {
                this.drIN = null;
            }
            //this.dtxMOINRig = null;
            //this.idx = null;
            //this.AddNew = false;
            //this.Id_xMOINRig = null;
        }
    },
    "TRMP": {
        "Id_DOTes": null,
        "Id_DORig_P": null,
        "P_From": null,
        "P_To": null,
        "DocRif": null,
        "Id_DORig_C": null,
        "dtDORig_C": [],
        "idx": null,
        "ResetAll": function () {
            this.Id_DOTes = null;
            this.Id_DORig_P = null;
            this.P_From = null;
            this.P_To = null;
            this.DocRif = null;
            this.Id_DORig_C = null;
            this.dtDORig_C = null;
            this.idx = null;
        }
    },
    "PRAV": {
        "keyBLA": null,                           // Indice della riga nel dt delle attività
        "dtBLA": null,                            // Array contenente le righe delle attività delle Bolle
        "keyBLM": null,                           // Indice della riga nel dt dei materiali
        "dtBLM": null,                            // Array contenente le righe dei materiali dell'attività della Bolla
        "ResetAll": function () {
            this.keyBLA = null;
            this.dtBLA = null;
            this.keyBLM = null;
            this.dtBLM = null;
        },
    },
    "INTMG_AR": {
        "dtINTMG_AR": [],
        "qtaZero": true,
    },
    "DetailGiacenza": {
        "dt": [],
        "Cd_AR": null,
        "Cd_MG": null,
    },
    "DetailGiacenzaUbicazione": {
        "dt": [],
        "Cd_MG": null,
        "Cd_MGUbicazione": null,
        "_pa": '',
    },
    "SP": {
        "dt": []
    },
    "doveSei": {
        "Cd_MG": "",
        "Cd_MGUbicazione": ""
    },
    "doveVai": {
        "Cd_MG_a": "",
        "Cd_MGUbicazione_a": "",
        "info": "",
        "focusin": "",          // L'oggetto che ha il focus
        "PA": "",               // Indica se i magazzini da settare sono di partenza o di arrivo
        "PexeA": false          // Dopo la partenza devo mostrare l'arrivo
    },
    "RS": {
        "items": [],
        "index": [],
        "Issue": {
            "items": [],
            "index": null,
            "getItemByAR": function (Cd_AR) {
                return this.items.find(function (item) { return item.Cd_AR.trim() == Cd_AR.trim(); });
            }
        },
        "Partenza": {
            "items": [],
            "index": null,
            "daConfermare": function () {
                return this.items.filter(function (item) { return !item.Cd_MGUbicazione_P || item.Cd_MGUbicazione_P == ""; });
            }
        },
        "Arrivo": {
            "items": [],
            "itemsOfP": [],
            "index": null,  // Riferito a itemsOfP
            "daConfermare": function () {
                return this.itemsOfP.filter(function (item) { return !item.Cd_MGUbicazione_A; });
            }
        },
        "getTipo": function (RSTipo) {
            switch (RSTipo) {
                case 'A':
                    return 'Abbassamento';
                case 'T':
                    return 'Trasferimento';
                default:
                    return 'Sconosciuto';
            }
        }
    },
    // Reset: si occupa di ripulire le variabili dell'oggetto
    "Reset": function () {
        this.Key = null;
        this.Pages = null;
        this.ActivePageIdx = null;
        this.ActivePageId = null;
        this.ActivePageValue = null;
        this.Id_xMORL_Edit = 0;
        this.Id_xMOTR_Edit = 0;
        this.Id_xMOIN_Edit = 0;
        this.Id_xMOINM2_Edit = 0;
        this.Id_DOTes = 0;
        this.Cd_DO = "";
        this.drDO = null;
        this.drRL = null;
        this.drTR = null;
        this.BC = null;
        this.ActiveSearchId = null;
        this.ActiveSearchOutField = null;
        this.ActiveSearchValue = null;
        // RL variabile
        this.RL.ResetAll();
        // Packing List
        this.PK.ResetAll();
        // Inventario
        this.IN.ResetAll(true);
        // Inventario condiviso
        this.INM2.ResetAll(true);
        // Trasferimenti per produzione
        this.TRMP.ResetAll();
        //dove sono <> dove vado
        this.doveVai.Cd_MG_a = "";
        this.doveVai.Cd_MGUbicazione_a = "";
        this.doveVai.PA = "";
        this.doveVai.PexeA = false;
    },

    "Load": function (keyprg, Cd_DO, Id_toEdit, Edit_Area) {
        // reset
        this.Reset();
        try {
            keyprg = keyprg.trim();
            // Verifico la presenza del keyprg
            if (fU.IsEmpty(keyprg))
                throw { message: "Attenzione non è stato definito un programma valido per il documento " + Cd_DO };
            // load
            this.Key = oApp.dtPrograms[keyprg].Key;
            this.Pages = oApp.dtPrograms[keyprg].Pages;
            this.ActivePageIdx = oApp.dtPrograms[keyprg].ActivePageIdx;
            this.ActivePageId = oApp.dtPrograms[keyprg].ActivePageId;
            this.ActivePageValue = oApp.dtPrograms[keyprg].ActivePageValue;

            //Memorizza l'id edit se passato alla funzione
            switch (fU.ToString(Edit_Area)) {
                case 'RL': this.Id_xMORL_Edit = fU.ToInt32(Id_toEdit); break;
                case 'TR': this.Id_xMOTR_Edit = fU.ToInt32(Id_toEdit); break;
                case 'IN': this.Id_xMOIN_Edit = fU.ToInt32(Id_toEdit); break;
            }

            // carico le impostazioni del documento corrente
            if (!fU.IsEmpty(Cd_DO))
                this.LoadDO(Cd_DO);

            // Gestione dei dati per la pagina da aprire 
            fPage.LoadData();
            // Gestione dell'interfaccia
            fPage.LoadUI();

            //Carica il contatore delle letture del programma corrente
            this.Counter.Render();
            this.Counter.Print();

            // Attiva i preferiti
            Nav.prefShowStar(keyprg, Cd_DO, Id_toEdit, Edit_Area);

            // Mostro il nav se necessario
            Nav.Show();
            // Show della pagina
            fPage.Show(oPrg.ActivePageId);
        }
        catch (e) {
            PopupMsg_Show("oPrg.Load()", 1, fU.ToString(e.message));
        }
    },
    "LoadDO": function (Cd_DO) {
        this.Cd_DO = "";
        this.drDO = null;
        // carico le impostazioni del documento corrente
        if (!fU.IsNull(Cd_DO)) {
            this.Cd_DO = Cd_DO;
            this.drDO = oApp.dtDO[Cd_DO];
        }
    },
    "PageIdx": function (PageValue) {
        var i = null;
        $.each(this.Pages, function (idx, page) {
            if (page.Value == PageValue) {
                i = idx;
                return false;
            }
        });
        return i;
    },
    "ResetPages": function () {
        $(".mo-page input").val("");
        $(".mo-page input[type='check']").attr("checked", false);
        $(".mo-page textarea").val("");
        $(".mo-page label.descrizione").text("");
        $(".mo-page label.oprg").text("");
        $("#pgPrelievi").find("select[name='Cd_DO'] option").remove();
    },
    "LoadTemporaryPrg": function (GoToPrg) {
        // Salvo su un oggetto il programma precedente
        // In modo di riuscire a tornare indietro nella navigazione
        oPrg_Back = $.extend(true, {}, oPrg);
        // Imposto nell'oggetto prg il nuovo programma 
        oPrg.Load(GoToPrg);
    },
    "DA": null,
    // Gestione del focus della pagina
    "saveFocus": {
        "Items": {},
        //"Init": function () {
        //    this.Items = JSON.parse(localStorage.getItem('Focus'));
        //    if (!this.Items) this.Items = {};
        //},
        "Get": function () {
            return this.Items[oPrg.ActivePageId] ? this.Items[oPrg.ActivePageId] : "";
        },
        "Set": function (ele) {
            //salva il nome del campo input corrente
            this.Items[oPrg.ActivePageId] = $(ele).attr("name");
        },
        "Exe": function () {
            var focus = this.Get()
            if ($(focus))
                $("#" + oPrg.ActivePageId).find("input[name='" + focus + "']").focus().select();
            else
                SetFocus();
        },
    },
    // Gestione delle letture degli operatori per programma
    "Counter": {
        "State": {},
        "Init": function () {
            this.State = JSON.parse(localStorage.getItem('Counter'));
            if (!this.State) this.State = {};
        },
        "Render": function () {
            var counter = $("#" + oPrg.ActivePageId).find("div[data-key='counter']");
            var html = '<label style="font-size: 1.0em;">' + $(counter).attr('data-display') + ':' + '</label>' +
                '<label data-key="count" style="font-size: 3.5em;" onclick="oPrg.Counter.Reset();"></label>';
            $(counter).html(html);
        },
        // Programma corrente
        "Name": function () {
            return oPrg.Key;
        },
        // Legge il contatore del programma corrente
        "Get": function () {
            return this.State[this.Name()] ? this.State[this.Name()] : 0;
        },
        "Print": function () {
            //Aggiorna il contatore della pagina
            $("#" + oPrg.ActivePageId).find("div[data-key='counter'] label[data-key='count']").text(this.Get());
        },
        "Set": function (increment) {
            //Aggiorna il contatore del programma corrente e lo salva
            this.State[this.Name()] = this.Get() + increment;
            localStorage.setItem('Counter', JSON.stringify(this.State));
            //Aggiorna il contatore della pagina
            this.Print();
        },
        "Reset": function () {
            //Resetta il contatore corrente
            this.State = {};
            localStorage.setItem('Counter', JSON.stringify(this.State));
            //Aggiorna il contatore della pagina
            this.Print();
            //Reimposta il focus
            SetFocus();
        },
    }
}

/**
 * Classe Nav:
 * Gestisce la navigazione tra le pagine di un programma e si occupa della visualizzazione delle frecce di navigazione
 */
var Nav = {
    "OnNav": false,     // Indica se sto eseguento Next o Back
    "GoToPage": function (PageIdx) {

        //Imposta la pagina corrente
        oPrg.ActivePageIdx = PageIdx;
        oPrg.ActivePageId = oPrg.Pages[PageIdx].Key;
        oPrg.ActivePageValue = oPrg.Pages[PageIdx].Value;

        //Abilita comunque la pagina
        oPrg.Pages[oPrg.ActivePageIdx].Enabled = true;

        // Svuoto la parte di header destinata alle info di navigazione riferite alla pagina 
        $("#header .info-space").html("");
        // Gestione dei dati per la pagina da aprire        
        fPage.LoadData();
        // Gestione dell'interfaccia
        fPage.LoadUI();
        // Show della pagina
        fPage.Show(oPrg.ActivePageId);

        // Mostro il nav se necessario
        this.Show();
    },
    // Si occupa della navigazione in avanti tra le pagine del programma
    "Next": function () {
        if (!this.OnNav) {
            this.OnNav = true;
            // Se ho selezionato un programma che ha delle pagine
            if (oPrg.Key != null && (oPrg.Pages && oPrg.Pages.length > 0)) {
                // Validazione della pagina corrente
                if (fPage.Validate()) {
                    // Nasconde i preferiti
                    Nav.prefHideStar();
                    //Se richiesto va alla Home (o è l'ultima pagina o il programma esce prima dal flusso standard)
                    if (!oPrg.Pages[oPrg.ActivePageIdx].GoHome) {
                        ///Se esite una pagina successiva abilitata la carica
                        if (oPrg.Pages[oPrg.ActivePageIdx].Next) {
                            var ifind = null;
                            // Recupero della prima pagina abilitata successiva alla corrente
                            for (var i = (oPrg.ActivePageIdx + 1); i < oPrg.Pages.length; i++) {
                                // Ciclo finche non trovo una pagina abilitata
                                if (oPrg.Pages[i].Enabled) {
                                    // idx trovato: esco dal for
                                    ifind = i;
                                    break;
                                }
                            }
                            if (fU.ToInt32(ifind) >= 0) {
                                this.GoToPage(ifind);
                            } else {
                                PopupMsg_Show("ERRORE", 1, "Pagina corrente con NEXT ma nessuna pagina successiva!!<BR />Contattare il fornitore di Software!");
                            }
                        } else { GoHome(true); }
                    } else { GoHome(true); }
                }
            }
            else {
                PopupMsg_Show("ERRORE", 1, "Errore nella navigazione!");
                GoHome(true);
            }
            this.OnNav = false;
        }
    },

    // Si occupa della navigazione all'indietro tra le pagine del programma
    "Back": function () {
        if (!this.OnNav) {
            this.OnNav = true;
            // Esiste un programma di ritorno forzato?
            if (oPrg_Back != null) {
                oPrg = $.extend(true, {}, oPrg_Back);
                oPrg_Back = null;
                // Adesso non devo tornare indietro: carico il programma del back
                this.GoToPage(oPrg.ActivePageIdx);
                // Se ho selezionato un programma che ha delle pagine
            }
            else if (oPrg.Key != null && (oPrg.Pages && oPrg.Pages.length > 0)) {
                // Salvo i dati della pagina corrente
                if (fPage.SaveData()) {
                    // Se sono già alla prima pagina del programma, vado alla home page
                    if (oPrg.ActivePageIdx == 0) {
                        GoHome(true);
                    }
                    else {
                        var find = false;
                        // Recupero della prima pagina abilitata precedente alla corrente
                        for (var i = (oPrg.ActivePageIdx - 1); i >= 0; i--) {
                            // Ciclo finche non trovo una pagina abilitata
                            if (oPrg.Pages[i].Enabled) {
                                oPrg.ActivePageIdx = i;
                                oPrg.ActivePageId = oPrg.Pages[i].Key;
                                oPrg.ActivePageValue = oPrg.Pages[i].Value;
                                find = true;
                                break; // esco dal for
                            }
                        }
                        //  Se ho trovato una pagina abilitata precedente alla corrente faccio lo show senno torno alla home
                        if (find) {
                            // Show della pagina
                            fPage.Show(oPrg.ActivePageId);

                            // Mostro il nav se necessario
                            this.Show();
                        }
                        else {
                            GoHome();
                        }
                    }
                }
            }
            else {
                PopupMsg_Show("ERRORE", 1, "Errore nella navigazione!");
                GoHome();
            }
            this.OnNav = false;
        }
    },

    // Si occupa della visualizzazione della navbar
    "Show": function () {
        // Pagina corrente
        var pg = oPrg.Pages[oPrg.ActivePageIdx];
        // Hide della navigazione
        $(".nav-next").hide();
        $(".nav-back").hide();
        // Show del nav 
        if (pg.Next) $(".nav-next").show();
        if (pg.Back) {
            $(".nav-back").show();
            $("#header .c1").removeClass("w3-hide");  // fnl 
        };
    },

    // Mostra o nasconde in base ai parametri i button back e next
    "NavbarShowIf": function (showBack, showNext) {
        fU.ShowIf($(".nav-back"), showBack);
        fU.ShowIf($(".nav-next"), showNext);
    },

    "Keybhide": function () {
        $(document.activeElement).blur();
    },

    "ShowInfo": function () {
        return localStorage.getItem('ShowInfo') ? localStorage.getItem('ShowInfo') == "true" : true;
    },
    "ToggleInfo": function () {
        //Attiva/disattiva le info della pagina
        if (this.ShowInfo()) {
            $(".info-ext").hide();
            localStorage.setItem('ShowInfo', false);
        } else {
            $(".info-ext").show();
            localStorage.setItem('ShowInfo', true);
        }
        SetFocus();
    },
    "prefShowStar": function (keyprg, Cd_DO, Id_toEdit, Edit_Area) {
        // Assegno i valori
        $(".nav-pref").attr("data-keyprg", keyprg);
        $(".nav-pref").attr("data-cd_do", Cd_DO);
        $(".nav-pref").attr("data-id_toedit", Id_toEdit);
        $(".nav-pref").attr("data-edit_area", Edit_Area);

        //Verifica che il preferito non sia presente nell'elenco
        if (!UserPref.items.find(function (item) { return item.keyprg == keyprg && item.Cd_DO == Cd_DO; })) {
            //Prepara il nome del preferito
            var msg;
            switch ($(".nav-pref").attr("data-keyprg")) {
                case "DO":
                case "PI":
                case "PR":
                case "SP":
                case "SPA":
                case "GP":
                case "PK":
                    msg = $(".nav-pref").attr("data-cd_do");
                    break;
                default:
                    msg = $(".nav-pref").attr("data-keyprg");
                    break;
            }
            $(".nav-pref").attr("data-name", msg);
            //stella grigia perchè aggiungibile
            $(".nav-pref").removeClass("active");
        } else {
            //Recupera il nome del preferito
            var item = UserPref.items.find(function (item) { return item.keyprg == keyprg; });
            if (item)
                $(".nav-pref").attr("data-name", item.prefName);
            //Stella gialla perchè preferito
            $(".nav-pref").addClass("active");
        }

        $(".nav-pref").show();
    },
    "prefHideStar": function () {
        //Attiva i preferiti
        $(".nav-pref").hide();
    },
    "prefShow": function () {

        //reset
        $("#userPref li.pref-item").remove();
        this.prefHideStar()

        //Se esistono preferiti
        if (UserPref) {
            //Setta i preferiti

            UserPref.items.forEach(function (item) {

                var elem = $("#userPref li.template").clone().removeClass('template').removeClass('w3-hide').addClass('pref-item');
                $(elem).find('span').text(item.prefName);

                $(elem).on("click", function () {
                    oPrg.Load(item.keyprg, item.Cd_DO, item.Id_toEdit, item.Edit_Area);
                });

                $("#userPref ul").append(elem);

            });

        }
        //Attiva i preferiti
        fU.ShowIf($("#userPref"), UserPref.items.length > 0)
    },
    "prefUserHide": function () {
        //Nasconde i preferiti
        $("#userPref").hide();
    },
    "prefUserSet": function () {
        if ($(".nav-pref").hasClass("active")) {
            if (confirm("Rimuovere " + $(".nav-pref").attr("data-name") + " dai preferiti?")) {
                UserPref.remove($(".nav-pref").attr("data-keyprg"));
                $(".nav-pref").removeClass("active");
            }
        } else {
            var prefName = prompt("Inserisci il nome del preferito (max 8 caratteri):", $(".nav-pref").attr("data-name"));
            if (!fU.IsEmpty(prefName)) {
                UserPref.add($(".nav-pref").attr("data-keyprg"), $(".nav-pref").attr("data-cd_do"), $(".nav-pref").attr("data-id_toedit"), $(".nav-pref").attr("data-edit_area"), prefName.substr(0, 8));
                $(".nav-pref").addClass("active");
            }
        }

    },
    "prefUserReset": function () {
        if (confirm("Reset dei preferiti?")) {
            //cancella i preferiti
            UserPref.remove();
        }
        //aggiorna i preferiti (nascondendoli)
        this.prefShow();
    }
}

/**
 * Classe fPage: Gestisce le funzioni generali per le pagine
 */
var fPage = {
    //Recupera il nome della pagina da aprire
    "GetPageKey": function (page) {
        return fU.GetEnumKey(enumPagine, page);
    },

    // Valida la pagina corrente, torna un boolean
    "Validate": function () {
        var m = "";         // Messaggio di errore
        var f = "";         // input per il focus
        var r = false;      // Return

        /* =================================
        Attenzione! Tutte le chiamate Ajax utili per la validazione devono essere SINCRONE!
         ================================= */

        // In base alla pagina...
        switch (oPrg.ActivePageValue) {
            // pagine non validate
            case enumPagine.pgHome:
            case enumPagine.pgSottoMenu:
            case enumPagine.pgDocAperti:
            case enumPagine.pgLog:
            case enumPagine.pgINAperti:
            case enumPagine.pgINRig:
            case enumPagine.pgINPiede:
            case enumPagine.pgxMPIU:
            case enumPagine.pgSM:
            case enumPagine.pgRLRig_T:
            case enumPagine.pgINSSCC:
            case enumPagine.pgTRSSCC:
            case enumPagine.pgINTMG_MAT:
            case enumPagine.pgINTMG_AR:
            case enumPagine.pgINTMG_UbiMat:
            case enumPagine.pgTRMP_C_AR:
            case enumPagine.pgTRRM:
            case enumPagine.pgGENCARICHI:
            case enumPagine.pgINM2Aperti:
            case enumPagine.pgINM2Rig:
            case enumPagine.pgINM2Piede:
            case enumPagine.pgCFARLIST:
            case enumPagine.pgPRTRMateriale:
            case enumPagine.pgCHS00012:
                r = true;
                break;
            case enumPagine.pgPRTRAttivita:
                // Posso andare avanti solo se ho scelto una bolla
                if (oPrg.PRAV.keyBLA == null)
                    m += "\nNessuna Bolla selezionata.";
                r = (m == "" ? true : false);
                break;

            case enumPagine.pgRLPrelievo:
                var r = Ajax_xmosp_xMORLPrelievo_AzzeraSave();
                break;
            // pagina Testa della rilevazione
            case enumPagine.pgRL:
                //Verifico che il CF sia stato selezionato
                if (fU.IsEmpty($("#pgRL [name='Cd_CF']").val())) {
                    m += "\nCliente/Fornitore non selezionato."
                }
                if (!fU.IsDate($("#pgRL input[name='DataDoc']").val())) {
                    m += '\nLa data del documento inserita non è nel formato richiesto (GG/MM/AAAA).'
                }
                if (!fU.IsDate($("#pgRL input[name='DataDocRif']").val())) {
                    m += '\nLa data di riferimento inserita non è nel formato richiesto (GG/MM/AAAA).'
                }
                //Verifico che la linea sia attiva e selezionata
                if (oPrg.drDO.xMOLinea && fU.IsEmpty($("#pgRL [name='Cd_xMOLinea']").val())) {
                    m += "\nSelezionare una linea di produzione."
                }
                if (m == "") {
                    // Valido il cliente/fornitore selezionato
                    r = Ajax_xmosp_CF_Validate($("#pgRL [name='Cd_CF']").val());
                    if (r) {
                        //Salvataggio dei dati della testa RL
                        r = Ajax_xmosp_xMORL_Save();
                    }
                }
                break;

            case enumPagine.pgDocRistampa:
                // carico le impostazioni del documento corrente
                oPrg.LoadDO($("#pgDocRistampa label[name='Cd_DO']").text());
                oPrg.Id_DOTes = $("#pgDocRistampa label[name='Id_DOTes']").text();
                oPrg.Id_xMORL_Edit = $("#pgDocRistampa label[name='Id_xMORL_Edit']").text();
                r = true;
                break;

            case enumPagine.pgAvviaConsumo:
                if (fU.IsEmpty($("#pgAvviaConsumo select[name='Cd_xMOLinea']").val())) {
                    m += "\nLinea non selezionata.";
                }
                if (!fU.IsDate($("#pgAvvioConsumo input[name='DataOra']").val())) {
                    m += '\nLa data inserita non è nel formato richiesto (GG/MM/AAAA).'
                }

                if (m == "") { r = Ajax_xmosp_xMOConsumo_Save(); }
                break;

            case enumPagine.pgDOPrelievi:
                var Id_DOTes_Selected = "";
                //Genera una stringa di id dei prelievi selezionati
                $("#pgDOPrelievi .tr-prel").find(":checkbox:not(disabled)").each(function () {
                    if ($(this).prop("checked") == true) {
                        // Salva in una stringa l'id dei doc selezionati
                        Id_DOTes_Selected += $(this).attr("Id_DOTes") + ',';
                    }
                });
                //Verifica dell'obbligatorietà del prelievo
                switch (oPrg.drDO.xMOPrelievo) {
                    case 0:
                    case 3:
                        break;
                    case 1:
                        if (fU.IsEmpty(Id_DOTes_Selected) && oPrg.drDO.xMOPrelievoObb) {
                            m += "<br />- Prelievo obbligatorio! Nessun documento selezionato.";
                        }
                        break;
                    case 2:
                        if (fU.IsEmpty(Id_DOTes_Selected) && oPrg.drDO.xMOPrelievoObb) {
                            m += "<br />- Copia Righe obbligatoria! Nessun documento selezionato.";
                        }
                        break;
                }
                if (m == "") {
                    //Se sono stati prelevati dei documenti li controlla
                    if (fU.IsEmpty(Id_DOTes_Selected) || Ajax_xmosp_xMORLPrelievo_Validate(Id_DOTes_Selected, oPrg.drRL.Cd_DO)) {
                        //Salva i documenti di prelievo selezionati
                        r = Ajax_xmosp_xMORLPrelievo_Save(Id_DOTes_Selected);
                    }
                }
                break;

            case enumPagine.pgPrelievi:
                var Id_DOTes_Selected = "";
                var Cd_DO = "";
                //Genera una stringa di id dei prelievi selezionati
                for (var i = 0; i < oPrg.RL.dtDOSelPR.length; i++) {
                    Id_DOTes_Selected += "" + oPrg.RL.dtDOSelPR[i] + "" + ",";
                }

                Cd_DO = fU.ToString($("#" + oPrg.ActivePageId + " select[name='Cd_DO']").val());
                if (fU.IsEmpty(Cd_DO))
                    m += '<br /> -Selezionare il tipo di documento da creare';
                else {
                    // Carico i parametri del tipo di DO da creare
                    oPrg.LoadDO(Cd_DO);
                    //Verifica la selezione del prelievo
                    if (oPrg.drDO && oPrg.drDO.xMOPrelievoObb && fU.IsEmpty(Id_DOTes_Selected)) m += "<br />- Nessun documento selezionato da prelevare.";
                    if (m == "") {
                        if (!fU.IsEmpty(Id_DOTes_Selected)) {
                            if (Ajax_xmosp_xMORLPrelievo_Validate(Id_DOTes_Selected, Cd_DO)) {
                                //Salva i documenti di prelievo selezionati (senza svuotare il dtDOSelPR per riutilizzarlo se l'operatore esegue pagina indietro)
                                r = Ajax_xmosp_xMORLPrelievo_SaveRL(Id_DOTes_Selected, Cd_DO);
                                // una volta selezionati i prelievi disabilito la pagina per evitare possibili incongruenze nel abilitare/disabilitare i documenti da prelevare
                                if (r) {
                                    oPrg.Pages[oPrg.PageIdx(enumPagine.pgPrelievi)].Enabled = false;
                                }
                            }
                        } else
                            r = true;
                    }
                }
                break;

            case enumPagine.pgRLRig:
                var DoIt = false;
                //Verifica che sia stata inserita almeno una riga
                // var nRows = fU.ToInt32($("#pgRLRig .letture").text())
                // Se pk è attiva e pgRLPK viene aperta in modalità detail non vanno effettuati i controlli
                if (oPrg.drDO.PkLstEnabled && oPrg.PK.RLPKDetail) {
                    r = true;
                }
                else {
                    if (oPrg.RL.Letture == 0) m += "<br />- Nessuna lettura effettuata.";
                    if (oPrg.drDO.xMOPrelievo == 1 && oPrg.RL.ARIncompleti > 0) {
                        var msg = "Presenza di Articoli non completamente prelevati.";
                        if (fU.ToInt32(oPrg.drDO.xMOResiduoInPrelievo) == 1) {
                            msg += String.fromCharCode(13) + "ATTENZIONE: se si sceglie di continuare i residui del prelievo verranno azzerati!"
                        }
                        DoIt = confirm(msg + String.fromCharCode(13) + "Proseguire nella creazione del documento?", "ATTENZIONE!");
                    }
                    else { DoIt = true; }
                    if (m == "" && DoIt) {
                        r = Ajax_xmosp_xMORLPiede_Controlli_Before();
                        //Tutto ok
                        //r = true;
                    }
                }

                break;

            case enumPagine.pgRLRig:
                var DoIt = false;
                //Verifica che sia stata inserita almeno una riga
                // var nRows = fU.ToInt32($("#pgRLRig .letture").text())
                // Se pk è attiva e pgRLPK viene aperta in modalità detail non vanno effettuati i controlli
                if (oPrg.drDO.PkLstEnabled && oPrg.PK.RLPKDetail) {
                    r = true;
                }
                else {
                    if (oPrg.RL.Letture == 0) m += "<br />- Nessuna lettura effettuata.";
                    if (oPrg.drDO.xMOPrelievo == 1 && oPrg.RL.ARIncompleti > 0) {
                        var msg = "Presenza di Articoli non completamente prelevati.";
                        if (oPrg.drDO.xMOResiduoInPrelievo == 1) {
                            msg += String.fromCharCode(13) + "ATTENZIONE: se si sceglie di continuare i residui del prelievo verranno azzerati!"
                        }
                        DoIt = confirm(msg + String.fromCharCode(13) + "Proseguire nella creazione del documento?", "ATTENZIONE!");
                    }
                    else { DoIt = true; }
                    if (m == "" && DoIt) {
                        r = Ajax_xmosp_xMORLPiede_Controlli_Before();
                        //Tutto ok
                        //r = true;
                    }
                }

                break;
            case enumPagine.pgRLPK_R:
                var msg = "";
                // Controlla le Pk lette che siano dello stesso numero di quelle da leggere
                if (ActivePage().find("i.w3-green").length != ActivePage().find("i").length) {
                    msg += String.fromCharCode(13) + "- Packing list incompleta.";
                }
                if (msg == "") {
                    if (Ajax_xmosp_xMORLRig_R_Save()) {
                        //Ricarica SEMPRE i dati di testa e anche le info di prelievo
                        Ajax_xmovs_xMORL();
                        r = true;
                    }
                } else
                    PopupMsg_Show("ERRORE", 1, msg);
                break;
            case enumPagine.pgRLPiede:
                var DoIt = false;
                var msg = "";
                // Se la data ora del trasporto è antecedente alla data del documento
                var TrasportoDataora = $("#pgRLPiede").find('input[name="TrasportoDataora"]').val();
                if (!fU.IsEmpty(TrasportoDataora)) {
                    TrasportoDataora = new Date(TrasportoDataora);
                    var DataDoc = new Date(fU.DateJsonToStandard(oPrg.drRL.DataDoc));
                    if (TrasportoDataora < DataDoc) {
                        msg += String.fromCharCode(13) + "- Data trasporto minore della data consegna (" + fU.DateJsonToDate(oPrg.drRL.DataDoc) + ")";
                    }
                }
                //Se non sono presenti errori bloccanti:
                if (msg == "") {
                    // Se Targa e Caricatore sono gestiti dal DOC ma i campi sono vuoti chiedo a l'operatore se continuare comuqnue il salvataggio
                    if (oPrg.drDO.xMOTarga && fU.IsEmpty($("#" + oPrg.ActivePageId + " input[name='Targa']").val())) {
                        msg += String.fromCharCode(13) + "- Targa mancante";
                    }
                    if (oPrg.drDO.xMOTarga && fU.IsEmpty($("#" + oPrg.ActivePageId + " input[name='Cd_DOCaricatore']").val())) {
                        msg += String.fromCharCode(13) + "- Caricatore mancante";
                    }

                    if (msg == "") { DoIt = true; }
                    else {
                        DoIt = confirm(msg + String.fromCharCode(13) + "(ATTENZIONE! il documento non verrà stampato)" + String.fromCharCode(13) + "Salvare comunque il documento?", "ATTENZIONE!");
                        // Imposto il check di stampa a false in modo da non stampare il documento 
                        $("#pgRLPiede").find(".ck-print").prop("checked", false);
                    }
                    if (DoIt) {
                        if (fU.IsChecked($("#pgRLPiede .ck-avvioconsumo"))) {
                            Ajax_xmosp_xMOConsumoFromRL_Save();
                        }
                        // Salva il piede e stampa se richiesto dall'operatore
                        r = Ajax_xmosp_xMORLPiede_Save();
                    }
                } else
                    PopupMsg_Show("ERRORE", 1, msg);
                break;

            case enumPagine.pgStampaDocumento:
                var cmd = "";
                //Per la generazione dei comandi di stampa vanno verificati gli id correnti
                //Verifica la Ristampa (Id_DOTes e Id_xMORL_Edit completi)
                if (fU.ToInt32(oPrg.Id_DOTes) > 0 && fU.ToInt32(oPrg.Id_xMORL_Edit) > 0) {
                    //Stampa un doc di Arca
                    cmd = Listener_RLRePrint(oPrg.Id_DOTes, $("#pgStampaDocumento ul"));
                    // Id_xMORL_Edit è null perchè il documento è già esistente in Arca quindi lo stato deve rimanere Storicizzato
                    // e l'Id_DOTes è compreso nel cmd
                    r = Ajax_ListenerCoda_Add(cmd, null);

                } else {
                    //Verifica la Stampa di un RL
                    if (fU.ToInt32(oPrg.Id_xMORL_Edit) > 0) {
                        //Salva e Stampa una rilevazione
                        cmd = Listener_RLSaveAndPrint(oPrg.Id_xMORL_Edit, $("#pgStampaDocumento li.li-modulo"));
                        r = Ajax_ListenerCoda_Add(cmd, oPrg.Id_xMORL_Edit);
                    }
                }
                break;

            case enumPagine.pgTR:

                if (!fU.IsDate($("#pgTR input[name='DataMov']").val())) {
                    m += '\nLa data del movimento non è nel formato richiesto (GG/MM/AAAA).'
                }
                if (m == "") {
                    r = Ajax_xmosp_xMOTR_Save();
                }
                break;

            case enumPagine.pgTRRig_P:
                //Verifica che sia stata inserita almeno una riga
                var nRows = fU.ToInt32($("#pgTRRig_P .letture").text())
                if (nRows == 0) m += "<br />- Nessuna lettura effettuata.";
                if (m == "") {
                    //Tutto ok
                    r = true;
                }
                break;

            case enumPagine.pgTRRig_A:
                //Verifica che sia stata inserita almeno una riga
                var nRows = fU.ToInt32($("#pgTRRig_A .letture").text())
                if (nRows == 0) m += "<br />- Nessuna lettura effettuata.";
                if (m == "") {
                    //Tutto ok
                    r = true;
                }
                break;

            case enumPagine.pgTRPiede:
                // Salva il piede del trasferimento e crea il documento in arca
                r = Ajax_xmosp_xMOTRPiede_Save();
                break;

            case enumPagine.pgIN:
                // Se inventario massivo salvo la testa sul server
                switch (oPrg.IN.Tipo) {
                    case 'M':
                        // Massiva: salva la testa dell'inventario in xMOIN
                        r = Ajax_xmosp_xMOIN_Save();
                        break;
                    case 'P':
                        // Se il magazzino è vuoto non valido la pagina
                        if (!fU.IsEmpty($("#pgIN input[name='Cd_MG']").val())) {
                            // Puntuale: salvo la testa su variabili client
                            r = xMOIN_SaveTo_drIN();
                        }
                        else { PopupMsg_Show("ERRORE", 1, "Selezionare un magazzino"); r = false; }
                        break;
                }
                break;

            case enumPagine.pgRLPK:
                // Salvo le modifiche effettuate al pklistref modificato per ultimo 
                // NB lo faccio nel validate perchè gli altri vengono salvati al click delle frecce, l'ultimo rimarrebbe non salvato
                var r = Ajax_xmosp_xMORLPackListRef_Save();
                break;

            case enumPagine.pgSP:
                // Memorizzo gli Id dei documenti selezionati
                // Memorizzo il codice del documento da generare
                var Id_DOTes_Selected = oPrg.SP.dt.filter(function (item) { return item.Selezionato })
                    .map(function (item) { return item.Id_DOTes });
                var Cd_DO = ActivePage().find('select[name="Cd_DO"]').val();

                //Verifica i dati
                if (Id_DOTes_Selected.length == 0) m += "<br />- Nessun documento da prelevare selezionato.";
                if (fU.IsEmpty(Cd_DO)) m += "<br />- Documento da generare non selezionato.";

                // Carica la testa del doc e i prelievi da lista di carico 
                // Se il salvataggio va a buon fine allora disabilito la pagina corrente
                if (m == "")
                    r = Ajax_xmosp_xMOSpedizione_SaveRL(Id_DOTes_Selected, Cd_DO);
                if (r)
                    oPrg.Pages[oPrg.PageIdx(enumPagine.pgSP)].Enabled = false;
                break;

            case enumPagine.pgAA:
                if (oApp.TipoAA.toUpperCase() == 'ALI') {
                    Ajax_xmosp_ARAlias_Save();
                } else {
                    Ajax_xmosp_ARCodCF_Save();
                }
                break;

            case enumPagine.pgRLRigID:
                var DoIt = false;
                //Verifica che sia stata inserita almeno una riga
                // var nRows = fU.ToInt32($("#pgRLRig .letture").text())
                // Se pk è attiva e pgRLPK viene aperta in modalità detail non vanno effettuati i controlli
                if (oPrg.drDO.PkLstEnabled && oPrg.PK.RLPKDetail) {
                    r = true;
                }
                else {
                    if (oPrg.RL.Letture == 0) m += "<br />- Nessuna lettura effettuata.";
                    else { DoIt = true; }
                    if (m == "" && DoIt) {
                        r = Ajax_xmosp_xMORLPiede_Controlli_Before();
                        //Tutto ok
                        //r = true;
                    }
                }

                break;

            case enumPagine.pgxAREtichette:
                r = Ajax_xmosp_xMOAREtichette_Save();
                break;

            case enumPagine.pgTRMP_P:

                // Se non ho selezionato nessun P prende la prima riga OLN 
                if (fU.IsEmpty(oPrg.TRMP.Id_DOTes)) {
                    oPrg.TRMP.Id_DOTes = $("#pgTRMP_P .tr-rig").first().attr("Id_DOTes");
                    oPrg.TRMP.Id_DORig_P = $("#pgTRMP_P .tr-rig").first().attr("Id_DORig_P");
                    oPrg.TRMP.P_From = $("#pgTRMP_P .tr-rig").first().attr("P_From");
                    oPrg.TRMP.P_To = $("#pgTRMP_P .tr-rig").first().attr("P_To");
                }

                r = true;
                break;

            case enumPagine.pgINM2:
                r = Ajax_xmosp_xMOIN_Save_M2();
                break;

            default:
                m = "ERRORE", "Errore di gestione del Validate() della pagina " + oPrg.ActivePageId;
                break;
        }
        if (m != "") {
            //Se presente mostra l'errore
            PopupMsg_Show("ERRORE", 1, 'Impossibile continuare a causa di:\n ' + m, f ? f : '');
        }

        // ATTENZIONE se la funzione non restituisce TRUE non va avanti 

        return r;
    },

    // Carica i dati della pagina, possono essere anche caricati in modo asincrono
    "LoadData": function () {

        /* =================================
        Attenzione! Tutte le funzioni ASINCRONE si devono preoccupare di gestire l'UI per i propri dati (clear e load)
         ================================= */

        // In base alla pagina
        switch (oPrg.ActivePageValue) {
            case enumPagine.pgSottoMenu:
            case enumPagine.pgAvviaConsumo:
            case enumPagine.pgStampaDocumento:
            case enumPagine.pgINPiede:
            case enumPagine.pgLog:
            case enumPagine.pgSM:
            case enumPagine.pgINSSCC:
            case enumPagine.pgTR_UBPA:
            case enumPagine.pgTRSSCC:
            case enumPagine.pgINTMG_MAT:
            case enumPagine.pgINTMG_AR:
            case enumPagine.pgINTMG_UbiMat:
            case enumPagine.pgINM2Piede:
            case enumPagine.pgCFARLIST:
                break;
            case enumPagine.pgTRRM:
            case enumPagine.pgGENCARICHI:
                Ajax_xmofn_xMOLinea();
                break;
            case enumPagine.pgRL:
                //Attiva la pagina del prelievo se è parametrizzata nel prg 'DO'
                if (oPrg.Key == 'DO') {
                    oPrg.Pages[oPrg.PageIdx(enumPagine.pgDOPrelievi)].Enabled = (fU.IsPrelievoUI(oPrg.drDO.xMOPrelievo));
                }
                //Se Id_xMORL_Edit > 0 carica i dati nei campi
                if (fU.ToInt32(oPrg.Id_xMORL_Edit) > 0) {
                    //Carico la RL
                    Ajax_xmovs_xMORL();
                }
                break;

            case enumPagine.pgDOPrelievi:
                //Carica il dt dei documenti prelevabili
                Ajax_xmofn_DOTes_Prel();
                break;

            case enumPagine.pgPrelievi:
                if (!fU.IsEmpty(oPrg.drDO)) {
                    $("#pgPrelievi select[name='Cd_DO']").append($('<option>', {
                        value: oPrg.drDO.Cd_DO,
                        text: oPrg.drDO.Cd_DO,
                        class: "op-cddo"
                    }));
                }
                Ajax_xmofn_DOTes_Prel_4PR();
                break;

            case enumPagine.pgDocAperti:
                //Carica l'elenco dei documenti aperti
                Ajax_xmofn_DOAperti();
                break;

            case enumPagine.pgDocRistampa:
                Ajax_xmofn_DORistampa();
                break;

            case enumPagine.pgRLRig:
                //RICarica SEMPRE i dati di testa (potremmo saltare la pagina di caricamento dati di testa)
                //Viene fatto per caricare anche le info di prelievo
                Ajax_xmovs_xMORL();

                // Carica i tipi di Barcode utilizzabili 
                Ajax_xmofn_DOBarcode();
                // Carica le letture e il numero di quelle effettuate
                Ajax_xmofn_xMORLRig_AR();
                // Se PkList == true carica i Ref e abilita la pagina di packing
                if (oPrg.drDO.PkLstEnabled) {
                    oPrg.Pages[oPrg.PageIdx(enumPagine.pgRLPK)].Enabled = true;
                    // Caricare i codici PackListref se esistenti altrimenti propone quello nuovo
                    Ajax_xmofn_xMORLRigPackingList();
                }
                // Disabilita la pagina di PKList
                else {
                    oPrg.Pages[oPrg.PageIdx(enumPagine.pgRLPK)].Enabled = false;
                }
                //Disabilita la pagina del reset residuo in preleievo
                if (oPrg.drDO.xMOResiduoInPrelievo != 2)
                    oPrg.Pages[oPrg.PageIdx(enumPagine.pgRLPrelievo)].Enabled = false;

                // Se xMOAREtichette == true abilita la pagina
                if (!fU.IsEmpty(oPrg.Pages[oPrg.PageIdx(enumPagine.pgxAREtichette)])) {
                    oPrg.Pages[oPrg.PageIdx(enumPagine.pgxAREtichette)].Enabled = fU.ToBool(oPrg.drDO.xMOAREtichette);
                }
                break;

            case enumPagine.pgRLPrelievo:
                //Azzera residuo in prelievo da interfaccia se configurato
                Ajax_xmofn_xMORLPrelievo_Azzera();
                break;

            case enumPagine.pgRLRigID:
                //Carico la RL solo se già esistente
                if (fU.ToInt32(oPrg.Id_xMORL_Edit) > 0) {
                    xMORL_FIDOR_Load();
                }
                // Carico sempre le righe in modo da aggiornarle e se non esistono viene ripulita la tabella
                Ajax_xmofn_xMORLRig_FIDOR_AR();
                // Carica i tipi di Barcode utilizzabili 
                Ajax_xmofn_DOBarcode();
                break;

            case enumPagine.pgRLPK:
                // Carica l'elenco dei pcaklistref e li salva su un array globale
                Ajax_xmofn_xMORLPackListRef();
                break;

            case enumPagine.pgTR:
                // Se Id_xMOTR_Edit > 0 allora carica il TR passato alla funzione senno carica il TR top 1 con Stato = 0
                if (fU.ToInt32(oPrg.Id_xMOTR_Edit) > 0)
                    Ajax_xmofn_xMOTR_To_Edit();
                break;

            case enumPagine.pgTRRig_P:
                // Carica i tipi di Barcode utilizzabili 
                Ajax_xmofn_MovTraBarcode_P();
                // Se sono in Edit carico le letture effettuate
                if (!fU.IsEmpty(oPrg.Id_xMOTR_Edit)) Ajax_xmofn_xMOTRRig_P_AR();
                break;

            case enumPagine.pgTRRig_A:
                // Carica i tipi di Barcode utilizzabili 
                Ajax_xmofn_MovTraBarcode_A();
                // Carica letture effettuate in partenza se sono in Edit
                if (!fU.IsEmpty(oPrg.Id_xMOTR_Edit)) Ajax_xmofn_xMOTRRig_A_AR();
                break;

            case enumPagine.pgRLPK_R:
                //Disabilita la pagina del reset residuo in preleievo
                //if (oPrg.drDO.xMOResiduoInPrelievo != 2)
                //    oPrg.Pages[oPrg.PageIdx(enumPagine.pgRLPrelievo)].Enabled = false;
                break;

            case enumPagine.pgRLPiede:
                // Carica le eventuali note presenti per la rilevazione
                $("#pgRLPiede textarea[name='NotePiede']").text(oPrg.drRL.NotePiede);
                // Carica riepilogo se ci sono prelievi
                if (oPrg.drRL.CountPrelievi > 0) {
                    Ajax_xmofn_xMORLRig_Totali();
                    //Riporto il pagamento ed il totale del documento
                    switch (oApp.LicF_Id) {
                        case 33076: // MD
                        case 39340: // WKI MB
                        case 33056: // HP ITALIA
                            Ajax_xmofn_xMORLRig_R_PagamentoTotale();
                            break;
                        default:
                            break;
                    }
                }

                break;

            case enumPagine.pgTRPiede:
                Ajax_xmofn_xMOTRRig_Totali();
                break;

            case enumPagine.pgINAperti:
                // Assegno il tipo di inventario 
                // ATTENZIONE se passo in pgINAperti il prg è INM e quindi il tipo è MASSIVO
                oPrg.IN.Tipo = 'M';
                Ajax_xmofn_xMOIN_Aperti();
                break;

            case enumPagine.pgIN:
                // In base  al programma Mass o Punt imposto la variabile tipo di inventario
                // ATTENZIONE Nel caso in cui ho fatto nuovo dalla pagin INAperti era stato già assegnato e qui lo riassegna 
                switch (oApp.dtPrograms[oPrg.Key].Key) {
                    case 'INM':
                        oPrg.IN.Tipo = 'M'
                        break;
                    case 'INP':
                    case 'INMAT':
                        oPrg.IN.Tipo = 'P';
                        break;
                }
                Ajax_xmofn_xMOMGEsercizio("pgIN");
                break;

            case enumPagine.pgINRig:
                if (oPrg.IN.Tipo == 'M') {
                    // Inserisce gli articoli da inventariare nella tab xMOINRig poi chiama la funzione che ne carica l'elenco
                    Ajax_xmosp_xMOINRig_AR();
                }
                break;

            case enumPagine.pgSP:
                //Reset del dt delle spedizioni
                oPrg.SP.dt = [];
                //Carica la lista dei documenti di Spedizione dell'operatore 
                pgSP_OrderTable();
                break;

            case enumPagine.pgAA:
                // Carica i tipi di Barcode utilizzabili 
                Ajax_xmofn_xMOBarcode();
                break;

            case enumPagine.pgxMPIU:
                Ajax_xmofn_xMOMPIU_Aperte();
                Ajax_xmofn_xMOBilancia();
                break;

            case enumPagine.pgxAREtichette:
                Ajax_xmosp_xMOAREtichette_AR();
                break;

            case enumPagine.pgRLRig_T:
                // Svuoto la lista degli articoli
                $("#pgRLRig_T .lista-ar table tbody tr.tr-ar").remove();
                // Nascondo l'icona della lettura
                $("#pgRLRig_T img.Letto").hide();
                // Carica i tipi di Barcode utilizzabili 
                Ajax_xmofn_DOBarcode();
                // Prepara le righe per il giro prelievo in xmorlrig_T e poi carica le righe da prelevare
                Ajax_xmosp_xMORLRig_T_Save();
                break;

            case enumPagine.pgTRMP_P:
                // Carico le linee
                Ajax_xmofn_xMOLinea();
                // Carica tutti i P da produrre
                Ajax_xmofn_DORig_GetP();
                break;

            case enumPagine.pgTRMP_C_AR:
                // Carica tutti i C del P selezionato 
                Ajax_xmofn_DORig_GetC();
                break;

            case enumPagine.pgINM2Aperti:
                Ajax_xmofn_xMOIN_Aperti_M2();
                break;

            case enumPagine.pgINM2:
                Ajax_xmofn_xMOMGEsercizio("pgINM2");
                break;

            case enumPagine.pgINM2Rig:
                // Carica i tipi di Barcode utilizzabili 
                Ajax_xmofn_MovIntBarcode();
                // Carica le righe se presenti
                Ajax_xmofn_xMOINRig_M2();
                break;

            case enumPagine.pgPRTRAttivita:
                // Di default mostro le attività interne
                ActivePage().find("input[data-bind='Interne']").checked = true;
                ActivePage().find("input[data-bind='DaTrasferire']").checked = true;
                // Carica l'elenco delle attività
                Ajax_xmofn_xMOPRBLAttivita();
                break;

            case enumPagine.pgPRTRMateriale:
                // Carica l'elenco dei materiali dell'attività
                Ajax_xmofn_xMOPRBLMateriali();
                break;

            case enumPagine.pgCHS00012:
                pgCHS00012_Load();
                break;

            case enumPagine.pgRS:
                pgRS_Load();
                break;

            default:
                PopupMsg_Show("ERRORE", 1, "Errore di gestione del LoadData() della pagina " + oPrg.ActivePageId);
                break;
        }

    },

    // Carica l'interfaccia utente, della pagina
    "LoadUI": function () {

        /* =================================
        Attenzione! i dati potrebbero non essere tutti disponibili perché LoadData può lavorare anche in modo ASINCRONO
         ================================= */

        // In base alla pagina...
        switch (oPrg.ActivePageValue) {
            case enumPagine.pgCFARLIST:
                pgCFARLIST_UI();
                break;
            case enumPagine.pgGENCARICHI:
                pgGENCARICHI_UI();
                break;
            case enumPagine.pgAvviaConsumo:
                pgAvviaConsumo_UI();
                break;
            case enumPagine.pgRL:
                pgRL_UI();
                break;
            case enumPagine.pgRLRig:
                pgRLRig_UI();
                break;
            case enumPagine.pgRLPrelievo:
                pgRLPrelievo_UI();
                break;
            case enumPagine.pgRLPK:
                pgRLPK_UI();
                break;
            case enumPagine.pgRLPK_R:
                pgRLPK_R_UI();
                break;
            case enumPagine.pgRLPiede:
                pgRLPiede_UI();
                break;
            case enumPagine.pgTRPiede:
                pgTRPiede_UI();
                break;
            case enumPagine.pgPrelievi:
                // Chiudo il div dei filtri
                DivToggle_Execute($("#pgPrelievi .div-filtri"), false);
                // Svuoto la label che indica i doc selezionati e imposto l'icona  del checkbox vuoto
                $("#pgPrelievi .DOSel").text("0");
                $("#pgPrelievi .i-dotescked").attr("src", "icon/UnCheckbox.svg");
                pgPrelievi_UI_Edit();
                break;
            case enumPagine.pgStampaDocumento:
                pgStampaDocumento_UI();
                break;
            case enumPagine.pgTRRig_P:
                pgTRRig_P_UI();
                break;
            case enumPagine.pgTRRig_A:
                pgTRRig_A_UI();
                break;
            case enumPagine.pgTR:
                pgTR_UI();
                break;
            case enumPagine.pgTR_UBPA:
                pgTR_UBPA_UI();
                break;
            case enumPagine.pgIN:
                pgIN_UI();
                break;
            case enumPagine.pgINRig:
                pgINRig_UI();
                break;
            case enumPagine.pgINPiede:
                pgINPiede_UI();
                break;
            case enumPagine.pgSP:
                pgSP_UI();
                break;
            case enumPagine.pgLog:
                pgLog_UI();
                break;
            case enumPagine.pgAA:
                pgAA_UI();
                break;
            case enumPagine.pgRLRigID:
                pgRLRigID_UI();
                break;
            case enumPagine.pgSM:
                pgSM_UI();
                break;
            case enumPagine.pgINSSCC:
                pgINSSCC_UI();
                break;
            case enumPagine.pgTRSSCC:
                pgTRSSCC_UI();
                break;
            case enumPagine.pgINTMG_MAT:
                $("#pgINTMG_MAT .div-sscc").show().find(".Cd_xMOMatricola").text("");
                $("#pgINTMG_MAT .div-infosscc").hide();
                break;
            case enumPagine.pgINTMG_AR:
                pgINTMG_AR_UI();
                break;
            case enumPagine.pgINTMG_UbiMat:
                pgINTMG_UbiMat_UI();
                break;
            case enumPagine.pgTRMP_P:
                pgTRMP_P_UI();
                break;
            case enumPagine.pgTRMP_C_AR:
                pgTRMP_C_AR_UI();
                break;
            case enumPagine.pgTRRM:
                pgTRRM_UI();
                break;
            case enumPagine.pgINM2:
                pgINM2_UI();
                break;
            case enumPagine.pgINM2Rig:
                pgINM2Rig_UI();
                break;
            case enumPagine.pgINM2Piede:
                pgINM2Piede_UI();
                break;
            case enumPagine.pgCHS00012:
                pgCHS00012_UI();
                pgCHS00012_Render();
                break;
            case enumPagine.pgRLRig_T:
                pgRLRig_T_UI()
                break;
            default:
                // La pagina non necessita di UI
                break;
        }

    },

    // Salva i dati della pagina al back
    "SaveData": function () {
        var m = "";
        var r = false;

        // ATTENZIONE nelle prime pagine dei programmi non possono essere salvate le modifiche al back
        // In base alla pagina...
        switch (oPrg.ActivePageValue) {

            case enumPagine.pgRLPrelievo:
                var r = Ajax_xmosp_xMORLPrelievo_AzzeraSave();
                break;

            case enumPagine.pgRLPK:
                // Salvo le modifiche effettuate al pklistref modificato per ultimo 
                // NB lo faccio nel back perchè gli altri vengono salvati al click delle frecce, l'ultimo rimarrebbe non salvato
                r = Ajax_xmosp_xMORLPackListRef_Save();
                break;

            case enumPagine.pgRLPiede:
                // Salva il piede
                r = Ajax_xmosp_xMORLPiede_Save();
                break;

            case enumPagine.pgTR:
                r = Ajax_xmosp_xMOTR_Save();
                break;

            case enumPagine.pgPRTRMateriale:
                //Ricarica in modo temporizzato la lista delle attività
                setTimeout(function () {
                    Ajax_xmofn_xMOPRBLAttivita();
                }, 350);
                r = true;
                break;

            default:
                // pagine non validate
                r = true; break;
        }
        if (m != "") {
            //Se presente mostra l'errore
            PopupMsg_Show("ERRORE", 1, 'Impossibile continuare a causa di: ' + m);
        }

        // ATTENZIONE se la funzione non restituisce TRUE non va avanti 
        return r;
    },

    "Show": function (pgKey, left) {
        // Hide di tutte le pagine
        $("div.mo-page").hide();
        // Show della pagina corrente
        $("#" + pgKey).show();
        // //Attiva il focus al primo campo con la classe "first-focus" 
        // if (oApp.SetFocus != 0) {
        //     $("#" + pgKey + " .first-focus:visible").first().focus().select();
        // }
        SetFocus();
        Ajax_xmofn_DOAperti();
    },

    // Pulisce la pagina corrente 
    "Clear": function () {
        $("#" + this.ActivePageId + " input").val("");
        $("#" + this.ActivePageId + " input[type='check']").attr("checked", false);
        $("#" + this.ActivePageId + " textarea").val("");
    },
}

// Classe fCF: Gestisce le funzioni generali per i clienti / fornitori
var fCF = {

    "Etichetta": function (breve) {
        switch ((Stato.DO[Stato.idxDO].CF).toUpperCase()) {
            case "C":
                return (breve == true ? "C" : "Cliente");
            case "F":
                return (breve == true ? "F" : "Fornitore");
            default:
                return (breve == true ? "C/F" : "Cliente/Fornitore");
        }
    },

    "AutoComplete": function (cf) {
        //Autocompleta il codice CF formattandolo a 7 cifre
        var t = $(cf).val();
        if (t.length > 0) {
            if (t.length != 7) {
                //Completo la stringa del CF perché non è nel numero di caratteri validi: 7
                t = '000000' + t;
                $(cf).val(Stato.DO[Stato.idxDO].CF + t.substring(t.length - 6));
            }
        }
    }

}

/**
 * Classe fDO: Gestisce le funzioni generali per i documenti
 */
var fDO = {

    "FindIdxByCd_Do": function (Cd_DO) {
        //Restituisce l'idx di DO
        for (i = 0; i < Stato.DO.length; i++) {
            if (Stato.DO[i].Cd_DO == Cd_DO) {
                return i;
            }
        }
        //nessun doc trovato!!
        return -1;
    }
}

/**
 * Classe fMG: Gestisce le funzioni generali per i magazzini
 */
var fMG = {

    "Mg4Find": function (Cd_MG_P, Cd_MG_A) {
        //normalizza i valori
        // Cd_MG_P = fU.IsEmpty(Cd_MG_P);
        // Cd_MG_A = fU.IsEmpty(Cd_MG_A);

        //verifica i magazzini passati alla funzione
        if (Cd_MG_P == "" && Cd_MG_A == "") {
            return "";
        } else if (Cd_MG_P != "" && Cd_MG_A == "") {
            return Cd_MG_P;
        } else if (Cd_MG_P == "" && Cd_MG_A != "") {
            return Cd_MG_A;
        } else {
            //Se sono presenti entrambi in magazzini restituisco quello di partenza
            return Cd_MG_P;
        }
    },
    "Mg4PA": function (Codice) {
        var v = "";
        //Testa l'ultimo carattere per interpretare il _P o _A o nessuno dei due
        switch (Codice.substring(Codice.length - 2, Codice.length).toLowerCase()) {
            case "_p": v = "_P"; break;
            case "_a": v = "_A"; break;
        }
        return v;
    }

}

/**
 * Classe fU: Utility globali
 */
var fU = {
    "checkPers": function (jsPers, nPers) {
        var hasPers = false;
        if (!this.IsEmpty(jsPers)) {
            var oPers = JSON.parse(jsPers);
            hasPers = oPers.find(function (pers) {
                return pers.codice == nPers
            }) != undefined;
        }
        return hasPers;
    },
    // Restituisce il nome dell'oggetto passato come parametro
    "NameOf": function (obj) {
        for (var key in window) { if (window[key] == obj) return key; }
    },

    // Salva l'oggetto passato come parametro in una variabile di sessione
    "SetSession": function (obj) {
        sessionStorage.setItem(this.NameOf(obj), JSON.stringify(obj));
    },

    // Recupera la variabile di stato con il nome specificato
    "GetSession": function (name) {
        var app = sessionStorage.getItem(name);
        if (app == null || app == undefined) { return null; }
        else { return $.parseJSON(app); }
    },

    "GetEnumKey": function (e, enumval) {
        var rkey = "";

        $.each(e, function (key, val) {
            if (val == enumval) {
                rkey = key;
                return; // esco dal foreach
            }
        });

        return rkey;
    },

    // Verifica se il valore passato alla funzione è 0
    "IsZeroVal": function (val) {
        return (val == undefined || val == '0' || val == '' ? true : false);
    },
    "Adesso": function () {
        var currentdate = new Date();
        var datetime = currentdate.toLocaleString("it-IT", { month: "2-digit", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });
        //new Date().toLocaleDateString("it-IT", { month: "2-digit", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" })
        return datetime;
    },
    // Formatta la data
    "ToDate": function (sDate) {
        // Se è stato 
        r = "";
        //Testa il browser
        switch (oApp.BrowserType) {
            case enumBrowser.Chrome:
            case enumBrowser.Mozilla:
                r = this.DateJsonToDateRev(sDate);
                break;
            default:
                r = this.DateJsonToDate(sDate);
                break;
        }
        return r;
    },

    // Formatta la data e ora
    "ToDateTime": function (sDateTime) {
        // Se è stato 
        r = "";
        //Testa il browser
        switch (oApp.BrowserType) {
            case enumBrowser.Chrome:
                r = this.DateJsonToTimeRev(sDateTime);
                break;
            default:
                r = this.DateJsonToTime(sDateTime);
                break;
        }
        return r;
    },

    // Formattazione della data  (GG/MM/YYYY)
    "DateJsonToDate": function (sDate) {
        if (!fU.IsEmpty(sDate)) {
            sDate = sDate.toString();
            var num = parseInt(sDate.replace(/[^0-9]/g, ""));
            var date = new Date(num);
            var gg = "0" + date.getDate();
            var me = "0" + (parseInt(date.getMonth() + 1));
            var an = date.getFullYear();
            var d = gg.substring(gg.length - 2) + "/" + me.substring(me.length - 2) + "/" + an;
            return (d == "01/01/1970" ? "" : d);
        } else {
            return "";
        }
    },
    "DateJsonToDateTime": function (sDate) {
        if (!fU.IsEmpty(sDate))
            return new Date(parseInt(sDate.toString().replace(/[^0-9]/g, "")));
        else return undefined;
    },
    "DateToInput": function (date) {
        return date.toLocaleDateString('en-CA');
    },
    "DateJsonToStandard": function (sDate, time) {
        if (!fU.IsEmpty(sDate)) {
            var date = this.DateJsonToDateTime(sDate.toString());
            var dateParts = [];
            dateParts.push(date.toLocaleDateString('en-CA'));// Utilizzo lo standard Canadese perchè rispetta quello de JS yyyy-mm-dd
            if (time == true)
                dateParts.push(date.getHours().toString().concat(':', date.getMinutes().toString()));
            return dateParts.join('T');
        } else return "";
    },
    // Formattazione della data  (GG/MM/YY)
    "DateJsonToShortDate": function (sDate) {
        if (!fU.IsEmpty(sDate)) {
            sDate = sDate.toString();
            var num = parseInt(sDate.replace(/[^0-9]/g, ""));
            var date = new Date(num);
            var gg = "0" + date.getDate();
            var me = "0" + (parseInt(date.getMonth() + 1));
            var an = date.getFullYear();
            var d = gg.substring(gg.length - 2) + "/" + me.substring(me.length - 2) + "/" + parseInt(fU.ToString(an).slice(2));
            return (d == "01/01/1970" ? "" : d);
        } else {
            return "";
        }
    },

    // Formattazione della data per Chrome (YYYY-MM-GG)
    "DateJsonToDateRev": function (sDate) {
        if (!fU.IsEmpty(sDate)) {
            sDate = sDate.toString();
            var num = parseInt(sDate.replace(/[^0-9]/g, ""));
            var date = new Date(num);
            var gg = "0" + date.getDate();
            var me = "0" + (parseInt(date.getMonth() + 1));
            var an = date.getFullYear();
            var d = an + "-" + me.substring(me.length - 2) + "-" + gg.substring(gg.length - 2);
            return (d == "01-01-1970" ? "" : d);
        } else {
            return "";
        }
    },

    // Formattazione di data ora  (GG/MM/YYYY HH:MM:SS)
    "DateJsonToTime": function (sDate) {
        if (!fU.IsEmpty(sDate)) {
            sDate = sDate.toString();
            var num = parseInt(sDate.replace(/[^0-9]/g, ""));
            var date = new Date(num);
            var gg = "0" + date.getDate();
            var me = "0" + (parseInt(date.getMonth() + 1));
            var an = date.getFullYear();
            var or = "0" + date.getHours();
            var mi = "0" + date.getMinutes();
            var se = "0" + date.getSeconds();
            var d = gg.substring(gg.length - 2) + "/" + me.substring(me.length - 2) + "/" + an + " "
                + or.substring(or.length - 2) + ":" + mi.substring(mi.length - 2) + ":" + se.substring(se.length - 2);
            return (d == "01/01/1970 01:00:00" ? "" : d);
        } else {
            return "";
        }
    },

    // Formattazione di data ora  Per Chrome (YYYY-MM-GG HH:MM:SS)
    "DateJsonToTimeRev": function (sDate) {
        if (!fU.IsEmpty(sDate)) {
            sDate = sDate.toString();
            var num = parseInt(sDate.replace(/[^0-9]/g, ""));
            var date = new Date(num);
            var gg = "0" + date.getDate();
            var me = "0" + (parseInt(date.getMonth() + 1));
            var an = date.getFullYear();
            var or = "0" + date.getHours();
            var mi = "0" + date.getMinutes();
            var se = "0" + date.getSeconds();
            var d = an + "-" + me.substring(me.length - 2) + "-" + gg.substring(gg.length - 2) + " "
                + or.substring(or.length - 2) + ":" + mi.substring(mi.length - 2) + ":" + se.substring(se.length - 2);
            return (d == "1970/01/01 01:00:00" ? "" : d);
        } else {
            return "";
        }
    },
    // Restituisce una stringa nel formato YYYYMMDD HH:MM
    "DateTimeToSql": function (sDate) {
        var date = null;

        if (typeof sDate === 'string' && sDate != '') date = new Date(sDate);
        else return null;

        return date.getFullYear().toString().concat('0'.concat(date.getMonth() + 1).slice(-(2)), '0'.concat(date.getDate()).slice(-(2)), ' ', '0'.concat(date.getHours()).slice(-(2)), ':', '0'.concat(date.getMinutes()).slice(-(2)));
    },
    // Restituisce una stringa nel formato YYYYMMDD
    "DateToSql": function (sDate) {
        var date = null;

        if (typeof sDate === 'string' && sDate != '') date = new Date(sDate);
        else return null;

        return date.getFullYear().toString().concat('0'.concat(date.getMonth() + 1).slice(-(2)), '0'.concat(date.getDate()).slice(-(2)));
    },

    // Restituisce true se il valore passato alla funzione è null
    "IsNull": function (val) {
        if (val == null || val == undefined)
            return true;

        return false;
    },

    "IsObject": function (o) {
        return typeof o == 'object' && o != null ? true : false;
    },
    "IsString": function (s) {
        return typeof s == 'string' ? true : false;
    },
    // Restituisce true se il check passato alla funzione è checked = true
    "IsChecked": function (check) {
        if ($(check).prop("checked") == true)
            return true;
        else
            return false;
    },

    "IsVisible": function (ele) {
        if ($(ele).is(":visible") == true)
            return true;
        else
            return false;
    },

    // Restituisce nullval se il valore passato alla funzione è null; se anche nullvall = null allora la funzione restituirà ""
    "IfNull": function (val, nullval) {
        // Verifico nullval
        nullval = (this.IsNull(nullval) ? "" : nullval);
        // Return
        return (this.IsNull(val) ? nullval : val);
    },

    // Verifica se il valore passato alla funzione è una data valida
    "IsDate": function (val) {

        // Se vuoto il valore passato alla funzione torna true
        if (!fU.IsEmpty(val)) {

            var date = Date.parse(val);

            if (isNaN(date)) {
                return false;
            }

            val = val.replace(/-/g, '/');
            var comp = val.split('/');

            if (comp.length !== 3) {
                return false;
            }

            var s0 = comp[0].length;
            var s1 = comp[1].length;
            var s2 = comp[2].length;

            //testa la lunghezza del dato (2xGG, 2xMM, 4xAAAA magari non in questo ordine)
            if (s0 + s1 + s2 == 8) {
                return true;
            } else {
                return false;
            }
        } else { return true }
    },

    // Formatta la data prima di inserirla nel campo in base al browser e alla lingua
    "DateFormatToBrowserLang": function (date) {

        var r;
        //Testa il browser
        switch (oApp.BrowserType) {
            case enumBrowser.Explorer:
                //Explorer in italiano è l'unico che ha bisogno della data "girata"
                switch (navigator.language.substr(0, 2).toLowerCase()) {
                    case "en":
                        r = date.replace("-", "").replace("-", "");
                        r = r.replace("/", "").replace("/", "");
                        g = r.substr(0, 2);
                        m = r.substr(2, 2);
                        a = r.substr(4, 8);
                        r = m + "/" + g + "/" + a;
                        break;
                    default:
                        r = date;
                }
                break;
            default:
                r = date;
        }

        return r;
    },


    // Restituisce nullval se il valore passato alla funzione è null o ugale a epval (per default IsNull(nullval) == true ->  = "")
    "IsEmpty": function (val) {
        val = this.ToString(val);
        return (val == "" ? true : false);
    },
    // Restituisce epval se il valore passato alla funzione è ""
    "IfEmpty": function (val, epval) {
        // Verifico epval
        epval = (this.IsEmpty(epval) ? "" : epval);
        // Return
        return (this.IsEmpty(val) ? epval : val);
    },

    // Converte il valore String passato alla funzione in boolean
    "ToBool": function (val) {
        var v = false;
        if (val == undefined) val = "undefined";
        if (val === true) val = "true";
        if (val === false) val = "false";
        // Convrte il numero in stringa perchè la prop toLowerCase supporta solo stringhe
        if (val == 1 || val == 0) val = fU.ToString(val);
        switch (val.toLowerCase()) {
            case "true":
            case "vero":
            case "1":
                v = true;
        }
        return v;
    },

    //Restituisce sempre una stringa senza caratteri spazio inizio e fine
    "ToString": function (val) {
        if (val == undefined) val = "";
        if (val == null || val == "null") val = "";
        if (val == "NaN") val = "";
        if (val === true) val = "true";
        if (val === false) val = "false";
        val = val.toString().trim();
        return val;
    },
    //Restituisce la stringa o null (mai vuoto)
    "ToStringNull": function (val) {
        if (val == undefined) val = null;
        if (val == null || val == "null") val = null;
        if (val === true) val = "true";
        if (val === false) val = "false";
        if (val == "") val = null;
        val = val;

        return val;
    },
    //Restituisce un valore senza spazi e in UPPERCASE
    "UpTrim": function (val) {
        return val.trim().toUpperCase();
    },
    //Restituisce un valore senza spazi e in LOWERCASE
    "LoTrim": function (val) {
        return val.trim().toLowerCase();
    },

    //Restituisce sempre un valore int32
    "ToInt32": function (val) {
        var r = 0;
        if (!this.IsEmpty(val)) {
            r = parseInt(val);
        }
        return r;
    },

    "ToDecimal": function (val) {
        var r = 0;
        if (val) {
            if (!this.IsEmpty(val) && this.IsString(val)) {
                //cambia la virgola in punto
                val = val.replace(",", ".");
                r = parseFloat(val);
            } else
                r = val;
        }
        return r;
    },
    // Restituisce la lunghezza del valore passato come parametro
    "lengthOf": function (val) {
        var r = 0;
        if (val != null) {
            r = val.length;
        }
        return r;
    },

    // Copia val1 in val2
    "Copy": function (val1, val2) {
        val2 = val1;
    },

    // Copia l'elemento specificato dell'array in un oggetto
    "Array2Obj": function (array, idx, obj) {
        var val1 = array[idx];
        this.Copy(val1, obj);
    },

    //Checked in base al valore della variabile attivo (valore boolean) 
    "CheckIf": function (check, attivo) {
        check.prop('checked', attivo);
    },

    //Visualizza o nasconde l'elemento in base alla variabile mostra (val boolean) 
    "ShowIf": function (ele, mostra) {
        if (mostra == false) ele.hide();
        else ele.show();
    },

    "DisableIf": function (ele, disable) {
        if (disable == true) $(ele).attr("disabled", "disabled");
        else ele.removeAttr("disabled");
    },

    // Restituisce true se un valore numerico è undefined, "" o 0
    "IsZeroVal": function (val) {
        return (val == undefined || val == '0' || val == '' || this.IsEmpty(val) ? true : false);
    },

    "IsPrelievoUI": function (preltype) {
        var uion = false;
        switch (preltype) {
            case 0:     //Nessun Prelievo
            case 3:     //Prelieva dal più vecchio
                break;
            case 1:     //Prelievo
            case 2:     //Copia righe
                uion = true;
                break;
        }
        return uion;
    },

    // Imposta lo scroll degli oggetti
    // NB: Passare solo il nome della pagina o del detail di cui gestire lo scroll
    "Overflow": function (nameobjhtml, state) {
        $("#" + nameobjhtml).css("overflow", state);
    },

    "SsccToMatricola": function (sscc) {
        // Normalizzo la matricola
        var mat = "";
        if (sscc.slice(0, 2) == "00") mat = sscc.substring(2, sscc.length);
        else mat = sscc;
        // restituisce sempre i primi 18 caratteri
        return mat.substring(0, 18);

    },
    "ToStringNumber": function (number) {
        return number.toLocaleString("it", { minimumFractionDigits: 2 })
    },
}
/****************************************************************************************/

//UTILITY
function isJson(value) {
    try {
        var _ = JSON.parse(value);
        return true;
    } catch {
        return false;
    }
}

//Gestione errori chiamate ajax / server
function Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown) {
    // Debug su console
    if (oApp.Debug) {
        console.log(XMLHttpRequest);
        console.log(textStatus);
        console.log(errorThrown);
    }

    //Setto i valori del footer
    $("#PopupMsg .footer-info span[name='Versione']").html("Versione: " + Versione);
    $("#PopupMsg .footer-info span[name='Ditta']").html(oApp.Ditta);
    $("#PopupMsg .footer-info span[name='Terminale']").html("Terminale: " + oApp.Terminale);
    $("#PopupMsg .footer-info span[name='Cd_Operatore']").html("Operatore: " + oApp.Cd_Operatore);
    $("#PopupMsg .footer-info span[name='DataOra']").html("Data: " + fU.Adesso());

    // Variabili di ritorno
    var response = isJson(XMLHttpRequest.responseText) ? JSON.parse(XMLHttpRequest.responseText).Message : XMLHttpRequest.responseText;
    var status = XMLHttpRequest.status;
    var statusTxt = XMLHttpRequest.statusText;
    // Messaggio restituito
    var text = "ERRORE \n" + response + "\n" + status + " - " + statusTxt;
    PopupMsg_Show(statusTxt, 1, "Ajax " + text);

    //Mostro il footer del Popup
    $("#PopupMsg .footer-info").show();

    // ### Sviluppare la pagina della pila dei messaggi                
}

//Gestione errori client
function ErrOut(err) {
    //Apro il Popup
    PopupMsg_Show("ERRORE", 1, "ErrOut " + err);
    // ### Sviluppare la pagina della pila dei messaggi 
}

// Show del popup dei messaggi
// ### Enumerare le tipologie di messagio in modo da arricchire il popup
function PopupMsg_Show(title, result, msg, focusto, callback) {

    var focusedElement = $(focusto ? focusto : document.activeElement);

    if (!msg)
        msg = "Errore!!! E' stato richiamato il messaggio in modo anomalo (caller " + PopupMsg_Show.caller + ")"

    //Accoda alla gestione della messaggistica di sessione
    Messages_Add(title, msg);

    // ATTENZIONE: Rimuove tutti gli eventi legati al pulsante in altri punti del codice per gestire casi particolari
    // (es in ajax_xmosp_xmorlrig_t_save) e binda l'evento click che nasconde il popup
    $("#PopupMsg button").unbind("click").on("click", function () {
        //Nasconde il popup
        $("#PopupMsg").hide();
        //Reimposta il focus
        $(focusedElement ? focusedElement : $(':focus')).focus().select();
        //Chiama la callback
        if (callback) callback();
    });

    //Nascondo il footer del Popup
    $("#PopupMsg .footer-info").hide();

    //Apre Il popup con ritardo (per far scatenare tutti gli eventi della pagina)
    setTimeout(function () {
        $("#PopupMsg .msg").html((fU.ToString(result) == 1 ? "" : + result + " : ") + msg.replace("\n", "<br />"));
        $("#PopupMsg .title").html(title);
        $("#PopupMsg .div-btn").show();

        $("#PopupMsg").show();
        $("#PopupMsg button").focus();
    }, 250);
}

//Oggetto di gestione roll delle tabelle(lg-table --> th-rolling + atr roll="nomeclassetd")
//<table class="content lg-table w3-table w3-striped lg-mt-30">
//  <tr>
//      <th class="lg-lbl-da th-rolling" roll="Cd_ARLotto">LOTTO</th>
//      <th class="lg-lbl-da th-rolling" roll="Cd_MG">Mg</th>
//      <th class="lg-lbl-da th-rolling" roll="Cd_MGUbicazione">Ubicaz.</th>
//  </tr>
//  <tr>
//      <td class="lg-font-07em Cd_ARLotto"></td>
//      <td class="lg-font-07em Cd_MG"></td>
//      <td class="lg-font-07em Cd_MGUbicazione"></td>
//  </tr>
//</table>
var rolling = {
    tableSet: function (table) {
        $(table).find(".th-rolling").each(function (idx, item) {
            //Nasconde il roll di tutte le colonne tranne la prima
            if (idx == 0)
                rolling.showCol(table, item);
            else
                rolling.hideCol(table, item);
            //Attiva il click
            $(item).on("click", function () { rolling.clickOn($(table), $(this)); });
        });
    },
    clickOn: function (table, item) {
        var rolling = $(table).find(".th-rolling");
        var curIdx;
        //Nasconde il corrente
        curIdx = $(rolling).index($(item));
        this.hideCol(table, rolling[curIdx]);
        //Mostra il successivo o il primo
        curIdx = curIdx == $(rolling).length - 1 ? 0 : curIdx + 1;
        this.showCol(table, rolling[curIdx]);
    },
    hideCol: function (table, item) {
        //th
        $(item).hide();
        //td
        $(table).find("." + $(item).attr("roll")).hide();
    },
    showCol: function (table, item) {
        //th
        $(item).show();
        //td
        $(table).find("." + $(item).attr("roll")).show();
    },
    getActiveCol: function (table) {
        /*
         * jQuery non restituisce mai un vero array di javascript
         * utilizzare Array.prototype.slice.call(jQueryArray, 0) per avere un array di javascript filtrabile
         */
        var roll = Array.prototype.slice.call($(table).find(".th-rolling"), 0).filter(function (item) {
            return item.style.display != "none";
        })[0];

        return roll;
    },
    setActiveCol: function (table, item) {
        //Nascondo tutte le colonne del rolling
        $(table).find(".th-rolling").each(function () {
            $(this).hide();
            $(table).find("." + $(this).attr("roll")).hide();
        })

        //Attivo la colonna
        $(item).show();
        $(table).find("." + $(item).attr("roll")).show();
    }
};

// Oggetto di gestione si/no utente
var popup_yna = {
    visible: false
    , focus_to: null
    // Funzioni
    , f_yes: null       //funzione da eseguire se premiamo Sì       (definirla come function() { miafunzione_si(p1,p2,ecc)} )
    , f_no: null        //funzione da eseguire se premiamo No       (definirla come function() { miafunzione_no(p1,p2,ecc)} )
    , f_abort: null     //funzione da eseguire se premiamo Annulla  (definirla come function() { miafunzione_no(p1,p2,ecc)} )
    //, showPay: function (payload) {
    //    this.show(payload.);
    //}
    , show: function (title, msg, popup_style, focus_to, f_yes, lbl_yes, f_no, lbl_no, f_abort, lbl_abort) {

        //default
        if (!popup_style) popup_style = 'yn';
        if (!lbl_yes) lbl_yes = "Si";
        if (!lbl_no) lbl_no = "No";
        if (!lbl_abort) lbl_abort = "Annulla";

        this.visible = true;
        //se passate alla funzione le assegna
        if (focus_to) this.focus_to = focus_to;
        if (f_yes) this.f_yes = f_yes;
        if (f_no) this.f_no = f_no;
        if (f_abort) this.f_abort = f_abort;

        //Se non passato il focus memorizza il default 
        if (!this.focus_to)
            this.focus_to = $(':focus');

        var pg = "#Popup_YNA";
        $(pg + " .title").html(title);
        $(pg + " .msg").html(msg.replace("\n", "<br />"));

        //YES
        if (popup_style.indexOf('y') >= 0)
            $(pg + " .btn-yes").text(lbl_yes).show();
        else
            $(pg + " .btn-yes").text(lbl_yes).hide();
        //NO
        if (popup_style.indexOf('n') >= 0)
            $(pg + " .btn-no").text(lbl_no).show();
        else
            $(pg + " .btn-no").hide();
        //ABORT
        if (popup_style.indexOf('a') >= 0)
            // se la funzione annulla non è stata de
            $(pg + " .btn-abort").text(lbl_abort).show();
        else
            $(pg + " .btn-abort").hide();

        //Apre Il popup con ritardo (per far scatenare tutti gli eventi della pagina)
        setTimeout(function () {
            $(pg).show();
            $(pg + " button:first").focus();
        }, 300);

        //Accoda alla gestione della messaggistica di sessione
        Messages_Add(title, msg);
    }
    , close: function (click_yna) { //click_yna: y = yes; n = no; a = abort
        var pg = "#Popup_YNA";

        //Accoda alla gestione della messaggistica di sessione recuperando il valore del pulsante
        Messages_Add(null, "[ris=" + $(pg + " .btn-" + click_yna).text() + "]", true);

        //rilascio il messagio
        this.visible = false;

        //eseguo le funzioni di Si e No se definite
        if (click_yna == 'y' && this.f_yes) this.f_yes();
        else if (click_yna == 'n' && this.f_no) this.f_no();
        else if (click_yna == 'a' && this.f_abort) this.f_abort();

        //Nasconde il popup
        $(pg).hide();
        //Reimposta il focus
        if (this.focus_to) $(this.focus_to).focus();

    }
};

function Messages_Add(title, msg, concat_last) {
    if (!concat_last) concat_last = false;  // default
    if (oApp.Messages == null) oApp.Messages = [];
    if (concat_last) {
        //Accoda il msg all'ultimo (lo zeresimo) messaggio
        oApp.Messages[0].Message = oApp.Messages[0].Message.concat('\n' + msg);
    }
    else {
        //Inserisce il nuovo messaggio per primo nella pila
        var msg = {
            "DateTime": fU.DateJsonToTime($.now())
            , "Title": title
            , "Message": msg
        };
        oApp.Messages.unshift(msg);
    }
}

// -------------------------------------------------
// REGION: FOCUS
// -------------------------------------------------

//evento per impostare il focus sul primo input vuoto (se afterclass != "" è il primo input dopo questa classe)
//function SetFocus(aftername) {
//    //Imposto il focus solo se il terminale ha la tipologia di focus <> da disattivo
//    if (oApp.SetFocus != 0) {

//        //Cerca un testo vuoto diverso dal nome passato alla funzione
//        var e_text = $("#" + oPrg.ActivePageId + " input:visible").filter(function () {
//            //Nome diverso dal quello passato alla funzione e testo vuoto
//            var ret = ($(this).attr("name") != aftername && $(this).val() === "");
//            return ret;
//        });

//        //Se esiste setta il focus
//        if (e_text.length > 0) {
//            $(e_text).filter(":first").focus().select();
//        } else {
//            //Assegna il focus al primo pulsante 
//            $("#" + oPrg.ActivePageId + " button:visible").focus();
//        }

//        //..........................................................................
//        //var find = !fU.IsEmpty(aftername);          //Eseguo la ricerca ?
//        //var findFirst = fU.IsEmpty(aftername);      //Cerco il primo ?
//        //var findIt = false;
//        //$("#" + oPrg.ActivePageId + " input:visible").each(function () {
//        //    //Se ho trovato quello che cercavo O devo trovare il primo
//        //    if ((find && findIt) || findFirst) {
//        //        //Verifico che il campo sia vuoto
//        //        if (this.value === '') {
//        //            this.focus();
//        //            findIt = true;
//        //            return false;
//        //        }
//        //    }
//        //    //Verifica che la classe corrente corrisponda a quella passata alla funzione come after
//        //    if (find && !findIt) { findIt = ($(this).attr("name") == aftername ? false : true); }
//        //});

//    }
//}

//Salvo il valore del check sul local storage
function SetAutoConfirm() {
    oApp_SetLocalProperty(oPrg.ActivePageId, "AutoConfirm", document.querySelector("#" + oPrg.ActivePageId + " .ck-autoconfirm").checked);
}

// Setta il focus nel primo campo della pg con classe first-focus visibile
function SetFocus() {
    $("#" + oPrg.ActivePageId + " .first-focus:visible:enabled").first().focus().select();
}

// Nasconde l'oggetto corrispondente all'id passato alla funzione e imposta il focus nel campo
function HideAndFocus(id, focusTo) {
    $("#" + id).hide();
    if (focusTo)
        focusTo.focus().select();
    else
        Find_Next_Tabindex();
}

// Aggiungere al progetto la funzione i tabindex a tutti i campi e una variabile globale 
// per attivare e disattivare la funzionalità (per attivarla verificare sia che SetFocus == 1 && la nuova variabile == true)
function Find_Next_Tabindex() {
    var newindex = -1;

    // La variabile index contiene il tabindex dell'oggetto attualmente con il focus nella pagina corrente
    var index = fU.ToInt32($("#" + oPrg.ActivePageId + " :focus").attr("tabindex"));

    // Se non ho trovato nessun campo con il focus lo setto sul primo della pg che ha il tabindex
    if (fU.IsEmpty(index) || index <= 0) {
        SetFocus();
        return;
    }

    // Se index == all'ultimo visibile e abilitato della pagina richiamo il setfocus
    if (index == $("#" + oPrg.ActivePageId + " [tabindex]:visible:enabled").last().attr("tabindex")) {
        SetFocus();
    }
    else {
        // Prendo tutti gli oggetti (input, select, textarea.. visibili e abilitati nella pagina corrente (i visibility:hidden sono considerati visibili))
        $("#" + oPrg.ActivePageId + " [tabindex]:visible:enabled").each(function (i, obj) {
            if (fU.ToInt32($(obj).attr("tabindex")) > index) {
                // Verifico che il campo successivo sia vuoto altrimenti continuo a cercare il prossimo vuoto
                //if (fU.IsEmpty($(obj).val()) || $(obj).attr("name") == "Quantita") {}

                // Prendo il nuovo tabindex                         
                newindex = fU.ToInt32($(obj).attr("tabindex"));
                //Esce dal for each
                return false;
            }
        });

        // Se new tab è ancora -1 non ho trovato nulla e riporto il focus sul primo oggetto della pagina
        if (newindex == -1) {
            // Newindex sarà uguale al tab del primo oggetto visibile e abilitato della pagina
            newindex = fU.ToInt32($("#" + oPrg.ActivePageId + " [tabindex]:visible:enabled").first().attr("tabindex"));
        }
        //Focus sul campo
        $("#" + oPrg.ActivePageId + " [tabindex='" + newindex + "']").focus().select(); // Inutile? .addClass("mo-br-orange");
    }
}
// -------------------------------------------------
// ENDREGION: FOCUS
// -------------------------------------------------

function ActivePage() {
    return $('#' + oPrg.ActivePageId);
}

$.fn.setVal = function (value) {
    $(this).val(value).change();
    return $(this);
}

function GetBindedValues(querySelector) {
    // Recupero gli elementi bindati
    var bindedElements = querySelector ? $(ActivePage()).find(querySelector).find('[data-bind]').toArray() : $(ActivePage()).find('[data-bind]').toArray();

    // Direzione del Binding
    // Set:         data-bind-direction="OneWay"
    // Set & Get:   data-bind-direction="TwoWay"

    // Funzione per recuperare il valore dall'elemento del DOM
    var getElementValue = function (element) {
        var value = null;

        switch ($(element).prop('tagName').toLowerCase()) {
            case 'input':
                switch ($(element).attr('type').toLowerCase()) {
                    case 'checkbox':
                        value = $(element).prop('checked');
                        break;
                    case 'number':
                        value = fU.ToDecimal($(element).val());
                        break;
                    default:
                        value = $(element).val();
                        break;
                }
                break;
            case 'textarea':
                value = $(element).val();
                break;
            case 'select':
                value = $(element).val();
                break;
            default:
                value = $(element).text();
                break;
        }

        return value;
    }

    // Oggetto con i valori
    var bindedValues = {};

    // Creo un oggetto data-bind: value
    bindedElements.forEach(function (element) {
        bindedValues[$(element).attr('data-bind')] = getElementValue(element);
    });

    return bindedValues;
}

function addStylesheetRules(rules) {
    var styleEl = document.createElement('style');

    // Append <style> element to <head>
    document.head.appendChild(styleEl);

    // Grab style element's sheet
    var styleSheet = styleEl.sheet;

    for (var i = 0; i < rules.length; i++) {
        var j = 1,
            rule = rules[i],
            selector = rule[0],
            propStr = '';
        // If the second argument of a rule is an array of arrays, correct our variables.
        if (Array.isArray(rule[1][0])) {
            rule = rule[1];
            j = 0;
        }

        for (var pl = rule.length; j < pl; j++) {
            var prop = rule[j];
            propStr += prop[0] + ': ' + prop[1] + (prop[2] ? ' !important' : '') + ';\n';
        }

        // Insert CSS Rule
        styleSheet.insertRule(selector + '{' + propStr + '}', styleSheet.cssRules.length);
    }
}

<%--
    # PAGINE DI Logistica DA 1.0000 A 2.9999
        #1.0000 HEADER (HEADER DELL'APPLICAZIONE)
        #1.0100 pgHome (MENU PRINCIPALE)      
        #1.0200 pgSottoMenu (VOCI DEI SOTTO MENU)  
        #1.0300 pgDocAperti (ELENCO DEI DOCUMENTI APERTI)  
        #1.0400 pgDocRistampa (RISTAMPA DOC ESISTENTE)
        #1.0500 pgAvviaConsumo (DICHIARAZIONE AVVIO CONSUMO MP SU LINEE PRODUZIONE)
        #1.0600 pgRL (TESTA DOC)
        #1.0700 pgDOPrelievi (PRELIEVI DI UNA DOTes)
        #1.0800 pgPrelievi (TUTTI I DOC PRELEVABILI)
        #1.0900 pgRLRig (RIGHE DOC)
        #1.0950 pgRLPK (PACK LIST)
        #1.0960 pgRLPrelievo (Prelievo del documento)
        #1.0970 pgRLPK_R (prelievo da packing list)
        #1.1000 pgRLPiede (PIEDE DEL DOCUMENTO)
        #1.1100 pgStampaDocumento (ELENCO DOCUMETI GENERARI IN ARCA DI CUI SI PUO' LANCIARE LA STAMPA)
        #1.1200 pgTR (TRASFERIMENTI INTERNI: TESTA)
        #1.1300 pgTRRig_P (TRASFERIMENTI INTERNI: LETTURE DI PARTENZA)
        #1.1400 pgTRRig_A (TRASFERIMENTI INTERNI: LETTURE DI ARRIVO)
        #1.1500 pgTRPiede (TRASFERIMENTI INTERNI: PIEDE)
        #1.1550 pgTR_UBPA (TRASFERIMENTI INTERNI: Per ubicazione partenza-arrivo)
        #1.1600 pgINAperti (INVENTARIO: ELENCO INVENTARI APERTI)
        #1.1700 pgIN (INVENTARIO: TESTA)
        #1.1800 pgINRig (INVENTARIO: ELENCO AR MASSIVO + DETTAGLIO PER INVENTARIO PUNTUALE)
        #1.1900 pgINPiede (INVENTARIO: PIEDE)
        #1.2100 pgSP (SPEDIZIONE)
        #1.2201 pgAA (ACQUISIZIONE ALIAS)
        #1.2202 pgRLRigID (PRELIEVO DA Id_DORIG)
        #1.2300 pgLog (PAGINA DI LOG)
        #1.2400 pgxMPIU (PERS: PAGINA PER PESATE MATERIE PRIME IN-OUT)
        #1.2500 pgxAREtichette (PERS: PAGINA PER LA STAMPA DELLE ETICHETTE PER ARTICOLO)
        #1.2600 pgSM (STOCCAGGIO MERCE)
        #1.2700 pgRLRig_T (GP: PAGINA DELLE LETTURE DEGLI ARTICOLI IN BASE AL GIRO DI MG)
        #1.2800 pgINSSCC (INVENTARIO PER MATRICOLA)
        #1.2900 pgTRSSCC (TRASFERIMENTO INTERNO PER MATRICOLA)
        #1.3000 pgINTMG_MAT (INTERROGAZIONE MAGAZZINO PER MATRICOLA)
        #1.3100 pgINTMG_AR (INTERROGAZIONE MAGAZZINO PER ARTICOLO)
        #1.3110 pgINTMG_UbiMat (INTERROGAZIONE MAGAZZINO PER UBICAZIONE-MATRICOLE)
        #1.3200 pgTRMP_P (TRASFERIMENTO MP IN PRODUZIONE: ELENCO DEI PADRI DA PRODURRE)
        #1.3300 pgTRMP_C_AR (TRASFERIMENTO MP IN PRODUZIONE: ELENCO DELLE MP DA TRASFERIRE)
        #1.3400 pgTRRM (TRASFERIMENTO PER RIENTRO MP DA PRODUZIONE)
        #1.3500 pgGENCARICHI (GENERAZIONE CARICHI DI PRODUZIONE PER LE MATRICOLE DEI P PRODOTTI SULLE LINEE DI PROD)
        #1.3600 pgINM2Aperti (INVENTARIO CONDIVISO: ELENCO INVENTARI APERTI)
        #1.3700 pgINM2 (INVENTARIO CONDIVISO: TESTA)
        #1.3800 pgINM2Rig (INVENTARIO CONDIVISO: LETTURE)
        #1.3900 pgINM2Piede (INVENTARIO CONDIVISO: PIEDE)
        #1.4000 pgCFARLIST (Listini CF/AR)
        #1.4500 pgPRTRAttivita Produzione Avanzata - pagina select delle attività a cui trasferire le bolle
        #1.4600 pgPRTRMateriale Produzione Avanzata - pagina trasferimento materiale
        #1.4700 pgCHS00012
        #1.5000 pgRS 

    # RICERCHE Logistica DA 3 A 3.99
        #3.00 SearchCdDes
        #3.01 SearchAR
        #3.02 SearchARLotto
        #3.03 SearchCF
        #3.04 SearchCFDest
        #3.05 SearchMG
        #3.06 SearchMGUbicazione
        #3.07 SearchDOSottoCommessa
        #3.08 SearchxMOCodSpe 
        #3.09 SearchARARMisura
        #3.10 SearchCd_DoVettore
        #3.11 SearchDOSdTAnag
        #3.12 SearchExtFld
    
    # DETAIL Logistica DA 4 A 4.99
        #4.00 DetailCF
        #4.01 DetailCFDest
        #4.02 DetailGiacenza
        #4.03 DetailBarcode 
        #4.04 DetailDO
        #4.05 Detail_Letture
        #4.06 Detail_PackingList
        #4.07 Detail_MultiBarcode
        #4.08 Detail_NotePiede
        #4.09 Detail_Prelievi
        #4.10 Detail_INM2_Operatori
        #4.11 DetailGiacenzaUbicazione

    # POPUP DA 5 A 5.99
        #5.00 PopupMsg
        #5.01 Popup_DocAperti_Del (CONFERMA ELIMINAZIONE DOCUMENTO APERTO)
        #5.02 Popup_Del_Lettura (CONFERMA ELIMINAZIONE LETTURA)
        #5.03 Popup_Delete_Last_Read (CONFERMA ELIMINAZIONE DELL'ULTIMA LETTURA)       
        #5.04 Popup_Button_OpConfirm (RICHIESTA CONFERMA DELL'OPERATORE PER I CONTROLLI DAL BOTTONE CONFERMA DELLA PG)
        #5.05 Popup_Sscc_OpConfirm (RICHIESTA CONFERMA DELL'OPERATORE PER I CONTROLLI)
        #5.06 Popup_PackList_New (AGGIUNGE UNA NUOVA UNITA' LOGICA ALLA PACKING LIST) 
        #5.07 Popup_PKListAR_DelShift (ELIMINA O SPOSTA UN ARTICOLO DELLA PACKING)
        #5.071 Popup_PKListUL_Shift (SPOSTA UN PK IN UNA PK_P)  
        #5.08 Popup_INAperti_Del (CONFERMA ELIMINAZIONE INVENTARIO APERTO) 
        #5.10 Popup_ListnerTesting (VERIFICA LA COMUNICAZIONE CON IL LISTENER)
        #5.11 Popup_MGRettifica (Popup per generare una rettifica di magazzino)
        #5.50 Popup_YNA
        #5.60 Popup_INAperti_M2_Del (CONFERMA ELIMINAZIONE INVENTARIO APERTO CONDIVISO)
        #5.70 Popup_VaiAUbi
        #5.75 Popup_Issue_cp
        #5.76 Popup_Issue_ad
        #5.77 Popup_Issue_ca
        #5.80 Popup_BC_Select
        #5.90 Popup_PIN
--%>

<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Logistica.aspx.cs" Inherits="Logistica.Logistica" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <%--<link rel="icon" href="" type="image/ico" sizes="16x16" />--%>

    <link rel="manifest" href="manifest.json" />

    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="application-name" content="LWA" />
    <meta name="apple-mobile-web-app-title" content="LWA" />
    <meta name="theme-color" content="#5B89CB" />
    <meta name="msapplication-navbutton-color" content="#5B89CB" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="msapplication-starturl" content="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

    <link rel="icon" href="icon/favicon.ico" type="image/ico" sizes="16x16" />

    <title>Logistica</title>
    <!-- Stili statici -->
    <link href="style/w3.css" rel="stylesheet" />
    <link href="font-awesome/css/all.min.css" rel="stylesheet" />
    <!-- Script statici -->
    <script src="js/jquery-3.2.0.min.js"></script>
    <script src="js/injector.js"></script>
    <script src="js/legacy.js"></script>

    <!-- Cache Busting -->
    <script>
        // CSS
        var styles = ["style/Logistica.css", "icomoon/style.css"];
        styles.forEach(function (item) { injectStyle(item); });
        // Scripts
        var scripts = ["js/Global.js", "js/Barcode.js", "js/BarcodeHelper.js", "js/Logistica.js", "js/issue.js", "js/MediaQuery.js", "js/IN.js", "js/INM2.js", "js/RS.js", "js/Pers.js"];
        scripts.forEach(function (item) { injectScript(item); });
    </script>
</head>
<body class="w3-hide">
    <script>
        window.addEventListener("load", function () {
            Init();
            // Scripts pers
            switch (oApp.LicF_Id) {
                case 48275: //CASH
                case 23938:
                case 4361:
                    injectScript("pers/CHS00012.js");
                    break;
                case 76670: //GHELFI
                    injectScript("pers/P00009211.js");
                    break;
                case 33076: // MD
                    injectScript("pers/CHS00012.js");
                    injectScript("pers/P00009211.js");
                    break;
            }
            // Caricato
            $("body").removeClass("w3-hide");
        }, false);
    </script>

    <!-- Preloader -->
    <div class="preloader" id="preloader" style="display: none;">
        <div class="lds-dual-ring"></div>
    </div>

    <%-- #1.0000 HEADER (HEADER DELL'APPLICAZIONE) --%>
    <div id="header" class="lg-header">
        <div class="w3-row">
            <%--bottone per home page --%>
            <div class="c1 mo-display-inlineblock w3-left w3-col" style="width: 40px; padding-top: 5px;">
                <div class="btn btn-square nav-back mo-pointer lg-ml-5 w3-left" onclick="Nav.Back();">
                    <span class="icon-Back"></span>
                </div>
                <!-- <img class="nav-back lg-navbarback mo-pointer lg-ml-15 w3-left" src="icon/Back.svg" onclick="Nav.Back();" /> -->
            </div>
            <%--Spazio per le info di navigazione--%>
            <div class="info c2 mo-display-inlineblock w3-center w3-rest">
                <img class="lg-headerlogo mo-pointer lg-mt-5 lg-ml-5" style="margin-left: 10px;" src="loghi/ARCAEVOLUTION.svg" />
            </div>
            <%--frecce per spostamento tra le pagine--%>
            <div class="c3 mo-display-inlineblock w3-right w3-col header-buttons" style="padding-top: 5px;">
                <div class="btn btn-square nav-next mo-pointer lg-mr-10 w3-right" onclick="Nav.Next();">
                    <span class="icon-Avanti"></span>
                </div>
                <div class="btn btn-square nav-keybhide mo-pointer lg-mr-5 w3-right" onclick="Nav.Keybhide();">
                    <span class="icon-keyboard"></span>
                </div>
                <div class="btn btn-square nav-info mo-pointer lg-mr-5 w3-right" onclick="Nav.ToggleInfo();">
                    <span class="icon-Info"></span>
                </div>
                <div class="btn btn-square nav-pref mo-pointer lg-mr-5 w3-right" onclick="Nav.prefUserSet();">
                    <span class="icon-StarYellow"></span>
                </div>
            </div>
        </div>
    </div>

    <%-- #1.0100 pgHome (MENU PRINCIPALE) --%>
    <div id="pgHome" class="mo-page">
        <div id="userPref" class="user-pref">
            <ul>
                <li style="width: 10%;" onclick="Nav.prefUserReset()">
                    <span class="icon-StarYellow mo-pointer"></span>
                </li>
                <li class="template w3-hide">
                    <span class="lg-menuspan mo-pointer">Pref 1</span>
                </li>
            </ul>
        </div>
        <ul id="ulMenu" class="w3-ul mo-menu lg-container">
            <li id="menu-ca" class="menu menu-principale w3-padding-8">
                <img class="lg-menuico w3-left" src="icon/DocumentoCA.svg" />
                <span class="lg-menuspan">Ciclo Attivo</span>
                <img class="lg-menuavanti w3-right" src="icon/Avanti.svg" />
            </li>

            <li id="menu-cp" class="menu menu-principale w3-padding-8" style="vertical-align: middle;">
                <img class="lg-menuico w3-left" src="icon/DocumentoCP.svg" />
                <span class="lg-menuspan">Ciclo Passivo</span>
                <img class="lg-menuavanti w3-right" src="icon/Avanti.svg" />
            </li>

            <li id="menu-ad" class="menu menu-principale w3-padding-8">
                <img class="lg-menuico w3-left" src="icon/DocumentoAD.svg" />
                <span class="lg-menuspan">Altri Documenti</span>
                <img class="lg-menuavanti w3-right" src="icon/Avanti.svg" />
            </li>

            <li id="menu-da" class="menu menu-principale w3-padding-8">
                <img class="lg-menuico w3-left" src="icon/Documentiaperti.svg" />
                <span class="lg-menuspan">Documenti Aperti</span>
                <span class="lg-tag w3-tag w3-margin-left"></span>
                <img class="lg-menuavanti w3-right" src="icon/Avanti.svg" />
            </li>

            <li id="menu-us-template" class="menu menu-principale w3-padding-8" style="display: none;">
                <img class="lg-menuico w3-left" src="icon/Documento.svg" />
                <span class="lg-menuspan">USER PROGRAM</span>
                <img class="lg-menuavanti w3-right" src="icon/Avanti.svg" />
            </li>

            <li id="menu-pers-template" class="menu menu-principale w3-padding-8" style="display: none;">
                <img class="lg-menuico w3-left" src="icon/Documento.svg" />
                <span class="lg-menuspan">PERS</span>
                <img class="lg-menuavanti w3-right" src="icon/Avanti.svg" />
            </li>

            <li id="menu-sp" class="menu menu-principale w3-padding-8">
                <img class="lg-menuico w3-left" src="icon/Spedizione.svg" />
                <span class="lg-menuspan">Spedizioni</span>
                <img class="lg-menuavanti w3-right" src="icon/Avanti.svg" />
            </li>

            <li id="menu-pr" class="menu menu-principale w3-padding-8">
                <img class="lg-menuico w3-left" src="icon/Prelievo.svg" />
                <span class="lg-menuspan">Prelievo</span>
                <img class="lg-menuavanti w3-right" src="icon/Avanti.svg" />
            </li>

            <li id="menu-tr" class="menu menu-principale w3-padding-8">
                <img class="lg-menuico w3-left" src="icon/Trasferimenti.svg" />
                <span class="lg-menuspan">Trasferimenti</span>
                <img class="lg-menuavanti w3-right" src="icon/Avanti.svg" />
            </li>

            <li id="menu-sm" class="menu menu-principale w3-padding-8">
                <img class="lg-menuico w3-left" src="icon/Move.svg" />
                <span class="lg-menuspan">Stoccaggio Merce</span>
                <img class="lg-menuavanti w3-right" src="icon/Avanti.svg" />
            </li>

            <li id="menu-in" class="menu menu-principale w3-padding-8">
                <img class="lg-menuico w3-left" src="icon/DocumentoIN.svg" />
                <span class="lg-menuspan">Inventario</span>
                <img class="lg-menuavanti w3-right" src="icon/Avanti.svg" />
            </li>

            <li id="menu-prd" class="menu menu-principale w3-padding-8">
                <img class="lg-menuico w3-left" src="icon/DocumentoPRD.svg" />
                <span class="lg-menuspan">Produzione</span>
                <img class="lg-menuavanti w3-right" src="icon/Avanti.svg" />
            </li>

            <li id="menu-aa" class="menu menu-principale w3-padding-8">
                <img class="lg-menuico w3-left" src="icon/AcquAlias.svg" />
                <span class="lg-menuspan">Alias - Alternativi</span>
                <img class="lg-menuavanti w3-right" src="icon/Avanti.svg" />
            </li>

            <li id="menu-intmg" class="menu menu-principale w3-padding-8">
                <img class="lg-menuico w3-left" src="icon/DocumentoINTMG.svg" />
                <span class="lg-menuspan">Interrogazione Magazzino</span>
                <img class="lg-menuavanti w3-right" src="icon/Avanti.svg" />
            </li>

            <li id="menu-rs" class="menu menu-principale w3-padding-8">
                <img class="lg-menuico w3-left" src="icon/StampaYellow.svg" />
                <span class="lg-menuspan">Stampa Documento</span>
                <img class="lg-menuavanti w3-right" src="icon/Avanti.svg" />
            </li>

            <li id="menu-log" class="menu menu-principale w3-padding-8">
                <img class="lg-menuico w3-left" src="icon/Messaggi.svg" />
                <span class="lg-menuspan">Messaggi</span>
                <img class="lg-menuavanti w3-right" src="icon/Avanti.svg" />
            </li>

            <li id="menu-lo" class="menu menu-principale w3-padding-8">
                <img class="lg-menuico w3-left" src="icon/Esci.svg" />
                <span class="lg-menuspan">Esci</span>
                <img class="lg-menuavanti w3-right" src="icon/Avanti.svg" />
            </li>
            <li style="cursor: default; text-align: center; padding-top: 0px;">
                <label id="username" class="w3-xsmall" style="color: lightgray; width: 100%;"></label>
            </li>
        </ul>
    </div>

    <%-- #1.0200 pgSottoMenu (VOCI DEI SOTTO MENU) --%>
    <div id="pgSottoMenu" class="mo-page">
        <ul id="ulSottoMenu" class="lg-container w3-ul mo-menu">
            <%-- template menu dei documenti --%>
            <li id="SottomenuTemplate" class="menu w3-hover-light-gray w3-padding-8" style="display: none;">
                <img class="lg-menuico w3-left" src="" />
                <span class="doc-nome lg-tag w3-tag w3-hide"></span>
                <span class="doc-desc lg-menuspan"></span>
                <img class="lg-menuavanti w3-right" src="icon/Avanti.svg" />
            </li>
            <li id="Back" class="menu w3-hover-light-gray w3-padding-8" onclick="oApp.SottoMenuAttivo = null; GoHome();">
                <img class="lg-menuico w3-left" src="icon/Previous.svg" />
                <span class="lg-menuspan">Menu Principale</span>
            </li>
        </ul>
    </div>

    <%-- #1.0300 pgDocAperti (ELENCO DEI DOCUMENTI APERTI) --%>
    <div id="pgDocAperti" class="mo-page lg-gray">
        <div class="w3-row">
            <div class="lg-div-filtro mo-display-inlineblock" style="padding: 10px 6px;">
                <input filterkey="DocAperti_DO" type="text" class="filtro first-focus mo-search" placeholder="Cerca Documento..." />
            </div>
            <div class="lg-div-refresh mo-display-inlineblock">
                <img class="mo-pointer lg-mt-5" style="width: 23px;" src="icon/Aggiorna.svg" onclick="Ajax_xmofn_DOAperti();" />
            </div>
        </div>
        <ul class="w3-ul lg-docapul lg-gray">
            <li prgexe="" cd_do="" prgid="" class="template w3-bar mo-pointer w3-white" style="display: none;">
                <div class="w3-bar-item">
                    <span class="cd-do lg-tag w3-tag"></span>
                    <span class="">nr.</span>
                    <span class="id lg-fontblue"></span>
                    <span class="do-info"></span>
                    <br />
                    <span class="cf-info"></span>
                    <br />
                    <span class="do-rows-info lg-fontgray"></span>
                    <br />
                    <span class="listnererror"></span>
                </div>
                <img delete="false" class="lg-doapdel mo-pointer w3-bar-item w3-right lg-mb-10" onclick="$(this).attr('delete', 'true');" src="icon/EliminaGrigio.svg" />
            </li>
        </ul>
        <div class="w3-row">
            <span class="msg lg-lblstd"></span>
        </div>
    </div>

    <%-- #1.0400 pgDocRistampa (RISTAMPA DOC ESISTENTE) fnl --%>
    <div id="pgDocRistampa" class="mo-page lg-gray" style="padding-bottom: 5px;">
        <div class="w3-row">
            <div class="lg-div-filtro mo-display-inlineblock" style="padding: 10px 6px;">
                <input filterkey="DocRistampa_DO" type="text" class="filtro first-focus mo-search lg-input" placeholder="Cerca Documento..." />
            </div>
            <div class="lg-div-refresh mo-display-inlineblock">
                <img class="mo-pointer lg-mt-5" style="width: 23px;" src="icon/Aggiorna.svg" onclick="Ajax_xmofn_DORistampa();" />
            </div>
        </div>
        <ul class="w3-ul lg-docapul lg-gray">
            <li class="template w3-bar mo-pointer w3-white" style="display: none;">
                <div class="w3-bar-item">
                    <div class="w3-row">
                        <label class="dor-iddotes w3-tag lg-tag" style="font-size: 1.3em !important;"></label>
                        <label class="">del </label>
                        <label class="dor-datado"></label>
                    </div>
                    <div class="w3-row" style="font-size: 1em; font-weight: 600; font-family: Roboto-Regular;">
                        <label class="dor-cddo">DOC</label>
                        <label class="dor-descdo">Descrizione del documento</label>
                    </div>
                    <div class="w3-row" style="font-size: 0.9em; font-weight: 300; font-family: Roboto-Regular;">
                        <label class="dor-cfdo"></label>
                        <br />
                        <label class="dor-cfdest"></label>
                    </div>
                </div>
            </li>
        </ul>
        <span class="msg lg-lblstd"></span>
        <%-- Label che contengono le info per la pagina di stampa del li cliccato (sono nascoste) --%>
        <label name="Cd_DO" class="oprg w3-hide"></label>
        <label name="Id_DOTes" class="oprg w3-hide"></label>
        <label name="Id_xMORL_Edit" class="oprg w3-hide"></label>
    </div>

    <%-- #1.0500 pgAvviaConsumo (DICHIARAZIONE AVVIO CONSUMO MP SU LINEE PRODUZIONE) --%>
    <div id="pgAvviaConsumo" class="mo-page w3-container">
        <div class="mo-intestazione lg-mt-5">
            <label class="lb-doc-desc">Avvio consumo</label>
        </div>
        <%-- linea produzione --%>
        <div class="w3-row lg-mt-5">
            <select name='Cd_xMOLinea' class="first-focus lg-input" style="width: 100%;">
                <option value="null" selected="selected">Seleziona linea di produzione</option>
            </select>
        </div>
        <%-- articolo --%>
        <div class=" w3-row lg-mt-5">
            <label class="lg-lbl-da">ARTICOLO</label><br />
            <input name="Cd_AR" type="text" class="lg-input" style="width: 250px;" />
            <img searchkey="Cd_AR" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
            <label name="AR_Descrizione" class="lg-lbl-da descrizione info-ext" style="display: block;"></label>
        </div>
        <%-- lotto --%>
        <div class="w3-row lg-mt-5">
            <label class="lg-lbl-da">LOTTO</label>
            <br />
            <input name="Cd_ARLotto" type="text" class="lg-input" style="width: 130px;" />
            <img searchkey="Cd_ARLotto" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
        </div>
        <%-- data --%>
        <div class="w3-row lg-mt-5">
            <label class="lg-lbl-da">DATA</label><br />
            <input name='DataOra' type="date" class="lg-input" style="width: 200px" />
        </div>
        <div class="w3-container w3-center lg-mt-30">
            <button class="validate lg-btn-blue mo-pointer">Conferma</button>
        </div>
    </div>

    <%-- #1.0600 pgRL (TESTA DOC) fnl --%>
    <div id="pgRL" class="mo-page w3-container lg-mt-5">
        <div class="mo-intestazione lg-mt-5">
            <label class="lb-doc-name">DOC</label><label>&nbsp;-&nbsp;</label>
            <label class="lb-doc-desc">Descrizione del documento</label>
            <div class="w3-dropdown-click w3-right">
                <img onclick="$('.info-content').toggle();" class="mo-pointer" src="icon/InfoWhite.svg" style="width: 1.3em; height: 1.3em;" />
                <div class="info-content w3-dropdown-content w3-bar-block w3-border w3-padding" onclick="$(this).hide();">
                    <span class="prelievo lg-pl-4 lg-mr-6">
                        <input class="ck-prelievo w3-check" type="checkbox" disabled="disabled" />
                        <label class="etichetta lg-lblstd">Prelievo</label>
                    </span>
                    <br />
                    <span class="fuorilista lg-pl-4 lg-mr-6">
                        <input class="ck-fuorilista w3-check" type="checkbox" disabled="disabled" />
                        <label class="etichetta lg-lblstd">Fuori lista</label>
                    </span>
                    <br />
                    <span class="ubicazione lg-pl-4 lg-mr-6">
                        <input class="ck-ubicazione w3-check" type="checkbox" disabled="disabled" />
                        <label class="etichetta lg-lblstd">Gestione Ubicazione</label>
                    </span>
                    <br />
                    <span class="lotto lg-pl-4 lg-mr-6">
                        <input class="ck-lotto w3-check" type="checkbox" disabled="disabled" />
                        <label class="etichetta lg-lblstd">Gestione Lotto</label>
                    </span>
                </div>
            </div>
            <label class="lb-doc-id w3-right w3-margin-right"></label>
            <label>&nbsp;&nbsp;</label>
        </div>
        <div>
            <label class="title lg-lbl-da">CLIENTE/FORNITORE</label>
            <br />
            <input name="Cd_CF" type="text" class="first-focus lg-input" style="width: 100px;" />
            <label class="descrizione lg-lbldescrizione" name="CF_Descrizione"></label>
            <img searchkey="Cd_CF" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
            <img class="detail mo-pointer w3-margin-right w3-right" src="icon/Info.svg" style="width: 1.6em" />
        </div>
        <div class="div-dest">
            <label class="lg-lbl-da">SEDE OPERATIVA</label>
            <br />
            <input name="Cd_CFDest" type="text" class="lg-input" style="width: 120px;" />
            <label class="descrizione lg-lbldescrizione" name="CFDest_Descrizione"></label>
            <img searchkey="Cd_CFDest" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
        </div>
        <div>
            <label class="lg-lbl-da">DATA</label>
            <br />
            <input name="DataDoc" type="date" class="lg-input" style="width: 200px" />
        </div>
        <%-- Linea --%>
        <div class="div-linea">
            <div class="mo-intestazione">LINEE</div>
            <label class="lg-lbl-da">LINEA PRODUZIONE</label>
            <br />
            <select name="Cd_xMOLinea" class="lg-input" style="width: 60%">
                <option selected="selected"></option>
            </select>
        </div>
        <div class="div-com">
            <label class="lg-lbl-da">SOTTOCOMMESSA</label>
            <br />
            <input name="Cd_DOSottoCommessa" type="text" class="lg-input" style="width: 200px;" />
            <img searchkey="Cd_DOSottoCommessa" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
        </div>
        <div>
            <div class="mo-intestazione w3-margin-top">RIFERIMENTI</div>
            <label class="lg-lbl-da">NR. DOCUMENTO</label><br />
            <input name="NumeroDocRif" type="text" class="lg-input" style="width: 40%" />
            <br />
            <label class="lg-lbl-da">DATA</label><br />
            <input name="DataDocRif" type="date" class="lg-input" style="width: 200px" />
        </div>
        <div class="div-magazzini">
            <div class="mo-intestazione">MAGAZZINI</div>
            <%-- MG Partenza --%>
            <div class="div-mgp">
                <label class="lg-lbl-da">MAGAZZINO PARTENZA</label>
                <br />
                <input name="Cd_MG_P" type="text" class="lg-input input-noempty" style="width: 80px" title="Magazzino partenza" required="required" pattern="\S+.*" />
                <img searchkey="Cd_MG_P" searchtitle="Magazzino di Partenza" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
            </div>
            <%-- MG Arrivo --%>
            <div class="div-mga">
                <label class="lg-lbl-da">MAGAZZINO ARRIVO</label>
                <br />
                <input name="Cd_MG_A" type="text" class="lg-input input-noempty" style="width: 80px" title="Magazzino arrivo" required="required" pattern="\S+.*" />
                <img searchkey="Cd_MG_A" searchtitle="Magazzino di Arrivo" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
            </div>
        </div>
    </div>

    <%-- #1.0700 pgDOPrelievi (PRELIEVI DI UNA DOTes) fnl --%>
    <div id="pgDOPrelievi" class="mo-page w3-container">
        <div>
            <input filterkey="Prelievi_DO" type="text" class="first-focus filtro mo-search lg-input lg-mt-2" placeholder="Cerca Documento..." />
            <input filterkey="Prelievi_AR" type="text" class="filtro mo-search lg-input lg-mt-2" placeholder="Cerca Articolo..." />
        </div>
        <div class="mo-intestazione">
            <label>DOCUMENTI PRELEVABILI</label>
            <i class="toggle-disabled w3-right mi s30 white mo-pointer" onclick="$('#pgDOPrelievi table .non-prelevabile').toggle();">visibility</i>
        </div>
        <div style="overflow-y: auto;">
            <%-- Tabella dei documenti prelevabili --%>
            <table class="lg-table lg-mt-5 w3-table w3-striped">
                <tr style="margin: 3px 0px;">
                    <th style="width: 52px;">
                        <label class="container" style="margin-left: 10px;">
                            <input class="ck-documenti lg-ckricordapw" type="checkbox" />
                            <span class="checkmark"></span>
                        </label>
                    </th>
                    <th class="lg-lbl-da w3-center">DOC.</th>
                    <th class="lg-lbl-da w3-center"></th>
                    <th class="lg-lbl-da w3-center">NR.</th>
                    <th class="lg-lbl-da w3-center">DATA</th>
                    <th class="lg-lbl-da w3-center">ESE.</th>
                    <%--<th class="w3-small">SC.</th>--%>
                </tr>
                <tr class="template" style="display: none;">
                    <td style="width: 52px;">
                        <label class="container" style="margin-left: 10px;">
                            <input class="ck-documento lg-ckricordapw" type="checkbox" onclick="$(this).prop('checked', this.checked);" />
                            <span class="checkmark"></span>
                        </label>
                    </td>
                    <td class="w3-small w3-center Cd_DO mo-pointer lg-fontblue lg-underline"></td>
                    <td class="w3-small w3-center Descrizione"></td>
                    <td class="w3-small w3-right-align NumeroDoc"></td>
                    <td class="w3-small w3-center DataDoc"></td>
                    <td class="w3-small w3-center Cd_MGEsercizio"></td>
                </tr>
            </table>
        </div>
    </div>

    <%-- #1.0800 pgPrelievi (TUTTI I DOC PRELEVABILI)  fnl --%>
    <div id="pgPrelievi" class="mo-page w3-container">
        <div style="position: fixed; right: 5px; left: 5px; z-index: 100; background-color: white; padding: 0px 2px;">
            <div class="div-filtri div-accordion">
                <div class="header mo-intestazione">
                    <label>FILTRI</label>
                    <img class="icon lg-iupdown mo-pointer w3-right" src="icon/ArrowUp.svg" state="up" style="width: 17px;" />
                    <img class="mo-pointer lg-mr-6 w3-right" src="icon/Filter.svg" style="width: 15px; margin-top: 2px;" onclick="pgPrelievi_ClearFilter();" />
                </div>
                <div class="w3-row">
                    <input name="Id_DOTes" type="text" class="first-focus lg-input lg-mt-2" placeholder="ID Documento" />
                    <div class="content w3-container lg-mt-5 lg-mt-5">
                        <div class="mo-display-inlineblock w3-left" style="width: 49%;">
                            <label class="lg-lbl-da">TIPO DOCUMENTO</label><br />
                            <input name="Cd_DO" type="text" class="lg-input" style="width: 90px;" />
                            <br />
                            <label class="lg-lbl-da">CLIENTE/FORNITORE</label><br />
                            <input name="Cd_CF" type="text" class="lg-input" style="width: 100px;" />
                        </div>
                        <div class="mo-display-inlineblock w3-right" style="width: 49%;">
                            <label class="lg-lbl-da">SO</label><br />
                            <input name="Cd_CFDest" type="text" class="lg-input" style="width: 90px;" />
                            <br />
                            <label class="lg-lbl-da">DATA CONSEGNA</label><br />
                            <input name="DataConsegna" type="date" class="lg-input" style="width: 200px;" />
                        </div>
                    </div>
                    <div class="w3-center lg-mt-5">
                        <%--<label class="title lg-lbl-da">DOC</label><br />--%>
                        <select name="Cd_DO" class="lg-input mo-display-inlineblock w3-left" style="width: 40%"></select>
                        <button class="btn-filtri lg-btn-blue mo-display-inlineblock w3-right" style="width: 50%;" onclick="Ajax_xmofn_DOTes_Prel_4PR();">Cerca</button>
                    </div>
                </div>
            </div>
            <%--<div class="lg-mt-5">
                <label class="title lg-lbl-da">DOC</label><br />
                <select name="Cd_DO" class="lg-input" style="width: 30%"></select>
            </div>--%>
            <div class="mo-intestazione">
                <img class="i-dotescked icon mo-pointer" src="icon/UnCheckbox.svg" style="width: 19px;" onclick="PrelDOSel();" />
                <label class="DOSel lg-mr-6"></label>
                <label>DOCUMENTI PER IL PRELIEVO</label>
            </div>
        </div>
        <div class="pgmain" style="position: absolute; top: 130px; right: 5px; left: 5px;">
            <%-- UL dei documenti prelevabili --%>
            <ul class="w3-ul lg-docapul lg-gray">
                <li class="template w3-bar mo-pointer w3-white" style="display: none;">
                    <div class="mo-display-inlineblock w3-left lg-mt-5">
                        <label class="container" style="padding-left: 0px; margin-left: 3px;">
                            <input class="ck-documento" type="checkbox" onclick="Select_Cd_DO_Template($(this));" />
                            <span class="checkmark" style="margin-top: 4px;"></span>
                        </label>
                    </div>
                    <div class="w3-bar-item lg-prel-lifont mo-display-inlineblock" style="margin-left: 9px;">
                        <span class="id-dotes lg-tag w3-tag"></span>
                        <span class="cd-do lg-fontblue mo-pointer lg-underline lg-mr-6"></span>
                        <span class="do-desc"></span>
                        <br />
                        <span class="cd-cf"></span>
                        <br />
                        <span class="numerodoc"></span>
                        <span class="datadoc"></span>
                        <br />
                        <span class="dataconsegna"></span>
                    </div>
                </li>
            </ul>
            <span class="msg"></span>
        </div>
    </div>

    <%-- #1.0900 pgRLRig (RIGHE DOC) fnl --%>
    <div id="pgRLRig" class="mo-page w3-container">
        <div style="overflow-y: auto;">
            <%-- DOVE SEI --%>
            <div class="div-dove-sei div-accordion lg-mt-5">
                <div class="header mo-intestazione">
                    <label>Tu sei in&nbsp;&nbsp;</label>
                    <span class="dove-sono lg-tag w3-tag w3-yellow w3-margin-left" onclick="doveSono_Sel();"></span>
                    <span class="dove-vado lg-tag w3-tag w3-white w3-margin-left" onclick="doveVado_Show();"></span>
                    <img class="icon lg-iupdown mo-pointer w3-right" src="icon/ArrowUp.svg" state="up" />
                    <span class="span-dovesono-issue">
                        <i class="fas fa-power-off mo-pointer w3-right w3-margin-left w3-margin-right w3-large" onclick="issue.restart();"></i>
                        <i class="fas fa-caret-square-right mo-pointer w3-right w3-margin-left w3-large" style="color: #ffeb3b;" onclick="issue.start();"></i>
                    </span>
                </div>
                <div class="content">
                    <label class="lg-lbl-da">MAGAZZINO</label><br />
                    <input name="Cd_MG" type="text" class="input-label lg-input" style="width: 80px" />
                    <img searchkey="Cd_MG" searchtitle="Magazzino" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                    <br />
                    <div>
                        <label class="lg-lbl-da">UBICAZIONE</label><br />
                        <input name="Cd_MGUbicazione" type="text" class="lg-input" style="width: 180px" />
                        <img searchkey="Cd_MGUbicazione" searchtitle="Ubicazione" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                    </div>
                    <div class="w3-row w3-center w3-margin-bottom" style="margin-top: 10px;">
                        <button class="lg-btn-white" onclick="doveSono_Set();">Conferma</button>
                    </div>
                </div>
            </div>

            <%-- TABELLA LETTURE --%>
            <div class="div-letture div-accordion">
                <div class="header mo-intestazione">
                    <label>LETTURE:&nbsp;&nbsp;</label>
                    <label class="letture"></label>
                    <img class="icon lg-iupdown mo-pointer w3-right" src="icon/ArrowUp.svg" state="up" style="width: 17px;" />
                    <%--<img class="delete mo-pointer w3-margin-right w3-right" onclick="$('#Popup_Delete_Last_Read').show();" src="icon/EliminaBianco.svg" style="width: 17px;" />--%>
                    <i class="fas fa-trash delete mo-pointer w3-large w3-margin-right w3-right" onclick="$('#Popup_Delete_Last_Read').show();" title="Elimina l'ultima lettura"></i>
                    <%--<img class="mo-pointer w3-margin-right w3-right lg-mr-6 lg-mt-2" onclick="pgRLRig_Clear();" title="Reset dei campi" src="icon/AggiornaWhite.svg" style="width: 17px;" />--%>
                    <i class="fas fa-redo-alt mo-pointer w3-large w3-margin-right w3-right" onclick="pgRLRig_Clear();" title="Reset dei campi"></i>
                    <img class="detail-letture mo-pointer w3-margin-right w3-right" src="icon/MenuWhite.svg" style="width: 17px;" />
                    <i class="far fa-comment-alt mo-pointer w3-large w3-margin-right w3-right" onclick="Ajax_xmofn_xMORLPrelievo_NotePiede();"></i>
                    <%--<img class="detail-notepiede mo-pointer w3-margin-right w3-right" onclick="Ajax_xmofn_xMORLPrelievo_NotePiede();" src="icon/Memo.svg" style="width: 19px;" />--%>
                </div>
                <div class="mo-ofy-auto" style="max-height: 150px;">
                    <%-- label contenente le informazioni dell'ultima lettura effettuata --%>
                    <label class="lastread lg-lbl-da" style="display: none; font-size: 0.95em"></label>
                    <table class="content lg-table w3-table w3-striped lg-mt-5">
                        <tr>
                            <th class="lg-lbl-da">AR</th>
                            <th class="lg-lbl-da Descrizione cl-ardesc">Descrizione</th>
                            <%--<th class="w3-small Cd_ARLotto">LOTTO</th>--%>
                            <th class="lg-lbl-da w3-center">UM</th>
                            <th class="lg-lbl-da w3-center">QTA</th>
                            <th class="lg-lbl-da w3-center QtaEvadibile">EVAD.</th>
                        </tr>
                        <tr class="template" style="display: none;">
                            <td class="lg-font-07em Cd_AR"></td>
                            <td class="lg-font-07em Descrizione cl-ardesc"></td>
                            <%--<td class="w3-small Cd_ARLotto"></td>--%>
                            <td class="lg-font-07em w3-center Cd_ARMisura mo-pointer mo-btnum w3-btn"></td>
                            <td class="lg-font-07em w3-right-align Quantita"></td>
                            <td class="lg-font-07em w3-right-align QtaEvadibile"></td>
                        </tr>
                        <%-- template non nascosto perchè ci pensano le media query --%>
                        <tr class="template_ARDesc" style="display: none;">
                            <td class="lg-font-07em Descrizione" colspan="5"></td>
                        </tr>
                    </table>
                </div>
            </div>
            <%-- PACKING --%>
            <div class="div-packinglist div-accordion lg-mt-5">
                <div class="header mo-intestazione w3-amber">
                    <label>PACKING LIST</label>
                    <img class="icon lg-iupdown mo-pointer w3-right" src="icon/ArrowUp.svg" state="up" />
                </div>
                <div class="content w3-row lg-mt-5">
                    <select name="PackListRef" class="lg-input w3-margin-right" style="width: 110px; padding: 2px 3px 2px 1px;"></select>
                    <label class="lg-lbllink mo-pointer w3-margin-right" onclick="Popup_PackList_New_Load();" title="Nuova unità logistica">Crea Nuovo &gt;</label>
                    <label class="detail-pklist lg-lbllink mo-pointer w3-margin-right" title="Dettaglio della Packing List">Vedi lista completa &gt;</label>
                    <label class="detail-pklistref lg-lbllink mo-pointer w3-margin-right" title="Dettaglio pesi e misure del pacco">Pesi e Volumi &gt;</label><br />
                </div>
            </div>
        </div>
        <%-- BARCODE --%>
        <div class="div-barcode div-accordion lg-mt-5">
            <div class="header mo-intestazione">
                <label>BARCODE</label>
                <img class="icon lg-iupdown mo-pointer w3-right" src="icon/ArrowUp.svg" state="up" />
                <label class="container w3-right w3-margin-right">
                    <label class="lg-lblautoconfirm">Conf. automatica</label>
                    <input class="ck-autoconfirm" type="checkbox" onclick="SetFocus();" style="position: absolute;" />
                    <span class="checkmark"></span>
                </label>
            </div>
            <div class="content lg-mt-5">
                <div class="barcode">
                    <select class="lg-input lg-select lg-mb-5" style="width: 80px;" onchange="Barcode_SelType();"></select>
                    <input name="xMOBarcode" class="first-focus lg-input lg-mr-6" type="text" placeholder="Barcode..." style="width: 70%;" onfocus="$(this).off( 'blur' );" />
                    <label class="detail-bc lg-lbllink mo-pointer lg-mt-5 w3-right w3-margin-right">Vedi lista completa &gt;</label><br />
                </div>
            </div>
        </div>
        <%-- ARTICOLO --%>
        <div class="w3-row">
            <label class="lg-lbl-da">ARTICOLO</label><label class="ar-aa lg-lbl-da w3-small lg-ml-8"></label><br />
            <input name="Cd_AR" type="text" class="first-focus lg-input" style="width: 140px" tabindex="5" onchange="" />
            <img searchkey="Cd_AR" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
            <img class="detail-giacubi mo-pointer w3-right w3-margin-right" title="Giacenza dell'articolo" src="icon/Scatola.svg" style="width: 1.6em" />
            <label name="AR_Descrizione" class="lg-lbl-da descrizione info-ext" style="display: block;"></label>
            <div class="div-mgret">
                <label class="lg-lbl-da">Giac. Contabile:&nbsp;</label><label class="giaccontabile lg-lbl-da"></label>
                <label class="popup-mgret lg-lbllink mo-pointer lg-mt-5 w3-right w3-margin-right" onclick="Popup_MGRettifica_Load('pgRLRig');">Genera Rettifica &gt;</label>
            </div>
        </div>
        <%-- QTA E UM --%>
        <div class="div-qtaum">
            <label class="lg-lbl-da">QUANTITA</label><label class="ar-qta-info lg-lbl-da w3-small lg-ml-8"></label><br />
            <input name="Quantita" type="number" step="0.001" min="0" class="lg-input w3-right-align" style="width: 35%" tabindex="10" onfocus="Quantita_Onfocus($(this));" />
            <select name="Cd_ARMisura" class="lg-input" style="width: 60px;" tabindex="15">
            </select>
            <label name="InfoExt" class="lg-lbl-da-wki" style="display: inline-block;"></label>
        </div>
        <%-- COMMESSA --%>
        <div class="div-com">
            <label class="lg-lbl-da">SOTTOCOMMESSA</label><br />
            <input name="Cd_DOSottoCommessa" type="text" class="lg-input" style="width: 200px;" tabindex="20" />
            <img searchkey="Cd_DOSottoCommessa" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
        </div>
        <%-- MG PARTENZA (accordion) --%>
        <div class="div-mgp div-accordion lg-mt-5">
            <div class="header mo-intestazione">
                <label>MAGAZZINO PARTENZA&nbsp;</label>
                <img class="icon lg-iupdown mo-pointer w3-right" src="icon/ArrowUp.svg" state="up" />
                <label class="cd_mg_p w3-right w3-margin-right"></label>
            </div>
            <div class="content">
                <label class="lg-lbl-da">MAGAZZINO PARTENZA</label><br />
                <input name="Cd_MG_P" type="text" class="input-label lg-input" style="width: 80px" tabindex="25" />
                <img searchkey="Cd_MG_P" searchtitle="Magazzino di Partenza" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                <br />
                <div class="div-mgubip">
                    <label class="lg-lbl-da">UBICAZIONE MAGAZZINO</label><br />
                    <input name="Cd_MGUbicazione_P" type="text" class="lg-input" style="width: 180px" tabindex="30" />
                    <img searchkey="Cd_MGUbicazione_P" searchtitle="Ubicazione di Partenza" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                    <img class="macroubi-p-exe mo-pointer w3-margin-right w3-right w3-yellow" src="icon/Refresh.svg" style="width: 1.6em" onclick="xMOMacroUbi_P_Exe()" />
                </div>
            </div>
        </div>
        <%-- MG ARRIVO --%>
        <div class="div-mga div-accordion lg-mt-5">
            <div class="header mo-intestazione">
                <label>MAGAZZINO ARRIVO&nbsp;</label>
                <img class="icon lg-iupdown mo-pointer w3-right" src="icon/ArrowUp.svg" state="up" />
                <label class="cd_mg_a w3-right w3-margin-right"></label>
            </div>
            <div class="content">
                <label class="lg-lbl-da">MAGAZZINO ARRIVO</label><br />
                <input name="Cd_MG_A" type="text" class="input-label lg-input" style="width: 80px" tabindex="35" />
                <img searchkey="Cd_MG_A" searchtitle="Magazzino di Arrivo" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                <br />
                <div class="div-mgubia">
                    <label class="lg-lbl-da">UBICAZIONE MAGAZZINO</label><br />
                    <input name="Cd_MGUbicazione_A" type="text" class="lg-input" style="width: 180px" tabindex="40" />
                    <img searchkey="Cd_MGUbicazione_A" searchtitle="Ubicazione di Arrivo" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                    <img class="macroubi-a-exe mo-pointer w3-margin-right w3-right w3-yellow" src="icon/Refresh.svg" style="width: 1.6em" onclick="xMOMacroUbi_A_Exe()" />
                </div>
            </div>
        </div>
        <%-- LOTTO --%>
        <div class="div-lotto">
            <label class="lg-lbl-da">LOTTO</label><label class="lotto-scad lg-lbl-da">/SCAD.</label><br />
            <input name="Cd_ARLotto" type="text" class="lg-input" style="width: 130px" tabindex="45" />
            <label class="lotto-scad lg-lbl-da">/</label>
            <input name="DataScadenza" type="date" class="lotto-scad lg-input" style="width: 140px" tabindex="46" />
            <img searchkey="Cd_ARLotto" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
            <br />
        </div>
        <%-- MATRICOLA --%>
        <div class="div-matricola">
            <label class="lg-lbl-da">MATRICOLA</label><br />
            <input name="Matricola" type="text" class="lg-input" style="width: 60%" tabindex="50" />
        </div>
        <%-- EXTFLD--%>
        <div class="div-extfld">
            <div class="template_extfld" style="display: none;">
                <label class="lg-lbl-da"></label>
                <br />
                <input name="" type="" class="lg-input" style="width: 60%" tabindex="50" />
                <img searchkey="ExtFld" class="search-extfld mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em">
            </div>
        </div>
        <%-- BTN CONFERMA --%>
        <div class="w3-row w3-center lg-mt-15">
            <button class="btn-confirm lg-rlrigconfirm w3-margin-bottom" onclick="Confirm_Read();" tabindex="55">Conferma</button>
        </div>
        <%-- LABEL INFO --%>
        <div class="w3-row w3-center">
            <label id="rlrinfo" class="w3-xsmall" style="color: lightgray; width: 100%;"></label>
        </div>
    </div>

    <%--#1.0950 pgRLPK (PACK LIST) fnl --%>
    <div id="pgRLPK" class="mo-page w3-container">
        <div class="mo-intestazione">
            <label>PACK LIST:&nbsp;</label><label class="PackListRef"></label>
            <label class="NRow lbl w3-right"></label>
        </div>
        <label class="lg-lbl-h4">TIPOLOGIA UL:&nbsp;</label>
        <label class="Cd_xMOUniLog lg-lbl-h4"></label>
        <div class="mo-intestazione">
            <label>PESI:</label>
            <label class="w3-right">[Kg]</label>
        </div>
        <div class="mo-display-inlineblock" style="width: 32.33%;">
            <label class="lg-lbl-da">TARA:</label>
            <br />
            <input name="PesoTaraMks" type="number" class="lg-input w3-margin-right w3-right-align" style="width: 70px;" onchange="PKPesi_Calcola($(this));" />
        </div>
        <div class="mo-display-inlineblock" style="width: 32.33%;">
            <label class="lg-lbl-da">P.NETTO:</label><br />
            <input name="PesoNettoMks" type="number" class="lg-input w3-margin-right w3-right-align" style="width: 70px" onchange="PKPesi_Calcola($(this));" />
        </div>
        <div class="mo-display-inlineblock" style="width: 32.33%;">
            <label class="lg-lbl-da">P.LORDO:</label><br />
            <input name="PesoLordoMks" type="number" class="first-focus lg-input w3-margin-right w3-right-align" style="width: 70px" onchange="PKPesi_Calcola($(this));" />
        </div>
        <div class="mo-intestazione lg-mt-5">
            <label>DIMENSIONI:</label>
            <label class="w3-right" style="text-transform: lowercase !important;">[m]</label>
        </div>
        <%-- Altezza --%>
        <div class="mo-display-inlineblock" style="width: 32.33%;">
            <label class="lg-lbl-da">H:</label>
            <br />
            <input name="AltezzaMks" type="number" class="lg-input w3-margin-right w3-right-align" style="width: 70px" />
        </div>
        <%-- Larghezza --%>
        <div class="mo-display-inlineblock" style="width: 32.33%;">
            <label class="lg-lbl-da">L:</label>
            <br />
            <input name="LarghezzaMks" type="number" class="lg-input w3-margin-right w3-right-align" style="width: 70px" />
        </div>
        <%-- Profondità --%>
        <div class="mo-display-inlineblock" style="width: 32.33%;">
            <label class="lg-lbl-da">P:</label>
            <br />
            <input name="LunghezzaMks" type="number" class="lg-input w3-margin-right w3-right-align" style="width: 70px" />
        </div>
        <%-- BTN --%>
        <div class="div-arrow w3-row w3-center" style="margin-top: 35px;">
            <img class="btn-slideshow-under lg-arrow-border w3-margin-right mo-pointer" style="width: 2.8em; height: 2.8em;" onclick="Slideshow_PKRef(-1);" src="icon/BackBlue.svg" />
            <img class="btn-slideshow-plus lg-arrow-border w3-margin-left mo-pointer" style="width: 2.8em; height: 2.8em;" onclick="Slideshow_PKRef(1);" src="icon/AvantiBlue.svg" />
        </div>
        <div class="w3-center">
            <button class="btn-pkref-save lg-btn-blue mo-pointer w3-margin-top" onclick="PackListRef_Save();">CHIUDI</button>
        </div>
    </div>

    <%-- #1.0960 pgRLPrelievo (Prelievo del documento) --%>
    <div id="pgRLPrelievo" class="mo-page w3-container">
        <div class="mo-intestazione">
            <label class="Id_xMORL titolo">PRELIEVI</label>
            <label class="container w3-right w3-margin-right">
                <label>Sel/Des</label>
                <input class="ck-all" type="checkbox" onclick="pgRLPrelievo_CheckAll();" />
                <span class="checkmark"></span>
            </label>
        </div>
        <div class="lg-mt-5 w3-margin-top">
            <table class="articoli lg-table lg-mt-5 w3-table w3-striped"></table>
        </div>
    </div>

    <%--#1.0970 pgRLPK_R (prelievo da packing list)--%>
    <div id="pgRLPK_R" class="mo-page w3-container">
        <div class="mo-intestazione">
            <label class="titolo">PRELIEVO DA PACKING LIST</label>
            <label class="w3-right"></label>
        </div>
        <div class="lg-mt-5 w3-margin-top">
            <%-- PACKING LIST --%>
            <div class="w3-row w3-center">
                <label>PACKING LIST </label>
                <label class="pk-ul-da">0</label>
                <label>/</label>
                <label class="pk-ul-a">0</label>
                <br />
                <input name="PackListRef_R" type="text" class="first-focus lg-input" style="width: 140px" tabindex="5" onchange="" />


            </div>
            <div class="w3-row w3-center listPaking"></div>
            <div class="w3-row w3-center">
                <label name="listPackingList" class="rlp-iddo w3-xlarge"></label>
            </div>
        </div>
    </div>


    <%-- #1.1000 pgRLPiede (PIEDE DEL DOCUMENTO) fnl --%>
    <div id="pgRLPiede" class="mo-page w3-container">
        <div class="mo-intestazione">
            <label>SALVATAGGIO DEL DOCUMENTO</label>
        </div>
        <div class="lg-mt-5">
            <div class="lg-mt-15 lg-mb-10">
                <div class="w3-row">
                    <label class="rlp-iddo w3-tag lg-tag w3-xlarge"></label>
                    <label class="lg-rllbl">del </label>
                    <label class="rlp-datado lg-rllbl"></label>
                    <img class="w3-right mo-pointer" onclick="$('#pgRLPiede .ck-print').prop('checked', false); Nav.Next();" src="icon/Salva.svg" title="Salva in modo definitivo il documento" style="width: 1.8em; height: 1.8em;" />
                    <img class="w3-right mo-pointer w3-margin-right" onclick="$('#pgRLPiede .ck-print').prop('checked', true); Nav.Next();" src="icon/Stampa.svg" title="Vai alla pagina di stampa" style="width: 1.8em; height: 1.8em;" />
                </div>
                <div class="w3-row lg-rlp-lbldo">
                    <label class="rlp-cddo">DOC</label>
                    <label class="rlp-descdo">Descrizione del documento</label>
                </div>
                <div class="w3-row">
                    <label class="rlp-clido lg-rllbl"></label>
                </div>
            </div>
            <div class="div-riepilogo w3-row w3-centered">
                <div class="lg-card mo-display-inlineblock w3-center">
                    <span class="lg-lbl-da" title="Articoli di prelievo">TOTALI</span><br />
                    <span class="ar-prelievo lg-lblstd"></span>
                </div>
                <div class="lg-card mo-display-inlineblock w3-center">
                    <span class="lg-lbl-da" title="Articoli totali letti">PRELEVATI</span><br />
                    <span class="ar-totali lg-lblstd"></span>
                </div>
                <div class="div-noncongrui lg-card mo-display-inlineblock w3-center">
                    <span class="lg-lbl-da" title="Articoli non congrui (qta < evadibile)">INCONGRUENTI</span><br />
                    <span class="ar-noncongrui lg-lblstd"></span>
                </div>
                <div class="lg-card mo-display-inlineblock w3-center">
                    <span class="lg-lbl-da" title="Fuorilista inseriti nel prelievo">FUORI LISTA</span><br />
                    <span class="ar-fuorilista lg-lblstd"></span>
                </div>
            </div>
            <div id="divDatiTotali" class="div-accordion lg-mt-5" style="display: none">
                <div class="header mo-intestazione">
                    <label>TOTALI&nbsp;</label>
                    <img class="icon lg-iupdown mo-pointer w3-right" src="icon/ArrowUp.svg" state="up" />
                </div>
                <div class="content">
                    <%-- Pagamento --%>
                    <div>
                        <div class="w3-margin-top">
                            <label class="lg-lbl-da" style="display: inline-block; width: 90px">PAGAMENTO</label>
                            <label id="des_pagamento" class="lg-lbl-da" style="display: inline-block;"></label>
                        </div>
                    </div>
                    <%-- Total Doc --%>
                    <div>
                        <div>
                            <label class="lg-lbl-da" style="display: inline-block; width: 90px">TOTALE</label>
                            <label id="totImponibileV" class="lg-lbl-da" style="display: inline-block;"></label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="lg-mt-5">
                <div id="divDatiSpedizione" class="div-accordion lg-mt-5">
                    <div class="header mo-intestazione">
                        <label>SPEDIZIONE&nbsp;</label>
                        <img class="icon lg-iupdown mo-pointer w3-right" src="icon/ArrowUp.svg" state="up" />
                    </div>
                    <div class="content">
                        <%-- Targa e Caricatore --%>
                        <div>
                            <div class="w3-margin-top">
                                <label class="lg-lbl-da" style="display: inline-block; width: 62px">TARGA</label>
                                <input name="Targa" type="text" class="first-focus lg-input" style="width: 130px; text-transform: uppercase;" />
                            </div>
                        </div>
                        <%--Trasporto--%>
                        <div class="div-trasporto w3-margin-top">
                            <label class="mo-pointer lg-lbllink" onclick="TrasportoDataora_Now();">TRASPORTO</label><label name="Cd_DoTrasporto_Descrizione" class="lg-lbl-da w3-small lg-ml-8"></label><br />
                            <input name="Cd_DoTrasporto" type="text" class="lg-input" style="width: 50px" tabindex="2" />
                            <label class="lg-lbl-da">/</label>
                            <input name="TrasportoDataora" type="datetime-local" class="lotto-scad lg-input" style="width: 170px" tabindex="3" />
                            <img searchkey="Cd_DoTrasporto" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                            <br />
                        </div>
                        <%--Vettore 1--%>
                        <div class="div-vettore1 w3-margin-top">
                            <label class="lg-lbl-da">VETTORE 1</label><label name="Cd_DoVettore_1_Descrizione" class="lg-lbl-da w3-small lg-ml-8"></label><br />
                            <input name="Cd_DoVettore_1" type="text" class="lg-input" style="width: 50px" tabindex="4" />
                            <label class="lg-lbl-da">/</label>
                            <input name="Vettore1DataOra" type="datetime-local" class="lotto-scad lg-input" style="width: 170px" tabindex="5" />
                            <img searchkey="Cd_DoVettore_1" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                            <br />
                        </div>
                        <%--Vettore 2--%>
                        <div class="div-vettori">
                            <label class="lg-lbl-da">VETTORE 2</label><label name="Cd_DoVettore_2_Descrizione" class="lg-lbl-da w3-small lg-ml-8"></label><br />
                            <input name="Cd_DoVettore_2" type="text" class="lg-input" style="width: 50px" tabindex="6" />
                            <label class="lg-lbl-da">/</label>
                            <input name="Vettore2DataOra" type="datetime-local" class="lotto-scad lg-input" style="width: 170px" tabindex="7" />
                            <img searchkey="Cd_DoVettore_2" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                            <br />
                        </div>
                        <div class="w3-margin-top">
                            <label class="lg-lbl-da" style="display: inline-block; width: 150px">SPEDIZIONE</label>
                            <input name="Cd_DoSped" type="text" class="lg-input" style="width: 60px;" tabindex="8" />
                            <label class="descrizione lg-lbldescrizione" name="Cd_DoSped_Descrizione" style="width: 100px;"></label>
                            <img searchkey="Cd_DoSped" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                        </div>
                        <div class="w3-margin-top">
                            <label class="lg-lbl-da" style="display: inline-block; width: 150px">PORTO</label>
                            <input name="Cd_DoPorto" type="text" class="lg-input" style="width: 60px;" tabindex="9" />
                            <label class="descrizione lg-lbldescrizione" name="Cd_DoPorto_Descrizione" style="width: 100px;"></label>
                            <img searchkey="Cd_DoPorto" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                        </div>
                        <div class="w3-margin-top">
                            <label class="lg-lbl-da" style="display: inline-block; width: 150px">ASPETTO BENI</label>
                            <input name="Cd_DoAspBene" type="text" class="lg-input" style="width: 60px;" tabindex="10" />
                            <label class="descrizione lg-lbldescrizione" name="Cd_DoAspBene_Descrizione" style="width: 100px;"></label>
                            <img searchkey="Cd_DoAspBene" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                        </div>
                    </div>
                </div>
                <div id="divDatiSpedizioneExt" class="div-accordion lg-mt-5">
                    <div class="header mo-intestazione">
                        <label>SPEDIZIONE - SCHEDA DI TRASPORTO&nbsp;</label>
                        <img class="icon lg-iupdown mo-pointer w3-right" src="icon/ArrowUp.svg" state="up" />
                    </div>
                    <div class="content">
                        <div>
                            <div class="w3-margin-top">
                                <label class="lg-lbl-da" style="display: inline-block; width: 150px">CARICATORE</label>
                                <input name="Cd_DOCaricatore" type="text" class="lg-input" style="width: 60px;" tabindex="12" />
                                <label class="descrizione lg-lbldescrizione" name="Cd_DOCaricatore_Descrizione" style="width: 100px;"></label>
                                <img searchkey="Cd_DOCaricatore" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                            </div>
                            <div class="w3-margin-top">
                                <label class="lg-lbl-da" style="display: inline-block; width: 150px">COMMITTENTE</label>
                                <input name="Cd_DoCommittente" type="text" class="lg-input" style="width: 60px;" tabindex="13" />
                                <label class="descrizione lg-lbldescrizione" name="Cd_DoCommittente_Descrizione" style="width: 100px;"></label>
                                <img searchkey="Cd_DoCommittente" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                            </div>
                            <div class="w3-margin-top">
                                <label class="lg-lbl-da" style="display: inline-block; width: 150px">LUOGO CARICO</label>
                                <input name="Cd_DoLuogoCarico" type="text" class="lg-input" style="width: 60px;" tabindex="14" />
                                <label class="descrizione lg-lbldescrizione" name="Cd_DoLuogoCarico_Descrizione" style="width: 100px;"></label>
                                <img searchkey="Cd_DoLuogoCarico" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                            </div>
                            <div class="w3-margin-top">
                                <label class="lg-lbl-da" style="display: inline-block; width: 150px">LUOGO SCARICO</label>
                                <input name="Cd_DoLuogoScarico" type="text" class="lg-input" style="width: 60px;" tabindex="15" />
                                <label class="descrizione lg-lbldescrizione" name="Cd_DoLuogoScarico_Descrizione" style="width: 100px;"></label>
                                <img searchkey="Cd_DoLuogoScarico" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                            </div>
                            <div class="w3-margin-top">
                                <label class="lg-lbl-da" style="display: inline-block; width: 150px">PROPRIET. MERCE</label>
                                <input name="Cd_DoProprietarioMerce" type="text" class="lg-input" style="width: 60px;" tabindex="16" />
                                <label class="descrizione lg-lbldescrizione" name="Cd_DoProprietarioMerce_Descrizione" style="width: 100px;"></label>
                                <img searchkey="Cd_DoProprietarioMerce" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                            </div>
                        </div>
                    </div>
                </div>
                <%-- Colli Pesi in Kg e Volume m3 standard --%>
                <div id="divCPV" class="div-cpvstd div-accordion lg-mt-5">
                    <div class="header mo-intestazione">
                        <label>COLLI/PESI/VOLUME&nbsp;</label>
                        <img class="icon lg-iupdown mo-pointer w3-right" src="icon/ArrowUp.svg" state="up" />
                    </div>
                    <div class="content">
                        <div class="w3-right-align" style="display: block; margin-top: 3px;">
                            <label class="lg-lbl-da">Peso Lordo [KG]:</label>
                            <input name="PesoLordo" type="text" class="first-focus lg-input w3-right-align" style="width: 110px;" tabindex="20" />
                            <img class="mo-pointer" src="icon/Scatola.svg" style="width: 1.6em" onclick="Ajax_xmofn_xMORLPiede_PesoVolume('L')" />
                        </div>
                        <div class="w3-right-align" style="display: block; margin-top: 3px;">
                            <label class="lg-lbl-da">Peso Netto [KG]:</label>
                            <input name="PesoNetto" type="text" class="lg-input w3-right-align" style="width: 110px;" tabindex="21" />
                            <img class="mo-pointer" src="icon/Scatola.svg" style="width: 1.6em" onclick="Ajax_xmofn_xMORLPiede_PesoVolume('N')" />
                        </div>
                        <div class="w3-right-align" style="display: block; margin-top: 3px;">
                            <label class="lg-lbl-da">Volume [m3]:</label>
                            <input name="VolumeTotale" type="text" class="lg-input w3-right-align" style="width: 110px;" tabindex="22" />
                            <img class="mo-pointer" src="icon/Scatola.svg" style="width: 1.6em" onclick="Ajax_xmofn_xMORLPiede_PesoVolume('V')" />
                        </div>
                        <div class="w3-right-align" style="display: block; padding-right: 1.95em; margin-top: 3px;">
                            <label class="lg-lbl-da">Colli:</label>
                            <input name="Colli" type="text" class="lg-input w3-right-align" style="width: 110px;" tabindex="23" />
                        </div>
                    </div>
                </div>
                <%-- Peso e Volume di UL aggiuntive alla PK --%>
                <div class="div-pkpv">
                    <label class="lg-lbl-da">UL AGGIUNTIVI: PESO/VOLUME</label><br />
                    <input name="PesoExtraMks" type="text" class="first-focus lg-input" placeholder="Peso" style="width: 80px;" tabindex="24" />
                    <input name="VolumeExtraMks" type="text" class="lg-input w3-margin-right" placeholder="Volume" style="width: 80px;" tabindex="25" />
                </div>
                <div class="div-notepiede">
                    <label class="lg-lbl-da">NOTE</label><br />
                    <textarea name="NotePiede" rows="4" class="lg-input" tabindex="26"></textarea>
                </div>
                <div class="div-listener lg-mb-10">
                    <label class="lg-lbl-da">LISTENER</label><br />
                    <select name="Listener" class="lg-input" onchange="Listener_Sel_Idx(this, false);" tabindex="30">
                    </select>
                </div>
                <%-- Shortcut Avvio Consumo --%>
                <div class="div-avvioconsumo lg-mt-5">
                    <%--<button class="lg-rlpavvioconsumo" title="Effettua Avvio Consumo per tutti gli Articoli" onclick="Ajax_xmosp_xMOConsumoFromRL_Save();">Avvio Consumo</button>--%>
                    <label class="container w3-right w3-margin-right">
                        <label class="lg-lblavvioconsumo">Avvio Consumo</label>
                        <input class="ck-avvioconsumo" type="checkbox" style="position: absolute;" tabindex="31" />
                        <span class="checkmark"></span>
                    </label>
                </div>
                <input type="checkbox" class="ck-print" style="display: none;" checked="checked" />
            </div>
        </div>
    </div>

    <%-- #1.1100 pgStampaDocumento (ELENCO DOCUMETI GENERARI IN ARCA DI CUI SI PUO' LANCIARE LA STAMPA) --%>
    <div id="pgStampaDocumento" class="mo-page lg-gray">
        <div style="padding: 10px 6px;">
            <label class="lg-lbl-da">LISTENER</label><br />
            <select name="Listener" class="first-focus lg-input" onchange="Listener_Sel_Idx(this, true);">
            </select>
        </div>
        <ul class="lg-docapul w3-ul lg-gray">
            <li class="template mo-pointer lg-stdoli w3-white" style="display: none;">
                <div class="w3-row w3-padding">
                    <div class="w3-half">
                        <div class="w3-col lg-stdo-divck">
                            <label class="container">
                                <input class="ck-stampa lg-ckricordapw" type="checkbox" />
                                <span class="checkmark"></span>
                            </label>
                        </div>
                        <div class="w3-col lg-stdo-divicon">
                            <img src="icon/DocumentoStampa.svg" style="width: 2.4em;" />
                        </div>
                        <div class="w3-rest">
                            <label class="lg-lbl-da">TIPO DOCUMENTO</label><br />
                            <label class="descrizione"></label>
                        </div>
                    </div>
                    <div class="w3-quarter">
                        <label class="lg-lbl-da">STAMPA SU</label><br />
                        <select name="ListenerDevice" class="lg-input">
                        </select>
                    </div>
                    <div class="w3-quarter lg-stdo-divnrcopie">
                        <label class="lg-lbl-da">NR COPIE</label><br />
                        <input name="NumeroCopie" class="lg-input" style="width: 60px !important;" />
                    </div>
                </div>
            </li>
        </ul>
        <div class="lg-mt-30 w3-center">
            <button class="lg-stdostampa" onclick="Nav.Next();">STAMPA</button>
        </div>
    </div>

    <%-- #1.1200 pgTR (TRASFERIMENTI INTERNI: TESTA) --%>
    <div id="pgTR" class="mo-page w3-container">
        <div class="mo-intestazione">
            <label>TRASFERIMENTI INTERNI</label>
            <div class="w3-dropdown-click w3-right">
                <img onclick="$('.info-content').toggle();" class="mo-pointer" src="icon/InfoWhite.svg" style="width: 1.3em; height: 1.3em;" />
                <div class="info-content w3-dropdown-content w3-bar-block w3-border w3-padding" onclick="$(this).hide();">
                    <span class="ubicazione lg-pl-4 lg-mr-6">
                        <input class="ck-ubicazione w3-check" type="checkbox" disabled="disabled" />
                        <label class="etichetta lg-lblstd">Gestione Ubicazione</label>
                    </span>
                    <br />
                    <span class="lotto lg-pl-4 lg-mr-6">
                        <input class="ck-lotto w3-check" type="checkbox" disabled="disabled" />
                        <label class="etichetta lg-lblstd">Gestione Lotto</label>
                    </span>
                    <br />
                    <span class="sottocommessa lg-pl-4 lg-mr-6">
                        <input class="ck-sottocommessa w3-check" type="checkbox" disabled="disabled" />
                        <label class="etichetta lg-lblstd">Gestione Sottocommessa</label>
                    </span>
                </div>
            </div>
            <label class="lb-doc-id w3-right w3-margin-right"></label>
            <label>&nbsp;&nbsp;</label>
        </div>
        <div>
            <label class="title lg-lbl-da">DESCRIZIONE</label>
            <br />
            <input name="Descrizione" type="text" class="lg-input" style="width: 70%;" />
        </div>
        <div>
            <label class="lg-lbl-da">DATA</label>
            <br />
            <input name="DataMov" type="date" class="first-focus lg-input" style="width: 200px" />
        </div>
        <%-- COMMESSA --%>
        <div class="div-com">
            <label class="lg-lbl-da">SOTTOCOMMESSA</label><br />
            <input name="Cd_DOSottoCommessa" type="text" class="lg-input" style="width: 200px;" />
            <img searchkey="Cd_DOSottoCommessa" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
        </div>
        <div class="div-mgp div-accordion lg-mt-5">
            <div class="header mo-intestazione">
                <label>MAGAZZINO PARTENZA&nbsp;</label>
                <img class="icon lg-iupdown mo-pointer w3-right" src="icon/ArrowUp.svg" state="up" />
                <label class="cd_mg_p w3-right w3-margin-right"></label>
            </div>
            <div class="content">
                <label class="lg-lbl-da">MAGAZZINO PARTENZA</label><br />
                <input name="Cd_MG_P" type="text" class="input-label lg-input" style="width: 80px" />
                <img searchkey="Cd_MG_P" searchtitle="Magazzino di Partenza" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                <div class="div-mgubip">
                    <label class="lg-lbl-da">UBICAZIONE MAGAZZINO</label><br />
                    <input name="Cd_MGUbicazione_P" type="text" class="lg-input" style="width: 180px" />
                    <img searchkey="Cd_MGUbicazione_P" searchtitle="Ubicazione di Partenza" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                </div>
            </div>
        </div>
        <%-- MG ARRIVO --%>
        <div class="div-mga div-accordion lg-mt-5">
            <div class="header mo-intestazione">
                <label>MAGAZZINO ARRIVO&nbsp;</label>
                <img class="icon lg-iupdown mo-pointer w3-right" src="icon/ArrowUp.svg" state="up" />
                <label class="cd_mg_a w3-right w3-margin-right"></label>
            </div>
            <div class="content">
                <label class="lg-lbl-da">MAGAZZINO ARRIVO</label><br />
                <input name="Cd_MG_A" type="text" class="input-label lg-input" style="width: 80px" />
                <img searchkey="Cd_MG_A" searchtitle="Magazzino di Arrivo" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                <div class="div-mgubia">
                    <label class="lg-lbl-da">UBICAZIONE MAGAZZINO</label><br />
                    <input name="Cd_MGUbicazione_A" type="text" class="lg-input" style="width: 180px" />
                    <img searchkey="Cd_MGUbicazione_A" searchtitle="Ubicazione di Arrivo" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                </div>
            </div>
        </div>
    </div>

    <%-- #1.1300 pgTRRig_P (TRASFERIMENTI INTERNI: LETTURE DI PARTENZA) --%>
    <div id="pgTRRig_P" class="mo-page w3-container">
        <%-- TABELLA LETTURE --%>
        <div class="div-letture div-accordion">
            <div class="header mo-intestazione">
                <label>LETTURE:</label>
                <label class="letture"></label>
                <label>&nbsp;PARTENZA</label>
                <img class="icon lg-iupdown mo-pointer w3-right" src="icon/ArrowUp.svg" state="up" style="width: 17px;" />
                <img class="delete mo-pointer w3-margin-right w3-right" onclick="$('#Popup_Delete_Last_Read').show();" src="icon/EliminaBianco.svg" style="width: 17px;" />
                <img class="detail-letture mo-pointer w3-margin-right w3-right" src="icon/MenuWhite.svg" style="width: 17px;" />
            </div>
            <div class="content" style="max-height: 250px; overflow-y: auto;">
                <table class="lg-table w3-table w3-striped lg-mt-5">
                    <tr>
                        <th class="lg-lbl-da w3-center">AR</th>
                        <th class="lg-lbl-da w3-center Cd_ARLotto">LOTTO</th>
                        <th class="lg-lbl-da w3-center">UM</th>
                        <th class="lg-lbl-da w3-center">QTA</th>
                        <th class="lg-lbl-da w3-center">MG</th>
                    </tr>
                    <tr class="template" style="display: none;">
                        <td class="lg-font-07em w3-center Cd_AR"></td>
                        <td class="lg-font-07em w3-center Cd_ARLotto"></td>
                        <td class="lg-font-07em w3-center Cd_ARMisura mo-pointer mo-btnum w3-center"></td>
                        <td class="lg-font-07em w3-right-align Quantita"></td>
                        <td class="lg-font-07em w3-right-align Cd_MG_P"></td>
                    </tr>
                </table>
            </div>
        </div>
        <%-- BARCODE --%>
        <div class="div-barcode div-accordion lg-mt-5">
            <div class="header mo-intestazione lg-mt-5">
                <label>BARCODE</label>
                <img class="icon lg-iupdown mo-pointer w3-right" src="icon/ArrowUp.svg" state="up" />
                <img class="mo-pointer w3-right lg-mr-6" onclick="pgTRRig_PA_Clear();" title="Reset dei campi" src="icon/AggiornaWhite.svg" style="width: 17px;" />
            </div>
            <div class="content lg-mt-5">
                <div class="barcode">
                    <select class="lg-input lg-select lg-mb-5" style="width: 80px;" onchange="Barcode_SelType();"></select>
                    <input name="xMOBarcode" class="first-focus lg-input lg-mr-6" type="text" placeholder="Barcode..." style="width: 70%;" onfocus="$(this).off( 'blur' );" tabindex="0" />
                </div>
            </div>
        </div>
        <%-- ARTICOLO --%>
        <div class="w3-row">
            <label class="lg-lbl-da">ARTICOLO</label><label class="ar-aa lg-lbl-da w3-small lg-ml-8"></label><br />
            <input name="Cd_AR" type="text" class="first-focus lg-input" style="width: 60%" tabindex="1" />
            <img searchkey="Cd_AR" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
            <img class="detail-giacubi mo-pointer w3-right w3-margin-right" title="Giacenza dell'articolo" src="icon/Scatola.svg" style="width: 1.6em" />
            <label name="AR_Descrizione" class="lg-lbl-da descrizione info-ext" style="display: block;"></label>
        </div>
        <%-- QTA E UM --%>
        <div class="div-qtaum">
            <label class="lg-lbl-da">QUANTITA</label><br />
            <input name="Quantita" type="number" class="lg-input w3-right-align" style="width: 35%" onfocus="Quantita_Onfocus();" tabindex="2" />
            <select name="Cd_ARMisura" class="lg-input" style="width: 60px;" tabindex="3">
            </select>
        </div>
        <%-- MG PARTENZA (accordion) --%>
        <div class="div-mgp div-accordion lg-mt-5">
            <div class="header mo-intestazione">
                <label>MAGAZZINO PARTENZA&nbsp;</label>
                <img class="icon lg-iupdown mo-pointer w3-right" src="icon/ArrowUp.svg" state="up" />
                <label class="cd_mg_p w3-right w3-margin-right"></label>
            </div>
            <div class="content">
                <label class="lg-lbl-da">MAGAZZINO PARTENZA</label><br />
                <input name="Cd_MG_P" type="text" class="input-label lg-input" style="width: 80px" tabindex="4" />
                <img searchkey="Cd_MG_P" searchtitle="Magazzino di Partenza" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                <br />
                <div class="div-mgubip">
                    <label class="lg-lbl-da">UBICAZIONE MAGAZZINO</label><br />
                    <input name="Cd_MGUbicazione_P" type="text" class="lg-input" style="width: 180px" tabindex="5" />
                    <img searchkey="Cd_MGUbicazione_P" searchtitle="Ubicazione di Partenza" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                    <i class="detail-giacar-p fas fa-boxes mo-pointer w3-right w3-margin-right w3-xlarge"></i>
                </div>
            </div>
        </div>
        <%-- LOTTO --%>
        <div class="div-lotto">
            <label class="lg-lbl-da">LOTTO</label><br />
            <input name="Cd_ARLotto" type="text" class="lg-input" style="width: 130px" tabindex="6" />
            <img searchkey="Cd_ARLotto" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
        </div>
        <%-- BTN CONFERMA --%>
        <div class="w3-row w3-center w3-margin-bottom w3-margin-top">
            <button class="btn-confirm lg-trpconfirm" onclick="Confirm_Read();" tabindex="7">CONFERMA</button>
        </div>
    </div>

    <%-- #1.1400 pgTRRig_A (TRASFERIMENTI INTERNI: LETTURE DI ARRIVO) --%>
    <div id="pgTRRig_A" class="mo-page w3-container">
        <%-- TABELLA LETTURE --%>
        <div class="div-letture div-accordion">
            <div class="header mo-intestazione">
                <label>LETTURE:</label>
                <label class="letture"></label>
                <label>&nbsp;ARRIVO</label>
                <img class="icon lg-iupdown mo-pointer w3-right" src="icon/ArrowUp.svg" state="up" style="width: 17px;" />
                <img class="delete mo-pointer w3-margin-right w3-right" onclick="$('#Popup_Delete_Last_Read').show();" src="icon/EliminaBianco.svg" style="width: 17px;" />
                <img class="detail-letture mo-pointer w3-margin-right w3-right" src="icon/MenuWhite.svg" style="width: 17px;" />
            </div>
            <div class="content" style="max-height: 250px; overflow-y: auto;">
                <table class="lg-table w3-table w3-striped lg-mt-5">
                    <tr>
                        <th class="lg-lbl-da w3-center">AR</th>
                        <th class="lg-lbl-da w3-center Cd_ARLotto">LOTTO</th>
                        <th class="lg-lbl-da w3-center">UM</th>
                        <th class="lg-lbl-da w3-center">QTA</th>
                        <th class="lg-lbl-da w3-center">RES</th>
                    </tr>
                    <tr class="template" style="display: none;">
                        <td class="lg-font-07em w3-center Cd_AR"></td>
                        <td class="lg-font-07em w3-center Cd_ARLotto"></td>
                        <td class="lg-font-07em w3-center Cd_ARMisura mo-pointer mo-btnum w3-center"></td>
                        <td class="lg-font-07em w3-right-align Quantita"></td>
                        <td class="lg-font-07em w3-right-align Residua mo-pointer mo-btnum w3-center"></td>
                    </tr>
                </table>
            </div>
        </div>
        <%-- BARCODE --%>
        <div class="div-barcode div-accordion lg-mt-5">
            <div class="header mo-intestazione">
                <label>BARCODE</label>
                <img class="icon lg-iupdown mo-pointer w3-right" src="icon/ArrowUp.svg" state="up" />
                <img class="mo-pointer w3-margin-right w3-right lg-mr-6 lg-mt-2" onclick="pgTRRig_A_Clear();" title="Reset dei campi" src="icon/AggiornaWhite.svg" style="width: 17px;" />
            </div>
            <div class="content lg-mt-5">
                <div class="barcode">
                    <select class="lg-input lg-select lg-mb-5" style="width: 80px;" onchange="Barcode_SelType();"></select>
                    <input name="xMOBarcode" class="first-focus lg-input lg-mr-6" type="text" placeholder="Barcode..." style="width: 70%;" onfocus="$(this).off( 'blur' );" tabindex="15" />
                </div>
            </div>
        </div>
        <%-- ARTICOLO --%>
        <div class="w3-row">
            <label class="lg-lbl-da">ARTICOLO</label><br />
            <input name="Cd_AR" type="text" class="first-focus lg-input" style="width: 60%" disabled="disabled" />
            <img class="detail-giacubi mo-pointer w3-right w3-margin-right" title="Giacenza dell'articolo" src="icon/Scatola.svg" style="width: 1.6em" />
        </div>
        <%-- QTA E UM --%>
        <div class="div-qtaum">
            <label class="lg-lbl-da">QUANTITA</label><br />
            <input name="Quantita" type="number" class="lg-input w3-right-align" style="width: 35%" onfocus="Quantita_Onfocus();" tabindex="1" />
            <select name="Cd_ARMisura" class="lg-input" style="width: 60px;" tabindex="2">
            </select>
        </div>

        <%-- MG ARRIVO (accordion) --%>
        <div class="div-mga div-accordion lg-mt-5">
            <div class="header mo-intestazione">
                <label>MAGAZZINO ARRIVO&nbsp;</label>
                <img class="icon lg-iupdown mo-pointer w3-right" src="icon/ArrowUp.svg" state="up" />
                <label class="cd_mg_a w3-right w3-margin-right"></label>
            </div>
            <div class="content">
                <label class="lg-lbl-da">MAGAZZINO ARRIVO</label><br />
                <input name="Cd_MG_A" type="text" class="input-label lg-input" style="width: 80px" tabindex="3" />
                <img searchkey="Cd_MG_A" searchtitle="Magazzino di Arrivo" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                <br />
                <div class="div-mgubia">
                    <label class="lg-lbl-da">UBICAZIONE MAGAZZINO</label><br />
                    <input name="Cd_MGUbicazione_A" type="text" class="lg-input" style="width: 180px" tabindex="4" />
                    <img searchkey="Cd_MGUbicazione_A" searchtitle="Ubicazione di Arrivo" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                    <i class="detail-giacar-a fas fa-boxes mo-pointer w3-right w3-margin-right w3-xlarge"></i>
                </div>
            </div>
        </div>
        <%-- BTN CONFERMA --%>
        <div class="w3-row w3-center w3-margin-bottom w3-margin-top">
            <button class="btn-confirm lg-traconfirm" onclick="Confirm_Read();">Conferma</button>
        </div>
    </div>

    <%-- #1.1500 pgTRPiede (TRASFERIMENTI INTERNI: PIEDE) --%>
    <div id="pgTRPiede" class="mo-page w3-container">
        <div class="mo-intestazione">
            <label>SALVATAGGIO DEL TRASFERIMENTO</label>
        </div>
        <div class="lg-mt-5">
            <div class="lg-mt-15 lg-mb-10">
                <div class="w3-row w3-right">
                    <img class="w3-right mo-pointer" onclick="$('#pgTRPiede .ck-print').prop('checked', false); Nav.Next();" src="icon/Salva.svg" title="Salva in modo definitivo il documento" style="width: 1.8em; height: 1.8em;" />
                </div>
                <div class="w3-row">
                    <label class="trp-iddo w3-tag lg-tag w3-xlarge"></label>
                    <label class="lg-rllbl">del </label>
                    <label class="trp-datado lg-rllbl"></label>
                </div>
                <div class="w3-row lg-rlp-lbldo">
                    <label class="trp-descdo">Descrizione del trasferimento</label>
                </div>
            </div>

            <div class="w3-row w3-centered">
                <div class="lg-card mo-display-inlineblock w3-center">
                    <span class="lg-lbl-da" title="Articoli di prelievo">TOTALI</span><br />
                    <span class="ar-totali lg-lblstd"></span>
                </div>
                <div class="lg-card mo-display-inlineblock w3-center">
                    <span class="lg-lbl-da" title="Articoli totali letti">INCOMPLETI</span><br />
                    <span class="ar-incompleti lg-lblstd"></span>
                </div>
            </div>
            <div class="lg-mt-5">
                <div class="div-notepiede">
                    <label class="lg-lbl-da">NOTE</label><br />
                    <textarea name="NotePiede" rows="4" class="first-focus lg-input"></textarea>
                </div>
                <div class="div-listener">
                    <label class="lg-lbl-da">LISTENER</label><br />
                    <select name="Listener" class="lg-input" onchange="Listener_Sel_Idx(this, false);">
                    </select>
                </div>
                <input type="checkbox" class="ck-print" style="display: none;" checked="checked" />
            </div>
        </div>
    </div>

    <%-- #1.1550 pgTR_UBPA (TRASFERIMENTI INTERNI: Per ubicazione partenza-arrivo) --%>
    <div id="pgTR_UBPA" class="mo-page w3-container">
        <div class="mo-intestazione">
            <label>TRASFERIMENTO INTERNO UBICAZIONE</label>
        </div>
        <div>
            <label class="title lg-lbl-da">DESCRIZIONE</label>
            <br />
            <input name="Descrizione" type="text" class="lg-input" style="width: 70%;" />
            <img class="w3-right mo-pointer" onclick="Ajax_xmosp_xMOTR_UBPA_Save();" src="icon/Salva.svg" title="Salva il trasferimento" style="width: 1.8em; height: 1.8em;" />
        </div>
        <div>
            <label class="lg-lbl-da">DATA</label>
            <br />
            <input name="DataMov" type="date" class="lg-input" style="width: 200px" />
        </div>
        <div class="div-mgp div-accordion lg-mt-5">
            <div class="header mo-intestazione">
                <label>MAGAZZINO PARTENZA&nbsp;</label>
                <img class="icon lg-iupdown mo-pointer w3-right" src="icon/ArrowUp.svg" state="up" />
                <label class="cd_mg_p w3-right w3-margin-right"></label>
            </div>
            <div class="content w3-margin-top">
                <input name="Cd_MG_P" type="text" class="enter-gonext lg-input" style="width: 80px" />
                <img searchkey="Cd_MG_P" searchtitle="Magazzino di Partenza" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                <div class="div-mgubip">
                    <label class="lg-lbl-da">UBICAZIONE</label><br />
                    <input name="Cd_MGUbicazione_P" type="text" class="enter-gonext lg-input" style="width: 180px" />
                    <img searchkey="Cd_MGUbicazione_P" searchtitle="Ubicazione di Partenza" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                    <i class="detail-giacar-p fas fa-boxes mo-pointer w3-right w3-margin-right w3-xlarge"></i>
                </div>
            </div>
        </div>
        <%-- MG ARRIVO --%>
        <div class="div-mga div-accordion lg-mt-5">
            <div class="header mo-intestazione">
                <label>MAGAZZINO ARRIVO&nbsp;</label>
                <img class="icon lg-iupdown mo-pointer w3-right" src="icon/ArrowUp.svg" state="up" />
                <label class="cd_mg_a w3-right w3-margin-right"></label>
            </div>
            <div class="content w3-margin-top">
                <input name="Cd_MG_A" type="text" class="enter-gonext lg-input" style="width: 80px" />
                <img searchkey="Cd_MG_A" searchtitle="Magazzino di Arrivo" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                <div class="div-mgubia">
                    <label class="lg-lbl-da">UBICAZIONE</label><br />
                    <input name="Cd_MGUbicazione_A" type="text" class="enter-gonext lg-input" style="width: 180px" />
                    <img searchkey="Cd_MGUbicazione_A" searchtitle="Ubicazione di Arrivo" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                    <i class="detail-giacar-a fas fa-boxes mo-pointer w3-right w3-margin-right w3-xlarge"></i>
                </div>
            </div>
        </div>
        <div class="lg-mt-5">
            <div class="lg-mt-5">
                <div class="div-notepiede">
                    <label class="lg-lbl-da">NOTE</label><br />
                    <textarea name="NotePiede" rows="4" class="lg-input"></textarea>
                </div>
                <div class="div-listener">
                    <label class="lg-lbl-da">LISTENER</label><br />
                    <select name="Listener" class="lg-input" onchange="Listener_Sel_Idx(this, false);">
                    </select>
                </div>
            </div>
        </div>
    </div>

    <%-- #1.1600 pgINAperti (INVENTARIO: ELENCO INVENTARI APERTI) --%>
    <div id="pgINAperti" class="mo-page lg-gray">
        <div class="w3-row w3-right w3-margin-bottom">
            <img class="mo-pointer w3-right w3-margin-right lg-mt-5" src="icon/Aggiorna.svg" onclick="Ajax_xmofn_xMOIN_Aperti();" style="width: 1.8em; height: 1.8em;" />
            <img class="mo-pointer w3-right w3-margin-right lg-mt-5" onclick="oPrg.Pages[oPrg.PageIdx(enumPagine.pgIN)].Enabled = true; Nav.Next();" src="icon/Add.svg" style="width: 1.8em; height: 1.8em;" />
        </div>
        <ul class="w3-ul lg-docapul lg-gray">
            <li id_xmoin="" class="template w3-bar mo-pointer w3-white" style="display: none;">
                <div class="w3-bar-item">
                    <span class="lg-tag w3-tag">INV</span>
                    <span class="id"></span><span>&nbsp;</span>
                    <%--<span class="cd_mgesercizio"></span>--%>
                    <span class="mges_descrizione"></span>
                    <br />
                    <span class="cd_mg"></span>
                    <br />
                    <span class="cd_mgubicazione"></span>
                    <br />
                    <span class="dataora"></span>
                </div>
                <img delete="false" class="lg-doapdel lg-pointer w3-bar-item w3-right" onclick="$(this).attr('delete', 'true');" src="icon/EliminaGrigio.svg" />
            </li>
        </ul>
        <span class="msg"></span>
    </div>


    <%-- #1.1700 pgIN (INVENTARIO: TESTA) --%>
    <div id="pgIN" class="mo-page w3-container">
        <div class="mo-intestazione">
            <label>INVENTARIO:</label>
            <label class="lb-doc-id lg-ml-15"></label>
            <div class="w3-dropdown-click w3-right">
                <img onclick="$('.info-content').toggle();" class="mo-pointer" src="icon/InfoWhite.svg" style="width: 1.3em; height: 1.3em;" />
                <div class="info-content w3-dropdown-content w3-bar-block w3-border w3-padding" onclick="$(this).hide();">
                    <span class="ubicazione lg-pl-4 lg-mr-6">
                        <input class="ck-ubicazione w3-check" type="checkbox" disabled="disabled" />
                        <label class="etichetta lg-lblstd">Gestione Ubicazione</label>
                    </span>
                    <br />
                    <span class="lotto lg-pl-4 lg-mr-6">
                        <input class="ck-lotto w3-check" type="checkbox" disabled="disabled" />
                        <label class="etichetta lg-lblstd">Gestione Lotto</label>
                    </span>
                    <br />
                    <span class="commessa lg-pl-4 lg-mr-6">
                        <input class="ck-commessa w3-check" type="checkbox" disabled="disabled" />
                        <label class="etichetta lg-lblstd">Gestione Commessa</label>
                    </span>
                </div>
            </div>
        </div>
        <div>
            <div>
                <label class="title lg-lbl-da">DESCRIZIONE</label>
                <br />
                <input name="Descrizione" type="text" class="lg-input" style="width: 70%;" />
            </div>
            <%-- Esercizio --%>
            <label class="lg-lbl-da">ESERCIZIO</label><br />
            <select name="Cd_MGEsercizio" class="lg-input">
            </select><br />
            <%-- Data --%>
            <div class="w3-row lg-mt-5">
                <label class="lg-lbl-da">DATA</label><br />
                <input name='DataOra' type="date" class="lg-input" style="width: 200px" />
            </div>
            <label class="lg-lbl-da">MAGAZZINO</label><br />
            <input name="Cd_MG" type="text" class="first-focus input-label lg-input" style="width: 80px" />
            <img searchkey="Cd_MG" searchtitle="Magazzino" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
            <div class="div-mgubi">
                <label class="lg-lbl-da">UBICAZIONE MAGAZZINO</label><br />
                <input name="Cd_MGUbicazione" type="text" class="lg-input" style="width: 180px" />
                <img searchkey="Cd_MGUbicazione" searchtitle="Ubicazione" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
            </div>
            <div class="div-rig">
                <label class="lg-lbl-da">RIGHE</label><br />
                <input name='Top' class="lg-input w3-right-align" type="number" style="width: 50px;" />
            </div>
        </div>
    </div>

    <%-- #1.1800 pgINRig (INVENTARIO: ELENCO AR MASSIVO + DETTAGLIO PER INVENTARIO PUNTUALE) --%>
    <div id="pgINRig" class="mo-page w3-container">
        <div class="div-grid">
            <div class="div-filtri div-accordion lg-mt-5">
                <div class="header mo-intestazione">
                    <label>MAGAZZINO: </label>
                    <label class="cd_mg"></label>
                    <img class="icon lg-iupdown mo-pointer w3-right" src="icon/ArrowUp.svg" state="up" />
                </div>
                <div class="content">
                    <%-- ARTICOLO --%>
                    <label class="lg-lbl-da">ARTICOLO</label><br />
                    <input type="text" class="first-focus Cd_AR lg-input" onkeyup="INRig_Client_Filter();" style="width: 170px;" />
                    <div class="div-mgubi">
                        <label class="lg-lbl-da">UBICAZIONE MAGAZZINO</label><br />
                        <input name='Cd_MGUbicazione' type="text" class="Cd_MGUbicazione lg-input" onkeyup="INRig_Client_Filter();" style="width: 170px" />
                    </div>
                </div>
            </div>
            <div>
                <img class="lg-btn-bottom position1 mo-pointer" src="icon/AddBlue.svg" onclick="Detail_pgINRig_Load();" />
                <img class="btn-top lg-btn-bottom position2 mo-pointer" onclick="GoTo_TopPage();" style="display: none;" src="icon/ArrowUpCircle.svg" />
                <%-- LISTA ARTICOLI PER IN MASSIVO --%>
                <table class="tbl-arlist lg-table w3-table w3-striped lg-mt-5">
                    <tr>
                        <th class="lg-lbl-da">AR/LT</th>
                        <th class="lg-lbl-da w3-center mo-pointer Cd_MGUbicazione">UBICAZIONE</th>
                        <th class="lg-lbl-da w3-center mo-pointer Cd_DOSottoCommessa">COMMMESSA</th>
                        <th class="lg-lbl-da w3-center">CONTABILE</th>
                        <th class="lg-lbl-da w3-center mo-pointer col-qtarilevata" onclick="$('#pgINRig .tbl-arlist .col-qtarilevata').hide(); $('#pgINRig .tbl-arlist .col-qtarettifica').show();">RILEVATA
                        </th>
                        <th class="lg-lbl-da w3-center mo-pointer col-qtarettifica" onclick="$('#pgINRig .tbl-arlist .col-qtarettifica').hide(); $('#pgINRig .tbl-arlist .col-qtarilevata').show();">RETTIFICA
                        </th>
                    </tr>
                    <tr class="template mo-pointer w3-hover-light-gray" style="display: none;">
                        <td class="lg-font-07em">
                            <label class="Cd_AR"></label>
                            <br />
                            <label class="Cd_ARLotto w3-text-gray"></label>
                        </td>
                        <td class="lg-font-07em w3-right-align Cd_MGUbicazione"></td>
                        <td class="lg-font-07em w3-right-align Cd_DOSottoCommessa"></td>
                        <td class="lg-font-07em col-qta w3-right-align">
                            <label class="Quantita"></label>
                            <br />
                            <label class="Cd_ARMisura w3-text-gray"></label>
                        </td>
                        <td class="col-qtarilevata lg-font-07em  w3-right-align">
                            <label class="QtaRilevata"></label>
                            <br />
                            <label class="Cd_ARMisura w3-text-gray"></label>
                        </td>
                        <td class="col-qtarettifica lg-font-07em w3-right-align">
                            <label class="QtaRettifica"></label>
                            <br />
                            <label class="Cd_ARMisura w3-text-gray"></label>
                        </td>
                        <%--<td class="w3-center Cd_ARMisura"></td>--%>
                    </tr>
                    <%-- template non nascosto perchè ci pensano le media query --%>
                    <tr class="template_ARDesc" style="display: none;">
                        <td class="lg-font-07em Descrizione" colspan="5"></td>
                    </tr>
                    <tfoot>
                    </tfoot>
                </table>
                <label class="mo-msg-no-ar">Nessun articolo da inventariare.</label>
            </div>
        </div>

        <div class="div-detail">
            <div class="w3-row">
                <img class="icon-closedetail w3-left mo-pointer lg-mt-5 lg-mb-5" onclick="$('#pgINRig .div-detail').hide(); $('#pgINRig .div-grid').show();" src="icon/Previous.svg" style="width: 1.8em; height: 1.8em;" />
            </div>
            <div class="mo-intestazione">
                <label>ARTICOLO</label>
                <label class="NRow lbl"></label>
                <span style="display: none; text-align: center; padding: 4px 5px;" class="icon-Menu w3-right" onclick="Detail_pgINRig_GoBack()"></span>
            </div>

            <%-- #zzz --%>
            <%--<div class="w3-container">--%>
            <%-- ARTICOLO NEW --%>
            <div class="div-in-ar-new">
                <div>
                    <label class="lg-lbl-da">ARTICOLO&nbsp;</label><label class="ar-aa lbl lg-lbl-da"></label><br />
                    <input name="Cd_AR" type="text" class="first-focus lg-input" style="width: 170px;" />
                    <img searchkey="Cd_AR" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                    <img class="detail-giacubi mo-pointer w3-right w3-margin-right" title="Giacenza dell'articolo" src="icon/Scatola.svg" style="width: 1.6em" />
                    <label name="AR_Descrizione" class="lg-lbl-da descrizione info-ext" style="display: block;"></label>
                </div>
                <%-- COMMESSA --%>
                <div class="div-com">
                    <label class="lg-lbl-da">SOTTOCOMMESSA</label><br />
                    <input name="Cd_DOSottoCommessa" type="text" class="lg-input" style="width: 200px;" />
                    <img searchkey="Cd_DOSottoCommessa" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                </div>
                <%-- LOTTO --%>
                <div class="div-lotto">
                    <label class="lg-lbl-da">LOTTO</label><br />
                    <input name="Cd_ARLotto" type="text" class="lg-input" style="width: 130px" />
                    <img searchkey="Cd_ARLotto" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                </div>
                <div class="content">
                    <label class="lg-lbl-da">MAGAZZINO</label><br />
                    <input name="Cd_MG" type="text" class="input-label lg-input" style="width: 80px" tabindex="25" disabled="disabled" />
                    <br />
                    <%-- UBICAZIONE --%>
                    <div class="div-mgubi">
                        <label class="lg-lbl-da">UBICAZIONE</label><br />
                        <input name="Cd_MGUbicazione" type="text" class="lg-input" style="width: 180px" />
                        <img searchkey="Cd_MGUbicazione" searchtitle="Ubicazione" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                    </div>
                </div>
                <div class="w3-row w3-center lg-mt-15 lg-mb-5">
                    <button class="in-btn-new lg-btn-blue" onclick="Detail_pgINRig_AR_New();">OK</button>
                </div>
                <div class="mo-intestazione">
                    <label>GIACENZE ARTICOLO</label>
                </div>
                <%-- Lista delle giacenze per l'articolo selezionato --%>
                <table class="tbl-argiac lg-table w3-table w3-striped lg-mt-5">
                    <tr>
                        <th class="lg-lbl-da w3-center">SOTTOCOMMESSA</th>
                        <th class="lg-lbl-da w3-center">LOTTO</th>
                        <th class="lg-lbl-da w3-center">UBICAZIONE</th>
                        <th class="lg-lbl-da w3-center">QUANTITA'</th>
                    </tr>
                    <tr class="template mo-pointer w3-hover-light-gray" style="display: none;">
                        <td class="lg-font-07em w3-right-align argiac-dosottocommessa"></td>
                        <td class="lg-font-07em w3-right-align argiac-arlotto"></td>
                        <td class="lg-font-07em w3-right-align argiac-mgubicazione"></td>
                        <td class="lg-font-07em w3-right-align">
                            <label class="argiac-quantita"></label>
                            <br />
                            <label class="argiac-armisura w3-text-gray"></label>
                        </td>
                    </tr>
                </table>
                <label class="mo-msg-argiac">Nessuna giacenza presente per l'articolo</label>
            </div>
            <%-- ARTICOLO --%>
            <div class="div-in-ar">
                <%-- QTA E UM --%>
                <div class="div-qtaum">
                    <div>
                        <label class="lg-lbl-h4 lg-font-blue lbl Cd_AR"></label>
                        <br />
                        <label class="lg-lbldescrizione lbl Info"></label>
                    </div>
                    <label class="lg-lbl-da">QUANTITA</label><br />
                    <label class="lg-lblstd lbl Quantita"></label>
                    <br />
                    <div class="w3-row">
                        <div class="lg-floatleft" style="width: 40px; margin-top: 1px;">
                            <%-- Icona che indica la modalità somma se attiva --%>
                            <img class="mod-somma mo-pointer w3-margin-right" onclick="ModSommaToggleSrc($(this));" src="icon/PlusBlack.svg" style="width: 1.8em; height: 1.8em;" />
                        </div>
                        <div class="lg-floatleft" style="width: 80%">
                            <input name="QtaRilevata" type="number" class="focus lg-input w3-right-align" style="width: 35%" onfocus="Quantita_Onfocus();" />
                            <select name="Cd_ARMisura" class="lg-input" style="width: 60px;">
                            </select>
                            <i style="color: #9c27b0;" class="fas fa-check-circle w3-xlarge w3-float-left" onclick="Detail_pgINRig_AR_Confirm();"></i>
                        </div>
                    </div>
                    <label class="lg-lblstd">Lettura:&nbsp;<label class="lg-lblstd lbl QtaRilevata"></label></label>
                    <br />
                    <label class="msg" style="font-size: 12px; color: gray;"></label>
                </div>
                <%-- BTN PER IN MASSIVO --%>
                <div class="btn-inm w3-row w3-center">
                    <div class="w3-row lg-floatleft" style="width: 23.33%; margin-top: 10px;">
                        <img class="btn-slideshow in-back lg-arrow-border w3-right mo-pointer" style="width: 2.8em; height: 2.8em;" data-slide="left" src="icon/BackBlue.svg" />
                    </div>
                    <div class="w3-row lg-floatleft" style="width: 53.33%; margin-top: 10px;">
                        <button class="in-ok lg-btn-blue mo-pointer" onclick="Detail_pgINRig_AR_Confirm();" style="max-width: 100px; padding: 10px;">OK</button>
                    </div>
                    <div class="w3-row lg-floatleft lg-mt-5" style="width: 23.33%; margin-top: 10px;">
                        <img class="btn-slideshow in-next lg-arrow-border w3-left mo-pointer" style="width: 2.8em; height: 2.8em;" data-slide="right" src="icon/AvantiBlue.svg" />
                    </div>
                </div>
                <%-- BTN PER IN PUNTUALE --%>
                <div class="btn-inp w3-center lg-mt-15">
                    <button class="lg-btn-white mo-pointer lg-mt-5" onclick="Ajax_xmosp_xMOIN_MakeOne_MGMov('CON');">Continua</button><br />
                    <button class="lg-btn-white mo-pointer lg-mt-5" onclick="Ajax_xmosp_xMOIN_MakeOne_MGMov('NEW');">Ricomincia</button><br />
                    <button class="lg-btn-white mo-pointer lg-mt-5" onclick="Ajax_xmosp_xMOIN_MakeOne_MGMov('END');">Esci</button>
                </div>
            </div>
            <%-- LETTURA SEQUENZIALE --%>
            <div class="div-sequenziale lg-mb-5 lg-mt-30">
                <label class="container">
                    <label class="lg-lblsequenziale">Lettura sequenziale</label>
                    <input class="ck-sequenziale" type="checkbox" onclick="SlideShow_Attiva($(this));" />
                    <span class="checkmark"></span>
                </label>
            </div>
            <%--</div>--%>
        </div>
    </div>

    <%-- #1.1900 pgINPiede (INVENTARIO: PIEDE) --%>
    <div id="pgINPiede" class="mo-page w3-container">
        <div class="mo-intestazione">
            <label>CONFERMA INVENTARIO</label>
        </div>
        <div class="w3-center lg-mt-5">
            <label class="lg-headertitle lg-fontblue">Rettifiche effettuate:</label>
            <label class="lbl-inm-let lg-headertitle lg-fontblue"></label>
            <div class="w3-row lg-mt-15">
                <button class="lg-btn-white mo-pointer lg-mt-5" onclick="Ajax_xmosp_xMOIN_Make_MGMov(this, 'CON');">Continua</button><br />
                <button class="lg-btn-white mo-pointer lg-mt-5" onclick="Ajax_xmosp_xMOIN_Make_MGMov(this, 'NEW');">Ricomincia</button><br />
                <button class="lg-btn-white mo-pointer lg-mt-5" onclick="Ajax_xmosp_xMOIN_Make_MGMov(this, 'END');">Esci</button>
            </div>
        </div>
    </div>

    <%-- #1.2100 pgSP (SPEDIZIONE) fnl --%>
    <div id="pgSP" class="mo-page w3-container">
        <div>
            <label class="title lg-lbl-da">SPEDIZIONE</label>
            <br />
            <input name="Cd_xMOCodSpe" type="text" class="keypressexec lg-input" style="width: 60%;" />
            <img searchkey="Cd_xMOCodSpe" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.4em" />
        </div>
        <div>
            <label class="title lg-lbl-da">SELEZIONA ID DOCUMENTO</label>
            <br />
            <input name="Id_DOTes" type="text" class="keypressexec first-focus lg-input" style="width: 60%;" />
        </div>
        <div>
            <label class="title lg-lbl-da">DOC</label><br />
            <select name="Cd_DO" class="lg-input" style="width: 40%"></select>
            <img class="i sp-no mo-pointer w3-right w3-margin-right" src="icon/AccessDenied.svg" style="width: 1.2em; height: 1.2em;" onclick="pgSP_PulisciFiltri();" />
            <img class="i sp-ok mo-pointer w3-right w3-margin-right" onclick="Nav.Next();" src="icon/CheckGreen.svg" style="width: 1.2em; height: 1.2em;" />
        </div>
        <div class="mo-intestazione lg-mt-5">
            <label>SPEDIZIONE</label>
            <img class="mo-pointer w3-right" style="width: 18px;" src="icon/AggiornaWhite.svg" onclick="Ajax_xmofn_xMOCodSpe();" />
            <span class="mo-pointer w3-right" style="margin-right: 10px; font-size: 15px;" onclick="pgSP_OrderTable();"><i class="fas fa-sort-amount-up-alt"></i></span>
            <label class="container w3-right w3-margin-right">
                <label>Oggi</label>
                <input name="checkFilterDate" class="ck-autoconfirm" type="checkbox" onclick="Ajax_xmofn_xMOCodSpe();" style="position: absolute;" />
                <span class="checkmark"></span>
            </label>
        </div>
        <div class="spedizioni">
            <div class="w3-card template" style="display: none;">
                <div>
                    <label class="container" data-key="check">
                        <input class="ck-sp" type="checkbox" style="position: absolute;" />
                        <span class="checkmark"></span>
                    </label>
                    <label data-key="error">
                        <i class="fas fa-times-circle"></i>
                    </label>
                </div>
                <div style="width: 100%">
                    <div class="w3-container" style="margin-bottom: 5px;">
                        <span data-key="xMOSpePresa" class="text-muted">A</span>
                        <span data-key="CF_Descrizione" class="text-muted w3-right">Casale Alessandro</span>
                    </div>
                    <div class="w3-container w3-right-align">
                        <span data-key="Doc" class="mo-pointer lg-fontblue lg-underline w3-left">OVC 1/2021</span>
                        <span data-key="Note" class="icon-bound mo-pointer">
                            <i class="far fa-comment-alt"></i>
                        </span>
                        <span data-key="DMS" class="icon-bound mo-pointer">
                            <i class="fas fa-paperclip"></i>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <%--#1.2202 pgRLRigID (PRELIEVO DA Id_DORIG)--%>
    <div id="pgRLRigID" class="mo-page w3-container">
        <div style="overflow-y: auto;">
            <div class="mo-intestazione lg-mt-5">
                <label class="lb-doc-id"></label>
                <label class="lb-doc-name">DOC</label><label>:&nbsp;</label>
                <label class="lb-cli"></label>
                <img class="mo-pointer w3-margin-right w3-right lg-mr-6 lg-mt-2" onclick="pgRLRigID_Clear();" title="Reset dei campi" src="icon/AggiornaWhite.svg" style="width: 17px;" />
            </div>
            <label class="detail-prelievi lg-lbllink mo-pointer w3-margin-right" onclick="Ajax_xmofn_DOTes_Prel_4Detail();">Elenco Prelievi &gt;</label>
            <label class="doprel lg-lbllink mo-pointer w3-margin-right w3-right lg-underline" style="display: none; margin-top: 2px;"></label>
            <%-- BARCODE --%>
            <div class="div-barcode lg-mt-5">
                <label class="lg-lbl-da">BARCODE</label>
                <label class="lb-idriga lg-lbl-da"></label>
                <label class="container w3-right w3-margin-right">
                    <label class="lg-lblautoconfirm" style="font-size: 0.7em;">Conf. automatica</label>
                    <input class="ck-autoconfirm" type="checkbox" onclick="SetFocus();" style="position: absolute;" />
                    <span class="checkmark"></span>
                </label>
                <div class="barcode lg-mt-5">
                    <select class="lg-input lg-select lg-mb-5" style="width: 100px; display: none;"></select>
                    <input name="xMOBarcode" class="first-focus lg-input lg-mr-6" type="text" placeholder="Barcode..." style="width: 95%;" onfocus="$(this).off( 'blur' );" />
                </div>
            </div>
            <%-- ID RIGA --%>
            <div class="w3-row">
                <input name="Id_DORig" class="lg-input" type="text" style="display: none;" />
            </div>

            <%-- ARTICOLO --%>
            <div class="w3-row">
                <label class="lg-lbl-da">ARTICOLO</label><label class="ar-aa lg-lbl-da w3-small lg-ml-8"></label><br />
                <input name="Cd_AR" type="text" class="first-focus lg-input" style="width: 140px" tabindex="5" disabled="disabled" />
                <img class="detail-giacubi mo-pointer w3-right w3-margin-right" title="Giacenza dell'articolo" src="icon/Scatola.svg" style="width: 1.6em" />
            </div>
            <%-- QTA E UM --%>
            <div class="div-qtaum">
                <label class="lg-lbl-da">QUANTITA</label><br />
                <input name="Quantita" type="number" step="0.001" min="0" class="lg-input w3-right-align" style="width: 35%" tabindex="10" onfocus="Quantita_Onfocus($(this));" />
                <select name="Cd_ARMisura" class="lg-input" style="width: 60px;" tabindex="15">
                </select>
            </div>
            <%-- COMMESSA --%>
            <div class="div-com">
                <label class="lg-lbl-da">SOTTOCOMMESSA</label><br />
                <input name="Cd_DOSottoCommessa" type="text" class="lg-input" style="width: 200px;" tabindex="20" />
                <img searchkey="Cd_DOSottoCommessa" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
            </div>
            <%-- LOTTO --%>
            <div class="div-lotto">
                <label class="lg-lbl-da">LOTTO</label><label class="lotto-scad lg-lbl-da">/SCAD.</label><br />
                <input name="Cd_ARLotto" type="text" class="lg-input" style="width: 130px" tabindex="45" />
                <label class="lotto-scad lg-lbl-da">/</label>
                <input name="DataScadenza" type="date" class="lotto-scad lg-input" style="width: 140px" tabindex="46" />
                <img searchkey="Cd_ARLotto" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                <br />
            </div>
            <%-- EXTFLD--%>
            <div class="div-extfld">
                <div class="template_extfld" style="display: none;">
                    <label class="lg-lbl-da"></label>
                    <br />
                    <input name="" type="" class="lg-input" style="width: 60%" tabindex="50" />
                </div>
            </div>
            <%-- BTN CONFERMA --%>
            <div class="w3-row w3-center w3-margin-bottom lg-mt-15">
                <button class="btn-confirm lg-rlrigconfirm" onclick="Confirm_Read();" tabindex="55">Conferma</button>
            </div>

            <%-- TABELLA LETTURE --%>
            <div class="div-letture div-accordion">
                <div class="header mo-intestazione">
                    <label>LETTURE:&nbsp;&nbsp;</label>
                    <label class="letture"></label>
                    <img class="icon lg-iupdown mo-pointer w3-right" src="icon/ArrowUp.svg" state="up" style="width: 17px;" />
                    <img class="delete mo-pointer w3-margin-right w3-right" onclick="$('#Popup_Delete_Last_Read').show();" src="icon/EliminaBianco.svg" style="width: 17px;" />
                    <img class="detail-letture mo-pointer w3-margin-right w3-right" src="icon/MenuWhite.svg" style="width: 17px;" />
                </div>
                <div class="mo-ofy-auto" style="max-height: 150px;">
                    <%-- label contenente le informazioni dell'ultima lettura effettuata --%>
                    <label class="lastread lg-lbl-da" style="display: none; font-size: 0.95em"></label>
                    <table class="content lg-table w3-table w3-striped lg-mt-5">
                        <tr>
                            <th class="lg-lbl-da id-riga mo-pointer" style="display: none;" onclick="$('#pgRLRigID table .id-riga').hide(); $('#pgRLRigID table .cd-ar').show();">ID RIGA</th>
                            <th class="lg-lbl-da cd-ar mo-pointer" onclick="$('#pgRLRigID table .cd-ar').hide(); $('#pgRLRigID table .id-riga').show();">AR</th>
                            <th class="lg-lbl-da Descrizione cl-ardesc">Descrizione</th>
                            <th class="lg-lbl-da w3-center">UM</th>
                            <th class="lg-lbl-da w3-center mo-pointer col-qta" onclick="$('#pgRLRigID .col-qta').hide(); $('#pgRLRigID .col-qtaresidua').show();">QUANTITA</th>
                            <th class="lg-lbl-da w3-center mo-pointer col-qtaresidua" onclick="$('#pgRLRigID .col-qtaresidua').hide(); $('#pgRLRigID .col-qta').show();">RESIDUA</th>
                            <th class="lg-lbl-da w3-center mo-pointer col-lotto" onclick="$('#pgRLRigID .col-lotto').hide(); $('#pgRLRigID .col-commessa').show();">LOTTO</th>
                            <th class="lg-lbl-da w3-center mo-pointer col-commessa" onclick="$('#pgRLRigID .col-commessa').hide(); $('#pgRLRigID .col-lotto').show();">COMMESSA</th>
                            <th class="lg-lbl-da w3-center">DOC.</th>
                        </tr>
                        <tr class="template" style="display: none;">
                            <td class="lg-font-07em id-riga Id_DORig" style="display: none;"></td>
                            <td class="lg-font-07em cd-ar Cd_AR"></td>
                            <td class="lg-font-07em Descrizione cl-ardesc"></td>
                            <td class="lg-font-07em w3-center Cd_ARMisura"></td>
                            <td class="lg-font-07em w3-right-align col-qta Quantita"></td>
                            <td class="lg-font-07em w3-right-align col-qtaresidua QtaResidua"></td>
                            <td class="lg-font-07em w3-right-align col-lotto Cd_ARLotto"></td>
                            <td class="lg-font-07em w3-right-align col-commessa Cd_DOSottoCommessa"></td>
                            <td class="lg-font-07em w3-right-align DocRif mo-pointer lg-fontblue lg-underline"></td>
                        </tr>
                        <%-- template non nascosto perchè ci pensano le media query --%>
                        <tr class="template_ARDesc" style="display: none;">
                            <td class="lg-font-07em Descrizione" colspan="5"></td>
                        </tr>
                    </table>
                </div>
            </div>

        </div>
    </div>

    <%-- #1.2201 pgAA (ACQUISIZIONE ALIAS) --%>
    <div id="pgAA" class="mo-page w3-container">
        <div class="mo-intestazione w3-round-small">
            <label class="alias mo-bold">ACQUISIZIONE ALIAS</label>
            <label class="codalt mo-bold">ACQUISIZIONE ALTERNATIVI</label>
            <label class="switch switch-aa w3-right">
                <input class="ck-alt" type="checkbox" onclick="pgAA_Change_TipoAA($(this).prop('checked'));" />
                <span class="slider slider-aa round"></span>
            </label>
        </div>
        <%-- cliente/fornitore --%>
        <div class="codalt w3-row">
            <label class="lg-lbl-da">CLIENTE/FORNITORE</label>
            <br />
            <input name="Cd_CF" type="text" class="first-focus lg-input" style="width: 100px;" />
            <label class="descrizione lg-lbldescrizione" name="CF_Descrizione"></label>
            <img searchkey="Cd_CF" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
        </div>
        <%-- articolo --%>
        <div class="w3-row">
            <label class="lg-lbl-da">ARTICOLO</label><label class="ar-aa lg-lbl-da w3-small lg-ml-8"></label><br />
            <input name="Cd_AR" type="text" class="first-focus lg-input" style="width: 140px" />
            <img searchkey="Cd_AR" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
            <label name="AR_Descrizione" class="lg-lbl-da descrizione info-ext" style="display: block;"></label>
        </div>
        <%-- um --%>
        <div class="alias w3-row">
            <label class="lg-lbl-da">UM</label>
            <br />
            <input name="Cd_ARMisura" type="text" class="lg-input" style="width: 100px;" />
            <img searchkey="Cd_ARMisura" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
        </div>
        <%-- barcode --%>
        <div class="barcode w3-row lg-mt-15">
            <select class="lg-input lg-select lg-mb-5" style="width: 100px;" onchange="Barcode_SelType();"></select>
            <input name="xMOBarcode" class="first-focus lg-input lg-mr-6" type="text" placeholder="Barcode..." style="width: 70%;" />
        </div>
        <%-- alias --%>
        <div class="alias w3-row">
            <label class="lg-lbl-da">ALIAS</label><br />
            <input name='ALI' type="text" class="lg-input" style="width: 200px" />
        </div>
        <%-- codice alternativo --%>
        <div class="codalt w3-row">
            <label class="lg-lbl-da">CODICE ALTERNATIVO</label><br />
            <input name='ALT' type="text" class="lg-input" style="width: 200px" />
        </div>
        <%-- descrizione codalt --%>
        <div class="codalt w3-row">
            <label class="lg-lbl-da">DESCRIZIONE</label>
            <br />
            <input name="Descrizione" type="text" class="lg-input" style="width: 80%;" />
            <br />
            <label class="lg-lbl-da">Se non specificata viene inserita quella dell'articolo</label>
        </div>
        <div class="w3-row w3-center lg-mt-15">
            <button class="validate lg-aaconfirm">INSERISCI</button>
        </div>
        <label class="lg-lbl-da lg-font-07em msg"></label>
    </div>

    <%-- #1.2300 pgLog (PAGINA DI LOG) --%>
    <div id="pgLog" class="mo-page lg-gray">
        <div class="mo-intestazione" style="padding: 2px 4px;">
            <label>ELENCO MESSAGGI</label>
            <button class="w3-right mo-pointer w3-white" onclick="Popup_ListenerTesting_Load();" style="padding: 2px 4px; border: none;">TEST LISTENER</button>
        </div>
        <div>
            <ul class="w3-ul lg-docapul lg-gray lg-mt-5">
                <li class="template w3-bar w3-white" style="display: none;">
                    <div class="w3-row w3-bar-item">
                        <div class="w3-row">
                            <img style="width: 1.4em;" src="icon/Messaggi.svg" />
                            <span class="datetime lg-ml-15 lg-lblstd"></span>
                        </div>
                        <div class="w3-row lg-mt-5">
                            <span class="title w3-row lg-lblstd"></span>
                            <span class="message w3-row lg-lblstd"></span>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>

    <%-- #1.2400 pgxMPIU (PERS: PAGINA PER PESATE MATERIE PRIME IN-OUT) --%>
    <div id="pgxMPIU" class="mo-page w3-container">
        <div class="mo-intestazione" style="padding: 2px 4px;">
            <label class="nrpesateaperte w3-right"></label>
            <label class="w3-right">PESATE APERTE:&nbsp;</label>
        </div>
        <div class="w3-row">
            <label class="lg-lbl-da">TIPO PESATA</label><br />
            <select name="TipoIU" class="first-focus lg-input" tabindex="1">
                <option value="I">PESATA INIZIO</option>
                <option value="U">PESATA USCITA</option>
            </select>
        </div>
        <%-- ID RIGA --%>
        <div class="w3-row">
            <label class="lg-lbl-da">ID RIGA</label><br />
            <input name="Id_DORig" class="lg-input" type="text" style="width: 70px;" tabindex="5" />
            <label class="docinfo lg-lbldescrizione"></label>
        </div>
        <%-- ARTICOLO --%>
        <div class="w3-row">
            <label class="lg-lbl-da">ARTICOLO</label><br />
            <input name="Cd_AR" type="text" class="lg-input" style="width: 60%" tabindex="10" />
            <img searchkey="Cd_AR" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
            <label name="AR_Descrizione" class="lg-lbl-da descrizione info-ext" style="display: block;"></label>
            <br />
            <label class="ardesc lg-lbldescrizione"></label>
            <%--<img class="detail-giacubi mo-pointer w3-right w3-margin-right" title="Giacenza dell'articolo" src="icon/Scatola.svg" style="width: 1.6em" />--%>
        </div>
        <%-- LOTTO --%>
        <div class="div-lotto">
            <label class="lg-lbl-da">LOTTO</label><br />
            <input name="Cd_ARLotto" type="text" class="lg-input" style="width: 130px" tabindex="20" />
            <img searchkey="Cd_ARLotto" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
        </div>
        <%-- BILANCE --%>
        <div class="div-bilance">
            <label class="lg-lbl-da">BILANCE</label><br />
            <select name="Cd_xMOBilancia" class="lg-input" style="width: 120px;" tabindex="40">
                <option value=""></option>
            </select>
            <button class="btn-confirm lg-mpiuconfirm mo-pointer" onclick="Ajax_ReadFile();" tabindex="40">PESA</button>
        </div>
        <%-- QTA E UM --%>
        <div class="div-qtaum">
            <label class="lg-lbl-da">QUANTITA</label><br />
            <%--onfocus="Quantita_Onfocus();"--%>
            <input name="Quantita" type="number" class="lg-input w3-right-align" style="width: 35%" tabindex="30" />
            <select name="Cd_ARMisura" class="lg-input" style="width: 60px;" tabindex="40">
                <option class="" value="KG" cd_armisura="KG" umfatt="1" selected="selected">KG</option>
            </select>
        </div>
        <%-- BTN CONFERMA --%>
        <div class="w3-row w3-center w3-margin-bottom lg-mt-15">
            <button class="btn-confirm lg-mpiuconfirm mo-pointer" onclick="Confirm_Read();" tabindex="40">Conferma</button>
        </div>
    </div>

    <%-- #1.2500 pgxAREtichette (PERS: PAGINA PER LA STAMPA DELLE ETICHETTE PER ARTICOLO) --%>
    <div id="pgxAREtichette" class="mo-page w3-container">
        <div class="">
            <div>
                <%-- LISTA ARTICOLI --%>
                <table class="lg-table w3-table lg-mt-5">
                    <tr>
                        <th class="lg-lbl-da">AR</th>
                        <th class="lg-lbl-da w3-center mo-pointer">LOTTO</th>
                        <th class="lg-lbl-da w3-center">QTA</th>
                        <th class="lg-lbl-da w3-center">ETICHETTE</th>
                    </tr>
                    <%-- --%>
                    <tr class="template" style="display: none;">
                        <td class="lg-font-07em Cd_AR"></td>
                        <td class="lg-font-07em Cd_ARLotto"></td>
                        <td class="lg-font-07em col-qta w3-right-align">
                            <label class="Quantita"></label>
                            <label class="Cd_ARMisura w3-text-gray"></label>
                        </td>
                        <td class="lg-font-07em" style="width: 50px;">
                            <input type="number" name="Etichette" class="lg-input w3-right-align" />
                        </td>
                    </tr>
                    <%-- template non nascosto perchè ci pensano le media query --%>
                    <tr class="template_ARDesc" style="display: none;">
                        <td class="lg-font-07em Descrizione" colspan="5"></td>
                    </tr>
                    <tfoot>
                    </tfoot>
                </table>
                <label class="mo-msg-no-ar"></label>
            </div>
        </div>
    </div>

    <%-- #1.2600 pgSM (STOCCAGGIO MERCE) --%>
    <div id="pgSM" class="mo-page w3-container">
        <div class="mo-intestazione" style="padding: 2px 4px;">
            <label class="Id_xMOTRRig_P w3-right w3-hide"></label>
            <label>Stoccaggio&nbsp;merce<span class="Id_xMOTR w3-margin-left"></span></label>
            <label class="container w3-right w3-margin-right">
                <label class="lg-lblautoconfirm">Conf. automatica</label>
                <input class="ck-autoconfirm" type="checkbox" onclick="SetAutoConfirm(); SetFocus();" style="position: absolute;" />
                <span class="checkmark"></span>
            </label>
        </div>
        <div class="div-sscc">
            <label class="lg-lbl-da">MATRICOLA</label><br />
            <input name="Cd_xMOMatricola" class="first-focus lg-input lg-mr-6" type="text" placeholder="SSCC..." />

            <div data-key="counter" data-display="Letture" class="info-ext w3-center" style="color: #5B89CB;"></div>
        </div>
        <div class="div-infosscc" style="font-size: 13px">
            <label class="Cd_xMOMatricola"></label>
            <br />
            <p>
                <label class="Cd_AR"></label>
                <br />
                <label class="lg-lbldescrizione AR_Descrizione info-ext"></label>
            </p>
            <p>
                <label class="Cd_ARLotto"></label>
                <label class="DataScadenza"></label>
            </p>
            <label>MAGAZZINO:</label><label class="Cd_MG_A"></label>
            <div class="div-mgubia w3-margin-top">
                <label class="w3-text-green" style="font-size: 1.2em">UBICAZIONE&nbsp;</label><label class="Cd_MGUbicazione_A w3-text-green" style="font-size: 1.2em"></label>
                <img class="mo-pointer w3-right" style="height: 1.6em; width: auto; margin-right: 8px;" src="icon/Refresh.svg" onclick="Ajax_xmosp_xMOTRRig_T_RicercaUbicazione_Escludi();" />
                <br />
                <input name="Cd_MGUbicazione_A" type="text" class="lg-input first-focus" tabindex="2" />
            </div>
            <label class="container lg-mt-5 lg-mr-6">
                <label class="">Ubicazione Completa</label>
                <input class="ck-xMOCompleta" type="checkbox" style="position: absolute;" tabindex="3" />
                <span class="checkmark"></span>
            </label>
            <%-- BTN --%>
            <div class="w3-row w3-center w3-margin-bottom w3-margin-top">
                <button class="lg-btn-blue lg-traconfirm" onclick="SM_Save(true);" tabindex="3">Conferma</button>
                <button class="lg-btn-white lg-traconfirm" onclick="SM_Delete();" tabindex="5">Annulla</button>
            </div>
        </div>
        <label class="lg-lbl-da lbl-esito"></label>
    </div>

    <%-- #1.2700 pgRLRig_T (GP: PAGINA DELLE LETTURE DEGLI ARTICOLI IN BASE AL GIRO DI MG) --%>
    <div id="pgRLRig_T" class="mo-page w3-container">
        <div class="mo-intestazione" style="padding: 2px 4px;">
            <img class="detail-letture mo-pointer w3-margin-left w3-right" src="icon/MenuWhite.svg" style="width: 17px;" />
            <label class="w3-right rigtcurtot"></label>
            <label class="w3-right">RIGA:&nbsp;</label>
            <img src="icon/Aggiorna.svg" style="width: 1.6em" class="mo-pointer w3-right w3-margin-right update" onclick="Ajax_xmofn_xMORLRig_T_List()" />
            <label class="Id_xMORLRig_T w3-hide"></label>
            <label>Ev. Ord:&nbsp;</label>
            <label class="Id_DOTes"></label>
            <label class="Id_DORig w3-hide"></label>
        </div>
        <div class="RLRig">
            <div class="w3-row lg-mt-5">
                <div class="w3-col s6">
                    <label class="field-name">ARTICOLO:</label><br />
                    <label class="Cd_AR"></label>
                </div>
                <div class="w3-col s6">
                    <label class="field-name lg-underline mo-pointer ApriListaAR">LOTTO:</label><br />
                    <label class="Cd_ARLotto field-value"></label>
                </div>
            </div>
            <div class="w3-row lg-mt-5">
                <div class="w3-col s12">
                    <label class="lg-lbldescrizione AR_Descrizione"></label>
                    <img src="icon/CheckGreen.svg" class="Letto w3-right" style="width: 20px;" />
                </div>
            </div>
            <div class="w3-row lg-mt-5">
                <div class="w3-col s7">
                    <label class="field-name">MG+UBI:</label>
                    <label class="Cd_MG field-value"></label>
                    <br />
                    <label class="Cd_MGUbicazione field-value w3-text-green" style="font-size: 1.8em;"></label>
                </div>
                <div class="w3-col s5 w3-center detail-letture" style="color: #5B89CB;">
                    <label class="numero-riga" style="font-size: 3.5em;"></label>
                    <label class="ARQtaT"></label>
                </div>
            </div>
            <div class="mo-intestazione lg-mb-5" style="padding: 2px 4px;">
                <label class="ARRigTot w3-right"></label>
                <label class="lbl-matricola">MATRICOLA</label>
            </div>
            <input name="Cd_xMOMatricola" class="first-focus lg-input lg-mr-6" type="text" placeholder="SSCC..." />
            <%-- ARROW --%>
            <div class="div-btnarrow w3-row w3-center lg-mt-5">
                <div class="w3-row btn-slideshow lg-arrow-border lg-floatleft mo-pointer" style="width: 49%; margin-top: 10px; margin-right: 1%;" data-slide="left">
                    <!-- <img class="mo-pointer" style="width: 1.8em; height: 1.8em;" src="icon/BackBlue.svg" /> -->
                    <span class="icon-Back" style="font-size: 1.8em; display: block; color: #0769aa;"></span>
                </div>
                <div class="btn-slideshow w3-row lg-arrow-border lg-floatleft mo-pointer lg-mt-5" style="width: 49%; margin-top: 10px;" data-slide="right">
                    <!-- <img class="mo-pointer" style="width: 1.8em; height: 1.8em;" src="icon/AvantiBlue.svg" /> -->
                    <span class="icon-Avanti" style="font-size: 1.8em; display: block; color: #0769aa;"></span>
                </div>
            </div>
            <label class="lg-lbl-da lbl-esito"></label>
            <%-- BTN COMPLETATO --%>
            <div class="div-btncompletato w3-row w3-center w3-margin-bottom lg-mt-15" style="display: none;">
                <button class="mo-pointer lg-rlrigconfirm" onclick="Nav.Next();" tabindex="55">COMPLETATO</button>
            </div>
            <div class="mo-intestazione" style="padding: 2px 4px;">
                <img class="mo-pointer w3-margin-left w3-right toggle-lista-ar" src="icon/ArrowDown.svg" style="width: 17px;" />
                <label>Elenco articoli:&nbsp;</label>
                <label class="artot"></label>
            </div>
        </div>
        <div class="mo-footer">
            <div class="lista-ar">
                <table class="content lg-table w3-table w3-striped" style="display: none;">
                    <thead>
                        <tr>
                            <th class="lg-lbl-da">Codice</th>
                            <th class="lg-lbl-da">Lotto</th>
                            <th class="lg-lbl-da">Qta letta/ord.</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="template tr-link" style="display: none;">
                            <td class="lg-font-07em Cd_AR"></td>
                            <td class="lg-font-07em Cd_ARLotto"></td>
                            <td class="lg-font-07em w3-right-align Quantita"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
        <br />
    </div>

    <%-- #1.2800 pgINSSCC (INVENTARIO PER MATRICOLA) --%>
    <div id="pgINSSCC" class="mo-page w3-container">
        <div class="mo-intestazione" style="padding: 2px 4px;">
            <label>Inventario per Matricola</label>
        </div>
        <div class="w3-container lg-mt-5">
            <div class="div-mgubip">
                <label class="lg-lbl-da">UBICAZIONE MAGAZZINO</label><br />
                <input name="Cd_MGUbicazione" type="text" class="first-focus lg-input" style="width: 180px" tabindex="1" />
                <img searchkey="Cd_MGUbicazione" searchtitle="Ubicazione" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
            </div>
            <div class="div-sscc">
                <label class="lg-lbl-da">MATRICOLA</label><br />
                <input name="Cd_xMOMatricola" class="first-focus lg-input lg-mr-6" type="text" placeholder="SSCC..." tabindex="2" tabman="true" />
            </div>
            <div class="w3-row lg-mt-5 w3-hide">
                <input name="Cd_AR" type="text" class="lg-input" style="width: 140px" tabindex="3" />
            </div>
            <div class="div-qtaum">
                <label class="lg-lbl-da">QUANTITA</label><br />
                <input name="Quantita" type="number" class="lg-input w3-right-align" style="width: 35%" onfocus="Quantita_Onfocus();" tabindex="4" />
                <select name="Cd_ARMisura" class="lg-input" style="width: 60px;" tabindex="5">
                </select><br />
                <label class="lg-lbl-da">Giacenza Contabile:&nbsp;</label><label class="Quantita lg-lbl-da"></label>
            </div>
            <div class="w3-row w3-center lg-mt-15">
                <button class="lg-btn-white mo-pointer lg-mt-5" onclick="Ajax_xmosp_xMOINSSCC_MakeOne_MGMov();">Salva</button>
                <button class="lg-btn-white mo-pointer lg-mt-5" onclick="GoHome();">Esci</button>
            </div>
        </div>
    </div>

    <%-- #1.2900 pgTRSSCC (TRASFERIMENTO INTERNO PER MATRICOLA) --%>
    <div id="pgTRSSCC" class="mo-page w3-container">
        <div class="mo-intestazione" style="padding: 2px 4px;">
            <label>Trasferimento Matricola</label>
            <label class="container w3-right w3-margin-right">
                <label class="lg-lblautoconfirm">Conf. automatica</label>
                <input class="ck-autoconfirm" type="checkbox" onclick="SetAutoConfirm(); SetFocus();" style="position: absolute;" />
                <span class="checkmark"></span>
            </label>
        </div>
        <div class="w3-container lg-mt-5">
            <div class="div-sscc">
                <label class="lg-lbl-da">MATRICOLA</label><br />
                <input name="Cd_xMOMatricola" class="first-focus lg-input lg-mr-6" type="text" placeholder="SSCC..." tabindex="1" />
                <label class="lg-lbl-da lbl-esito"></label>
            </div>
            <%--  --%>
            <div class="div-info w3-hide">
                <label class="Cd_xMOMatricola"></label>
                <div class="w3-row lg-mt-5">
                    <label class="lg-lbl-da">ARTICOLO</label><label class="ar-aa lg-lbl-da w3-small lg-ml-8"></label><br />
                    <input name="Cd_AR" type="text" class="lg-input" style="width: 150px" tabindex="2" disabled="disabled" />
                    <%--<img searchkey="Cd_AR" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />--%>
                    <img class="detail-giacubi mo-pointer w3-right w3-margin-right" title="Giacenza dell'articolo" src="icon/Scatola.svg" style="width: 1.6em" />
                </div>
                <div class="div-lotto">
                    <label class="lg-lbl-da">LOTTO</label><br />
                    <input name="Cd_ARLotto" type="text" class="lg-input" style="width: 130px" tabindex="3" disabled="disabled" />
                    <%--<img searchkey="Cd_ARLotto" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />--%>
                </div>
                <div class="div-qtaum">
                    <label class="lg-lbl-da">QUANTITA</label><br />
                    <input name="Quantita" type="number" class="lg-input w3-right-align" style="width: 150px" onfocus="Quantita_Onfocus();" tabindex="4" disabled="disabled" />
                    <select name="Cd_ARMisura" class="lg-input" style="width: 60px;" disabled="disabled">
                    </select><br />
                    <label class="lg-lbl-da">Giacenza Contabile:&nbsp;</label><label class="Quantita lg-lbl-da"></label>
                </div>
                <div class="div-mgp div-accordion lg-mt-5">
                    <div class="header mo-intestazione">
                        <label>MAGAZZINO PARTENZA&nbsp;</label>
                        <img class="icon lg-iupdown mo-pointer w3-right" src="icon/ArrowUp.svg" state="up" />
                        <label class="cd_mg_p w3-right w3-margin-right"></label>
                    </div>
                    <div class="content">
                        <label class="lg-lbl-da">MAGAZZINO PARTENZA</label><br />
                        <input name="Cd_MG_P" type="text" class="input-label lg-input" style="width: 80px" tabindex="5" disabled="disabled" />
                        <%--<img searchkey="Cd_MG_P" searchtitle="Magazzino di Partenza" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />--%>
                        <br />
                        <div class="div-mgubip">
                            <label class="lg-lbl-da">UBICAZIONE MAGAZZINO</label><br />
                            <input name="Cd_MGUbicazione_P" type="text" class="lg-input" style="width: 180px" tabindex="6" disabled="disabled" />
                            <%--<img searchkey="Cd_MGUbicazione_P" searchtitle="Ubicazione di Partenza" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />--%>
                        </div>
                    </div>
                </div>
                <div class="div-mga div-accordion lg-mt-5">
                    <div class="header mo-intestazione">
                        <label>MAGAZZINO ARRIVO&nbsp;</label>
                        <img class="icon lg-iupdown mo-pointer w3-right" src="icon/ArrowUp.svg" state="up" />
                        <label class="cd_mg_a w3-right w3-margin-right"></label>
                    </div>
                    <div class="content">
                        <label class="lg-lbl-da">MAGAZZINO ARRIVO</label><br />
                        <input name="Cd_MG_A" type="text" class="input-label lg-input" style="width: 80px" tabindex="7" />
                        <img searchkey="Cd_MG_A" searchtitle="Magazzino di Arrivo" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                        <br />
                        <div class="div-mgubia">
                            <label class="lg-lbl-da">UBICAZIONE MAGAZZINO</label><br />
                            <input name="Cd_MGUbicazione_A" type="text" class="first-focus lg-input" style="width: 180px" tabindex="8" />
                            <img searchkey="Cd_MGUbicazione_A" searchtitle="Ubicazione di Arrivo" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                            <br />
                            <label class="container lg-mt-5 lg-mr-6">
                                <label class="">Ubicazione Completa</label>
                                <input class="ck-xMOCompleta" type="checkbox" style="position: absolute;" tabindex="9" />
                                <span class="checkmark"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="w3-row w3-center lg-mt-15">
                    <button class="lg-btn-white mo-pointer lg-mt-5" onclick="Ajax_xmosp_xMOTR_To_MGMov_Save();" tabindex="10">Salva</button>
                    <button class="lg-btn-white mo-pointer lg-mt-5" onclick="GoHome();" tabindex="11">Esci</button>
                </div>
            </div>
        </div>
    </div>

    <%-- #1.3000 pgINTMG_MAT (INTERROGAZIONE MAGAZZINO PER MATRICOLA) --%>
    <div id="pgINTMG_MAT" class="mo-page w3-container">
        <div class="mo-intestazione" style="padding: 2px 4px;">
            <label class="Id_xMOTR w3-right"></label>
            <label class="Id_xMOTRRig_P w3-right w3-hide"></label>
            <label>INTERROGAZIONE MAGAZZINO PER MATRICOLA&nbsp;</label>
        </div>
        <div class="div-sscc lg-mb-5">
            <label class="lg-lbl-da">MATRICOLA&nbsp;</label><label class="Cd_xMOMatricola"></label><br />
            <input name="Cd_xMOMatricola" class="first-focus lg-input lg-mr-6" type="text" placeholder="SSCC..." />

            <label class="lg-lbl-da lbl-esito"></label>
        </div>
        <div class="div-infosscc" style="font-size: 1.1em;">
            <label class="Attiva"></label>
            <img class="AttivaIcon w3-right" src="" style="width: 60px; height: auto;" />
            <br />
            <label class="lg-lbl-da">ARTICOLO:</label><br />
            <label class="Cd_AR"></label>
            <br />
            <label class="lg-lbldescrizione AR_Descrizione info-ext"></label>
            <br />
            <label class="lg-lbl-da">LOTTO:</label><br />
            <label class="Cd_ARLotto"></label>
            <label class="DataScadenza">Nessuna Data Scadenza</label>
            <br />
            <label class="lg-lbl-da">QUANTITA:</label><br />
            <label class="QtaEvadibile"></label>
            <label class="Cd_ARMisura"></label>
            <br />
            <label class="lg-lbl-da">MAGAZZINO:</label><br />
            <label class="Cd_MG"></label>
            <br />
            <label class="lg-lbl-da">UBICAZIONE:</label><br />
            <label class="Cd_MGUbicazione"></label>
            <br />
            <div class="div-linea">
                <label class="lg-lbl-da">LINEA:</label><br />
                <label class="Cd_xMOLinea"></label>
            </div>
        </div>
    </div>

    <%-- #1.3100 pgINTMG_AR (INTERROGAZIONE MAGAZZINO PER ARTICOLO) --%>
    <div id="pgINTMG_AR" class="mo-page w3-container">
        <div class="div-filtri div-accordion">
            <div class="header mo-intestazione">
                <label class="">SITUAZIONE MAGAZZINO PER ARTICOLO&nbsp;</label>
                <img class="icon lg-iupdown mo-pointer w3-right" src="icon/ArrowUp.svg" state="up" />
                <img class="mo-pointer w3-margin-right w3-right lg-mr-6 lg-mt-2" onclick="pgINTMG_AR_UI();" title="Reset dei campi" src="icon/AggiornaWhite.svg" style="width: 17px;" />
            </div>
            <div class="content">
                <%-- ARTICOLO --%>
                <div>
                    <label class="lg-lbl-da">ARTICOLO&nbsp;</label><label class="ar-aa lg-lbl-da w3-small lg-ml-8"></label><br />
                    <input name="Cd_AR" type="text" class="first-focus lg-input save-focus" style="width: 60%" tabindex="1" />
                    <img searchkey="Cd_AR" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                    <label name="AR_Descrizione" class="lg-lbl-da descrizione info-ext" style="display: block;"></label>
                </div>

                <%-- MG --%>
                <div class="div-mg">
                    <label class="lg-lbl-da">MAGAZZINO</label><br />
                    <input name="Cd_MG" type="text" class="input-label lg-input save-focus" style="width: 80px" tabindex="2" />
                    <img searchkey="Cd_MG" searchtitle="Magazzini" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                </div>

                <%-- UBICAZIONE --%>
                <div class="div-mgubi">
                    <label class="lg-lbl-da">UBICAZIONE</label><br />
                    <input name="Cd_MGUbicazione" type="text" class="input-label lg-input save-focus" style="width: 180px" tabindex="3" />
                    <img searchkey="Cd_MGUbicazione" searchtitle="Ubicazioni" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                </div>
                <%-- BTN CONFERMA --%>
                <div class="w3-row w3-center lg-mt-15">
                    <button class="btn-confirm lg-rlrigconfirm w3-margin-bottom" onclick="Confirm_INTMG_AR();" tabindex="4">Conferma</button>
                </div>
            </div>
        </div>
        <label class="filtri mo-bold w3-large w3-text-blue"></label>
        <label class="filtri info mo-bold w3-large w3-text-blue lg-displayblock w3-right-align"></label>
        <%-- TABELLA GIACENZE --%>
        <div class="div-giac" style="display: none;">
            <table class="mo-table lg-mt-5 w3-table">
                <thead>
                    <tr>
                        <th class="lg-lbl-da w3-small"></th>
                        <th class="lg-lbl-da w3-small AR">AR</th>
                        <%--<th class="w3-small Descrizione cl-ardesc">Descrizione</th>--%>
                        <th width="100%" class="lg-lbl-da th-rolling w3-small" roll="Cd_ARLotto">LOTTO</th>
                        <th width="100%" class="lg-lbl-da th-rolling w3-small" roll="Cd_DOSottoCommessa">COMMESSA</th>
                        <!-- <th class="lg-lbl-da w3-small w3-center">UM</th> -->
                        <th class="lg-lbl-da w3-small w3-right-align">QTA
                            <label class="switch w3-right">
                                <input class="ck-qtapos" type="checkbox" onclick="Confirm_INTMG_AR();" />
                                <span class="slider round"></span>
                            </label>
                        </th>
                        <%--<th class="lg-lbl-da w3-small w3-center">DIS</th>
                        <th class="lg-lbl-da w3-small w3-center">D.IMM</th>--%>
                    </tr>
                </thead>
                <tbody>
                    <tr class="template_mgubi w3-border-top lg-lightgray" style="display: none;">
                        <td class="lg-lbl-da w3-small MGUbi" style="font-weight: 500;"></td>
                        <td class="lg-lbl-da w3-small MG_Descrizione" colspan="5"></td>
                    </tr>
                    <tr class="template_ar w3-border-top" style="display: none;">
                        <td class="w3-small"></td>
                        <td class="w3-small Cd_AR AR"></td>
                        <%--<td class="w3-small Descrizione cl-ardesc"></td>--%>
                        <td class="w3-small Cd_ARLotto"></td>
                        <td class="w3-small Cd_DOSottoCommessa"></td>
                        <!-- <td class="w3-small w3-center Cd_ARMisura"></td> -->
                        <td class="w3-small w3-right-align Quantita"></td>
                        <%--<td class="w3-small w3-right-align QuantitaDisp"></td>
                        <td class="w3-small w3-right-align QuantitaDimm"></td>--%>
                    </tr>
                    <%-- template non nascosto perchè ci pensano le media query --%>
                    <tr class="template_ardesc w3-border-bottom tr-ardesc lg-lightgray" style="display: none;">
                        <td class="w3-small MGUbi"></td>
                        <td class="w3-small Descrizione" colspan="5"></td>
                    </tr>
                </tbody>
            </table>
            <label class="msg"></label>
            <div class="w3-row w3-center w3-margin-bottom lg-mt-15">
                <button class="btn-confirm lg-rlrigconfirm" onclick="pgINTMG_AR_UI();" tabindex="5">Interroga</button>
            </div>

        </div>
    </div>

    <%-- #1.3110 pgINTMG_UbiMat (INTERROGAZIONE MAGAZZINO PER UBICAZIONE-MATRICOLE) --%>
    <div id="pgINTMG_UbiMat" class="mo-page w3-container">
        <div class="div-filtri div-accordion">
            <div class="header mo-intestazione">
                <label class="">SITUAZIONE MAGAZZINO PER MATRICOLA&nbsp;</label>
                <img class="icon lg-iupdown mo-pointer w3-right" src="icon/ArrowUp.svg" state="up" />
                <img class="mo-pointer w3-margin-right w3-right lg-mr-6 lg-mt-2" onclick="pgINTMG_UbiMat_UI();" title="Reset dei campi" src="icon/AggiornaWhite.svg" style="width: 17px;" />
            </div>
            <div class="content">
                <%-- ARTICOLO --%>
                <div>
                    <label class="lg-lbl-da">ARTICOLO&nbsp;</label><label class="ar-aa lg-lbl-da w3-small lg-ml-8"></label><br />
                    <input name="Cd_AR" type="text" class="first-focus lg-input save-focus" style="width: 60%" tabindex="1" />
                    <img searchkey="Cd_AR" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                    <label name="AR_Descrizione" class="lg-lbl-da descrizione info-ext" style="display: block;"></label>
                </div>

                <%-- MG --%>
                <div class="div-mg">
                    <label class="lg-lbl-da">MAGAZZINO</label><br />
                    <input name="Cd_MG" type="text" class="input-label lg-input save-focus" style="width: 80px" tabindex="2" />
                    <img searchkey="Cd_MG" searchtitle="Magazzini" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                </div>

                <%-- UBICAZIONE --%>
                <div class="div-mgubi">
                    <label class="lg-lbl-da">UBICAZIONE</label><br />
                    <input name="Cd_MGUbicazione" type="text" class="input-label lg-input save-focus" style="width: 180px" tabindex="3" />
                    <img searchkey="Cd_MGUbicazione" searchtitle="Ubicazioni" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                </div>

                <%-- MATRICOLA --%>
                <div>
                    <label class="lg-lbl-da">MATRICOLA&nbsp;</label><label class="ar-aa lg-lbl-da w3-small lg-ml-8"></label><br />
                    <input name="Cd_xMOMatricola" type="text" class="lg-input save-focus" style="width: 60%" tabindex="4" />
                </div>

                <%-- BTN CONFERMA --%>
                <div class="w3-row w3-center w3-margin-bottom lg-mt-15">
                    <button class="btn-confirm lg-rlrigconfirm" onclick="Confirm_INTMG_UbiMat();" tabindex="5">Conferma</button>
                </div>
            </div>
        </div>
        <label class="filtri mo-bold w3-large w3-text-blue"></label>
        <%-- TABELLA GIACENZE --%>
        <div class="div-giac" style="display: none;">
            <table class="mo-table lg-mt-5 w3-table">
                <tr>
                    <th class="lg-lbl-da w3-small"></th>
                    <th class="lg-lbl-da w3-small AR">AR</th>
                    <th class="lg-lbl-da w3-small w3-center">MATRICOLA</th>
                    <%--<th class="w3-small Descrizione cl-ardesc">Descrizione</th>--%>
                    <th class="lg-lbl-da w3-small w3-center">LOTTO</th>
                    <%--<th class="lg-lbl-da w3-small w3-center">UM</th>--%>
                    <th class="lg-lbl-da w3-small w3-center">QTA</th>
                    <%--<th class="lg-lbl-da w3-small w3-center">DIS</th>
                    <th class="lg-lbl-da w3-small w3-center">D.IMM</th>--%>
                </tr>
                <tr class="template_mgubi w3-border-top" style="display: none;">
                    <td class="lg-lbl-da w3-small MGUbi" colspan="6" style="font-weight: 500;"></td>
                </tr>
                <tr class="template_ar w3-border-top" style="display: none;">
                    <td class="w3-small"></td>
                    <td class="w3-small Cd_AR AR"></td>
                    <td class="w3-small w3-text-green Cd_xMOMatricola"></td>
                    <%--<td class="w3-small Descrizione cl-ardesc"></td>--%>
                    <td class="w3-small Cd_ARLotto"></td>
                    <%--<td class="w3-small Cd_ARMisura"></td>--%>
                    <td class="w3-small w3-right-align Quantita"></td>
                    <%--<td class="w3-small w3-right-align QuantitaDisp"></td>
                    <td class="w3-small w3-right-align QuantitaDimm"></td>--%>
                </tr>
                <%-- template non nascosto perchè ci pensano le media query --%>
                <tr class="template_ardesc w3-border-bottom tr-ardesc" style="display: none;">
                    <td class="w3-small MGUbi"></td>
                    <td class="w3-small Descrizione" colspan="5"></td>
                </tr>
            </table>
            <label class="msg"></label>
            <div class="w3-row w3-center w3-margin-bottom lg-mt-15">
                <button class="btn-confirm lg-rlrigconfirm" onclick="pgINTMG_UbiMat_UI();" tabindex="5">Interroga</button>
            </div>

        </div>
    </div>

    <%-- #1.3200 pgTRMP_P (TRASFERIMENTO MP IN PRODUZIONE: ELENCO DEI PADRI DA PRODURRE) --%>
    <div id="pgTRMP_P" class="mo-page w3-container">
        <div class="div-accordion">
            <div class="header mo-intestazione">
                <label class="">ELENCO P DEI DOC. DI PRODUZIONE</label>
            </div>
        </div>
        <div class="filtri">
            <!-- Linee -->
            <div>
                <div class="linee w3-bar w3-padding w3-small">
                    <div class="template w3-bar-item w3-button w3-blue" style="display: none;">Linea</div>
                </div>
                <input type="hidden" name="Cd_xMOLinea" onchange="Ajax_xmofn_DORig_GetP()" />
            </div>
            <!-- Cerca -->
            <input type="text" name="Query" class="lg-input first-focus" placeholder="Cerca... (Articolo, Testa, Riga)" />
        </div>
        <%-- TABELLA P DA PRODURRE --%>
        <div class="da-produrre">
            <%-- content lg-table w3-table w3-striped lg-mt-5  --%>
            <table class="tbl-arlist lg-table w3-table w3-striped lg-mt-5">
                <thead>
                    <tr class="w3-padding">
                        <th class="lg-lbl-da">OLN</th>
                        <%--<th class="lg-lbl-da w3-center">LINEA</th>--%>
                        <th class="lg-lbl-da">AR</th>
                        <th class="lg-lbl-da Descrizione cl-ardesc">DESCRIZIONE</th>
                        <th class="lg-lbl-da w3-center mo-pointer">QUANTITA</th>
                        <th class="lg-lbl-da w3-center">UM</th>
                        <th class="lg-lbl-da w3-center"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="template mo-pointer" style="display: none;">
                        <td class="lg-font-07em DocRif"></td>
                        <%--<td class="lg-font-07em Cd_xMOLinea"></td>--%>
                        <td class="lg-font-06em Cd_AR"></td>
                        <td class="lg-font-06em Descrizione cl-ardesc"></td>
                        <td class="lg-font-06em w3-right-align Quantita"></td>
                        <td class="lg-font-06em w3-center Cd_ARMisura"></td>
                        <td class="lg-font-07em w3-center InCarico">
                            <img class="" src="icon/Avatar.svg" style="height: 25px;" />
                        </td>
                    </tr>
                    <%-- template non nascosto perchè ci pensano le media query --%>
                    <tr class="template_ARDesc" style="display: none;">
                        <td class="lg-font-07em Descrizione" colspan="5"></td>
                    </tr>
                </tbody>
            </table>
            <label class="msg"></label>
        </div>
    </div>

    <%-- #1.3300 pgTRMP_C_AR (TRASFERIMENTO MP IN PRODUZIONE: ELENCO DELLE MP DA TRASFERIRE) --%>
    <div id="pgTRMP_C_AR" class="mo-page w3-container">
        <%-- Elenco dei componenti--%>
        <div class="TRMP_C">
            <div class="header mo-intestazione">
                <label id="lblP" class="">COMPONENTI</label>
                <img class="mo-pointer w3-right" style="width: 18px;" src="icon/Aggiorna.svg" onclick="Ajax_xmofn_DORig_GetC();" />
            </div>
            <div class="filtri">
                <!-- Cerca -->
                <input type="text" name="Query" class="lg-input first-focus" placeholder="Cerca... (Articolo)" />
            </div>
            <div class="lg-mt-5">
                <label class="switch w3-right">
                    <input class="ck-all" type="checkbox" onclick="pgTRMP_C_AR_All($(this).prop('checked'));" />
                    <span class="slider round"></span>
                </label>
                <label class="lg-lbl-da w3-right w3-margin-right">Tutti:</label>
            </div>
            <%-- TABELLA C DA TRASFERIRE IN PRODUZIONE --%>
            <table class="content lg-table w3-table w3-striped lg-mt-30">
                <tr class="w3-padding">
                    <th class="lg-lbl-da">AR</th>
                    <th class="lg-lbl-da Descrizione cl-ardesc">DESCRIZIONE</th>
                    <th class="lg-lbl-da th-rolling" roll="Cd_ARLotto">LOTTO</th>
                    <th class="lg-lbl-da th-rolling" roll="Cd_MG">Mg</th>
                    <th class="lg-lbl-da th-rolling" roll="Cd_MGUbicazione">Ubicaz.</th>
                    <th class="lg-lbl-da w3-center">QUANTITA</th>
                    <th class="lg-lbl-da w3-center">UM</th>
                    <th class="lg-lbl-da w3-center"></th>
                </tr>
                <tr class="template mo-pointer" style="display: none;">
                    <td class="lg-font-06em Cd_AR"></td>
                    <td class="lg-font-06em Descrizione cl-ardesc"></td>
                    <td class="lg-font-06em Cd_ARLotto"></td>
                    <td class="lg-font-06em Cd_MG"></td>
                    <td class="lg-font-06em Cd_MGUbicazione"></td>
                    <td class="lg-font-06em w3-right-align Quantita"></td>
                    <td class="lg-font-06em w3-center Cd_ARMisura"></td>
                    <td class="lg-font-06em w3-center InCarico">
                        <img class="" src="icon/Avatar.svg" style="height: 25px;" />
                    </td>
                </tr>
                <%-- template non nascosto perchè ci pensano le media query --%>
                <tr class="template_ARDesc" style="display: none;">
                    <td class="lg-font-07em Descrizione" colspan="5"></td>
                </tr>
            </table>
            <label class="msg"></label>
        </div>
        <%--Dati per il trasferimento--%>
        <div class="TRMP_AR">
            <div class="header mo-intestazione">
                <label class="tra-cxp-title">TRASFERIMENTO</label>
                <img class="ele-c mo-pointer w3-right" src="icon/MenuWhite.svg" style="width: 17px;" onclick="pgTRMP_C_AR_Show()" />
            </div>
            <div class="" style="font-size: 1em;">
                <p>
                    <label style="color: #535353;">PADRE</label>
                    <br />
                    <label class="Cd_AR_P"></label>
                    <label class="Ds_AR_P"></label>
                    <label class="Qta_P w3-right"></label>
                </p>
                <p>
                    <label style="color: #535353;">COMPONENTE</label>
                    <br />
                    <label class="Cd_AR_C"></label>
                    <label class="Ds_AR_C"></label>
                    <label class="Qta_C w3-right"></label>
                    <br />
                    <label>LOTTO:&nbsp;</label>
                    <label class="Cd_ARLotto"></label>
                    <label class="DataScadenza"></label>
                    <img class="detail-giacubi mo-pointer w3-right w3-margin-right" title="Giacenza dell'articolo" src="icon/Scatola.svg" style="width: 1.6em" />
                </p>
                <p>
                    <label>MAGAZZINO:</label><label class="Cd_MG_P"></label>
                    <br />
                    <label class="w3-text-green" style="font-size: 1.2em">UBICAZIONE&nbsp;</label><label class="Cd_MGUbicazione_P w3-text-green" style="font-size: 1.2em"></label>
                </p>
                <p>
                    <label class="lg-lbl-da">SSCC</label>
                    <input name="Cd_xMOMatricola" type="text" class="lg-input first-focus" tabindex="1" />
                </p>
                <p>
                    <label class="lg-lbl-da">LINEA&nbsp;</label><label class="Cd_xMOLinea w3-right"></label><br />
                    <input name="Cd_xMOLinea" type="text" class="lg-input" tabindex="2" />
                </p>
                <label class="lg-lbl-da lbl-esito"></label>
                <div class="div-btnarrow w3-row w3-center w3-margin-top">
                    <div class="w3-row btn-slideshow lg-arrow-border lg-floatleft mo-pointer" style="width: 49%; margin-top: 10px; margin-right: 1%;" data-slide="left">
                        <img class="mo-pointer" style="width: 1.8em; height: 1.8em;" src="icon/BackBlue.svg" />
                    </div>
                    <div class="w3-row btn-slideshow lg-arrow-border lg-floatleft mo-pointer lg-mt-5" style="width: 49%; margin-top: 10px;" data-slide="right">
                        <img class="mo-pointer" style="width: 1.8em; height: 1.8em;" src="icon/AvantiBlue.svg" />
                    </div>
                </div>
                <%--<div class="w3-row w3-center w3-margin-bottom w3-margin-top" style="font-size: 0.8em;">
                    <button class="lg-btn-blue lg-traconfirm" onclick="Ajax_xmosp_xMOTRRig_P_To_MGMov_Save();" tabindex="3">Prossimo Pallet &gt;</button>
                    <button class="lg-btn-white lg-tranextar" onclick="pgTRMP_C_Next_AR();">Prossimo Articolo &gt;</button>
                </div>--%>
            </div>
        </div>
    </div>

    <%-- #1.3400 pgTRRM (TRASFERIMENTO PER RIENTRO MP DA PRODUZIONE) --%>
    <div id="pgTRRM" class="mo-page w3-container">
        <div class="mo-intestazione" style="padding: 2px 4px;">
            <label>RIENTRO COMPONENTI DA PRODUZIONE</label>
            <label class="Id_xMOTRRig_P"></label>
            <label class="container w3-right w3-margin-right">
                <label class="lg-lblautoconfirm">Conf. automatica</label>
                <input class="ck-autoconfirm" type="checkbox" onclick="SetAutoConfirm(); SetFocus();" style="position: absolute;" />
                <span class="checkmark"></span>
            </label>
        </div>
        <div class="div-linea">
            <div>
                <div class="linee w3-bar w3-padding w3-small">
                    <div class="template w3-bar-item w3-button w3-blue" style="display: none;">Linea</div>
                </div>
            </div>
            <p>
                <label class="lg-lbl-da">LINEA&nbsp;</label><br />
                <input name="Cd_xMOLinea" type="text" class="lg-input" tabindex="2" disabled="disabled" />
            </p>
            <p>
                <label class="lg-lbl-da">MATRICOLA</label>
                <input name="Cd_xMOMatricola" type="text" class="lg-input first-focus" tabindex="1" />
            </p>
            <label class="lg-lbl-da msg"></label>
        </div>
        <div class="div-dati">
            <label class="Cd_xMOMatricola"></label>
            <br />
            <p>
                <label class="Cd_AR"></label>
                <input name="Cd_AR" type="text" class="lg-input w3-hide" />
                <br />
                <label class="lg-lbldescrizione AR_Descrizione info-ext"></label>
            </p>
            <p>
                <label class="Cd_ARLotto"></label>
                <label class="DataScadenza"></label>
            </p>
            <div class="div-qtaum">
                <label class="lg-lbl-da">QUANTITA</label><br />
                <input name="Quantita" type="number" step="0.001" min="0" class="lg-input w3-right-align" style="width: 35%" tabindex="3" onfocus="Quantita_Onfocus($(this));" />
                <select name="Cd_ARMisura" class="lg-input" style="width: 60px;" tabindex="4"></select>
                <label class="lg-lbllink mo-pointer" name="SetEdit" onclick="pgTRRM_Set_Edit(true)">Modifica</label>
            </div>
            <label>MAGAZZINO:</label><label class="Cd_MG_A"></label>
            <div class="div-mgubia w3-margin-top">
                <label class="w3-text-green" style="font-size: 1.2em">UBICAZIONE&nbsp;</label><label class="Cd_MGUbicazione_A w3-text-green" style="font-size: 1.2em"></label>
                <img class="mo-pointer w3-right" style="height: 1.6em; width: auto; margin-right: 8px;" src="icon/Refresh.svg" onclick="Ajax_xmosp_xMOTRRig_T_RicercaUbicazione_Escludi();" />
                <br />
                <input name="Cd_MGUbicazione_A" type="text" class="lg-input first-focus" tabindex="5" />
            </div>
            <label class="container lg-mt-5 lg-mr-6">
                <label class="">Ubicazione Completa</label>
                <input class="ck-xMOCompleta" type="checkbox" style="position: absolute;" tabindex="6" />
                <span class="checkmark"></span>
            </label>
            <%-- BTN --%>
            <div class="w3-row w3-center w3-margin-bottom w3-margin-top">
                <button class="lg-btn-blue lg-traconfirm" onclick="Ajax_xmosp_TRRM_xMOTRRig_A_MGMovInt_Save();" tabindex="7">Conferma</button>
                <button class="lg-btn-white lg-traconfirm" onclick="pgTRRM_UI();" tabindex="8">Annulla</button>
            </div>
        </div>

    </div>

    <%-- #1.3500 pgGENCARICHI (GENERAZIONE CARICHI DI PRODUZIONE PER LE MATRICOLE DEI P PRODOTTI SULLE LINEE DI PROD) --%>
    <div id="pgGENCARICHI" class="mo-page w3-container">
        <div class="mo-intestazione" style="padding: 2px 4px;">
            <label>GEN. CARICHI DI PROD.</label>
            <label class="container w3-right w3-margin-right">
                <label class="lg-lblautoconfirm">Conf. automatica</label>
                <input class="ck-autoconfirm" type="checkbox" onclick="SetAutoConfirm(); SetFocus();" style="position: absolute;" />
                <span class="checkmark"></span>
            </label>
        </div>
        <div class="div-linea">
            <div>
                <div class="linee w3-bar w3-padding w3-small">
                    <div class="template w3-bar-item w3-button w3-blue" style="display: none;">Linea</div>
                </div>
            </div>
            <div>
                <label class="lg-lbl-da">LINEA</label><br />
                <input name="Cd_xMOLinea" type="text" class="lg-input first-focus" tabindex="1" />
            </div>
            <div>
                <label class="lg-lbl-da">MATRICOLA</label>
                <input name="Cd_xMOMatricola" type="text" class="lg-input" tabindex="2" />
            </div>
            <div data-key="EAN">
                <label class="lg-lbl-da">EAN CARTONE</label>
                <input name="EAN" type="text" class="lg-input" tabindex="3" />
            </div>
            <div class="w3-row w3-section">
                <div class="w3-col s5">
                    <div data-key="counter" data-display="Letture" class="info-ext w3-center" style="color: #5B89CB;"></div>
                </div>
                <div class="w3-col s7 w3-padding-small">
                    <button class="btn-confirm btn-confeubi lg-btn-white-full mo-pointer lg-mt-5" onclick="Ajax_xmosp_xMOMatricola_CPI_Validate(true);" tabindex="4">CONFERMA E UBICA</button><br />
                    <button class="btn-confirm btn-conferma lg-btn-white-full mo-pointer lg-mt-5" onclick="Ajax_xmosp_xMOMatricola_CPI_Validate(false);" tabindex="5">CONFERMA</button><br />
                </div>
            </div>
            <label class="lg-lbl-da log"></label>
            <br />
            <label class="lg-lbl-da msg"></label>
        </div>
    </div>

    <%-- #1.3600 pgINM2Aperti (INVENTARIO CONDIVISO: ELENCO INVENTARI APERTI) --%>
    <div id="pgINM2Aperti" class="mo-page lg-gray">
        <div class="w3-row w3-right w3-margin-bottom">
            <img class="mo-pointer w3-right w3-margin-right lg-mt-5" src="icon/Aggiorna.svg" onclick="Ajax_xmofn_xMOIN_Aperti_M2();" style="width: 1.8em; height: 1.8em;" />
            <img class="mo-pointer w3-right w3-margin-right lg-mt-5" onclick="oPrg.Pages[oPrg.PageIdx(enumPagine.pgINM2)].Enabled = true; Nav.Next();" src="icon/Add.svg" style="width: 1.8em; height: 1.8em;" />
        </div>
        <ul class="w3-ul lg-docapul lg-gray">
            <li id_xmoin="" class="template w3-bar mo-pointer w3-white" style="display: none;" data-action="false">
                <div class="w3-bar-item">
                    <span class="lg-tag w3-tag">INV</span>
                    <span class="id"></span><span>&nbsp;</span>
                    <%--<span class="cd_mgesercizio"></span>--%>
                    <span class="mges_descrizione"></span>
                    <br />
                    <span class="cd_mg"></span>
                    <br />
                    <span class="cd_mgubicazione"></span>
                    <br />
                    <span class="dataora"></span>
                    <br />
                    <span detail="false" class="detail-op lg-lbllink mo-pointer" onclick="$(this).attr('detail', 'true').parent().parent().attr('data-action', 'true');">Operatori</span>
                </div>
                <img delete="false" class="lg-doapdel lg-pointer w3-bar-item w3-right" onclick="$(this).attr('delete', 'true').parent().attr('data-action', 'true');" src="icon/EliminaGrigio.svg" />
                <img class="dastoricizzare lg-doapdel lg-pointer w3-bar-item w3-right" src="icon/CheckGreen.svg" />
            </li>
        </ul>
        <span class="msg"></span>
    </div>

    <%-- #1.3700 pgINM2 (INVENTARIO CONDIVISO: TESTA) --%>
    <div id="pgINM2" class="mo-page w3-container">
        <div class="mo-intestazione">
            <label>INVENTARIO CONDIVISO:</label>
            <label class="lb-doc-id lg-ml-15"></label>
            <div class="w3-dropdown-click w3-right">
                <img onclick="$('.info-content').toggle();" class="mo-pointer" src="icon/InfoWhite.svg" style="width: 1.3em; height: 1.3em;" />
                <div class="info-content w3-dropdown-content w3-bar-block w3-border w3-padding" onclick="$(this).hide();">
                    <span class="ubicazione lg-pl-4 lg-mr-6">
                        <input class="ck-ubicazione w3-check" type="checkbox" disabled="disabled" />
                        <label class="etichetta lg-lblstd">Gestione Ubicazione</label>
                    </span>
                    <br />
                    <span class="lotto lg-pl-4 lg-mr-6">
                        <input class="ck-lotto w3-check" type="checkbox" disabled="disabled" />
                        <label class="etichetta lg-lblstd">Gestione Lotto</label>
                    </span>
                    <br />
                    <span class="commessa lg-pl-4 lg-mr-6">
                        <input class="ck-commessa w3-check" type="checkbox" disabled="disabled" />
                        <label class="etichetta lg-lblstd">Gestione Commessa</label>
                    </span>
                </div>
            </div>
        </div>
        <div>
            <div>
                <label class="title lg-lbl-da">DESCRIZIONE</label>
                <br />
                <input name="Descrizione" type="text" class="lg-input" style="width: 70%;" />
            </div>
            <%-- Esercizio --%>
            <label class="lg-lbl-da">ESERCIZIO</label><br />
            <select name="Cd_MGEsercizio" class="lg-input">
            </select><br />
            <%-- Data --%>
            <div class="w3-row lg-mt-5">
                <label class="lg-lbl-da">DATA</label><br />
                <input name='DataOra' type="date" class="lg-input" style="width: 200px" />
            </div>
            <label class="lg-lbl-da">MAGAZZINO</label><br />
            <input name="Cd_MG" type="text" class="first-focus input-label lg-input" style="width: 80px" />
            <img searchkey="Cd_MG" searchtitle="Magazzino" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
            <div class="div-mgubi">
                <label class="lg-lbl-da">UBICAZIONE MAGAZZINO</label><br />
                <input name="Cd_MGUbicazione" type="text" class="lg-input" style="width: 180px" />
                <img searchkey="Cd_MGUbicazione" searchtitle="Ubicazione" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
            </div>
        </div>
    </div>

    <%-- #1.3800 pgINM2Rig (INVENTARIO CONDIVISO: LETTURE) --%>
    <div id="pgINM2Rig" class="mo-page w3-container">
        <div class="mo-intestazione" style="padding: 2px 4px;">
            <label>INVENTARIO</label>
            <label class="w3-right id_xmoin"></label>
        </div>
        <%-- INSERIMENTO RETTIFICA --%>
        <div class="div-insert">
            <div class="content div-mgubi">
                <label class="lg-lbl-da">MAGAZZINO</label><label>&nbsp;&nbsp;&nbsp;&nbsp;</label><label class="lg-lbl-da">UBICAZIONE</label><br />
                <input name="Cd_MG" type="text" class="input-label lg-input" style="width: 80px" disabled="disabled" />
                <input name="Cd_MGUbicazione" type="text" class="first-focus lg-input" style="width: 180px" tabindex="10" />
                <img searchkey="Cd_MGUbicazione" searchtitle="Ubicazione" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
            </div>
            <%-- BARCODE --%>
            <div class="div-barcode div-accordion lg-mt-5">
                <div class="header mo-intestazione">
                    <label>BARCODE</label>
                    <img class="icon lg-iupdown mo-pointer w3-right" src="icon/ArrowUp.svg" state="up" />
                    <img class="mo-pointer w3-margin-right w3-right lg-mr-6 lg-mt-2" onclick="pgINM2Rig_Clear();" title="Reset dei campi" src="icon/AggiornaWhite.svg" style="width: 17px;" />
                </div>
                <div class="content lg-mt-5">
                    <div class="barcode">
                        <select class="lg-input lg-select lg-mb-5" style="width: 80px;" onchange="Barcode_SelType();"></select>
                        <input name="xMOBarcode" class="first-focus lg-input lg-mr-6" type="text" placeholder="Barcode..." style="width: 70%;" onfocus="$(this).off( 'blur' );" tabindex="15" />
                    </div>
                </div>
            </div>
            <%-- ARTICOLO --%>
            <div>
                <label class="lg-lbl-da">ARTICOLO&nbsp;</label><label class="ar-aa lbl lg-lbl-da"></label><br />
                <input name="Cd_AR" type="text" class="first-focus lg-input" style="width: 170px;" tabindex="20" />
                <img searchkey="Cd_AR" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                <img class="detail-giacubi mo-pointer w3-right w3-margin-right" title="Giacenza dell'articolo" src="icon/Scatola.svg" style="width: 1.6em" />
                <label name="AR_Descrizione" class="lg-lbl-da descrizione info-ext" style="display: block;"></label>
                <br />
                <div>
                    <label class="lg-lblstd">Giac. Contabile:&nbsp;</label><label class="GiacContabile lg-lblstd"></label>
                    <label class="lg-lblstd giacmat">Giac. Matricola:&nbsp;</label><label class="GiacMatricola giacmat lg-lblstd"></label>
                    <br />
                    <label class="lg-lblstd">Qta Rilevata OP:&nbsp;</label><label class="QtaRilevata_O lg-lblstd"></label>
                    <label class="lg-lblstd lg-ml-8">Qta Rilevata Tutti:&nbsp;</label><label class="QtaRilevata_T lg-lblstd"></label>
                </div>
            </div>
            <div class="div-qtaum">
                <label class="lg-lbl-da">QUANTITA</label><br />
                <img class="mod-somma mo-pointer lg-mr-6 attiva" onclick="pgINM2Rig_ModSommaToggleSrc($(this))" src="icon/PlusGreen.svg" style="width: 1.8em; height: 1.8em;" />
                <input name="QtaRilevata" type="number" step="0.001" min="0" class="lg-input w3-right-align" style="width: 35%" tabindex="30" onfocus="Quantita_Onfocus();" />
                <select name="Cd_ARMisura" class="lg-input" style="width: 60px;" tabindex="40">
                </select>
            </div>
            <%-- LOTTO --%>
            <div class="div-lotto">
                <label class="lg-lbl-da">LOTTO</label><br />
                <input name="Cd_ARLotto" type="text" class="lg-input" style="width: 130px" tabindex="50" />
                <img searchkey="Cd_ARLotto" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
            </div>
            <%-- COMMESSA --%>
            <div class="div-com">
                <label class="lg-lbl-da">SOTTOCOMMESSA</label><br />
                <input name="Cd_DOSottoCommessa" type="text" class="lg-input" style="width: 200px;" tabindex="60" />
                <img searchkey="Cd_DOSottoCommessa" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
            </div>
            <%-- MATRICOLA --%>
            <div class="div-mat">
                <label class="lg-lbl-da">MATRICOLA</label><br />
                <input name="Cd_xMOMatricola" class="lg-input lg-mr-6" type="text" style="width: 180px" tabindex="70" />
            </div>
            <div class="w3-center">
                <button class="btn-confirm lg-btn-white mo-pointer lg-mt-5" onclick="Confirm_xMOINM2Rig_AR();" tabindex="80">CONFERMA</button><br />
            </div>
        </div>
        <%-- ELENCO RETTIFICHE EFFETTUATE --%>
        <div class="div-table">
            <div class="mo-intestazione" style="padding: 2px 4px;">
                <label>RETTIFICHE EFFETTUATE</label>
            </div>
            <div class="lg-mt-8">
                <label class="switch w3-right">
                    <input class="ck-inm2rig" type="checkbox" onclick="Ajax_xmofn_xMOINRig_M2();" />
                    <span class="slider round"></span>
                </label>
                <label class="w3-right">Letture Operatore:&nbsp;</label>
            </div>
            <table class="lg-table w3-table w3-striped lg-mt-5">
                <tr>
                    <th class="lg-lbl-da">ARTICOLO</th>
                    <%--<th class="lg-lbl-da">LOTTO</th>--%>
                    <%--<th class="lg-lbl-da w3-center mo-pointer Cd_MGUbicazione">UBICAZIONE</th>--%>
                    <%--<th class="lg-lbl-da w3-center mo-pointer Cd_DOSottoCommessa">COMMMESSA</th>--%>
                    <th class="lg-lbl-da w3-center">RILEVATA</th>
                    <th class="lg-lbl-da w3-center">UM</th>
                </tr>
                <tr class="template" style="display: none;">
                    <td class="lg-font-07em Cd_AR"></td>
                    <%--<td class="lg-font-07em w3-right-align Cd_ARLotto"></td>--%>
                    <%--<td class="lg-font-07em w3-right-align Cd_MGUbicazione"></td>--%>
                    <%--<td class="lg-font-07em w3-right-align Cd_DOSottoCommessa"></td>--%>
                    <td class="lg-font-07em  w3-right-align QtaRilevata"></td>
                    <td class="w3-center Cd_ARMisura"></td>
                </tr>
                <%-- template non nascosto perchè ci pensano le media query --%>
                <tr class="template_ARDesc" style="display: none;">
                    <td class="lg-font-07em Descrizione" colspan="5"></td>
                </tr>
            </table>
        </div>
    </div>

    <%-- #1.3900 pgINM2Piede (INVENTARIO CONDIVISO: PIEDE) --%>
    <div id="pgINM2Piede" class="mo-page w3-container">
        <div class="mo-intestazione">
            <label>USCIRE DALL'INVENTARIO</label>
        </div>
        <div class="w3-row w3-margin-top">
            <label class="in-id w3-tag lg-tag w3-xlarge"></label>
            <label class="lg-rllbl w3-large">del </label>
            <label class="in-data lg-rllbl w3-large"></label>
        </div>
        <div class="w3-row lg-rlp-lbldo">
            <label class="in-desc w3-large"></label>
            <br />
            <label class="lg-rllbl w3-large">Esercizio:&nbsp;</label>
            <label class="lg-rllbl in-mgesercizio w3-large"></label>
        </div>
        <div class="w3-row">
            <label class="">MAGAZZINO:&nbsp;</label>
            <label class="in-cdmg"></label>
        </div>
        <div class="w3-center lg-mt-5">
            <div class="w3-row lg-mt-15">
                <button class="lg-btn-white mo-pointer lg-mt-5" onclick="Ajax_xmosp_xMOIN_Op_Save_M2(oPrg.Id_xMOINM2_Edit, oApp.Cd_Operatore); Nav.Next();">Esci</button>
            </div>
        </div>
    </div>


    <%-- #1.4000 pgCFARLIST (Listini CF/AR) --%>
    <div id="pgCFARLIST" class="mo-page w3-container">
        <div class="mo-intestazione" style="padding: 2px 4px;">
            <label>Listini Articolo</label>
        </div>
        <div class="w3-row">
            <label class="lg-lbl-da">CLIENTE/FORNITORE</label>
            <br />
            <input name="Cd_CF" type="text" class="first-focus lg-input" style="width: 100px;" />
            <label class="descrizione lg-lbldescrizione" name="CF_Descrizione"></label>
            <img searchkey="Cd_CF" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
        </div>
        <%-- articolo --%>
        <div class="w3-row">
            <label class="lg-lbl-da">ARTICOLO</label><label class="ar-aa lg-lbl-da w3-small lg-ml-8"></label><br />
            <input name="Cd_AR" type="text" class="first-focus lg-input" style="width: 140px" />
            <img searchkey="Cd_AR" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
            <label name="AR_Descrizione" class="lg-lbl-da descrizione info-ext" style="display: block;"></label>
        </div>
        <div class="w3-row w3-center w3-margin-bottom lg-mt-15">
            <button class="btn-confirm lg-rlrigconfirm" onclick="Ajax_xmofn_LSArticolo();">Mostra</button>
        </div>
        <div>
            <table class="lg-table w3-table lg-mt-5"></table>
        </div>
    </div>

    <%-- #1.4500 pgPRTRAttivita Produzione Avanzata - pagina select delle attività a cui trasferire le bolle --%>
    <div id="pgPRTRAttivita" class="mo-page w3-container">
        <div class="w3-container">
            <div class="mo-intestazione">
                <label class="">BOLLE DI LAVORAZIONE</label>
                <img class="mo-pointer w3-right lg-mr-6 lg-mt-2" onclick="Ajax_xmofn_xMOPRBLAttivita();" title="Aggiorna" src="icon/AggiornaWhite.svg" style="width: 17px;" />
            </div>
            <!-- Ricerca -->
            <div class="w3-row lg-mt-5">
                <input data-bind="SearchQuery" type="text" class="first-focus lg-input" style="width: 100%" placeholder="Cerca... (Id Bolla o F+Id Fase o Articolo)" onchange="PRTRAttivita_Load_Items()" />
            </div>
            <!-- Risorsa di produzione -->
            <div data-key="Filtri" class="w3-row lg-mt-5">
                <select data-bind="Cd_PrRisorsa" class="lg-input" style="width: 100%;" onchange="PRTRAttivita_Load_Items()">
                    <option value="" selected="selected">Seleziona risorsa di produzione</option>
                </select>
            </div>
            <!-- Filtri -->
            <div data-key="Filtri" class="w3-row lg-mt-5">
                <!-- Interne -->
                <div class="w3-col s6 d-flex items-center">
                    <label class="switch">
                        <input data-bind="Interne" class="ck-alt" type="checkbox" onclick="PRTRAttivita_Load_Items()" />
                        <span class="slider round"></span>
                    </label>
                    <span class="mo-ml-5">Interne</span>
                </div>
                <!-- Da trasferire -->
                <div class="w3-col s6 d-flex items-center">
                    <label class="switch">
                        <input data-bind="DaTrasferire" class="ck-alt" type="checkbox" onclick="PRTRAttivita_Load_Items()" />
                        <span class="slider round"></span>
                    </label>
                    <span class="mo-ml-5">Da trasferire</span>
                </div>
            </div>
        </div>
        <div class="lg-mt-5">
            <ul class="w3-ul">
                <li class="template w3-bar mo-pointer w3-white li-doc" style="display: none;">
                    <div>
                        <span data-bind="Id_PrBL" class="w3-tag mo-tag w3-blue"></span>
                        <span data-bind="Bolla" class="mo-font-darkblue"></span>
                        <br />
                        <span data-bind="Articolo" class="w3-small"></span>
                        <span data-bind="Descrizione" class="w3-small"></span>
                        <br />
                        <span data-bind="Id_PrBLAttivita" class="w3-tag mo-tag w3-green w3-small"></span>
                        <span data-bind="Cd_PrRisorsa" class="w3-center w3-small"></span>
                        <span data-bind="DataObiettivo" class="w3-right w3-small mo-font-darkgray"></span>
                    </div>
                </li>
            </ul>
        </div>
    </div>

    <%-- #1.4600 pgPRTRMateriale Produzione Avanzata - pagina trasferimento materiale --%>
    <div id="pgPRTRMateriale" class="mo-page w3-container">
        <!-- Riepilogo attivita -->
        <div class="w3-margin-top">
            <label class="w3-tag mo-tag w3-blue">BOLLA <span data-bind="Id_PrBL"></span></label>
            <label class="w3-tag mo-tag w3-green">FASE <span data-bind="Id_PrBLAttivita"></span></label>
        </div>
        <div data-key="Riepilogo" class="w3-row lg-mt-5">
            <div class="w3-col s12">
                <label data-bind="Bolla" class="mo-font-darkblue"></label>
                <label data-bind="Articolo"></label>
                <label data-bind="Qta" class="w3-right">100 pz</label>
            </div>
        </div>
        <!-- Materiali: Lista -->
        <div data-key="Lista">
            <div class="mo-intestazione">
                <label class="">MAT. DA TRA.</label>
            </div>
            <div class="mo-ofy-auto">
                <table data-key="Materiali" class="mo-table lg-mt-5 w3-table w3-bordered">
                    <thead>
                        <tr>
                            <th class="w3-small">AR</th>
                            <th class="w3-small th-rolling" roll="Cd_MGUbicazione">UBI.</th>
                            <th class="w3-small th-rolling" roll="Cd_ARLotto">LOTTO</th>
                            <th class="w3-small CF">QTA</th>
                            <th class="w3-small">UM</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="template-r1 mo-pointer" style="display: none;">
                            <td data-bind="Cd_AR" class="w3-small"></td>
                            <td data-bind="Cd_MGUbicazione" class="w3-small Cd_MGUbicazione"></td>
                            <td data-bind="Cd_ARLotto" class="w3-small Cd_ARLotto"></td>
                            <td data-bind="Qta" class="w3-small w3-right-align"></td>
                            <td data-bind="Cd_ARMisura" class="w3-small"></td>
                        </tr>
                        <tr class="template-r2 mo-pointer info-ext" style="display: none;">
                            <td data-bind="AR_Descrizione" colspan="5" class="w3-small w3-light-gray"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div data-key="Piede" class="w3-row lg-mt-5 w3-margin-top">
                <div class="mo-intestazione">
                    <label class="">Note</label>
                </div>
                <div class="w3-col s12 mo-mt-8 w3-margin-bottom">
                    <label data-bind="NoteBL" class="" style="width: 100%"></label>
                </div>
            </div>
        </div>
        <!-- Materiali: Trasferimento -->
        <div data-key="Trasferimento" style="display: none;">
            <div class="mo-intestazione mo-pointer">
                <label>TRASFERIMENTO</label>
                <img class="mo-pointer w3-right" src="icon/MenuWhite.svg" style="width: 17px;" onclick="PRTRMateriali_Load()" />
            </div>
            <div class="w3-row">
                <div class="w3-col s12">
                    <label data-bind="Cd_AR" class="mo-h4 mo-font-darkblue mo-bold lbl"></label>
                    <input type="hidden" name="Cd_AR" />
                    <label data-bind="Descrizione" class="mo-font-darkblue mo-bold lbl w3-small"></label>
                </div>
                <div class="w3-col s12">
                    <label class="mo-font-darkblue lbl">LOTTO:</label>
                    <label data-bind="Cd_ARLotto" class="mo-font-darkblue mo-bold lbl"></label>
                </div>
                <div class="w3-col s12 w3-margin-bottom">
                    <label class="lg-lbl-da">QUANTITA</label>
                    <br />
                    <input data-bind="QtaRilevata" name="QtaRilevata" type="number" class="lg-input w3-right-align" style="width: 30%;" onfocus="Quantita_Onfocus();" tabindex="10" />
                    <select data-bind="Cd_ARMisura" name="Cd_ARMisura" class="lg-input" style="width: 60px;" tabindex="20"></select>
                    <input data-bind="FattoreToUM1" type="hidden" />
                </div>
                <div class="w3-col s12 mo-mt-8">
                    <label class="lbl">PARTENZA</label><br />
                </div>
                <div class="w3-col s6">
                    <label class="mo-font-darkblue lbl">MG:</label>
                    <label data-bind="Cd_MG_P" class="mo-font-darkblue mo-bold lbl"></label>
                </div>
                <div class="w3-col s6">
                    <label class="mo-font-darkblue lbl">UBI:</label>
                    <label data-bind="Cd_MGUbicazione_P" class="mo-font-darkblue mo-bold w3-tag w3-yellow lbl"></label>
                    <img class="detail-giacubi mo-pointer w3-right w3-margin-right" title="Giacenza dell'articolo" src="icon/Scatola.svg" style="width: 1.6em" />
                </div>
                <div class="w3-col s12 mo-mt-3">
                    <label class="lbl">ARRIVO</label><br />
                </div>
                <div class="w3-col s12">
                    <label class="mo-font-darkblue lbl">MG:</label>
                    <label data-bind="Cd_MG_A" class="mo-font-darkblue mo-bold lbl"></label>
                </div>
                <%--                <div class="w3-col s6">
                    <label class="mo-font-darkblue lbl">UBI:</label>
                    <label data-bind="Cd_MGUbicazione_A" class="mo-font-darkblue mo-bold lbl"></label>
                </div>--%>
                <div class="w3-col s12 mo-mt-8">
                    <label class="lbl">Risorsa</label>
                    <label data-bind="Cd_PrRisorsa" class="lbl w3-margin-left w3-tag mo-tag w3-orange"></label>
                </div>
                <div class="w3-col s12 mo-mt-8 w3-margin-bottom">
                    <label class="lbl">NOTE</label>
                    <textarea data-bind="Note" class="lg-input" style="width: 100%" tabindex="40"></textarea>
                </div>
                <div class="w3-col s12">
                    <div class="w3-row w3-center w3-margin-bottom">
                        <button class="btn-confirm w3-button w3-round-medium w3-large w3-green mo-mt-20" onclick="Ajax_xmosp_xMOPRTRMateriale_Save()" tabindex="50">CONFERMA</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <%-- #1.4700 pgCHS00012 --%>
    <div id="pgCHS00012" class="mo-page w3-container">
        <!-- Selezione Lotto -->
        <div class="w3-row" data-key="SelLotto" style="display: none;">
            <div class="w3-col s12 mo-intestazione">SELEZIONA LOTTO DI CARICO</div>
            <div class="w3-col s12 w3-margin-top">
                <label class="lg-lbl-da" style="display: block;">LOTTO</label>
                <input name="Cd_ARLotto" type="text" class="lg-input" style="width: 140px;" />
                <img searchkey="Cd_ARLotto" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                <label name="ARLotto_Descrizione" class="lg-lbl-da descrizione info-ext" style="display: block;"></label>
            </div>
            <div class="w3-col s12 w3-margin-top">
                <label class="lg-lbl-da" style="display: block;">ARTICOLO</label>
                <input name="Cd_AR" type="text" class="lg-input" style="width: 140px" />
                <img searchkey="Cd_AR" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                <label name="AR_Descrizione" class="lg-lbl-da descrizione info-ext" style="display: block;"></label>
            </div>
            <div class="w3-col s12 w3-margin-top w3-margin-bottom" style="text-align: center;">
                <button class="btn-confirm" data-key="Annulla">Annulla</button>
                <button class="btn-confirm" data-key="Seleziona">Seleziona</button>
            </div>
        </div>
        <!-- Intestazione -->
        <div class="" data-key="Intestazione">
            <div class="w3-col s12 mo-intestazione lg-mb-8">
                INTESTAZIONE
                <img class="mo-pointer w3-margin-right w3-right lg-mr-6 lg-mt-2" data-key="Refresh" title="Aggiorna i dati" src="icon/AggiornaWhite.svg" style="width: 17px;" />
            </div>
            <label class="lg-lbl-da lg-font-07em" style="margin-right: 5px;">LOTTO: <span data-key="Cd_ARLotto" style="font-weight: bold;"></span></label>
            <label class="lg-lbl-da lg-font-07em" style="margin-right: 5px;">ARTICOLO: <span data-key="Cd_AR" style="font-weight: bold;"></span></label>
            <label class="lg-lbl-da lg-font-07em" style="margin-right: 5px;">QTA: <span data-key="Quantita" style="font-weight: bold;"></span></label>
            <button class="btn-confirm w3-right" data-key="NuovoLotto">Nuovo Lotto di Carico</button>
            <button class="btn-confirm w3-right w3-margin-right" data-key="Rettifica">Rettifica</button>
        </div>
        <!-- Nuova Riga -->
        <div class="w3-row" data-key="NuovaRiga" style="display: none;">
            <div class="w3-col s12 mo-intestazione">NUOVA SCELTA / PALLET</div>
            <div class="w3-col s12 w3-margin-top">
                <label class="lg-lbl-da" style="display: block;">ARTICOLO</label>
                <input name="Cd_AR" type="text" class="lg-input" style="width: 140px" />
                <img searchkey="Cd_AR" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                <label name="AR_Descrizione" class="lg-lbl-da descrizione info-ext" style="display: block;"></label>
            </div>
            <div class="w3-col s12 w3-margin-top">
                <label class="lg-lbl-da" style="display: block;">PALLET</label>
                <input name="PackListRef" type="text" class="lg-input" style="width: 140px" />
            </div>
            <div class="w3-col s12 w3-margin-top w3-margin-bottom" style="text-align: center;">
                <button class="btn-confirm" data-key="Annulla">Annulla</button>
                <button class="btn-confirm" data-key="Inserisci">Inserisci</button>
            </div>
        </div>
        <!-- Tabella -->
        <div class="" data-key="Righe">
            <div class="w3-col s12 mo-intestazione">ELENCO</div>
            <table class="content lg-table w3-table w3-striped lg-mt-5">
                <thead>
                    <tr>
                        <th class="lg-lbl-da" data-key="Riga">#</th>
                        <th class="lg-lbl-da" data-key="Cd_AR">ARTICOLO</th>
                        <th class="lg-lbl-da" data-key="PackListRef">PALLET</th>
                        <th class="lg-lbl-da" data-key="Qta" colspan="2">QTA</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
        <!-- Riepilogo -->
        <div data-key="Riepilogo">
            <div class="w3-col s12 mo-intestazione">
                RIEPILOGO
            </div>
            <table class="content lg-table w3-table lg-mt-5">
                <thead>
                    <tr>
                        <th class="lg-lbl-da" data-key="Riga">#</th>
                        <th class="lg-lbl-da" data-key="PackListRef">PALLET</th>
                        <th class="lg-lbl-da" data-key="Cd_ARLotto">LOTTO</th>
                        <th class="lg-lbl-da" data-key="Cd_AR">ARTICOLO</th>
                        <th class="lg-lbl-da" data-key="Qta">QTA</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="lg-font-07em valign-middle" rowspan="3">1</td>
                        <td class="lg-font-07em valign-middle" rowspan="3">P000789</td>
                        <td class="lg-font-07em"></td>
                        <td class="lg-font-07em">SCELTA01</td>
                        <td class="lg-font-07em">75</td>
                        <%--<td class="lg-font-07em valign-middle" rowspan="3">
                            <button class="btn-confirm" data-key="CreaDoc">Crea Doc</button>
                        </td>--%>
                    </tr>
                    <tr>
                        <td class="lg-font-07em">BCW-210151</td>
                        <td class="lg-font-07em">WETBLUE</td>
                        <td class="lg-font-07em">30</td>
                    </tr>
                    <tr>
                        <td class="lg-font-07em">BCW-210318</td>
                        <td class="lg-font-07em">WETORANGE</td>
                        <td class="lg-font-07em">45</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div id="pgCHS00012_CreaDoc" class="mo-page w3-container">
        <div class="w3-row">
            <div class="mo-intestazione">
                <label name="creaDocTipo">CREAZIONE DOCUMENTO</label>
            </div>
            <div class="w3-row lg-mb-5">
                <label class="title lg-lbl-da">DOC</label><br>
                <select name="Cd_DO" class="lg-input first-focus" style="width: 40%"></select>
            </div>
            <div class="w3-row lg-mb-15">
                <label class="title lg-lbl-da">CLIENTE / FORNITORE</label><br />
                <input name="Cd_CF" type="text" class="first-focus lg-input" style="width: 100px;" />
                <label class="descrizione lg-lbldescrizione" name="CF_Descrizione"></label>
                <img searchkey="Cd_CF" class="search mo-pointer w3-margin-right w3-right" src="icon/Cerca.svg" style="width: 1.6em" />
                <img class="detail mo-pointer w3-margin-right w3-right" src="icon/Info.svg" style="width: 1.6em; display: none;" />
            </div>
            <div class="w3-row lg-mb-5">
                <label class="lg-lbl-da">ARTICOLO</label><br />
                <input name="Cd_AR" type="text" class="lg-input" style="width: 140px" disabled />
            </div>
            <div class="w3-row lg-mb-5">
                <label class="lg-lbl-da">LOTTO</label><br />
                <input name="Cd_ARLotto" type="text" class="lg-input" style="width: 140px" disabled />
            </div>
            <div class="w3-row lg-mb-5" name="divPackListRef">
                <label class="lg-lbl-da">PALLET</label><br />
                <input name="PackListRef" type="text" class="lg-input" style="width: 140px" disabled />
            </div>
            <div class="w3-row">
                <label class="lg-lbl-da">QUANTITA</label><br />
                <input name="Quantita" type="text" class="lg-input w3-right-align" style="width: 140px" />
                <label name="Cd_ARMisura" class="descrizione lg-lbldescrizione"></label>
            </div>
            <div class="div-notepiede lg-mt-15">
                <label class="lg-lbl-da">NOTE</label><br />
                <textarea name="NotePiede" rows="4" class="first-focus lg-input"></textarea>
            </div>
            <div class="div-listener">
                <label class="lg-lbl-da">LISTENER</label><br />
                <select name="Listener" class="lg-input" onchange="Listener_Sel_Idx(this, false);"></select>
            </div>
            <div class="w3-col s12 w3-margin-top" style="text-align: center;">
                <button class="btn-confirm" data-key="Annulla">Annulla</button>
                <button class="btn-confirm" data-key="Salva">Salva</button>
            </div>
        </div>
    </div>


    <%-- #1.5000 pgRS --%>
    <div id="pgRS" class="mo-page w3-container">
    </div>

    <%-- #3.00 SearchCdDes fnl --%>
    <div id="SearchCdDes" class="lg-modal lg-gray lg-zindex-200">
        <header class="lg-modalheader lg-pt-5">
            <img class="lg-navbarback mo-pointer lg-ml-15 w3-left" style="margin-top: 4px;" src="icon/Back.svg" onclick="Search_Close();" />
            <label class="lg-title lg-ml-20">CD+DESC</label>
            <img class="i sp-no mo-pointer w3-right w3-margin-right" src="icon/AccessDenied.svg" style="width: 1.2em; height: 1.2em;" onclick="Search_Clear();" />
        </header>
        <div class="lg-mt-5">
            <div class="w3-container">
                <input filterkey="Search_CdDes" type="text" class="filtro mo-search" placeholder="Cerca..." />
            </div>
            <ul class="w3-ul lg-ul lg-gray lg-mt-5">
                <li class="template mo-pointer w3-white" style="display: none;" onclick="Search_Close($(this));">
                    <label class="cd lg-srlbl-cd"></label>
                    <label>&nbsp;-&nbsp;</label>
                    <label class="des lg-srlbl-desc"></label>
                    <img class="lg-menuavanti w3-right" src="icon/Avanti.svg" />
                </li>
            </ul>
            <label class="mo-msg lg-mt-15 w3-margin-left">Ricerca...</label>
        </div>
    </div>

    <%-- #3.01 SearchAR fnl --%>
    <div id="SearchAR" class="lg-modal lg-gray lg-zindex-200">
        <header class="lg-modalheader lg-pt-5">
            <label class="lg-title lg-ml-20">Articoli</label>
            <img class="lg-navbarback mo-pointer lg-ml-15 w3-left" style="margin-top: 4px;" src="icon/Back.svg" onclick="Search_Close();" />
            <label class="container w3-right lg-mt-5 lg-mr-6">
                <label class="">Articoli fittizi</label>
                <input class="ck-fittizi" type="checkbox" style="position: absolute;" />
                <span class="checkmark"></span>
            </label>
        </header>
        <div class="lg-mt-5">
            <div class="w3-container">
                <input filterkey="Search_AR" type="text" class="filtro mo-search" placeholder="Cerca..." />
            </div>
            <ul class="w3-ul lg-ul lg-gray lg-mt-5">
                <li class="template mo-pointer w3-white" style="display: none;" onclick="Search_Close($(this));">
                    <label class="cd lg-srlbl-cd"></label>
                    <label>&nbsp;-&nbsp;</label>
                    <label class="desc lg-srlbl-desc"></label>
                    <img class="lg-menuavanti w3-right" src="icon/Avanti.svg" />
                </li>
            </ul>
            <label class="mo-msg lg-mt-15">Ricerca...</label>
        </div>
    </div>

    <%-- #3.02 SearchARLotto fnl --%>
    <div id="SearchARLotto" class="lg-modal lg-gray lg-zindex-200">
        <header class="lg-modalheader lg-pt-5">
            <div class="mo-display-inlineblock">
                <img class="lg-navbarback mo-pointer lg-ml-15 w3-left" style="margin-top: 4px;" src="icon/Back.svg" onclick="Search_Close();" />
                <label class="lg-title lg-ml-20">Lotto</label>
            </div>
            <div class="mo-display-inlineblock w3-right">
                <label class="container w3-right w3-margin-right">
                    <label class="lg-lblgiacpositiva">Lotti con giacenza</label>
                    <input class="ck-giacpositiva lg-ckricordapw" type="checkbox" checked="checked" />
                    <span class="checkmark"></span>
                </label>
            </div>
        </header>
        <div class="lg-mt-5">
            <div class="w3-container">
                <input filterkey="Search_ARLotto" type="text" class="filtro mo-search" placeholder="Cerca..." />
            </div>
            <ul class="w3-ul lg-ul lg-gray lg-mt-5">
                <li class="template mo-pointer w3-white" style="display: none;" onclick="Search_Close($(this));">
                    <div class="w3-row">
                        <div class="mo-display-inlineblock">
                            <span class="cd-lotto lg-srlbl-cd"></span><span>&nbsp;-&nbsp;</span><span class="desc-lotto lg-srlbl-desc"></span><br />
                            <span class="scadenza-lotto lg-lblstd"></span>
                            <span class="qta-lotto lg-lblstd"></span>&nbsp;<span class="um-lotto lg-lblstd"></span>
                            <span class="ar-lotto lg-lblstd lg-mr-6"></span>
                            <span class="cdubi-lotto lg-lblstd"></span>
                        </div>
                        <div class="mo-display-inlineblock w3-right lg-mt-5">
                            <img class="lg-menuavanti" src="icon/Avanti.svg" />
                        </div>
                    </div>
                </li>
            </ul>
            <label class="mo-msg lg-mt-15">Ricerca...</label>
        </div>
    </div>

    <%-- #3.03 SearchCF fnl --%>
    <div id="SearchCF" class="lg-modal lg-gray lg-zindex-200">
        <header class="lg-modalheader lg-pt-5">
            <img class="lg-navbarback mo-pointer lg-ml-15 w3-left" style="margin-top: 4px;" src="icon/Back.svg" onclick="Search_Close();" />
            <label class="title lg-title lg-ml-20"></label>
        </header>
        <div class="lg-mt-5">
            <div class="w3-container">
                <div id="info-prelievo" class="w3-row lg-mb-5">
                    <label class="lg-lblstd lg-font-07em">senza prelievo</label>
                    <label class="w3-margin-left lg-lblstd lg-bold lg-font-07em">con prelievo</label>
                </div>
                <input filterkey="Search_CF" type="text" class="filtro mo-search" placeholder="Cerca..." />
            </div>
            <ul class="w3-ul lg-ul lg-gray lg-mt-5">
                <li class="template mo-pointer w3-white" style="display: none;">
                    <%-- mo-display-inlineblock --%>
                    <div class="">
                        <label class="cd-cf lg-srlbl-cd"></label>
                        <label class="desc-cf lg-srlbl-desc"></label>
                    </div>
                    <%-- mo-display-inlineblock w3-right--%>
                    <div class="">
                        <img src="icon/Info.svg" class="detail w3-margin-right" style="width: 1.1em; height: 1.1em;" />
                        <label class="cfstato lg-lbllink mo-pointer w3-margin-left" style="text-decoration: underline;"></label>
                    </div>
                </li>
            </ul>
            <label class="mo-msg lg-mt-15">Ricerca...</label>
        </div>
    </div>

    <%-- #3.04 SearchCFDest fnl --%>
    <div id="SearchCFDest" class="lg-modal lg-gray lg-zindex-200">
        <header class="lg-modalheader lg-pt-5">
            <img class="lg-navbarback mo-pointer lg-ml-15 w3-left" style="margin-top: 4px;" src="icon/Back.svg" onclick="Search_Close();" />
            <label class="lg-title lg-ml-20">Destinazioni</label>
        </header>
        <div class="lg-mt-5">
            <div class="w3-container">
                <input filterkey="Search_CFDest" type="text" class="filtro mo-search" placeholder="Cerca..." />
            </div>
            <ul class="w3-ul lg-ul lg-gray lg-mt-5">
                <li class="template mo-pointer w3-white" style="display: none;">
                    <div class="mo-display-inlineblock">
                        <span class="cd-cfdest lg-srlbl-cd"></span><span>&nbsp;-&nbsp;</span><span class="desc-cfdest lg-srlbl-desc"></span><br />
                        <span class="cd-cf lg-lblstd"></span>
                    </div>
                    <div class="mo-display-inlineblock w3-right lg-mt-5">
                        <img src="icon/Info.svg" class="detail" style="width: 1.1em; height: 1.1em;" />
                    </div>
                </li>
            </ul>
            <label class="mo-msg">Ricerca...</label>
        </div>
    </div>

    <%-- #3.05 SearchMG fnl --%>
    <div id="SearchMG" class="lg-modal lg-gray lg-zindex-200">
        <header class="lg-modalheader lg-pt-5">
            <img class="lg-navbarback mo-pointer lg-ml-15 w3-left" style="margin-top: 4px;" src="icon/Back.svg" onclick="Search_Close();" />
            <label class="title lg-title lg-ml-20"></label>
            <img class="i sp-no mo-pointer w3-right w3-margin-right" src="icon/AccessDenied.svg" style="width: 1.2em; height: 1.2em;" onclick="Search_Clear();" />
        </header>
        <div class="lg-mt-5">
            <div class="w3-container">
                <input filterkey="Search_MG" type="text" class="filtro mo-search" placeholder="Cerca..." />
            </div>
            <ul class="w3-ul lg-ul lg-gray lg-mt-5">
                <li class="template mo-pointer w3-white" style="display: none;" onclick="Search_Close($(this));">
                    <label class="cd lg-srlbl-cd"></label>
                    <label>&nbsp;-&nbsp;</label>
                    <label class="desc lg-srlbl-desc"></label>
                    <img class="lg-menuavanti w3-right lg-mt-5" src="icon/Avanti.svg" />
                </li>
            </ul>
            <label class="mo-msg lg-mt-15">Ricerca...</label>
        </div>
    </div>

    <%-- #3.06 SearchMGUbicazione fnl --%>
    <div id="SearchMGUbicazione" class="lg-modal lg-gray lg-zindex-200">
        <header class="lg-modalheader lg-pt-5">
            <div class="mo-display-inlineblock">
                <img class="lg-navbarback mo-pointer lg-ml-15 w3-left" style="margin-top: 4px;" src="icon/Back.svg" onclick="Search_Close();" />
                <label class="title lg-title lg-ml-20"></label>
            </div>
            <img class="i sp-no mo-pointer w3-right w3-margin-left w3-margin-right" src="icon/AccessDenied.svg" style="width: 1.2em; height: 1.2em;" onclick="Search_Clear();" />
            <div class="mo-display-inlineblock w3-right">
                <label class="container w3-right w3-margin-right">
                    <label class="lg-lblcompleta">Non Complete</label>
                    <input class="ck-ubinoncom lg-ckricordapw" type="checkbox" />
                    <span class="checkmark"></span>
                </label>
            </div>
        </header>
        <div class="lg-mt-5">
            <div class="w3-container">
                <input filterkey="Search_MGUbi" type="text" class="filtro mo-search" placeholder="Cerca..." />
            </div>
            <ul class="w3-ul lg-ul lg-gray lg-mt-5">
                <li class="template mo-pointer w3-white" style="display: none;" onclick="Search_Close($(this));">
                    <div class="mo-display-inlineblock">
                        <label class="cd lg-srlbl-cd"></label>
                        <label>&nbsp;-&nbsp;</label>
                        <label class="desc lg-srlbl-desc"></label>
                        <br />
                        <label class="lg-lblstd">MG:&nbsp;</label>
                        <label class="cd_mg lg-lblstd"></label>
                        <label class="lg-lblstd xmocompleta w3-text-orange"></label>
                    </div>
                    <div class=" mo-display-inlineblock w3-right lg-mt-5">
                        <img class="ubidefault w3-hide w3-margin-right" src="icon/StarYellow.svg" title="Ubicazione di default" style="width: 1.1em; height: 1.1em;" />
                        <img class="lg-menuavanti" src="icon/Avanti.svg" />
                    </div>
                </li>
            </ul>
            <label class="mo-msg lg-mt-15">Ricerca...</label>
        </div>
    </div>

    <%-- #3.07 SearchDOSottoCommessa fnl --%>
    <div id="SearchDOSottoCommessa" class="lg-modal lg-gray lg-zindex-200">
        <header class="lg-modalheader lg-pt-5">
            <img class="lg-navbarback mo-pointer lg-ml-15 w3-left" style="margin-top: 4px;" src="icon/Back.svg" onclick="Search_Close();" />
            <label class="title lg-title lg-ml-20">Sottocommesse</label>
            <img class="i sp-no mo-pointer w3-right w3-margin-right" src="icon/AccessDenied.svg" style="width: 1.2em; height: 1.2em;" onclick="Search_Clear();" />
        </header>
        <div class="lg-mt-5">
            <div class="w3-container">
                <input filterkey="Search_DOSC" type="text" class="filtro mo-search" placeholder="Cerca..." />
            </div>
            <ul class="w3-ul lg-ul lg-gray lg-mt-5">
                <li class="template mo-pointer w3-white" style="display: none;" onclick="Search_Close($(this));">
                    <label class="cd lg-srlbl-cd"></label>
                    <label>&nbsp;-&nbsp;</label>
                    <label class="desc lg-srlbl-desc"></label>
                    <img class="lg-menuavanti w3-right lg-mt-5" src="icon/Avanti.svg" />
                </li>
            </ul>
            <label class="mo-msg lg-mt-15">Ricerca...</label>
        </div>
    </div>

    <%-- #3.08 SearchxMOCodSpe fnl --%>
    <div id="SearchxMOCodSpe" class="lg-modal lg-gray lg-zindex-200">
        <header class="lg-modalheader lg-pt-5">
            <img class="lg-navbarback mo-pointer lg-ml-15 w3-left" style="margin-top: 4px;" src="icon/Back.svg" onclick="Search_Close();" />
            <label class="lg-title lg-ml-20">Spedizioni</label>
            <img class="i sp-no mo-pointer w3-right w3-margin-right" src="icon/AccessDenied.svg" style="width: 1.2em; height: 1.2em;" onclick="Search_Clear();" />
        </header>
        <div class="lg-mt-5">
            <div class="w3-container">
                <input filterkey="Search_xMOCodSpe" type="text" class="filtro mo-search" placeholder="Cerca..." />
            </div>
            <ul class="w3-ul lg-ul lg-gray lg-mt-5">
                <li class="template mo-pointer w3-white" style="display: none;" onclick="Search_Close($(this));">
                    <div class="w3-row">
                        <div class="mo-display-inlineblock">
                            <label class="cd lg-srlbl-cd"></label>
                            <label>&nbsp;-&nbsp;</label>
                            <label class="desc lg-srlbl-desc"></label>
                            <br />
                            <span class="sp-ndocs lg-lblstd"></span>
                        </div>
                        <div class="mo-display-inlineblock w3-right lg-mt-5">
                            <img class="lg-menuavanti" src="icon/Avanti.svg" />
                        </div>
                    </div>
                </li>
            </ul>
            <label class="mo-msg lg-mt-15">Ricerca...</label>
        </div>
    </div>

    <%-- #3.09 SearchARARMisura --%>
    <div id="SearchARARMisura" class="lg-modal lg-gray lg-zindex-200">
        <header class="lg-modalheader lg-pt-5">
            <img class="lg-navbarback mo-pointer lg-ml-15 w3-left" style="margin-top: 4px;" src="icon/Back.svg" onclick="Search_Close();" />
            <label class="lg-title lg-ml-20">UM</label>
            <img class="i sp-no mo-pointer w3-right w3-margin-right" src="icon/AccessDenied.svg" style="width: 1.2em; height: 1.2em;" onclick="Search_Clear();" />
        </header>
        <div class="lg-mt-5">
            <div class="w3-container">
                <input filterkey="Search_ARARMisura" type="text" class="filtro mo-search" placeholder="Cerca..." />
            </div>
            <ul class="w3-ul lg-ul lg-gray lg-mt-5">
                <li class="template mo-pointer w3-white" style="display: none;" onclick="Search_Close($(this));">
                    <label class="cd lg-srlbl-cd"></label>
                    <img class="lg-menuavanti w3-right" src="icon/Avanti.svg" />
                </li>
            </ul>
            <label class="mo-msg w3-large mo-font-darkblue w3-padding">Ricerca...</label>
        </div>
    </div>

    <%-- #3.10 SearchCd_DoVettore --%>
    <div id="SearchCd_DoVettore" class="lg-modal lg-gray lg-zindex-200">
        <header class="lg-modalheader lg-pt-5">
            <img class="lg-navbarback mo-pointer lg-ml-15 w3-left" style="margin-top: 4px;" src="icon/Back.svg" onclick="Search_Close();" />
            <label class="lg-title lg-ml-20">Vettore</label>
            <img class="i sp-no mo-pointer w3-right w3-margin-right" src="icon/AccessDenied.svg" style="width: 1.2em; height: 1.2em;" onclick="Search_Clear();" />
        </header>
        <div class="lg-mt-5">
            <div class="w3-container">
                <input filterkey="SearchCd_DoVettore" type="text" class="filtro mo-search" placeholder="Cerca..." />
            </div>
            <ul class="w3-ul lg-ul lg-gray lg-mt-5">
                <li class="template mo-pointer w3-white" style="display: none;" onclick="Search_Close($(this));">
                    <label class="cd lg-srlbl-cd"></label>
                    <label>&nbsp;-&nbsp;</label>
                    <label class="desc lg-srlbl-desc"></label>
                </li>
            </ul>
            <label class="mo-msg w3-large mo-font-darkblue w3-padding">Ricerca...</label>
        </div>
    </div>

    <%-- #3.11 SearchDOSdTAnag fnl --%>
    <div id="SearchDOSdTAnag" class="lg-modal lg-gray lg-zindex-200">
        <header class="lg-modalheader lg-pt-5">
            <img class="lg-navbarback mo-pointer lg-ml-15 w3-left" style="margin-top: 4px;" src="icon/Back.svg" onclick="Search_Close();" />
            <label class="lg-title lg-ml-20">CD+DESC</label>
            <img class="i sp-no mo-pointer w3-right w3-margin-right" src="icon/AccessDenied.svg" style="width: 1.2em; height: 1.2em;" onclick="Search_Clear();" />
        </header>
        <div class="lg-mt-5">
            <div class="w3-container">
                <input filterkey="Search_DOSdTAnag" type="text" class="filtro mo-search" placeholder="Cerca..." />
            </div>
            <ul class="w3-ul lg-ul lg-gray lg-mt-5">
                <li class="template mo-pointer w3-white" style="display: none;" onclick="Search_Close($(this));">
                    <label class="cd lg-srlbl-cd"></label>
                    <label>&nbsp;-&nbsp;</label>
                    <label class="des lg-srlbl-desc"></label>
                    <img class="lg-menuavanti w3-right" src="icon/Avanti.svg" />
                </li>
            </ul>
            <label class="mo-msg lg-mt-15 w3-margin-left">Ricerca...</label>
        </div>
    </div>

    <%-- #3.12 SearchExtFld --%>
    <div id="SearchExtFld" class="lg-modal lg-gray lg-zindex-200">
        <header class="lg-modalheader lg-pt-5">
            <img class="lg-navbarback mo-pointer lg-ml-15 w3-left" style="margin-top: 4px;" src="icon/Back.svg" onclick="SearcExtFld.close();" />
            <label class="title lg-title lg-ml-20">Extra Field</label>
            <img class="i sp-no mo-pointer w3-right w3-margin-right" src="icon/AccessDenied.svg" style="width: 1.2em; height: 1.2em;" onclick="SearcExtFld.clear();" />
        </header>
        <div class="lg-mt-5">
            <div class="w3-container">
                <input type="text" class="filtro" placeholder="Cerca..." onchange="SearcExtFld.enter();" />
            </div>
            <ul class="w3-ul lg-ul lg-gray lg-mt-5">
                <li class="template mo-pointer w3-white" style="display: none;" onclick="SearcExtFld.close($(this));">
                    <label class="codice lg-srlbl-cd"></label>
                    <label>&nbsp;-&nbsp;</label>
                    <label class="descrizione lg-srlbl-desc"></label>
                    <img class="lg-menuavanti w3-right" src="icon/Avanti.svg" />
                </li>
            </ul>
            <label class="ricerca mo-msg lg-mt-15 w3-margin-left">Ricerca...</label>
        </div>
    </div>

    <%-- #4.00 DetailCF fnl --%>
    <div id="DetailCF" class="w3-modal lg-zindex-202">
        <div class="w3-modal-content lg-mw-500">
            <div class="lg-blue" style="height: 4px;">
            </div>
            <div class="w3-left lg-ml-8 lg-mt-5">
                <img style="height: 1.5em; width: auto;" class="mo-pointer" src="icon/Previous.svg" onclick="$('#DetailCF').hide();" />
            </div>
            <div class="w3-container w3-center lg-pb-8">
                <div class="w3-row">
                    <img style="height: 2.1em; width: auto;" src="icon/Mappa.svg" />
                </div>
                <div class="w3-row">
                    <br />
                    <label class="lbl cd-cf lg-popuptitle lg-mt-5"></label>
                    <br />
                    <label class="lbl indirizzo lg-popupdom"></label>
                    <label class="lbl localita lg-popupdom"></label>
                    <label class="lbl cap lg-popupdom"></label>
                </div>
            </div>
        </div>
    </div>

    <%-- #4.01 DetailCFDest fnl --%>
    <div id="DetailCFDest" class="w3-modal lg-zindex-202">
        <div class="w3-modal-content lg-mw-500">
            <div class="lg-blue" style="height: 4px;">
            </div>
            <div class="w3-left lg-ml-8 lg-mt-5">
                <img style="height: 1.5em; width: auto;" class="mo-pointer" src="icon/Previous.svg" onclick="$('#DetailCFDest').hide();" />
            </div>
            <div class="w3-container">
                <div class="w3-center">
                    <label class="lbl cd-cfdest lg-popuptitle"></label>
                </div>
                <div class="div-indirizzo w3-row w3-section w3-padding">
                    <div class="w3-col" style="width: 50px">
                        <img src="icon/Mappa.svg" style="height: 1.5em; width: auto;" />
                    </div>
                    <div class="w3-rest">
                        <label class="lbl indirizzo lg-lblstd"></label>
                        <label class="lbl localita lg-lblstd"></label>
                        <label class="lbl cap lg-lblstd"></label>
                    </div>
                </div>
                <div class="div-agente w3-row w3-section w3-padding">
                    <div class="w3-col" style="width: 50px;">
                        <img src="icon/Avatar.svg" style="height: 1.5em; width: auto;" />
                    </div>
                    <div class="w3-rest">
                        <label class="lbl agente lg-lblstd"></label>
                    </div>
                </div>
                <div class="div-telefono w3-row w3-section w3-padding">
                    <div class="w3-col" style="width: 50px;">
                        <img src="icon/Phone.svg" style="height: 1.5em; width: auto;" />
                    </div>
                    <div class="w3-rest">
                        <label class="lbl telefono lg-lblstd"></label>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <%-- #4.02 DetailGiacenza fnl --%>
    <div id="DetailGiacenza" class="lg-modal lg-gray lg-zindex-200">
        <header class="lg-modalheader lg-pt-5">
            <img class="lg-navbarback mo-pointer lg-ml-15 w3-left" style="margin-top: 4px;" src="icon/Back.svg" onclick="HideAndFocus('DetailGiacenza');" />
            <label class="lg-title lg-ml-20">Giacenza</label>
            <img class="mo-pointer w3-margin-right w3-right update" src="icon/Aggiorna.svg" style="width: 1.6em">
        </header>
        <div style="overflow-y: auto; border-top: 2px solid #D6D1D1;">
            <table class="lg-table w3-table w3-striped w3-white">
                <thead>
                    <tr>
                        <th class="w3-small lg-fontblue" colspan="8">DESCRIZIONE ARTICOLO</th>
                    </tr>
                    <tr style="margin: 3px 0px;">
                        <th class="lg-lbl-da">MG/UB</th>
                        <th class="lg-lbl-da Descrizione">DESC. UBICAZIONE</th>
                        <th class="lg-lbl-da th-rolling" roll="Cd_ARLotto">LOTTO</th>
                        <th class="lg-lbl-da th-rolling" roll="Cd_DOSottoCommessa">COMMESSA</th>
                        <th class="lg-lbl-da Quantita">QTA.
                            <br />
                            <label class="switch w3-right">
                                <input class="ck-pkpesi" type="checkbox" />
                                <span class="slider round"></span>
                            </label>
                        </th>
                        <th class="lg-lbl-da QuantitaDisp">DISPONIBILITA'
                            <br />
                            <label class="switch w3-right">
                                <input class="ck-pkpesi" type="checkbox" />
                                <span class="slider round"></span>
                            </label>
                        </th>
                        <th class="lg-lbl-da QuantitaDImm">IMMEDIATO
                                <br />
                            <label class="switch w3-right">
                                <input class="ck-pkpesi" type="checkbox" />
                                <span class="slider round"></span>
                            </label>
                        </th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="template tr-link" style="display: none;">
                        <td class="w3-small">
                            <label class="Cd_MG"></label>
                            <br />
                            <label class="Cd_MGUbicazione"></label>
                        </td>
                        <td class="w3-small Descrizione"></td>
                        <td class="w3-small Cd_ARLotto"></td>
                        <td class="w3-small Cd_DOSottoCommessa"></td>
                        <td class="w3-small w3-right-align Quantita"></td>
                        <td class="w3-small w3-right-align QuantitaDisp"></td>
                        <td class="w3-small w3-right-align QuantitaDImm"></td>
                        <td style="padding-left: 10px !important">
                            <img class="ubidefault w3-hide w3-margin-right" src="icon/StarYellow.svg" title="Ubicazione di default" style="width: 0.8em; height: 0.8em;" />
                        </td>
                    </tr>
                    <tr class="template totali" style="display: none;">
                        <td class="w3-small lg-fontblue" colspan="3">Totale</td>
                        <td class="w3-small w3-right-align lg-fontblue Quantita"></td>
                        <td class="w3-small w3-right-align lg-fontblue QuantitaDisp"></td>
                        <td class="w3-small w3-right-align lg-fontblue QuantitaDImm"></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <%-- #4.03 DetailBarcode fnl --%>
    <div id="DetailBarcode" class="lg-modal lg-gray lg-zindex-200">
        <header class="lg-modalheader lg-pt-5">
            <img class="lg-navbarback mo-pointer lg-ml-15 w3-left" style="margin-top: 4px;" src="icon/Back.svg" onclick="oPrg.BC.Detail_Close();" />
            <label class="lg-title lg-ml-20">Barcode</label>
        </header>
        <div class="w3-row w3-white w3-container" style="border-top: 1px solid #EEEEEE;">
            <label class="lg-lbldescrizione">RIEPILOGO</label>
            <div class="w3-row" style="padding: 10px 8px;">
                <div class="w3-padding w3-border-right mo-display-inlineblock" style="width: 80px;">
                    <label class="lg-lbl-da">Totali</label><br />
                    <label class="tot lg-ml-15">0</label>
                </div>
                <div class="w3-padding mo-display-inlineblock" style="width: 80px;">
                    <label class="lg-lbl-da">Evadibile</label><br />
                    <label class="err lg-ml-15">0</label>
                </div>
            </div>
        </div>
        <div class="w3-row w3-container w3-white" style="border-top: 1px solid #EEEEEE;">
            <label class="lg-lbldescrizione">ELENCO LETTURE</label>
        </div>
        <div class="barcode lg-mt-5 w3-container">
            <input type="text" class="lg-input" placeholder="Barcode..." />
        </div>
        <div class="lg-mt-5" style="overflow-y: auto;">
            <%-- Elenco letture --%>
            <ul class="w3-ul lg-ul lg-gray">
                <li class="template w3-white" style="display: none;">
                    <img class="icona icon-find mo-display-inlineblock w3-right lg-mt-5" style="width: 1.1em; height: 1.1em;" src="icon/Send.svg" />
                    <span class="numero mo-display-inlineblock lg-fontblue"></span>
                    <span class="barcode mo-display-inlineblock w3-left w3-margin-right"></span>
                    <span class="codice"></span>
                    <br />
                    <span class="messaggio lg-lblstd"></span>
                </li>
            </ul>
        </div>
    </div>

    <%-- #4.04 DetailDO fnl --%>
    <div id="DetailDO" class="lg-modal w3-white" style="z-index: 300; overflow: auto;">
        <header class="lg-modalheader lg-pt-5">
            <img class="lg-navbarback mo-pointer lg-ml-15 w3-left" style="margin-top: 4px;" src="icon/Back.svg" onclick="HideAndFocus('DetailDO'); fU.Overflow(oPrg.ActivePageId, 'auto');" />
            <label class="doc-numero lg-title lg-ml-10"></label>
        </header>
        <div class="w3-container lg-pt-8" style="border-top: 2px solid #EEEEEE">
            <div class="w3-container">
                <div class="div-doinfo div-accordion lg-mt-5">
                    <div class="header mo-intestazione">
                        <label>INFO DOCUMENTO</label>
                        <img class="icon lg-iupdown mo-pointer w3-right" src="icon/ArrowUp.svg" state="up" />
                    </div>
                    <div class="content">
                        <label class="lg-lbl-da">CLIENTE</label><br />
                        <label class="cf-descrizione lg-lbldescrizione lbl"></label>
                        <hr style="margin: 0 !important" />
                        <label class="lg-lbl-da">INDIRIZZO</label><br />
                        <img src="icon/Mappa.svg" style="height: 1.2em; width: auto;" /><label class="indirizzo"></label>
                        <hr style="margin: 0 !important" />
                        <label class="lg-lbl-da">ESERCIZIO:</label><br />
                        <label class="cd-mgesercizio lbl"></label>
                        <hr style="margin: 0 !important" />
                        <div class="div-dataconsegna">
                            <label class="lg-lbl-da">CONSEGNA:</label><br />
                            <label class="dataconsegna lbl"></label>
                            <hr style="margin: 0 !important" />
                        </div>
                        <div class="div-sottocommessa">
                            <label class="lg-lbl-da">SOTTOCOMMESSA:</label><br />
                            <label class="cd-dosottocommessa lbl"></label>
                            <hr style="margin: 0 !important" />
                        </div>
                        <div class="div-riferimento">
                            <label class="lg-lbl-da">RIFERIMENTO:</label><br />
                            <label class="numerodocrif lbl"></label>
                            <label>del: </label>
                            <label class="datadocrif lbl"></label>
                            <hr style="margin: 0 !important" />
                        </div>
                        <div class="div-cdpg">
                            <label class="lg-lbl-da">PAGAMENTO:</label><br />
                            <label class="cd-pg lbl"></label>
                        </div>
                        <div class="div-prelevatoda">
                            <label class="lg-lbl-da">PRELEVATO DA:</label><br />
                            <label class="prelevatoda lbl"></label>
                        </div>
                        <br />
                    </div>
                </div>
                <div class="div-notepiede div-accordion lg-mt-5">
                    <div class="header mo-intestazione">
                        <label>NOTE PIEDE</label>
                        <img class="icon lg-iupdown mo-pointer w3-right" src="icon/ArrowUp.svg" state="up" />
                    </div>
                    <div class="content">
                        <label class="notepiede lbl"></label>
                    </div>
                </div>
                <div class="w3-container lg-mt-5">
                    <label class="lg-lbldescrizione">ARTICOLI</label>
                    <table class="lg-table w3-table w3-striped lg-mt-5">
                        <tr style="margin: 3px 0px;">
                            <th class="lg-lbl-da w3-center">ARTICOLO</th>
                            <th class="lg-lbl-da w3-center Cd_ARLotto">LOTTO</th>
                            <th class="lg-lbl-da w3-center">UM</th>
                            <th class="lg-lbl-da w3-center">QUANTITA'</th>
                        </tr>
                        <tr class="template" style="display: none;">
                            <td class="w3-small w3-left Cd_AR"></td>
                            <td class="w3-small w3-center Cd_ARLotto"></td>
                            <td class="col-armisura w3-small w3-center Cd_ARMisura"></td>
                            <td class="btn-armisura lg-font-07em w3-center Cd_ARMisura mo-pointer mo-btnum w3-btn"></td>
                            <td class="w3-small w3-right  QtaEvadibile"></td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <%-- #4.05 Detail_Letture fnl --%>
    <div id="Detail_Letture" class="lg-modal lg-gray lg-zindex-200">
        <header class="lg-modalheader lg-pt-5" onclick="HideAndFocus('Detail_Letture');">
            <img class="lg-navbarback mo-pointer lg-ml-15 w3-left" style="margin-top: 4px;" src="icon/Back.svg" />
            <label class="lg-title lg-ml-20">Letture</label>
        </header>
        <ul class="w3-ul lg-ul lg-gray lg-mt-5">
            <li class="template w3-white" style="display: none;">
                <div class="w3-row">
                    <div class="mo-display-inlineblock" style="width: 80%; font-size: 1.4em">
                        <span class="num lg-lblstd"></span>
                        <span class="id-rig lg-lbldescrizione"></span>
                        <span class="ar-cddesc lg-lblstd"></span>
                    </div>
                    <div class="mo-display-inlineblock w3-right" style="width: 40px;">
                        <img class="delete lg-doapdel mo-pointer" style="margin-top: 5px !important" src="icon/EliminaGrigio.svg" />
                    </div>
                    <div class="mo-display-inlineblock w3-left" style="width: 35px;">
                        <img class="edit lg-doapedit mo-pointer" style="margin-right: 5px !important" src="icon/edit-24.png" />
                    </div>
                </div>
                <div class="div-operatore">
                    <label class="lg-lbl-da">OPERATORE: </label>
                    <span class="cd-operatore lg-lblstd"></span>
                </div>
                <div>
                    <label class="lg-lbl-da">DEL: </label>
                    <span class="dataora lg-lblstd"></span>
                </div>
                <div class="div-mgp">
                    <label class="lg-lbl-da">MG PARTENZA: </label>
                    <span class="cd-mg-p lg-lblstd w3-margin-right"></span>
                    <span class="ubip cd-mgubicazione-p lg-lblstd w3-right"></span>
                    <label class="ubip lg-lbl-da w3-right">UBI: </label>
                </div>
                <div class="div-mga">
                    <label class="lg-lbl-da">MG ARRIVO: </label>
                    <span class="cd-mg-a lg-lblstd w3-margin-right"></span>
                    <span class="ubia cd-mgubicazione-a lg-lblstd w3-right"></span>
                    <label class="ubia lg-lbl-da w3-right">UBI: </label>
                </div>
                <div class="div-lotto">
                    <label class="lg-lbl-da">LOTTO: </label>
                    <span class="cd-arlotto lg-lblstd w3-margin-right"></span>
                </div>
                <div class="div-quantita">
                    <label class="lg-lbl-da">QUANTITA': </label>
                    <span class="quantita lg-lblstd">45pl</span>
                </div>
                <div class="div-matricola">
                    <label class="lg-lbl-da">MATRICOLA: </label>
                    <span class="matricola lg-lblstd w3-margin-right"></span>
                    <br />
                </div>
                <div class="div-barcode">
                    <label class="lg-lbl-da">BARCODE: </label>
                    <span class="barcode lg-lblstd"></span>
                </div>
            </li>
        </ul>
        <label class="mo-msg lg-mt-15">&nbsp;Nessuna Lettura</label>
    </div>

    <%-- #4.06 Detail_PackingList fnl --%>
    <div id="Detail_PackingList" class="lg-modal w3-white lg-zindex-200">
        <header class="lg-modalheader lg-pt-5" style="background-color: #FFCA36;">
            <img class="lg-navbarback mo-pointer lg-ml-15 w3-left" style="margin-top: 4px;" src="icon/Back.svg" onclick="HideAndFocus('Detail_PackingList');" />
            <label class="lg-title lg-ml-20">Packing List</label>
        </header>
        <div class="w3-container">
            <div class="w3-row">
                <div class="w3-col" style="width: 60%;">
                    <table class="lg-table w3-table w3-striped lg-mt-5">
                        <tr>
                            <th class="lg-lbl-da w3-center lg-br-left">NETTO</th>
                            <th class="lg-lbl-da w3-center lg-br-left">LORDO</th>
                            <th class="lg-lbl-da w3-center">VOLUME</th>
                        </tr>
                        <tr class="tr-pktotali">
                            <td class="lg-lblstd w3-right-align netto"></td>
                            <td class="lg-lblstd w3-right-align lordo"></td>
                            <td class="lg-lblstd w3-right-align volume"></td>
                        </tr>
                    </table>
                </div>
                <div class="w3-col w3-padding" style="width: 40%;">
                    <label class="switch w3-right">
                        <input class="ck-pkpesi" type="checkbox" onclick="DetailPackinList_OnOffPesi($(this));" />
                        <span class="slider round"></span>
                    </label>
                    <label class="lg-lbl-da w3-right w3-margin-right">Pesi:</label>
                </div>
            </div>

            <div class="lg-mb-5">
                <table class="pk-all lg-PKtable w3-table w3-striped lg-mt-5">
                    <tr style="border-bottom: 1px solid #EEEEEE !important;">
                        <th class="lg-lbl-da w3-center lg-br-right">UNITA' LOGISTICA</th>
                        <th class="lg-lbl-da w3-center lg-br-right">NETTO<br />
                            [kg]</th>
                        <th class="lg-lbl-da w3-center lg-br-right">LORDO<br />
                            [kg]</th>
                        <th class="lg-lbl-da w3-center">VOLUME<br />
                            [m3]</th>
                    </tr>
                    <tr class="template-ul-p-header w3-padding w3-large lg-height-35 w3-yellow" style="display: none;">
                        <td class="w3-left" style="width: 160px; padding-left: 15px !important;">
                            <img src="icon/Scatola.svg" style="width: 1.2em; height: 1.2em;" />
                            <label class="PackListRef_P lg-lblstd" style="margin-left: 8px;"></label>
                        </td>
                        <td class="w3-right-align lg-lblstd pnul"></td>
                        <td class="w3-right-align lg-lblstd plul"></td>
                        <td class="w3-right-align lg-lblstd vul"></td>
                    </tr>
                    <tr class="template-ul-header w3-padding w3-large lg-height-35" style="display: none;">
                        <td class="w3-left" style="width: 160px; padding-left: 15px !important;">
                            <img src="icon/ScatolaBlue.svg" style="width: 1.2em; height: 1.2em;" class="mo-pointer" />
                            <label class="PackListRef lg-lblstd" style="margin-left: 8px;"></label>
                        </td>
                        <td class="w3-right-align lg-lblstd pnul">0</td>
                        <td class="w3-right-align lg-lblstd plul">0</td>
                        <td class="w3-right-align lg-lblstd vul">0</td>
                    </tr>
                    <tr class="template-ul-rows" style="display: none;">
                        <td colspan="4" style="padding: 0;">
                            <%-- style="width: 100%; border: 1px solid gray;" --%>
                            <table class="dati-ar w3-table w3-striped lg-ARPKtable w3-striped">
                                <tr style="border-bottom: 1px solid #EEEEEE !important;">
                                    <th class="lg-lbl-da lg-br-right w3-center" style="width: 40px;"></th>
                                    <th class="lg-lbl-da lg-br-right w3-center" style="width: 120px;">AR</th>
                                    <th class="dati1 lg-lbl-da lg-br-right w3-center">QTA</th>
                                    <th class="dati1 lg-lbl-da w3-center">UM</th>
                                    <th class="dati2 lg-lbl-da lg-br-right w3-center">NETTO</th>
                                    <th class="dati2 lg-lbl-da lg-br-right w3-center">LORDO</th>
                                    <th class="dati2 lg-lbl-da w3-center">VOLUME</th>
                                </tr>
                                <tr class="template-ar" style="display: none;">
                                    <td class="w3-center">
                                        <img src="icon/Impostazioni.svg" style="width: 1.1em; height: 1.1em;" class="mo-pointer" />
                                    </td>
                                    <td class="w3-center lg-lblstd Cd_AR"></td>
                                    <td class="dati1 lg-lblstd w3-center Qta"></td>
                                    <td class="dati1 lg-lblstd w3-center Cd_ARMisura"></td>
                                    <td class="dati2 lg-lblstd w3-right-align PesoNettoKg"></td>
                                    <td class="dati2 lg-lblstd w3-right-align PesoLordoKg"></td>
                                    <td class="dati2 lg-lblstd w3-right-align VolumeM3"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
            <label class="mo-msg lg-mt-15">Nessuna Unità Logica</label>
        </div>
    </div>

    <%-- #4.08 Detail_NotePiede --%>
    <div id="Detail_NotePiede" class="lg-modal lg-gray lg-zindex-200">
        <header class="lg-modalheader lg-pt-5">
            <img class="lg-navbarback mo-pointer lg-ml-15 w3-left" style="margin-top: 4px;" src="icon/Back.svg" onclick="HideAndFocus('Detail_NotePiede');" />
            <label class="lg-title lg-ml-20">Note Principali</label>
        </header>
        <ul class="w3-ul lg-ul lg-gray lg-mt-5">
            <li class="template mo-pointer w3-white" style="display: none;">
                <div class="mo-display-inlineblock">
                    <label class="do-info lg-srlbl-cd"></label>
                    <br />
                    <label class="notepiede lg-srlbl-desc"></label>
                </div>
            </li>
        </ul>
        <label class="mo-msg lg-mt-15"></label>
    </div>

    <%-- #4.09 Detail_Prelievi (TUTTI I DOC PRELEVABILI)  fnl --%>
    <div id="Detail_Prelievi" class="lg-modal lg-gray lg-zindex-200">
        <header class="lg-modalheader lg-pt-5">
            <img class="lg-navbarback mo-pointer lg-ml-15 w3-left" style="margin-top: 4px;" src="icon/Back.svg" onclick="HideAndFocus('Detail_Prelievi'); fU.Overflow(oPrg.ActivePageId, 'auto');" />
        </header>
        <%-- style="position: fixed; right: 5px; left: 5px; z-index: 100; background-color: white; padding: 0px 2px;" --%>
        <div style="background-color: white; padding: 0px 2px;">
            <div class="div-filtri div-accordion">
                <div class="header mo-intestazione">
                    <label>FILTRI</label>
                    <img class="icon lg-iupdown mo-pointer w3-right" src="icon/ArrowUp.svg" state="up" style="width: 17px;" />
                    <img class="mo-pointer lg-mr-6 w3-right" src="icon/Filter.svg" style="width: 15px; margin-top: 2px;" />
                </div>
                <div class="w3-row">
                    <div class="content w3-container lg-mt-5 lg-mt-5">
                        <div class="mo-display-inlineblock w3-left" style="width: 49%;">
                            <label class="lg-lbl-da">TIPO DOCUMENTO</label><br />
                            <input name="Cd_DO" type="text" class="lg-input" style="width: 90px;" />
                            <br />
                            <label class="lg-lbl-da">CLIENTE/FORNITORE</label><br />
                            <input name="Cd_CF" type="text" class="lg-input" style="width: 100px;" />
                        </div>
                        <div class="mo-display-inlineblock w3-right" style="width: 49%;">
                            <label class="lg-lbl-da">SO</label><br />
                            <input name="Cd_CFDest" type="text" class="lg-input" style="width: 90px;" />
                            <br />
                            <label class="lg-lbl-da">DATA CONSEGNA</label><br />
                            <input name="DataConsegna" type="date" class="lg-input" style="width: 200px;" />
                        </div>
                    </div>
                    <div class="w3-center lg-mt-5">
                        <button class="btn-filtri lg-btn-blue mo-display-inlineblock w3-right" style="width: 50%;" onclick="Ajax_xmofn_DOTes_Prel_4Detail();">Cerca</button>
                    </div>
                </div>
            </div>
            <%--<div class="lg-mt-5">
                <label class="title lg-lbl-da">DOC</label><br />
                <select name="Cd_DO" class="lg-input" style="width: 30%"></select>
            </div>--%>
            <%--<div class="mo-intestazione">
                <img class="i-dotescked icon mo-pointer" src="icon/UnCheckbox.svg" style="width: 19px;" onclick="PrelDOSel();" />
                <label class="DOSel lg-mr-6"></label>
                <label>DOCUMENTI PER IL PRELIEVO</label>
            </div>--%>
        </div>
        <%-- style="position: absolute; top: 130px; right: 5px; left: 5px;" --%>
        <div class="pgmain">
            <%-- UL dei documenti prelevabili --%>
            <ul class="w3-ul lg-docapul lg-gray">
                <li class="template w3-bar mo-pointer w3-white" style="display: none;">
                    <div class="mo-display-inlineblock w3-left lg-mt-5">
                        <label class="container" style="padding-left: 0px; margin-left: 3px;">
                            <input class="ck-documento" type="checkbox" />
                            <span class="checkmark" style="margin-top: 4px;"></span>
                        </label>
                    </div>
                    <div class="w3-bar-item lg-prel-lifont mo-display-inlineblock" style="margin-left: 9px;">
                        <span class="id-dotes lg-tag w3-tag"></span>
                        <span class="cd-do lg-fontblue mo-pointer lg-underline lg-mr-6"></span>
                        <span class="do-desc"></span>
                        <br />
                        <span class="cd-cf"></span>
                        <br />
                        <span class="numerodoc"></span>
                        <span class="datadoc"></span>
                        <br />
                        <span class="dataconsegna"></span>
                    </div>
                </li>
            </ul>
            <span class="msg"></span>
        </div>
    </div>

    <%-- #4.10 Detail_INM2_Operatori --%>
    <div id="Detail_INM2_Operatori" class="lg-modal lg-gray lg-zindex-200">
        <header class="lg-modalheader lg-pt-5">
            <img class="lg-navbarback mo-pointer lg-ml-15 w3-left" style="margin-top: 4px;" src="icon/Back.svg" onclick="HideAndFocus('Detail_INM2_Operatori');" />
            <label class="lg-title lg-ml-20">Elenco Operatori Attivi</label>
        </header>
        <ul class="w3-ul lg-ul lg-gray lg-mt-5">
            <li class="template w3-white" style="display: none;">
                <label class="cdoperatore lg-srlbl-desc"></label>
                <label class="lbl-attivo w3-right lg-lblstd"></label>
            </li>
        </ul>
        <label class="mo-msg lg-mt-15"></label>
    </div>

    <%-- #4.11 DetailGiacenzaUbicazione fnl --%>
    <div id="DetailGiacenzaUbicazione" class="lg-modal lg-gray lg-zindex-200">
        <header class="lg-modalheader lg-pt-5">
            <img class="lg-navbarback mo-pointer lg-ml-15 w3-left" style="margin-top: 4px;" src="icon/Back.svg" onclick="HideAndFocus('DetailGiacenzaUbicazione');" />
            <label class="lg-title lg-ml-20">Giacenza</label>
            <img class="mo-pointer w3-margin-right w3-right update" src="icon/Aggiorna.svg" style="width: 1.6em" />
        </header>
        <div style="overflow-y: auto; border-top: 2px solid #D6D1D1;">
            <table class="lg-table w3-table w3-striped w3-white">
                <thead>
                    <tr>
                        <th class="w3-small lg-bold lg-fontblue" colspan="3">MG > UBICAZIONE</th>
                        <th class="lg-lbl-da w3-small w3-right-align">
                            <label class="switch w3-right">
                                <input class="ck-qtapos" type="checkbox" onclick="Detail_GiacenzaUbicazione_Filter();" value="" />
                                <span class="slider round"></span>
                            </label>
                        </th>
                        <th class="w3-small"></th>
                    </tr>
                    <tr style="margin: 3px 0px;">
                        <th class="lg-lbl-da">AR</th>
                        <th class="lg-lbl-da Descrizione">DESC.</th>
                        <th class="lg-lbl-da th-rolling" roll="Cd_ARLotto">LOTTO</th>
                        <th class="lg-lbl-da th-rolling" roll="Cd_DOSottoCommessa">COMMESSA</th>
                        <th class="lg-lbl-da Quantita">QTA.</th>
                        <%--                        <th class="lg-lbl-da QuantitaDisp">DISPONIBILITA'</th>
                        <th class="lg-lbl-da QuantitaDImm">IMMEDIATO</th>--%>
                        <th class="lg-lbl-da QuantitaDImm">UM</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="template tr-link" style="display: none;">
                        <td class="w3-small Cd_AR"></td>
                        <td class="w3-small AR_Descrizione"></td>
                        <td class="w3-small Cd_ARLotto"></td>
                        <td class="w3-small Cd_DOSottoCommessa"></td>
                        <td class="w3-small w3-right-align Quantita"></td>
                        <%--                        <td class="w3-small w3-right-align QuantitaDisp"></td>
                        <td class="w3-small w3-right-align QuantitaDImm"></td>--%>
                        <td class="w3-small w3-right-align Cd_ARMisura"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>


    <%-- #5.00 PopupMsg fnl --%>
    <div id="PopupMsg" class="w3-modal" style="z-index: 999">
        <div class="w3-modal-content lg-mw-500">
            <div style="height: 4px; background-color: #FFDA44;">
            </div>
            <div class="w3-container w3-center w3-margin-top" style="overflow-y: auto">
                <img style="height: 1.9em;" class="w3-margin-bottom" src="icon/WarningOrange.svg" />
                <br />
                <label class="title lg-popuptitle">MESSAGGIO</label>
                <br />
                <label class="msg lg-popupdom"></label>
                <div class="div-btn w3-row w3-margin-top w3-margin-bottom">
                    <button class="lg-btn-blue mo-pointer" style="width: 80px !important;" onclick="HideAndFocus('PopupMsg');">OK</button>
                </div>
            </div>
            <div class="footer-info">
                <span name="Versione"></span>
                <span name="Ditta"></span>
                <span name="Terminale"></span>
                <span name="Cd_Operatore"></span>
                <span name="DataOra"></span>
            </div>
        </div>
    </div>

    <%-- #5.01 Popup_DocAperti_Del (CONFERMA ELIMINAZIONE DOCUMENTO APERTO) fnl --%>
    <div id="Popup_DocAperti_Del" class="w3-modal lg-zindex-200">
        <div class="w3-modal-content lg-mw-500">
            <div class="lg-blue" style="height: 4px;">
            </div>
            <div class="w3-container w3-center w3-margin-top">
                <div class="w3-badge lg-badge lg-blue">
                    <img style="height: 1.9em;" src="icon/EliminaBianco.svg" />
                </div>
                <br />
                <label class="lg-popuptitle lg-mt-5">Eliminazione del documento</label><br />
                <label class="do-info lg-lbldoinfo w3-margin-bottom"></label>
                <br />
                <br />
                <label class="lg-popupdom">Confermare l'eliminazione del documento?</label><br />
                <div class="w3-row lg-divbutton">
                    <button class="lg-deldocannulla mo-pointer" onclick="HideAndFocus('Popup_DocAperti_Del');">Annulla</button>
                    <button class="lg-deldocconferma mo-pointer" onclick="DocAperti_DeleteIt($('#Popup_DocAperti_Del').attr('iddoc'));">Confermare</button>
                </div>
            </div>
        </div>
    </div>

    <%-- #5.02 Popup_Del_Lettura (CONFERMA ELIMINAZIONE LETTURA) fnl --%>
    <div id="Popup_Del_Lettura" class="w3-modal lg-zindex-202">
        <div class="w3-modal-content lg-mw-500">
            <div class="lg-blue" style="height: 4px;">
            </div>
            <div class="w3-container w3-center w3-margin-top">
                <div class="w3-badge lg-badge lg-blue">
                    <img style="height: 1.9em;" src="icon/EliminaBianco.svg" />
                </div>
                <br />
                <label class="lg-popuptitle">Eliminazione Lettura</label>
                <br />
                <br />
                <label class="lg-popupdom">Conferma l'eliminazione della lettura?</label>
                <div class="w3-row lg-divbutton">
                    <button class="lg-deldocannulla mo-pointer" onclick="$('#Popup_Del_Lettura').hide();">Annulla</button>
                    <button class="lg-deldocconferma mo-pointer" onclick="Delete_Lettura($('#Popup_Del_Lettura').attr('Id_Del'));">Confermare</button>
                </div>
            </div>
        </div>
    </div>

    <%-- #5.021 Popup_Edit_Lettura (CONFERMA EDIT LETTURA) fnl --%>
    <div id="Popup_Edit_Lettura" class="w3-modal lg-zindex-202">
        <div class="w3-modal-content lg-mw-500">
            <div class="lg-orange" style="height: 4px;">
            </div>
            <div class="w3-container w3-center w3-margin-top">
                <div class="w3-badge lg-badge lg-gray">
                    <img style="height: 1.9em;" src="icon/edit-24.png" />
                </div>
                <br />
                <label class="lg-popuptitle">Modifica Lettura</label>
                <br />
                <br />
                <label class="lg-popupdom">Conferma modifica della lettura?</label>
                <div class="w3-row lg-divbutton">
                    <button class="lg-deldocannulla mo-pointer" onclick="$('#Popup_Edit_Lettura').hide();">Annulla</button>
                    <button class="lg-deldocconferma mo-pointer" onclick="Edit_Lettura($('#Popup_Edit_Lettura').attr('Key_Edit'));">Confermare</button>
                </div>
            </div>
        </div>
    </div>

    <%-- #5.03 Popup_Delete_Last_Read (CONFERMA ELIMINAZIONE DELL'ULTIMA LETTURA) fnl --%>
    <div id="Popup_Delete_Last_Read" class="w3-modal lg-zindex-202">
        <div class="w3-modal-content lg-mw-500">
            <div class="lg-blue" style="height: 4px;">
            </div>
            <div class="w3-container w3-center w3-margin-top">
                <div class="w3-badge lg-badge lg-blue">
                    <img style="height: 1.9em;" src="icon/EliminaBianco.svg" />
                </div>
                <br />
                <label class="lg-popuptitle">Eliminazione Ultima Lettura</label>
                <br />
                <br />
                <label class="lg-popupdom">Confermare l'eliminazione dell'ultima lettura?</label>
                <div class="w3-row lg-divbutton">
                    <button class="lg-deldocannulla" onclick="HideAndFocus('Popup_Delete_Last_Read');">Annulla</button>
                    <button class="lg-deldocconferma" onclick="Delete_Last_Read();">Confermare</button>
                </div>
            </div>
        </div>
    </div>

    <%-- #5.04 Popup_Button_OpConfirm (RICHIESTA CONFERMA DELL'OPERATORE PER I CONTROLLI DAL BOTTONE CONFERMA DELLA PG) fnl --%>
    <div id="Popup_Button_OpConfirm" class="w3-modal lg-zindex-202">
        <div class="w3-modal-content lg-mw-500">
            <div class="lg-blue" style="height: 4px;">
            </div>
            <div class="w3-container w3-center w3-margin-top">
                <label class="msg lg-popuptitle"></label>
                <br />
                <br />
                <label class="lg-popupdom">Vuoi continuare?</label>
                <div class="div-btn w3-row lg-divbutton">
                    <%-- Se l'operatore dice NO! resetto lo Step dei controlli del salvataggio delle rilevazioni --%>
                    <button class="lg-btn-white" onclick="oPrg.RL.StepCtrl = 1; HideAndFocus('Popup_Button_OpConfirm');">No</button>
                    <%-- Se l'operatore dice SI! proseguo con lo Step dei controlli del salvataggio delle rilevazioni --%>
                    <button class="lg-btn-blue" onclick="Confirm_Read(false); HideAndFocus('Popup_Button_OpConfirm');">Si</button>
                </div>
            </div>
        </div>
    </div>

    <%-- #5.05 Popup_Sscc_OpConfirm (RICHIESTA CONFERMA DELL'OPERATORE PER I CONTROLLI) fnl --%>
    <div id="Popup_Sscc_OpConfirm" class="w3-modal lg-zindex-202">
        <div class="w3-modal-content lg-mw-500">
            <div style="height: 4px; background-color: #FFDA44;">
            </div>
            <div class="w3-container w3-center w3-margin-top">
                <img style="height: 1.9em;" class="w3-margin-bottom" src="icon/WarningOrange.svg" />
                <br />
                <label class="msg lg-popuptitle"></label>
                <br />
                <br />
                <label class="lg-popupdom">Continuare?</label>
                <div class="div-btn w3-row lg-divbutton">
                    <%-- Se l'operatore dice NO! resetto lo Step dei controlli del salvataggio delle rilevazioni --%>
                    <button class="lg-btn-white" onclick="oPrg.RL.StepCtrl = 1; HideAndFocus('Popup_Sscc_OpConfirm');">No</button>
                    <%-- Se l'operatore dice SI! Continuo con il salvataggio delle rilevazioni --%>
                    <button class="sscc-ok lg-btn-blue" onclick="Ajax_Sscc_Validate($(this).attr('bc_val'), $(this).attr('id_lettura'), false); HideAndFocus('Popup_Sscc_OpConfirm');">Si</button>
                </div>
            </div>
        </div>
    </div>

    <%-- #5.06 Popup_PackList_New (AGGIUNGE UNA NUOVA UNITA' LOGICA ALLA PACKING LIST) fnl --%>
    <div id="Popup_PackList_New" class="w3-modal lg-zindex-200">
        <div class="w3-modal-content lg-mw-500">
            <div style="height: 4px; background-color: #ffc107;">
            </div>
            <div class="w3-container w3-center w3-margin-top">
                <div class="w3-badge lg-badge" style="background-color: #ffc107;">
                    <img style="height: 1.9em;" src="icon/ScatolaBlue.svg" />
                </div>
                <label class="packlist lg-popuptitle"></label>
                <img class="i sp-no mo-pointer w3-right" src="icon/AccessDenied.svg" style="width: 1.2em; height: 1.2em;" onclick="HideAndFocus('Popup_PackList_New');" />
                <div class="w3-row  w3-margin-top">
                    <div class="w3-col s4">
                        <label class="lg-lbl-da w3-margin-top">UL PADRE:</label>
                    </div>
                    <div class="w3-col s8">
                        <select name='PackListRef_P' class="lg-input">
                            <option value="" selected="selected">NESSUNA</option>
                        </select>
                    </div>
                </div>
                <div class="w3-row w3-margin-top">
                    <div class="w3-col s4">
                        <label class="lg-lbl-da">TIPO UL:</label>
                    </div>
                    <div class="w3-col s8">
                        <select name='Cd_xMOUniLog' class="lg-input" onchange="Ajax_xmofn_xMORLRigPackingList_GetNew();">
                            <option value="" selected="selected">Seleziona tipo di UL</option>
                        </select>
                    </div>
                </div>
                <div name="ctlPackListBC" class="w3-row w3-margin-top" style="margin-top: 4px !important; display:none;">
                    <div class="w3-col s2" style="margin-top: 5px;display: inline;text-align: right;">
                        <label class="lg-lbl-da">BC:&nbsp;</label>
                    </div>
                    <div class="w3-col s2" style="display: inline; text-align:left;">
                        <label class="switch w3-center" style="margin-top:5px;">
	                        <input name="ckPackListBC" class="ck-PackListBC" type="checkbox"/>
	                        <span class="slider round"></span>
                        </label>
                    </div>
                    <div class="w3-col s8">
                        <input name="PackListBC" type="text" class="lg-input w3-left-align" />
                    </div>
                </div>
                <div class="w3-row w3-margin-top">
                    <div class="w3-col s4">
                        <label class="lg-lbl-da">CODICE:</label>
                    </div>
                    <div class="w3-col s8">
                        <input name="PackListRef" type="text" class="lg-input w3-right-align" />
                    </div>
                </div>
                <div class="w3-row w3-margin-top">
                    <div class="w3-col s4">
                    </div>
                    <div class="w3-col s8 w3-right">
                        <label class="container w3-left">
                            <label>UL Padre</label>
                            <input class="ck-pk-add-p" type="checkbox" style="position: absolute;" onclick="PackListRef_AddP();" />
                            <span class="checkmark"></span>
                        </label>
                    </div>
                </div>
                <div class="div-btn w3-row lg-divbutton">
                    <button class="bt-pk-add lg-btn-blue" onclick="Ajax_xmosp_xMORLPackListRef_Add();">Inserisci</button>
                    <button class="bt-pk-add-and-issue lg-btn-blue" onclick="Ajax_xmosp_xMORLPackListRef_Add_And_Issue();">
                        <i class="fas fa-caret-square-right w3-margin-right" style="color: #ffeb3b;"></i>Avvia
                    </button>
                </div>
            </div>
        </div>
    </div>

    <%-- #5.07 Popup_PKListAR_DelShift (ELIMINA O SPOSTA UN ARTICOLO DELLA PACKING) fnl --%>
    <div id="Popup_PKListAR_DelShift" class="w3-modal lg-zindex-200">
        <div class="w3-modal-content lg-mw-500">
            <div style="height: 4px; background-color: #ffc107;">
            </div>
            <div class="div-container w3-container w3-margin-top" style="padding-left: 30px !important;">
                <div class="w3-center">
                    <label class="Cd_AR lg-lblstd" style="font-size: 1.3em; color: #0769AA;"></label>
                </div>
                <br />
                <label class="lg-lbl-da">QUANTITA:</label><br />
                <input name="Qta" type="number" class="lg-input w3-margin-right w3-right-align" style="width: 100px;" />
                <label class="Cd_ARMisura lg-lbl-da lg-ml-8"></label>
                <div class="lg-mt-15 lg-mb-10">
                    <label class="lg-popuptitle lg-mt-30 lg-mb-10">SPOSTA IN:</label>
                </div>
                <label class="lg-lbl-da">UNITA' LOGISTICA:</label><br />
                <label class="lg-lbllink mo-pointer w3-margin-right" onclick="Popup_PackList_New_Load();" title="Nuova unità logistica">Crea Nuovo &gt;</label>
            </div>
            <div class="w3-container w3-center" style="padding: 15px !important;">
                <button action="hide" class="lg-btn-white" title="Annulla" style="width: 70px !important">Annulla</button>
                <button action="shift" class="lg-btn-blue" title="Sposta tutta o una parte della qta in un'altra unità logistica" style="width: 70px !important">Sposta</button>
                <button action="delete" class="lg-btn-blue" title="Cancella tutta o una parte della qta" style="width: 70px !important">Elimina</button>
            </div>
        </div>
    </div>

    <%-- #5.071 Popup_PKListUL_Shift (SPOSTA UN PK IN UNA PK_P) fnl --%>
    <div id="Popup_PKListUL_Shift" class="w3-modal lg-zindex-202">
        <div class="w3-modal-content lg-mw-500">
            <div style="height: 4px; background-color: #ffc107;">
            </div>
            <div class="div-container w3-container w3-margin-top" style="padding-left: 30px !important;">
                <div class="w3-col s12">
                    <img class="i sp-no mo-pointer w3-right" src="icon/AccessDenied.svg" style="width: 1.2em; height: 1.2em;" onclick="HideAndFocus('Popup_PKListUL_Shift');" />
                </div>
                <div class="w3-col s4">
                    <label class="lg-lbl-da w3-margin-top">UL:</label>
                </div>
                <div class="w3-col s8">
                    <label class="lg-lbl-da w3-margin-top" name="PackListRef"></label>
                    <label class="lg-lbl-da w3-margin-top" name="Descrizione"></label>
                </div>
                <br />
                <!-- Sposta -->
                <div class="w3-col s12 lg-mt-15 lg-mb-10">
                    <label class="lg-popuptitle lg-mt-30 lg-mb-10">SPOSTA IN:</label>
                </div>
                <div class="w3-col s4">
                    <label class="lg-lbl-da w3-margin-top">UL PADRE:</label>
                </div>
                <div class="w3-col s8">
                    <select name='PackListRef_P' class="lg-input"></select>
                    <div class="w3-right-align">
                        <button action="shift" class="lg-btn-blue lg-mt-5" title="Sposta l'unità logistica in un altro padre" style="width: 70px !important">Sposta</button>
                    </div>
                </div>
                <br />
                <!-- Modifica -->
                <div class="lg-mt-15 lg-mb-10">
                    <label class="lg-popuptitle lg-mt-30 lg-mb-10">CAMBIA IN:</label>
                </div>
                <div class="w3-col s4">
                    <label class="lg-lbl-da w3-margin-top">TIPO UL:</label>
                </div>
                <div class="w3-col s8">
                    <select name='Cd_xMOUniLog' class="lg-input"></select>
                    <div class="w3-right-align">
                        <button action="change" class="lg-btn-blue lg-mt-5" title="Cambia il tipo dell'unità logistica" style="width: 70px !important">Cambia</button>
                    </div>
                </div>
                <!-- Footer -->
                <div class="w3-col s12 lg-mt-10">
                    <br />
                </div>
            </div>
        </div>
    </div>


    <%-- #5.08 Popup_INAperti_Del (CONFERMA ELIMINAZIONE INVENTARIO APERTO) fnl --%>
    <div id="Popup_INAperti_Del" class="w3-modal lg-zindex-202">
        <div class="w3-modal-content lg-mw-500">
            <div class="lg-blue" style="height: 4px;">
            </div>
            <div class="w3-container w3-center w3-margin-top">
                <div class="w3-badge lg-badge lg-blue">
                    <img style="height: 1.9em;" src="icon/EliminaBianco.svg" />
                </div>
                <br />
                <label class="lg-popuptitle">Eliminazione Inventario Aperto</label>
                <br />
                <br />
                <label class="lg-popupdom">Confermare l'eliminazione dell'inventario?</label>
                <div class="w3-row lg-divbutton">
                    <button class="lg-deldocannulla" onclick="$('#Popup_INAperti_Del').hide();">Annulla</button>
                    <button class="lg-deldocconferma" onclick="INAperti_DeleteIt($('#Popup_INAperti_Del').attr('id_xmoin'));">Confermare</button>
                </div>
            </div>
        </div>
    </div>

    <%-- #5.10 Popup_ListnerTesting (VERIFICA LA COMUNICAZIONE CON IL LISTENER)--%>
    <div id="Popup_ListenerTesting" class="w3-modal lg-zindex-202">
        <div class="w3-modal-content lg-mw-500">
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
                    <label class="lg-lbl-da w3-margin-top">Selezionare il Listener:&nbsp;</label>
                    <select name='Listener' class="lg-input" style="width: 60%;">
                    </select>
                </div>
                <div class="div-btn w3-row lg-divbutton">
                    <button class="lg-btn-white" onclick="HideAndFocus('Popup_ListenerTesting');">Annulla</button>
                    <button class="lg-btn-blue" onclick="Listener_Testing();">Verifica</button>
                </div>
            </div>
        </div>
    </div>

    <%-- #5.11 Popup_MGRettifica (Popup per generare una rettifica di magazzino) --%>
    <div id="Popup_MGRettifica" class="w3-modal lg-zindex-202">
        <div class="w3-modal-content lg-mw-500" style="min-height: 350px;">
            <div style="height: 4px; background-color: #ffc107;">
            </div>
            <div class="w3-container w3-margin-top">
                <%-- Esercizio --%>
                <label class="lg-lbl-da">ESERCIZIO</label><br />
                <select name="Cd_MGEsercizio" class="lg-input" disabled="disabled">
                </select><br />
                <label class="lg-lbl-da">DESCRIZIONE</label><br />
                <input name="Descrizione" type="text" class="lg-input" />
                <br />
                <label class="lg-lbl-da" style="font-size: 0.87em;">MAGAZZINO:&nbsp;</label><label class="Cd_MG lg-lbl-da" style="font-size: 0.87em;"></label><br />
                <div class="div-mgubi">
                    <label class="lg-lbl-da" style="font-size: 0.87em;">UBICAZIONE&nbsp;</label><label class="Cd_MGUbicazione lg-lbl-da" style="font-size: 0.87em;"></label>
                </div>
                <label class="lg-lbl-da" style="font-size: 0.87em;">ARTICOLO:&nbsp;</label><label class="Cd_AR lg-lbl-da" style="font-size: 0.87em;"></label><br />
                <div class="div-lotto">
                    <label class="lg-lbl-da" style="font-size: 0.87em;">LOTTO:&nbsp;</label><label class="Cd_ARLotto lg-lbl-da" style="font-size: 0.87em;"></label>
                </div>
                <%-- QTA E UM --%>
                <div class="div-qtaum">
                    <label class="lg-lbl-da" style="font-size: 0.87em;">GIACENZA [AR-MG-UBI-LOTTO]:&nbsp;</label><label class="Giacenza lg-lbl-da" style="font-size: 0.87em;"></label><br />
                    <label class="lg-lbl-da">QTA RILEVATA</label><br />
                    <input name="Quantita" type="number" step="0.001" min="0" class="lg-input w3-right-align" style="width: 35%" tabindex="10" onfocus="Quantita_Onfocus_Popup($(this), 'Popup_MGRettifica');" />
                    <select name="Cd_ARMisura" class="lg-input" style="width: 60px;" tabindex="15">
                    </select>
                </div>
                <label class="lbl-msg lg-lbl-da"></label>
            </div>
            <div class="div-btn w3-row lg-divbutton">
                <button class="lg-btn-white" onclick="HideAndFocus('Popup_MGRettifica');">Annulla</button>
                <button class="lg-btn-blue" onclick="Ajax_xmosp_xMOIN_MakeOne_MGMov_Popup();">Crea</button>
            </div>
        </div>
    </div>

    <%-- #5.50 Popup_YNA --%>
    <div id="Popup_YNA" class="w3-modal lg-zindex-202">
        <div class="w3-modal-content lg-mw-500">
            <div style="height: 4px; background-color: #FFDA44;">
            </div>
            <div class="w3-container w3-center w3-margin-top" style="overflow-y: auto">
                <img style="height: 1.9em;" class="w3-margin-bottom" src="icon/DocumentoINTMG.svg" />
                <br />
                <label class="title lg-popuptitle">DOMANDA</label>
                <br />
                <label class="msg lg-popupdom"></label>
                <div class="div-btn w3-row w3-margin-top">
                    <button class="btn-yes   lg-btn-blue mo-pointer" style="width: 80px !important;" onclick="popup_yna.close('y');">SI</button>
                    <button class="btn-no    lg-btn-blue mo-pointer" style="width: 80px !important;" onclick="popup_yna.close('n');">NO</button>
                    <button class="btn-abort lg-btn-blue mo-pointer" style="width: 80px !important;" onclick="popup_yna.close('a');">Annulla</button>
                </div>
            </div>
            <div style="height: 4px; background-color: #FFDA44;">
            </div>
        </div>
    </div>

    <%-- #5.60 Popup_INAperti_M2_Del (CONFERMA ELIMINAZIONE INVENTARIO APERTO CONDIVISO) fnl --%>
    <div id="Popup_INAperti_M2_Del" class="w3-modal lg-zindex-202">
        <div class="w3-modal-content lg-mw-500">
            <div class="lg-blue" style="height: 4px;">
            </div>
            <div class="w3-container w3-center w3-margin-top">
                <div class="w3-badge lg-badge lg-blue">
                    <img style="height: 1.9em;" src="icon/EliminaBianco.svg" />
                </div>
                <br />
                <label class="lg-popuptitle">Eliminazione Inventario Condiviso Aperto</label>
                <br />
                <br />
                <label class="lg-popupdom">Confermare l'eliminazione dell'inventario?</label>
                <div class="w3-row lg-divbutton">
                    <button class="lg-deldocannulla" onclick="$('#Popup_INAperti_M2_Del').hide();">Annulla</button>
                    <button class="lg-deldocconferma" onclick="INAperti_M2_DeleteIt($('#Popup_INAperti_M2_Del').attr('id_xmoin'));">Confermare</button>
                </div>
            </div>
        </div>
    </div>

    <%-- #5.60 Popup_DMS --%>
    <div id="Popup_DMS" class="w3-modal lg-zindex-202">
        <div class="w3-modal-content lg-mw-500">
            <div class="lg-blue" style="height: 4px;">
            </div>
            <div class="w3-container w3-center w3-margin-top">
                <div class="w3-row">
                    <div class="w3-badge lg-badge lg-blue">
                        <i class="fas fa-paperclip"></i>
                    </div>
                    <br />
                    <label class="lg-popuptitle lg-mt-5">Elenco allegati</label><br />
                    <label class="do-info lg-lbldoinfo w3-margin-bottom"></label>
                </div>
                <br />
                <div class="w3-row">
                    <ul class="w3-ul w3-left dms">
                        <li class="template w3-bar mo-pointer w3-white" style="display: none;">
                            <div class="w3-bar-item w3-left-align">
                                <span class="id lg-tag w3-tag"></span>
                                <span class="descrizione"></span>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="w3-row w3-center w3-margin-bottom">
                    <button class="lg-btn-white" onclick="HideAndFocus('Popup_DMS');">Chiudi</button>
                </div>
            </div>
        </div>
    </div>

    <%-- #5.60 Popup_Note --%>
    <div id="Popup_Note" class="w3-modal lg-zindex-202">
        <div class="w3-modal-content lg-mw-500">
            <div class="lg-blue" style="height: 4px;">
            </div>
            <div class="w3-container w3-center w3-margin-top">
                <div class="w3-row">
                    <div class="w3-badge lg-badge lg-blue">
                        <i class="far fa-comment-alt"></i>
                    </div>
                    <br />
                    <label class="lg-popuptitle lg-mt-5">Note</label><br />
                    <label class="do-info lg-lbldoinfo w3-margin-bottom"></label>
                </div>
                <br />
                <div class="w3-row">
                    <ul class="w3-ul w3-left note">
                        <li class="template w3-white" style="display: none;">
                            <div class="w3-left-align">
                                <span class="descrizione"></span>
                                <p class="nota"></p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="w3-row w3-center w3-margin-bottom">
                    <button class="lg-btn-white" onclick="HideAndFocus('Popup_Note');">Chiudi</button>
                </div>
            </div>
        </div>
    </div>

    <%-- #5.70 Popup_VaiAUbi --%>
    <div id="Popup_VaiAUbi" class="w3-modal lg-zindex-202">
        <div class="w3-modal-content lg-mw-500">
            <div class="w3-yellow" style="height: 4px;">
            </div>
            <div class="w3-container w3-margin-top">
                <div class="w3-row w3-centered">
                    <label class="lg-popuptitle lg-mt-5 w3-margin-right">Vai a ubicazione</label>
                    <label class="vai-a-ubicazione w3-tag w3-xlarge w3-yellow" onclick="doveVado_Shortcut();"></label>
                    <img class="i sp-no mo-pointer w3-right" src="icon/AccessDenied.svg" style="width: 1.2em; height: 1.2em;" onclick="doveVado_Hide();" />
                </div>
                <div class="w3-row w3-margin-top">
                    <label class="lg-lbl-mg">Magazzino</label>
                    <input name="Cd_MG_a" class="lg-input" type="text" placeholder="..." style="width: 80px;" />
                </div>
                <div class="w3-row w3-margin-top">
                    <label class="lg-lbl-mgubicazione">Ubicazione</label>
                    <input name="Cd_MGUbicazione_a" class="first-focus lg-input" type="text" placeholder="..." style="width: 180px;" />
                </div>
                <div class="w3-row w3-margin-top">
                    <label class="info"></label>
                </div>
                <div class="w3-row w3-center w3-margin-top w3-margin-bottom">
                    <button class="lg-btn-white w3-light-gray w3-margin-right" onclick="doveVado_Set(true);">No ubicazione</button>
                    <button class="lg-btn-white" onclick="doveVado_Set(false);">Conferma</button>
                </div>
            </div>
        </div>
    </div>

    <%-- #5.75 Popup_Issue_cp --%>
    <div id="Popup_Issue_cp" class="w3-modal lg-zindex-202">
        <div class="w3-modal-content lg-mw-500">
            <div class="w3-yellow" style="height: 4px;">
            </div>
            <div class="w3-container">
                <div class="w3-row w3-centered w3-margin-top">
                    <label class="lg-popuptitle lg-mt-5 w3-margin-right">Vai a ubicazione</label>
                    <img class="i sp-no mo-pointer w3-right" src="icon/AccessDenied.svg" style="width: 1.2em; height: 1.2em;" onclick="issue.close();" />
                    <label class="vai-a-ubicazione w3-tag w3-xlarge w3-yellow" data-key="Cd_MGUbicazione"></label>
                </div>
                <div class="w3-row">
                    <div class="w3-col s6">
                        <label class="w3-xsmall" style="color: #535353;">ARTICOLO</label><br />
                        <label class="lg-lbl-mg w3-large w3-tag w3-blue" data-key="Cd_AR"></label>
                        <br />
                        <label class="w3-xsmall lg-lbl-mg" data-key="AR_Descrizione" style="font-size: 12px;"></label>
                    </div>
                    <div class="w3-col s6">
                        <label class="w3-xsmall" style="color: #535353;">LOTTO</label><br />
                        <label class="lg-lbl-mg w3-large w3-tag w3-green" data-key="Cd_ARLotto"></label>
                    </div>
                </div>
                <div class="w3-row">
                    <div class="w3-col s6">
                        <label class="w3-xsmall" style="color: #535353;">QUANTITA</label><br />
                        <label class="lg-lbl-mg w3-large w3-tag w3-red" data-key="Quantita"></label>
                        <label class="lg-lbl-mg">&nbsp;/&nbsp;</label>
                        <label class="lg-lbl-mg w3-small" data-key="QtaLetta"></label>
                        <label class="lg-lbl-mg">&nbsp;/&nbsp;</label>
                        <label class="lg-lbl-mg w3-small" data-key="QtaEvadibile"></label>
                        <label class="lg-lbl-mg w3-small" data-key="Cd_ARMisura"></label>
                        <label name="InfoExt" class="lg-lbl-da-wki" style="display: inline-block;"></label>
                    </div>
                    <div class="w3-col s6">
                        <label class="w3-xsmall" style="color: #535353;">MATRICOLA</label><br />
                        <label class="lg-lbl-mg" data-key="Cd_xMOMatricola"></label>
                    </div>
                </div>
                <div class="w3-row">
                    <div class="w3-col s6">
                        <label class="w3-xsmall" style="color: #535353;">MAGAZZINO</label><br />
                        <label class="lg-lbl-mg" data-key="Cd_MG"></label>
                    </div>
                    <div class="w3-col s6">
                        <label class="lg-bold" data-key="BC_Label" style="color: #535353;">BC</label><br />
                        <input name="BC" class="first-focus lg-input" type="text" style="width: 100%;" />
                        <label class="lg-lbl-mg" data-key="BC_Error" style="color: #ff0000; font-size: 12px;"></label>
                    </div>
                </div>
                <div class="w3-row PackListRef w3-margin-top">
                    <div class="w3-col s12 w3-amber">
                        <label class="w3-small w3-margin-left" style="color: #535353;">PACKING LIST</label>
                        <label class="lg-lbl-mg w3-small" data-key="PackListRef"></label>
                    </div>
                </div>
                <div class="w3-row w3-center w3-margin-top w3-margin-bottom" style="display: flex; gap: 10px;">
                    <button data-id="issue_ignore_ub" class="lg-btn-white" onclick="issue.cp.skip(false)">Ignora Ub</button>
                </div>
                <div class="w3-row w3-center w3-margin-top w3-margin-bottom" style="display: flex; gap: 10px;">
                    <button class="lg-btn-white" onclick="issue.cp.clear()">Pulisci</button>
                    <button class="lg-btn-white" onclick="issue.cp.modify()">Modifica</button>
                    <button data-id="issue_roll_confirm" class="lg-btn-white" onclick="issue.cp.bcValidate()" style="display: none;">Conferma</button>
                </div>
            </div>
        </div>
    </div>

    <%-- #5.76 Popup_Issue_ad --%>
    <div id="Popup_Issue_ad" class="w3-modal lg-zindex-202">
        <div class="w3-modal-content lg-mw-500">
            <div class="w3-yellow" style="height: 4px;">
            </div>
            <div class="w3-container">
                <div class="w3-row w3-centered w3-margin-top">
                    <label class="lg-popuptitle lg-mt-5 w3-margin-right">In sviluppo...</label>
                    <img class="i sp-no mo-pointer w3-right" src="icon/AccessDenied.svg" style="width: 1.2em; height: 1.2em;" onclick="issue.close();" />
                </div>
            </div>
        </div>
    </div>

    <%-- #5.77 Popup_Issue_ca --%>
    <div id="Popup_Issue_ca" class="w3-modal lg-zindex-202">
        <div class="w3-modal-content lg-mw-500">
            <div class="w3-yellow" style="height: 4px;">
            </div>
            <div class="w3-container">
                <div class="w3-row w3-centered w3-margin-top">
                    <label class="lg-popuptitle lg-mt-5 w3-margin-right">Vai a ubicazione</label>
                    <img class="i sp-no mo-pointer w3-right" src="icon/AccessDenied.svg" style="width: 1.2em; height: 1.2em;" onclick="issue.close();" />
                    <label class="vai-a-ubicazione w3-tag w3-xlarge w3-yellow" data-key="Cd_MGUbicazione"></label>
                </div>
                <div class="w3-row">
                    <div class="w3-col s6">
                        <label class="w3-xsmall" style="color: #535353;">ARTICOLO</label><br />
                        <label class="lg-lbl-mg w3-large w3-tag w3-blue" data-key="Cd_AR">Articolo</label><br />
                        <label class="w3-xsmall lg-lbl-mg" data-key="AR_Descrizione" style="font-size: 12px;"></label>
                    </div>
                    <div class="w3-col s6">
                        <label class="w3-xsmall" style="color: #535353" onclick="issue.ca.lottiShow(true)" ;>LOTTO</label><br />
                        <label class="lg-lbl-mg w3-large w3-tag w3-green lg-pointer" data-key="Cd_ARLotto" onclick="issue.ca.lottiShow(true);"></label>
                        <select class="ar-lotti lg-input w3-green" style="width: 100%;" onchange="issue.ca.lottiSelect();"></select>
                    </div>
                </div>
                <div class="w3-row">
                    <div class="w3-col s6">
                        <label class="w3-xsmall" style="color: #535353;">QUANTITA</label><br />
                        <label class="lg-lbl-mg w3-large w3-tag w3-red" data-key="Quantita"></label>
                        <label class="lg-lbl-mg">&nbsp;/&nbsp;</label>
                        <label class="lg-lbl-mg w3-small" data-key="QtaResidua"></label>
                        <label class="lg-lbl-mg w3-small" data-key="Cd_ARMisura"></label>
                        <label name="InfoExt" class="lg-lbl-da-wki" style="display: inline-block;"></label>
                    </div>
                    <div class="w3-col s6">
                        <label class="w3-xsmall" style="color: #535353;">MATRICOLA</label><br />
                        <label class="lg-lbl-mg" data-key="Cd_xMOMatricola"></label>
                    </div>
                </div>
                <div class="w3-row">
                    <div class="w3-col s6">
                        <label class="w3-xsmall" style="color: #535353;">MAGAZZINO</label><br />
                        <label class="lg-lbl-mg" data-key="Cd_MG"></label>
                    </div>
                    <div class="w3-col s6">
                        <label class="lg-bold" data-key="BC_Label" style="color: #535353;">BC</label><br />
                        <input name="BC" class="first-focus lg-input" type="text" style="width: 100%;" />
                        <label class="lg-lbl-mg" data-key="BC_Error" style="color: #ff0000; font-size: 12px;"></label>
                    </div>
                </div>
                <div class="w3-row PackListRef w3-margin-top">
                    <div class="w3-col s12 w3-amber">
                        <label class="w3-small w3-margin-left" style="color: #535353;">PACKING LIST</label>
                        <label class="lg-lbl-mg w3-small" data-key="PackListRef"></label>
                    </div>
                </div>
                <div class="w3-row w3-center w3-margin-top w3-margin-bottom" style="display: flex; gap: 10px;">
                    <button class="lg-btn-white" onclick="issue.ca.skip(false)">Ignora Ub</button>
                </div>
                <div class="w3-row w3-center w3-margin-top w3-margin-bottom" style="display: flex; gap: 10px;">
                    <button class="lg-btn-white" onclick="issue.ca.skip(true)">Ignora AR</button>
                    <button class="lg-btn-white" onclick="issue.ca.modify()">Modifica</button>
                    <button data-id="issue_roll_confirm" class="lg-btn-white" onclick="issue.ca.bcValidate()" style="display: none;">Conferma</button>
                </div>
            </div>
        </div>
    </div>

    <%-- #5.70 Popup_BC_Select --%>
    <div id="Popup_BC_Select" class="w3-modal lg-zindex-202">
        <div class="w3-modal-content lg-mw-500">
            <div class="w3-yellow" style="height: 4px;">
            </div>
            <div class="w3-container w3-margin-top">
                <div class="w3-row w3-centered">
                    <div class="we-col s12">
                        <label class="lg-popuptitle lg-mt-5 w3-margin-right">Seleziona Barcode</label>
                        <ol data-key="BarcodeList"></ol>
                    </div>
                </div>
                <div class="w3-row w3-margin-top w3-margin-bottom">
                    <div class="w3-col w3-center ">
                        <button class="lg-btn-white">Chiudi</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <%-- #5.90 Popup_PIN --%>
    <div id="Popup_PIN" class="w3-modal" style="z-index: 999">
        <div class="w3-modal-content lg-mw-500">
            <div style="height: 4px; background-color: #FFDA44;">
            </div>
            <div class="w3-container w3-center w3-margin-top" style="overflow-y: auto">
                <img style="height: 1.9em;" class="w3-margin-bottom" src="icon/WarningOrange.svg" />
                <br />
                <label class="title lg-popuptitle">Inserisci PIN per continuare</label>
                <br />
                <input id="Popup_PIN_input" type="password" class="md-input" />
                <label class="msg lg-popupdom"></label>
                <div class="div-btn w3-row w3-margin-top w3-margin-bottom">
                    <button class="lg-btn-white mo-pointer" style="width: 80px !important;" onclick="$('#Popup_PIN').hide()">Annulla</button>
                    <button id="Popup_PIN_Ok_button" class="lg-btn-blue mo-pointer" style="width: 80px !important;" <%--onclick="HideAndFocus('PopupMsg');"--%>>OK</button>
                </div>
            </div>
            <div class="footer-info">
                <span name="Versione"></span>
                <span name="Ditta"></span>
                <span name="Terminale"></span>
                <span name="Cd_Operatore"></span>
                <span name="DataOra"></span>
            </div>
        </div>
    </div>
</body>
</html>



//function Barcode(codifica, tipo, bardcode, Lettura, conferma) {
//    this.codifica = codifica;
//    this.tipo = tipo;
//    this.barcode = bardcode;
//    this.Lettura = Lettura;
//    this.conferma = conferma;
//}


//Barcode.prototype.add = function (codifica, tipo, bardcode, Lettura, conferma) {
//    this.codifica = codifica;
//    this.tipo = tipo;
//    this.barcode = bardcode;
//    this.Lettura = Lettura;
//    this.conferma = conferma;
//}


function normalizzatoreLettura(lettura) {
    var BC = new Barcode(dtBarcode);
}


/****************** CODIFICA *************************/
var dtBarcode = {
    'GS1': {
        'Descrizione': 'GS1',
        'Tipo': 0,
        'Struttura': {
            '01': {
                'Idx': 0,
                'Column': 'EAN',
                'Len': [14,14]
            },
            '10': {
                'Idx': 1,
                'Column': 'Cd_ARLotto',
                'Len': [1, 8]
            },
            '15': {
                'Idx': 2,
                'Column': 'DataScadenza',
                'Len': [6,6]
            },
            '20': {
                'Idx': 3,
                'Column': 'Quantita',
                'Len': [2,2]
            },
            '37': {
                'Idx': 4,
                'Column': 'ProcProd',
                'Len': [1, 8]
            }
        }
    },
    'SSCC': {
        'Descrizione': 'SSCC',
        'Tipo': 0,
        'Struttura': {
            '00': {
                'Idx': 0,
                'Column': 'Matricola',
                'Len': [18, 18]
            }
        }
    }
}

// Contiene l'interpretazione del barcode selezionato
var Lettura = null;


function Barcode_Interpreta(str, barcode) {
    var res = [];

    //In base al tipo, gestisco l'interpretazione
    switch (barcode.Tipo) {
        case 0: // GS1 Standard
            Interpreta_GS1(str, '', res, barcode.Struttura);
            //Se la lettura non è valida la rimuovo dall'array
            $.each(res, function (idx, item) {
                if (!IsValid(item, barcode.Struttura)) {
                    res.pop(item);
                }
            });

            // ATTENZIONE, Se res.length > 1 (HO TROVATO + VALORI VALIDI), altrimenti creo la lettura
            Lettura = (res.length == 1 ? CreaLettura(res[0], barcode.Struttura) : null);
            if (Lettura != null) {
                var bar = new Barcode;
                bar.add(barcode.Descrizione, barcode.Tipo, str, Lettura, 1);
                dtBarcodeLetti.push(bar);
            }

            break;
        case 1: // Barcode strutturato
            res.push(str);
            Interpreta_STRUTTURATO(str);
            var bar = new Barcode;
            bar.add(barcode.Descrizione, barcode.Tipo, str, Lettura, 1);
            dtBarcodeLetti.push(bar);
        default:
            res = null;
            break;
    }

    return res;
}

function Interpreta_GS1(str, path, res, struttura) {
    // push solution path if we've successfully
    // made it to the end of the string
    if (str == '') {
        res.push(path);
        return;
    }

    var i, j, ai, code;

    // find next AI code
    for (
        i = 0, ai = void (0);
        i < str.length && (ai = (struttura[code = str.substr(0, i)] != undefined ? struttura[code = str.substr(0, i)].Len : undefined)) === undefined;
        i++
    ) { }


    if (ai !== undefined) {
        // recode AI definition to unique format [ MIN, MAX ]
        ai = typeof ai == 'object' ? ai : [ai, ai];
        // iterate on all possible lengths and perform recursive call
        for (j = ai[0]; j <= ai[1]; j++) {
            if (i + j <= str.length) {
                Interpreta_GS1(str.substr(i + j), path + '(' + code + ')' + str.substr(i, j), res, struttura);
            }
        }
    }
}

//Interpreta il barcode in base alla struttura
function Interpreta_STRUTTURATO(str) {
    var ar = [];

    $.each(dtAI, function (key, val) {
        ar[val.Idx] = { 'Column': val.Column, 'Len': val.Len };
    });

    for (var i = 0; i < ar.length; i++) {

        obj = ar[i];

        Lettura[obj.Column] = str.substr(0, obj.Len);

        str = str.substr(obj.Len);
    }
}

//Restituisce l'interpretazione correta'
function IsValid(res, struttura) {

    var ret = true;

    $.each(struttura, function (r, i) {
        //[(]10[)]
        var exp = res.match(new RegExp("[(]" + r + "[)]", "g"));
        // Non trovato
        if (exp == null || exp.length != 1) {
            ret = false;
            return;
        }
    });

    return ret;
}


function CreaLettura(res, struttura) {
    Lettura = {};
    var ar = [];

    $.each(struttura, function (key, val) {
        ar[val.Idx] = { 'AI': key, 'Column': val.Column };
    });

    for (var i = 0; i < ar.length; i++) {

        obj = ar[i];
        obj1 = ar[i + 1];

        var sIdx = res.indexOf("(" + obj.AI + ")");
        var eIdx = (obj1 != undefined ? res.indexOf("(" + obj1.AI + ")") : undefined);

        Lettura[obj.Column] = res.substr(sIdx, eIdx).replace("(" + obj.AI + ")", "");

        res = res.substr(eIdx);
    }

    return Lettura;
}
<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="testcolli.aspx.cs" Inherits="Logistica.testbc" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <script src="js/jquery-3.2.0.min.js"></script>
    <script src="js/Global.js"></script>
    <link href="style/w3.css" rel="stylesheet" />
    <link href="style/Logistica.css" rel="stylesheet" />
    <title>Test Colli</title>
</head>
<body class="w3-center" style="background-color: #EDEDED;">
    <script>
        $(document).ready(function () {

            $("#btnPesoLordo").click(function() {
                $(".div-cpvstd input[name='PesoLordo']").val(Ajax_xmofn_xMORLPiede_PesoVolume("L"));
            })

            $("#btnPesoNetto").click(function() {
                $(".div-cpvstd input[name='PesoNetto']").val(Ajax_xmofn_xMORLPiede_PesoVolume("N"));
            })

            $("#btnVolumeTotale").click(function() {
                $(".div-cpvstd input[name='VolumeTotale']").val(Ajax_xmofn_xMORLPiede_PesoVolume("V"));
            })

        });

        function Ajax_xmofn_xMORLPiede_PesoVolume(NLV) {

            var out = 0;

            Params = JSON.stringify({
                Terminale: oApp.Terminale,
                Cd_Operatore: oApp.Cd_Operatore,
                Id_xMORL: fU.ToString(2),
                NLV: NLV
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
                    out = r[0].Result;
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
                }
            });

            return out;
        }

    </script>

    <div style="width: 100%">
        <div class="lg-mt-5">
            <div class="div-cpvstd">
                <label class="lg-lbl-da">COLLI/PESI/VOLUME</label><br />
                <input name="PesoLordo" type="text" class="first-focus lg-input w3-right-align" placeholder="Peso lordo (KG)" style="width: 100px;" />
                <img class="mo-pointer" src="icon/Scatola.svg" id="btnPesoLordo" style="width: 1.6em">

                <input name="PesoNetto" type="text" class="lg-input w3-right-align" placeholder="Peso netto (KG)" style="width: 100px;" />
                <img class="mo-pointer" src="icon/Scatola.svg" id="btnPesoNetto" style="width: 1.6em">

                <input name="VolumeTotale" type="text" class="lg-input w3-right-align" placeholder="Volume (Mq)" style="width: 100px;" />
                <img class="mo-pointer" src="icon/Scatola.svg" id="btnVolumeTotale" style="width: 1.6em">

                <input name="Colli" type="text" class="lg-input w3-right-align" placeholder="Colli" style="width: 80px;" />
            </div>
        </div>
    </div>

</body>
</html>

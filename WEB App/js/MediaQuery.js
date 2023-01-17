function Media_Query() {

    var height = $(window).height();
    var width = $(window).width();

    // Width per device 3,5 pollici
    if (width <= 400) {
        $("#pgPrelievi input[name='DataConsegna']").css("width", "150px");

        $("#pgRLRig .div-letture .tr-ardesc").show();
        $("#pgRLRig .div-letture .cl-ardesc").hide();

        $("#pgRLRigID .div-letture .tr-ardesc").show();
        $("#pgRLRigID .div-letture .cl-ardesc").hide();

        $("#pgTRMP_P .tr-ardesc").show();
        $("#pgTRMP_P .cl-ardesc").hide();

        $("#pgTRMP_C_AR .TRMP_C .tr-ardesc").show();
        $("#pgTRMP_C_AR .TRMP_C .cl-ardesc").hide();
    }

    // Standard
    else {
        $("#pgPrelievi input[name='DataConsegna']").css("width", "200px");

        if (width > 800) {
            // ATTENZIONE per la riga uso la classe w3-hide perchè nel momento in qui viene lanciata la media query le righe non esistono
            $("#pgRLRig .div-letture .tr-ardesc").addClass("w3-hide");
            // ATTENZIONE per la colonna uso i metodi show e hide perchè la colonna nel momento in qui viene lanciata la media query è presente nella tabella
            $("#pgRLRig .div-letture .cl-ardesc").show();

            $("#pgRLRigID .div-letture .tr-ardesc").addClass("w3-hide");
            $("#pgRLRigID .div-letture .cl-ardesc").show();

            $("#pgTRMP_P .tr-ardesc").addClass("w3-hide");
            $("#pgTRMP_P .cl-ardesc").show();

            $("#pgTRMP_C_AR .TRMP_C .tr-ardesc").addClass("w3-hide");
            $("#pgTRMP_C_AR .TRMP_C .cl-ardesc").show();
        }
        else {
            $("#pgRLRig .div-letture .tr-ardesc").removeClass("w3-hide");
            $("#pgRLRig .div-letture .cl-ardesc").hide();

            $("#pgRLRigID .div-letture .tr-ardesc").removeClass("w3-hide");
            $("#pgRLRigID .div-letture .cl-ardesc").hide();

            $("#pgTRMP_P .tr-ardesc").removeClass("w3-hide");
            $("#pgTRMP_P .cl-ardesc").hide();

            $("#pgTRMP_C_AR .TRMP_C .tr-ardesc").removeClass("w3-hide");
            $("#pgTRMP_C_AR .TRMP_C .cl-ardesc").hide();
        }
    }
}


function Login_Media_Query() {

    var height = $(window).height();
    var width = $(window).width();

    // Width per device 3,5 pollici
    if (width <= 400) {
        $("#loginmain .div-input").removeClass("w3-margin-top");
        $("#loginmain .div-op").removeClass("w3-margin-bottom");
        $("#loginmain .div-btn").removeClass("w3-margin-bottom");
        $("#loginmain .div-btn button").removeClass("w3-margin-top");
        $("#loginmain i").removeClass("s30").addClass("s15");
    }
}
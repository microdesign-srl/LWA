﻿// var baseUrl = "Moovi.aspx" // da impostare nelle varie pagine

function ajaxCall(url, parameters, successCallback, errorCallback) {
    $('#preloader').show();
    if (url.indexOf(baseUrl) < 0) url = baseUrl + url;
    $.ajax({
        url: url,
        async: true,
        data: JSON.stringify(parameters),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $('#preloader').hide();
            if (successCallback) successCallback(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#preloader').hide();
            if (errorCallback) errorCallback(XMLHttpRequest, textStatus, errorThrown);
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
};

function ajaxCallSync(url, parameters, successCallback, errorCallback) {
    $('#preloader').show();
    if (url.indexOf(baseUrl) < 0) url = baseUrl + url;
    $.ajax({
        url: url,
        async: false,
        data: JSON.stringify(parameters),
        type: "POST",
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            $('#preloader').hide();
            if (successCallback) successCallback(data);
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            $('#preloader').hide();
            if (errorCallback) errorCallback(XMLHttpRequest, textStatus, errorThrown);
            Ajax_ErrOut(XMLHttpRequest, textStatus, errorThrown);
        }
    });
};


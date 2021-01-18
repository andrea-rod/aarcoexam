var action = {
    requestData: function (data) {
        data.IdAplication = 2;
        return new Promise(function (resolve, reject) {
            $.ajax({
                dataType: "text",
                type: "POST",
                url: "https://apitestcotizamatico.azurewebsites.net/api/catalogos",
                data: data,
                success: function ($data) {
                    var response = JSON.parse($data);
                    if (response.Error !== null) {
                        alert(response.Error.sDescripcion ? response.Error.sDescripcion : "Error sin descripción");
                        reject();
                    } else resolve(JSON.parse(response.CatalogoJsonString));
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError);
                    reject();
                },
            })
        });
    },
};

$(document).ready(function () {
    console.log("Iniciado...");
    action.requestData({
        NombreCatalogo: "Marca",
        Filtro: 1,
    }).then(function (data) {
        $("#marca").empty();
        $("#marca").append("<option value='0' selected>Seleccione una marca<option/>");
        data.forEach(element => {
            $("#marca").append("<option value='" + element.iIdMarca + "'>" + element.sMarca + "<option/>");
        });
    }).catch(function () { });

    //INICIALIZACIÓN DE PLUGINS
    $('#cotizacion').parsley();
    $('.select2').select2({
        placeholder: "Seleccione una opción.",
        allowClear: true,
        width: "100%"
    });
    $('#nacimiento').datepicker({
        format: "dd/mm/yyyy",
        language: "es",
        clearBtn: true,
        endDate: "today",
    });

    //EVENTOS
    $('#cotizacion').on("submit", function (e) {
        e.preventDefault();
        alert("Datos enviados correctamente.")
    });
    $("#codigopostal").on("input", function (e) {
        if (e.target.value.length === 5) {
            action.requestData({
                NombreCatalogo: "Sepomex",
                Filtro: e.target.value,
            }).then(function (data) {
                $("#municipio").val(data[0].Municipio.sMunicipio);
                $("#estado").val(data[0].Municipio.Estado.sEstado);
                $("#colonia").val(data[0].Ubicacion[0].sUbicacion);
            }).catch(function () {
                $("#codigopostal").val("")
            });
        } else {
            $(".ubicacion").val("")
        }
    });
    $("#marca").on("change", function (e) {
        action.requestData({
            NombreCatalogo: "Submarca",
            Filtro: this.value,
        }).then(function (data) {
            $("#submarca").empty();
            $("#modelo").empty();
            $("#descripcion").empty();
            $("#submarca").append("<option value='0' selected>Seleccione una submarca<option/>");
            data.forEach(element => {
                $("#submarca").append("<option value='" + element.iIdSubMarca + "'>" + element.sSubMarca + "<option/>");
            });
        }).catch(function () {
            $("#submarca").val("");
            $("#modelo").val("");
            $("#descripcion ").val("");
        });
    });
    $("#submarca").on("change", function (e) {
        action.requestData({
            NombreCatalogo: "Modelo",
            Filtro: this.value,
        }).then(function (data) {
            $("#modelo").empty();
            $("#descripcion").empty();
            $("#modelo").append("<option value='0' selected>Seleccione un modelo<option/>");
            data.forEach(element => {
                $("#modelo").append("<option value='" + element.iIdModelo + "'>" + element.sModelo + "<option/>");
            });
        }).catch(function () {
            $("#modelo").val("");
            $("#descripcion").val("");
        });
    });
    $("#modelo").on("change", function (e) {
        action.requestData({
            NombreCatalogo: "DescripcionModelo",
            Filtro: this.value,
        }).then(function (data) {
            $("#descripcion").empty();
            $("#descripcion").append("<option value='0' selected>Seleccione una descripción<option/>");
            data.forEach(element => {
                $("#descripcion").append("<option value='" + element.iIdDescripcionModelo + "'>" + element.sDescripcion + "<option/>");
            });
        }).catch(function () {
            $("#descripcion").val("");
        });
    });
})
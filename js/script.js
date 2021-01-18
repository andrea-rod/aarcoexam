var action = {
    requestData: function (data) {
        data.IdAplication = 2;
        return new Promise(function (resolve, reject) {
            $.ajax({
                type: "POST",
                url: "https://apitestcotizamatico.azurewebsites.net/api/catalogos",
                data: data,
                success: function ($data) {
                    if ($data.Error !== null) {
                        alert("Error");
                        reject();
                    } else resolve(JSON.parse($data.CatalogoJsonString));
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    alert(xhr.status);
                    alert(thrownError);
                    alert("Ocurrió un error consultando");
                    reject();
                },
                dataType: "application/json",
            })
        });
    },
};

$(document).ready(function () {
    console.log("Iniciado...");

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
    });
    $("#codigopostal").on("input", function (e) {
        console.log(e.target.value);
        if (e.target.value.length === 5) action.requestData({
            NombreCatalogo: "Sepomex",
            Filtro: e.target.value,
        }).then(function (data) {
            console.log(data)

        }).catch(function () {
            $("#codigopostal").val("")
        });
    });
})
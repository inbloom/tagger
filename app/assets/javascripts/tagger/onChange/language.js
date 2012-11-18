$(function() {

    $("#language").change(function(obj){
        var metaSourceValue = $(obj.target).val();

        $("#multiItemSelector input[type=checkbox]:checked").each(function(i,obj) {
            items[obj.id].language = metaSourceValue;
        });

        updateTextArea();
    });

});
$(document).ready(function() {
        $("#ol").addClass("red");
        $("#ol > li").addClass("blue");
        $("#ol li:last").hover(function() {
                $(this).addClass("green");
            },function(){
                $(this).removeClass("green");
            });

        $("#ol").find("li").each(function(i) {
                $(this).append( " BAM! " + i );
            });    
    });
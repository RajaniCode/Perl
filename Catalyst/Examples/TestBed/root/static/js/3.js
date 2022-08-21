 $(document).ready(function() {
   // generate markup
   $("#rating").append("Please rate: ");
   
   for ( var i = 1; i <= 5; i++ )
     $("#rating").append("<a href='#'>" + i + "</a> ");
   
   // add markup to container and apply click handlers to anchors
   $("#rating a").click(function(e){
     // send request
     $.post("/rate", {rating: $(this).html()}, function(xml) {
       // format and output result UNIMPLEMENTED - lets port it to
       // JSON one day
       $("#rating").html(
         "Thanks for rating, current average: " +
         $("average", xml).text() +
         ", number of votes: " +
         $("count", xml).text()
       );
     });
     
     // stop normal link click
     return false;
   });
 });
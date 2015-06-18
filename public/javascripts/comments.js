$(document).ready(function(){

  var url  = window.location.pathname + "/comments"

  function loadComments() {
    $.getJSON(url).done(function(data) {
        var comments = data.comments
        comments.forEach(function(comment){
          $("#comments").append("<h4 class='ui'><li>'"+ comment.body +"'</li>- "+ comment.author.username +"</h4>")	
        })
    });
  }

  loadComments();
})

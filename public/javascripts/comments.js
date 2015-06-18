$(document).ready(function(){
	
  var url  = window.location.pathname + "/comments" 

  function loadComments() {
    $.getJSON(url).done(function(data) {
        console.log(data.post.comments);
        var comments = data.post.comments
        comments.forEach(function(comment){
          $("#comments").append("<h4 class='ui'><li>'"+ comment.body +"'</li></h4>")	
        })
    });
  }

  loadComments();
})
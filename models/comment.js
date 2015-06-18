var mongoose = require('mongoose');

mongoose.set('debug', true);

var commentSchema = new mongoose.Schema ({
                        body: {type: String, required: true},
                        post: {
                          type: mongoose.Schema.Types.ObjectId,
                          ref: "Post"
                        },
                        author: {
                        	type: mongoose.Schema.Types.ObjectId,
                        	ref: "User"
                        }
                      });

var Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;

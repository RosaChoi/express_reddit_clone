var mongoose = require('mongoose');

mongoose.set('debug', true);

var postSchema = new mongoose.Schema ({
                    title: {type: String, required: true},
                    body: {type: String, required: true},
                    media: String,
                    comments: [{
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "Comment"
                    }],
                    author: {
                    	type: mongoose.Schema.Types.ObjectId,
                    	ref: "User"
                    }
                  });

postSchema.pre('remove', function(next) {
  Comment.remove({post: this._id}).exec();
  next();
});

var Post = mongoose.model("Post", postSchema);

module.exports = Post;

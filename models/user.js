var mongoose = require('mongoose');

mongoose.set('debug', true);

var userSchema = new mongoose.Schema ({
                      username: {
                        type: String,
                        required: true,
                        lowercase: true,
                        unique: true
                        },
                      password: {type: String, required: true},
                      avatar: String,
                      posts: [{
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Post"
                      }],
                      comments: [{
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Comment"
                      }]
                    });

var User = mongoose.model("User", userSchema);
module.exports = User;

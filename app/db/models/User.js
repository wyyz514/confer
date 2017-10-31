module.exports = function (mongoose) {
    var User = mongoose.model('User', {
        'email': {
            type: String,
            unique: true
        },
        'password': String,
        'firstname': String,
        'lastname': String
    });
    return User;    
}

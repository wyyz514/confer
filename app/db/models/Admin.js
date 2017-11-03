module.exports = function (mongoose) {
    var Admin = mongoose.model('Admin', {
        'email': {
            type: String,
            unique: true
        },
        'password': String,
        'firstname': String,
        'lastname': String
    });
    return Admin;    
}

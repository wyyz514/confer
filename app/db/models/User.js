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
    
    //handle datatable requests
    User.getDataTable = function getData (request, response) {
        User.dataTable(request.query, function (err, data) {
            console.log("DATA:", data)
            response.send(data);
        });
    };
    return User;    
}


module.exports = function (mongoose) {
    var Privilege = mongoose.model('Privilege', {
        userid: String,
        tid: String,
        cid: String,
        privilege: {
            type: String,
            enum: ['admin', 'TPC Chair']
        }
    });    
    
    return Privilege;
}


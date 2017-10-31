module.exports = function (mongoose) {
    var Track = mongoose.model('Track', {
        cid: String,
        name: String
    });
    return Track;    
}

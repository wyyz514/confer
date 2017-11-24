module.exports = function (mongoose) {
    var Track = mongoose.model('Track', {
        cid: String,
        name: String,
        trackChairId: String
    });
    
    Track.getDataTable = function getData (request, response) {
        
        Track.dataTable(request.query, {"conditions" : {"cid": request.query.cid}}, function (err, data) {
            response.send(data);
        });
    }
    return Track;    
}

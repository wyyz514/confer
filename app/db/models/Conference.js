module.exports = function (mongoose) {
    var Conference = mongoose.model('Conference', {
        name: String,
        startDate: Date,
        endDate: Date,
        reviewForm: Object
    });
    return Conference;    
}

exports.login = function login() {
    
    //check email and password match in db
    //adds message to response
    //fail message: go to login else direct to home
    
    return function (req, res, next) {
        res.locals.status = {
            destination: 'index',
            message: ''
        };
        
        next();
    }
};

exports.signup = function signup() {

    //check email not used
    //if it is, show message on signup page
    //else direct to login page with message
    
    return function (req, res, next) {
        res.locals.status = {
            destination: 'login',
            message: ''
        };
        
        next();
    }
}

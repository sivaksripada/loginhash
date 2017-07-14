


module.exports = function(app, passport) {

    var eclinical = require('./eclinical.js');
    var multer = require('multer')
    var upload = multer({ dest: 'uploads/' });
    var fs = require('fs');
    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs', { message: req.flash('loginMessage') }); 
        // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form


    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/main', // redirect to the secure profile section
        failureRedirect : '/', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // process the login form
    // app.post('/login', do all our passport stuff here);

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/', // redirect to the secure profile section
        failureRedirect : '/signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/main', isLoggedIn, function(req, res) {
        res.render('main.ejs', {message: req.user.clinicName, message2: req.user.email}); 
           // user : req.user // get the user out of session and pass to template
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.post('/add', upload.single('file'), function(req, res) {
    if (req.file != null) {
        var fileName = (req.file.path);
        var fileOutName = ("parsed-" + (req.file.originalname));
        fileOutName = fileOutName.substring(0, fileOutName.length - 4)
       

        eclinical.parseTextFile(fileName, function() {
            var filePath = "uploads/out.csv";
            res.writeHead(200, {
                "Content-Type": "application/octet-stream",
                "Content-Disposition": "attachment; filename=" + fileOutName + ".csv"
            });
            fs.createReadStream(filePath).pipe(res);
            fs.unlinkSync("uploads/out.csv");

        });
    } else {
        res.render('main.ejs');
    };


});
};


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
};



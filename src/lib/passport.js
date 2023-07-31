const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    console.log(req.body)
    const rows = await pool.query('SELECT * FROM tbl_users WHERE USE_CUSERNAME = ?', [username]);
    console.log(rows);
    if(rows.length > 0){
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.USE_CPASSWORD);
        if(validPassword){
            done(null, user, req.flash('success','Welcome' + user.USE_CUSERNAME));
        } else {
            done(null, false, req.flash('message','Incorrect password'));
        }
    } else {
        return done(null, false, req.flash('message','This username does not exist'));
    }
}));

passport.use('local.signup', new localStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { name, lastName, document } = req.body;
    const newUser = {
        USE_CNAME: name,
        USE_CLAST_NAME: lastName,
        USE_CDOCUMENT: document,
        USE_CUSERNAME: username,
        USE_CPASSWORD: password        
    };
    newUser.USE_CPASSWORD = await helpers.encryptPassword(password);
    console.log("hola00");
    console.log(newUser);
    const result = await pool.query('INSERT INTO tbl_users SET ?', [newUser]);
    newUser.PKUSE_NCODIGO = result.insertId;
    return done(null, newUser);

}));

passport.serializeUser((usr, done) => {
    done(null, usr.PKUSE_NCODIGO);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM tbl_users WHERE PKUSE_NCODIGO = ?', [id]);
    done(null, rows[0]);
});
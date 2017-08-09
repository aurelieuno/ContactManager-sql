var bcrypt = require('bcrypt-nodejs');

var pass1 = "hello"
var pass2 = generateHash(pass1)
var pass3 = "nooo"
console.log(pass2);

var wer = validPassword(pass1, pass2)
console.log(wer)
var wer2 = validPassword(pass3, pass2)
console.log(wer2)

function generateHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

function validPassword(userPassword, databasePassword) {
    return bcrypt.compareSync(userPassword, databasePassword);//bcrypt.compareSync(myPlaintextPassword, hash); // true
}




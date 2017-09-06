const readline = require('readline');
const fs = require('fs');
const path = require('path');


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


var userinfo = {};

exports.check = function() {
  return new Promise(function (resolve, reject) {
    fs.readFile(path.join(__dirname, `/secret.json`), function(err, data) {
      if (err) {

        resolve(false);
      } else {
        userinfo = JSON.parse(data);
        if (userinfo['rcv_email'] == undefined || userinfo['snd_google_email'] == undefined || userinfo['snd_google_password'] == undefined || userinfo['rcv_email'] == undefined || userinfo['id'] == undefined || userinfo['password'] == undefined) resolve(false);


        resolve(true);
      }
    });
  });
}

exports.input = function(prompt) {
  return new Promise(function (resolve, reject) {
    rl.question('- insert ' + prompt + ' :', function (answer) {
      userinfo[prompt] = answer;

      resolve(true);
    });
  });
}

exports.getUserinfo = function() {
  return userinfo;
}

exports.end = function() {
  return new Promise(function (resolve, reject) {
    rl.close();

    resolve(true);
  });
}

exports.makeSecret = function() {
  return new Promise(function (resolve, reject) {
    fs.writeFileSync(path.join(__dirname, `/secret.json`), JSON.stringify(userinfo));

    console.log('* CREATE YSCEC account info file: SUCCEEDED; secret.json');
    resolve(true);
  });
}


exports.delete = function() {
  return new Promise(function (resolve, reject) {
    fs.unlink(path.join(__dirname, `/secret.json`), function (err) {
      if (err) throw err;

      console.log('* DELETE YSCEC account info file: SUCCEEDED; secret.json');
      resolve(true);
    });
  });
}

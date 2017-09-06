
// node modules
const request = require('request');
const cheerio = require('cheerio');

const fs = require('fs');
const path = require('path');

const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const moment = require('moment');
require('moment/locale/ko');


const { JSDOM } = require('jsdom');
const { diff, addedDiff, deletedDiff, detailedDiff, updatedDiff } = require("deep-object-diff");


// custom node modules
const make_secret = require('./secretHandler.js');


// request setting variables
let j = request.jar();
let options = {
  method: 'GET',
  url: 'http://yscec.yonsei.ac.kr/login/index.php',
  jar: j
};

// user information
let user_info = {};

// course informations
let course_info = {};
let prev_course_info = {};

// smtp mailer
let transporter;


function getFirstPage() {
  return new Promise((resolve, reject) => {

    request(options, function (error, response, body) {
      if (error) {
        console.log('└ LOGIN PROCESS 1/8 : FAILED', error);
        resolve(false);
      }

      let $ = cheerio.load(body, { decodeEntities: false });

      options.method = $('#ssoLoginForm').attr('method');
      options.url = $('#ssoLoginForm').attr('action');
      options.form = {};

      $('#ssoLoginForm input').each(function(element) {
        options.form[$(this).attr('name')] = $(this).val();
      });

      console.log('└ LOGIN PROCESS 1/8 : SUCCEEDED');
      resolve(true);
    });

  });
}

function getSecondPage() {
  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (error) {
        console.log('└ LOGIN PROCESS 2/8 : FAILED', error);
        resolve(false);
      }

      let $ = cheerio.load(body, { decodeEntities: false });

      options.method = $('#frmSSO').attr('method');
      options.url = $('#frmSSO').attr('action');
      options.form = {};

      $('#frmSSO input').each(function(element) {
        options.form[$(this).attr('name')] = $(this).val();
      });

      console.log('└ LOGIN PROCESS 2/8 : SUCCEEDED');
      resolve(true);
    });

  });
}

function getThirdPage() {
  return new Promise((resolve, reject) => {

    request(options, function (error, response, body) {
      if (error) {
        console.log('└ LOGIN PROCESS 3/8 : FAILED', error);
        resolve(false);
      }

      let $ = cheerio.load(body, { decodeEntities: false });

      options.method = $('#ssoLoginForm').attr('method');
      options.url = $('#ssoLoginForm').attr('action');
      options.form = {};

      $('#ssoLoginForm input').each(function(element) {
        options.form[$(this).attr('name')] = $(this).val();
      });

      console.log('└ LOGIN PROCESS 3/8 : SUCCEEDED');

      resolve(true);
    });

  });
}

let ssoChallenge = '';
let keyModulus = '';
let keyExponent = '';

function getFourthPage() {
  return new Promise((resolve, reject) => {

    ssoChallenge = options.form['ssoChallenge'];
    keyModulus = options.form['keyModulus'];
    keyExponent = options.form['keyExponent'];

    request(options, function (error, response, body) {
      if (error) {
        console.log('└ LOGIN PROCESS 4/8 : FAILED', error);
        resolve(false);
      }

      let $ = cheerio.load(body, { decodeEntities: false });

      options.method = $('#ssoLoginForm').attr('method');
      options.url = $('#ssoLoginForm').attr('action');
      options.form = {};

      $('#ssoLoginForm input[type!="submit"]').each(function(element) {
        options.form[$(this).attr('name')] = $(this).val();
      });

      console.log('└ LOGIN PROCESS 4/8 : SUCCEEDED');

      resolve(true);
    });
  });
}

function getE2() {
  return new Promise((resolve, reject) => {

    const dom_options = {
      resources: "usable",
      runScripts: "dangerously"
    };

    const dom = new JSDOM(
      `
      <body>
      <input type="text" id="EE2" value="asdf"/>
      <script type="text/javascript" src="https://yscec.yonsei.ac.kr/theme/jquery.php/core/jquery-1.11.0.min.js"></script>
      <script type="text/javascript" src="https://yscec.yonsei.ac.kr/passni/js/rsa.js"></script>
      <script type="text/javascript" src="https://yscec.yonsei.ac.kr/passni/js/jsbn.js"></script>
      <script type="text/javascript" src="https://yscec.yonsei.ac.kr/passni/js/prng4.js"></script>
      <script type="text/javascript" src="https://yscec.yonsei.ac.kr/passni/js/rng.js"></script>
      <script type="text/javascript" src="https://yscec.yonsei.ac.kr/passni/js/sha256.js"></script>
      <script>
        fSubmitSSOLoginForm();

        /**
         * ID/PW 로그인 버튼
         */
        function fSubmitSSOLoginForm(){
                var ssoChallenge= '${ssoChallenge}';

                var jsonStr = '{"userid": "${user_info['id']}", "userpw": "${user_info['password']}", "ssoChallenge": "${ssoChallenge}"}';

                var rsa = new RSAKey();
                rsa.setPublic('${keyModulus}', '${keyExponent}');

                //document.ssoLoginForm.E2.value = rsa.encrypt( jsonStr );
                //$('E2').value = rsa.encrypt(jsonStr);

                window.document.getElementById("EE2").value = rsa.encrypt(jsonStr);
                //console.log(window.document.getElementById("EE2").value);
                //return true;
        }

      </script>
      </body>

      `,
      dom_options
    );

    setTimeout(function() {
      options['form']['E2'] = dom.window.document.getElementById("EE2").value;
      console.log('└ LOGIN PROCESS 5/8 : SUCCEEDED');
      resolve(true);
    }, 1000);

  });
}

function loginProcess1() {
  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (error) {
        console.log('└ LOGIN PROCESS 6/8 : FAILED', error);
        resolve(false);
      }

      let $ = cheerio.load(body, { decodeEntities: false });

      options.method = $('#ssoLoginForm').attr('method');
      options.url = $('#ssoLoginForm').attr('action');
      options.form = {};

      $('#ssoLoginForm input[type!="submit"]').each(function(element) {
        options.form[$(this).attr('name')] = $(this).val();
      });

      console.log('└ LOGIN PROCESS 6/8 : SUCCEEDED');

      resolve(true);
    });
  });
}

function loginProcess2() {
  return new Promise((resolve, reject) => {
    request(options, function (error, response, body) {
      if (error) {
        console.log('└ LOGIN PROCESS 7/8 : FAILED', error);
        resolve(false);
      }

      console.log('└ LOGIN PROCESS 7/8 : SUCCEEDED');
      resolve(true);
    });
  });
}

function loginProcess3() {
  return new Promise((resolve, reject) => {
    options.url = 'http://yscec.yonsei.ac.kr/passni/spLoginProcess.php';
    options.method = 'get';

    request(options, function (error, response, body) {
      if (error) {
        console.log('└ LOGIN PROCESS 8/8 : FAILED', error);
        resolve(false);
      }

      console.log('└ LOGIN PROCESS 8/8 : SUCCEEDED - ALL LOGIN PROCESSES ARE SUCCEEDED!');

      resolve(true);
    });
  });
}


function getCourseList() {
  return new Promise((resolve, reject) => {
    options.url = 'http://yscec.yonsei.ac.kr/passni/spLoginProcess.php';
    options.method = 'get';

    request(options, function (error, response, body) {
      if (error) {
        console.log(`└ GET COURSES LIST : FAILED`, error);
        resolve(false);
      }

      console.log(`└ GET COURSES LIST : SUCCEEDED`);

      let $ = cheerio.load(body, { decodeEntities: false });

      $('.clearfix.coursebox').each(function() {
        if (course_info[`${$(this).attr('data-courseid')}`] == undefined) {
          course_info[`${$(this).attr('data-courseid')}`] = {};
        }
        course_info[`${$(this).attr('data-courseid')}`]['name'] = $(this).find('h3.coursename').text();
        course_info[`${$(this).attr('data-courseid')}`]['subject_id'] = $(this).find('span.subject_id').text();
        course_info[`${$(this).attr('data-courseid')}`]['href'] = $(this).find('a').attr('href');
      });

      resolve(true);
    });
  });
}

function getCourseInfo01(index) {
  return new Promise((resolve, reject) => {
    options.url = course_info[index.toString()]['href'];
    options.method = 'get';

    request(options, function (error, response, body) {
      if (error) {
        console.log(`└ GET COURSES INFO [${course_info[index.toString()]['name']}] : FAILED`, error);
        resolve(false);
      }

      console.log(`└ GET COURSES INFO [${course_info[index.toString()]['name']}] : SUCCEEDED`);

      let $ = cheerio.load(body, { decodeEntities: false });

      if (course_info[index.toString()]['boards'] == undefined) course_info[index.toString()]['boards'] = {};


      $('li.type_unknown.depth_1 ul li').each(function() {
        if (!$(this).hasClass('type_unknown')) {
          let cur_boards_index = $(this).find('a').attr('href').split('id=')[1];

          if (course_info[index.toString()]['boards'][cur_boards_index] == undefined)
            course_info[index.toString()]['boards'][cur_boards_index] = {};

            course_info[index.toString()]['boards'][cur_boards_index]['name'] = $(this).find('a').text();
            course_info[index.toString()]['boards'][cur_boards_index]['href'] = $(this).find('a').attr('href');
            course_info[index.toString()]['boards'][cur_boards_index]['articles'] = {};

            if ($(this).find('a').attr('href').indexOf('#') == -1) {
              course_info[index.toString()]['boards'][cur_boards_index]['type'] = $(this).find('a').attr('href').replace('http://yscec.yonsei.ac.kr/mod/', '').split('/')[0];
            } else {
              course_info[index.toString()]['boards'][cur_boards_index]['type'] = 'idanchor';
            }
        }
      });

      resolve(true);
    });
  });
}


function getCourseInfo02(c_index, b_index, iter) {
  return new Promise((resolve, reject) => {
    let cur_board = course_info[c_index.toString()]['boards'][b_index.toString()];
    options.url = cur_board['href'];
    options.method = 'get';

    request(options, function (error, response, body) {
      if (error) {
        console.log(`      └ GET BOARDS INFO [${cur_board['name']}] : FAILED`, error);
        resolve(false);
      }

      let $ = cheerio.load(body, { decodeEntities: false });

      if (cur_board['type'] == 'jinotechboard') {
        $('ul.thread-style-lists li').each(function() {
          if (!$(this).hasClass('isnotice')) {
            let cur_article = $(this).find('a').attr('onclick').replace(`contentMove('`, ``).replace(`')`, ``);

            if (course_info[c_index.toString()]['boards'][b_index.toString()]['articles'][cur_article] == undefined) {
              course_info[c_index.toString()]['boards'][b_index.toString()]['articles'][cur_article] = {};
            }

            course_info[c_index.toString()]['boards'][b_index.toString()]['articles'][cur_article]['title'] = $(this).find('a').text();
            course_info[c_index.toString()]['boards'][b_index.toString()]['articles'][cur_article]['date'] = $(this).find('span.thread-post-meta').text();
            course_info[c_index.toString()]['boards'][b_index.toString()]['articles'][cur_article]['content'] = $(this).find('p.thread-post-content').text();


          }
        });


      } else if (cur_board['type'] == 'textbook') {

      } else if (cur_board['type'] == 'idanchor') {
        let cur_box = b_index.toString().split('#')[1];

        $(`#${cur_box} ul.section.img-text li`).each(function() {
          let cur_module_id = $(this).attr('id');

          if (course_info[c_index.toString()]['boards'][b_index.toString()]['articles'][cur_module_id] == undefined) {
            course_info[c_index.toString()]['boards'][b_index.toString()]['articles'][cur_module_id] = {};
          }

          if ($(this).hasClass('resource')) {
            course_info[c_index.toString()]['boards'][b_index.toString()]['articles'][cur_module_id]['name'] = $(this).find('a').text();
            course_info[c_index.toString()]['boards'][b_index.toString()]['articles'][cur_module_id]['href'] = $(this).find('a').attr('href');
          } else if ($(this).hasClass('assign')) {
            course_info[c_index.toString()]['boards'][b_index.toString()]['articles'][cur_module_id]['name'] = $(this).find('a').text();
            course_info[c_index.toString()]['boards'][b_index.toString()]['articles'][cur_module_id]['href'] = $(this).find('a').attr('href');
          }
        });

        //console.log(  course_info[c_index.toString()]['boards'][b_index.toString()]['articles']);

      } else if (cur_board['type'] == 'folder') {
        $('div.box.generalbox.foldertree').find('a').each(function() {
          let cur_article = $(this).text();

          if (course_info[c_index.toString()]['boards'][b_index.toString()]['articles'][cur_article] == undefined) {
            course_info[c_index.toString()]['boards'][b_index.toString()]['articles'][cur_article] = {};
          }

          course_info[c_index.toString()]['boards'][b_index.toString()]['articles'][cur_article]['name'] = $(this).text();
          course_info[c_index.toString()]['boards'][b_index.toString()]['articles'][cur_article]['href'] = $(this).attr('href');
        });

      } else {
        console.log('***** NEW BOARD TYPE', cur_board['type']);
      }



      resolve(true);
    });
  });
}

function getCrawledData() {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(__dirname, `/courseInfo.json`), function(err, data) {
      if (err) {
        resolve(false);
      } else {
        prev_course_info = JSON.parse(data);
        resolve(true);
      }
    });
  });
}

function writeCrawledData() {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.join(__dirname, `/courseInfo.json`), JSON.stringify(course_info), function(err) {
      if (err) {
        resolve(false);
      }

      console.log('└ WRITE CRAWLED DATA : SUCCEEDED');

      resolve(true);
      return;
    });
  });
}

function checkDiffData() {
  return new Promise((resolve, reject) => {
    let diff = addedDiff(prev_course_info, course_info);
    let course_keys = Object.keys(diff);

    let mail_contents = '';

    console.log();

    for (let i = 0; i < course_keys.length; i++) {
      let boards_keys = Object.keys(diff[course_keys[i]]['boards']);

      console.log(`* [${course_info[course_keys[i]]['name']}] 강의에 새로운 소식이 있습니다.`);
      mail_contents += `<h3>* [${course_info[course_keys[i]]['name']}] 강의에 새로운 소식이 있습니다.</h3>`;

      for (let j = 0; j < boards_keys.length; j++) {
        let cur_board = course_info[course_keys[i]]['boards'][boards_keys[j]];
        let article_keys = Object.keys(diff[course_keys[i]]['boards'][boards_keys[j]]['articles']);

        for (let k = 0; k < article_keys.length; k++) {
          if (cur_board['type'] == 'jinotechboard') {
            console.log(
              `${cur_board['name']})`,
              ` ${cur_board['articles'][article_keys[k]]['title']}`);
            console.log(`${cur_board['articles'][article_keys[k]]['date']}`);
            console.log(`${cur_board['articles'][article_keys[k]]['content']}`);

            mail_contents += `<p><font style="font-weight: bold;">${cur_board['name']})</font> ${cur_board['articles'][article_keys[k]]['title']}</p>`;
            mail_contents += `<p>${cur_board['articles'][article_keys[k]]['date']}</p>`;
            mail_contents += `<p>${cur_board['articles'][article_keys[k]]['content']}</p>`;

          } else if (cur_board['type'] == 'textbook') {
          } else if (cur_board['type'] == 'idanchor') {
            console.log(
              `${cur_board['name']})`,
              ` ${cur_board['articles'][article_keys[k]]['name']}`);
            console.log(`${cur_board['articles'][article_keys[k]]['href']}`);

            mail_contents += `<p><font style="font-weight: bold;">${cur_board['name']})</font> ${cur_board['articles'][article_keys[k]]['name']}</p>`;
            mail_contents += `<p><a href="${cur_board['articles'][article_keys[k]]['href']}">${cur_board['articles'][article_keys[k]]['href']}</a></p>`;

          } else if (cur_board['type'] == 'folder') {
            console.log(
              `${cur_board['name']})`,
              ` ${cur_board['articles'][article_keys[k]]['name']}`);
            console.log(`${cur_board['articles'][article_keys[k]]['href']}`);

            mail_contents += `<p><font style="font-weight: bold;">${cur_board['name']})</font> ${cur_board['articles'][article_keys[k]]['name']}</p>`;
            mail_contents += `<p><a href="${cur_board['articles'][article_keys[k]]['href']}">${cur_board['articles'][article_keys[k]]['href']}</a></p>`;
          } else {
            console.log('***** NEW BOARD TYPE', cur_board['type']);
          }

          console.log('\n');
          mail_contents += `<br>`;
        }

      }
    }


    moment.locale('ko');

    if (mail_contents != '') {
      let mailOptions = {
        from: `YSCEC CRAWLER <${user_info['snd_google_email']}>`,
        to: `${user_info['rcv_email']}`,
        subject: `${moment().format('LLLL')}에 갱신된 새로운 YSCEC 소식입니다.`,
        html: mail_contents
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log('└ SENDING MAIL : FAILED');
          return console.log(error);
        }

        console.log(`└ SENDING MAIL : SUCCEEDED; from ${mailOptions['from']}, to ${mailOptions['to']}`);

        resolve(true);
      });
    }
  });
}

exports.run = async function() {

  console.log('-------------------------------------------------------');
  console.log('* START A YSCEC CRAWLER');
  console.log('-------------------------------------------------------');
  console.log('* CHECKING USER YSCEC ACCOUNT');

  if (!await make_secret.check()) {
    // make user info
    console.log('└ YSCEC account info doesnt EXIST!');
    console.log('└ Please Insert your YSCEC account info.');
    await make_secret.input('id');
    await make_secret.input('password');
    await make_secret.input('rcv_email');
    await make_secret.input('snd_google_email');
    await make_secret.input('snd_google_password');
    await make_secret.end();

    console.log('-------------------------------------------------------');
    await make_secret.makeSecret();
  } else {
    console.log('└ YSCEC account info EXISTS; secret.json');
  }

  user_info = make_secret.getUserinfo()

  transporter = nodemailer.createTransport(
    smtpTransport({
      service: 'gmail',
      auth: {
        user: user_info['snd_google_email'],
        pass: user_info['snd_google_password']
      }
    })
  );

  console.log('-------------------------------------------------------');
  console.log('* START LOGIN to YSCEC');

  //login processes
  if (!await getFirstPage()) return;
  if (!await getSecondPage()) return;
  if (!await getThirdPage()) return;
  if (!await getFourthPage()) return;
  if (!await getE2()) return;
  if (!await loginProcess1()) return;
  if (!await loginProcess2()) return;
  if (!await loginProcess3()) return;

  console.log('-------------------------------------------------------');
  console.log('* START CRAWLING USER YSCEC DATA');

  if (!await getCourseList()) return;

  let course_index = Object.keys(course_info);

  for (let i = 0; i < course_index.length; i++) {
    if (!await getCourseInfo01(course_index[i])) return;

    let cur_course_boards = Object.keys(course_info[course_index[i]]['boards']);

    for (let j = 0; j < cur_course_boards.length; j++) {
      if (!await getCourseInfo02(course_index[i], cur_course_boards[j], j)) return;
    }
  }

  console.log('-------------------------------------------------------');
  console.log('* START COMPARING USER YSCEC DATA');

  if (!await getCrawledData()) {
    console.log('└ PREV COURSES INFO DOESNT EXIST');
  } else {
    console.log('└ PREV COURSES INFO EXISTS');
  }

  await checkDiffData();
  await writeCrawledData();
}

//
//
// // main
// main()
// .then(() => {
//   console.log('-------------------------------------------------------');
//   console.log('* CRAWLER TERMINATED');
//   console.log('-------------------------------------------------------');
//   process.exit();
// })
// .catch((error) => {
//   console.log(error);
//   process.exit();
// });

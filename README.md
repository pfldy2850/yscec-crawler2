YSCEC CRAWLER 2
=============
It is a crawler for yonsei university's students to make it easy to confirm YSCEC data.

<br>

Install
-------------
Install required modules wrote down in package.json.
<code>npm i</code>

<br>

One time crawling
-------------
YSCEC data is crawled only once.
<code>npm start o</code>

<br>

Scheduled crawling
-------------
YSCEC data is crawled every hour.
<code>npm start s</code>

<br>

Required data
-------------
* id : enter your YSCEC account.
* password : enter your YSCEC account password.
* rcv_email : enter your mail account to receive notice mail. (ex: pfldy2850@gmail.com)
* snd_google_email : enter your google mail to send notice mail. (ex: pfldy2850@gmail.com)
* snd_google_password : enter your google mail password to send notice mail.

<br>

Generated data files
-------------
* courseInfo.json : This is the file that records your YSCEC data.
* secret.json : This is the file that records your YSCEC account data.

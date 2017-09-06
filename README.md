YSCEC CRAWLER 2
=============
It is a crawler for yonsei university's students to make it easy to confirm YSCEC data.

<br>
blog: [http://dytis.tistory.com/39](http://dytis.tistory.com/39)
<br><br>

### YSCEC CRAWLER 1
blog: [http://dytis.tistory.com/6](http://dytis.tistory.com/6) <br>
github: [https://github.com/pfldy2850/YSCEC-CRAWLER](https://github.com/pfldy2850/YSCEC-CRAWLER)

<br><br>

Requirements
-------------
npm version : 5.4.0
<br>
node version : v8.4.0

<br><br>

Install
-------------
Install required modules wrote down in package.json.
<br>
<pre><code>npm i</code></pre>

<br>

One time crawling
-------------
YSCEC data is crawled only once.
<br>
<pre><code>npm start o</code></pre>

<br>

Scheduled crawling
-------------
YSCEC data is crawled every hour.
<br>
<pre><code>npm start s</code></pre>

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

const schedule = require('node-schedule');
const crawler = require('./crawler.js');

let is_crawling = false;

var j = schedule.scheduleJob('0 */1 * * *', function(){
  if (!is_crawling) {
    crawler.run()
    .then(() => {
      console.log('-------------------------------------------------------');
      console.log('* CRAWLER TERMINATED');
      console.log('-------------------------------------------------------');
      is_crawling = false;
    })
    .catch((error) => {
      console.log(error);
      is_crawling = false;
    });
  }
});

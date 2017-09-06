const schedule = require('node-schedule');
const crawler = require('./crawler.js');

crawler.run()
.then(() => {
  console.log('-------------------------------------------------------');
  console.log('* CRAWLER TERMINATED');
  console.log('-------------------------------------------------------');
})
.catch((error) => {
  console.log(error);
});

var j = schedule.scheduleJob('0 0 */1 * *', function(){
  crawler.run()
  .then(() => {
    console.log('-------------------------------------------------------');
    console.log('* CRAWLER TERMINATED');
    console.log('-------------------------------------------------------');
  })
  .catch((error) => {
    console.log(error);
  });
});

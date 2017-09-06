const schedule = require('node-schedule');
const crawler = require('./crawler.js');

crawler.run()
.then(() => {
  console.log('-------------------------------------------------------');
  console.log('* CRAWLER TERMINATED');
  console.log('-------------------------------------------------------');
  process.exit();
})
.catch((error) => {
  console.log(error);
});

var j = schedule.scheduleJob('* * */2 * * *', function(){
  crawler.run()
  .then(() => {
    console.log('-------------------------------------------------------');
    console.log('* CRAWLER TERMINATED');
    console.log('-------------------------------------------------------');
    process.exit();
  })
  .catch((error) => {
    console.log(error);
  });
});

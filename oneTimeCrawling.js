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
  process.exit();
});

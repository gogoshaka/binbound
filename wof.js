const fs = require('fs');
const path = require('path');

const woffFilePath = '/Users/gogo/Downloads/concourse_c3.woff';

fs.readFile(woffFilePath, (err, data) => {
  if (err) throw err;
  const base64 = data.toString('base64');
  console.log(base64);
});
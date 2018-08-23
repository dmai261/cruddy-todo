const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // console.log(callback);
  var id = counter.getNextUniqueId((err, id) => { 
    fs.writeFile(exports.dataDir + '/' + `${id}`+`.txt`, text, (err) => {
      if (err) {
        console.log("blame james");   
      } else {
        callback(null, {
          id: id, 
          text: text
        });
      }
    });
  });
};

exports.readOne = (id, callback) => {
  var data = fs.readdir(exports.dataDir, (err, files) => { 
    if (files.includes(`${id}.txt`)) {
      fs.readFile(`${exports.dataDir}/${id}.txt`, (err, data) => ( callback(null, {id: id, text: data.toString()})));
    } else {
      callback(true, 'no');
    }
  });
};

exports.readAll = (callback) => {
  var data = fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      console.log("James again.");
    } else {
      let data = [];
      _.each(files, (file)=> data.push({ id: file.replace('.txt', ''), text: file.replace('.txt', '')}));
      callback(null, data);
    }
  });
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, {id: id, text: text});
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');
// console.log(exports.dataDir);

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};







// counter.getNextUniqueId(callback).then(function(data) {
//     // console.log(exports.dataDir + `/${data}`);
//     fs.writeFile(`${exports.dataDir}/${data}`, text,
//               (err) => { if (err) { 
//                         return err 
//                         }else {
//                         callback(null, {id: data, text: text}) } } ) })
// }

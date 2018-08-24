const path = require('path');
const fs = require('fs');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const promisedFs = Promise.promisifyAll(require('fs'));

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
    if (err) {
      console.log(err);  
    } else {
      if (files.includes(`${id}.txt`)) {
        fs.readFile(`${exports.dataDir}/${id}.txt`, (err, data) => {
          callback(null, {id: id, text: data.toString()} );
        });
      } else {
        callback(true, 'no');
      }
    }
  });
};

exports.readAll = (callback) => {
  let entries = [];
  let data = promisedFs.readdirAsync(exports.dataDir)
    .then((files)=>{
      if (files.length > 0) {
        _.each(files, (file) => {
          entries.push(promisedFs.readFileAsync(path.join(exports.dataDir, file))
            .then((entry)=> {
              return { id: path.basename(file, '.txt'), text: entry.toString()};
            })
          );
        });
      }
      Promise.all(entries)
        .then((entries) => { callback(null, entries); });
    });
   
  // Promise.all(data)
  //  .then((entries) => { callback(null, entries)});
  // console.log(entries);
};
// callback(null, entries)

exports.update = (id, text, callback) => {
  // var item = items[id];
  // if (!item) {
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   items[id] = text;
  //   callback(null, {id: id, text: text});
  // }
  
  var updated = exports.readOne(id, (err, oneTodo) => { 
    if (err) {
      callback(err, 'no');
    } else {
      fs.writeFile(exports.dataDir + '/' + `${id}`+`.txt`, text, (err)=> {
        if (err) {
          console.log(err);
        } else {
          oneTodo.text = text;
          // console.log(oneTodo)
          callback(null, oneTodo);
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  // var item = items[id];
  // delete items[id];
  // if (!item) {
  //   // report an error if item not found
  //   callback(new Error(`No item with id: ${id}`));
  // } else {
  //   callback();
  // }
  var deleted = exports.readOne(id, (err, oneTodo) => {
    if (err) {
      callback(err, 'I guess James is alright');
    } else {
      fs.unlink(exports.dataDir +'/' + `${id}`+`.txt`, (err)=> {
        if (err) {
          console.log(err);
        } else {
          callback(null, oneTodo);
        }
      });
    }
  });
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

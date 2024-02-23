const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const HttpError = require('./error');

const titleStopWords = {
  'and': undefined,
  'or': undefined,
  'of': undefined,
  'the': undefined
};

exports.capitalize = function (s) {
  return s.charAt(0).toUpperCase() + s.substr(1);
};

exports.trimEverywhere = function (s) {
  return s.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' ');
};

exports.titleCase = function (s) {
  var first = true;
  return s.replace(/\w+/g, function (match) {
    match = (!first && _.has(titleStopWords, match.toLowerCase())) ? match : exports.capitalize(match);
    first = false;
    return match;
  });
};

exports.prettify = function (s) {
  s = s
    .replace(/-+/g, '-')       // remove excessive hyphens
    .replace(/\s*-\s*/g, '-')  // remove whitespace around hyphens
    .replace(/^-|-$/g, '');    // remove hyphens from start and end
  return exports.titleCase(exports.trimEverywhere(s));
};

exports.walkDir = (dirPath, filesShouldBeRemoved = []) => {
  var files = fs.readdirSync(dirPath);

  // remove dot files
  _.remove(files, f => f.indexOf('.') === 0);

  // filter files should be removed
  files = _.filter(files, f => !_.includes(filesShouldBeRemoved, f));

  // map files to fullpath
  files = _.map(files, f => path.join(dirPath, f));

  return files;
}

exports.isJSON = (string) => {
  try {
    JSON.parse(string);
  } catch (e) {
    return false;
  }
  return true;
}

exports.shuffle = (array) => {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

exports.sleep = (miliseconds) => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res(null);
    }, miliseconds);
  });
}
#!/usr/bin/env node
var fs = require('fs');
var cp = require('child_process');

var deleteFolderRecursive = function (path) {
    if(fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index) {
            var curPath = path + '/' + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

// Delete a whole folder
exports.deleteFolderRecursive = deleteFolderRecursive;

// Create a cordova project
exports.createCordovaProject = function (path, id, name, copy) {
    var cmd = 'cordova create ' + path + ' ' + id + ' ' + name + (copy ? ' --copy-from  ' + copy : '');
    cp.execSync(cmd);
};

exports.removePlatform = function (plat) {
    var cmd = 'cordova platform rm ' + plat;
    cp.execSync(cmd);
};

exports.addPlatform = function (platSpec) {
    var cmd = 'cordova platform add ' + platSpec;
    cp.execSync(cmd);
};

exports.addPlugin = function (plugin) {
    var cmd = 'cordova plugin add ' + plugin;
    cp.execSync(cmd);
};

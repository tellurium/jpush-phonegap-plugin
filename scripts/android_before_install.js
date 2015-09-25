#!/usr/bin/env node

// Libs
var fs = require('fs');
var path = require('path');

// Local variables
var cordovaPluginConfig  = JSON.parse(fs.readFileSync('../cordova_plugin_config.json', 'utf8'));
var rootDir = process.cwd();
var currentPlugin = 'com.opentrans.plugin.jpush';

var cusConfig;
var replaceConfig;

if (!cordovaPluginConfig) {
    console.log(' ===> Please add a `cordova_plugin_config.json` file <=== ');
    return;
}

cusConfig = cordovaPluginConfig[currentPlugin]['android'];

if (!cusConfig) {
    console.log(' ===> Please add property com.opentrans.plugin.jpush to cordova_plugin_config.json file <=== ');
    return;
}

replaceConfig = [
    {
        'files': [
            'plugins/com.opentrans.plugin.jpush/src/android/JPushPlugin.java'
        ],
        'replaces': [
            [ '#{TARGET_APP_PACKAGE}', cusConfig['app_package'] ]
        ]
    }
];

function replace_string_in_file(filename, to_replace, replace_with) {
    var data = fs.readFileSync(filename, 'utf8');

    var result = data.replace(new RegExp(to_replace, 'g'), replace_with);
    fs.writeFileSync(filename, result, 'utf8');
}

replaceConfig.forEach(function (replaceMap) {
    var files = replaceMap.files;
    var replaces = replaceMap.replaces;

    if (!files || !replaces) {
        return;
    }

    files = [].concat(files);
    replaces = [].concat(replaces);

    files.forEach(function (file) {
        var fullfilename = path.join(rootDir, file);
        if (fs.existsSync(fullfilename)) {

            replaces.forEach(function (replace) {
                replace_string_in_file(fullfilename, replace[0], replace[1]);
            });
        } else {
            console.log(' ==> missing: ' + fullfilename + ' <== ');
        }
    });
});

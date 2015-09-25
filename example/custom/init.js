#!/usr/bin/env node

/* ====== Script Dependency ====== */
var fs = require('fs');
var extend = require('util')._extend;
var utils = require('./utils.js');

/* ====== Configuration ====== */

var projectConfig = {
    path: 'test',                                           // where to create the project
    id: 'com.opentrans.test',                               // Package id or bundle identifier
    name: 'CordovaTest',                                    // App Name
    customConfigPath: 'cordova_project_config.json',        // where to load a custom configuration file
    platformsToAdd: [ 'android', 'ios' ],
    platformsSpec: [ '../otms-cordova-project-template/android', '../otms-cordova-project-template/ios' ],
    pluginsToAdd: [
        // 'com.phonegap.plugins.barcodescanner',
        // 'org.apache.cordova.camera',
        // 'org.apache.cordova.device',
        // 'org.apache.cordova.geolocation',
        // 'org.apache.cordova.inappbrowser',
        // 'org.apache.cordova.network-information',
        // 'org.apache.cordova.splashscreen'
        '../otms-cordova-baidumap'
    ],
    platformsToBuild: [ 'android', 'ios' ],
    www_copy: ""
};

var pluginConfig = {};

var buildConfig = {
    shouldCleanFolder: true,
    shouldCreateProejct: true,
    shouldAddPlatform: true,
    shouldAddPlugins: true,
    shouldBuildPlatforms: true
};

/* ====== Constants ======*/

var PLUGIN_CONFG_PATH = 'cordova_plugin_config.json';

/* ====== Variables ====== */

var cwd = process.cwd() + '/';

/* ====== Init oTMS cordova project steps ====== */

// Check project config

if (!projectConfig.customConfigPath) {
    console.log('===> I recommand you add path of custom config file <===');
    return;
}

var customConfig = JSON.parse(fs.readFileSync(projectConfig.customConfigPath, 'utf8'));

if (!customConfig) {
    console.log(' ===> Please add a custom configuration file <=== ');
    return;
}

projectConfig = extend(projectConfig, customConfig);

if (fs.existsSync(PLUGIN_CONFG_PATH)) {
    pluginConfig = extend(pluginConfig, fs.readFileSync(PLUGIN_CONFG_PATH, 'utf8'));
}

// Clean existing folders
if (buildConfig.shouldCleanFolder && fs.existsSync(projectConfig.path)) {
    utils.deleteFolderRecursive(projectConfig.path);

    console.log('===> Folder ' + projectConfig.path + ' is removed');
}

// Create cordova project
if (buildConfig.shouldCreateProejct) {
    if (!projectConfig.path || !projectConfig.id || !projectConfig.name) {
        console.log('Hey man, please specify the three parameters [path, id, name] for the project');
        return false;
    }

    utils.createCordovaProject(projectConfig.path, projectConfig.id, projectConfig.name, projectConfig.www_copy);

    console.log(
        '===> A cordova project is created at ' + projectConfig.path +
        ' name is ' + projectConfig.name + ' and id is ' + projectConfig.id +
        ' copy www from ' + projectConfig.www_copy
    );
}

// Add platforms
if (buildConfig.shouldAddPlatform) {
    if (!projectConfig.platformsToAdd || projectConfig.platformsToAdd.length < 1) {
        console.log('===> Please tell me which platforms to add, thanks');
        return;
    }

    process.chdir(cwd + projectConfig.path);

    projectConfig.platformsToAdd.forEach(function (platform, index) {

        var platSpec = platform;

        if (projectConfig.platformsSpec && projectConfig.platformsSpec[index]) {
            platSpec = cwd + projectConfig.platformsSpec[index];
        }

        utils.removePlatform(platform);
        utils.addPlatform(platSpec);

        console.log('===> Platform ' + platform + ' is added, and platform spec is ' + platSpec);
    });

    process.chdir(cwd);
}

// Add plugins for all platforms
if (buildConfig.shouldAddPlugins) {
    if (projectConfig.pluginsToAdd && projectConfig.pluginsToAdd.length > 0) {

        process.chdir(cwd + projectConfig.path);

        projectConfig.pluginsToAdd.forEach(function (plugin) {

            if (fs.existsSync(cwd + plugin)) {
                plugin = cwd + plugin;
            }

            utils.addPlugin(plugin);

            console.log('===> Plugin ' + plugin + ' is added');
        });

        process.chdir(cwd);
    }
}

// Build platforms
if (buildConfig.shouldBuildPlatforms) {
    // TODO ...
}

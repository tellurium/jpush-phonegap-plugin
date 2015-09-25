#!/usr/bin/env node

// Remove the extra .so file folder, which cause baidu map crash
var cp = require('child_process');

var cmd = 'rm -rf platforms/android/libs/arm64-v8a; rm -rf platforms/android/libs/armeabi-v7a;';

cp.execSync(cmd);

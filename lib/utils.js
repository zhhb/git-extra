/**
 * Created by binzhao on 16/7/12.
 */

'use strict';

var fs = require('fs-extra');
var path = require('path');
var CONFIG_FILE_MAP = {};

exports.leftPad = function (str, len) {
    if (!str || Object.prototype.toString.call(len) !== '[object Number]') {
        return str;
    }
    while (str.length < len) {
        str = ' ' + str;
    }
    return str;
};

exports.rightPad = function (str, len) {
    if (!str || Object.prototype.toString.call(len) !== '[object Number]') {
        return str;
    }
    while (str.length < len) {
        str += ' ';
    }
    return str;
};

exports.checkBranchesConf = function (gitPath) {
    if (CONFIG_FILE_MAP['branches']) {
        return CONFIG_FILE_MAP;
    }
    var branches_config_file_path = path.resolve(gitPath, '.zgit/branches');
    CONFIG_FILE_MAP['branches'] = branches_config_file_path;
    fs.ensureFileSync(branches_config_file_path);
    return CONFIG_FILE_MAP;
};

exports.readBranchesConf = function (gitPath) {
    var branchesConfigPath = this.checkBranchesConf(gitPath)['branches'];
    var branches = fs.readJsonSync(branchesConfigPath, {throws: false});
    if (!branches) {
        branches = {};
    }
    return branches
};

exports.saveBranchesCOnf = function (gitPath, branches) {
    var branchesConfigPath = this.checkBranchesConf(gitPath)['branches'];
    return fs.writeJsonSync(branchesConfigPath, branches);
};

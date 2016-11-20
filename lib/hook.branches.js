/**
 * Created by binzhao on 16/7/12.
 */
var path = require('path');
var async = require('async');
var chalk = require('chalk');
var inquirer = require('inquirer');
var NodeGit = require('nodegit');
var Repository = NodeGit.Repository;
var Reference = NodeGit.Reference;
var CheckoutOptions = NodeGit.CheckoutOptions;

var utils = require('./utils');

/**
 * @param next
 * @return repo
 */
var openRepoTask = function (next) {
    var cwd = process.cwd();
    var repoPath = path.resolve(cwd);
    Repository.open(repoPath).then(
        function (repo) {
            next(null, { repo: repo });
        },
        function (err) {
            next(err);
        }
    )
};

/**
 * @param prevTaskResult
 * @param next
 * @return prevTaskResult
 */
var currentBranchTask = function (prevTaskResult, next) {
    var repo = prevTaskResult['repo'];
    repo.getCurrentBranch().then(
        function (reference) {
            //get refs name
            var localBranch = reference.name();
            prevTaskResult['currentBranch'] = localBranch;
            next(null, prevTaskResult);
        },
        function (err) {
            next(err);
        }
    );
};

/**
 * @param prevTaskResult
 * @param next
 * @return prevTaskResult
 */
var referenceListTask = function (prevTaskResult, next) {
    var repo = prevTaskResult['repo'];
    repo.getReferences(Reference.TYPE.LISTALL).then(
        function (refs) {
            prevTaskResult['refs'] = refs;
            next(null, prevTaskResult);
        },
        function (err) {
            next(err);
        }
    );
};

// var cmdRegisterAlias = function (program) {
//     program
//         .command('alias')
//         .description('设置或者修改当前分支的别名')
//         .action(function cmd_alias() {
//             var self = this;
//             async.waterfall(
//                 [
//                     openRepoTask.bind(self),
//                     currentBranchTask.bind(self)
//                 ],
//                 function (err, results) {
//                     if (err) {
//                         console.error('ERROR: ', err.message);
//                         return process.exit(0);
//                     }
//                     var gitPath = results['repo'].path();
//                     var branches = utils.readBranchesConf(gitPath);
//                     var localBranch = results['currentBranch'];
//                     inquirer
//                         .prompt({
//                             type: 'input',
//                             name: 'alias_local_branch_alias',
//                             message: '请输入分支的别名'
//                         })
//                         .then(function (result) {
//                             var aliasName = result['alias_local_branch_alias'].trim();
//                             // link map  local branch --> custom alias branch name
//                             if (aliasName) {
//                                 branches[localBranch] = aliasName;
//                             }
//                             utils.saveBranchesCOnf(gitPath, branches);
//                         });
//                 }
//             );
//         });
// };

// var cmdRegisterList = function (program) {
//     program
//         .command('branch')
//         .alias('list')
//         .description('查看当前项目的所有别名和别名对应的本地分支名')
//         .option('-r,--remote', '查看当前项目远程分支以及对应的别名')
//         .option('-l,--local', '查看当前项目本地分支以及对应的别名')
//         .action(function cmd_list() {
//             var self = this;
//             async.waterfall(
//                 [
//                     openRepoTask.bind(self),
//                     currentBranchTask.bind(self),
//                     referenceListTask.bind(self),
//                 ],
//                 function (err, results) {
//                     if (err) {
//                         console.error('ERROR: ', err.message);
//                         return process.exit(0);
//                     }
//                     var argv = program['rawArgs'].slice(3);
//                     var gitPath = results['repo'].path();
//                     var branches = utils.readBranchesConf(gitPath);
//                     var branches_keys = Object.keys(branches);
//                     var localBranch = results['currentBranch'];
//                     var refs = results['refs'];
//                     if (argv && ['-r', '--remote'].indexOf(argv[0]) > -1) {
//                         var remoteRefs = [];
//                         refs.forEach(function (ref) {
//                             if (ref.isRemote() && remoteRefs.indexOf(ref.name()) == -1) {
//                                 remoteRefs.push(ref.name());
//                                 console.log('  ', chalk.green(ref.shorthand()));
//                             }
//                         });
//                         remoteRefs = undefined;
//                     } else {
//                         refs.forEach(function (ref) {
//                             var ref_name = ref.name();
//                             if (ref.isBranch()) {
//                                 if (branches_keys.indexOf(ref_name) > -1) {
//                                     console.log(localBranch == ref ? ' ∗' : '  ', chalk.green(ref.shorthand()), chalk.yellow('('), chalk.yellow(branches[ref_name]), chalk.yellow(')'));
//                                 }
//                                 else {
//                                     console.log(localBranch == ref ? ' ∗' : '  ', chalk.green(ref.shorthand()));
//                                 }
//                             }
//                         });
//                     }
//                 }
//             )
//         });
// };

// var cmdRegisterCheckout = function (program) {
//     program
//         .command('checkout')
//         .alias('ck')
//         .description('检出一个分支，并且对它设置别名')
//         .action(function cmd_checkout() {
//             var self = this;
//             async.waterfall(
//                 [
//                     openRepoTask.bind(self),
//                     currentBranchTask.bind(self),
//                     referenceListTask.bind(self),
//                 ],
//                 function (err, results) {
//                     if (err) {
//                         console.error('ERROR: ', err.message);
//                         return process.exit(0);
//                     }
//                     var gitPath = results['repo'].path();
//                     var branches = utils.readBranchesConf(gitPath);
//                     var branches_keys = Object.keys(branches);
//                     var localBranch = results['currentBranch'];
//                     var refs = results['refs'];
//                     var choices = [];
//                     var choicesRefs = [];
//                     refs.forEach(function (ref) {
//                         var ref_name = ref.name();
//                         var names = ref_name.split('/');
//                         if (names[1] == 'heads') {
//                             if (branches_keys.indexOf(ref_name) > -1) {
//                                 choices.push(chalk.green(names.slice(2).join('/')) + chalk.yellow(' ( ') + chalk.yellow(branches[ref_name]) + chalk.yellow(' ) '));
//                                 choicesRefs.push(ref_name);
//                             }
//                             else {
//                                 choices.push(chalk.green(names.slice(2).join('/')));
//                                 choicesRefs.push(ref_name);
//                             }
//                         }
//                     });
//                     var defaultChoices = choicesRefs.indexOf(localBranch);
//                     inquirer
//                         .prompt([
//                             {
//                                 type: 'list',
//                                 name: 'checkout_local_branch_select',
//                                 message: '请选择需要切换的分支',
//                                 choices: choices,
//                                 default: defaultChoices
//                             },
//                             {
//                                 type: 'input',
//                                 name: 'checkout_local_branch_alias',
//                                 message: '请输入分支的别名'
//                             }
//                         ])
//                         .then(function (result) {
//                             var ref = choicesRefs[choices.indexOf(result['checkout_local_branch_select'])];
//                             var alias = result['checkout_local_branch_alias'].trim();
//                             results['repo']
//                                 .checkoutBranch(ref, new CheckoutOptions())
//                                 .then(function () {
//                                     if (alias) {
//                                         branches[ref] = alias;
//                                         utils.saveBranchesCOnf(gitPath, branches);
//                                     }
//                                 }, function (err) {
//                                     console.error('ERROR', err.message);
//                                 });
//                         });
//                 }
//             )
//         })
//         .option('-r,--remote', '从一个远程分支检出,并创建一个新分支')
//         .option('-l,--local', '从一个本地分支检出,并创建一个新分支')
// };

// exports.registerCommand = function (type, program) {
//     switch (type) {
//         case 'alias':
//             cmdRegisterAlias(program);
//             break;
//         case 'list':
//             cmdRegisterList(program);
//             break;
//         case 'checkout':
//             cmdRegisterCheckout(program);
//             break;
//         default:
//             break;
//     }
// };
"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core = require("@actions/core");
var fs = require("fs");
var path = require("path");
var Loader = (function () {
    function Loader(default_path) {
        if (default_path === void 0) { default_path = '.env'; }
        this.path = core.getInput('path') != '' ? core.getInput('path') : default_path;
    }
    Loader.prototype.execute = function () {
        this.load_path();
        if (core.getInput('extras') != '')
            this.dump(core.getInput('extras'));
    };
    Loader.prototype.load_path = function () {
        if (fs.existsSync(this.path)) {
            var stat = fs.lstatSync(this.path);
            if (stat.isFile()) {
                this.load_file();
            }
            else if (stat.isDirectory()) {
                this.load_directory();
            }
            else {
                core.error("Path '" + this.path + "' is neither file nor folder.");
                process.exit(1);
            }
        }
        else {
            core.warning("Path " + this.path + "' not found.");
        }
    };
    Loader.prototype.load_file = function () {
        this.dump(fs.readFileSync(this.path));
    };
    Loader.prototype.load_directory = function (parents) {
        var _this = this;
        if (parents === void 0) { parents = []; }
        fs.readdirSync(path.join(this.path, path.join.apply(path, parents))).sort().forEach(function (file) {
            var p = path.join(_this.path, path.join.apply(path, parents), file);
            var stat = fs.lstatSync(p);
            if (stat.isFile()) {
                _this.value(__spreadArray(__spreadArray([], parents), [file]).join('_'), fs.readFileSync(p));
            }
            else if (stat.isDirectory()) {
                _this.load_directory(__spreadArray(__spreadArray([], parents), [file]));
            }
            else {
                core.warning("Path '" + p + "' is neither file nor folder.");
            }
        });
    };
    Loader.prototype.value = function (key, value) {
        console.log(key + " => " + value.toString().trim());
        core.exportVariable(key, value.toString().trim());
    };
    Loader.prototype.dump = function (env) {
        var output = fs.createWriteStream(process.env['GITHUB_ENV'] || 'test.txt');
        output.write(env);
        output.end();
    };
    return Loader;
}());
exports.default = Loader;
new Loader().execute();

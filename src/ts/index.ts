import * as core from '@actions/core'
import * as fs from 'fs';
import * as path from 'path';

export default class Loader {

    path: string

    constructor(default_path = '.env') {
        // Detect path
        this.path = core.getInput('path') || default_path
    }

    execute() {
        // Initiate output stream
        this.load_path()
    }

    load_path() {
        if (fs.existsSync(this.path)) {
            var stat = fs.lstatSync(this.path)
        
            if (stat.isFile()) {
                this.load_file()
            } else if (stat.isDirectory()) {
                this.load_directory()
            } else {
                core.error(`Path '${this.path}' is neither file nor folder.`)
                process.exit(1)
            }
        } else {
            core.warning(`Path ${this.path}' not found.`)
        }
    }

    load_file() {
        // Simply copy file content to output
        var output = fs.createWriteStream(process.env['GITHUB_ENV'] || 'test.txt');
        output.write(fs.readFileSync(this.path))
        output.end()
    }

    load_directory(parents: string[] = []) {
        fs.readdirSync(path.join(this.path, path.join(...parents))).sort().forEach(file => {
            var p = path.join(this.path, path.join(...parents), file)
            var stat = fs.lstatSync(p);

            if (stat.isFile()) {
                var value = fs.readFileSync(p).toString().trim()
                core.exportVariable([...parents, file].join('_'), value)
            } else if (stat.isDirectory()) {
                this.load_directory([...parents, file])
            } else {
                core.warning(`Path '${p}' is neither file nor folder.`)
            }
        });
    }
}

new Loader().execute()
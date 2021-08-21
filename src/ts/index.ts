import * as core from '@actions/core'
import * as fs from 'fs';
import * as path from 'path';

export default class Loader {

    debug: boolean
    path: string
    output: fs.WriteStream

    constructor(default_path = '.env') {
        // Detect path
        this.path = core.getInput('path') != '' ? core.getInput('path') : default_path

        core.info(`Using path '${this.path}'`)
    }

    execute() {
        this.output = fs.createWriteStream(process.env['GITHUB_ENV'] || 'test.txt');

        this.load_path()

        if (core.getInput('extras') != '')
            this.dump(core.getInput('extras'))

        this.output.end()
    }

    load_path() {
        if (fs.existsSync(this.path)) {
            var stat = fs.lstatSync(this.path)
        
            if (stat.isFile()) {
                this.load_file()
            } else if (stat.isDirectory()) {
                this.load_directory()
            } else {
                core.error(`Path '${this.path}' is neither file nor folder`)
                process.exit(1)
            }
        } else {
            core.warning(`Path ${this.path}' not found`)
        }
    }

    load_file() {
        this.dump(fs.readFileSync(this.path))
    }

    load_directory(parents: string[] = []) {
        fs.readdirSync(path.join(this.path, path.join(...parents))).sort().forEach(file => {
            var p = path.join(this.path, path.join(...parents), file)
            var stat = fs.lstatSync(p);

            if (stat.isFile()) {
                this.value([...parents, file].join('_'), fs.readFileSync(p))
            } else if (stat.isDirectory()) {
                this.load_directory([...parents, file])
            } else {
                core.warning(`Path '${p}' is neither file nor folder`)
            }
        });
    }

    value(key: string, value: string | Buffer) {
        value = value.toString().trim()
        
        core.info(`${key} => ${value}`)
        this.output.write(`${key}=${value}\n`)
    }

    dump(env: Buffer | string) {
        this.output.write(env)
    }
}

new Loader().execute()
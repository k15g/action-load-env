import * as fs from 'fs';
import * as path from 'path';

// Initiate output stream
var output = fs.createWriteStream(process.env['GITHUB_ENV'] || 'test.txt');


const input_path = process.env['INPUT_PATH'] || '.env'

if (fs.existsSync(input_path)) {
    var stat = fs.lstatSync(input_path)

    if (stat.isFile()) {
        // Simply copy file content to output
        output.write(fs.readFileSync(input_path))
    } else if (stat.isDirectory()) {
        fs.readdirSync(input_path).forEach(file => {
            var p = path.join(input_path, file)
            var ps = fs.lstatSync(p);

            if (ps.isFile()) {
                var value = fs.readFileSync(p).toString().trim()
                output.write(`${file}=${value}\n`)
            } else if (ps.isDirectory()) {
                // TODO Handle directories
            } else {
                // TODO Write warning
            }
        });
    } else {
        console.log(`${input_path} is neither file nor folder.`)
        process.exit(1)
    }
} else {
    console.log(`'${input_path}' not found.`)
}

output.end()

// console.log(process.env)
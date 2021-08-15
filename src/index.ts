import * as fs from 'fs';

if (fs.existsSync(".env")) {
  console.log("Jepp")
} else {
  console.log("Nopp")
}

console.log(process.env);
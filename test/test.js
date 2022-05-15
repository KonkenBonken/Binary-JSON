import { parse, serialize } from '../lib/index.js';
import fs from 'fs';


const source = JSON.parse(fs.readFileSync('sample.json', 'utf-8').trim());
console.log(source);

const parsed = parse(source)
	.writeFile('sample.kjo', true);

const serialized = serialize(parsed);
console.log(serialized);


console.log('File sizes:', {
	'sample.json': fs.statSync('sample.json').size,
	'sample.kjo': fs.statSync('sample.kjo').size,
})

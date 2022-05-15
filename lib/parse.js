import is from 'is-type-of';
import fs from 'fs';

const iterate = (obj, callback) =>
	Object.entries(obj).forEach(([key, value]) => {
		callback(key, value);

		if (is.object(value))
			iterate(value, callback)
	});

const Byte = (value, length = 1, method) => {
	const buf = Buffer.alloc(length);
	if (!method) buf.writeIntBE(value, 0, length);
	return buf;
}

/**
 * Parse an object
 * @param {object|string} obj The JavaScript Object or a JSON string
 * @return {Buffer} The .kjo file
 */
export function parse(obj) {
	const result = [],
		push = (...a) => result.push(...a.map(v => is.number(v) ? Byte(v) : v)),

		pushNumber = value => {
			if (Math.abs(value) < 2 ** 7) push(0, Byte(value))
			else if (Math.abs(value) < 2 ** 15) push(1, Byte(value, 2))
			else if (Math.abs(value) < 2 ** 31) push(2, Byte(value, 4))
			else push(3, Byte(value, 8));
		},
		pushString = value => {
			let strBuffer = Buffer.from(value),
				strLen = strBuffer.length;

			pushNumber(strLen);
			push(strBuffer);
		}
	iterate(obj, (key, value) => {

		// push(1);
		pushString(key);

		if (is.null(value)) {
			push(0);
		} else if (is.string(value)) {
			push(1);
			pushString(value);
		} else if (is.number(value)) {
			push(2);
			pushNumber(value);
		} else if (is.boolean(value)) {
			push(3);
			push(+value);
		}
	});


	const resultBuffer = Buffer.concat(result);

	/**
	 * Write buffer to file
	 * @param {string} fileName The name of the file to write to
	 * @param {boolean} [sync=false] Whether to run synchronous instead of asynchronous
	 * @return {Buffer|Promise<Buffer>} The .kjo file
	 */
	resultBuffer.writeFile = (fileName, sync = false) => {
		if (sync) {
			fs.writeFileSync(fileName, resultBuffer);
			return resultBuffer;
		}
		return fs.promises.writeFile(fileName, resultBuffer).then(() => resultBuffer);
	};

	return resultBuffer;
}

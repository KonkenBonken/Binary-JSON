import is from 'is-type-of';

const iterate = (obj, callback) =>
	Object.entries(obj).forEach(([key, value]) => {
		callback(key, obj, value);

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
	console.log(obj);
	iterate(obj, (key, obj, value) => {

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

	return Buffer.concat(result)
}

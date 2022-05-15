/**
 * Parse an object
 * @param  {Buffer} buffer The .kjo file
 * @return {object|string} The JavaScript Object
 */
export function serialize(buf) {

	const bytes = [...buf.values()],
		parsed = [];

	let key = true;
	for (let i = 0; i < bytes.length; key = !key) {
		if (key) {
			let byteLength = 2 ** bytes[i++];
			let strLen = buf.readIntBE(i, byteLength);
			i += byteLength;
			let strBytes = bytes.slice(i, i + strLen)
			i += strLen;
			let str = Buffer.from(strBytes).toString();
			parsed.push(str);
			continue;
		}


		if (bytes[i] == 0) {
			i++;
			parsed.push(null);
		} else if (bytes[i] == 1) {
			i++;
			let byteLength = 2 ** bytes[i++];
			let strLen = buf.readIntBE(i, byteLength);
			i += byteLength;
			let strBytes = bytes.slice(i, i + strLen)
			i += strLen;
			let str = Buffer.from(strBytes).toString();
			parsed.push(str);
		} else if (bytes[i] == 2) {
			i++;
			let byteLength = 2 ** bytes[i++];
			let num = buf.readIntBE(i, byteLength);
			i += byteLength;
			parsed.push(num);
		} else if (bytes[i] == 3) {
			i++;
			let num = buf.readInt8(i);
			i++;
			parsed.push(!!num);
		} else console.log('not catched:', bytes[i++])
	}

	let result = {};
	for (var i = 0; i < parsed.length; i++)
		result[parsed[i]] = parsed[++i];

	return result;
}
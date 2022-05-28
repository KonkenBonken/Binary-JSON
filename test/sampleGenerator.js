import fs from 'fs';
import randomItem from 'random-item';
import _randomString from 'crypto-random-string';
import _randomInteger from 'random-int';
import randomBoolean from 'random-boolean';

function randomString(min = 1, max = 1024) {
	return _randomString({
		length: randomInteger(min, max),
		type: 'ascii-printable'
	})
}

function randomInteger(min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) {
	return _randomInteger(min, max)
}

function randomValue() {
	return randomItem([randomString, randomInteger, randomBoolean, () => null])();
}

export default function (write = true) {
	const sample = {};
	for (let i = 0; i < randomInteger(512, 1024); i++) {
		sample[randomString()] = randomValue();
	}

	if (write)
		fs.writeFileSync('sample.json', JSON.stringify(sample));

	return sample;
}
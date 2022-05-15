/**
 * Parse an object
 * @param obj - The JavaScript Object or a JSON string
 * @returns The .kjo file
 */
declare function parse(obj: any | string): Buffer;

/**
 * Parse an object
 * @param buffer - The .kjo file
 * @returns The JavaScript Object
 */
declare function serialize(buffer: Buffer): any | string;


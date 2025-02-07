export function generateSerialNumber(length: number = 12): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-";
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  //generate serial
  let serial = "";
  for (let i = 0; i < length; i++) {
    serial += chars[array[i] % chars.length];
  }

  return serial;
}

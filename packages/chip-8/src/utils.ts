export function toHexString(byte: number) {
  return byte.toString(16).padStart(4, "0")
}

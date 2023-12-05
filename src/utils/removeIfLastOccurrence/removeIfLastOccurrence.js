export default function removeIfLastOccurrence(str, piece) {
  if (!str || !str.length) return;

  if (str.lastIndexOf(piece) === str.length - 1) {
    return str.substr(0, str.length - 1);
  }

  return str;
}

export default function parseDateISOString(s) {
  const ds = s.split('-').map((s) => parseInt(s, 10));
  ds[1] -= 1; // ajusta o mes
  return new Date(...ds);
}

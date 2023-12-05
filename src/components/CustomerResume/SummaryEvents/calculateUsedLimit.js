export default function calculateUsedLimit(event) {
  try {
    const {
      data: {
        item: { available, total },
      },
    } = event;
    return (100 - (available / total) * 100).toFixed(0);
  } catch (err) {
    return 0;
  }
}

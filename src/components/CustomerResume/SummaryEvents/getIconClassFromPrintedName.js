// TODO: update mapping according

const map = {
  'enviado para a produção': 'pismofonts_cartao',
};

const fallbackClass = 'icon-pismofonts_cartao';

export default function getIconClassFromPrintedName(printedName) {
  const key = printedName;
  if (map[key]) return `icon-${map[key]}`;

  // Use fallback if not found
  return fallbackClass;
}

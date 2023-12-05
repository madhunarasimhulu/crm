// TODO: update mapping according

const map = {
  APPLE_PAY: 'pismofonts_cartao',
};

const fallbackClass = 'icon-pismofonts_cartao';

export default function getIconClassFromWalletName(walletName) {
  const key = walletName;
  if (map[key]) return `icon-${map[key]}`;

  // Use fallback if not found
  return fallbackClass;
}

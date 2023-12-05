const map = {
  AGRICULTURE: 'pismofonts_sustentabilidade',
  AIRLINE: 'pismofonts_viagem',
  ASSOCIATIONS: 'pismofonts_carteirada',
  AUTOMOBILE: 'pismofonts_veiculo',
  'CAR RENTAL': 'pismofonts_consorcio_auto',
  CRUISE: 'pismofonts_transporte',
  DIGITAL: 'pismofonts_biometria',
  'DIRECT SALES': 'pismofonts_compras_vendas',
  DRUGSTORE: 'pismofonts_despesas_com_saude',
  'DUTY FREE': 'pismofonts_mala',
  ELETRONICS: 'pismofonts_celular',
  ENTERTAINMENT: 'pismofonts_50_teatro',
  'FEES & FINES': 'pismofonts_documento',
  FOOD: 'pismofonts_alimentacao',
  FUEL: 'pismofonts_credito_auto',
  GAMBLING: 'pismofonts_saldo',
  GENERAL: 'pismofonts_full_senha_fill',
  HEALTH: 'pismofonts_vida',
  HOME: 'pismofonts_residencia',
  HOTEL: 'pismofonts_para_empresa',
  JEWELRY: 'pismofonts_estrela',
  LOTTERY: 'pismofonts_saldo',
  MONEY: 'pismofonts_saldo',
  PARKING: 'pismofonts_veiculo',
  RENTAL: 'pismofonts_documento',
  RETAIL: 'pismofonts_usuario_perfil',
  SCHOOL: 'pismofonts_universitarios',
  SERVICES: 'pismofonts_gerente',
  SUPERMARKET: 'pismofonts_compras_vendas',
  SUPPLIES: 'pismofonts_armario',
  TRANSPORT: 'pismofonts_veiculo',
  TRAVEL: 'pismofonts_viagem',
  UTILITIES: 'pismofonts_configuracoes',
  WHOLESALE: 'pismofonts_lideranca',
};

const fallbackClass = 'icon-pismofonts_full_senha_fill';

export default function getIconClassFromGroupName(groupName) {
  const key = groupName;
  if (map[key]) return `icon-${map[key]}`;

  // Use fallback if not found
  return fallbackClass;
}

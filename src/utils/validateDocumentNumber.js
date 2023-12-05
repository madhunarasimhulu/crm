import { isValid as isValidCpf } from '@fnando/cpf';
import { isValid as isValidCnpj } from '@fnando/cnpj';

export const validateDocumentNumber = (documentNumber) => {
  const doc = documentNumber.replace(/\D/g, '');
  return isValidCpf(doc) || isValidCnpj(doc);
};

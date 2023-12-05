export const onBoardingConfig = {
  CL_000CUB: {
    code: 'CL_000CUB',
    name: `Dhi City Union Bank 
    Credit Card`,
    welcome_message: `You are eligible for the DHI CUB Credit Card
    with a credit limit of RS {{LIMIT}}, would you like to confirm
    your request`,
    headerColor: '#000000',
    footerColor: '#000000',
    logo: require('../../assets/img/banner.png'),

    cssFile: 'css/Cub.scss',
    terms_conditions_pdf_url: `https://www.activatedhicub.42cs.in/static/media/MITC.2329a4509b8cf127ca84.pdf`,
    tenantName: `Dhi City Union Credit Card`,
    Accepted_Applicant_reason_id: Number(
      process.env.REACT_APP_ACCEPTED_APPLICATION,
    ),
  },
  CL_00UTKB: {
    code: 'CL_00UTKB',
    name: `Utkarsh Bank Credit Card`,
    welcome_message: `You are eligible for the Utkarsh Bank Credit Card 
    with a credit limit of Rs {{LIMIT}}, would you like to confirm your request`,
    cssFile: 'css/Usfb.scss',
    logo: require('../../assets/img/usfb/usfb_logo.png'),
    terms_conditions_pdf_url: `https://www.utkarsh.bank/terms-and-conditions`,
    tenantName: `Utkarsh Credit Card`,
    terms_conditions_pdf_url:
      'https://d69a9634-c194-4695-9a90-e4e78c8989e4-42cs-usfb-sand-pubilc.s3.ap-south-1.amazonaws.com/MITC-+17-04-2024.pdf',
    card_member_agreement_url:
      'https://d69a9634-c194-4695-9a90-e4e78c8989e4-42cs-usfb-sand-pubilc.s3.ap-south-1.amazonaws.com/Card+Member+Agreement-+17-04-2023%5B18082%5D.pdf',
    key_fact_statement_url:
      'https://d69a9634-c194-4695-9a90-e4e78c8989e4-42cs-usfb-sand-pubilc.s3.ap-south-1.amazonaws.com/KeyFactStatement-+10.04.23.pdf',
    Accepted_Applicant_reason_id: Number(
      process.env.REACT_APP_ACCEPTED_APPLICATION_USFB,
    ),
  },
};

export const getConfig = (clientId) => {
  return !!onBoardingConfig[clientId];
};

const abledCases = [];

export const isAble = (roles) =>
  roles.some((item) => abledCases.includes(item));

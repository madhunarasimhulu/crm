const sortByDescDate = (items, prop) =>
  items.sort((a, b) => (+new Date(a[prop]) > +new Date(b[prop]) ? -1 : 1));

export default sortByDescDate;

export const formatNumber = (n:number) => Intl.NumberFormat().format(n);
export const formatShortDate = (d:Date|number|string) => new Date(d).toLocaleDateString();

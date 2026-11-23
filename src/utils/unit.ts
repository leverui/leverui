// Every CSS length unit. Sharing one list keeps a length such as `2cap` from being read as a
// token name.
const lengthUnits = [
  'cm,mm,Q,in,pc,pt,px',
  'em,rem,ex,rex,cap,rcap,ch,rch,ic,ric,lh,rlh',
  'vw,vh,vi,vb,vmin,vmax',
  'svw,svh,svi,svb,svmin,svmax',
  'lvw,lvh,lvi,lvb,lvmin,lvmax',
  'dvw,dvh,dvi,dvb,dvmin,dvmax',
  'cqw,cqh,cqi,cqb,cqmin,cqmax',
  '%',
].join(',');
const lengthUnitsPattern = `(?:${lengthUnits.split(',').join('|')})`;
// CSS units ignore case, so `10PX` is a length too.
const lengthRegExp = new RegExp(
  `^[+-]?[0-9]*\\.?[0-9]+(?:[eE][+-]?[0-9]+)?${lengthUnitsPattern}$`,
  'i',
);

/** Recognize supported CSS lengths without accepting unitless strings. */
export const isCssUnit = (v: unknown) => typeof v === 'string' && lengthRegExp.test(v);

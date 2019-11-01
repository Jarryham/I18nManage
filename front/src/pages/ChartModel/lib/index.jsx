/**
 * 流量智能转换函数
 * @param {Number} value 流量的值，单位byte 
 * @param {Number} level 阈值设定，一般为1，出现转换为1000M，想让他显示为1G，该值可适当调低，例如设置成0.9 
 * @param {Number} num 小数点保留多少位，默认为2
 * @param {Number} levelRate 流量单位转换的单位值，默认是1000，有必要可填入1024，按1024转换
 */
export function unitFlow(value,level,num,levelRate){
  if(!value) return 0;
  var n=num?num:2;
  var levelRate = levelRate ? levelRate : 1000
  n = num === 0 ? 0: n
  if(value/Math.pow(levelRate, 4)>level){
    return (value/Math.pow(levelRate, 4)).toFixed(n)+"T";
  }else if(value/Math.pow(levelRate, 3)>level){
    return (value/Math.pow(levelRate, 3)).toFixed(n)+"G";
  }else if(value/Math.pow(levelRate, 2)>level){
    return (value/Math.pow(levelRate, 2)).toFixed(n)+"M";
  }else if(value/Math.pow(levelRate, 1)>level){
    return (value/Math.pow(levelRate, 1)).toFixed(n)+"K";
  }else{
    return value.toFixed(n);
  }
}
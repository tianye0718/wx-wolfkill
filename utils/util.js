const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const numberToChinese = number => {
  var chnNumChar = ["零","一","二","三","四","五","六","七","八","九"];
     var chnUnitChar = ["","十","百","千","万","亿","万亿","亿亿"];
     var strIns = '', chnStr = '';
     var unitPos = 0;
     var zero = true;
     while(number > 0){
         var v = number % 10;
         if(v === 0){
              if(!zero){
                   zero = true;
                   chnStr = chnNumChar[v] + chnStr;
              }
         }else{
               zero = false;
               strIns = chnNumChar[v];
               strIns += chnUnitChar[unitPos];
               chnStr = strIns + chnStr;
         }
         unitPos++;
         number = Math.floor(number / 10);
      }
      return chnStr;
}

module.exports = {
  formatTime: formatTime,
  numberToChinese: numberToChinese
}

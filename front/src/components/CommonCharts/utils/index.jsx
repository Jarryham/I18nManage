import _ from 'lodash'
// 补全时间函数
/**
 * 
 * @param {*} data  例： [
      { time: 1543939200, inF: 5000, outF: 6000, type: 'active' },
      { time: 1543942800, inF: 4000, outF: 7000, type: 'online' }
    ]
 * @param {*} set   key: "time", // 补全依据的字段 如果数组数据根据时间补全，则传入记录时间的key值，注意，对应的key对应在data里面的值需要为数值
                    start: 起始时间,      
                    end: 结束时间,        
                    space: 300 数据间隔, 
                    zeroFill: ["INF", "OUTF"] // 需要补全的字段，补全后会把0 赋值到对应的字段上面
                    series: String 按系列补全 // 默认不按系列补全 按系列补全会根据对应的系列生成多系列的数据
 */
export function spaceFix(data, set) {
  if (!data || data.length == 0) return data;
  var fix = [];
  if (set.series) {
    var dataGroup = _.groupBy(data, set.series)
    for(var k in dataGroup) {
      var currentData = _.sortBy(dataGroup[k], function(d) { return d[set.key] })
      // console.log(currentData, 'inner')
      // 补起点
      if (currentData[0][set.key] - set.start > 0) {
        var obj = {}
        obj[set.key] = set.start;
        _.map(set.zeroFill, function (d) {
          obj[d] = 0
          obj[set.series] = k
        })
        currentData.unshift(obj);
      }
     
      // 补结束点
      if (currentData[currentData.length - 1][set.key] < set.end) {
        var obj = {};
        obj[set.key] = set.end;
        _.map(set.zeroFill, function (d) {
          obj[d] = 0;
          obj[set.series] = k
        });
        currentData.push(obj);
      }
      for (var i = 1, j = 0, len = currentData.length; i < len; i++) {
        if (i > 10000) break;
        var space = currentData[i][set.key] - currentData[i - 1][set.key];
        // 补零
        if (space <= set.space) {
          fix.push(currentData[i])
        } else {
          var t = set.space;
          for (var x = 0, l = space / set.space; x < (l - 1); x++) {
            if (x > 10000) break;
            var obj = {};
            obj[set.key] = parseInt(currentData[i - 1][set.key]) + parseInt(t);
            _.map(set.zeroFill, function (d) {
              obj[d] = 0;
              obj[set.series] = k
            });
            fix.push(obj);
            t += set.space;
          }
          fix.push(currentData[i]);
        }
      }
      fix.unshift(currentData[0]);
    }
    return fix
  } else {
    data = _.sortBy(data, function(d) { return d[set.key] })
    // 补起点
    if (data[0][set.key] - set.start > 0 && set.start) {
      var obj = {};
      obj[set.key] = set.start;
      _.map(set.zeroFill, function (d) {
        obj[d] = 0;
      })
      data.unshift(obj);
    }
    // 补结束点
    if (data[data.length - 1][set.key] < set.end) {
      var obj = {};
      obj[set.key] = set.end;
      _.map(set.zeroFill, function (d) {
        obj[d] = 0;
      });
      data.push(obj);
    }
    for (var i = 1, j = 0, len = data.length; i < len; i++) {
      if (i > 10000) break;
      var space = data[i][set.key] - data[i - 1][set.key];
      // 补零
      if (space <= set.space) {
        fix.push(data[i])
      } else {
        var t = set.space;
        for (var k = 0, l = space / set.space; k < (l - 1); k++) {
          if (k > 10000) break;
          var obj = {};
          obj[set.key] = parseInt(data[i - 1][set.key]) + parseInt(t);
          _.map(set.zeroFill, function (d) {
            obj[d] = 0;
          });
          fix.push(obj);
          t += set.space;
        }
        fix.push(data[i]);
      }
    }
    fix.unshift(data[0]);
    return fix;
  }

}

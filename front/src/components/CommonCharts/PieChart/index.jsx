import React, { Component } from 'react';
import ReactEcharts from "echarts-for-react";
import 'echarts/lib/chart/lines';
import { spaceFix } from '../utils'
import _ from 'lodash'
import theme from '../utils/theme'

class PieChart extends Component {
  constructor(props) {
    super(props)
  }
  render() {
    // console.log('ttt')
    const option = this.getOption();
    return (
        <ReactEcharts
        style={{height: '100%', width: '100%'}}
        option={option}
        lazyUpdate={true}
        notMerge={true}
        />
    )
  }
  getOption() {
    const { dataSource, config } = this.props
    let resRender = this.initData(config, dataSource)
    // legend
    var legendValFormat = function(value) {
      return value
    }
    if (config.legend && config.legend.legendValFormat) {
      legendValFormat = config.legend.legendValFormat
    }
    let legend = {
      show: false,
      orient: 'vertical',
      left: 20,
      data: resRender.seriesNames
    }
    if (config.type && config.type === 1) {
      const newLegendData = []
      resRender.seriesNames.forEach(d => {
        newLegendData.push({ name: d, icon: 'circle' })
      })
      legend = {
        show: true,
        type: 'scroll',
        pageIconSize: 10,
        orient: 'vertical',
        right: '5%',
        top: 'middle',
        data: newLegendData,
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 20,
        formatter: function(name) {
          var oa = resRender.seriesData
          var sum = 0
          resRender.seriesData.forEach(item => {
            sum += parseFloat(item.value)
          })
          for (var i = 0; i < oa.length; i++) {
            if (name === oa[i].name) {
              return `${name}:  {valColorPercent|${(oa[i].value / sum * 100).toFixed(2)}%} {valColorVal|${legendValFormat(oa[i].value)}}  `
            }
          }
        },
        textStyle: {
          color: theme.LABEL_TXT_NAME_COLOR,
          rich: {
            valColorVal: {
              color: theme.LABEL_TXT_VAL_COLOR,
              fontFamily: 'PingFang Medium',
              width: 100,
              align: 'left'
            },
            valColorPercent: {
              color: theme.LABEL_TXT_VAL_COLOR,
              width: 60,
              align: 'right',
              fontFamily: 'PingFang Medium'
            }
          }
        }
      }
    }
    if (config.legend) {
      _.extend(legend, config.legend)
    }
    // grid
    const grid = {
      left: '3%',
      right: '3%',
      bottom: (config.itemRange && config.itemRange > 0 && dataSource.length > config.itemRange) ? '8%' : '5%',
      top: '20%',
      containLabel: true
    }
    if (config.grid) {
      _.extend(grid, config.grid)
    }


    const textName = config.title ? (config.title.text || '') : ''
    const titleSize = config.title ? (config.title.size || 12) : 12
    const titleFont = config.title ? (config.title.fontWeight || 400) : 400
    // tooltip
    const tooltipW = config.tooltip ? (config.tooltip.width || 200) : 200
    var tooltipValFormat = function(value) {
      return value
    }
    if (config.tooltip && config.tooltip.tooltipValFormat) {
      tooltipValFormat = config.tooltip.tooltipValFormat
    }
    // labelFormat
    var labelFormat = function(params) {
      // return `{b}:   {valColor|{c}}  {valColor|{d}%}`
      const name = params.name
      const percent = params.percent
      const value = params.value
      return `${name}:   {valColor|${value}}  {valColor|${percent}%}`
    }
    if (config.labelFormat) {
      labelFormat = config.labelFormat
    }

    const title = {
      text: textName,
      subtext: '',
      left: 20,
      textStyle: {
        fontSize: titleSize,
        fontWeight: titleFont
      }
    }
    return {
      color: theme.COLOR_PLATE_16,
      title: title,
      legend,
      grid,
      tooltip: {
        trigger: 'item',
        backgroundColor: '#fff',
        extraCssText: 'box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);',
        formatter: function(params) {
          return `<div class=${theme.TOOLTIP_CONTAINER_CLASS} style="width:${tooltipW}px">
                    <div class=${theme.TOOLTIP_TITLE_CLASS}>
                      <span style="float: left;">${params.seriesName}</span>
                      <span style="float: right;font-family: 'PingFang Medium'">${parseFloat(params.percent)}%</span>
                    </div>
                    <div class=${theme.TOOLTIP_LIST_CLASS}>
                      <span style="float: left;">${params.marker}${params.name}</span>
                      <span style="float: right;font-family: 'PingFang Medium'">${tooltipValFormat(params.value)}</span>
                    </div>
                  </div>`
        }
      },
      series: [
        {
          name: textName || '',
          type: 'pie',
          radius: '60%',
          center: config.type ? ['30%', '50%'] : ['50%', '50%'],
          data: resRender.seriesData,
          label: {
            show: !config.type,
            color: theme.LABEL_TXT_NAME_COLOR,
            formatter: function(params) {
              return labelFormat(params)
            },
            rich: {
              valColor: {
                color: theme.LABEL_TXT_VAL_COLOR,
                fontFamily: 'PingFang Medium'
              }
            }
          },
          labelLine: {
            show: !config.type,
            length: 30,
            length2: 0
          },
          itemStyle: {
            borderColor: '#fff',
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.1)'
            }
          }
        }
      ]
    }
  }
  initData(currentCfg, currentData) {
    var seriesNames = []
    var seriesData = []
    if (currentCfg.key) {
      currentData.forEach((item, index) => {
        seriesNames.push(item[currentCfg.key])
        var seriesItem = {}
        seriesItem.name = item[currentCfg.key]
        seriesItem.value = 0
        currentCfg.value.forEach(valKey => {
          if (item[valKey]) {
            seriesItem.value = item[valKey]
          }
        })
        seriesData.push(seriesItem)
      })
    }
    return {
      seriesNames,
      seriesData
    }
  }
}

export default PieChart
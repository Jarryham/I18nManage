import React, { Component } from 'react';
import ReactEcharts from "echarts-for-react";
import 'echarts/lib/chart/lines';
import { spaceFix } from '../utils'
import _ from 'lodash'
import theme from '../utils/theme'

class BarChart extends Component {
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
    const legend = {
      data: resRender.seriesNames,
      right: '10%',
      top: '5%',
      itemWidth: 8,
      itemHeight: 8,
      textStyle: {
        color: theme.YAXIS_LABEL_COLOR,
        fontSize: 12
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
    // tooltip
    const tooltipW = config.tooltip ? (config.tooltip.width || 200) : 200
    var tooltipValFormat = function(value) {
      return value
    }
    if (config.tooltip && config.tooltip.tooltipValFormat) {
      tooltipValFormat = config.tooltip.tooltipValFormat
    }
    // xAxis
    var yLabelFormat = function(d) { return d }
    var xLabelFormat = function(d) { return d }
    if (config.yAxis && config.yAxis.yLabelFormat) {
      yLabelFormat = config.yAxis.yLabelFormat
    }
    if (config.xAxis && config.xAxis.xLabelFormat) {
      xLabelFormat = config.xAxis.xLabelFormat
    }
    // datazoom
    let datazoom = null
    let startVal = 0
    let endVal = 100
    if (config.itemRange && config.itemRange > 0 && dataSource.length > config.itemRange) {
      if (dataSource.length > 0) {
        var dis = dataSource.length - config.itemRange
        startVal = dis < 0 ? 0 : dis
        endVal = dataSource.length - 1
      }
      datazoom = [{
        show: true,
        height: 12,
        showDataShadow: false,
        labelFormatter: null,
        showDetail: false,
        xAxisIndex: [
          0
        ],
        bottom: config.dataZoomBottom || 0,
        startValue: startVal,
        endValue: endVal,
        handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
        handleSize: '110%',
        handleStyle: {
          color: '#d3dee5'

        },
        textStyle: {
          color: '#fff' },
        borderColor: '#fff'
      }]
    }
    return {
      color: theme.COLOR_PLATE_16,
      legend: legend,
      grid,
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#fff',
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: theme.TOOLTIP_POINTER_SHADOW
          }
        },
        extraCssText: 'box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);',
        formatter: function(params) {
          let toolTipDom = `<div class=${theme.TOOLTIP_CONTAINER_CLASS} style="width:${tooltipW}px">
                    <div class=${theme.TOOLTIP_TITLE_CLASS}>
                      <span style="float: left;">${params[0].name}</span>
                    </div>`
          params.forEach((item, index) => {
            toolTipDom += `<div class=${theme.TOOLTIP_LIST_CLASS}>
                      <span style="float: left;">${item.marker}${item.seriesName}: </span>
                      <span style="float: right;font-family: 'PingFang Medium'">${tooltipValFormat(item.value)}</span>
                    </div>`
          })
          toolTipDom += '</div>'
          return toolTipDom
        }
      },
      xAxis: {
        name: config.xAxis ? (config.xAxis.xName || '') : '',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: {
          color: theme.XAXIS_LABEL_COLOR
        },
        type: 'category',
        data: resRender.xAxisNames,
        axisLine: {
          lineStyle: {
            color: '#e3e4e9'
          }
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          color: theme.XAXIS_LABEL_COLOR,
          fontFamily: 'PingFang Medium',
          formatter: function(d) {
            return xLabelFormat(d)
          }
        }
      },
      yAxis: {
        type: 'value',
        name: config.yAxis ? (config.yAxis.yName || '') : '',
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: '#e5e9f2',
            type: 'dashed'
          }
        },
        axisLabel: {
          color: theme.YAXIS_LABEL_COLOR,
          fontFamily: 'PingFang Medium',
          formatter: function(d) {
            return yLabelFormat(d)
          }
        }
      },
      dataZoom: datazoom,
      series: resRender.seriesData

    }
  }
  initData(currentCfg, analysData) {
    var seriesNames = currentCfg.seriesName
    var xAxisNames = []
    var seriesData = []
    analysData.forEach(d => {
      xAxisNames.push(d[currentCfg.key])
    })
    if (currentCfg.key && currentCfg.seriesName) {
      currentCfg.value.forEach((item, index) => {
        var seriesItem = {
          name: seriesNames[index],
          data: [],
          type: 'bar',
          barWidth: currentCfg.barWidth || 10,
          barGap: 0,
          itemStyle: {
            barBorderRadius: [2, 2, 0, 0]
          }
        }
        analysData.forEach(dataItem => {
          var dataValue = {
            name: dataItem[currentCfg.key],
            value: dataItem[item] || 0
          }
          seriesItem.data.push(dataValue)
        })
        var seriesReset = function(d) { return d }
        if (currentCfg.seriesReset) {
          seriesReset = currentCfg.seriesReset
        }
        seriesItem = seriesReset(seriesItem)
        seriesData.push(seriesItem)
      })
    }
    return {
      seriesNames,
      seriesData,
      xAxisNames
    }
  }
}

export default BarChart
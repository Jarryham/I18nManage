import React, { Component } from 'react'
import { unitFlow } from '../../lib'
import PieChart from '@/components/CommonCharts/PieChart'

class BusFlow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      config: {
        key: 'name',
        value: ['inbyte', 'outbyte'],
        // seriesName: ['流入流量', '流出流量'],
        // 可选配置项
        title: {
          text: '流量占比',
          size: 12,
          x: 'left'
        },
        // 指示标签值的格式化
        labelFormat: function(params) {
          const name = params.name
          const percent = params.percent
          const value = params.value
          return `${name}:   {valColor|${unitFlow(value, 2)}B}  {valColor|${percent}%}`
        },
        tooltip: {
          width: 200,
          tooltipValFormat: function(v) {
            return unitFlow(v, 2) + 'B'
          }
        }
        // itemRange: 7 // 超过该条目将会出现datazoom的控件
      }
    }
  }
  render() {
    const { dataSource } = this.props
    return <PieChart style={{height: '100%', width: '100%'}} dataSource={ dataSource } config={this.state.config}/>
  }
}

export default BusFlow
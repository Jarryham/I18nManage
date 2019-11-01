import React, { Component } from 'react'
import { unitFlow } from '../../lib'
import BarChart from '@/components/CommonCharts/BarChart'

class CustomerBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      config: {
        key: 'name',
        value: ['flow'],
        seriesName: ['流量'],
        // 可选项
        yAxis: {
          yLabelFormat: function(d) {
            return unitFlow(d, 1, 2) + 'B'
          },
          yName: '流量byte'
        },
        legend: {
          show: false
        },
        xAxis: {
          xLabelFormat: function(d) {
            return d
          },
          xName: ''
        },
        barWidth: 20,
        tooltip: {
          width: 200,
          tooltipValFormat: function(v) {
            return unitFlow(v, 2) + 'B'
          }
        },
        // itemRange: 7 // 超过该条目将会出现datazoom的控件
      }
    }
  }
  render() {
    const { dataSource } = this.props
    return <BarChart style={{height: '100%', width: '100%'}} dataSource={ dataSource } config={this.state.config}/>
  }
}

export default CustomerBar
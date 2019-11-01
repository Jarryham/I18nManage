import React, { Component } from 'react';
import { unitFlow } from '../../lib'
import LineChart from '@/components/CommonCharts/LineChart'
import moment from 'moment';

class LineFlow extends Component {
  constructor(props) {
    super(props)
    this.state = {
      config: {
        key: 'time',
        value: ['inbyte', 'outbyte'],
        seriesName: ['流入流量', '流出流量'],
        // 可选
        autoFix: { // 自动补全功能，默认自动以0补全，当首尾不补，首尾需要补全的话请传入start和end
          fix: true,
          fixVal: 0,
          beginAndEnd: {
            start: 0,
            end: 0,
            space: 3600
          }
        },
        xAxis: {
          xLabelFormat: function(d) { return moment(d * 1000).format('YYYY/MM/DD HH:mm') }
        },
        yAxis: {
          yLabelFormat: function(d) { return unitFlow(Math.abs(d), 0.9, 2) + 'B' }
        },
        stack: true,
        tooltip: {
          width: 200,
          tooltipValFormat: function(v) {
            return unitFlow(v, 2) + 'B'
          }
        },
        // itemRange: 7
      }
    }
  }
  render() {
    const { dataSource } = this.props
    // console.log('props', this.props.dataSource)
    return (
        <LineChart style={{height: '100%', width: '100%'}} dataSource={ dataSource } config={this.state.config}/>
    )
  }
}

export default LineFlow

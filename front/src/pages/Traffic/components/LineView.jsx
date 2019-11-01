import React, { Component } from 'react'
import ReactEcharts from "echarts-for-react";
import 'echarts/lib/chart/lines';

class LineView extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { dataSource } = this.props
        const option = this.getOpt(dataSource)
        return (
            <div style={{width: '100%', height: '100%'}}>
                <ReactEcharts 
                style={{height: '100%', width: '100%'}}
                option={option}
                lazyUpdate={true}
                notMerge={true}></ReactEcharts>
            </div>
        )
    }
    getOpt(data) {
        return {
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                axisLine: {
                    show: false,
                },
                axisLabel: {
                    show: true,
                    fontFamily: 'PingFang Medium'
                },
                axisTick: { show: false }
            },
            yAxis: {
                type: 'value',
                axisLabel: {
                    show: true,
                    fontFamily: 'PingFang Medium'
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                      color: '#e4e3e9',
                      type: 'dashed'
                    }
                  },
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                }
            },
            series: [{
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line',
                symbol: 'circle',
                symbolSize: 8,
                itemStyle: {
                    color: 'rgb(134,106,220)',
                    borderWidth: 2,
                    borderColor: '#FFF'
                },
                areaStyle: {
                    normal: {
                        color: 'rgba(134,106,220, .1)'
                    }
                },
                lineStyle: {
                    width: 3,
                    color: 'rgb(134,106,220)'
                },
                smooth: true
            }]
        }
    }
}

export default LineView
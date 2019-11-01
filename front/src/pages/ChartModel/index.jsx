import styles from './style.less'
// import LineChart from '@/components/CommonCharts/LineChart'
import LineFlow from './components/LineFlow'
import CustomerFlow from './components/CustomerFlow'
import BusFlow from './components/BusFlow'
import React, { Component } from 'react'
import { connect } from 'dva';

@connect(({ ChartModelFake, loading }) => ({
  ChartModelFake,
  // loading: loading.effects['ChartModelFake/fetch']
}))

class ChartModel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentChart: 'lineCom',
      AllChartsType: {
        lineCom: 'ChartModelFake/fetch',
        barCom: 'ChartModelFake/fetchBar',
        pieCom: 'ChartModelFake/fetchPie'
      }
    }
    this.handleItemClick = this.handleItemClick.bind(this)
  }
  render() {
    const { ChartModelFake } = this.props
    const {
      lineData,
      barData,
      pieData
    } = ChartModelFake
    let AllCharts = {
      lineCom: <LineFlow className={styles.chartmodel} dataSource={lineData}/>,
      barCom: <CustomerFlow  className={styles.chartmodel} dataSource={barData}/>,
      pieCom: <BusFlow className={styles.chartmodel} dataSource={pieData} />
    }
    return (
      <div className={styles.main}>
        <div className={styles.titleBoard}>
          <a onClick={() => {this.handleItemClick('lineCom')}}>Stack Chart</a>
          <i>|</i>
          <a onClick={() => {this.handleItemClick('barCom')}}>Bar</a>
          <i>|</i>
          <a onClick={() => {this.handleItemClick('pieCom')}}>Pie</a>
        </div>
        <div className={styles.chartmodel}>
           {AllCharts[this.state.currentChart]}
        </div>
      </div>
    )
  }
  handleItemClick(name) {
    const { dispatch } = this.props;
    this.setState(() => {
      return { currentChart: name }
    })
    requestAnimationFrame(() => {
      dispatch({
        type: this.state.AllChartsType[name]
      });
    });
  }
  componentDidMount() {
    const { dispatch } = this.props;
    const reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'ChartModelFake/fetch'
      });
    });
  }
}

export default ChartModel
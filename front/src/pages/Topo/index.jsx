import React, { Component } from 'react';
import styles from './style.less';
import { data } from './data';
import ReactDOM from 'react-dom';
import Graph from './components/Graph';

class Topo extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div style={{ width: '80%', height: '100%', float: 'left' }}>
          <div className={styles.nodeSelect}></div>
          <div className={styles.topMenu}></div>
          <div className={styles.topoCanvas}>
            <Graph />
          </div>
        </div>
        <div className={styles.rightMsg}></div>
      </div>
    );
  }
  componentDidMount() {}
}

export default Topo;

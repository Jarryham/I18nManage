import React, { Component } from 'react';
import styles from './style.less'
import LineView from './components/LineView'

class Traffic extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const dataSource = []
        for (var i =0; i < 24; i++ ) {
            var obj = {
                time: i * 3600 + 1570032000,
                inbyte: parseInt(Math.random() * 1000000000),
                outbyte: parseInt(Math.random() * 1500000000),
            }
            dataSource.push(obj)
            
        }
        return (
            <div style={ { width: '100%', height: '100%' } }>
                <div className={ styles.header }>
                    <span>Traffic Lines</span>
                    <div className={ styles.date }></div>
                </div>
                <div className={ styles.lines }>
                    <div className={styles.linesHeader}>Traffic Analysis</div>
                    <div className = {styles.linechart}>
                        <LineView dataSource={ dataSource }></LineView>
                    </div>
                </div>
                <div className={ styles.tabs }></div>
            </div>
        )
    }
}

export default Traffic
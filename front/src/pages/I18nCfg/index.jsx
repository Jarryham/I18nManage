import React, { Component } from 'react';
import styles from './style.less';
import { connect } from 'dva';
import { Descriptions, Input, Select, Icon } from 'antd';
const { Option } = Select;

import List from './components/List';

@connect(({ i18nContent, loading }) => ({
  i18nContent,
  loading: loading.effects['i18nContent/fetchList'],
}))
class I18nconfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectVal: '',
      searchKey: 'key',
    };
    this.handleChangeSelect = this.handleChangeSelect.bind(this);
    this.handelChangeKey = this.handelChangeKey.bind(this);
  }
  render() {
    const { i18nContent } = this.props;
    const { i18n, db } = i18nContent;

    const selectBefore = (
      <Select
        defaultValue={this.state.searchKey}
        style={{ width: 90 }}
        onChange={this.handelChangeKey}
      >
        <Option value="id">ID</Option>
        <Option value="key">Key</Option>
        <Option value="zh">中文</Option>
        <Option value="en">英文</Option>
        <Option value="oth">繁体</Option>
      </Select>
    );
    const that = this;
    const filtersList = i18n.filter(d => {
      const currentKey = that.state.searchKey;
      if (that.state.selectVal !== '') {
        let target = d[currentKey];
        if (currentKey === 'id') {
          target = target + '';
        }
        return target.indexOf(that.state.selectVal) !== -1;
      } else {
        return true;
      }
    });

    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div className={styles.top}>
          <Descriptions title="数据库信息">
            <Descriptions.Item label="数据库IP">{db.host}</Descriptions.Item>
            <Descriptions.Item label="端口号">{db.port}</Descriptions.Item>
            <Descriptions.Item label="库名">{db.database}</Descriptions.Item>
          </Descriptions>
        </div>
        <div className={styles.search}>
          <Input
            className={styles.searchInput}
            addonBefore={selectBefore}
            onChange={this.handleChangeSelect}
            defaultValue={this.state.selectVal}
            addonAfter={
              <Icon
                className={styles.searchBtn}
                type="search"
                onClick={() => {
                  this.handleSearchList();
                }}
              />
            }
          />
        </div>
        <div className={styles.contentTab}>
          <List dataSource={filtersList} />
        </div>
      </div>
    );
  }

  componentDidMount() {
    const { dispatch } = this.props;
    this.reqRef = requestAnimationFrame(() => {
      dispatch({
        type: 'i18nContent/fetchList',
      });
      dispatch({
        type: 'i18nContent/fetchDb',
      });
    });
  }
  handleChangeSelect(e) {
    this.setState({
      selectVal: e.target.value,
    });
  }
  handelChangeKey(value) {
    this.setState({
      searchKey: value,
    });
  }
  handleSearchList() {
    console.log(this.state.selectVal);
  }
}

export default I18nconfig;

import React, { Component, Fragment } from 'react';
import { Table, Divider, Modal, Form, Input } from 'antd';
import I18nItemForm from './I18nItemForm';
import { connect } from 'dva';

@connect(({ i18nContent, loading }) => ({
  i18nContent,
}))
class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      i18nItem: {},
    };
    this.handleEdit = this.handleEdit.bind(this);
    this.handleSummitContent = this.handleSummitContent.bind(this);
  }

  render() {
    const { dataSource } = this.props;
    const columns = [
      {
        title: 'id',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: 'key',
        dataIndex: 'key',
        key: 'key',
      },
      {
        title: '中文',
        dataIndex: 'zh',
        key: 'zh',
      },
      {
        title: '英文',
        dataIndex: 'en',
        key: 'en',
      },
      {
        title: '繁体',
        dataIndex: 'oth',
        key: 'oth',
      },
      {
        title: '操作',
        render: (text, record) => (
          <Fragment>
            <a onClick={() => this.handleEdit(record)}>修改</a>
            <Divider type="vertical" />
            <a href="">删除</a>
            <Divider type="vertical" />
            <a href="">修订记录</a>
          </Fragment>
        ),
      },
    ];
    return (
      <div>
        <Table columns={columns} dataSource={dataSource} />
        <I18nItemForm
          onRef={ref => {
            this.child = ref;
          }}
          dataList={dataSource}
          sumbimtItem={this.handleSummitContent}
        />
        {/* <Modal
          title="词汇内容"
          visible={this.state.visible}
          onOk={this.handleSummitContent.bind(this)}
          onCancel={this.handleCancelEdit.bind(this)}
        >
         
        </Modal> */}
      </div>
    );
  }
  handleEdit(record) {
    this.child.showModal(record);
  }
  handleSummitContent(params) {
    const { dispatch } = this.props;
    // this.reqSave = requestAnimationFrame(() => {
    //   dispatch({
    //     type: 'i18nContent/saveI18n',
    //     payload: {...params}
    //   });
    // });

    new Promise(resolve => {
      this.props.dispatch({
        type: 'i18nContent/saveI18n',
        payload: {
          resolve,
          data: { ...params },
        },
      });
    }).then(res => {
      this.child.setState({ visible: false });
    });
  }
  showModalEdit = () => {
    this.setState({
      visible: true,
    });
  };
  handleCancelEdit() {
    this.setState({
      visible: false,
    });
  }
}
export default List;

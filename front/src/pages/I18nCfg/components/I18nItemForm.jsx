import { Button, Modal, Form, Input, Radio } from 'antd';
// import _ from 'loadash';
import { connect } from 'dva';

const CollectionCreateForm = Form.create({ name: 'form_in_modal' })(
  // eslint-disable-next-line
  class extends React.Component {
    render() {
      const { visible, onCancel, onCreate, form, initForm } = this.props;
      const { getFieldDecorator } = form;
      const formItemLayout = {
        labelCol: {
          xs: { span: 4 },
          sm: { span: 4 },
        },
        wrapperCol: {
          xs: { span: 14 },
          sm: { span: 14 },
        },
      };
      return (
        <Modal
          visible={visible}
          title="Create a new collection"
          okText="Create"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form {...formItemLayout}>
            <Form.Item label="Key">
              {getFieldDecorator('key', {
                initialValue: initForm.key,
                rules: [
                  { required: true, message: 'key值不能为空' },
                  { validator: this.checkKey.bind(this) },
                ],
              })(<Input />)}
            </Form.Item>
            <Form.Item label="中文">
              {getFieldDecorator('zh', {
                initialValue: initForm.zh,
                rules: [{ required: true, message: '中文翻译字段不能为空' }],
              })(<Input type="textarea" />)}
            </Form.Item>
            <Form.Item label="英文">
              {getFieldDecorator('en', {
                initialValue: initForm.en,
                rules: [{ required: true, message: '英文翻译字段不能为空' }],
              })(<Input type="textarea" />)}
            </Form.Item>
            <Form.Item label="繁体">
              {getFieldDecorator('oth', {
                initialValue: initForm.oth,
                rules: [{ required: true, message: '繁体翻译字段不能为空' }],
              })(<Input type="textarea" />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
    checkKey(rule, value, callback) {
      const { dataList, target } = this.props;
      // 重复值校验 key与其他值重复 并且不是id不一致
      var repeatFlag = dataList.some(function(item) {
        return item.key == value && item.id != target;
      });
      if (repeatFlag) {
        callback('该键值已被其他词汇占用，请输入其他可用键值');
        return;
      }
      callback();
    }
  },
);

class I18nItemForm extends React.Component {
  state = {
    visible: false,
    currentId: 0,
    initForm: {
      id: 1,
      en: 'english',
      zh: '中文',
      oth: '繁体',
    },
  };

  showModal = record => {
    // console.log(record)
    this.setState({ visible: true, initForm: record, currentId: record.id });
  };

  handleCancel = () => {
    const { form } = this.formRef.props;
    this.setState({ visible: false });
    form.resetFields();
  };

  handleCreate = () => {
    const { form } = this.formRef.props;
    const { sumbimtItem } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      sumbimtItem({ ...values, id: this.state.currentId });
      form.resetFields();
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  componentDidMount() {
    this.props.onRef(this); // ->将child传递给this.props.onRef()方法
  }
  render() {
    const { dataList } = this.props;
    return (
      <div>
        <CollectionCreateForm
          target={this.state.currentId}
          dataList={dataList}
          initForm={this.state.initForm}
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  }
}

export default I18nItemForm;

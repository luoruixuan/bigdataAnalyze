import { Checkbox } from 'antd';
const CheckboxGroup = Checkbox.Group;
import React from 'react';

class CheckBook extends React.Component {
  constructor(props) {
    super(props);
    this.options = props.options;
    this.setval = props.setval;
    this.state = {
      checkedList: props.options,
      indeterminate: false,
      checkAll: true,
    };
    this.onChange = this.onChange.bind(this);
    this.onCheckAllChange = this.onCheckAllChange.bind(this);
  }
  render() {
    return (
      <div>
        <Checkbox
          indeterminate={this.state.indeterminate}
          onChange={this.onCheckAllChange}
          checked={this.state.checkAll}
        >
          全选
        </Checkbox>
        <CheckboxGroup
          options={this.options}
          value={this.state.checkedList}
          onChange={this.onChange}
        />
      </div>
    );
  }
  onChange(checkedList) {
    this.setval(checkedList);
    this.setState({
      checkedList: checkedList,
      indeterminate:
        !!checkedList.length && checkedList.length < this.options.length,
      checkAll: checkedList.length === this.options.length,
    });
  }
  onCheckAllChange(e) {
    var checkedList = e.target.checked ? this.options : [];
    this.setval(checkedList);
    this.setState({
      checkedList: checkedList,
      indeterminate: false,
      checkAll: e.target.checked,
    });
  }
}

export default CheckBook;

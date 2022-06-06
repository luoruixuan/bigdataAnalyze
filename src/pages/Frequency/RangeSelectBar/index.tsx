import { PageContainer } from '@ant-design/pro-layout';
import {
  Alert,
  Button,
  Card,
  Image,
  Row,
  Select,
  Space,
  Steps,
  Tooltip,
  TreeSelect,
} from 'antd';
import { useState } from 'react';
import { Divider } from 'antd';
import BookReuse from './Components/Book';
import PhraseReuse from './Components/Phrase';
import ChapterReuse from './Components/Chapter';
import SentenceReuse from './Components/Sentence';
import React from 'react';
import $ from 'jquery';
import '../../lang';

const { Step } = Steps;

function RangeSelect(props) {
  const [searchType, setSearchType] = useState<String>('dynasty');

  const typeList = props.local.range;

  const { SHOW_PARENT } = TreeSelect;
  const { Option } = Select;

  function rangeSelectChange(value: string) {
    setSearchType(value.slice());
  }

  function treeSelectChange(value: any) {
    props.setMethod(value);
  }

  if (props.local.fixdyn) {
    return (
      <TreeSelect
        treeData={typeList['dynasty']}
        showSearch={true}
        treeCheckable={true}
        showCheckedStrategy={SHOW_PARENT}
        placeholder={'请选择要检索的书目集合'}
        onChange={treeSelectChange}
        style={{ width: '100%' }}
        dropdownMatchSelectWidth={false}
      ></TreeSelect>
    );
  }

  return (
    <Space>
      <Select
        defaultValue="dynasty"
        style={{ width: '16%' }}
        onChange={rangeSelectChange}
      >
        <Option value="dynasty">按时代</Option>
        <Option value="category">按类别</Option>
      </Select>
      <TreeSelect
        treeData={typeList[searchType]}
        showSearch={true}
        treeCheckable={true}
        showCheckedStrategy={SHOW_PARENT}
        placeholder={'请选择要检索的书目集合'}
        onChange={treeSelectChange}
        style={{ width: '84%' }}
        dropdownMatchSelectWidth={false}
      ></TreeSelect>
    </Space>
  );
}

function todata(x) {
  var ret = {};
  ret.title = x.name[global.langid];
  ret.value = ret.key = x.value;
  ret.children = [];
  for (var i = 0; i < x.children.length; i++) {
    //if (x.children[i].value.startsWith('@@@')) continue;
    ret.children.push(todata(x.children[i]));
  }
  return ret;
}

class RangeSelectBar extends React.Component {
  constructor(props) {
    super(props);
    const requesturl = 'http://162.105.86.52:12347/reuse/getrange';
    var resp;
    $.ajax({
      type: 'GET',
      url: requesturl,
      async: false,
      success: function (response) {
        resp = JSON.parse(response);
      },
      error: function (error) {
        console.log(error);
      },
    });
    console.log(resp);
    var rangemp = {};
    for (var i in resp) {
      var lst = [];
      for (var j = 0; j < resp[i].length; j++) lst.push(todata(resp[i][j]));
      rangemp[i] = lst;
    }
    this.local = {
      range: rangemp,
      setMethod: props.setMethod,
      fixdyn: props.fixdyn,
    };
  }

  render() {
    console.log(this.local);
    return (
      <RangeSelect
        local={this.local}
        setMethod={this.local.setMethod}
      ></RangeSelect>
    );
  }
}

export default RangeSelectBar;

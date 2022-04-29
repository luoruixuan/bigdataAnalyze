import { Table } from 'antd';
import React from 'react';
import $ from 'jquery';

function totxt(lst) {
  var res = [];
  for (var i = 0; i < lst.length; i++) {
    var txt = lst[i][0];
    var isreuse = lst[i][1];
    if (isreuse) {
      res.push(<span style={{ backgroundColor: '#F5A9A9' }}>{txt}</span>);
    } else {
      res.push(txt);
    }
  }
  return res;
}

class ReuseList extends React.Component {
  constructor(props) {
    super(props);
    this.local = props.local;
    this.setArc = this.setArc.bind(this);
    props.getSetMethod(this.setArc);
    this.state = {
      data: [],
    };
  }
  setArc(Aname, Apagename, Bname) {
    var names = this.local.result.name;
    var mp = {};
    for (var i = 0; i < names.length; i++) {
      mp[names[i][0]] = names[i][1];
    }
    var reuse = this.local.result.page.reuse[Aname][Apagename][Bname];
    const requesturl = 'http://162.105.86.52:12347/reuse/getreusetext';
    var resp;
    $.ajax({
      type: 'GET',
      url: requesturl,
      data: { q: JSON.stringify(reuse) },
      async: false,
      success: function (response) {
        resp = JSON.parse(response);
      },
      error: function (error) {
        console.log(error);
      },
    });
    var data = [];
    for (var i = 0; i < reuse.length; i++) {
      var Aname = mp[reuse[i][0].slice(0, 2)];
      var Bname = mp[reuse[i][1].slice(0, 2)];
      var Atext = totxt(resp[i][0]);
      var Btext = totxt(resp[i][1]);
      data.push({
        idx: i + 1,
        Asent: Atext,
        Asrc: Aname,
        Bsent: Btext,
        Bsrc: Bname,
      });
    }
    this.setState({ data: data });
  }
  render() {
    const columns = [
      {
        title: '编号',
        dataIndex: 'idx',
        key: 'idx',
        width: '6%',
      },
      {
        title: '复用句一',
        dataIndex: 'Asent',
        key: 'Asent',
        width: '32%',
      },
      {
        title: '来源',
        dataIndex: 'Asrc',
        key: 'Asrc',
        width: '15%',
      },
      {
        title: '复用句二',
        dataIndex: 'Bsent',
        key: 'Bsent',
        width: '32%',
      },
      {
        title: '来源',
        dataIndex: 'Bsrc',
        key: 'Bsrc',
        width: '15%',
      },
    ];
    return (
      <Table columns={columns} dataSource={this.state.data} size="small" />
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

export default ReuseList;

import { DownloadOutlined } from '@ant-design/icons';
import { Alert, Image } from 'antd';
import { arcDiagram } from './draw';
import React from 'react';
import * as d3 from 'd3';
import './style.css';
import CheckBook from './CheckBook';
import ReuseList from './ReuseList';

class BookReuse extends React.Component {
  componentDidMount() {
    var x = d3.select('#arcgraph');
    var local = this.props.local;
    var nodes = [];
    var links = [];
    var mp = {};
    for (var i = 0; i < local.result.book.graph.nodes.length; i++) {
      var nd = local.result.book.graph.nodes[i];
      var cp = { name: nd.name, group: nd.group };
      if (nd.group == 1 && this.Aselect.includes(nd.name)) {
        nodes.push(cp);
        mp[[nd.group, nd.name]] = nodes.length - 1;
      }
      if (nd.group == 2 && this.Bselect.includes(nd.name)) {
        nodes.push(cp);
        mp[[nd.group, nd.name]] = nodes.length - 1;
      }
    }
    for (var i = 0; i < local.result.book.graph.links.length; i++) {
      var lk = local.result.book.graph.links[i];
      var Anode = local.result.book.graph.nodes[lk.source];
      var Bnode = local.result.book.graph.nodes[lk.target];
      if (
        this.Aselect.includes(Anode.name) &&
        this.Bselect.includes(Bnode.name)
      ) {
        var newlk = {
          source: mp[[Anode.group, Anode.name]],
          target: mp[[Bnode.group, Bnode.name]],
          value: lk.value,
        };
        links.push(newlk);
      }
    }
    var graph = { nodes: nodes, links: links };
    arcDiagram('arcgraph', graph, this.setReuseList);
  }
  constructor(props) {
    super(props);
    var Adeg = {};
    var Bdeg = {};
    var reuse = props.local.result.book.reuse;
    for (var i in reuse) {
      Adeg[i] = 0;
      for (var j in reuse[i]) {
        if (!(j in Bdeg)) Bdeg[j] = 0;
        Bdeg[j] += reuse[i][j].length;
        Adeg[i] += reuse[i][j].length;
      }
    }
    var tmp = [];
    for (var i in Adeg) tmp.push([-Adeg[i], i]);
    tmp = tmp.sort();
    this.Abooks = [];
    for (var i = 0; i < tmp.length; i++) this.Abooks.push(tmp[i][1]);
    tmp = [];
    for (var i in Bdeg) tmp.push([-Bdeg[i], i]);
    tmp = tmp.sort();
    this.Bbooks = [];
    for (var i = 0; i < tmp.length; i++) this.Bbooks.push(tmp[i][1]);
    this.Aselect = this.Abooks;
    this.Bselect = this.Bbooks;
  }

  render() {
    var props = this.props;
    var local = props.local;
    console.log(local);
    return (
      <>
        <div style={{ borderBottom: '1px solid #000000' }}>
          复用分析书目选择 <br />
          <CheckBook
            options={this.Abooks}
            setval={(v) => {
              this.Aselect = v;
              this.componentDidMount();
            }}
          />
        </div>
        <div>
          复用检索书目选择 <br />
          <CheckBook
            options={this.Bbooks}
            setval={(v) => {
              this.Bselect = v;
              this.componentDidMount();
            }}
          />
        </div>
        <Alert
          message={
            <div> 两个文本集合的复用总频次为{local.result.book.total}次 </div>
          }
          description={
            <div>
              {' '}
              书目集合A：{local.result.Aset.join('；')} <br /> 书目集合B：
              {local.result.Bset.join('；')}
              <br />{' '}
            </div>
          }
          type="success"
          showIcon
        />
        <div style={{ float: 'right' }}>
          <DownloadOutlined />
        </div>

        <div id="arcgraph" width="100%"></div>

        <div id="arcresult" width="100%">
          <ReuseList
            getSetMethod={(f) => {
              this.setReuseList = f;
            }}
            local={local}
          />
        </div>
      </>
    );
  }
}

export default BookReuse;

import { Alert, Button, Card, Cascader, Form, Table, Tag } from 'antd';
import { Sparklines, SparklinesLine } from 'react-sparklines';
import { useState } from 'react';
import { Pie } from '@ant-design/charts';
import Modal from 'antd/lib/modal/Modal';
import React from 'react';
import $ from 'jquery';

function PieChart() {
  const salesPieData = [
    {
      type: '學而時習之',
      value: 10,
    },
    {
      type: '不亦說乎',
      value: 5,
    },
    {
      type: '有朋自遠方來',
      value: 12,
    },
    {
      type: '人不知而不慍',
      value: 8,
    },
    {
      type: '不亦君子乎',
      value: 2,
    },
  ];

  const pieConfig = {
    appendPadding: 10,
    data: salesPieData,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'pie-legend-active',
      },
      {
        type: 'element-active',
      },
    ],
  };

  return <Pie {...pieConfig} />;
}

class SentenceReuse extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    var dft = '';
    for (var Aname in props.local.result.page.reuse) {
      dft = Aname;
      break;
    }
    this.state = {
      selectedBook: dft,
      isModalVisible: false,
    };
  }

  onChange(value) {
    var selectedBook;
    if (typeof value == 'undefined') selectedBook = '';
    else selectedBook = value.join(' / ');
    this.setState({
      selectedBook: selectedBook,
    });
  }

  render() {
    var options = [];
    var local = this.props.local;
    var result = local.result;
    var treemap = local.result.page.treemap;
    var reuse = local.result.page.reuse;
    for (var Aname in treemap) {
      var mp = {
        value: Aname,
        label: Aname,
        children: [],
      };
      for (var i = 0; i < treemap[Aname].length; i++) {
        var Apagename = treemap[Aname][i].name;
        mp.children.push({
          value: Apagename,
          label: Apagename,
        });
      }
      options.push(mp);
    }

    var data = [];
    var total = 0;

    if (this.state.selectedBook != '') {
      var selected = this.state.selectedBook.split(' / ');
      var pages;
      var Aname = selected[0];
      if (selected.length == 2) pages = [selected[1]];
      else {
        pages = [];
        for (var i = 0; i < treemap[Aname].length; i++) {
          pages.push(treemap[Aname][i].name);
        }
      }
      var resultmap = {};
      for (var i = 0; i < pages.length; i++) {
        var Apagename = pages[i];
        for (var Bname in reuse[Aname][Apagename]) {
          var lst = reuse[Aname][Apagename][Bname];
          for (var j = 0; j < lst.length; j++) {
            var Aid = lst[j][0].join('_');
            if (!(Aid in resultmap))
              resultmap[Aid] = {
                total: 0,
                spark: new Array(result.totaltime).fill(0),
                relatedBooks: {},
              };
            if (reuse[Aname][Apagename][Bname].length > 0) {
              resultmap[Aid].total += 1;
              resultmap[Aid].spark[result.period[Bname]] += 1;
              resultmap[Aid].relatedBooks[Bname] = 0;
            }
          }
        }
      }
      var queryid = [];
      for (var Aid in resultmap) {
        var dataitem = {};
        dataitem.key = data.length + 1;
        queryid.push(Aid);
        dataitem.id = Aid;
        dataitem.frequency = resultmap[Aid].total;
        total += resultmap[Aid].total;
        dataitem.spark = resultmap[Aid].spark;
        dataitem.tags = [];
        for (var Bname in resultmap[Aid].relatedBooks)
          dataitem.tags.push(Bname);
        data.push(dataitem);
      }
      const requesturl = 'http://162.105.86.52:12347/browse/gettext';
      $.ajax({
        type: 'GET',
        url: requesturl,
        async: false,
        data: { id: JSON.stringify(queryid) },
        success: function (response) {
          var resp = JSON.parse(response);
          for (var i = 0; i < resp.length; i++) data[i].sentence = resp[i];
        },
        error: function (error) {
          console.log(error);
        },
      });
    }
    console.log(data);

    const columns = [
      {
        title: '句子',
        dataIndex: 'sentence',
        key: 'sentence',
        width: '70%',
        render: (_: any, records: any) => (
          <a href={`/sentence/${records.id}`}>{records.sentence}</a>
        ),
      },
      {
        title: '复用频次',
        dataIndex: 'frequency',
        key: 'frequency',
        width: '10%',
        render: (_: any, records: any) => (
          <>
            {records.frequency}
            <Sparklines data={records.spark}>
              <SparklinesLine color="blue" />
            </Sparklines>
          </>
        ),
      },
      {
        title: '复用书目',
        key: 'tags',
        dataIndex: 'tags',
        width: '15%',
        render: (tags: any[]) => (
          <>
            {tags.map((tag) => {
              return (
                <Tag key={tag}>
                  <a href={`/book/${tag}`}>{tag}</a>
                </Tag>
              );
            })}
          </>
        ),
      },
      {
        // title: '详细',
        dataIndex: 'option',
        valueType: 'option',
        render: (_: any, record: any) => [
          <a
            key="config"
            onClick={() => {
              this.setState({
                isModalVisible: true,
              });
            }}
          >
            ＋
          </a>,
        ],
      },
    ];

    const handleCancel = () => {
      this.setState({
        isModalVisible: false,
      });
    };

    return (
      <>
        <Form>
          <Form.Item label="分析书目">
            <Cascader
              defaultValue={[this.state.selectedBook.split(' / ')]}
              options={options}
              onChange={this.onChange}
              changeOnSelect
            />
          </Form.Item>
        </Form>
        <div style={{ paddingTop: 10, paddingBottom: 10 }}>
          <Alert
            message={
              '《' +
              this.state.selectedBook +
              '》在所选择的书目中共被复用' +
              total.toString() +
              '次'
            }
            type="success"
            showIcon
          />
        </div>
        <Table columns={columns} dataSource={data} />
        <Modal
          title="..."
          visible={this.state.isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <PieChart></PieChart>
        </Modal>
      </>
    );
  }
}

export default SentenceReuse;

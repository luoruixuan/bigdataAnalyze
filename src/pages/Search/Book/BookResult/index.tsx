import { BookOutlined, FilterOutlined } from '@ant-design/icons';
import '../../searchresult';
import {
  Card,
  Cascader,
  Col,
  Pagination,
  Row,
  Select,
  Space,
  Table,
  TreeSelect,
  Typography,
} from 'antd';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import React from 'react';

function CategorySelect(obj) {
  const categoryData = obj.children.getFilter(global.catalogues);
  return (
	<Cascader
	  style={{ width: 100 }}
	  options={categoryData}
	  onChange={(value) => {obj.children.setState({
		  catFilter: value,
		  needUpdate: true,
	  });}}
	  multiple
	  size="small"
	  maxTagCount="responsive"
	/>
  );
}

function DynastySelect(obj) {
  const dynastyData = obj.children.getFilter(global.periods);

  return (
	<>
	  <Cascader
		style={{ width: 100 }}
		options={dynastyData}
	    onChange={(value) => {obj.children.setState({
		    dynFilter: value,
		    needUpdate: true,
	    });}}
		multiple
		size="small"
		maxTagCount="responsive"
	  />
	</>
  );
}

function warpTag(content: string, keyword: string, tagName: string) {
  if (content === '') {
    return content;
  }
  const a = content.toLowerCase();
  const b = keyword.toLowerCase();

  const indexof = a.indexOf(b);
  const c = indexof > -1 ? content.substr(indexof, keyword.length) : '';
  const val = `<${tagName} style="color:red">${c}</${tagName}>`;
  const regS = new RegExp(keyword, 'gi');
  const node = new DOMParser().parseFromString(
    content.replace(regS, val),
    'text/html',
  ).body.childNodes;
  console.log(node);
  return content.replace(regS, val);
}

function MyCard(props: {
  title: string;
  author: string;
  dynasty: string;
  category: string;
}) {
  const handleOnclick = () => {
    window.location.href = '/book/论语';
  };

  return (
    <Col span={4}>
      <Card
        hoverable
        style={{ marginTop: '10px' }}
        // bordered={false}
        bodyStyle={{ padding: '6px 6px 6px 6px' }}
        onClick={handleOnclick}
      >
        <Typography.Text strong>
          <BookOutlined />
          {props.title}
        </Typography.Text>
        <br />
        {/* <div
          dangerouslySetInnerHTML={{
            __html: warpTag(props.author, "朱", 'span'),
          }}
        ></div> */}
        <span style={{ fontSize: '10px' }}>
          作者：{props.author}
          <br />
          时代：{props.dynasty}
          <br />
          类目：{props.category}
          <br />
        </span>
      </Card>
    </Col>
  );
}

class BookResult extends React.Component {
	constructor(props) {
		super(props);
	  var cardList = this.getdata();
		this.state = {
			total:cardList.length,
			pageSize:10,
			current:1,
			showdata:cardList.slice(0,10),
			catFilter: [],
			dynFilter: [],
			updateTimestamp:global.timestamp,
			needUpdate: false,
			};
		this.flushBookResult = this.flushBookResult.bind(this);
	}
    
	getFilter(arr) {
		var ret = [];
		for (var i=0;i<arr.length;i++) {
			var tmp = arr[i];
			var have = false;
			var entity = {
				label: tmp.name[global.langid],
				value: tmp.name[global.langid],
			};
			if ('children' in tmp) {
				entity.children = [];
				for (var j=0;j<tmp.children.length;j++) {
						entity.children.push({
							label: tmp.children[j].name[global.langid],
							value: '@'+tmp.children[j].name[global.langid],
						});
				}
			}
			ret.push(entity);
		}
		return ret;
	}

	getdata() {
	  var cardList = [];
	  var books = {};
	  console.log(global.SearchResult.book);
	  var validcat = {};
	  var filter = this.getFilter(global.catalogues);
	  var cat = [];
	  if (typeof(this.state)!='undefined') cat = this.state.catFilter;
	  for (var val of cat) {
		  if (val.length==2) validcat[val[1].replace('@','')] = 0;
		  else {
			  var cls = val[0];
			  for (var node of filter) {
				  if (node.label==cls) {
					  if (node.children.length==0) validcat[cls] = 0;
					  else for (var leaf of node.children) {
						  validcat[leaf.label] = 0;
					  }
				  }
			  }
		  }
	  }
	  
	  var validdyn = {};
	  var filter = this.getFilter(global.periods);
	  var dyn = [];
	  if (typeof(this.state)!='undefined') dyn = this.state.dynFilter;
	  for (var val of dyn) {
		  if (val.length==2) validdyn[val[1].replace('@','')] = 0;
		  else {
			  var cls = val[0];
			  for (var node of filter) {
				  if (node.label==cls) {
					  if (node.children.length==0) validdyn[cls] = 0;
					  else for (var leaf of node.children) {
						  validdyn[leaf.label] = 0;
					  }
				  }
			  }
		  }
	  }

	  var checkcat = Object.keys(validcat).length>0;
	  var checkdyn = Object.keys(validdyn).length>0;

	  for (var val of global.SearchResult.book) {
		var bn = val['book_name'][global.langid];
		var cat = val['category'][global.langid];
		var dyn = val['start_time'][global.langid];
		if (checkcat && !(cat in validcat)) continue
		if (checkdyn && !(dyn in validdyn)) continue
		if (bn in books) continue;
		books[bn] = 0;
		cardList.push(
		  <MyCard
			title={val['book_name'][global.langid]}
			author={val['author']['name'][global.langid]}
			dynasty={val['start_time'][global.langid]}
			category={val['category'][global.langid]}
		  ></MyCard>,
		);
	  }

	  return cardList;
	}

 flushBookResult(page=1, pageSize=10) {
	 var cardList = this.getdata();

  var s = (page-1)*pageSize;
  var e = Math.min(s+pageSize, cardList.length);
  var showcard = cardList.slice(s,e);
  this.setState({
      updateTimestamp:global.timestamp,
	  total:cardList.length,
	  current:page,
	  pageSize:pageSize,
	  showdata:showcard,
	  needUpdate:false,
	  });
  /*
  var br = document.getElementById('book_result');
  var html = "";
  for (var c=0;c<showcard.length;c++) {
      var tmp = ReactDOMServer.renderToString(showcard[c]);
	  html = html + tmp;
  }
  br.innerHTML = html;
  */
}

    render() {
		if ((global.timestamp != this.state.updateTimestamp) || this.state.needUpdate) {
			this.flushBookResult(1, this.state.pageSize);
		}

  return (
    <>
      <Row justify="end" align="middle" style={{ marginBottom: '10px' }}>
        <Space>
          <FilterOutlined />
          按类目
          <CategorySelect>{this}</CategorySelect>
          按时代
          <DynastySelect>{this}</DynastySelect>
        </Space>
      </Row>
      <Row gutter={16} id="book_result">{this.state.showdata}</Row>
      <Row justify="end" style={{ marginTop: '10px' }}>
        <Pagination
          defaultCurrent={this.state.current}
          current={this.state.current}
          total={this.state.total}
		  pageSize={this.state.pageSize}
		  onChange={this.flushBookResult}
          showTotal={(total: number) => {
            return `共 ${total} 条结果`;
          }}
        />
      </Row>
    </>
  );
}
}
export default BookResult;

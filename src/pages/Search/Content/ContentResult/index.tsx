import { SearchOutlined } from '@ant-design/icons';
import { Input, Table, Tooltip } from 'antd';
import '../../searchresult';
import React from 'react';

// 重写方法，中心词左右的左右字符数一致，保证中心词居中
function warpTag(content: string, highlight: any, tagName: string) {
  if (content === '') {
    return content;
  }
  console.log(content);
  console.log(highlight);
  var real_highlight = highlight.concat();
  for (var i=0;i<content.length;i++) {
	  if (content.codePointAt(i)>0xffff) {
		  for (var j=0;j<real_highlight.length;j++) {
			  if (highlight[j][0]>i) real_highlight[j][0] += 1;
			  if (highlight[j][1]>i) real_highlight[j][1] += 1;
		  }
	  }
  }
  highlight = real_highlight;

  var lst = [];
  if (highlight.length==0) {
	var highlight_l = Math.floor(content.length/2);
	var highlight_r = highlight_l;
  }
  else {
	var highlight_l = highlight[0][0];
	var highlight_r = Math.min(highlight[highlight.length-1][1], highlight_l+global.showlength);
  }
  var highlight_length = highlight_r-highlight_l;
  var mv_left = Math.floor((global.showlength-highlight_length)/2);
  var mv_right = global.showlength-highlight_length-mv_left;
  var trunc_l = highlight_l-mv_left;
  var trunc_r = highlight_r+mv_right;
  var str_left = Math.max(trunc_l, 0);
  var str_right = Math.min(trunc_r, content.length);
  var trunced_str = content.substr(str_left, str_right-str_left);
  var now = 0;
  for (var i=0;i<highlight.length;++i) {
	  var rg = highlight[i];
	  var l=rg[0]-str_left, r=Math.min(rg[1]-str_left, trunced_str.length);
	  if (l>=trunced_str.length) break;
	  var c=trunced_str.substr(l,r-l);
      lst.push(trunced_str.substr(now, l-now));
	  lst.push(`<${tagName} style="color:red">${c}</${tagName}>`);
	  now = r;
  }
  if (now<trunced_str.length) lst.push(trunced_str.substr(now, trunced_str.length));
  var ret = lst.join('');
  if (trunc_l<=0) ret = '&#8197'.repeat(-trunc_l*4+5)+ret;
  else ret = '······'+ret;
  if (str_right<content.length) ret = ret + '······';
  return ret;
}


class ContentResult extends React.Component {
	constructor(props) {
		super(props);
		var data = this.getdata();
		this.state = {
			updateTimestamp:global.timestamp,
			data:data,
			searchBook:'',
			searchText:'',
		};
	}
    getFilter(dataidx, arr) {
		var data = this.state.data;
		var mp = {}
		for (var i=0;i<data.length;i++) {
			var name = data[i][dataidx];
			if (!(name in mp)) mp[name] = 0;
		}
		var ret = [];
		for (var i=0;i<arr.length;i++) {
			var tmp = arr[i];
			var have = false;
			var entity = {
				text: tmp.name[global.langid],
				value: tmp.name[global.langid],
			};
			if (entity.value in mp) have=true;
			if ('children' in tmp) {
				entity.children = [];
				for (var j=0;j<tmp.children.length;j++) {
					if (tmp.children[j].name[global.langid] in mp) {
						have=true;
						entity.children.push({
							text: tmp.children[j].name[global.langid],
							value: '@'+tmp.children[j].name[global.langid],
						});
					}
				}
			}
			if (have) ret.push(entity);
		}
		return ret;
	}
	getdata() {
		var data = [];
		for (var i=0;i<global.SearchResult.content.length;i++) {
			var s = global.SearchResult.content[i];
			data.push({
				title:s['book_name'][global.langid],
				chapter:s['page_name'][global.langid],
				author:s['author']['name'][global.langid],
				dynasty:s['start_time'][global.langid],
				dynasty_id:s['time'][0],
				category:s['category'][global.langid],
				category_id:s['cat_id'],
				text:s['text'],
				highlight:s['highlight'],
			});
		}
		return data;
	}
	
	flushContentResult(page=1, pageSize=10) {
		var data = this.getdata();
		this.setState({
			updateTimestamp:global.timestamp,
			data:data,
		});
	}

	render() {
			const columns = [
			  {
				title: '書名',
				dataIndex: 'title',
				key: 'title',
				width: '14%',
				render: (text: string, record: any) => {
				  const info = `${text}-${record.chapter}`;
				  return (
					<Tooltip placement="topLeft" title={info}>
					  <a href={`/book/${text}`}>{info}</a>
					</Tooltip>
				  );
				},
				sorter: (a: any, b: any) => (a.title+'-'+a.chapter).localeCompare(b.title+'-'+b.chapter),
				onFilter: (value: string, record: any) => record.title.indexOf(value) >= 0,
				filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
				  <div style={{ padding: 16, maxWidth: '100%' }}>
					<Input.Search
					  ref={node => {
						  this.searchInput = node;
					  }}
					  placeholder=""
					  value={selectedKeys[0]}
					  enterButton="Search"
					  size="small"
					  onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					  onSearch={(s) => {confirm(); this.setState({searchBook:s,});}}
					/>
				  </div>
				),
				onFilterDropdownVisibleChange: visible => {
					if (visible) {
						setTimeout(() => this.searchInput.select(), 100);
						}
				},
				filterIcon: (filtered: any) => (
				  <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
				),
				ellipsis: {
				  showTitle: false,
				},
			  },
			  {
				title: '作者',
				dataIndex: 'author',
				key: 'author',
				width: '11%',
				filters: this.getFilter('author', global.authors),
				filterMode: 'tree',
				onFilter: (value: string, record: any) =>
				  record.author == value.replace('@',''),
				sorter: (a: any, b: any) => a.author.localeCompare(b.author),
			  },
			  {
				title: '時代',
				dataIndex: 'dynasty',
				key: 'dynasty',
				width: '12%',
				filters: this.getFilter('dynasty', global.periods),
				filterMode: 'tree',
				onFilter: (value: string, record: any) =>
				  record.dynasty == value.replace('@',''),
				sorter: (a: any, b: any) => a.dynasty_id - b.dynasty_id,
			  },
			  {
				title: '类目',
				dataIndex: 'category',
				key: 'category',
				width: '12%',
				filters: this.getFilter('category', global.catalogues),
				filterMode: 'tree',
				// filterSearch: true,
				sorter: (a: any, b: any) => (a.category_id<10?a.category_id*10:a.category_id) - (b.category_id<10?b.category_id*10:b.category_id),
				onFilter: (value: string, record: any) =>
				  record.category == value.replace('@',''),
				ellipsis: {
				  showTitle: false,
				},
				render: (category: string) => (
				  <Tooltip placement="topLeft" title={category}>
					{category}
				  </Tooltip>
				),
			  },
			  {
				title: '文本',
				dataIndex: 'text',
				key: 'text',
				width: '38%',
				render: (text: string, record: any) => (
				  <div
					dangerouslySetInnerHTML={{
					  __html: warpTag(text, record.highlight, 'span'),
					}}
				  ></div>
				),
				sorter: (a: any, b: any) => a.text.localeCompare(b.text),
				onFilter: (value: string, record: any) => record.text.indexOf(value) >= 0,
				filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters}) => (
				  <div style={{ padding: 16, maxWidth: '100%' }}>
					<Input.Search
					  ref={node => {
						  this.searchInput = node;
					  }}
					  placeholder=""
					  value={selectedKeys[0]}
					  enterButton="Search"
					  size="small"
					  onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
					  onSearch={(s) => {confirm(); this.setState({searchText:s,});}}
					/>
				  </div>
				),
				onFilterDropdownVisibleChange: visible => {
					if (visible) {
						setTimeout(() => this.searchInput.select(), 100);
						}
				},
				filterIcon: (filtered: any) => (
				  <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
				),
				showSorterTooltip: <Tooltip title="按上文排序">111</Tooltip>,
			  },
			  {
				title: '',
				key: 'action',
				width: '8%',
				render: (text: string, record: any) => <a>详情</a>,
			  },
			];
		if (global.timestamp != this.state.updateTimestamp) {
			this.flushContentResult();
		}
		return <Table columns={columns} dataSource={this.state.data} size="small" />;
  }
}

export default ContentResult;

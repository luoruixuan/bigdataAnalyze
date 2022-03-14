import { PageContainer } from '@ant-design/pro-layout';
import { Alert, Card, Tabs, Typography, Table, Button } from 'antd';
const { Title } = Typography;
import '../../lang';
import React from 'react';
import $ from 'jquery';

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
  return content.replace(regS, val);
}

function NestedTable(props: any) {
	var reuse = props.reuse;
  console.log(props.keyword);

  const columns = [
    {
      title: '序号',
      width: '10%',
      render: (text: any, record: any, index: number) => `${index + 1}`,
    },
    {
      title: '复用文本',
      dataIndex: 'text',
      key: 'text',
      width: '70%',
      render: (text: any, records: any) => (
        <div
          dangerouslySetInnerHTML={{
            __html: text,
          }}
        ></div>
      ),
    },
    {
      title: '所属篇目',
      dataIndex: 'book',
      key: 'book',
      width: '20%',
      render: (_: any, records: any) => (
        <a href={`/book/${records.book}?page=${records.chapterid}`}>
          {records.book}-{records.chapter}
        </a>
      ),
    },
  ];

  var data = [];
  for (var i=0;i<reuse.length;i++) {
	  var tgt = reuse[i];
	  var tgtsub = tgt.target_id[4];
	  var tmp = [];
	  for (var j=0;j<tgt.subsents.length;j++) {
		  if (j==tgtsub) tmp.push(`<span style="color:red">${tgt.subsents[j]}</span>`);
		  else tmp.push(tgt.subsents[j]);
	  }
	  data.push({
		  text: tmp.join(''),
		  book:tgt.book_name[global.langid],
		  chapter:tgt.page_name[global.langid],
		  chapterid:tgt.target_id[1],
	  });
  }

  return <Table columns={columns} dataSource={data} pagination={false} />;
}

class sentenceBrowse extends React.Component {
	constructor(props) {
		super(props);
		var requesturl = "http://162.105.86.52:12347/browse/sentence";
		var data = {
			'sentid': props.match.params.sentenceID,
		};
		var reuse;
		console.log(data);
		$.ajax({
			type: 'GET',
			url: requesturl, 
			data: data, 
			async: false,
			success: function(response) {
				reuse = JSON.parse(response);
				console.log(response);
			},
			error: function(error) {
				console.log(error);
			},
		});
		this.reuse = reuse;
		this.state = {
			props:props,
		};
	}

	render() {
	  const routes: never[] = [];
	  var props = this.state.props;
	  var titlelst = [];
	  var totalreuse = 0;
	  var detaillst = [];

	  function scrollToId(txt) {
		  return ()=>{document.getElementById(txt)?.scrollIntoView();}
	  }
	  for (var i=0;i<this.reuse.subsents.length;i++) {
		  var subsent = this.reuse.subsents[i];
		  if (subsent.reuse.length==0) {
			  titlelst.push(subsent.text);
		  }
		  else {
			  titlelst.push(
			  <span
				style={{ backgroundColor: '#F5A9A9' }}
				onClick={scrollToId(subsent.text)}>
				{subsent.text}
			  </span>
			  );
			  totalreuse += subsent.reuse.length;
			  detaillst.push(
			  <>
				<Title level={4} id={subsent.text}>
				  {subsent.text}
				</Title>
				<NestedTable reuse={subsent.reuse} />
				<br></br>
			  </>
			  );
		  }
	  }

	  return (
		<PageContainer title={false} breadcrumb={{ routes }}>
		  <Card>
			<Title level={3}>
				{titlelst}
			</Title>
			<div style={{ paddingTop: 20, paddingBottom: 20 }}>
			  <Alert
				message={`该句在本系统所收录的所有书目中共复用${totalreuse}次`}
				type="success"
				showIcon
			  />
			</div>
			  {detaillst}
		  </Card>
		</PageContainer>
	  );
	}
}

export default sentenceBrowse;

import {
  Button,
  Checkbox,
  Divider,
  Input,
  Row,
  Select,
  TreeSelect,
} from 'antd';
import { useState } from 'react';
import { history } from 'umi';
import request from 'umi-request';
import '../searchresult';

function ResultRange(props) {
	const setMethod = props.setMethod;
	if (!props.visible) return "";
	return (
      <Row align="middle" style={{ fontSize: '6px', marginBottom: '12px' }}>
        在结果所在
        <Select
          defaultValue="sentence"
          style={{ width: 65, fontSize: '4px' }}
          onChange={(value) => {setMethod(value);}}
          size="small"
        >
          <Select.Option value="sentence" style={{ fontSize: '4px' }}>
            句子
          </Select.Option>
          <Select.Option value="para" style={{ fontSize: '4px' }}>
            段落
          </Select.Option>
          <Select.Option value="chapter" style={{ fontSize: '4px' }}>
            篇章
          </Select.Option>
          <Select.Option value="book" style={{ fontSize: '4px' }}>
            书目
          </Select.Option>
        </Select>
        中查找
      </Row>
	);
}

function UpdateSearchResult(data, response) {
	global.SearchSetting = data;
	global.SearchResult = response;
	global.timestamp += 1;
	history.push(history.location.pathname);
}

function QuadraticSearch(props) {
  const [qquery, setqQuery] =
    useState<String>("");
  var [regularSearchSwitch, setRegularSearchSwitch] =
    useState<Boolean>(false);
  if (props.pagekey=='book') setRegularSearchSwitch = (()=>{});

  const handleChange = (e: any) => {
    setRegularSearchSwitch(e.target.checked);
    console.log(e.target.checked);
  };
  
  const [resRange, setResRange] =
    useState<String>("sentence");
  
  const [advRange, setAdvRange] =
    useState<String>("sentence");
  const [fuzzy, setFuzzy] =
    useState<Boolean>(false);
  const [synExp, setSynExp] =
    useState<Boolean>(false);

  const rangeVisible=(props.pagekey=='content');

  function sendRequest() {
	  var requesturl = 'http://162.105.86.52:12347/search';
	  var data = global.SearchSetting;
	  var q_data = {
		  'query': qquery, 
		  'key': props.pagekey,
		  'advanced': regularSearchSwitch,
		  'fuzzy': fuzzy,
		  'synonym_expansion': synExp
	  };
	  if (props.pagekey=='content') {
		  q_data.result_range = resRange;
		  q_data.constraint = advRange;
	  }
	  data.quadratic = q_data;
	  console.log(data);
	  //var tmp = document.getElementById('test1');
	  //console.log(tmp);
	  request(requesturl, {
		  method: 'GET',
		  params: data,
	  })
	  .then(function(response) {
			  console.log(response);
			  UpdateSearchResult(data, response);
		  })
	  .catch(function(error) {
			  console.log(error);
		  });
  }

  return (
    <>
      <Input
        placeholder="在结果中检索"
        allowClear
        size="small"
        style={{ width: '100%', marginTop: '12px', marginBottom: '6px' }}
		onChange={(res) => {setqQuery(res.target.value);}}
      />

	  <ResultRange visible={rangeVisible} setMethod={setResRange}/>

      <Row align="middle" style={{ fontSize: '6px', marginBottom: '12px' }}>
        <Checkbox onChange={handleChange} style={{ fontSize: '6px' }}>
          使用高级检索式
        </Checkbox>
        <div
          style={
            regularSearchSwitch
              ? { display: 'inline-block' }
              : { display: 'none' }
          }
        >
          范围约束为
          <Select
            defaultValue="sentence"
            style={{ width: 65, fontSize: '6px' }}
            onChange={(value) => {setAdvRange(value);}}
            size="small"
          >
            <Select.Option value="sentence">句子</Select.Option>
            <Select.Option value="para">段落</Select.Option>
            <Select.Option value="chapter">篇章</Select.Option>
            <Select.Option value="book">书本</Select.Option>
          </Select>
        </div>
      </Row>

      <Row align="middle" style={{ fontSize: '6px' }}>
        检索模式：
      </Row>
      <Row align="middle" style={{ fontSize: '6px', marginBottom: '12px' }}>
        <Checkbox onChange={(value) => {setFuzzy(value.target.checked);}} style={{ fontSize: '6px' }}>
          模糊查询
        </Checkbox>
        <Checkbox onChange={(value) => {setSynExp(value.target.checked);}} style={{ fontSize: '6px' }}>
          同义词扩展
        </Checkbox>
      </Row>
      <Divider></Divider>
      <Row justify="end">
        <Button size={'small'} style={{ fontSize: '12px' }} onClick={sendRequest}>
          确定
        </Button>
      </Row>
    </>
  );
}

export default QuadraticSearch;

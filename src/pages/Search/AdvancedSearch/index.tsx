import { InfoCircleOutlined } from '@ant-design/icons';
import { Checkbox, Col, Input, Row, Select, Tooltip, TreeSelect } from 'antd';
import { useState } from 'react';
import { history } from 'umi';
import '../searchresult';
import request from 'umi-request';
import $ from 'jquery';

const CheckboxGroup = Checkbox.Group;

function MySearch(props: { options: string[]; title: string }) {
  const plainOptions = props.options;
  const defaultList = [plainOptions[3]];
  const [checkedList, setCheckedList] = useState<string[]>(defaultList);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);

  const onChange = (list: any) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
  };

  const onCheckAllChange = (e: any) => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  return (
    <Row style={{ margin: '6px' }}>
      {props.title}
      <Col span={2}>
        <Checkbox
          indeterminate={indeterminate}
          onChange={onCheckAllChange}
          checked={checkAll}
        >
          全选
        </Checkbox>
      </Col>
      <Col span={18}>
        <CheckboxGroup
          options={plainOptions}
          value={checkedList}
          onChange={onChange}
          id="range"
        />
      </Col>
    </Row>
  );
}

function RangeSelect() {
  const [searchType, setSearchType] = useState<String>('dynasty');

  function sort_by_key(arr, key) {
    var books = global.books;
    var mp = {};
    var ret = [];
    for (var i = 0; i < arr.length; i++) {
      var tmp = arr[i];
      var entity = {
        title: tmp.name[global.langid],
        value: tmp.name[global.langid],
        key: tmp.name[global.langid],
        children: [],
      };
      if ('children' in tmp && tmp.children.length > 0) {
        for (var j = 0; j < tmp.children.length; j++) {
          var sub = {
            title: tmp.children[j].name[global.langid],
            value: '@' + tmp.children[j].name[global.langid],
            key: '@' + tmp.children[j].name[global.langid],
            children: [],
          };
          entity.children.push(sub);
          mp[sub.title] = sub;
        }
      } else {
        mp[entity.title] = entity;
      }
      ret.push(entity);
    }
    for (var i = 0; i < books.length; i++) {
      var val = books[i][key][global.langid];
      var book_node = {
        title: books[i].name[global.langid],
        value: '@@' + books[i].name[global.langid],
        key: '@@' + books[i].name[global.langid],
        children: [],
      };
      for (var j = 0; j < books[i].children.length; j++) {
        var page = books[i].children[j];
        var page_node = {
          title: page.name[global.langid],
          value:
            '@@@' + book_node.title + '-' + page.name[global.langid] + '-' + j,
          key:
            '@@@' + book_node.title + '-' + page.name[global.langid] + '-' + j,
        };
        book_node.children.push(page_node);
      }
      mp[val].children.push(book_node);
    }
    return ret;
  }

  var categoryData = sort_by_key(global.catalogues, 'catalogue');
  var dynastyData = sort_by_key(global.periods, 'period');

  const typeList = {
    dynasty: dynastyData,
    category: categoryData,
  };

  const { SHOW_PARENT } = TreeSelect;
  const { Option } = Select;

  function rangeSelectChange(value: string) {
    console.log(value);
    setSearchType(value.slice());
  }

  function treeSelectChange(value: any) {
    console.log(value);
    global.PageRange = value;
  }

  return (
    <>
      <Select
        defaultValue="dynasty"
        style={{ width: '10%' }}
        size="small"
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
        placeholder={'书目范围选择'}
        onChange={treeSelectChange}
        style={{ minWidth: '40%', maxWidth: '70%' }}
        size="small"
        dropdownMatchSelectWidth={false}
        allowClear
        maxTagCount={5}
      ></TreeSelect>
    </>
  );
}

function DataLoaded() {
  if (typeof global.pages == 'undefined') return false;
  if (typeof global.catalogues == 'undefined') return false;
  if (typeof global.authors == 'undefined') return false;
  if (typeof global.periods == 'undefined') return false;
  return true;
}

function GetLocalData() {
  if (typeof global.books == 'undefined') {
    var requesturl = 'http://162.105.86.52:12347/search/getpages';
    $.ajax({
      type: 'GET',
      url: requesturl,
      async: false,
      success: function (response) {
        global.books = JSON.parse(response);
      },
      error: function (error) {
        console.log(error);
      },
    });
  }

  if (typeof global.catalogues == 'undefined') {
    var requesturl = 'http://162.105.86.52:12347/search/getcatalogues';
    $.ajax({
      type: 'GET',
      url: requesturl,
      async: false,
      success: function (response) {
        global.catalogues = JSON.parse(response);
      },
      error: function (error) {
        console.log(error);
      },
    });
  }

  if (typeof global.authors == 'undefined') {
    var requesturl = 'http://162.105.86.52:12347/search/getauthors';
    $.ajax({
      type: 'GET',
      url: requesturl,
      async: false,
      success: function (response) {
        global.authors = JSON.parse(response);
      },
      error: function (error) {
        console.log(error);
      },
    });
  }

  if (typeof global.periods == 'undefined') {
    var requesturl = 'http://162.105.86.52:12347/search/getperiods';
    $.ajax({
      type: 'GET',
      url: requesturl,
      async: false,
      success: function (response) {
        global.periods = JSON.parse(response);
        global.torough = {};
        for (var i = 0; i < global.periods.length; i++) {
          var tmp = global.periods[i];
          if ('children' in tmp) {
            for (var j = 0; j < tmp.children.length; j++) {
              var name = tmp.children[j].name;
              for (var n of name) global.torough[n] = tmp.name;
            }
          } else global.torough[tmp.name] = tmp.name;
        }
      },
      error: function (error) {
        console.log(error);
      },
    });
  }
}

function UpdateSearchResult(data, response) {
  global.SearchSetting = data;
  global.SearchResult = response;
  global.timestamp += 1;
  history.push(history.location.pathname);
}

function AdvancedSearch() {
  GetLocalData();
  const [regularSearchSwitch, setRegularSearchSwitch] =
    useState<Boolean>(false);
  const [fuzzy, setFuzzy] = useState<Boolean>(false);
  const [synExp, setSynExp] = useState<Boolean>(false);

  const handleChange = (e: any) => {
    setRegularSearchSwitch(e.target.checked);
  };

  const handleFormSubmit = (value: string) => {
    var requesturl = 'http://162.105.86.52:12347/search';
    var advanced = document.getElementById('search_advanced').checked;
    var range = document.getElementById('range').getElementsByTagName('input');
    var rangebs = 0;
    for (var i = 0; i < range.length; i++) {
      if (range[i].checked) rangebs = rangebs | (1 << i);
    }
    var data = {
      query: value,
      advanced: advanced,
      range: rangebs,
      page_range: global.PageRange,
      fuzzy: fuzzy,
      synonym_expansion: synExp,
    };
    if (advanced) {
      var constraint = document.getElementById('constraint_select');
      constraint = constraint.getElementsByClassName(
        'ant-select-selection-item',
      )[0].textContent;
      data['constraint'] = constraint;
    }
    console.log(data);
    //var tmp = document.getElementById('test1');
    //console.log(tmp);
    request(requesturl, {
      method: 'GET',
      params: data,
    })
      .then(function (response) {
        console.log(response);
        UpdateSearchResult(data, response);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <form style={{ marginLeft: '32px' }}>
      <Row style={{ margin: '6px' }} align="middle">
        <Input.Search
          enterButton="搜索"
          size="middle"
          onSearch={handleFormSubmit}
          style={{ maxWidth: 400, width: '100%' }}
        />
      </Row>
      <Row style={{ margin: '6px' }} align="middle">
        <Checkbox id="search_advanced" onChange={handleChange}>
          使用高级检索式
        </Checkbox>
        <Tooltip title="【note】高级检索式规则和例子(此处省略很多字)....">
          <InfoCircleOutlined />
        </Tooltip>
        <div
          style={
            regularSearchSwitch
              ? { marginLeft: 20, display: 'inline-block' }
              : { display: 'none' }
          }
          id="constraint_select"
        >
          范围约束为
          <Select
            defaultValue="sentence"
            style={{ width: 65, fontSize: '6px' }}
            onChange={() => {}}
            size="small"
          >
            <Select.Option value="sentence">句子</Select.Option>
            <Select.Option value="para">段落</Select.Option>
            <Select.Option value="chapter">篇章</Select.Option>
            <Select.Option value="book">书本</Select.Option>
          </Select>
        </div>
      </Row>

      <MySearch
        title="检索范围："
        options={['书名', '篇章名', '作者', '全文']}
      ></MySearch>
      <Row style={{ margin: '6px' }}>
        检索模式：
        <Checkbox
          onChange={(value) => {
            setFuzzy(value.target.checked);
          }}
        >
          模糊查询
        </Checkbox>
        <Checkbox
          onChange={(value) => {
            setSynExp(value.target.checked);
          }}
        >
          同义词扩展
        </Checkbox>
      </Row>
      <Row style={{ margin: '6px' }}>
        书目范围：
        <RangeSelect></RangeSelect>
      </Row>
    </form>
  );
}

export default AdvancedSearch;

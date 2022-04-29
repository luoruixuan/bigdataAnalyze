import { PlusSquareOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Row, Tabs, Tooltip, Col, Modal } from 'antd';
import { Menu } from 'antd';
import React from 'react';
import $ from 'jquery';
import '../../lang';

const { SubMenu } = Menu;

function is_expand(node) {
  return node.className != 'ant-menu-title-content';
}
function getMenu(node) {
  if (!('children' in node) || node.children.length == 0)
    return <Menu.Item key={node.href}>{node.name[global.langid]}</Menu.Item>;
  var tmp = [];
  for (var i = 0; i < node.children.length; i++) {
    tmp.push(getMenu(node.children[i]));
  }
  return (
    <SubMenu
      key={node.href}
      icon={<PlusSquareOutlined />}
      title={node.name[global.langid]}
      onTitleClick={handleClick}
    >
      {tmp}
    </SubMenu>
  );
}

function handleClick(value) {
  if (!is_expand(value.domEvent.target)) {
    window.location.href = value.key;
  }
}

class CatMenu extends React.Component {
  constructor(props) {
    super(props);
    var requesturl = 'http://162.105.86.52:12347/search/getcatalogues';
    var catalogues;
    $.ajax({
      type: 'GET',
      url: requesturl,
      async: false,
      success: function (response) {
        catalogues = JSON.parse(response);
      },
      error: function (error) {
        console.log(error);
      },
    });
    var requesturl = 'http://162.105.86.52:12347/search/getpages';
    var pages;
    $.ajax({
      type: 'GET',
      url: requesturl,
      async: false,
      success: function (response) {
        pages = JSON.parse(response);
      },
      error: function (error) {
        console.log(error);
      },
    });
    var catmp = {};
    var cat = catalogues;
    for (var i = 0; i < cat.length; i++) {
      catmp[cat[i].id] = cat[i];
      cat[i].href = '/book?catid=' + String(cat[i].id);
      for (var j = 0; j < cat[i].children.length; j++) {
        var subcat = cat[i].children[j];
        catmp[subcat.id] = subcat;
        subcat.href = '/book?catid=' + String(subcat.id);
      }
    }
    for (var i = 0; i < pages.length; i++) {
      var book = pages[i];
      var catname = book.catalogue[global.langid];
      var bookname = book.name[global.langid];
      var catid = book.catid;
      var tmp = { name: book.name, children: [], href: '/book/' + bookname };
      // 篇章级别不要了
      /*
			for (var j=0;j<book.children.length;j++) {
				tmp.children.push({name: book.children[j].name, href:"/book/"+bookname+"?page="+String(j)});
			}
			*/
      if (!('children' in catmp[catid])) catmp[catid].children = [];
      catmp[catid].children.push(tmp);
    }
    var tmp = [];
    for (var i = 0; i < cat.length; i++) {
      tmp.push(getMenu(cat[i]));
    }
    this.menu = tmp;
  }

  render() {
    return (
      <Menu onClick={handleClick} style={{ width: 170 }} mode="inline">
        {this.menu}
      </Menu>
    );
  }
}

export default CatMenu;

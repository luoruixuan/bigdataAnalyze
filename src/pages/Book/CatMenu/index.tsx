import { PlusSquareOutlined } from '@ant-design/icons';
import { Button, Card, Checkbox, Row, Tabs, Tooltip, Col, Modal } from 'antd';
import { Menu } from 'antd';
import React from 'react';
import $ from 'jquery';
import '../../lang';

const { SubMenu } = Menu;

class CatMenu extends React.Component {
	constructor(props) {
		super(props);
		var requesturl = 'http://162.105.86.52:12347/search/getcatalogues';
		var catalogues;
		$.ajax({
			type: 'GET',
			url: requesturl,
			async: false,
			success: function(response) {
				catalogues = JSON.parse(response);
			},
			error: function(error) {
				console.log(error);
			}
		});
		this.state = {
			catalogues: catalogues,
		}
	}

	handleClick(value) {
		var href = "/book?catid="+String(value.key);
		window.location.href = href;
	}

	render() {
		var tmp = [];
		var cat = this.state.catalogues;
		for (var i=0;i<cat.length;i++) {
			if (cat[i].children.length==0) {
				tmp.push(<Menu.Item key={cat[i].id} icon={<PlusSquareOutlined />}>{cat[i].name[global.langid]}</Menu.Item>);
			}
			else {
				var lst = [];
				for (var j=0;j<cat[i].children.length;j++) {
					var subcat = cat[i].children[j];
					lst.push(<Menu.Item key={subcat.id}>{subcat.name[global.langid]}</Menu.Item>);
				}
				tmp.push(
					<SubMenu key={cat[i].id} icon={<PlusSquareOutlined />} title={cat[i].name[global.langid]}>
						{lst}
					</SubMenu>
					);

			}
		}

		return (
			<Menu
			    onClick={this.handleClick}
				style={{ width: 170 }}
				mode="inline"
			>
			{tmp}
			</Menu>
		);
	}
}

export default CatMenu;

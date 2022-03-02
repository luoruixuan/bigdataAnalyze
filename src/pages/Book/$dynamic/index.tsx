import { SwapOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card, Checkbox, Row, Tabs, Tooltip, Col, Modal } from 'antd';
import { Typography, Switch } from 'antd';
import { useState } from 'react';
const { TabPane } = Tabs;
const { Title } = Typography;

const CheckboxGroup = Checkbox.Group;

const plainOptions = ['人名', '时间', '地名', '职官', '书名'];
const defaultCheckedList = [''];

function bookBrowse(props: any) {
  const routes: never[] = [];

  const [peoStyle, setPeoStyle] = useState({ color: 'black' });
  const [timStyle, setTimStyle] = useState({ color: 'black' });
  const [plaStyle, setPlaStyle] = useState({ color: 'black' });
  const [offStyle, setOffStyle] = useState({ color: 'black' });
  const [booStyle, setBooStyle] = useState({ color: 'black' });
  // 蓝色颜色代码 #1890FF

  const [checkedList, setCheckedList] = useState(defaultCheckedList);
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const [reuseSwitch, setReuseSwitch] = useState(false);
  const [entitySwitch, setEntitySwitch] = useState(false);
  const [underlineSwitch, setUnderlineSwitch] = useState(false);

  const onCheckChange = (list: any) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);

    if (list.indexOf('人名') != -1) {
      setPeoStyle({ color: 'red' });
    } else {
      setPeoStyle({ color: 'black' });
    }
    if (list.indexOf('时间') != -1) {
      setTimStyle({ color: 'red' });
    } else {
      setTimStyle({ color: 'black' });
    }
    if (list.indexOf('地名') != -1) {
      setPlaStyle({ color: 'red' });
    } else {
      setPlaStyle({ color: 'black' });
    }
    if (list.indexOf('职官') != -1) {
      setOffStyle({ color: 'red' });
    } else {
      setOffStyle({ color: 'black' });
    }
    if (list.indexOf('书名') != -1) {
      setBooStyle({ color: 'red' });
    } else {
      setBooStyle({ color: 'black' });
    }
  };

  const onCheckAllChange = (e: any) => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);

    if (e.target.checked) {
      setPeoStyle({ color: 'red' });
      setTimStyle({ color: 'red' });
      setPlaStyle({ color: 'red' });
      setOffStyle({ color: 'red' });
      setBooStyle({ color: 'red' });
    } else {
      setPeoStyle({ color: 'black' });
      setTimStyle({ color: 'black' });
      setPlaStyle({ color: 'black' });
      setOffStyle({ color: 'black' });
      setBooStyle({ color: 'black' });
    }
  };

  const onEntitySwitchChange = () => {
    if (entitySwitch) {
      setEntitySwitch(false);
    } else {
      setEntitySwitch(true);
      setUnderlineSwitch(false);
      setReuseSwitch(false);
    }
  };

  const onReuseSwitchChange = () => {
    if (reuseSwitch) {
      setReuseSwitch(false);
    } else {
      setEntitySwitch(false);
      setUnderlineSwitch(false);
      setReuseSwitch(true);
    }
  };

  const onUnderlineSwitchChange = () => {
    if (underlineSwitch) {
      setUnderlineSwitch(false);
    } else {
      setEntitySwitch(false);
      setReuseSwitch(false);
      setUnderlineSwitch(true);
    }
  };

  const myclick = () => {
    var selectedText = window.getSelection()?.toString();
    var parent_node = undefined;
    var e = window.event;
    if (selectedText != '') {
      parent_node = window.getSelection()?.focusNode?.parentNode;
      var reg = eval('/' + selectedText + '/ig');
      var dom = document.getElementById('text');
      console.log(selectedText);
    }
  };

  return (
    <PageContainer breadcrumb={{ routes }} title={false}>
      <Card
        style={{ marginTop: 24 }}
        bordered={false}
        bodyStyle={{ padding: '32px 32px 32px 32px' }}
      >
        <Title level={2}>{props.match.params.bookName}</Title>
        {/* <Paragraph>论语是XXXXX</Paragraph> */}
      </Card>
      <Card
        style={{ marginTop: 24 }}
        bordered={false}
        bodyStyle={{ padding: '32px 32px 32px 32px' }}
      >
        <Tabs type="card">
          <TabPane tab="學而第一" key="1">
            <div style={{ margin: 20 }}>
              <Row>
                {/* <Col span={4}>
                  <Tooltip title="高亮显示时间、地点、职官等实体">
                    实体高亮：
                  </Tooltip>
                  <Switch
                    checkedChildren="开"
                    unCheckedChildren="关"
                    checked={entitySwitch}
                    onChange={onEntitySwitchChange}
                  />
                </Col> */}
                <Col span={4} offset={20}>
                  复用分析：
                  <Switch
                    checkedChildren="开"
                    unCheckedChildren="关"
                    checked={reuseSwitch}
                    onChange={onReuseSwitchChange}
                  />
                </Col>
                {/* <Col span={4}>
                  <Tooltip title="选中词语查询相关实体">划词查询：</Tooltip>
                  <Switch
                    checkedChildren="开"
                    unCheckedChildren="关"
                    checked={underlineSwitch}
                    onChange={onUnderlineSwitchChange}
                  />
                </Col> */}
              </Row>
            </div>
            <div
              style={
                entitySwitch
                  ? { marginLeft: 20, display: 'inline-block' }
                  : { display: 'none' }
              }
            >
              <Checkbox
                indeterminate={indeterminate}
                onChange={onCheckAllChange}
                checked={checkAll}
              >
                全选
              </Checkbox>
              <CheckboxGroup
                options={plainOptions}
                value={checkedList}
                onChange={onCheckChange}
              />
            </div>
            <div id="text" style={{ margin: 20 }} onClick={myclick}>
              1《學而篇第一》
              <br />
              1．1
              <span
                style={{ backgroundColor: '#F5A9A9' }}
                onClick={() => {
                  window.location.href = '/sentence/1';
                }}
              >
                子曰：「 學而時習之 ，不亦說乎？ 有朋自遠方來
                ，不亦樂乎？人不知而不慍，不亦君子乎？」
              </span>
              …………
              {/* <Tooltip title="复用分析">
                <Button
                  size="small"
                  type="link"
                  icon={<SwapOutlined />}
                  onClick={() => {
                    window.location.href = '/sentence/1';
                  }}
                />
              </Tooltip> */}
              <br />
              1．2有子曰：「其為人也孝弟，而好犯上者，鮮矣；不好犯上，而好作亂者，未之有也。君子務本，本立而道生。孝弟也者，其為（仁）〔人〕之本與！」
              <br />
              ...... <br />
              1. 10 <span style={peoStyle}>子禽</span>問於
              <span style={peoStyle}>子貢</span>
              曰：「夫子至於是邦也，必聞其政，求之與？抑與之與？」
              <span style={peoStyle}>子貢</span>
              曰：「夫子溫、良、恭、儉、讓以得之。夫子之求之也，其諸異乎人之求之與？」
            </div>
          </TabPane>
          <TabPane tab="為政第二" key="2">
            Content of Tab Pane 2
          </TabPane>
          <TabPane tab="八佾第三" key="3">
            Content of Tab Pane 3
          </TabPane>
        </Tabs>
      </Card>
    </PageContainer>
  );
}

export default bookBrowse;

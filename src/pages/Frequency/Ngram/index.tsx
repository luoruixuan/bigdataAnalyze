import { EditOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Button,
  Card,
  Checkbox,
  Divider,
  Form,
  Image,
  Input,
  Modal,
  Space,
  Tabs,
  TreeSelect,
  Typography,
} from 'antd';
import { useState } from 'react';

const { SHOW_PARENT } = TreeSelect;
const { TabPane } = Tabs;

const treeData = [
  {
    title: '先秦两汉',
    value: '0-0',
    key: '0-0',
    children: [
      {
        title: '春秋繁露',
        value: '春秋繁露',
        key: '春秋繁露',
      },
      {
        title: '韓詩外傳',
        value: '韓詩外傳',
        key: '韓詩外傳',
      },
    ],
  },
  {
    title: '魏晋南北朝',
    value: '0-1',
    key: '0-1',
    children: [
      {
        title: '顏氏家訓',
        value: '顏氏家訓',
        key: '顏氏家訓',
      },
      {
        title: '劉子新論',
        value: '劉子新論',
        key: '劉子新論',
      },
    ],
  },
  {
    title: '宋明',
    value: '0-3',
    key: '0-3',
    children: [
      {
        title: '榕壇問業',
        value: '榕壇問業',
        key: '榕壇問業',
      },
      {
        title: '二程外書',
        value: '二程外書',
        key: '二程外書',
      },
      {
        title: '困學紀聞',
        value: '困學紀聞',
        key: '困學紀聞',
      },
    ],
  },
];

const plainOptions = [
  '蓋',
  '然',
  '所以',
  '斯',
  '是故',
  '嗚呼',
  '無可',
  '焉',
  '耶',
];
const defaultCheckedList = ['嗚呼', '所以'];

function WordPage() {
  const [form] = Form.useForm();
  const [wordSelect, setWordSelect] = useState<boolean>(true);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [checkedList, setCheckedList] = useState(defaultCheckedList);
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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onFinish = (values: any) => {
    console.log('Received values of form:', values);
  };

  function bookSelectChange(value: any) {
    console.log('onChange ', value);
    if (value === [] || value.length === 0) {
      setWordSelect(true);
    } else {
      setWordSelect(false);
    }
  }

  function wordSelectChange(value: any) {
    console.log(`selected ${value}`);
  }

  return (
    <PageContainer>
      <Card
        title="分析条件设置"
        style={{ marginTop: 24 }}
        bordered={false}
        bodyStyle={{ padding: '32px 32px 32px 32px' }}
      >
        <Form>
          <Form.Item label="统计范围">
            {/* <BookTreeSelect /> */}
            <TreeSelect
              treeData={treeData}
              treeCheckable={true}
              showCheckedStrategy={SHOW_PARENT}
              placeholder={'请选择要检索的书目集合'}
              onChange={bookSelectChange}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item label="分析粒度">
            <Space>
              <Checkbox.Group>
                <Checkbox value="unigram" style={{ lineHeight: '32px' }}>
                  unigram
                </Checkbox>
                <Checkbox value="bigram" style={{ lineHeight: '32px' }}>
                  bigram
                </Checkbox>
                <Checkbox value="trigram" style={{ lineHeight: '32px' }}>
                  trigram
                </Checkbox>
                <Checkbox value="4-gram" style={{ lineHeight: '32px' }}>
                  4-gram
                </Checkbox>
              </Checkbox.Group>
            </Space>
          </Form.Item>
          <Form.Item
            label="匹配词典"
            tooltip="【note】允许用户自定义/选择已有词表对N-gram结果进行过滤"
          >
            <Space>
              <Checkbox.Group>
                <Checkbox value="dict1" style={{ lineHeight: '32px' }}>
                  汉语大词典
                </Checkbox>
                <Checkbox value="dict2" style={{ lineHeight: '32px' }}>
                  辞源
                </Checkbox>
                <Checkbox value="dict3" style={{ lineHeight: '32px' }}>
                  词典X
                </Checkbox>
                <Checkbox value="dict4" style={{ lineHeight: '32px' }}>
                  词典Y
                </Checkbox>
                <Checkbox value="dict5" style={{ lineHeight: '32px' }}>
                  词典Z
                </Checkbox>
              </Checkbox.Group>
              {/* <Upload
                action=""
                listType="picture"
                maxCount={1}
                accept='.txt'
              >
                <Button icon={<UploadOutlined />}></Button>
              </Upload> */}
            </Space>
          </Form.Item>
          <Form.Item
            label="停用词表"
            tooltip="【note】允许用户自定义停用词表对N-gram结果进行过滤"
          >
            <Button icon={<EditOutlined />} onClick={showModal}>
              修改词表
            </Button>
            <Modal
              title="停用词设置"
              visible={isModalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
            >
              <div style={{ width: '100%', marginBottom: 10 }}>
                <Typography.Text strong>预设词表选择：</Typography.Text>
              </div>
              <Checkbox
                style={{ marginBottom: 10 }}
                indeterminate={indeterminate}
                onChange={onCheckAllChange}
                checked={checkAll}
              >
                全选
              </Checkbox>
              {/* <Button type='text' icon={<PlusCircleOutlined />}>添加</Button> */}

              <Space>
                <Checkbox.Group
                  style={{ width: '20%' }}
                  options={plainOptions}
                  value={checkedList}
                  onChange={onChange}
                />
              </Space>
              <Divider />

              <div style={{ width: '100%' }}>
                <Typography.Text strong>自定义停用词：</Typography.Text>
              </div>
              <div style={{ width: '100%', marginBottom: 10 }}>
                以<Typography.Text code>换行符\n</Typography.Text>分割可自动分词
              </div>
              <Input.TextArea rows={4} bordered={true} />
              {/* <Select 
                mode="tags" 
                size='small' 
                style={{ width: '100%' }} 
                tokenSeparators={['\n']}
                dropdownMatchSelectWidth={false}
              >
              </Select> */}
            </Modal>

            {/* <Upload
              action=""
              listType="picture"
              maxCount={1}
              accept='.txt'
            >
              <Button icon={<UploadOutlined />}>upload</Button>
            </Upload> */}
          </Form.Item>
          <Form.Item style={{ float: 'right' }}>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card
        style={{ marginTop: 24 }}
        bordered={false}
        bodyStyle={{ padding: '32px 32px 32px 32px' }}
      >
        <Tabs type="card">
          <TabPane tab="统计列表" key="1">
            <Image
              width={'100%'}
              preview={false}
              src={require('/src/assets/NgramsDemo2.jpg')}
            />
          </TabPane>
          <TabPane tab="折线图" key="2">
            <Image
              width={'100%'}
              preview={false}
              src={require('/src/assets/lineChartDemo.jpg')}
            />
          </TabPane>
          <TabPane tab="柱状图" key="3">
            <Image
              width={'100%'}
              preview={false}
              src={require('/src/assets/barChartDemo.jpg')}
            />
          </TabPane>
        </Tabs>
      </Card>
    </PageContainer>
  );
}

export default WordPage;

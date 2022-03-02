import { useState } from 'react';
import { Image, Select, Alert, Button, Form } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

function ChapterReuse() {
  const [selectedBook, setSelectedBook] = useState<string>('论语');
  const { Option } = Select;

  function onFocus() {
    console.log('focus');
  }

  return (
    <>
      <Form>
        <Form.Item label="分析书目">
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="选择分析书目"
            optionFilterProp="children"
            onChange={(value: string) => {
              setSelectedBook(value);
            }}
            onFocus={onFocus}
            defaultValue={'论语'}
          >
            <Option value="论语">论语</Option>
            <Option value="孟子">孟子</Option>
            <Option value="庄子">庄子</Option>
          </Select>
        </Form.Item>
      </Form>

      <div style={{ paddingTop: 10 }}>
        <Alert
          message={selectedBook + '在所选取的文本集合中复用XXX次'}
          type="success"
          showIcon
        />
      </div>
      <div style={{ float: 'right' }}>
        <DownloadOutlined />
      </div>
      <Image
        width={'100%'}
        preview={false}
        src={require('/src/assets/chapterAnalyzeDemo.jpg')}
      />
      <Image
        width={'100%'}
        preview={false}
        src={require('/src/assets/reuseDetailDemo.jpg')}
      />
    </>
  );
}

export default ChapterReuse;

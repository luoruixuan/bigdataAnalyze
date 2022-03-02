import { DownloadOutlined } from '@ant-design/icons';
import { Alert, Image } from 'antd';

function BookReuse() {
  return (
    <>
      <Alert
        message={<div> 两个文本集合的复用总频次为XXXX次 </div>}
        description={
          <div>
            {' '}
            书目集合A：论语；孟子； ... <br /> 书目集合B：二程遺書；西山讀書記；
            ... <br />{' '}
          </div>
        }
        type="success"
        showIcon
      />
      <div style={{ float: 'right' }}>
        <DownloadOutlined />
      </div>

      <Image
        width={'100%'}
        preview={false}
        src={require('/src/assets/bookAnalyzeDemo2.jpg')}
      />

      <Image
        width={'100%'}
        preview={false}
        src={require('/src/assets/reuseDetailDemo.jpg')}
      />
    </>
  );
}

export default BookReuse;

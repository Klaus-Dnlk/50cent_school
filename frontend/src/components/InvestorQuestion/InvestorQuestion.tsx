import {
  ClusterOutlined,
  QuestionOutlined,
  WechatOutlined,
} from '@ant-design/icons';
import { Col, Row } from 'antd';

const InvestorQuestion = () => {
  return (
    <>
      <Row justify="space-between">
        <Col span={7}>
          <Row align="middle" wrap={false}>
            <Col>
              <WechatOutlined
                style={{ fontSize: '60px', marginRight: '10px' }}
              />
            </Col>
            <Col>
              <h2>Онлайн підтримка</h2>
              <p>Якшо шось не зрозуміло - напишіть в нашу техпідтримку. </p>
              <a href="/">написати в підтримку </a>
            </Col>
          </Row>
        </Col>

        <Col span={7}>
          <Row align="middle" wrap={false}>
            <Col>
              <QuestionOutlined
                style={{ fontSize: '60px', marginRight: '10px' }}
              />
            </Col>
            <Col>
              <h2>FAQ</h2>
              <p>Якшо шось не зрозуміло - напишіть в нашу техпідтримку. </p>
              <a href="/">написати в підтримку </a>
            </Col>
          </Row>
        </Col>

        <Col span={7}>
          <Row align="middle" wrap={false}>
            <Col>
              <ClusterOutlined
                style={{
                  fontSize: '60px',
                  marginRight: '10px',
                }}
              />
            </Col>
            <Col>
              <h2>Про нас</h2>
              <p>Якшо шось не зрозуміло - напишіть в нашу техпідтримку. </p>
              <a href="/">написати в підтримку </a>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export { InvestorQuestion };

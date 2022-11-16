import React, { FC } from 'react';
import { Layout, Col, Row } from 'antd';

import './Footer.css';

const { Footer } = Layout;

const FooterComponent: FC = () => {
  return (
    <Footer>
      <Row justify="space-between">
        <Col>
          <h2>Про нас</h2>
          <Row>
            <span>Про компанію</span>
          </Row>
          <Row>
            <span>FAG</span>
          </Row>
          <Row>
            <span>Задати питання</span>
          </Row>
          <Row>
            <span>Системні дані</span>
          </Row>
          <Row>
            <span>Фірмовий стиль</span>
          </Row>
        </Col>

        <Col>
          <h2>Продукти та сервіси</h2>
          <Row>
            <span>Р2р позичання</span>
          </Row>
          <Row>
            <span>Р2р кредитовання</span>
          </Row>
          <Row>
            <span>Реферальна програма</span>
          </Row>
        </Col>

        <Col>
          <h2>Дoкументація</h2>
          <Row>
            <span>Узгода користувача</span>
          </Row>
          <Row>
            <span>Політика конфіденційності</span>
          </Row>
          <Row>
            <span>Підтримка</span>
          </Row>
        </Col>
      </Row>
    </Footer>
  );
};

export { FooterComponent };

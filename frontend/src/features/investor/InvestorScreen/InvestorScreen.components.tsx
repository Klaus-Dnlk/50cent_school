import { InvestmentsTable, InvestorQuestion } from '../../../components/index';
import { Col, Layout, Row } from 'antd';

import investorHomeImg from '../../../images/pexels-tima-miroshnichenko-6694864.jpg';
import {
  QuestionContainer,
  ImgContainer,
  InvestmentsContainer,
  InvestorHomeContainer,
  SubTitleContainer,
  TitleContainer,
} from './InvestorScreen.styles';

export function InvestorScreen() {
  return (
    <Layout>
      <InvestorHomeContainer>
        <Row justify="space-between" align="middle">
          <Col span={12}>
            <TitleContainer>Починайте інвестувати та заробляти!</TitleContainer>
            <SubTitleContainer>
              На цій сторінці розміщено всі активні заяви на інвестиції👇
            </SubTitleContainer>
          </Col>
          <Col span={12}>
            <Row justify="end">
              <ImgContainer src={investorHomeImg} alt="investor-img" />
            </Row>
          </Col>
        </Row>
      </InvestorHomeContainer>

      <InvestmentsContainer>
        <Row>
          <TitleContainer>
            Найвигідніші пропозиції для інвестицій{' '}
          </TitleContainer>
          <InvestmentsTable />
        </Row>
      </InvestmentsContainer>

      <QuestionContainer>
        <TitleContainer>Залишились запитання?</TitleContainer>
        <InvestorQuestion />
      </QuestionContainer>
    </Layout>
  );
}

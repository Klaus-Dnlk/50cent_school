import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';
import { routes } from './routes';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(routes.home.absolute());
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Result
      status="404"
      title="404"
      subTitle="Вибачте, сторінка, яку ви шукаєте, не існує."
      extra={[
        <Button type="primary" key="home" onClick={handleGoHome}>
          На головну
        </Button>,
        <Button key="back" onClick={handleGoBack}>
          Назад
        </Button>,
      ]}
    />
  );
}; 
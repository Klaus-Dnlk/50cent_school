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
      subTitle="Sorry, the page you are looking for does not exist."
      extra={[
        <Button type="primary" key="home" onClick={handleGoHome}>
          Go Home
        </Button>,
        <Button key="back" onClick={handleGoBack}>
          Go Back
        </Button>,
      ]}
    />
  );
}; 
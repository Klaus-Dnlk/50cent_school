import { ButtonProps, Typography } from 'antd';
import { PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';

import { StyledBackButton } from './BackButton.styles';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface BackButtonProps extends ButtonProps {}

export function BackButton({
  onClick,
  children,
  ...props
}: PropsWithChildren<BackButtonProps>) {
  const navigate = useNavigate();

  return (
    <StyledBackButton
      onClick={(e) => (onClick ? onClick(e) : navigate(-1))}
      {...props}
    >
      {typeof children === 'string' ? (
        <Typography.Text>{children}</Typography.Text>
      ) : (
        children || <Typography.Text>Back</Typography.Text>
      )}
    </StyledBackButton>
  );
}

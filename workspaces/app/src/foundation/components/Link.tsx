import type { ComponentPropsWithoutRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';

type Props = {
  children: React.ReactNode;
  to: string;
} & ComponentPropsWithoutRef<'a'>;

export const Link: React.FC<Props> = ({ children, to, ...rest }) => {
  return (
    <RouterLink to={to} {...rest}>
      {children}
    </RouterLink>
  );
};

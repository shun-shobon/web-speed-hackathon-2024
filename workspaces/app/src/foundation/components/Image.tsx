import type * as CSS from 'csstype';
import styled from 'styled-components';

const _Image = styled.img<{
  $objectFit: string;
}>`
  object-fit: ${({ $objectFit }) => $objectFit};
`;

type Props = {
  height: number | string;
  objectFit: CSS.Property.ObjectFit;
  width: number | string;
} & JSX.IntrinsicElements['img'];

export const Image: React.FC<Props> = ({ height, loading = 'lazy', objectFit, width, ...rest }) => {
  return <_Image {...rest} $objectFit={objectFit} decoding="async" height={height} loading={loading} width={width} />;
};

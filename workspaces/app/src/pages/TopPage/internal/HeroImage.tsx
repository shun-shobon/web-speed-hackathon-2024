import styled from 'styled-components';

const _Image = styled.img`
  width: 100%;
  aspect-ratio: 16 / 9;
`;

export const HeroImage: React.FC = () => {
  return <_Image alt="Cyber TOON" decoding="async" loading="eager" src="/assets/hero.webp" />;
};

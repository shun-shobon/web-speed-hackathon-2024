import styled from 'styled-components';

const _Image = styled.img`
  width: 100%;
  aspect-ratio: 16 / 9;
`;

export const HeroImage: React.FC = () => {
  return (
    <_Image
      alt="Cyber TOON"
      decoding="async"
      loading="eager"
      sizes="(max-width: 1024px) 100vw, 1024px"
      src="/assets/hero-1024.webp"
      srcSet={[
        '/assets/hero-256.webp 256w',
        '/assets/hero-384.webp 384w',
        '/assets/hero-512.webp 512w',
        '/assets/hero-768.webp 768w',
        '/assets/hero-1024.webp 1024w',
      ].join(',')}
    />
  );
};

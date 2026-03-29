import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'DreamTown | 여수 바다에서 시작된 당신의 별',
  description: '소원이 별이 되는 조용한 입구',
  openGraph: {
    title: 'DreamTown | 여수 바다에서 시작된 당신의 별',
    description: '소원이 별이 되는 조용한 입구',
    url: 'https://app.dailymiracles.kr/dreamtown',
    siteName: 'DreamTown',
    images: [
      {
        url: 'https://app.dailymiracles.kr/images/dreamtown-og.jpg',
        width: 1200,
        height: 630,
        alt: 'DreamTown — 여수 바다에서 시작된 당신의 별',
      },
    ],
    type: 'website',
  },
};

export default function DreamtownLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

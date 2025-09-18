import type { Metadata } from 'next';
import { Providers } from './providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'PredictaStream - Monetize Your Stream',
  description: 'Monetize your stream instantly with dynamic prediction markets.',
  openGraph: {
    title: 'PredictaStream',
    description: 'Monetize your stream instantly with dynamic prediction markets.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="floating-elements">
            <div className="floating-element w-20 h-20 top-10 left-10 opacity-30" style={{ animationDelay: '0s' }} />
            <div className="floating-element w-16 h-16 top-32 right-20 opacity-20" style={{ animationDelay: '2s' }} />
            <div className="floating-element w-12 h-12 bottom-20 left-1/4 opacity-25" style={{ animationDelay: '4s' }} />
            <div className="floating-element w-24 h-24 bottom-32 right-10 opacity-15" style={{ animationDelay: '1s' }} />
          </div>
          {children}
        </Providers>
      </body>
    </html>
  );
}

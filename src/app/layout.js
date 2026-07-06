import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata = {
  title: 'Akshaya Builders & Developers - Premium Real Estate',
  description: 'Akshaya Builders & Developers offers premium plots and residential projects with world-class amenities.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800;900&family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#0f2627',
              color: '#fff',
              border: '1px solid rgba(13,115,119,0.3)',
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
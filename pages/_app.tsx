import type { AppProps } from 'next/app';
import '../styles/globals.css';
import '../lib/builder';
import '../components/ProductsCarousel';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

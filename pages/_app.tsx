import { useRouter } from 'next/router';
import { ToastContainer } from 'react-toastify';
import Navbar from '../components/Navbar';
import '../styles/globals.css';
import { AuthProvider } from './api/authContext';

export default function App({ Component, pageProps }: any) {
  const router = useRouter();

  return (
    <>
      <AuthProvider>
        <ToastContainer />
        {router.asPath === '/signin' ||
          (router.asPath === '/signup' ? null : <Navbar />)}
        <Component {...pageProps} /> ;
      </AuthProvider>
    </>
  );
}

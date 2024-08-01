import Head from 'next/head';
import Navbar from '../components/Navbar';
import Main from '../components/pages/Main';
import About from '../components/pages/About';
import Skills from '../components/pages/Skills';
import Projects from '../components/pages/Projects';
import Contact from '../components/pages/Contact';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './api/authContext';
import Loader from '../components/loader/Loader';

export default function Home() {
  const router = useRouter();
  const { currentUser, loading: isLoading } = useAuth();
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    if (currentUser && !isLoading) {
      setLoader(false);
    }
    if (!currentUser && !isLoading) {
      router.push('/signin');
    }
  }, [currentUser, isLoading, router]);

  return (
    <>
      <Head>
        <title>portfolio next app</title>
        <meta name="description" content="create portfolio website" />
      </Head>
      {loader ? (
        <div className="w-full h-screen absolute top-0 left-0 bg-white z-50 flex justify-center items-center">
          <div className="w-16">
            <Loader color="#5651e5" width={100} />
          </div>
        </div>
      ) : (
        <>
          <Main />
          <About />
          <Skills />
          <Projects />
          <Contact />
        </>
      )}
    </>
  );
}

import { doc, onSnapshot } from 'firebase/firestore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AiOutlineClose, AiOutlineMail, AiOutlineMenu } from 'react-icons/ai';
import { BsPersonLinesFill } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { db } from '../firebase/firebase';
import { useAuth } from '../pages/api/authContext';
import { userProps } from '../types/type';

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [shadow, setShadow] = useState(false);
  const [show, setShow] = useState(false);
  const [navBg, setNavBg] = useState('#ecf0f3');
  const [navLinkColor, setNavLinkColor] = useState('#1f2937');
  const [navLinkHoverBg, setNavHoverBg] = useState('bg-gray-200');
  const [currUser, setCurrUser] = useState<userProps>();
  const [isHovering, setIsHovering] = useState({
    home: false,
    about: false,
    skills: false,
    projects: false,
    contact: false,
    users: false,
  });
  const { currentUser, loading, logout } = useAuth();
  const router = useRouter();
  useEffect(() => {
    onSnapshot(doc(db, 'users', `${currentUser?.uid}`), (doc) => {
      setCurrUser(doc.data() as userProps);
    });
  }, [currentUser]);

  useEffect(() => {
    if (
      router.asPath === '/property' ||
      router.asPath === '/netflix' ||
      router.asPath === '/twitch' ||
      router.asPath === '/crypto'
    ) {
      setNavBg('transparent');
      setNavLinkColor('#ecf0f3');
      setNavHoverBg('#1e293b');
    } else {
      setNavBg('#ecf0f3');
      setNavLinkColor('#1f2937');
      setNavHoverBg('#e5e7eb');
    }
  }, [router]);

  const handleNav = () => {
    setNav(!nav);
  };

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY >= 90) {
        setShadow(true);
      } else {
        setShadow(false);
      }
    });
  }, []);

  const handleMouseEnter = (state: string) => {
    setIsHovering((prev) => ({
      ...prev,
      [state]: true,
    }));
  };

  const handleMouseLeave = (state: string) => {
    setIsHovering((prev) => ({
      ...prev,
      [state]: false,
    }));
  };

  return (
    <div
      style={{ background: `${navBg}` }}
      className={`fixed w-full h-20 ${
        shadow ? 'shadow-xl' : 'shadow-none'
      } z-50`}
    >
      <div className="flex justify-between items-center w-full h-full px-2 2xl:px-16">
        <Link href="/">
          <Image
            src="/../public/assets/navLogo.png"
            alt="/"
            width={50}
            height={5}
            priority
            className="w-auto h-auto"
          />
        </Link>
        <div>
          <ul
            style={{ color: `${navLinkColor}` }}
            className={`hidden md:flex items-center justify-center`}
          >
            <Link href="/" className="">
              <li
                style={{
                  background: isHovering.home
                    ? `${navLinkHoverBg}`
                    : 'transparent',
                }}
                onMouseEnter={() => handleMouseEnter('home')}
                onMouseLeave={() => handleMouseLeave('home')}
                className={`text-sm uppercase px-4 py-2 rounded-lg`}
              >
                Home
              </li>
            </Link>
            <Link href="/#about">
              <li
                style={{
                  background: isHovering.about
                    ? `${navLinkHoverBg}`
                    : 'transparent',
                }}
                onMouseEnter={() => handleMouseEnter('about')}
                onMouseLeave={() => handleMouseLeave('about')}
                className="text-sm uppercase hover:bg-gray-200 px-4 py-2 rounded-lg"
              >
                About
              </li>
            </Link>
            <Link href="/#skills">
              <li
                style={{
                  background: isHovering.skills
                    ? `${navLinkHoverBg}`
                    : 'transparent',
                }}
                onMouseEnter={() => handleMouseEnter('skills')}
                onMouseLeave={() => handleMouseLeave('skills')}
                className="text-sm uppercase hover:bg-gray-200 px-4 py-2 rounded-lg"
              >
                Skills
              </li>
            </Link>
            <Link href="/#projects">
              <li
                style={{
                  background: isHovering.projects
                    ? `${navLinkHoverBg}`
                    : 'transparent',
                }}
                onMouseEnter={() => handleMouseEnter('projects')}
                onMouseLeave={() => handleMouseLeave('projects')}
                className="text-sm uppercase hover:bg-gray-200 px-4 py-2 rounded-lg"
              >
                Projects
              </li>
            </Link>
            <Link href="/#contact">
              <li
                style={{
                  background: isHovering.contact
                    ? `${navLinkHoverBg}`
                    : 'transparent',
                }}
                onMouseEnter={() => handleMouseEnter('contact')}
                onMouseLeave={() => handleMouseLeave('contact')}
                className="text-sm uppercase hover:bg-gray-200 px-4 py-2 rounded-lg"
              >
                Contact
              </li>
            </Link>
            {/* <Link href="/users">
              <li
                style={{
                  background: isHovering.users
                    ? `${navLinkHoverBg}`
                    : 'transparent',
                }}
                onMouseEnter={() => handleMouseEnter('users')}
                onMouseLeave={() => handleMouseLeave('users')}
                className="text-sm uppercase hover:bg-gray-200 px-4 py-2 rounded-lg"
              >
                users
              </li>
            </Link> */}
            {!currentUser && !loading ? (
              <>
                <Link href="/signin" className="mr-4">
                  <li className="">
                    <button
                      className={`w-full p-2 text-gray-100 ${
                        navBg === 'transparent' ? 'shadow-black' : ''
                      }`}
                    >
                      Sign In
                    </button>
                  </li>
                </Link>
                <Link href="/signup">
                  <li className="">
                    <button
                      className={`w-full p-2 text-gray-100 ${
                        navBg === 'transparent' ? 'shadow-black' : ''
                      }`}
                    >
                      Get Started
                    </button>
                  </li>
                </Link>
              </>
            ) : (
              <div
                className="relative"
                onClick={() => {
                  setShow(!show);
                }}
              >
                <div className="flex justify-center items-center mx-2 cursor-pointer">
                  <CgProfile className="mx-2 mt-1 text-xl m-auto " />
                  <p className="font-semibold">{currUser?.firstName}</p>
                </div>
                {show && (
                  <ul className="absolute text-black top-12 right-2 bg-themebg-100 shadow-lg rounded-lg text-md pr-2 w-40 p-2 py-3">
                    <Link href="/profile">
                      <li className="hover:bg-slate-200 pl-2 rounded-sm mb-1">
                        Profile
                      </li>
                    </Link>
                    <li
                      className="hover:bg-slate-200 pl-2 rounded-sm"
                      onClick={() => {
                        logout();
                        router.push('/signin');
                      }}
                    >
                      Log Out
                    </li>
                  </ul>
                )}
              </div>
            )}
          </ul>
          <div className="md:hidden cursor-pointer" onClick={handleNav}>
            <AiOutlineMenu
              size={25}
              color={navBg === 'transparent' ? 'white' : 'black'}
            />
          </div>
        </div>

        <div
          className={
            nav
              ? 'fixed left-0 top-0 w-full h-screen bg-black/70 md:hidden'
              : 'hidden'
          }
        >
          <div
            className={
              'slideInLeft fixed top-0 w-3/4 sm:w-3/5 md:w-[45%] h-screen bg-nav_items sm:py-8 py-4 px-10 ease-in'
            }
          >
            <div>
              <div className="w-full flex items-center justify-between">
                <Image
                  src="/../public/assets/navLogo.png"
                  alt="/"
                  width={70}
                  height={35}
                  priority
                />
                <div
                  className="rounded-full shadow-md shadow-gray-400 p-3 cursor-pointer"
                  onClick={handleNav}
                >
                  <AiOutlineClose />
                </div>
              </div>
              <div className="border-b border-gray-300 my-4">
                <p className="w-10/12 md:w-11/12 py-4">
                  lets build something legendary togethor
                </p>
              </div>
            </div>
            <div className="py-4 flex flex-col">
              <ul className="">
                <Link href="/">
                  <li
                    onClick={() => setNav(false)}
                    className="text-sm uppercase hover:bg-gray-200 px-4 py-3 my-1 rounded-lg"
                  >
                    Home
                  </li>
                </Link>
                <Link href="/#about">
                  <li
                    onClick={() => setNav(false)}
                    className="text-sm uppercase hover:bg-gray-200 px-4 py-3 my-1 rounded-lg"
                  >
                    About
                  </li>
                </Link>
                <Link href="/#skills">
                  <li className="text-sm uppercase hover:bg-gray-200 px-4 py-3 my-1 rounded-lg">
                    Skills
                  </li>
                </Link>
                <Link href="/#projects">
                  <li
                    onClick={() => setNav(false)}
                    className="text-sm uppercase hover:bg-gray-200 px-4 py-3 my-1 rounded-lg"
                  >
                    Projects
                  </li>
                </Link>
                <Link href="/#contact">
                  <li
                    onClick={() => setNav(false)}
                    className="text-sm uppercase hover:bg-gray-200 px-4 py-3 my-1 rounded-lg"
                  >
                    Contact
                  </li>
                </Link>
              </ul>
              <div className="pt-40">
                <p className="uppercase tracking-widest text-basic-200">
                  lets connect
                </p>
                <div className="flex items-center justify-between my-4 w-full sm:w-4/5">
                  <div className="contact-icons">
                    <FaLinkedinIn />
                  </div>
                  <div className="contact-icons">
                    <FaGithub />
                  </div>
                  <div className="contact-icons">
                    <AiOutlineMail />
                  </div>
                  <div className="contact-icons">
                    <BsPersonLinesFill />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;

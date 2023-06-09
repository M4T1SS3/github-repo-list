"use client"
// Necessary React imports.
import { ChangeEvent, FormEvent, useState, useEffect } from 'react';

// Framer-motion for animations.
import { motion } from "framer-motion";

// Axios for API requests.
import axios from 'axios';

// Next.js components for image and link handling.
import Image from 'next/image';
import Link from 'next/link';

// Imported SVGs
import Bg from '../assets/bg.png'
import Logo from '../assets/logo.svg'
import Search from '../assets/search.svg'
import Arrow from '../assets/arrow.svg'
import Delete from '../assets/delete.svg';

// Type definitions for user and repo.
interface User {
  avatar_url: string;
  html_url: string; // URL of the user's profile
  followers: number; // Number of followers
  following: number; // Number of people the user is following
}

interface Repo {
  id: number;
  name: string;
  html_url: string; // URL of the repository
  description: string; // Description of the repository
}

const Home: React.FC = () => {
  // States for input handling, fetched data, loading and error handling.
  const [nameInput, setNameInput] = useState<string>('');
  const [userName, setUserName] = useState<string>('')
  const [repos, setRepos] = useState<Repo[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const colors = ['#FFBE0B', '#FB5607', '#FF006E', '#8338EC', '#3A86FF']
  const cardWidth = 300
  const [screenWidth, setScreenWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1000); // 1000 is just a fallback value
  const [error, setError] = useState(false);

  useEffect(() => {
    const handleResizeAndReload = () => {
        // Resize logic here
        setScreenWidth(window.innerWidth);
  
        // Then force a reload
        window.location.reload();
    }

    // Add event listener
    if (typeof window !== 'undefined') {
        window.addEventListener('resize', handleResizeAndReload);
    }

    // Cleanup the event listener
    return () => {
        if (typeof window !== 'undefined') {
            window.removeEventListener('resize', handleResizeAndReload);
        }
    }
}, []);

  
  // Fetch user data from GitHub API
  const fetchUserData = async () => {
    try {
      const { data } = await axios.get<User>(`https://api.github.com/users/${nameInput}`);
      setUser(data);
      setUserName(nameInput);
      setError(false); // resetting error if fetch is successful
    } catch (error) {
      console.error(error);
      setError(true); // setting the error if the fetch fails
    }
  };

  // Fetch repos from GitHub API
  const fetchRepos = async () => {
    setLoading(true);
    try {
      await fetchUserData(); // fetch user data
      const { data } = await axios.get<Repo[]>(
        `https://api.github.com/users/${nameInput}/repos`
      );
      setRepos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission and fetch repos
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetchRepos();
  };

  // Framer-motion animation variants
  const containerVariants = {
    draggable: {
      cursor: "grabbing",
    },
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // delay between each item animation
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 }, // start slightly below
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }, // animate to final position
    
  };

  const containerVariantsStats = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.3, // this will delay the animation of each child by 0.3s
      },
    },
  };
  
  const statsVariants = {
    hidden: { opacity: 0, y: 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Render the component
  // Contains forms for input, display of fetched data, error handling, and animations.

  return (
    <main className={`h-screen overflow-x-hidden w-screen relative  ${user ? '' : 'grid place-items-center'}`}>
     <div className='z-10 relative w-full pb-8'>
        <div className={`flex ${user ? 'flex-row justify-between p-2' : 'flex-col justify-center items-center'} `}>
          {
            user ? 
              <a href="/">
              <Image src={Logo} alt='git hub logo' width={50} height={50} />
            </a> :
              <Image src={Logo} alt='git hub logo' width={160} height={160} />
          }
          {!user && <h1 className={`font-bold text-3xl sm:text-7xl mt-4 mb-8 sm:mb-16`}>Discover Repos.</h1>}
          <form onSubmit={handleSubmit} className="flex gap-x-2 items-center ">
            <div className="relative">
              <input
                className='h-12 rounded-md p-4 w-full sm:w-96 bg-slate-100 pl-10' // added some left padding to prevent text overlap
                type="text"
                value={nameInput}
                onChange={(event) => setNameInput(event.target.value)}
                placeholder="Enter GitHub username"
                required
              />
              {nameInput && (
                <button
                  type="button"
                  onClick={() => {setNameInput(''), setError(false)}}
                  className="absolute top-0 right-0 h-12 w-12 flex items-center justify-center p-4" // Added absolute positioning
                >
                  <Image src={Delete} alt="delete icon" />
                </button>
              )}
            </div>
            <button type="submit" className='w-12 h-12 bg-black rounded-lg p-2'>
              <Image src={Search} alt='search icon'/>
            </button>
          </form>
        </div>

  
        {loading ? (
  <p></p>
) : (
  <>
    {user && (
      <motion.div 
      className='text-center sm:mx-auto px-6 sm:w-1/4 sm:min-w-[400px]'
      variants={containerVariantsStats}
      initial="hidden"
      animate="show"
    >
      <motion.h2 
        className='text-4xl font-bold w-full my-6 leading-12'
        variants={statsVariants}
      >
        {userName}
      </motion.h2>
      <div className="grid grid-cols-5 grid-rows-1 gap-4 ">
        <motion.div 
          className="col-span-3 row-span-1  gap-4 w-8/6 cursor-pointer"
          variants={statsVariants}
        > 
          <img src={user.avatar_url} alt="User avatar" className="rounded-lg w-full h-auto object-cover" />
        </motion.div>
        <motion.div 
          className='col-span-2 row-span-1 grid gap-y-2'
          variants={statsVariants}
        >
          <div className=" bg-gray-100 p-2 rounded-lg grid place-items-center">
            <div>
              <p className='text-4xl font-bold'>{user.followers}</p>
              <p>Followers</p>
            </div>
          </div>
          <div className=" bg-gray-100 p-2 rounded-lg grid place-items-center">
            <div>
              <p className='text-4xl font-bold'>{user.following}</p>
              <p>Following</p>
            </div>
          </div>
        </motion.div>
      </div>
      <motion.div 
        className='w-full grid place-items-end mt-2'
        variants={statsVariants}
      >
        <motion.a whileHover={{scale: 1.06}} href={user.html_url} target="_blank" rel="noreferrer" className='grid place-items-center w-16 h-16 bg-black rounded-lg p-2'>
          <Image src={Arrow} alt="Go to profile" />
        </motion.a>
      </motion.div>
    </motion.div>
    )}
    
    {user && <p className='ml-2  mt-8 mb-2'>{repos.length + " Repositories"}</p>}
    <motion.div
      className="flex flex-row gap-4 ml-2"
      style={{
        width: `${repos.length * cardWidth}px`,
      }}
      initial="hidden"
      animate="show"
      variants={containerVariants}
      drag="x"
      dragConstraints={{
        left:
          repos.length * cardWidth + (repos.length - 1) * 16 <= screenWidth
            ? 0
            : screenWidth - (repos.length * cardWidth + repos.length * 16), //16 is the gap size,
        right: 0,
      }}
    >
      {repos.map((repo, index) => (
        <motion.div
          key={repo.id}
          style={{
            backgroundColor: colors[index % colors.length],
            minWidth: cardWidth,
            height: "335px",
            scrollSnapAlign: "center",
          }}
          className="rounded-lg grid place-items-center p-4 relative cursor-pointer"
          variants={item}
          animate={{ y: 0 }} // back to initial state when not hovering
          whileHover={{ y: -30 }} // up on hover
          transition={{ duration: 0.1 }} // apply this transition to all animations
        >
          <div className="h-8 w-8 absolute top-2 left-2 bg-black bg-opacity-20 flex justify-center items-center text-white rounded-lg p-2">
            {index + 1}
          </div>

          <div className="text-center">
            <h3 className="text-center font-bold text-2xl">{repo.name}</h3>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="underline text-black mt-2"
            >
              Open Repo
            </a>
          </div>
        </motion.div>
      ))}
    </motion.div>



      </>
    )}
    </div>

    {!user &&
      <div className="h-full absolute inset-0 z-0">
        <Image src={Bg} alt="gradient" className="object-cover object-center h-full w-full z-0" priority={true} />
      </div>
    }
     {(error === true && nameInput.length > 0) && (
        <motion.div
          initial={{ y: 0, opacity: 0 }} // initial state
          animate={{ y: -100, opacity: 1 }} // final state
          exit={{ y: 0, opacity: 0 }} // exit state
          transition={{ duration: 0.5 }} // transition over 0.5s
          className="absolute bottom-0 bg-black text-white w-7/8 p-4 text-center rounded-lg z-90"
        >
          No such user found.
        </motion.div>
      )}
  </main>

  );
}

export default Home;

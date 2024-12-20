import {Link} from 'react-router-dom'
import { useEffect, useState } from 'react'
import PostCard from '../components/PostCard'
import mainScreen from '../resources/img/screen.jpg'
import user1 from "../resources/img/user1.jpg"
import user2 from "../resources/img/user2.jpg"
import banner from "../resources/img/banner.jpg"
import { Button } from 'flowbite-react'

export default function Home() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getpost')
      const data = await res.json()
      setPosts(data.posts)
    }
    fetchPosts()
  }, [])
  return (
    <div className='pt-10'>
      <div className='relative'>
        <img src={mainScreen} className='w-full h-[840px]'/>
      
        <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto items-center justify-center text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black'>
          <h1 className='text-3xl font-bold lg:text-8xl '>Welcome to my Blog</h1>
          <p className='text-gray-900 text-lg sm:text-base'>
            Here you will find many articles and guides on the topic of plants, such as how to care for them and more details about the types of plants you are interested in.
          </p>
          <Link to='/search' className=''>
            <Button type='button' gradientDuoTone='tealToLime' className='rounded-3xl text-center'>
              View all posts
            </Button>
          </Link>
        </div>
      </div>

      <div className='flex flex-row max-w-6xl mx-auto py-20 gap-8 '>

        <div className='grid grid-cols-2 gap-6 flex-1'>
          <div className='flex flex-col text-center'>
            <img src={user1} alt="" className='w-full h-full object-cover rounded-lg'/>
            <h1 className='text-3xl text-gray-500 dark:text-white pt-3.5'>Vo Le Phuc Khang</h1>
            <p className='text-lg'>Member</p>
          </div>
          <div className='flex flex-col text-center'>
            <h1 className='text-3xl text-gray-500 dark:text-white'>Tran Huu Thong</h1>
            <p className='text-lg pb-3.5'>Leader</p>
            <img src={user2} alt="" className='w-full h-full object-cover rounded-lg'/>
          </div>
        </div>

        <div className='flex flex-col justify-center lg:text-left flex-1 gap-8'>
          <h1 className='text-7xl text-left'>Key Members</h1>
          <p className='text-lg text-gray-600 dark:text-white'>We are Vo Le Phuc Khang and Tran Huu Thong, two students from Vietnam - Korea University of Information and Communications Technology (VKU) with a passion for software engineering. Moving together to Software Engineering, we constantly learn and explore new technologies, to improve our skills and contribute to the development of the information technology industry. Our goal is to build smart, efficient and user-friendly applications, while looking for opportunities to cooperate and share knowledge with the domestic and foreign technology community.</p>
          <Link to='/about' className=''>
            <Button type='button' gradientDuoTone='tealToLime' className='rounded-3xl text-left'>
              About us
            </Button>
          </Link>
        </div>
      </div>

      <div className='relative'>
        <img src={banner} alt="" className='w-full h-[500px] object-cover'/>
        <span className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-7xl text-white text-center w-2/3'>
          Each flower carries its own mission as a soul blossoming in nature, bringing hope to life
        </span>
      </div>

      <div className='max-w-6xl mx-auto p-3 flex-col gap-8 py-7'>
        {
          posts && posts.length > 0 && (
            <div className='flex flex-col gap-6'>
              <h2 className='text-7xl text-center'>Our Article</h2>
              <span className='mx-24 text-center'>
                This is all of our blogs. We cover topics like gardening tips, plant care, and sustainable living. Our content is designed for both beginners and experienced gardeners. Whether you're into indoor plants, outdoor gardening, or eco-friendly practices, our blog has something for you. We update regularly to keep you informed and inspired.
              </span>
              <div className='flex flex-wrap gap-3'>
                {posts.map((post) => (
                  <PostCard key={post._id} post={post}/>
                ))}
              </div>
              <Link to={'/search'} className='text-lg text-teal-500 hover:underline text-center'>View all posts</Link>
            </div>
          )
        }
      </div>
    </div>
  )
}

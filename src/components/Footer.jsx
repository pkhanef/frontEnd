import { Footer } from 'flowbite-react'
import React from 'react'
import { Link } from 'react-router-dom'
import {BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble} from 'react-icons/bs'

export default function FooterCom() {
  return (
    <Footer container className='border border-t-8 border-teal-500'>
        <div className='w-full max-w-7xl mx-auto'>
            <div className='w-full sm:flex sm:items-center sm:justify-between'>
                    <Link to="/" className='self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white'>
                        <span className='px-2 py-1 bg-gradient-to-r from-teal-300 via-green-200 to-lime-300 rounded-lg text-slate-950 mr-1'>KaTo</span>
                        Flowers
                    </Link>
                <div className='flex gap-6 sm:mt-0 mt-4 sm:justify-center'>
                    <Footer.Icon href='https://www.facebook.com/vlp.khan19' icon={BsFacebook}/>
                    <Footer.Icon href='https://www.instagram.com/_khan.2801/' icon={BsInstagram}/>
                    <Footer.Icon href='https://www.facebook.com/vlp.khan19' icon={BsTwitter}/>
                    <Footer.Icon href='https://github.com/khanef' icon={BsGithub}/>
                    <Footer.Icon href='https://www.facebook.com/vlp.khan19' icon={BsDribbble}/>
                </div>
            </div>
        </div>
    </Footer>
  )
}

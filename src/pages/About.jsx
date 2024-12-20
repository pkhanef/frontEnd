import React from 'react'
import aboutImg from "../resources/img/about.jpg"
import { HiCheck } from "react-icons/hi";

export default function About() {
  return (
    <div className='min-h-screen flex items-center justify-center flex flex-col gap-4 py-10 pt-20'>
      <div className='max-w-4xl mx-auto text-center '>
        <h1 className='text-5xl font-semibold text-center my-7'>Who are we</h1>
        <p className='text-md text-gray-500 flex flex-col gap-6 pb-4'>
          Are you a tree enthusiast who loves taking care of and looking at lush green potted plants? Or do you simply want to find a cool green space for your home? Khan's Blog is the ideal place for you, a green world full of knowledge and experience about ornamental plants.
        </p>
      </div>
      <div className='flex flex-row gap-8 max-w-5xl'>
        <img src={aboutImg} alt="" className='w-1/2 max-w-xl max-h-80'/>
        <div className='flex flex-col w-1/2 justify-center'>
          <h1 className='text-3xl font-bold mb-4 dark:text-gray-200'>Why choose us?</h1>
          <span className='text-md text-gray-500 flex flex-col gap-6 pb-4'>
            People choose me because I bring the value and difference they seek. I have the ability to listen, sincerity and knowledge that they appreciate. My positive energy and confidence also attract others, making them want to connect and collaborate. Therefore, this relationship is often a natural outcome, where I become someone they feel they can learn from and share with.
          </span>
          <div>
            <div className='flex flex-row gap-3 dark:text-gray-200'>
              <HiCheck className='text-gray-400 dark:text-gray-200 mt-1 border border-teal-500 rounded-3xl'/>
              <span className='text-gray-400 dark:text-gray-350'>You can find all information about a certain flower</span>
            </div>
            <div className='flex flex-row gap-3'>
              <HiCheck className='text-gray-400 dark:text-gray-200 mt-1 border border-teal-500 rounded-3xl'/>
              <span className='text-gray-400 dark:text-gray-350'>Supports summary text for easy access to articles</span>
            </div>
            <div className='flex flex-row gap-3'>
              <HiCheck className='text-gray-400 dark:text-gray-200 mt-1 border border-teal-500 rounded-3xl'/>
              <span className='text-gray-400 dark:text-gray-350'>Chatbot support to look up information about blogs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

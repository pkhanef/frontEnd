import {Sidebar} from 'flowbite-react'
import {HiAnnotation, HiArrowSmRight, HiChartPie, HiDocumentText, HiOutlineUserGroup, HiUser, HiFolderAdd, HiOutlineAdjustments} from 'react-icons/hi'
import { useEffect, useState } from 'react'
import {Link, useLocation} from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { SignoutSuccess } from '../redux/user/userSlice'

export default function DashSidebar() {
    const location = useLocation()
    const dispatch = useDispatch()
    const [tab, setTab] = useState('')
    const { currentUser } = useSelector((state) => state.user)
    const BE_API = import.meta.env.VITE_BE_API_URL;
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const tabFromUrl = urlParams.get('tab')
        if(tabFromUrl) {
        setTab(tabFromUrl)
        }
    }, [location.search])

    const handleSignout = async () => {
        try {
            const res = await fetch(`${BE_API}api/user/signout`, {
                method: 'POST'
            })
            const data = await res.json()
            if(!res.ok){
                console.log(data.message)
            }else{
                dispatch(SignoutSuccess())
            }
        } catch (error) {
            console.log(error.message)
        }
    }
  return (
    <Sidebar className='w-full md:w-56 pt-14'>
        <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-col gap-1'>
                {
                    currentUser && currentUser.isAdmin && (
                        <Link to='/dashboard?tab=dash'>
                            <Sidebar.Item active={tab === 'dash' || !tab} icon={HiChartPie} as='div'>
                                DashBoard
                            </Sidebar.Item>
                        </Link> 
                    )
                }
                <Link to='/dashboard?tab=profile'>
                    <Sidebar.Item active={tab === 'profile'} icon={HiUser} label={currentUser.isAdmin ? 'Admin' : 'User'} labelColor='dark' as='div'>
                        Profile
                    </Sidebar.Item>
                </Link>
                {
                    currentUser.isAdmin && (
                        <Link to='/dashboard?tab=posts'>
                            <Sidebar.Item active={tab === 'posts'} icon={HiDocumentText} as='div'>
                                Posts
                            </Sidebar.Item>
                        </Link>
                    )
                }
                {
                    currentUser.isAdmin && (
                        <>
                        <Link to='/dashboard?tab=users'>
                            <Sidebar.Item active={tab === 'users'} icon={HiOutlineUserGroup} as='div'>
                                Users
                            </Sidebar.Item>
                        </Link>
                        <Link to='/dashboard?tab=comments'>
                            <Sidebar.Item active={tab === 'comments'} icon={HiAnnotation} as='div'>
                                Comments
                            </Sidebar.Item>
                        </Link>
                        <Link to='/dashboard?tab=chatbot'>
                            <Sidebar.Item active={tab === 'chatbot'} icon={HiFolderAdd} as='div'>
                                Chatbot
                            </Sidebar.Item>
                        </Link>
                        <Link to='/dashboard?tab=prompt'>
                            <Sidebar.Item active={tab === 'prompt'} icon={HiOutlineAdjustments} as='div'>
                                Prompt
                            </Sidebar.Item>
                        </Link>
                        </>
                    )
                }
                <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer' onClick={handleSignout}>
                    Sign Out
                </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
    </Sidebar>
  )
}

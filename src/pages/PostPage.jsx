import { useEffect, useState } from 'react'
import {Link, useParams} from 'react-router-dom'
import {Button,Modal, Spinner, Textarea} from 'flowbite-react'
import CallToAction from '../components/CallToAction'
import CommentSection from '../components/CommentSection'
import {useSelector} from 'react-redux'
import PostCard from '../components/PostCard'

export default function PostPage() {
    const {postSlug} = useParams()
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [post, setPost] = useState(null)
    const [recentPosts, setRecentPosts] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [summary, setSummary] = useState("");
    const API_SUMMARY_URL = import.meta.env.VITE_API_SUMMARY_URL;
    const BE_API = import.meta.env.VITE_BE_API_URL;
    const { currentUser } = useSelector(state => state.user);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true)
                const res = await fetch(`${BE_API}api/post/getpost?slug=${postSlug}`)
                const data = await res.json()
                if(!res.ok){
                    setError(true)
                    setLoading(false)
                    return
                }
                if(res.ok){
                    setPost(data.posts[0])
                    setLoading(false)
                    setError(null)
                }
            } catch (error) {
                setError(true)
                setLoading(false)
            }
        }
        fetchPost()
    }, [postSlug])

    useEffect(() => {
        try {
            const fetchRecentPosts = async () => {
                const res = await fetch(`${BE_API}api/post/getpost?limit=3`)
                const data = await res.json()
                if(res.ok){
                    setRecentPosts(data.posts)
                }
            }

            fetchRecentPosts()
        } catch (error) {
            console.log(error.message);
            
        }
    },[])

    const handleSummaryPost = async () => {
        try {
            const res = await fetch(API_SUMMARY_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ dialogue: plainText }), 
            });
            const data = await res.json();
            console.log("Response:", data);
            if (!res.ok) {
                console.log(data.message);
                return;
            }
            
            setSummary(data.summary);
        } catch (error) {
            console.log(error.message);
        }
    };

    if(loading) return (
        <div className='flex justify-center items-center min-h-screen'>
            <Spinner size='xl' />
        </div>
    )
    const plainText = post.content.replace(/<\/?[^>]+(>|$)/g, "");
  return (
    <main className='p-3 flex flex-col max-w-9xl mx-auto min-h-screen pt-20'>
        <div className='flex flex-row relative'>
            <div className='w-2/3 min-h-screen '>  
                <img src={post && post.image} alt={post && post.title} className='p-5 max-h-[600px] w-full object-cover'/>
                <h1 className='text-3xl mt-5 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>{post && post.title}</h1>
                <div className="flex justify-center w-full">
                    <Button
                        color="gray"
                        pill
                        size="xs"
                        className="text-center"
                    >
                        <span onClick={() => setShowModal(true)}>
                            Summary now
                        </span>
                    </Button>
                </div>
                <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs '>
                    <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className='italic'>{post && (post.content.length / 1000).toFixed(0)} mins read</span>
                </div>
                <div className='p-3 max-w-6xl mx-auto w-full justify-center items-center post-content text-justify' dangerouslySetInnerHTML={{__html: post && post.content}}>

                </div>           
                <CommentSection postId={post._id} />
                <div className='flex flex-col justify-center items-center mb-5'>
                    <h1 className='text-xl mt-5'>Recent articales</h1>
                    <div className='flex  gap-5 mt-5 justify-center'>
                        {
                            recentPosts && recentPosts.map((post) => 
                                <PostCard key={post._id} post={post}/>
                            )
                        }
                    </div>
                </div>
            </div>
            <div className='mt-3 w-1/3 h-full fixed z-10 top-13 right-3'>
                <CallToAction post={post}/>
            </div>
        </div>
        <Modal show={showModal} onClose={() => setShowModal(false)} size="8xl">
            <Modal.Body className="flex flex-row gap-8">
                <div className="w-full flex flex-col gap-2 ">
                    <h1 className='text-center'>Current Blog</h1>
                    <Textarea value={plainText} className='h-[500px]' readOnly/>
                </div>
                <div className="w-full  flex flex-col gap-2 ">
                    <h1 className='text-center'>Summary Blog</h1>
                    <Textarea value={summary}  className='h-[500px]' readOnly/>
                </div>
            </Modal.Body>
            <Modal.Footer className='flex justify-center gap-4'>
                <Button color='success' onClick={handleSummaryPost}>Summary Now</Button> 
                <Button color="gray" onClick={() => setShowModal(false)}>
                    No, cancel
                </Button>   
            </Modal.Footer>
        </Modal>                                                                                                    
    </main>
  )
}

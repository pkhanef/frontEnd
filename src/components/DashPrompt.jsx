import { Alert, Button, Textarea, TextInput, Table } from 'flowbite-react';
import { useState, useEffect } from 'react';
import {useSelector} from 'react-redux'

export default function DashPrompt() {
  const {currentUser} = useSelector((state) => state.user)
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [prompts, setPrompts] = useState([])
  const API_CUSTOM_URL = import.meta.env.VITE_API_CUSTOM_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/chatbot/custom-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      const customRes = await fetch(API_CUSTOM_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: formData.prompt }),
      });

      const customData = await customRes.json();

      if (!customRes.ok) {
        setPublishError(customData.message);
        return;
      }

      setPublishError(null);
    } catch (error) {
      setPublishError('Something went wrong');
    }
  };

  useEffect(() => {
    const fetchPrompt = async () => {
      if (!currentUser || !currentUser.isAdmin) return; 
  
      try {
        const res = await fetch(`/api/chatbot/prompt`);
        const data = await res.json();
        if (res.ok && Array.isArray(data)) { 
          setPrompts(data); 
        } else {
          console.error('Invalid data format:', data); 
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchPrompt();
  }, [currentUser]);

  return (
    <div className="p-3 max-w-7xl mx-auto min-h-screen pt-20">
      <h1 className="text-center text-3xl my-7 font-semibold">Custom Prompt</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <TextInput
          type='text'
          placeholder='Title'
          required
          id='title'
          onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
        />
        <Textarea
          theme='snow'
          placeholder='Write something...'
          className='h-72 max-w-full'
          required
          onChange={(e) => setFormData({ ...formData, prompt: e.target.value })} 
        />
        <Button type='submit' gradientDuoTone='tealToLime'>Publish</Button>
        {publishError && <Alert className='mt-5' color='failure'>{publishError}</Alert>}
      </form>
      <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
        {
          currentUser.isAdmin && prompts.length > 0 ? (
            <>
              <Table hoverable className='shadow-md'>
                <Table.Head>
                  <Table.HeadCell>Data updated</Table.HeadCell>
                  <Table.HeadCell>file</Table.HeadCell>
                  <Table.HeadCell>title</Table.HeadCell>
                  <Table.HeadCell>UserId</Table.HeadCell>
                </Table.Head>
                {prompts.map((prompt) => (
                  <Table.Body className='devide-y' key={prompt._id}>
                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                      <Table.Cell>
                        {new Date(prompt.createdAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>
                        {prompt.prompt ? (
                          prompt.prompt.length > 30 ? `${prompt.prompt.substring(0, 30)}...` : prompt.prompt
                        ) : (
                          'No prompt'
                        )}
                      </Table.Cell>
                      <Table.Cell>{prompt.title}</Table.Cell>
                      <Table.Cell>{prompt.userId}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))}
              </Table>
            </>
          ) : (
            <p>You have no data prompt yet!!!</p>
          )
        }
      </div>
    </div>
  );
}
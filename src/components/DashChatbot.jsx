import { useState, useEffect } from 'react';
import {useSelector} from 'react-redux'
import { Button, FileInput, Alert, TextInput, Table } from 'flowbite-react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '../firebase';
import {getAccessTokenFromCookie} from "../authUtils"

export default function FileUpload() {
  const {currentUser} = useSelector((state) => state.user)
  const [chatbots, setChatbots] = useState([])
  console.log(chatbots)
  const [file, setFile] = useState(null);
  const [fileUploadProgress, setFileUploadProgress] = useState(null);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [fileURL, setFileURL] = useState(null);
  const [formData, setFormData] = useState({ title: '', file: null });
  const token = getAccessTokenFromCookie()
  const API_IMPORT_URL = import.meta.env.VITE_API_IMPORT_URL;
  const BE_API = import.meta.env.VITE_BE_API_URL;

  const handleUploadFile = async () => {
    try {
      if (!file) {
        setFileUploadError('Please select a file');
        return;
      }

      setFileUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, `import_data/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setFileUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setFileUploadError('File upload failed');
          setFileUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setFileUploadProgress(null);
            setFileUploadError(null);
            setFileURL(downloadURL);
            // Cập nhật formData với file URL
            setFormData((formData) => ({ ...formData, file: downloadURL }));
          });
        }
      );
    } catch (error) {
      setFileUploadError('File upload failed');
      setFileUploadProgress(null);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res1 = await fetch(`${BE_API}api/chatbot/import-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData)
      });

      const data1 = await res1.json();
      if (!res1.ok) {
        setFileUploadError(data1.message);
        return;
      }

      const formDataToSend = new FormData();
      if (file) {
        formDataToSend.append('file', file); 
      } else {
        setFileUploadError('Please select a file');
        return;
      }

      const res2 = await fetch(API_IMPORT_URL, {
        method: 'POST',
        body: formDataToSend
      });

      const data2 = await res2.json();
      if (!res2.ok) {
        setFileUploadError(data2.message);
        return;
      }

      setFileUploadError(null);
    } catch (error) {
      setFileUploadError('Something went wrong');
    }
  };

  useEffect(() => {
    const fetchChatbots = async () => {
      if (!currentUser  || !currentUser .isAdmin) return;
  
      try {
        const res = await fetch(`${BE_API}api/chatbot/data`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
          setChatbots(data); 
          console.error('Invalid data format:', data); 
        }
      } catch (error) {
        console.log(error);
      }
    };
  
    fetchChatbots();
  }, [currentUser ]);

  return (
    <div className="p-3 max-w-7xl mx-auto min-h-screen pt-20">
      <h1 className="text-center text-3xl my-7 font-semibold">Import Data for ChatBot</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <TextInput
            type='text'
            placeholder='Title'
            required
            id='title'
            onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
          />
          <div className="flex gap-4 items-center justify-between border-1 border-teal-500 border p-3">
            <FileInput
              type="file"
              accept=".docx,.txt,.pdf" 
              onChange={(e) => setFile(e.target.files[0])}
              className='w-64'
            />
            <Button
              type="button"
              gradientDuoTone="tealToLime"
              size="sm"
              outline
              onClick={handleUploadFile}
              disabled={fileUploadProgress}
            >
              {fileUploadProgress ? `${fileUploadProgress}%` : 'Upload File'}
            </Button>
          </div>
          {fileUploadError && <Alert color="failure">{fileUploadError}</Alert>}
          {fileURL && (
            <a href={fileURL} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              View Uploaded File
            </a>
          )}
        </div>
        <Button type='submit' gradientDuoTone='tealToLime'>Import</Button>
      </form>
      <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
        {
          currentUser.isAdmin && chatbots.length > 0 ? (
            <>
              <Table hoverable className='shadow-md'>
                <Table.Head>
                  <Table.HeadCell>Data updated</Table.HeadCell>
                  <Table.HeadCell>file</Table.HeadCell>
                  <Table.HeadCell>title</Table.HeadCell>
                  <Table.HeadCell>UserId</Table.HeadCell>
                </Table.Head>
                {chatbots.map((chatbot) => (
                  <Table.Body className='devide-y' key={chatbot._id}>
                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                      <Table.Cell>
                        {new Date(chatbot.createdAt).toLocaleDateString()}
                      </Table.Cell>
                      <Table.Cell>
                        {chatbot.file ? (
                          chatbot.file.length > 30 ? `${chatbot.file.substring(0, 30)}...` : chatbot.file
                        ) : (
                          'No file'
                        )}
                      </Table.Cell>
                      <Table.Cell>{chatbot.title}</Table.Cell>
                      <Table.Cell>{chatbot.userId}</Table.Cell>
                    </Table.Row>
                  </Table.Body>
                ))}
              </Table>
            </>
          ) : (
            <p>You have no data chatbot yet!!!</p>
          )
        }
      </div>
    </div>
  );
}
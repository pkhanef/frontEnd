import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector} from 'react-redux'
import { SignInStart, SignInSuccess, SignInFailure } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({})
  const {loading, error: errorMessage} = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const BE_API = import.meta.env.VITE_BE_API_URL;
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!formData.email || !formData.password){
      return dispatch(SignInFailure('Please fill out all fields.'))
    }
    try {
      dispatch(SignInStart())
      console.log(BE_API);
      const res = await fetch(`${BE_API}api/auth/signin`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if(data.success === false){
        dispatch(SignInFailure(data.message))
      }
      if(res.ok){
        dispatch(SignInSuccess(data))
        navigate('/')
      }
    } catch (error) {
      dispatch(SignInFailure(error.message))
    }
  }
  return (
    <div className="min-h-screen pt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/*left*/}
        <div className="flex-1">
          <Link to="/" className='font-bold dark:text-white text-4xl'>
              <span className='px-2 py-1 bg-gradient-to-r from-teal-300 via-green-200 to-lime-300 rounded-lg text-white'>Khan's</span>
              Blog
          </Link>
          <p className="text-sm mt-5">This is a demo project. You can sign in with your email and password or with Google.</p>
        </div>
        {/*right*/}
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your email"/>
              <TextInput type="email" placeholder="nickname@gmail.com" id="email" onChange={handleChange}/>
            </div> 
            <div>
              <Label value="Your password"/>
              <TextInput type="password" placeholder="************" id="password"  onChange={handleChange}/>
            </div>
            <Button gradientDuoTone='tealToLime' type="submit" disabled={loading}>
              {
                loading ? (
                  <>
                    <Spinner size='sm'/>
                    <span className="pl-3">Loading...</span>
                  </>
                ) : 'Sign In'
              }
            </Button>
            <OAuth />          
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account?</span>
            <Link to='/sign-up' className="text-blue-500">
              Sign Up
            </Link>
          </div>
          {
            errorMessage && (
              <Alert className="mt-5" color='failure'>
                {errorMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  )
}

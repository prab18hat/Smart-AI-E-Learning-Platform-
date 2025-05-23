import React from 'react'
import { useNavigate } from 'react-router-dom';
import './home.css';
import Testimonials from '../../components/testimonials/Testimonials';

const Home = () => {
    const navigate  = useNavigate();
  return (
  <div>
    <div className='home'>
   <div className='home-content'>
    <h1>Welcome to CoddyCulture</h1>
    <p>Learn to code from anywhere</p>
    <button onClick={()=>navigate("/courses")} className='common-btn'>Get Started</button>
    </div>
    <Testimonials/>
 
    </div>
    </div>
  );
};

export default Home

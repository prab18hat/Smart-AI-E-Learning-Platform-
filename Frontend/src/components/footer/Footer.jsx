import React from 'react';
import './footer.css';
import { AiFillFacebook, AiFillTwitterSquare, AiFillInstagram, AiFillLinkedin } from 'react-icons/ai';

const Footer = () => {
  return (
  <footer>
   <div className='footer-content'>
              <p>
                  &copy; 2024 CoddyCulture. All rights reserved. <br /> Made
                  with ❤️ <a href="">Prabhat Mishra</a>
              </p>
              <div className="social-links">
                  <a href="https://www.facebook.com/profile.php?id=100091275742119" target='_blank'>
                      <AiFillFacebook />
                  </a>
                  <a href="">
                      <AiFillTwitterSquare />
                  </a>
                  <a href="https://www.instagram.com/coddyculture/" target='_blank'>
                      <AiFillInstagram />
                  </a>
                  <a href="https://www.linkedin.com/company/coddyculture/?viewAsMember=true" target='_blank'>
                      <AiFillLinkedin />
                  </a>
              </div>





            </div>

  </footer>
  );
};

export default Footer
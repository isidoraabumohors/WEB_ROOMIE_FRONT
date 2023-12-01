import React, { useState, useEffect } from 'react';
import './Slideshow.css';

import background1 from './assets/background/background1.jpg';
import background2 from './assets/background/background2.jpg';
import background3 from './assets/background/background3.jpg';
import background4 from './assets/background/background4.jpg';
import background5 from './assets/background/background5.jpg';
import background6 from './assets/background/background6.jpg';
import background7 from './assets/background/background7.jpg';
import background8 from './assets/background/background8.jpg';


const Slideshow = () => {

  // Set the default state of the index to 0
  const [currentIndex, setCurrentIndex] = useState(0);

  // Define your array of images
  const images = [
    background1,
    background2,
    background3,
    background4,
    background5,
    background6,
    background7,
    background8
  ];

  // useEffect to automatically advance the slide at a specified interval
  useEffect(() => {
    // Set up an interval to change the slide
    const interval = setInterval(() => {
      // Advance to the next slide (looping back to the beginning if needed)
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change slide every 3 seconds (adjust as needed)

    // Clean up the interval when the component unmounts to prevent memory leaks
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="slideshow">
      {/* Render the current slide based on the currentIndex */}
      <img
        src={images[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className="slide-image"
      />
      {/* You can add additional content or styling for the slide here */}
    </div>
  );
};

export default Slideshow;






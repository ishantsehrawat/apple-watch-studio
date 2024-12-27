import React, { useState, useRef, useEffect } from "react";
import { loader } from "../assets/images";

const SizeCarousel = ({
  productData,
  selectedWatch,
  section,
  setSelectedWatch,
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Ref for the carousel container
  const carouselRef = useRef(null);

  // Ref to store references to all buttons
  const buttonRefs = useRef([]);

  const handleSelectSize = (e, idx) => {
    console.log(idx);
    setSelectedIndex(idx);
    if (carouselRef.current && buttonRefs.current[idx]) {
      const button = buttonRefs.current[idx];
      const container = carouselRef.current;

      // Calculate the position to scroll to
      const buttonLeft = button.offsetLeft;
      const buttonWidth = button.offsetWidth;
      const containerWidth = container.offsetWidth;

      // Calculate the scroll position to center the button
      const scrollPosition = buttonLeft - containerWidth / 2 + buttonWidth / 2;

      // Smoothly scroll using motion's scroll animation
      setScrollPosition(0 - scrollPosition);
    }
    setSelectedWatch(productData[idx]);
  };

  const handleScroll = () => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.offsetWidth;

      let closestIndex = 0;
      let closestDistance = Infinity;

      buttonRefs.current.forEach((button, idx) => {
        const buttonLeft = button.offsetLeft;
        const buttonWidth = button.offsetWidth;
        const buttonCenter = buttonLeft + buttonWidth / 2;
        const containerCenter = scrollLeft + containerWidth / 2;
        const distance = Math.abs(buttonCenter - containerCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = idx;
        }
      });

      console.log(closestIndex);

      handleSelectSize(null, closestIndex);
    }
  };

  useEffect(() => {
    console.log(productData);
    let index = productData.findIndex((product) => product === selectedWatch);
    handleSelectSize(null, index);
  }, [selectedWatch, productData]);

  if (!productData || productData.length === 0) {
    return (
      <div className="absolute left-[50%] z-10 top-[-200px] -translate-x-1/2">
        <img className="animate-spin" src={loader} alt="loading" />
      </div>
    );
  }

  return (
    <div className="w-screen overflow-x-hidden overflow-y-visible translate-y-[-80%]">
      <div className="w-[500px] h-[500px] absolute top-0 left-1/2 -translate-x-1/2">
        {section === "case" && (
          <img
            className="z-0"
            src={productData[selectedIndex]?.watchbandImage.srcSet.src}
            alt={productData[selectedIndex]?.watchbandImage.alt}
          />
        )}
      </div>
      <div
        className="w-screen overflow-x-scroll overflow-y-visible"
        onScroll={handleScroll}
      >
        <div
          ref={carouselRef}
          className=" overflow-x-visible"
          style={{
            display: "flex",

            paddingBottom: "1rem",
            scrollSnapType: "x mandatory",
            transform: `translateX(${scrollPosition}px) `,
            transition: "transform 0.3s ease-in-out",
          }}
        >
          {productData.map((product, idx) => (
            <button
              key={idx}
              onClick={(e) => handleSelectSize(e, idx)}
              className="w-[350px] flex justify-center items-center"
            >
              <div
                ref={(el) => (buttonRefs.current[idx] = el)}
                style={{
                  scrollSnapAlign: "center",
                  flexShrink: 0,
                  width: "500px",
                  height: "500px",
                  position: "relative",
                }}
              >
                {section !== "bands" && (
                  <img
                    className="absolute top-0 left-0 z-30"
                    src={product?.watchcaseImage.srcSet.src}
                    alt={product?.watchcaseImage.alt}
                  />
                )}
                {section !== "case" && (
                  <img
                    className="absolute top-0 left-0 z-1"
                    src={product?.watchbandImage.srcSet.src}
                    alt={product?.watchbandImage.alt}
                  />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
      <div className="w-[500px] h-[500px] absolute top-0 left-1/2 -translate-x-1/2">
        {section === "bands" && (
          <img
            className="z-10"
            src={productData[selectedIndex]?.watchcaseImage.srcSet.src}
            alt={productData[selectedIndex]?.watchcaseImage.alt}
          />
        )}
      </div>
    </div>
  );
};

export default SizeCarousel;

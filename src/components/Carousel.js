import React, { useRef, useState, useEffect } from "react";
import CarouselItem from "./CarouselItem";
import { nextButton, previousButton } from "../assets/icons";
import { select } from "motion/react-client";

const Carousel = ({
  index,
  productData,
  selectedWatch,
  section,
  setSelectedWatch,
  sideView,
  setSideView,
}) => {
  const carouselRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [timer, setTimer] = useState(null); // Store timer to clear it after inactivity
  const [padding, setPadding] = useState(0); // State to store dynamic padding
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Dynamically calculate the padding on window resize or when items change
    const handleResize = () => {
      const carousel = carouselRef.current;
      const firstItem = carousel?.children[0];
      if (firstItem) {
        const itemWidth = firstItem.offsetWidth; // Get the width of the first item
        const calculatedPadding = (window.innerWidth - itemWidth) / 2;
        setPadding(calculatedPadding);
      }
    };

    let index = productData?.findIndex(
      (product) => product.productsString === selectedWatch.productsString
    );
    handleItemClick(index);

    // Set initial padding and add resize event listener
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [productData]); // Ensure effect runs when items change

  useEffect(() => {
    if (carouselRef.current) {
      // Scroll to the selected item when selectedIndex changes
      const carousel = carouselRef.current;
      const selectedItem = carousel.children[currentIndex];
      if (selectedItem) {
        const carouselWidth = carousel.offsetWidth;
        const itemWidth = selectedItem.offsetWidth;

        // Calculate the position of the selected item to center it
        const itemCenter = selectedItem.offsetLeft + itemWidth / 2;
        const targetScrollPosition = itemCenter - carouselWidth / 2;

        // Smooth scroll to the selected item
        carousel.scrollTo({
          left: targetScrollPosition,
          behavior: "smooth",
        });
      }
    }
  }, [currentIndex]); // Re-run this effect whenever currentIndex changes

  useEffect(() => {
    currentIndex !== index && setCurrentIndex(index);
  }, [index]);

  const handleScroll = () => {
    if (sideView) {
      setSideView(false);

      setTimeout(() => {
        if (timer) clearTimeout(timer);

        setIsScrolling(true); // Set scrolling state to true

        // Set a new timer to detect when scroll stops
        const newTimer = setTimeout(() => {
          snapToClosestItem(); // Adjust once scrolling has stopped
          setIsScrolling(false); // Reset scrolling state
        }, 150); // Delay adjustment after 150ms of no scroll activity

        setTimer(newTimer);
      }, 500);
    } else {
      if (timer) clearTimeout(timer);

      setIsScrolling(true); // Set scrolling state to true

      // Set a new timer to detect when scroll stops
      const newTimer = setTimeout(() => {
        snapToClosestItem(); // Adjust once scrolling has stopped
        setIsScrolling(false); // Reset scrolling state
      }, 150); // Delay adjustment after 150ms of no scroll activity

      setTimer(newTimer);
    }
    // Clear any previously set timer
  };

  const snapToClosestItem = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const items = Array.from(carousel.children); // Ensure children are correctly accessed
    const carouselRect = carousel.getBoundingClientRect();
    const carouselCenter = carouselRect.left + carouselRect.width / 2;

    let closestItemIndex = 0;
    let closestDistance = Infinity;

    items.forEach((item, index) => {
      if (productData.length - 1 < index) return;
      const itemRect = item.getBoundingClientRect();
      const itemCenter = itemRect.left + itemRect.width / 2;

      // Calculate distance between item center and carousel center
      const distance = Math.abs(itemCenter - carouselCenter);

      // Update closest index if a smaller distance is found
      if (distance < closestDistance) {
        closestDistance = distance;
        closestItemIndex = index;
      }
    });

    setCurrentIndex(closestItemIndex); // Update the current index
    setSelectedWatch(productData[closestItemIndex]); // Update the selected watch
  };

  useEffect(() => {
    snapToClosestItem();
  }, [sideView]);

  const handleItemClick = (index) => {
    if (sideView) {
      setSideView(false);
      setTimeout(() => {
        setCurrentIndex(index); // Set the current index to the clicked item
        setSelectedWatch(productData[index]); // Set the selected watch
      }, 500);
    } else {
      setCurrentIndex(index); // Set the current index to the clicked item
      setSelectedWatch(productData[index]); // Set the selected watch
    }
  };

  const handleNext = () => {
    if (currentIndex < productData?.length - 1) {
      if (sideView) {
        setSideView(false);
        setTimeout(() => {
          setCurrentIndex(currentIndex + 1); // Go to next item
          setSelectedWatch(productData[currentIndex + 1]); // Set the selected watch
        }, 500);
      } else {
        setCurrentIndex(currentIndex + 1); // Go to next item
        setSelectedWatch(productData[currentIndex + 1]); // Set the selected watch
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      if (sideView) {
        setSideView(false);
        setTimeout(() => {
          setCurrentIndex(currentIndex - 1); // Go to previous item
          setSelectedWatch(productData[currentIndex - 1]); // Set the selected watch
        }, 500);
      } else {
        setSideView(false);
        setCurrentIndex(currentIndex - 1); // Go to previous item
        setSelectedWatch(productData[currentIndex - 1]); // Set the selected watch
      }
    }
  };

  const isNextDisabled = currentIndex === productData?.length - 1;
  const isPrevDisabled = currentIndex === 0;

  return (
    <div className="w-full overflow-hidden relative">
      {/* Next and Previous buttons */}
      <button
        onClick={handlePrev}
        disabled={isPrevDisabled}
        className={`z-50 absolute left-5 top-1/2 transform -translate-y-1/2 bg-appleGrey rounded-full ${
          isPrevDisabled ? "hidden" : ""
        }`}
      >
        <img src={previousButton} alt="prev" className="w-9 h-9" />
      </button>

      <button
        onClick={handleNext}
        disabled={isNextDisabled}
        className={`z-50 absolute right-5 top-1/2 transform -translate-y-1/2 bg-appleGrey rounded-full ${
          isNextDisabled ? "hidden" : ""
        }`}
      >
        <img src={nextButton} alt="next" className="w-9 h-9" />
      </button>

      <div className="absolute top-1/2 left-1/2 transform translate-x-[-50%] translate-y-[-50%] h-[50vh] w-[50vh]">
        {section === "case" && !sideView && (
          <img
            className="z-0 h-[50vh] w-[50vh]"
            src={productData[currentIndex]?.watchbandImage.srcSet.src}
            alt={productData[currentIndex]?.watchbandImage.alt}
          />
        )}
      </div>

      <div
        className="carousel-container flex gap-4 overflow-x-auto scroll-snap-x scroll-snap-mandatory scroll-smooth "
        ref={carouselRef}
        onScroll={handleScroll}
        style={{
          paddingLeft: `${padding}px`,
          paddingRight: `${padding}px`,
        }}
      >
        {productData.map((watch, index) => (
          <button
            key={index}
            onClick={() => handleItemClick(index)} // Scroll to item when clicked
            className={`flex justify-center items-center transition-all duration-500 ${
              sideView ? "-translate-x-[5vh]" : "translate-x-0"
            } ${
              sideView &&
              watch?.productsString === selectedWatch?.productsString
                ? "w-[55vh]"
                : "w-[40vh]"
            }`}
          >
            <CarouselItem
              watch={watch}
              section={section}
              sideView={sideView}
              selectedWatch={selectedWatch}
            />
          </button>
        ))}
        <div className="absolute top-1/2 left-1/2 transform translate-x-[-50%] translate-y-[-50%] h-[50vh] w-[50vh]">
          {section === "bands" && !sideView && (
            <img
              // className="z-50 h-[400px] w-[400px] md:h-[500px] md:w-[500px]"
              className="z-50 h-[50vh] w-[50vh]"
              src={productData[currentIndex]?.watchcaseImage.srcSet.src}
              alt={productData[currentIndex]?.watchcaseImage.alt}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Carousel;

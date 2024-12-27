import React, { useRef, useState, useEffect } from "react";
import CarouselItem from "./CarouselItem";
import { nextButton, previousButton } from "../assets/icons";

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
  const [timer, setTimer] = useState(null);
  const [padding, setPadding] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(index || 0);

  // Set padding for carousel
  useEffect(() => {
    const handleResize = () => {
      const carousel = carouselRef.current;
      const firstItem = carousel?.children[0];
      if (firstItem) {
        const itemWidth = firstItem.offsetWidth;
        const calculatedPadding = (window.innerWidth - itemWidth) / 2;
        setPadding(calculatedPadding);
      }
    };

    let newIndex = productData?.findIndex(
      (product) => product.productsString === selectedWatch.productsString
    );
    handleItemClick(newIndex);

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [productData]);

  // Set current index
  useEffect(() => {
    setTimeout(() => {
      setCurrentIndex(index);
    }, 150);
  }, [index]);

  // Scroll to default watch on first render and when selected watch changes
  useEffect(() => {
    if (carouselRef.current) {
      const carousel = carouselRef.current;
      const selectedItem = carousel.children[currentIndex];
      if (selectedItem) {
        const carouselWidth = carousel.offsetWidth;
        const itemWidth = selectedItem.offsetWidth;

        const itemCenter = selectedItem.offsetLeft + itemWidth / 2;
        const targetScrollPosition = itemCenter - carouselWidth / 2;

        carousel.scrollTo({
          left: targetScrollPosition,
          behavior: "smooth",
        });
      }
    }
  }, [currentIndex]);

  const handleScroll = () => {
    if (sideView) {
      setSideView(false);

      setTimeout(() => {
        if (timer) clearTimeout(timer);

        const newTimer = setTimeout(() => {
          snapToClosestItem();
        }, 150);

        setTimer(newTimer);
      }, 500);
    } else {
      if (timer) clearTimeout(timer);

      const newTimer = setTimeout(() => {
        snapToClosestItem();
      }, 450);

      setTimer(newTimer);
    }
  };

  const snapToClosestItem = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const items = Array.from(carousel.children);
    const carouselRect = carousel.getBoundingClientRect();
    const carouselCenter = carouselRect.left + carouselRect.width / 2;

    let closestItemIndex = 0;
    let closestDistance = Infinity;

    items.forEach((item, index) => {
      if (productData.length - 1 < index) return;
      const itemRect = item.getBoundingClientRect();
      const itemCenter = itemRect.left + itemRect.width / 2;

      const distance = Math.abs(itemCenter - carouselCenter);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestItemIndex = index;
      }
    });

    setCurrentIndex(closestItemIndex);
    setSelectedWatch(productData[closestItemIndex]);
  };

  useEffect(() => {
    snapToClosestItem();
  }, [sideView]);

  // When watch is clicked on screen
  const handleItemClick = (index) => {
    if (sideView) {
      setSideView(false);
      setTimeout(() => {
        setCurrentIndex(index);
        setSelectedWatch(productData[index]);
      }, 500);
    } else {
      setCurrentIndex(index);
      setSelectedWatch(productData[index]);
    }
  };

  // Next and Previous buttons
  const handleNext = () => {
    if (currentIndex < productData?.length - 1) {
      if (sideView) {
        setSideView(false);
        setTimeout(() => {
          setCurrentIndex(currentIndex + 1);
          setSelectedWatch(productData[currentIndex + 1]);
        }, 500);
      } else {
        setCurrentIndex(currentIndex + 1);
        setSelectedWatch(productData[currentIndex + 1]);
      }
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      if (sideView) {
        setSideView(false);
        setTimeout(() => {
          setCurrentIndex(currentIndex - 1);
          setSelectedWatch(productData[currentIndex - 1]);
        }, 500);
      } else {
        setSideView(false);
        setCurrentIndex(currentIndex - 1);
        setSelectedWatch(productData[currentIndex - 1]);
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

      {/* Sticky band in case section */}
      <div className="absolute top-1/2 left-1/2 transform translate-x-[-50%] translate-y-[-50%] h-[50vh] w-[50vh]">
        {section === "case" && !sideView && (
          <img
            className="z-0 h-[50vh] w-[50vh]"
            src={productData[currentIndex]?.watchbandImage.srcSet.src}
            alt={productData[currentIndex]?.watchbandImage.alt}
          />
        )}
      </div>

      {/* Carousel */}
      <div
        className="no-scrollbar flex gap-4 overflow-x-auto scroll-snap-x scroll-snap-mandatory scroll-smooth "
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
            onClick={() => handleItemClick(index)}
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

        {/* Sticky case in band section */}
        <div className="absolute top-1/2 left-1/2 transform translate-x-[-50%] translate-y-[-50%] h-[50vh] w-[50vh]">
          {section === "bands" && !sideView && (
            <img
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

import React, { useEffect, useRef, useState } from "react";
import { watchBand, watchCase, watchSize } from "../assets/icons";
import { cn } from "../utils";

export default function FooterOptions({
  isHome,
  setSelectedSection,
  loadProductData,
  selectedWatch,
  options,
  setWatch,
  sideView,
  setSideView,
}) {
  const [expandedOption, setExpandedOption] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState(null);
  const icons = {
    size: watchSize,
    case: watchCase,
    bands: watchBand,
  };
  const [footerOptionScroll, setFooterOptionScroll] = useState(false);

  const footerOptionsRef = useRef(null);

  // Check if footer options are scrollable
  useEffect(() => {
    const elementWidth = footerOptionsRef.current
      ? footerOptionsRef.current.scrollWidth
      : 0;
    const windowWidth = window.innerWidth;

    if (elementWidth > windowWidth) {
      setFooterOptionScroll(true);
    } else {
      setFooterOptionScroll(false);
    }
  }, [footerOptionsRef?.current?.scrollWidth]);

  // Set selected options on section change
  useEffect(() => {
    if (options && options.length) {
      const sectionData = options.find(
        (option) => option.sectionId === expandedOption
      );
      setSelectedOptions(selectedWatch?.dimension[sectionData?.key]);
    }
  }, [expandedOption, options, selectedWatch]);

  // Handle section selection of footer options
  function handleButtonClick(event, sectionId, key) {
    event.preventDefault();

    if (expandedOption === sectionId) {
      setExpandedOption(null);
    } else {
      setExpandedOption(sectionId);
      setSelectedSection(sectionId);
      loadProductData(sectionId, key);
    }
  }

  // Handle option selection of a seciton
  function handleOptionClick(event, option) {
    event.preventDefault();
    setWatch(option.index);
    setSelectedOptions(option.value);
  }

  return (
    <div
      className={`w-full absolute bottom-16 flex flex-col justify-center pt-28 text-center gap-16 md:gap-8 md:pt-16  transition-opacity duration-500 delay-1000 ${
        !isHome ? "opacity-1" : "opacity-0"
      }`}
    >
      {/* Selected Watch Details */}
      <div className="flex flex-col gap-1">
        <button
          className="b-0 text-xs text-fontBlue underline mb-2"
          onClick={() => setSideView(!sideView)}
        >
          {sideView ? "Front view" : "Side view"}
        </button>
        <p className="text-xs text-fontGrey font-semibold">
          {selectedWatch?.collectionName}
        </p>
        <p className="text-sm font-semibold">{selectedWatch?.productName}</p>
        <div
          className="text-sm"
          dangerouslySetInnerHTML={{ __html: selectedWatch?.fromPrice }}
        ></div>
      </div>

      {/* Options */}
      <div
        ref={footerOptionsRef}
        className={cn(
          "no-scrollbar w-full flex gap-4 overflow-x-auto px-4 justify-center",
          { "justify-start": footerOptionScroll }
        )}
      >
        {options?.map((option) => (
          <div
            key={option?.sectionId}
            className={`flex items-center px-4 py-2 bg-appleGrey rounded-full transition-all duration-500 `}
          >
            {/* Icon */}
            <img
              className="h-6 transition-transform duration-300 mr-4"
              src={icons[option?.sectionId]}
              alt="icon"
            />

            {/* Title Button */}
            <button
              className={`transition-transform duration-300 ${
                expandedOption === option?.sectionId && option?.options
                  ? "scale-0 hidden"
                  : "mr-4"
              }`}
              onClick={(e) =>
                handleButtonClick(e, option?.sectionId, option?.key)
              }
            >
              {option?.displayName}
            </button>

            {/* Options */}
            <div
              className={` flex transition-all duration-500 ${
                expandedOption === option?.sectionId && option?.options
                  ? "max-w-max opacity-100"
                  : "max-w-0 opacity-0"
              }`}
            >
              {option?.options?.map((sectionOption, index) => (
                <div
                  key={index}
                  className={`transition-opacity duration-300 min-w-max mr-4 ${
                    expandedOption === option?.sectionId && option?.options
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none"
                  }`}
                  style={{
                    transitionDelay: `${index * 100}ms`,
                  }}
                >
                  <button
                    className={`transition-transform duration-200 ${
                      sectionOption.value === selectedOptions ? "font-bold" : ""
                    }`}
                    onClick={(e) => handleOptionClick(e, sectionOption)}
                  >
                    {sectionOption?.text}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

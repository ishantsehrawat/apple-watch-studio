import React from "react";

export default function CarouselItem({
  watch,
  section,
  sideView,
  selectedWatch,
}) {
  return (
    <div
      className="h-[50vh] w-[50vh]"
      style={{
        scrollSnapAlign: "center",
        flexShrink: 0,

        position: "relative",
      }}
    >
      <img
        className={`absolute top-0 left-0 z-50 transition-opacity  duration-500 ${
          sideView && watch?.productsString === selectedWatch?.productsString
            ? "opacity-1"
            : "opacity-0"
        }`}
        src={watch?.kitAltImage.srcSet.src}
        alt={watch?.kitAltImage.alt}
      />
      {section !== "bands" && (
        <img
          className="absolute top-0 left-0 z-30"
          src={watch?.watchcaseImage.srcSet.src}
          alt={watch?.watchcaseImage.alt}
        />
      )}
      {section !== "case" && (
        <img
          className="absolute top-0 left-0 z-1"
          src={watch?.watchbandImage.srcSet.src}
          alt={watch?.watchbandImage.alt}
        />
      )}
    </div>
  );
}

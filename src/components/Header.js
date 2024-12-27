import React, { useState } from "react";
import { appleWatchLogo } from "../assets/images";
import { chevronDown } from "../assets/icons";
import Modal from "./Modal";
import { BASE_URL } from "../constants";

export default function Header({
  isHome,
  studioSwitchersData,
  selectedWatch,
  loadProductData,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toggle collections modal
  const openCollectionsModal = (isOpen) => {
    setIsModalOpen(isOpen);
  };

  // Collection selection handler
  const handleCollectionClick = (collection) => {
    loadProductData("", undefined, collection?.dimensionCollectionKey);
    openCollectionsModal(false);
  };

  // Redirect to checkout page with selected watch
  const buySelectedWatch = () => {
    const URL = BASE_URL + selectedWatch?.url;
    window.location.href = URL;
  };

  return (
    <>
      <div className="h-[84px] pl-8 pr-5 py-6 flex flex-col md:flex-row gap-2 md:gap-0 justify-between items-center relative transition-opacity duration-1000">
        <img
          className="w-[77px] md:w-[90px] h-[17px] md:h-[20px]"
          src={appleWatchLogo}
          alt="⌚️"
        />

        {/* Collection options */}
        <button
          className={`hidden md:flex gap-1 items-center absolute left-[50%] -translate-x-[50%] transition-opacity duration-1000 ${
            isHome ? "opacity-0" : ""
          }`}
          onClick={() => openCollectionsModal(true)}
        >
          <span>Collections</span>
          <img className="h-3 w-3" src={chevronDown} alt="down-arrow" />
        </button>

        {/* Save button */}
        <button
          className={`hidden md:block rounded-full bg-appleBlue text-white px-4 py-1.5 transition-opacity duration-1000 ${
            isHome ? "opacity-0" : ""
          }`}
          onClick={() => buySelectedWatch()}
        >
          Save
        </button>

        {/* mobile view */}
        <div className="md:hidden flex w-full justify-between">
          <button
            className={`flex gap-1 items-center transition-opacity duration-1000 ${
              isHome ? "opacity-0" : ""
            }`}
            onClick={() => openCollectionsModal(true)}
          >
            <span>Collections</span>
            <img className="h-3 w-3" src={chevronDown} alt="down-arrow" />
          </button>
          <button
            className={`rounded-full bg-appleBlue text-white px-4 py-2 text-sm transition-opacity duration-1000 ${
              isHome ? "opacity-0" : ""
            }`}
            onClick={() => buySelectedWatch()}
          >
            Save
          </button>
        </div>
      </div>

      {/* Collection Modal */}
      {isModalOpen && (
        <Modal onClose={() => openCollectionsModal(false)}>
          <div className="px-6 flex flex-col ">
            {studioSwitchersData.map((collection, index) => (
              <div key={collection?.dimensionCollectionKey}>
                <button
                  className={`w-full py-4 text-lg text-center  ${
                    collection?.selected
                      ? "text-fontGrey"
                      : "hover:text-fontBlue"
                  }`}
                  disabled={collection?.selected === true}
                  onClick={() => handleCollectionClick(collection)}
                >
                  <span>{collection?.linkText}</span>
                </button>
                {index !== studioSwitchersData?.length - 1 && <hr />}
              </div>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}

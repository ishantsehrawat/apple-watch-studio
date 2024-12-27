import React, { useState, useEffect } from "react";
import { Header, FooterOptions } from "./components";
import { loader } from "./assets/images";
import { fetchAppleProductData } from "./API/apiClient";
import "./App.css";
import Carousel from "./components/Carousel";

function App() {
  const [isHome, setIsHome] = useState(true);
  const [studioSwitchersData, setStudioSwitchersData] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [queryParams, setQueryParams] = useState({
    product: "Z0YQ",
    "option.watch_cases": "MWX13LW/A",
    "option.watch_bands": "MYAF3AM/A",
  });
  const [productData, setProductData] = useState(null);
  const [selectedWatch, setSelectedWatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState(null);
  const [watchIndex, setWatchIndex] = useState(0);
  const [sideView, setSideView] = useState(false);

  function startStudio() {
    setIsHome(false);
  }

  const selectWatch = (watch) => {
    setSelectedWatch(watch);
    let newQueryParams = {
      product: watch?.part,
      "option.watch_cases": watch?.options?.watch_cases,
      "option.watch_bands": watch?.options?.watch_bands,
    };
    selectedSection && (newQueryParams.section = selectedSection);

    // Only update queryParams if they are different
    if (JSON.stringify(newQueryParams) !== JSON.stringify(queryParams)) {
      setQueryParams(newQueryParams);
    }
  };

  const loadProductData = async (
    section = "",
    key = undefined,
    collection = ""
  ) => {
    try {
      setLoading(true);
      setProductData(null);
      let newQueryParams = { ...queryParams };
      if (section !== "") {
        newQueryParams = { ...queryParams, section: section };
      }
      if (collection !== "") {
        newQueryParams = { collection: collection };
      }
      const data = await fetchAppleProductData(newQueryParams);
      data?.body?.studioSwitchers &&
        setStudioSwitchersData(data?.body?.studioSwitchers);
      data?.body?.defaultProduct &&
        setSelectedWatch(data?.body?.defaultProduct);
      data?.body?.products && setProductData(data?.body?.products);
      data?.body?.sections && setOptions(data?.body?.sections);

      let i = 0;
      let sectionOption = "";
      let tempOptions = data?.body?.sections;
      if (data?.body?.products && key) {
        data?.body?.products?.map((product, index) => {
          if (sectionOption !== product?.dimension[key]) {
            sectionOption = product?.dimension[key];
            const optionIndex = tempOptions.findIndex((option) => {
              return option?.key === key;
            });
            tempOptions[optionIndex].options[i] = {
              index: index,
              ...tempOptions[optionIndex]?.options[i],
            };
            i++;
          }

          if (
            data?.body?.defaultProduct?.productsString ===
              product?.productsString ||
            selectedWatch?.productsString === product?.productsString
          ) {
            setWatchIndex(index);
          }
        });
      }
      setOptions(tempOptions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Call loadProductData only once when the component first renders
    loadProductData("");
  }, []); // Empty dependency array ensures this runs only once

  const setWatch = (index) => {
    console.log(index);
    setWatchIndex(index);
  };

  return (
    <div className="h-screen relative">
      <Header
        isHome={isHome}
        studioSwitchersData={studioSwitchersData}
        selectedWatch={selectedWatch}
        loadProductData={loadProductData}
      />

      {(() => {
        if (loading && !isHome) {
          return (
            <div className="absolute left-[50%] z-10 top-1/2 md:top-[-200px] -translate-x-1/2">
              <img className="animate-spin" src={loader} alt="loading" />
            </div>
          );
        } else {
          if (selectedSection) {
            return (
              <div className="mt-10">
                <Carousel
                  index={watchIndex}
                  productData={productData}
                  selectedWatch={selectedWatch}
                  section={selectedSection}
                  setSelectedWatch={selectWatch}
                  sideView={sideView}
                  setSideView={setSideView}
                />
              </div>
            );
          } else {
            return (
              <div className="relative">
                <div
                  className={`absolute left-[7%] md:left-[20%] mt-16 md:mt-20 z-50 transition-opacity duration-200 ${
                    isHome ? "opacity-1" : "opacity-0"
                  }  `}
                >
                  <div className="text-left">
                    <h1 className="text-lg md:text-xl mb-2.5 z-30">
                      Apple Watch Studio
                    </h1>
                    <p className="text-4xl md:text-6.5xl font-bold leading-tight">
                      Choose a case.
                      <br />
                      Pick a band.
                      <br />
                      Create your own style.
                      <br />
                    </p>

                    <button
                      onClick={() => startStudio()}
                      className="rounded-full bg-appleBlue text-white px-5 py-3 mt-11 z-50"
                      style={{ position: "relative" }}
                    >
                      Get Started
                    </button>
                  </div>
                </div>
                <div className={loading ? "hidden" : ""}>
                  <img
                    className={`absolute left-[50%] scale-100 md:scale-50 lg:scale-[0.45] translate-y-[20%] xs:translate-y-0 sm:-translate-y-[20%] lg:-translate-y-[25%] -translate-x-1/2 z-20 transition-all duration-500 ${
                      sideView ? "opacity-1" : "opacity-0"
                    }`}
                    src={selectedWatch?.kitAltImage?.srcSet?.src}
                    alt={selectedWatch?.kitAltImage?.alt}
                  />
                  <img
                    className={`absolute left-[50%] -translate-x-1/2  z-10 transition-all duration-1000 ${
                      isHome
                        ? "scale-150 md:scale-100 translate-y-[70vh] sm:translate-y-[40%]"
                        : "scale-100 md:scale-50 lg:scale-[0.45] translate-y-[20%] xs:translate-y-0 sm:-translate-y-[20%] lg:-translate-y-[25%]"
                    } `}
                    src={selectedWatch?.watchcaseImage?.srcSet?.src}
                    alt="watchCase"
                  />
                  <img
                    className={`absolute left-[50%] -translate-x-1/2 z-0 transition-all duration-1000 ${
                      isHome
                        ? "scale-150 md:scale-100 translate-y-[70vh] sm:translate-y-[40%]"
                        : "scale-100 md:scale-50 lg:scale-[0.45] translate-y-[20%] xs:translate-y-0 sm:-translate-y-[20%] lg:-translate-y-[25%]"
                    } `}
                    src={selectedWatch?.watchbandImage?.srcSet?.src}
                    alt="watchBand"
                  />
                </div>
              </div>
            );
          }
        }
      })()}
      <FooterOptions
        isHome={isHome}
        selectedWatch={selectedWatch}
        options={options}
        loadProductData={loadProductData}
        setSelectedSection={setSelectedSection}
        setWatch={setWatch}
        sideView={sideView}
        setSideView={setSideView}
      />
    </div>
  );
}

export default App;

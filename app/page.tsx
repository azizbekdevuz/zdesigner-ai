"use client";

import Dropzone, { FileRejection } from "react-dropzone";
import { saveAs } from "file-saver";
import { useState, useEffect } from "react";
import { ThreeDots } from "react-loader-spinner";
import { FaTrashAlt, FaDownload } from "react-icons/fa";
import { XCircleIcon } from "@heroicons/react/20/solid";
import { PhotoIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { SelectMenu } from "@/app/selectmenu";
import { DesktopSidebar } from "@/app/desktop-sidebar";
import { MobileSidebar } from "@/app/mobile-sidebar";
import { TeamSection } from "@/app/team-section";
import React from "react";
import { useRouter } from 'next/navigation';

const themes = ["Modern", "Vintage", "Minimalist", "Professional"];
const rooms = ["Living Room", "Dining Room", "Bedroom", "Bathroom", "Office"];
const acceptedFileTypes = { "image/jpeg": [".jpeg", ".jpg", ".png"] };
const maxFileSize = 5 * 1024 * 1024; // 5MB

function ErrorNotification({ errorMessage }: { errorMessage: string }) {
  return (
    <div className="mx-4 mb-10 rounded-md bg-red-50 p-4 lg:mx-6 xl:mx-8">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-red-800">{errorMessage}</p>
        </div>
      </div>
    </div>
  );
}

function ActionPanel({
  isLoading,
  submitImage,
}: {
  isLoading: boolean;
  submitImage: () => void;
}) {
  const isDisabled = isLoading;

  return (
    <section className="mx-4 bg-gray-900 shadow sm:rounded-lg lg:mx-6 xl:mx-8">
      <div className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-start sm:justify-between">
          <div>
            <h3 className="text-base font-semibold leading-6 text-white lg:text-xl">
              Upload a photo or image
            </h3>
            <div className="mt-2 max-w-xl text-sm text-white">
              <p>
                Upload an image of a room and let our AI generate a new design.
              </p>
            </div>
          </div>
          <div className="mt-5 sm:ml-6 sm:mt-0 sm:flex sm:flex-shrink-0 sm:items-center">
            <button
              type="button"
              disabled={isDisabled}
              onClick={submitImage}
              className={`${
                isDisabled
                  ? "cursor-not-allowed bg-indigo-300 text-gray-300 hover:bg-indigo-300 hover:text-gray-300"
                  : "bg-indigo-600 text-white"
              } inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold shadow-sm transition-all duration-300 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 lg:px-3.5 lg:py-2.5`}
            >
              Redesign with AI
              <SparklesIcon className="ml-2 h-4 w-4 text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ImageOutput({
  outputImage,
  loading,
  downloadOutputImage,
  icon: Icon,
  title,
}: any) {
  return (
    <section className="relative mx-auto h-full w-full max-w-lg md:h-[600px] md:w-[600px]">
      <button
        type="button"
        className={`${
          loading ? "flex items-center justify-center" : ""
        } relative block h-full w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
      >
        {!outputImage && loading ? (
          <span className="flex flex-col items-center">
            <ThreeDots
              height="50"
              width="60"
              color="#eee"
              ariaLabel="three-dots-loading"
              visible={loading}
            />
            <span className="block text-sm font-semibold text-white">
              Processing the output image
            </span>
          </span>
        ) : null}

        {!outputImage && !loading ? (
          <>
            <Icon className="mx-auto h-12 w-12 text-gray-400" />
            <span className="mt-2 block text-sm font-semibold text-white">
              {title}
            </span>
          </>
        ) : null}

        {!loading && outputImage ? (
          <img
            src={outputImage}
            alt="output"
            className="h-full w-full rounded-lg object-cover"
          />
        ) : null}
      </button>

      {!loading && outputImage ? (
        <button
          onClick={downloadOutputImage}
          className="group absolute right-1 top-1 rounded bg-yellow-500 p-2 text-black"
        >
          <FaDownload className="h-4 w-4 duration-300 group-hover:scale-110" />
        </button>
      ) : null}
    </section>
  );
}

function UploadedImage({ file, image, removeImage }: any) {
  return (
    <section className="relative mx-auto h-full w-full max-w-lg md:w-[600px] md:h-[600px]">
      <button className="relative block w-full h-full rounded-lg border-2 border-dashed border-gray-300 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        <img
          src={URL.createObjectURL(image)}
          alt={image.name}
          className="h-full w-full rounded-lg object-cover"
        />
      </button>

      <button
        className="group absolute right-1 top-1 rounded bg-yellow-500 p-2 text-black"
        onClick={removeImage}
      >
        <FaTrashAlt className="h-4 w-4 duration-300 group-hover:scale-110" />
      </button>

      <div className="text-md absolute left-0 top-0 bg-opacity-50 p-2 pl-3.5 text-white">
        {file.name} ({file.size})
      </div>
    </section>
  );
}

function ImageDropzone({ onImageDrop, icon: Icon, title }: any) {
  return (
    <Dropzone
      onDrop={onImageDrop}
      accept={acceptedFileTypes}
      maxSize={maxFileSize}
      multiple={false}
    >
      {({ getRootProps, getInputProps }) => (
        <>
          <input {...getInputProps()} />
          <button
            {...getRootProps()}
            type="button"
            className="relative mx-auto block w-full max-w-lg md:w-[600px] h-full md:h-[600px] rounded-lg border-2 border-dashed border-gray-300 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Icon className="mx-auto h-12 w-12 text-gray-400" />
            <span className="mt-2 block text-sm font-semibold text-white">
              {title}
            </span>
          </button>
        </>
      )}
    </Dropzone>
  );
}

function WordChanger({ words }: { words: string[] }) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [animatedWord, setAnimatedWord] = useState(words[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [words.length]);

  useEffect(() => {
    const nextWord = words[currentWordIndex];
    let letterIndex = 0;
    const animationInterval = setInterval(() => {
      if (letterIndex <= nextWord.length) {
        setAnimatedWord(nextWord.slice(0, letterIndex));
        letterIndex++;
      } else {
        clearInterval(animationInterval);
      }
    }, 100);

    return () => clearInterval(animationInterval);
  }, [currentWordIndex, words]);

  return (
    <span className="word-change">
      <span className="text-changing-color">{animatedWord}</span>
    </span>
  );
}

export default function HomePage({ currentPage = "home" }: { currentPage?: string; }) {
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>(themes[0]);
  const [room, setRoom] = useState<string>(rooms[0]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>("");
  const [file, setFile] = useState<File | null>(null);
  const [current, setCurrentPage] = useState<string>(currentPage);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [colorChangePrompt, setColorChangePrompt] = useState<string>("");
  const [objectRemovalPrompt, setObjectRemovalPrompt] = useState<string>("");

  const loopTexts = ['Rooms', 'Colours', 'Furnitures'];

  const router = useRouter();

  const handlePageChange = (page: string, path: string) => {
    setCurrentPage(page);
    router.push(path);
  };

  useEffect(() => {
    const sliders = document.querySelectorAll(".relative");

    sliders.forEach((slider) => {
      const stick = slider.querySelector(".slider-stick") as HTMLElement;
      const beforeImage = slider.querySelector(".before-image") as HTMLElement;
      const afterImage = slider.querySelector(".after-image") as HTMLElement;

      const moveSlider = (e: MouseEvent) => {
        const rect = slider.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const width = rect.width;
        const percentage = (x / width) * 100;
        if (stick && beforeImage && afterImage) {
          stick.style.left = `${percentage}%`;
          afterImage.style.clipPath = `polygon(${percentage}% 0, 100% 0, 100% 100%, ${percentage}% 100%)`;
          beforeImage.style.clipPath = `polygon(0 0, ${percentage}% 0, ${percentage}% 100%, 0 100%)`;
        }
      };

      slider.addEventListener("mousemove", moveSlider as EventListener);

      return () => {
        slider.removeEventListener("mousemove", moveSlider as EventListener);
      };
    });

    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentPage(path.replace("/", "")); // Set page based on URL path
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  function onImageDrop(
    acceptedFiles: File[],
    rejectedFiles: FileRejection[]
  ): void {
    if (rejectedFiles.length > 0) {
      setError("Please upload a PNG or JPEG image less than 5MB.");
      return;
    }

    removeImage();
    setError("");
    setFile(acceptedFiles[0]);
    convertImageToBase64(acceptedFiles[0]);
  }

  function convertImageToBase64(file: File): void {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const binaryStr = reader.result as string;
      setBase64Image(binaryStr);
    };
  }

  function fileSize(size: number): string {
    if (size === 0) {
      return "0 Bytes";
    }

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(size) / Math.log(k));
    return parseFloat((size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  function removeImage(): void {
    setFile(null);
    setOutputImage(null);
  }

  function downloadOutputImage(): void {
    saveAs(outputImage as string, "output.png");
  }

  async function submitImage(promptType: string): Promise<void> {
    if (!file) {
      setError("Please upload an image.");
      return;
    }
  
    setLoading(true);
  
    const prompt = promptType === "colorChange" ? colorChangePrompt : objectRemovalPrompt;
  
    try {
      const response = await fetch("/api/replicate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: base64Image, theme, room, customPrompt: prompt, promptType }),
      });
  
      const result = await response.json();
      console.log(result);
  
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
  
      setOutputImage(result.output[1]);
    } catch (error) {
      console.error('Error:', error);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  }  

  return (
    <>
      <DesktopSidebar setCurrentPage={setCurrentPage} />
      <MobileSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} setCurrentPage={setCurrentPage} />
      <main className="flex min-h-screen flex-col bg-gradient-to-r from-purple-900 via-black to-purple-900 py-10 text-white lg:pl-72 animated-background">
        {current === "home" ? (
          <section className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
          <div className="home-container flex flex-col lg:flex-row h-full w-full animate-fadeIn">
            <div className="left-section flex flex-col items-center justify-center lg:w-1/2 p-8 h-full">
              <h1 className="text-4xl font-bold mb-4 text-gray-100 text-center animate-slideInUp">
                Redesign Your <WordChanger words={loopTexts} /> with AI in Seconds
              </h1>
              <p className="text-lg mb-4 text-gray-300 text-center animate-slideInUp">
                Upload a picture of your room, select a design theme, and watch the transformation happen!
              </p>
              <button 
                onClick={() => handlePageChange("studio", "/studio")}
                className="bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white py-2 px-4 rounded mb-4 transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-yellow-500 hover:via-red-500 hover:to-pink-500 active:bg-gradient-to-r active:from-yellow-500 active:via-red-500 active:to-pink-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-75 animate-slideInUp"
              >
                Go to Studio &gt;
              </button>
              <div className="info-section flex items-center justify-center mt-4 space-x-4 animate-slideInUp">
                <img src="/images/guests.png" alt="Guests" className="w-10 h-10"/>
                <div className="flex flex-col items-center">
                  <span className="text-xl font-bold text-gray-100">Various</span>
                  <span className="text-sm text-gray-300">Room Types</span>
                </div>
                <div className="divider h-8 w-px bg-gray-300"></div>
                <div className="flex flex-col items-center">
                  <span className="text-xl font-bold text-gray-100">Different</span>
                  <span className="text-sm text-gray-300">Design Models</span>
                </div>
              </div>
            </div>
            <div className="right-section flex flex-col items-center justify-center lg:w-1/2 p-8 h-full">
              <video
                autoPlay
                loop
                muted
                className="w-3/4 mb-4 rounded-lg max-w-md animate-fadeIn"
              >
                <source src="/images/headvid.webm" type="video/webm" />
                <source src="/images/headvid.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="text-center text-gray-300 animate-fadeIn">
                <p>ZDesigner AI: Redesign, customize, and renew your interiors effortlessly.</p>
              </div>
            </div>
          </div>
        </section>        
        ) : current === "services" ? (
          <>
          <section className="container mx-auto flex flex-col items-center px-4 py-10 animate-fadeIn">
            <h1 className="mb-4 text-5xl font-bold">REVIEW OUR EXCEPTIONAL SERVICES:</h1>
            </section>
            <section className="container mx-auto flex flex-col items-center px-4 py-10">
              <div className="flex w-full max-w-4xl flex-col space-y-8">
                {/* Creative Redesign Section */}
                <div className="flex w-full flex-col items-center lg:flex-row-reverse lg:space-x-8 animate-slideInRightDelay">
                  <div className="mb-8 lg:mb-0 lg:w-1/2 flex flex-col justify-between">
                    <h2 className="mb-4 text-center text-3xl font-bold lg:text-right">
                      <strong className="text-blue-300">Creative Redesign</strong> for Interiors
                    </h2>
                    <p className="mb-4 text-center text-lg lg:text-right text-gray-300">
                      Give the AI the freedom to be artistic with Creative Redesign. It can make more exciting changes to your house or interiors, creating a one-of-a-kind design that really stands out.
                    </p>
                  </div>
                  <div className="relative mb-8 lg:mb-0 lg:w-1/2 lg:flex lg:items-center">
                    <div className="relative h-full w-full overflow-hidden">
                      <div className="before-image absolute h-full w-full bg-cover bg-center" style={{ backgroundImage: `url('/images/before.png')` }}></div>
                      <div className="after-image absolute h-full w-full bg-cover bg-center" style={{ backgroundImage: `url('/images/after.png')` }}></div>
                      <div className="slider-stick absolute bottom-0 left-1/2 top-0 z-10 w-1 cursor-ew-resize bg-white"></div>
                    </div>
                  </div>
                </div>

                {/* Fill The Room Section */}
                <div className="flex w-full flex-col items-center lg:flex-row lg:space-x-8 animate-slideInLeftDelay">
                  <div className="mb-8 lg:mb-0 lg:w-1/2 flex flex-col justify-between">
                    <h2 className="mb-4 text-center text-3xl font-bold lg:text-left">
                      <strong className="text-blue-300">Fill The Room</strong> with Furniture and Decorations
                    </h2>
                    <p className="mb-4 text-center text-lg lg:text-left text-gray-300">
                      Ever wondered how your place would look with the furniture you want? Fill The Room lets the AI furnish any room type. You can try out different setups until you find the perfect one.
                    </p>
                  </div>
                  <div className="relative mb-8 lg:mb-0 lg:w-1/2 lg:flex lg:items-center">
                    <div className="relative h-full w-full overflow-hidden">
                      <div className="before-image absolute h-full w-full bg-cover bg-center" style={{ backgroundImage: `url('/images/before2.png')` }}></div>
                      <div className="after-image absolute h-full w-full bg-cover bg-center" style={{ backgroundImage: `url('/images/after2.png')` }}></div>
                      <div className="slider-stick absolute bottom-0 left-1/2 top-0 z-10 w-1 cursor-ew-resize bg-white"></div>
                    </div>
                  </div>
                </div>

                {/* Decor Staging Section */}
                <div className="flex w-full flex-col items-center lg:flex-row-reverse lg:space-x-8 animate-slideInRightDelay">
                  <div className="mb-8 lg:mb-0 lg:w-1/2 flex flex-col justify-between">
                    <h2 className="mb-4 text-center text-3xl font-bold lg:text-right">
                      <strong className="text-blue-300">Decor Staging/</strong>Furniture Showcase
                    </h2>
                    <p className="mb-4 text-center text-lg lg:text-right text-gray-300">
                      Show off your furniture/decor in lots of styles with Decor Staging. You can see how your stuff would look in all kinds of different designs. Showcase any piece of furniture or other objects.
                    </p>
                  </div>
                  <div className="relative mb-8 lg:mb-0 lg:w-1/2 lg:flex lg:items-center">
                    <div className="relative h-full w-full overflow-hidden">
                      <div className="before-image absolute h-full w-full bg-cover bg-center" style={{ backgroundImage: `url('/images/before3.png')` }}></div>
                      <div className="after-image absolute h-full w-full bg-cover bg-center" style={{ backgroundImage: `url('/images/after3.png')` }}></div>
                      <div className="slider-stick absolute bottom-0 left-1/2 top-0 z-10 w-1 cursor-ew-resize bg-white"></div>
                    </div>
                  </div>
                </div>

                {/* Room Types Section */}
                <div className="flex w-full flex-col items-center lg:flex-row lg:space-x-8 animate-slideInLeftDelay">
                  <div className="mb-8 lg:mb-0 lg:w-1/2 flex flex-col justify-between">
                    <h2 className="mb-4 text-center text-3xl font-bold lg:text-left">
                      <strong className="text-blue-300">Room Types</strong> Space Transformation
                    </h2>
                    <p className="mb-4 text-center text-lg lg:text-left text-gray-300">
                      Pick from lots of different room types that fit your vision. It could be a cozy bedroom, a spacious kitchen, or a fancy office. Maybe a restaurant or coffee shop? We've got more than 40+ options to choose from.
                    </p>
                  </div>
                  <div className="relative mb-8 lg:mb-0 lg:w-1/2 lg:flex lg:items-center">
                    <div className="relative h-full w-full overflow-hidden">
                      <div className="before-image absolute h-full w-full bg-cover bg-center" style={{ backgroundImage: `url('/images/before4.png')` }}></div>
                      <div className="after-image absolute h-full w-full bg-cover bg-center" style={{ backgroundImage: `url('/images/after4.png')` }}></div>
                      <div className="slider-stick absolute bottom-0 left-1/2 top-0 z-10 w-1 cursor-ew-resize bg-white"></div>
                    </div>
                  </div>
                </div>

                {/* Change Colors Section */}
                <div className="flex w-full flex-col items-center lg:flex-row-reverse lg:space-x-8 animate-slideInRightDelay">
                  <div className="mb-8 lg:mb-0 lg:w-1/2 flex flex-col justify-between">
                    <h2 className="mb-4 text-center text-3xl font-bold lg:text-right">
                      <strong className="text-blue-300">Customize</strong> anything
                    </h2>
                    <p className="mb-4 text-center text-lg lg:text-right text-gray-300">
                      Change colors of furniture/wall/floor/ceiling and everything in between. Change color scheme & design elements to enhance the overall aesthetic and appeal of the room based on your needs.
                    </p>
                  </div>
                  <div className="relative mb-8 lg:mb-0 lg:w-1/2 lg:flex lg:items-center">
                    <div className="relative h-full w-full overflow-hidden">
                      <div className="before-image absolute h-full w-full bg-cover bg-center" style={{ backgroundImage: `url('/images/before5.png')` }}></div>
                      <div className="after-image absolute h-full w-full bg-cover bg-center" style={{ backgroundImage: `url('/images/after5.png')` }}></div>
                      <div className="slider-stick absolute bottom-0 left-1/2 top-0 z-10 w-1 cursor-ew-resize bg-white"></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="container mx-auto flex flex-col items-center px-4 py-10 animate-fadeIn">
            <h1 className="mb-4 text-5xl font-bold">EXPLORE MORE SOON...</h1>
            </section>
          </>
        ) : current === "studio" ? (
          <section className="container mx-auto flex flex-col items-center px-4 py-10 animate-zoomIn">
          <section id="studio" className="ips-dgsec w-full">
            <div className="w-full mb-8">
              <h2 className="text-center text-2xl font-semibold text-white mb-4">
                Please select the desired types of the design and the room
              </h2>
              <section className="mt-4 flex flex-col items-center space-y-4 md:space-y-0 md:flex-row md:space-x-8 animate-fadeIn">
                <SelectMenu
                  label="Model"
                  options={themes}
                  selected={theme}
                  onChange={setTheme}
                />
                <SelectMenu
                  label="Room type"
                  options={rooms}
                  selected={room}
                  onChange={setRoom}
                />
              </section>
            </div>
            <div className="nw-formouter flex flex-col items-center space-y-8 md:flex-row md:space-y-0 md:space-x-8">
              <div className="flex flex-col items-center">
                <h3 className="text-center text-xl font-semibold text-white mb-4">
                  Step 1: Upload your room's picture
                </h3>
                {!file ? (
                  <ImageDropzone
                    title={`Drag 'n drop your image here or click to upload`}
                    onImageDrop={onImageDrop}
                    icon={PhotoIcon}
                  />
                ) : (
                  <UploadedImage
                    image={file}
                    removeImage={removeImage}
                    file={{
                      name: file.name,
                      size: fileSize(file.size),
                    }}
                  />
                )}
              </div>
      
              {outputImage && (
                <div className="flex flex-col items-center">
                  <h3 className="text-center text-xl font-semibold text-white mb-4">
                    Customize your design
                  </h3>
                  <div className="mb-4 w-full max-w-lg">
                    <label htmlFor="colorChangePrompt" className="block text-sm font-medium text-white">
                      Change colors:
                    </label>
                    <input
                      type="text"
                      id="colorChangePrompt"
                      value={colorChangePrompt}
                      onChange={(e) => setColorChangePrompt(e.target.value)}
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
                      placeholder="e.g., change all furniture to blue"
                    />
                  </div>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => submitImage("colorChange")}
                      className="rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 px-4 py-2 text-white transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-yellow-500 hover:via-red-500 hover:to-pink-500"
                    >
                      Change Colors
                    </button>
                  </div>
                  <div className="mb-4 w-full max-w-lg">
                    <label htmlFor="objectRemovalPrompt" className="block text-sm font-medium text-white">
                      Remove objects:
                    </label>
                    <input
                      type="text"
                      id="objectRemovalPrompt"
                      value={objectRemovalPrompt}
                      onChange={(e) => setObjectRemovalPrompt(e.target.value)}
                      className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-black"
                      placeholder="e.g., remove all furniture"
                    />
                  </div>                  
                    <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => submitImage("objectRemoval")}
                      className="rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 px-4 py-2 text-white transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-yellow-500 hover:via-red-500 hover:to-pink-500"
                    >
                      Remove Objects
                    </button>
                  </div>
                </div>
              )}
      
              {!outputImage && (
                <div className="flex flex-col items-center">
                  <h3 className="text-center text-xl font-semibold text-white mb-4">
                    Step 2: Generate the new design
                  </h3>
                  <button
                    type="button"
                    onClick={() => submitImage("colorChange")}
                    className="rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 px-4 py-2 text-white transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-yellow-500 hover:via-red-500 hover:to-pink-500"
                  >
                    Generate New Design
                  </button>
                </div>
              )}
      
              <div className="flex flex-col items-center">
                <h3 className="text-center text-xl font-semibold text-white mb-4">
                  Check out the new design:
                </h3>
                <ImageOutput
                  title={`AI-generated new design goes here`}
                  downloadOutputImage={downloadOutputImage}
                  outputImage={outputImage}
                  icon={SparklesIcon}
                  loading={loading}
                />
              </div>
            </div>
          </section>
        </section>
        ) : current === "history" ? (
          <section className="container mx-auto flex flex-col items-center px-4 py-10 animate-fadeIn">
          <h1 className="mb-4 text-5xl font-bold">UNDER CONSTRUCTION</h1>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => handlePageChange("home", "/")}
              className="w-full md:w-auto rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:bg-gradient-to-r hover:from-yellow-500 hover:via-red-500 hover:to-pink-500"
            >
              Home
            </button>
            <button
              onClick={() => handlePageChange("services", "/services")}
              className="w-full md:w-auto rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:bg-gradient-to-r hover:from-yellow-500 hover:via-red-500 hover:to-pink-500"
            >
              Services
            </button>
            <button
              onClick={() => handlePageChange("studio", "/studio")}
              className="w-full md:w-auto rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:bg-gradient-to-r hover:from-yellow-500 hover:via-red-500 hover:to-pink-500"
            >
              Studio
            </button>
            <button
              onClick={() => handlePageChange("about", "/about")}
              className="w-full md:w-auto rounded-md bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 px-6 py-3 text-lg font-semibold text-white shadow-lg hover:bg-gradient-to-r hover:from-yellow-500 hover:via-red-500 hover:to-pink-500"
            >
              About
            </button>
          </div>
        </section>
        ) : current === "about" ? (
          <section className="container mx-auto px-4 py-10 animate-slideInUp">
            <div className="mb-10 flex flex-col items-center">
              <h2 className="mb-4 text-4xl font-bold">About Us</h2>
              <p className="mb-8 text-center text-lg">
                We are a team of passionate designers and developers dedicated
                to bringing you the best AI-driven interior design solutions.
              </p>
              <div className="relative w-1168 h-649">
                <img
                  src="/images/about.png"
                  alt="About Image"
                  className="inset-0 w-full h-full object-cover rounded-md animate-slideInUp"
                />
              </div>
            </div>
            <TeamSection />
            <footer className="py-12 text-white">
              <div className="container mx-auto text-center">
                <div className="mb-6 flex flex-col items-center">
                  <div className="mb-4">
                    <a href="#" className="mx-2 text-white hover:text-gray-400">
                      Facebook
                    </a>
                    <a href="#" className="mx-2 text-white hover:text-gray-400">
                      Twitter
                    </a>
                    <a href="#" className="mx-2 text-white hover:text-gray-400">
                      Instagram
                    </a>
                    <a href="#" className="mx-2 text-white hover:text-gray-400">
                      GitHub
                    </a>
                  </div>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handlePageChange("home", "/")}
                      className="mx-2 text-lg font-semibold text-white hover:text-gray-400"
                    >
                      Home
                    </button>
                    <button
                      onClick={() => handlePageChange("services", "/services")}
                      className="mx-2 text-lg font-semibold text-white hover:text-gray-400"
                    >
                      Services
                    </button>
                    <button
                      onClick={() => handlePageChange("studio", "/studio")}
                      className="mx-2 text-lg font-semibold text-white hover:text-gray-400"
                    >
                      Studio
                    </button>
                    <button
                      onClick={() => handlePageChange("about", "/about")}
                      className="mx-2 text-lg font-semibold text-white hover:text-gray-400"
                    >
                      About
                    </button>
                  </div>
                </div>
                <div className="text-gray-400">
                  &copy; 2024 ZDesigner AI. All rights reserved.
                </div>
              </div>
            </footer>
          </section>
        ) : null}
      </main>
      <style jsx>{`
      .nw-formouter {
        align-items: center; /* Ensures that items are centered vertically */
      }
      .custom-select-container {
        position: relative;
        z-index: 10;
      }
      .custom-select-label {
        display: block;
        font-size: 0.875rem; /* text-sm */
        font-weight: 500; /* medium */
        color: white; /* white text */
      }
      .custom-select {
        display: block;
        width: 100%;
        margin-top: 0.25rem; /* mt-1 */
        padding: 0.5rem 1rem;
        border: 2px solid #8b57d3;
        border-radius: 0.375rem; /* rounded-md */
        background-color: black; /* black background */
        color: white; /* white text */
        font-weight: bold;
        transition: all 0.3s ease;
        box-shadow: 0 1px 2px 0 rgba(139, 87, 211, 0.5); /* purple shadow */
      }
      .custom-select:hover {
        border-color: #7a4cc1;
      }
      .custom-select:focus {
        outline: none;
        box-shadow: 0 0 0 3px rgba(123, 76, 193, 0.5); /* focus-visible */
      }
      
      .relative {
        position: relative;
        overflow: hidden;
        width: 100%;
        max-width: 600px; /* Adjust the max-width to control the slider width */
        height: 300px; /* Adjust the height as needed */
        margin: 0 auto; /* Center the slider */
        border-radius: 15px; /* Rounded corners */
      }
      
      .before-image,
      .after-image {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: cover;
        background-position: center;
        border-radius: 15px; /* Rounded corners */
      }
      
      .before-image {
        clip-path: polygon(0 0, 50% 0, 50% 100%, 0 100%);
      }
      
      .after-image {
        clip-path: polygon(50% 0, 100% 0, 100% 100%, 50% 100%);
      }
      
      .slider-stick {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        width: 2px; /* Increased width for better visibility */
        background-color: white;
        cursor: ew-resize;
        z-index: 10;
      }
      
      .slider-stick:hover {
        width: 2px;
      }
      
      .card img {
        width: 100%;
        height: auto;
      }
      
      .card .p-6 {
        overflow: hidden;
        white-space: normal;
        text-overflow: ellipsis;
      }
      
      .card {
        border-radius: 0.75rem; /* Rounded corners */
      }
      
      .card .group:hover .p-6 {
        color: #fff;
      }
      
      .bg-gradient-to-r {
        background: linear-gradient(90deg, var(--tw-gradient-stops));
      }
      
      .from-indigo-500 {
        --tw-gradient-from: #6366f1;
        --tw-gradient-stops: var(--tw-gradient-from),
          var(--tw-gradient-to, rgba(99, 102, 241, 0));
      }
      
      .to-purple-600 {
        --tw-gradient-to: #7c3aed;
      }
      
      .from-green-500 {
        --tw-gradient-from: #10b981;
        --tw-gradient-stops: var(--tw-gradient-from),
          var(--tw-gradient-to, rgba(16, 185, 129, 0));
      }
      
      .to-teal-600 {
        --tw-gradient-to: #0d9488;
      }
      
      .from-red-500 {
        --tw-gradient-from: #ef4444;
        --tw-gradient-stops: var(--tw-gradient-from),
          var(--tw-gradient-to, rgba(239, 68, 68, 0));
      }
      
      .to-pink-600 {
        --tw-gradient-to: #db2777;
      }    
      
      .animate-fadeIn {
        animation: fadeIn 1s ease-in-out;
      }
      .animate-fadeInDelay {
        animation: fadeIn 1s ease-in-out 0.5s;
      }
      .animate-slideInLeft {
        animation: slideInLeft 1s ease-in-out;
      }
      .animate-slideInLeftDelay {
        animation: slideInLeft 1s ease-in-out 0.5s;
      }
      .animate-slideInRight {
        animation: slideInRight 1s ease-in-out;
      }
      .animate-slideInRightDelay {
        animation: slideInRight 1s ease-in-out 0.5s;
      }
      .animate-slideInUp {
        animation: slideInUp 1s ease-in-out;
      }
      .animate-zoomIn {
        animation: zoomIn 1s ease-in-out;
      }

      @keyframes gradientBackground {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }
      @keyframes slideInLeft {
        from {
          transform: translateX(-100%);
        }
        to {
          transform: translateX(0);
        }
      }
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
        }
        to {
          transform: translateX(0);
        }
      }
      @keyframes slideInUp {
        from {
          transform: translateY(100%);
        }
        to {
          transform: translateY(0);
        }
      }
      @keyframes zoomIn {
        from {
          transform: scale(0);
        }
        to {
          transform: scale(1);
        }
      }
      
      .word-change {
        display: inline-block;
        position: relative;
        overflow: hidden;
        height: 1.2em;
        width: 7em;
      }
      
      .word {
        position: absolute;
        width: 100%;
        text-align: center;
      }
      
      .text-changing-color {
        color: #8b57d3;
      }
      
      .hidden {
        visibility: hidden;
      }
      .visible {
        visibility: visible;
      }      

      @media (max-width: 768px) {
        .nw-formouter {
          flex-direction: column;
          align-items: center;
        }
        .nw-formouter > div {
          width: 100%;
        }
        .nw-formouter button {
          margin-top: 16px;
        }
      }      
      `}</style>
    </>
  );
}
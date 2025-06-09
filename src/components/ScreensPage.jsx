"use client";
const ScreensPage = () => {
  return (
    <div className="min-h-screen">
      {/* Upper Part */}
      <div className=" flex flex-col md:flex-row justify-between items-center p-5 bg-white">
        <div className="text-center md:text-left">
          <h1 className="text-xl font-bold">Screens</h1>
          <h2 className="text-lg text-gray-600">Screen 1 MG Road</h2>
          <p className="text-sm text-gray-500">Manage screen and content</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 rounded-md px-4 py-2 text-white shadow-md transition-all">
            + Add Screen to Cart
          </button>
        </div>
      </div>
      {/* Image Part */}
      <div className="flex flex-wrap justify-center gap-5 p-5">
        <div className="h-44 w-64 bg-gray-400 text-center flex items-center justify-center ">img1</div>
        <div className="h-44 w-64 bg-gray-400 text-center flex items-center justify-center ">img1</div>
        <div className="h-44 w-64 bg-gray-400 text-center flex items-center justify-center ">img1</div>
        <div className="h-44 w-64 bg-gray-400 text-center flex items-center justify-center ">img1</div>
      </div>

      {/* Third Part */}
      <div className="flex flex-col md:flex-row gap-5 p-5">
        {/* Left Box */}
        <div className="md:w-[45%] w-full rounded-lg p-5 bg-white ">
          <div className="space-y-2 ">
            <p className="text-gray-600">Slots available - <span className="font-semibold">230s</span></p>
            <p className="text-gray-600">Slots filled - <span className="font-semibold">110s</span></p>
            <p className="text-gray-600">Orientation - <span className="font-semibold">Vertical</span></p>
            <p className="text-gray-600">Resolution - <span className="font-semibold">1080 x 1920</span></p>
          </div>
        </div>

        {/* Right Box */}
        <div className="md:w-[30%] w-full rounded-lg p-5 ">
          <div className="bg-gray-500 text-white p-5 rounded-md text-center space-y-2">
            <h1 className="text-lg font-semibold">Calculator</h1>
            <p>Content Duration</p>
            <p>Impressions per Hour</p>
            <p>Impressions per Day</p>
            <p>Impressions per Month</p>
          </div>
        </div>
      </div>

     
    </div>
  );
};

export default ScreensPage;

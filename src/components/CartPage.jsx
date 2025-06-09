"use client";
import { useState } from "react";

const cardtData = [
  {
    id: 1,
    screanLocation: "screen 1 MG Road",
    price: 4500,
    seatAvailable: 230,
    slotFiled: 110,
    orientation: "vertical",
    Resulation: 1080 * 1930,
    img: "https://t4.ftcdn.net/jpg/05/35/89/57/360_F_535895778_VxaSknSuTdMmXLvfL4Almhjg5qZJins1.jpg",
  },
  {
    id: 2,
    screanLocation: "screen 2 MG Road",
    price: 4500,
    seatAvailable: 230,
    slotFiled: 110,
    orientation: "vertical",
    Resulation: 1080 * 1930,
    img: "https://t4.ftcdn.net/jpg/05/35/89/57/360_F_535895778_VxaSknSuTdMmXLvfL4Almhjg5qZJins1.jpg",
  },
  {
    id: 3,
    screanLocation: "screen 3 MG Road",
    price: 4500,
    seatAvailable: 230,
    slotFiled: 110,
    orientation: "vertical",
    Resulation: 1080 * 1930,
    img: "https://t4.ftcdn.net/jpg/05/35/89/57/360_F_535895778_VxaSknSuTdMmXLvfL4Almhjg5qZJins1.jpg",
  },
  {
    id: 4,
    screanLocation: "screen 4 MG ROAD",
    price: 4500,
    seatAvailable: 230,
    slotFiled: 110,
    orientation: "vertical",
    Resulation: 1080 * 1930,
    img: "https://t4.ftcdn.net/jpg/05/35/89/57/360_F_535895778_VxaSknSuTdMmXLvfL4Almhjg5qZJins1.jpg",
  },
  {
    id: 5,
    screanLocation: "screen 5 MG ROAD",
    price: 4500,
    seatAvailable: 230,
    slotFiled: 110,
    orientation: "vertical",
    Resulation: 1080 * 1930,
    img: "https://t4.ftcdn.net/jpg/05/35/89/57/360_F_535895778_VxaSknSuTdMmXLvfL4Almhjg5qZJins1.jpg",
  },
];

const CartPage = () => {
  const [counter, setCounter] = useState(15);

  const increment = () => setCounter(counter + 1);
  const decrement = () => setCounter(counter - 1);

  return (
    <div>
      <div className="flex md:flex-row flex-col justify-center align-middle gap-2 m-8">
        {/* Left Part */}
        <div className="h-full md:w-[60%] w-full">
          <ul>
            {cardtData.map((item) => {
              return (
                <div key={item.id} className="m-4 p-4 rounded-lg bg-white">
                  {/* Header Section */}
                  <div className="flex justify-between items-center mb-4 shadow-sm p-2 md:w-[70%] w-full">
                    <img
                      className="h-8 w-8 rounded-full object-cover"
                      src={item.img}
                      alt="item"
                    />
                    <div className=" text-gray-700">{item.screanLocation}</div>
                    <div className="text-sm">IDR {item.price}/10s</div>
                  </div>

                  {/* Details Section */}
                  <div className="text-xs text-gray-600 space-y-2">
                    <div className="flex justify-between">
                      <div>
                        {/* Detail */}
                        <div className="flex ">
                          <span className="font-medium mt-2">
                            Slots Available:
                          </span>
                          <span className="font-medium mt-2">
                            {item.seatAvailable}
                          </span>
                        </div>
                        <div className="flex">
                          <span className="font-medium mt-2">
                            Slots Filled:
                          </span>
                          <span className="font-medium mt-2">
                            {item.slotFiled}
                          </span>
                        </div>
                        <div className="flex">
                          <span className="font-medium mt-2">Orientation:</span>
                          <span className="font-medium mt-2">
                            {item.orientation}
                          </span>
                        </div>
                        <div className="flex">
                          <span className="font-medium mt-2">Resolution:</span>
                          <span className="font-medium mt-2">
                            {item.Resulation}
                          </span>
                        </div>
                      </div>

                      {/* Counter Buttons */}
                      <div className="flex items-center">
                        <button
                          className="bg-blue-500 p-2 rounded text-white"
                          onClick={decrement}
                        >
                          -
                        </button>
                        <div className="bg-gray-200 text-md p-2 font-semibold rounded">
                          {counter}
                        </div>
                        <button
                          className="bg-blue-500 text-white p-2 rounded"
                          onClick={increment}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </ul>
        </div>

        {/* Right Part */}
        <div className="h-full md:w-[40%] w-full">
          <div className="flex justify-end m-2">
            <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm p-2 rounded">
              + Make Payment
            </button>
          </div>
          <div className="m-5 bg-gray-400 p-5 rounded-md">
            {/* Total */}
            <div className="gap-3">
              <h1 className="text-center">Total</h1>
              <p className="text-center mt-2">screen 1 - 10s * 2000</p>
              <p className="text-center mt-2">screen 1 - 10s * 2000</p>
              <p className="text-center mt-2">screen 1 - 10s * 2000</p>
              <p className="text-center mt-2">screen 1 - 10s * 2000</p>
              <p className="text-center mt-2">screen 1 - 10s * 2000</p>
              <div className="flex justify-between items-center mt-2">
                <p className="text-center">Total</p>
                <span>44000</span>
              </div>

              <div className=" flex justify-center align-middle items-center">
                <button className=" w-[30%] bg-gray-600 hover:bg-gray-500 text-white text-sm p-2 rounded mt-2">
                  Coupon
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

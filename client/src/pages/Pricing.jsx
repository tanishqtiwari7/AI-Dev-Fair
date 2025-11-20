import React from "react";
import { BsCheckSquareFill } from "react-icons/bs";
import { Link } from "react-router-dom";

const Pricing = () => {
  return (
    <div className="bg-light-lavender min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="border-2 border-dark-lavender   border-dashed p-8 rounded-2xl flex flex-col items-center justify-center gap-6 bg-white shadow-2xl">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-dark-lavender mb-2 font-simple-nunito">
              Free
            </h1>
            <h1 className="font-simple-nunito text-sm text-dark-lavender">
              for Now
            </h1>
            <p className="text-gray-600 text-lg md:mt-5">
              Get started with all our tools
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 w-full">
            <Link className="rounded-full bg-dark-lavender hover:bg-dark-lavender/80 text-white px-8 py-3 font-semibold text-lg transition-colors duration-200 shadow-lg "
              to="/login"
            >
              Start Working Now
            </Link>

            <div className="text-center">
              <h2 className="text-gray-700 font-sm mb-1 md:mt-3">
                No Credits Required
              </h2>
              <p className="text-gray-500 text-sm">
                Many more features coming soon...
              </p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4 w-full">
            <div className="text-center space-y-2">
              <div className="flex items-center  gap-2 text-gray-600">


                <BsCheckSquareFill
                  className="text-dark-lavender text-sm flex-shrink-0"
                  aria-hidden="true"
                />

                <span className="font-medium">All Current Tools Included</span>
              </div>
              <div className="flex items-center  gap-2 text-gray-600">

                <BsCheckSquareFill
                  className="text-dark-lavender text-sm flex-shrink-0"
                  aria-hidden="true"
                />

                <span className="font-medium">Lightning Fast Performance</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">

                <BsCheckSquareFill
                  className="text-dark-lavender text-sm flex-shrink-0"  aria-hidden="true"
                />

                <span className="font-medium">Privacy First</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;

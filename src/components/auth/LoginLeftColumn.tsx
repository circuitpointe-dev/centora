import React from "react";
import womanImage from "@/assets/images/woman.png";
import blackLogo from "@/assets/images/black_logo.png";
import starAsset from "@/assets/images/four_star.png";
import violet_logo from "@/assets/images/centora_logo.png";

type LoginLeftColumnProps = {
  full?: boolean;
};

const LoginLeftColumn = ({ full = false }: LoginLeftColumnProps) => {
  // Stars configuration for the left column
  const stars = [
    { top: "8%", left: "10%", size: "24px" },
    { top: "15%", right: "15%", size: "16px" },
    { top: "30%", left: "15%", size: "20px" },
    { top: "25%", right: "25%", size: "14px" },
    { top: "45%", left: "8%", size: "18px" },
    { top: "50%", right: "12%", size: "22px" },
    { top: "65%", left: "18%", size: "16px" },
    { top: "75%", right: "18%", size: "20px" },
    { top: "85%", left: "22%", size: "14px" },
    { top: "70%", right: "8%", size: "18px" },
  ];

  return (
    <div className={`hidden lg:flex ${full ? 'lg:w-full h-full' : 'lg:w-1/2'} items-center justify-end mr-auto px-8 bg-white`}>
      <div className={`relative w-full ${full ? 'h-full max-w-none' : 'min-h-[300px] h-96 max-w-sm'}`}>
        {/* Violet colored rectangle background with gradient */}
        <div
          className="absolute inset-0 rounded-xl shadow-lg z-0"
          style={{
            background: "linear-gradient(to bottom, #a37aea 0%, #7c3aed 100%)",
          }}
        ></div>

        {/* Stars scattered using imported star asset */}
        {stars.map((star, index) => (
          <div
            key={index}
            className="absolute z-10"
            style={{
              top: star.top,
              left: star.left,
              right: star.right,
            }}
          >
            <img
              src={starAsset}
              alt=""
              style={{ width: star.size, height: star.size }}
              className="opacity-80"
            />
          </div>
        ))}

        {/* Woman image positioned at the bottom of the rectangle */}
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-center z-20">
          <div className="text-center w-4/5">
            <img src={womanImage} alt="" className="w-full" />
          </div>
        </div>

        {/* Transparent blurred rectangle with logo and text */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white bg-opacity-30 backdrop-blur-md px-8 py-4 rounded-xl z-30 w-5/6">
          <div className="flex justify-center mb-2">
            <img src={violet_logo} alt="Centora ERP Logo" className="w-auto h-10" />
          </div>
          <h2 className="text-black text-lg font-semibold text-center">
            Your NGO's Digital Partner
          </h2>
          <p className="text-black text-sm text-center mt-1">
            Built for Purpose. By NGOs, For NGOs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginLeftColumn;

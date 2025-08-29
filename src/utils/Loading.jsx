import React from "react";
import { BounceLoader, ClipLoader, PuffLoader, RingLoader } from "react-spinners";

export const LoadingSpinner = ({
  size = 50,
  color = "#6366f1", // Indigo-500
  type = "clip",
  loading = true,
  height = "40vh",
  className = "",
}) => {
  const loaders = {
    clip: <ClipLoader size={size} color={color} loading={loading} />,
    puff: <PuffLoader size={size} color={color} loading={loading} />,
    ring: <RingLoader size={size} color={color} loading={loading} />,
    BounceLoader: <BounceLoader size={size} color={color} loading={loading} />,
  };

  return (
    <div className={`flex items-center justify-center ${className}`} style={{ height: height }}>
      {loaders[type]}
    </div>
  );
};

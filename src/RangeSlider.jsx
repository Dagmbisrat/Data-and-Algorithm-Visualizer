import React, { useState } from "react";

const RangeSlider = () => {
  const [value, setValue] = useState(50);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <input
      type="range"
      min="0"
      max="100"
      value={value}
      onChange={handleChange}
      style={{ width: "100%" }}
    />
  );
};

export default RangeSlider;


import React, { useState, useRef, useEffect } from 'react';

const OTPInput = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (e, index) => {
    const { value } = e.target;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    // Allow only single digit
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Check if this input is filled and not the last input
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }

    // Check if all inputs are filled
    const filledOtp = newOtp.join('');
    if (filledOtp.length === length && !filledOtp.includes('')) {
      onComplete(filledOtp);
    }
  };

  const handleKeyDown = (e, index) => {
    // Navigate backwards when backspace is pressed and input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    // Navigate forward with right arrow key
    else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
    // Navigate backward with left arrow key
    else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // Check if pasted content is all numbers
    if (!/^\d+$/.test(pastedData)) return;
    
    const newOtp = [...otp];
    for (let i = 0; i < Math.min(length, pastedData.length); i++) {
      newOtp[i] = pastedData[i];
    }
    
    setOtp(newOtp);
    
    // Focus appropriate input after paste
    const focusIndex = Math.min(length - 1, pastedData.length);
    inputRefs.current[focusIndex].focus();
    
    // Check if complete
    if (pastedData.length >= length) {
      const otpValue = newOtp.join('');
      onComplete(otpValue);
    }
  };

  // Function to focus specific input on click
  const handleFocus = (index) => {
    inputRefs.current[index].select();
  };

  return (
    <div className="flex justify-center space-x-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          ref={(el) => (inputRefs.current[index] = el)}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={index === 0 ? handlePaste : null}
          onClick={() => handleFocus(index)}
          maxLength={1}
          className="w-12 h-12 text-2xl border border-gray-300 rounded-md text-center focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
        />
      ))}
    </div>
  );
};

export default OTPInput;


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

    // Check if all inputs are filled
    const otpValue = newOtp.join('');
    if (otpValue.length === length) {
      onComplete(otpValue);
    }

    // Auto focus next input
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Focus previous input on backspace if current input is empty
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    
    // Check if pasted content is all numbers and correct length
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
    const otpValue = newOtp.join('');
    if (otpValue.length === length) {
      onComplete(otpValue);
    }
  };

  return (
    <div className="flex justify-center space-x-3">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          ref={(el) => (inputRefs.current[index] = el)}
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          maxLength={1}
          className="w-12 h-12 text-2xl border border-gray-300 rounded-md text-center focus:border-primary focus:outline-none"
        />
      ))}
    </div>
  );
};

export default OTPInput;

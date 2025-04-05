
import React, { useState } from 'react';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const OTPInput = ({ length = 6, onComplete }) => {
  const [value, setValue] = useState("");

  const handleValueChange = (newValue) => {
    setValue(newValue);
    
    // If the OTP is complete, call the onComplete callback
    if (newValue.length === length) {
      onComplete && onComplete(newValue);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <InputOTP
        maxLength={length}
        value={value}
        onChange={handleValueChange}
        render={({ slots }) => (
          <InputOTPGroup className="gap-2">
            {slots.map((slot, index) => (
              <InputOTPSlot 
                key={index} 
                {...slot}
                className="w-10 h-12 text-lg border-gray-300 focus:border-primary"
              />
            ))}
          </InputOTPGroup>
        )}
      />
    </div>
  );
};

export default OTPInput;

import React, { useState } from "react";
import { setUpRecaptcha } from "../../firebase.js";
import { auth } from "../../firebase.js";

export default function PhoneLogin() {
  const [phone, setPhone] = useState("");
  const [otp, setOTP] = useState("");
  const [confirmObj, setConfirmObj] = useState(null);
  const [step, setStep] = useState(1);

  const handleSendOTP = async () => {
    if (phone.length !== 10) return alert("Enter a valid 10 digit number");

    try {
      const response = await setUpRecaptcha("+91" + phone);
      setConfirmObj(response);
      setStep(2);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) return alert("Enter OTP");

    try {
      const result = await confirmObj.confirm(otp);
      const user = result.user;

      alert("Login successful!");
      console.log("User:", user);
    } catch (error) {
      alert("Invalid OTP");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="text-center mb-3">Login with Phone</h3>

      {step === 1 && (
        <>
          <input
            className="form-control mb-3"
            placeholder="Enter phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <div id="recaptcha-container"></div>

          <button
            className="btn btn-primary w-100"
            onClick={handleSendOTP}
          >
            Send OTP
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <input
            className="form-control mb-3"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOTP(e.target.value)}
          />

          <button
            className="btn btn-success w-100"
            onClick={handleVerifyOTP}
          >
            Verify OTP
          </button>
        </>
      )}
    </div>
  );
}

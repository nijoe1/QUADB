import React, { useState } from "react";
import lighthouse from "@lighthouse-web3/sdk";
import axios from "axios";
import { generateLighthouseJWT } from "@/utils/IPFS";
import { useWalletClient } from "wagmi";

const StepperForm: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  address: string;
}> = ({ isOpen, onClose, address }) => {
  const { data: walletClient } = useWalletClient();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [apiClicked, setApiClicked] = useState(false);
  const [tokenClicked, setTokenClicked] = useState(false);

  const generateLighthouseApiKey = async (address: any) => {
    if (typeof localStorage === "undefined") {
      return;
    }

    let key = localStorage.getItem(`API_KEY_${address?.toLowerCase()}`);

    if (!key) {
      const verificationMessage = (
        await axios.get(
          `https://api.lighthouse.storage/api/auth/get_message?publicKey=${address}`
        )
      ).data;
      let signed;
      if (walletClient) {
        signed = await walletClient?.signMessage({
          account: address as `0x${string}`,
          message: verificationMessage,
        });
      } else {
        return;
      }

      const API_KEY = await lighthouse.getApiKey(address, signed);
      if (API_KEY.data.apiKey) {
        localStorage.setItem(
          `API_KEY_${address?.toLowerCase()}`,
          API_KEY.data.apiKey
        );
        nextStep();
      } else {
        setApiClicked(!apiClicked);
      }
    } else {
      let JWT;
      try {
        JWT = localStorage.getItem(`lighthouse-jwt-${address}`);
      } catch {}
      if (JWT) {
        setCurrentStep(0);
        onClose();
      } else {
        nextStep();
      }
    }
  };

  const generateLighthouseJWToken = async (address: string) => {
    let key = localStorage.getItem(`lighthouse-jwt-${address}`);
    if (!key) {
      const response = await lighthouse.getAuthMessage(address);

      let signed;
      if (walletClient) {
        signed = await walletClient?.signMessage({
          account: address as `0x${string}`,
          message: response.data.message,
        });
      } else {
        return;
      }

      if (response && response.data && response.data.message) {
        let res = await generateLighthouseJWT(address, signed);
        if (res) {
          localStorage.setItem(`lighthouse-jwt-${address.toLowerCase()}`, res);
          nextStep();
        } else {
          setTokenClicked(!tokenClicked);
        }
      }
    }
  };


  const steps = [
    {
      title: "Connect to Lighthouse",
      description: "To upload files on IPFS and Filecoin.",
      buttonText: "Connect to Lighthouse",
    },
    {
      title: "Create Lighthouse Token",
      description: "To encrypt your files with ease.",
      buttonText: "Create Lighthouse JWT",
    },
  ];

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const closeModal = () => {
    setCurrentStep(0);
    onClose();
  };

  return (
    <div
      className={`${
        isOpen
          ? "fixed inset-0 flex flex-col items-center text-center mx-auto justify-center z-50"
          : "hidden"
      }`}
    >
      <div className="fixed inset-0 bg-gray-700 opacity-70"></div>
      <div className=" bg-white p-8 rounded flex flex-col items-center text-center mx-auto shadow-lg relative z-10">
        <div className="flex flex-col items-center text-center">
          <h3 className="text-xl font-semibold mb-4">{`${steps[currentStep].title}`}</h3>
          <p className="mb-6">{steps[currentStep].description}</p>

          {currentStep === 0 && (
            <button
              disabled={apiClicked}
              onClick={async () => {
                setApiClicked(!apiClicked);
                await generateLighthouseApiKey(address);
              }}
              className="bg-black text-white py-2 px-4 rounded-lg mt-4"
            >
              {steps[currentStep].buttonText}
            </button>
          )}
          {currentStep === 1 && (
            <button
              disabled={tokenClicked}
              onClick={async () => {
                setTokenClicked(!tokenClicked);
                await generateLighthouseJWToken(address);
                closeModal();
              }}
              className="bg-black text-white py-2 px-4 rounded-lg mt-4"
            >
              {steps[currentStep].buttonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepperForm;

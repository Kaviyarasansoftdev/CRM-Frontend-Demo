import { useEffect } from "react";
import AppRouter from "./Router/Approuter";
import { Toaster } from 'react-hot-toast';
import { HSStaticMethods } from "preline";

HSStaticMethods.autoInit();

const observer = new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    HSStaticMethods.autoInit();
  }
});

observer.observe(document.body, {
  attributes: true,
  subtree: true,
  childList: true,
  characterData: true,
});

export default function App() {

  // useEffect(() => {
  //   if (window.location.hostname === '52.65.221.18:5000') {
  //     window.location.href = 'http://52.65.221.18:5000';
  //   }
  // }, []);

  return (
    <div>
      <AppRouter/>
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  )
}
/* eslint-disable */
import axios from "axios";
import { showAlert } from "./alerts";

export const bookTour = async (tourId, navigate) => {
  try {
    // 1) Get checkout session from API
    const session = await axios.get(
      `/api/v1/bookings/checkout-session/${tourId}`
    );

    // 2) Initialize Paystack payment
    const handler = PaystackPop.setup({
      key: `pk_test_631fad6b46bc87bc616ab813191a53f65df63fb9`, // Replace with your Paystack public key
      email: session.data.user.email, // Ensure API returns user email
      amount: session.data.data.amount * 100, // Convert to kobo (Paystack uses smallest currency unit)
      currency: "NGN",
      ref: session.data.data.reference, // Use transaction reference from API
      callback: async function (response) {
        if (response.status === "success") {
          showAlert("success", "Purchased successfully");

          const removeQueryParam = (redirectUrl, paramToRemove) => {
            const urlObj = new URL(redirectUrl);
            urlObj.searchParams.delete(paramToRemove);
            return urlObj.origin + urlObj.pathname + urlObj.search;
          };
          window.setTimeout(() => {
            location.assign(removeQueryParam(response.redirecturl, "trxref"));
          }, 1500);
        } else {
          showAlert("error", "Purchased failed");

          window.setTimeout(() => {
            location.assign("/");
          }, 1500);
        }

        // 3) Verify payment with backend
      },
      onClose: function () {
        navigate("/payment-cancelled"); // Redirect if user closes payment window
      },
    });

    handler.openIframe();
  } catch (error) {
    console.error("Error initializing payment:", error);
  }
};

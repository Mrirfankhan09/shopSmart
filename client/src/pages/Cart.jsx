import React from "react";
import CartItem from "../components/shared/CartItem";
import axios from "axios";
import { useState, useEffect } from "react";

const Cart = ({ cart, removeItem }) => {
  const [amount, setAmount] = useState(0);
  const [user, setUser] = useState(null);
  const [address, setAddress] = useState([]);

  console.log(cart, 'cart in Cart component');

  const getme = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/users/profile", {
        withCredentials: true
      })
      console.log(response.data, 'User data fetched successfully');
      setUser(response.data.user);

    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }




  const handleCheckout = async () => {
    try {
      // Select the address (e.g., first address in the array)
      console.log(address, 'address in handleCheckout');
      const addressId = address[0]?._id;
      if (!addressId) {
        alert("Please add/select a shipping address.");
        return;
      }

      const paymentMethod = "razorpay"; // or "cod", etc.
      const amount = cart.totalPrice;

      // Create order on backend
      const { data } = await axios.post(
        "http://localhost:8000/api/order",
        { addressId, paymentMethod, amount },
        { withCredentials: true }
      );

      // Razorpay options
      const options = {
        key: "rzp_test_CqbkBvwwlgejeB", // from Razorpay Dashboard
        amount: amount * 100,
        currency: "INR",
        name: "shopSmart",
        description: "Order Payment",
        order_id: data.orderId, // from backend
        handler: function (response) {
          alert("Payment successful!");
          console.log(response);
          // Optionally: confirm payment to backend, show summary, redirect, etc.
        },
        prefill: {
          name: user?.name,
          email: user?.email,
        },
        notes: {
          address: address[0] ? `${address[0].street}, ${address[0].city}` : "No address provided",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } catch (error) {
      console.log("Checkout failed", error);
      alert("Checkout failed");
    }
  };
  const fetchAddresses = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/address", {
        withCredentials: true
      });
      console.log(response.data, 'Addresses fetched successfully');
      setAddress(response.data.data);
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };


  useEffect(() => {
    getme();
    fetchAddresses();
  }, []);





  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6">Your Cart</h2>
      {/* Cart Items */}
      <div>
        {

          cart.cartItems && cart.cartItems.length > 0 ? (cart.cartItems.map((item) => (
            <CartItem key={item._id} cart={item} removeItem={removeItem} />
          ))) : (
            <div className="text-center text-gray-500 text-lg py-10">
              Your cart is empty.
            </div>
          )
        }
      </div>
      {/* Cart Summary */}
      <div className="border-t pt-6 mt-6 flex flex-col items-end">
        <div className="text-lg font-semibold mb-2">Total: <span className="text-blue-700">₹{cart.totalPrice}</span></div>
        <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-lg transition" onClick={handleCheckout}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
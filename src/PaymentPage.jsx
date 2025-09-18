import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function PaymentPage() {
  const [paymentUrl, setPaymentUrl] = useState("");
  const [collectId, setCollectId] = useState("");
  const [status, setStatus] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const BASE_URL = "https://edveron-backend.onrender.com";

  const getTransaction = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/order/transactions`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      const res = await response.json();
      setTransactions(res);
    } catch (err) {
      console.log("Error fetching transactions:", err.message);
    }
  };

  const AddWebhook = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/order/webhook`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: 200,
          order_info: {
            order_id: collectId,
            order_amount: 2000,
            transaction_amount: 2200,
            gateway: "PhonePe",
            bank_reference: "YESBNK222",
            status: "success",
            payment_mode: "upi",
            payment_details: "success@ybl",
            payment_message: "payment success",
            payment_time: "2025-04-23T08:14:21.945+00:00",
            error_message: "NA",
          },
        }),
      });

      const res = await response.json();
      console.log("Webhook response:", res);
    } catch (err) {
      console.log("Webhook error:", err.message);
    }
  };

  const createPayment = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/order/create-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          school_id: "65b0e6293e9f76a9694d84b4",
          order_amount: 1,
          callback_url: "https://google.com",
        }),
      });

      const data = await response.json();
      console.log("Payment Created:", data);

      if (data.data?.collect_request_url && data.data?.collect_request_id) {
        setPaymentUrl(data.data.collect_request_url);
        setCollectId(data.data.collect_request_id);
      }
    } catch (err) {
      console.error("Error creating payment:", err.message);
    }
  };

  const checkStatus = async () => {
    if (!collectId) return alert("⚠️ No collect ID found!");
    try {
      const response = await fetch(
        `${BASE_URL}/api/order/payment-status/${collectId}?school_id=65b0e6293e9f76a9694d84b4`,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log("Payment Status:", data);
      setStatus(data);
    } catch (err) {
      console.error("Error checking status:", err.message);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="text-center py-4">
          <h1 className="text-3xl font-extrabold text-blue-800">
            School Payment Portal
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and test payment integrations with ease.
          </p>
        </header>

        <section className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200 transition-transform transform hover:scale-105 duration-300">
          <h2 className="font-bold text-xl text-gray-800 flex items-center gap-2">
            <span className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">1</span>
            Create a New Payment
          </h2>
          <p className="text-gray-500 mt-2 text-sm">Initiate a test payment request for a specific school ID.</p>
          <div className="mt-5 space-y-4">
            <button
              onClick={createPayment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-colors duration-300"
            >
              🚀 Create Payment
            </button>
            {paymentUrl && (
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-4 bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <a
                  href={paymentUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-700 font-semibold underline text-center md:text-left hover:text-blue-900 transition-colors"
                >
                  Click to Pay 👉
                </a>
                <button
                  onClick={checkStatus}
                  className="w-full md:w-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition-colors duration-300"
                >
                  Check Status
                </button>
              </div>
            )}
            {status && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                <h3 className="font-semibold text-gray-700 mb-2">Payment Status Response:</h3>
                <pre className="text-xs text-gray-700 overflow-auto whitespace-pre-wrap font-mono leading-relaxed">
                  {JSON.stringify(status, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </section>

        <section className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200 transition-transform transform hover:scale-105 duration-300">
          <h2 className="font-bold text-xl text-gray-800 flex items-center gap-2">
            <span className="bg-teal-100 text-teal-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">2</span>
            Webhook Tester
          </h2>
          <p className="text-gray-500 mt-2 text-sm">Manually simulate a success webhook callback for an order ID.</p>
          <div className="flex flex-col md:flex-row gap-3 mt-5">
            <input
              type="text"
              placeholder="Enter Collect ID"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
              onChange={(e) => setCollectId(e.target.value)}
            />
            <button
              onClick={AddWebhook}
              className="w-full md:w-auto bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-colors duration-300"
            >
              🔌 Send Webhook
            </button>
          </div>
        </section>

        <section className="bg-white shadow-xl rounded-2xl p-6 border border-gray-200 transition-transform transform hover:scale-105 duration-300">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-xl text-gray-800 flex items-center gap-2">
              <span className="bg-gray-100 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">3</span>
              All Transactions
            </h2>
            <button
              onClick={getTransaction}
              className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 px-5 rounded-xl shadow-md transition-colors duration-300"
            >
              🔄 Refresh List
            </button>
          </div>
          <p className="text-gray-500 text-sm mb-4">View a list of all transactions and their details.</p>
          {transactions.length > 0 ? (
            <div className="overflow-x-auto mt-4 border border-gray-200 rounded-xl">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 text-left">Collect ID</th>
                    <th className="px-4 py-3 text-left">School ID</th>
                    <th className="px-4 py-3 text-left">Order Amount</th>
                    <th className="px-4 py-3 text-left">Transaction Amount</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((tx, index) => (
                    <tr key={index} className="bg-white even:bg-gray-50 hover:bg-gray-100">
                      <td className="px-4 py-3 font-medium text-gray-900">{tx.collect_id}</td>
                      <td className="px-4 py-3 text-gray-600">{tx.school_id}</td>
                      <td className="px-4 py-3 text-gray-600">₹{tx.order_amount}</td>
                      <td className="px-4 py-3 text-gray-600">₹{tx.transaction_amount}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          tx.status === 'success' ? 'bg-green-100 text-green-800' :
                          tx.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-6">No transactions to display. Click "Refresh List" to load.</p>
          )}
        </section>

        <div className="text-center py-4">
          <button
            onClick={() => navigate("/transaction")}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transition-colors duration-300"
          >
            Go to Transaction Filters Page →
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentPage;

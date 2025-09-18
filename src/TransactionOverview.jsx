import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function TransactionsOverview() {
  const [transactions, setTransactions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState("all");
  const [schoolIdFilter, setSchoolIdFilter] = useState("");

  useEffect(() => {
    setStatusFilter(searchParams.get("status") || "all");
    setSchoolIdFilter(searchParams.get("schoolId") || "");

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const status = searchParams.get("status");
    const schoolId = searchParams.get("schoolId");

    fetchTransactions({ page, limit, status, schoolId });
  }, [searchParams]);

  const fetchTransactions = async ({ page, limit, status, schoolId }) => {
    try {
      const query = new URLSearchParams();
      query.set("page", page);
      query.set("limit", limit);
      if (status && status !== "all") query.set("status", status);
      if (schoolId) query.set("schoolId", schoolId);

      const res = await fetch(`http://localhost:8080/api/order/transactions1?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();
      setTransactions(data.data || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching transactions:", err.message);
    }
  };

  const handleApplyFilters = () => {
    const newParams = new URLSearchParams();
    newParams.set("page", 1);
    newParams.set("limit", 10);
    
    if (statusFilter && statusFilter !== "all") {
      newParams.set("status", statusFilter);
    }
    
    if (schoolIdFilter) {
      newParams.set("schoolId", schoolIdFilter);
    }

    setSearchParams(newParams);
  };

  const handlePageChange = (page) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", page);
    setSearchParams(newParams);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="py-4">
          <h1 className="text-3xl font-extrabold text-blue-800 text-center">
            📊 Transactions Overview
          </h1>
          <p className="text-gray-600 mt-2 text-center">
            View and filter all payment transactions.
          </p>
        </header>

        <section className="bg-white p-6 shadow-md rounded-xl border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Filters</h2>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div className="w-full md:w-1/3">
              <label className="block text-sm font-medium text-gray-700 mb-1">School ID</label>
              <input
                type="text"
                value={schoolIdFilter}
                onChange={(e) => setSchoolIdFilter(e.target.value)}
                className="w-full border-gray-300 rounded-lg shadow-sm px-4 py-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter School ID"
              />
            </div>
            <div className="w-full md:w-1/3 flex items-end h-full">
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors"
                onClick={handleApplyFilters}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </section>

        <section className="bg-white shadow-md rounded-xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 uppercase text-xs">
                <tr>
                  {["Collect ID", "School ID", "Gateway", "Order Amount", "Transaction Amount", "Status", "Custom Order ID", "Payment Time"].map((col, idx) => (
                    <th key={idx} className="px-4 py-3 text-left">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.length > 0 ? (
                  transactions.map((tx, idx) => (
                    <tr key={idx} className="bg-white even:bg-gray-50 hover:bg-gray-100">
                      <td className="px-4 py-3 font-medium text-gray-900">{tx.collect_id}</td>
                      <td className="px-4 py-3 text-gray-600">{tx.school_id}</td>
                      <td className="px-4 py-3 text-gray-600">{tx.gateway}</td>
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
                      <td className="px-4 py-3 text-gray-600">{tx.custom_order_id}</td>
                      <td className="px-4 py-3 text-gray-600">{tx.payment_time ? new Date(tx.payment_time).toLocaleString() : 'N/A'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-10 text-gray-500">
                      No transactions found. Adjust your filters or try again.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => navigate("/payment")}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-5 rounded-lg shadow-md transition-colors"
          >
            ← Back to Payment
          </button>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => handlePageChange(i + 1)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  Number(searchParams.get("page") || 1) === i + 1
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TransactionsOverview;
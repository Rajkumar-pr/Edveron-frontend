import { BrowserRouter, Routes, Route } from "react-router-dom"; // Correct import
import PaymentPage from "./PaymentPage";
import Signlog from "./Auth/Signlog";
import TransactionsOverview from "./TransactionOverview";
function App() {
  return (
    // Step 1: Wrap everything in BrowserRouter
    <BrowserRouter>
      <div className="flex h-screen items-center justify-center bg-gray-100">
   
        {/* Step 2: Define your routes inside the Routes component */}
        <Routes>
          {/* Step 3: Use the Route component to link a path to a component.
            When the path matches, the element will be rendered.
          */}
          <Route path="/" element={<Signlog />} />
          <Route path="/payment" element={<PaymentPage/>} />
  <Route path="/transaction" element={<TransactionsOverview/>} />
  </Routes>
  
      </div>
    </BrowserRouter>
  );
}

export default App;
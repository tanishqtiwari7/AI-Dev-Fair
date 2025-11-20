import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Bench from "./pages/Arena/Bench";
import ProtectedRoute from "./components/ProtectedRoute";
//import QR from "./pages/Arena/QR";

// Placeholder components for the routes

// const Pricing = () => (
//   <div className="p-8 pt-24">
//     <h1 className="text-2xl">Pricing Page</h1>
//   </div>
// );

const Roadmap = () => (
  <div className="p-8 pt-24">
    <h1 className="text-2xl">Roadmap Page</h1>
  </div>
);
const Community = () => (
  <div className="p-8 pt-24">
    <h1 className="text-2xl">Community Page</h1>
  </div>
);
const Resources = () => (
  <div className="p-8 pt-24">
    <h1 className="text-2xl">Resources Page</h1>
  </div>
);

function App() {
  const location = useLocation();
  const hideNavbarOn = ["/login", "/signup", "/arena"].some((path) =>
    location.pathname.startsWith(path)
  ); // add more paths if needed
  return (
    <>
      {!hideNavbarOn && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/community" element={<Community />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/arena/bench"
          element={
            <ProtectedRoute>
              <Bench />
            </ProtectedRoute>
          }
        />
        {/* <Route path="/arena/qr" element={<QR />}/> */}
      </Routes>
    </>
  );
}

export default App;

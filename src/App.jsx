import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import FormApp from "./components/FormApp/FormApp";
import Terms from "./pages/terms/Terms";
import PrivacyPolicy from "./pages/privacyPolicy/PrivacyPolicy";

function App() {
	return (
		<Router>
			<div className="App">
				<Routes>
					{/* Main Form Page */}
					<Route path="/" element={<FormApp />} />

					{/* Terms & Conditions Page */}
					<Route path="/terms" element={<Terms />} />

					{/* Privacy Policy Page */}
					<Route path="/privacy" element={<PrivacyPolicy />} />
				</Routes>
			</div>
		</Router>
	);
}

export default App;

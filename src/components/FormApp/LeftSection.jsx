import fepLogo from "../../assets/images/fep-logo.png";
import "./LeftSection.scss";

const LeftSection = () => {
	return (
		<div className="left-section">
			<div className="logo">
				<img src={fepLogo} alt="Logo" />
			</div>
			<div className="overlay">
				<h1>Sign Up for Final Expense Plan</h1>
				<p>Secure your future with our affordable and reliable plans.</p>
			</div>
		</div>
	);
};

export default LeftSection;

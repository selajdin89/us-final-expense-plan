import { useEffect, useState } from "react";
import { Form, Input, Select, Checkbox, Button, Row, Col, Slider } from "antd";
import { Link } from "react-router-dom"; // Import useNavigate
import flowerBg from "../../assets/images/flower-bg.png";
import couple from "../../assets/images/couple.png";
import singleFlower from "../../assets/images/single-flower.png";
import fepLogo from "../../assets/images/fep-logo.png";
import telegramIcon from "../../assets/images/telegram.png";
import arrowDown from "../../assets/images/arrow_drop_down.png";
import "./MobileFormApp.scss";

const { Option } = Select;

// Define the common style for input fields
const inputStyle = {
	border: "0.92px solid #1C5C8F33",
	height: "42px",
	borderRadius: "5.4px",
};

const selectInputStyle = {
	height: "42px",
	borderRadius: "5.4px",
};

const MobileFormApp = () => {
	const [form] = Form.useForm();
	const [isPhoneInputFocused, setIsPhoneInputFocused] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	// Save form data to sessionStorage before navigating
	const saveFormData = () => {
		const formData = form.getFieldsValue();
		sessionStorage.setItem("formData", JSON.stringify(formData));
	};

	// Retrieve form data from sessionStorage
	const loadFormData = () => {
		const savedData = sessionStorage.getItem("formData");
		if (savedData) {
			form.setFieldsValue(JSON.parse(savedData));
		}
	};

	// Clear sessionStorage on page reload
	useEffect(() => {
		const handleBeforeUnload = () => {
			sessionStorage.removeItem("formData");
		};

		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, []);

	// Load form data when the component mounts
	useEffect(() => {
		loadFormData();
	}, []);

	const onFinish = (values) => {
		setIsSubmitting(true);

		setTimeout(() => {
			console.log("Form values:", values);
			setIsSubmitting(false);
			setIsSubmitted(true);
			sessionStorage.removeItem("formData"); // Clear saved data after submission
		}, 2000);
	};

	const formatPhoneNumber = (value) => {
		if (!value) return "+1";
		let phoneNumber = value.replace(/\D/g, "");
		if (!phoneNumber.startsWith("1")) {
			phoneNumber = "1" + phoneNumber;
		}
		if (phoneNumber.length > 1) {
			return `+1 (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(
				4,
				7
			)}-${phoneNumber.slice(7, 11)}`;
		}
		return `+1`;
	};

	const formatDateOfBirth = (value) => {
		if (!value) return "";
		let date = value.replace(/\D/g, "");
		if (date.length > 2) {
			date = `${date.slice(0, 2)}/${date.slice(2, 4)}/${date.slice(4, 8)}`;
		} else if (date.length > 4) {
			date = `${date.slice(0, 2)}/${date.slice(2, 4)}/${date.slice(4, 8)}`;
		}
		return date;
	};

	useEffect(() => {
		form.setFieldsValue({ phone: "+1" });
	}, [form]);

	const onFinishFailed = (errorInfo) => {
		console.log("Failed:", errorInfo);
	};

	return (
		<div className="mobile-form-app-container">
			<img className="couple" src={couple} alt="Couple" />
			<img className="single-flower" src={singleFlower} alt="Single Flower" />
			<img className="flower-green" src={flowerBg} alt="Flower" />

			<div className="form-app">
				<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
					<img width={85} height={85} src={fepLogo} alt="Logo" />
					<h1>
						Sign Up for final <br /> expense plan
					</h1>
				</div>

				<p>Secure your loved ones&apos; future with Final Expense Insurance</p>

				{isSubmitted ? (
					<div className="success-message">
						<h2>Thank you for signing up!</h2>
						<p>
							Your information has been successfully submitted. We will contact
							you shortly to discuss your final expense plan.
						</p>
					</div>
				) : (
					<Form
						onFinish={onFinish}
						onFinishFailed={onFinishFailed}
						layout="vertical"
						form={form}
					>
						<Row gutter={16}>
							<Col span={12}>
								<Form.Item
									label="First Name"
									name="firstName"
									rules={[
										{ required: true, message: "Please enter your first name" },
									]}
								>
									<Input placeholder="Type Full Name Here" style={inputStyle} />
								</Form.Item>

								<Form.Item
									label="Date of Birth"
									name="dob"
									rules={[
										{
											required: true,
											message: "Please enter your date of birth",
										},
									]}
								>
									<Input
										placeholder="DD/MM/YYYY"
										style={inputStyle}
										onChange={(e) => {
											const formattedValue = formatDateOfBirth(e.target.value);
											form.setFieldsValue({ dob: formattedValue });
										}}
										maxLength={10}
									/>
								</Form.Item>
							</Col>

							<Col span={12}>
								<Form.Item
									label="Last Name"
									name="lastName"
									rules={[
										{ required: true, message: "Please enter your last name" },
									]}
								>
									<Input placeholder="Type Last Name Here" style={inputStyle} />
								</Form.Item>

								<Form.Item
									label="Gender"
									name="gender"
									rules={[
										{ required: true, message: "Please select your gender" },
									]}
								>
									<Select
										placeholder="Select One"
										style={selectInputStyle}
										suffixIcon={<img src={arrowDown} alt="Drop Down" />}
									>
										<Option value="male">Male</Option>
										<Option value="female">Female</Option>
										<Option value="other">Other</Option>
									</Select>
								</Form.Item>
							</Col>
						</Row>

						<Row>
							<Col span={24}>
								<Form.Item
									label="What Level of Coverage Would You Like"
									name="coverage"
								>
									<Slider
										min={0}
										max={50000}
										step={1000}
										marks={{ 0: "0", 50000: "50,000" }}
										tooltip={{ formatter: (value) => `$${value}` }}
										dots={false}
										included={false}
									/>
								</Form.Item>
							</Col>
						</Row>

						<Row gutter={16}>
							<Col span={12}>
								<Form.Item
									label="Phone Number"
									name="phone"
									rules={[
										{
											required: true,
											message: "Please enter your phone number",
										},
										{
											pattern: /^\+1 \(\d{3}\) \d{3}-\d{4}$/,
											message:
												"Please enter a valid phone number in the format +1 (***) ***-****",
										},
									]}
								>
									<Input
										placeholder={
											isPhoneInputFocused
												? "Type your phone number here"
												: "+1 (***) ***-****"
										}
										style={inputStyle}
										value={form.getFieldValue("phone")}
										onChange={(e) => {
											const digitsOnly = e.target.value.replace(/\D/g, "");
											const formattedValue = formatPhoneNumber(digitsOnly);
											form.setFieldsValue({ phone: formattedValue });
										}}
										onFocus={() => setIsPhoneInputFocused(true)}
										onBlur={() => setIsPhoneInputFocused(false)}
										inputMode="numeric"
									/>
								</Form.Item>

								<Form.Item
									label="City"
									name="city"
									rules={[
										{ required: true, message: "Please enter your city" },
									]}
								>
									<Input placeholder="Type Your City Here" style={inputStyle} />
								</Form.Item>

								<Form.Item
									label="Province"
									name="province"
									rules={[
										{ required: true, message: "Please select your province" },
									]}
								>
									<Select
										placeholder="Select One"
										style={selectInputStyle}
										suffixIcon={<img src={arrowDown} alt="Drop Down" />}
									>
										<Option value="ON">Ontario</Option>
										<Option value="QC">Quebec</Option>
										<Option value="BC">British Columbia</Option>
										<Option value="AB">Alberta</Option>
										<Option value="MB">Manitoba</Option>
										<Option value="SK">Saskatchewan</Option>
										<Option value="NS">Nova Scotia</Option>
										<Option value="NB">New Brunswick</Option>
										<Option value="NL">Newfoundland and Labrador</Option>
										<Option value="PE">Prince Edward Island</Option>
										<Option value="NT">Northwest Territories</Option>
										<Option value="YT">Yukon</Option>
										<Option value="NU">Nunavut</Option>
									</Select>
								</Form.Item>
							</Col>

							<Col span={12}>
								<Form.Item
									label="Email"
									name="email"
									rules={[
										{ required: true, message: "Please enter your email" },
										{
											type: "email",
											message: "Please enter a valid email address",
										},
									]}
								>
									<Input
										placeholder="Type your Email Here"
										style={inputStyle}
									/>
								</Form.Item>

								<Form.Item
									label="Street Address"
									name="address"
									rules={[
										{ required: true, message: "Please enter your address" },
									]}
								>
									<Input
										placeholder="Type your Address Here"
										style={inputStyle}
									/>
								</Form.Item>

								<Form.Item
									label="Postal Code"
									name="postalCode"
									rules={[
										{
											required: true,
											message: "Please enter your postal code",
										},
									]}
								>
									<Input
										placeholder="Type your Postal Code Here"
										style={inputStyle}
									/>
								</Form.Item>
							</Col>
						</Row>

						<Form.Item
							name="terms"
							valuePropName="checked"
							rules={[
								{
									required: true,
									message: "You must agree to the terms and conditions",
								},
							]}
						>
							<Checkbox>
								By getting a start, you agree to our{" "}
								<Link
									className="link"
									to="/terms"
									onClick={saveFormData} // Save form data before navigating
								>
									Terms & Conditions
								</Link>{" "}
								and{" "}
								<Link
									className="link"
									to="/privacy"
									onClick={saveFormData} // Save form data before navigating
								>
									Privacy Policy
								</Link>
								.
							</Checkbox>
						</Form.Item>

						<Form.Item>
							<Button
								style={{ backgroundColor: "#1C5C8F", border: "none" }}
								type="primary"
								htmlType="submit"
								block
								loading={isSubmitting}
							>
								<img src={telegramIcon} alt="Icon" /> Get Quote
							</Button>
						</Form.Item>
					</Form>
				)}
			</div>
		</div>
	);
};

export default MobileFormApp;

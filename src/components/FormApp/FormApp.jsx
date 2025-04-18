/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import {
	Form,
	Input,
	Select,
	Checkbox,
	Button,
	Row,
	Col,
	Slider,
	DatePicker,
} from "antd";
import { Link } from "react-router-dom";
import flowerBg from "../../assets/images/flower-bg.png";
import couple from "../../assets/images/couple.png";
import singleFlower from "../../assets/images/single-flower.png";
import fepLogo from "../../assets/images/fep-logo.png";
import telegramIcon from "../../assets/images/telegram.png";
import arrowDown from "../../assets/images/arrow_drop_down.png";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import emailjs from "@emailjs/browser";
import "./FormApp.scss";
import { AnimatePresence, motion } from "framer-motion";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import usStates from "../../data/usStates";

const { Option } = Select;

dayjs.extend(customParseFormat);

// Define the date format for the U.S.
const dateFormat = "MM/DD/YYYY";

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

const FormApp = () => {
	const [form] = Form.useForm();
	const [isPhoneInputFocused, setIsPhoneInputFocused] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);
	const [currentScreen, setCurrentScreen] = useState(1);
	const [isFirstScreenValid, setIsFirstScreenValid] = useState(false);

	// Save form data to sessionStorage before navigating
	const saveFormData = () => {
		const formData = form.getFieldsValue();
		// Convert Day.js object to string before saving
		if (formData.dob && dayjs.isDayjs(formData.dob)) {
			formData.dob = formData.dob.format(dateFormat);
		}
		sessionStorage.setItem("formData", JSON.stringify(formData));
		sessionStorage.setItem("currentScreen", currentScreen.toString());
	};

	// Retrieve form data from sessionStorage

	const loadFormData = () => {
		const savedData = sessionStorage.getItem("formData");
		if (savedData) {
			const parsedData = JSON.parse(savedData);
			// Convert string back to Day.js object
			if (parsedData.dob) {
				parsedData.dob = dayjs(parsedData.dob, dateFormat);
			}
			// If phone number exists in saved data, use it, otherwise set to "+1"
			if (!parsedData.phone) {
				parsedData.phone = "+1";
			}
			form.setFieldsValue(parsedData);
		} else {
			// Initialize phone with "+1" if no saved data exists
			form.setFieldsValue({ phone: "+1" });
		}

		const savedScreen = sessionStorage.getItem("currentScreen");
		// Default to screen 1 if no saved screen exists
		setCurrentScreen(savedScreen ? parseInt(savedScreen, 10) : 1);
	};
	// const loadFormData = () => {
	// 	const savedData = sessionStorage.getItem("formData");
	// 	if (savedData) {
	// 		const parsedData = JSON.parse(savedData);
	// 		// Convert string back to Day.js object
	// 		if (parsedData.dob) {
	// 			parsedData.dob = dayjs(parsedData.dob, dateFormat);
	// 		}
	// 		form.setFieldsValue(parsedData);
	// 	}

	// 	const savedScreen = sessionStorage.getItem("currentScreen");
	// 	if (savedScreen) {
	// 		setCurrentScreen(parseInt(savedScreen, 10));
	// 	}
	// };
	// Clear sessionStorage on page reload

	useEffect(() => {
		const handleBeforeUnload = () => {
			// Only clear if you want fresh form on reload
			// sessionStorage.removeItem("formData");
			// Or keep the data but reset the screen to 1
			sessionStorage.setItem("currentScreen", "1");
		};
		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, []);

	// useEffect(() => {
	// 	const handleBeforeUnload = () => {
	// 		sessionStorage.removeItem("formData");
	// 	};
	// 	window.addEventListener("beforeunload", handleBeforeUnload);
	// 	return () => {
	// 		window.removeEventListener("beforeunload", handleBeforeUnload);
	// 	};
	// }, []);

	// Load form data when the component mounts
	useEffect(() => {
		loadFormData();
	}, []);

	const handleNextScreen = () => {
		form
			.validateFields([
				"firstName",
				"lastName",
				"dob",
				"gender",
				"phone",
				"email",
			])
			.then(() => {
				setIsFirstScreenValid(true);
				setCurrentScreen(2);
			})
			.catch(() => {
				setIsFirstScreenValid(false);
			});
	};

	const handlePreviousScreen = () => {
		setCurrentScreen(1);
	};

	const onFinish = (values) => {
		setIsSubmitting(true);
		emailjs
			.send(
				"service_vk3pz3g", // Replace with your EmailJS Service ID
				"template_kangvxy", // Replace with your EmailJS Template ID
				values,
				"U6Ss_7DTyU7bO_pgE" // Replace with your EmailJS Public Key
			)
			.then(
				(response) => {
					console.log("Email sent successfully!", response);
					setIsSubmitting(false);
					setIsSubmitted(true);
					sessionStorage.removeItem("formData");
				},
				(error) => {
					console.error("Failed to send email:", error);
					setIsSubmitting(false);
				}
			);
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

	const validateDateOfBirth = (_, value) => {
		if (!value) {
			return Promise.reject("Please enter your date of birth");
		}

		// Handle both string and Day.js values
		const date =
			typeof value === "string" ? dayjs(value, dateFormat, true) : value;

		if (!date.isValid()) {
			return Promise.reject("Invalid date format (MM/DD/YYYY)");
		}

		const year = date.year();
		const currentYear = dayjs().year();
		if (year < 1900 || year > currentYear) {
			return Promise.reject(`Year must be between 1900 and ${currentYear}`);
		}

		const month = date.month() + 1;
		if (month < 1 || month > 12) {
			return Promise.reject("Month must be between 01 and 12");
		}

		const day = date.date();
		if (day < 1 || day > 31) {
			return Promise.reject("Day must be between 01 and 31");
		}

		if (date.date() !== day) {
			return Promise.reject("Invalid date (e.g., 02/31/2023 is not valid)");
		}

		return Promise.resolve();
	};

	const formatDateInput = (input) => {
		let date = input.replace(/\D/g, "");
		if (date.length > 2) date = `${date.slice(0, 2)}/${date.slice(2)}`;
		if (date.length > 5) date = `${date.slice(0, 5)}/${date.slice(5)}`;
		return date;
	};

	// useEffect(() => {
	// 	form.setFieldsValue({ phone: "+1" });
	// }, [form]);

	const onFinishFailed = (errorInfo) => {
		console.log("Failed:", errorInfo);
	};

	return (
		<>
			<div className="form-app-container">
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
					<p>Secure your loved ones' future with Final Expense Insurance</p>

					{isSubmitted ? (
						<div className="success-message">
							<h2>Thank you for signing up!</h2>
							<p>
								Your information has been successfully submitted. We will
								contact you shortly to discuss your final expense plan.
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
											{
												required: true,
												message: "Please enter your first name",
											},
										]}
									>
										<Input
											placeholder="Type Full Name Here"
											style={inputStyle}
										/>
									</Form.Item>
									<Form.Item
										label="Date of Birth"
										name="dob"
										rules={[{ required: true, validator: validateDateOfBirth }]}
									>
										<DatePicker
											format={dateFormat}
											placeholder="MM/DD/YYYY"
											inputRender={(props) => (
												<input
													{...props}
													inputMode="numeric"
													value={formatDateInput(props.value)}
												/>
											)}
										/>
									</Form.Item>
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
													"Please enter a valid phone number in the format +1 (XXX) XXX-XXXX",
											},
										]}
									>
										<Input
											placeholder={
												isPhoneInputFocused
													? "Type your phone number here"
													: "+1 (XXX) XXX-XXXX"
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
								</Col>
								<Col span={12}>
									<Form.Item
										label="Last Name"
										name="lastName"
										rules={[
											{
												required: true,
												message: "Please enter your last name",
											},
										]}
									>
										<Input
											placeholder="Type Last Name Here"
											style={inputStyle}
										/>
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
										label="City"
										name="city"
										rules={[
											{ required: true, message: "Please enter your city" },
										]}
									>
										<Input
											placeholder="Type Your City Here"
											style={inputStyle}
										/>
									</Form.Item>
									<Form.Item
										label="State"
										name="state"
										rules={[
											{ required: true, message: "Please select your state" },
										]}
									>
										<Select
											placeholder="Select One"
											style={selectInputStyle}
											suffixIcon={<img src={arrowDown} alt="Drop Down" />}
										>
											{usStates.map((state) => (
												<Option key={state.value} value={state.value}>
													{state.label}
												</Option>
											))}
										</Select>
									</Form.Item>
								</Col>
								<Col span={12}>
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
										label="ZIP Code"
										name="zipCode"
										rules={[
											{ required: true, message: "Please enter your ZIP code" },
											{
												pattern: /^\d{5}(-\d{4})?$/,
												message:
													"Please enter a valid ZIP code (e.g., 12345 or 12345-6789)",
											},
										]}
									>
										<Input
											placeholder="Type your ZIP Code Here"
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
									<Link className="link" to="/terms" onClick={saveFormData}>
										Terms & Conditions
									</Link>{" "}
									and{" "}
									<Link className="link" to="/privacy" onClick={saveFormData}>
										Privacy Policy
									</Link>
									.
								</Checkbox>
							</Form.Item>
							<Form.Item>
								<Button
									className="get-quote-btn"
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

				<div className="mobile-form-app">
					<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
						<img width={57} height={57} src={fepLogo} alt="Logo" />
						<h1>
							Sign Up for final <br /> expense plan
						</h1>
					</div>
					<p>Secure your loved ones' future with Final Expense Insurance</p>

					{isSubmitted ? (
						<div className="success-message">
							<h2>Thank you for signing up!</h2>
							<p>
								Your information has been successfully submitted. We will
								contact you shortly to discuss your final expense plan.
							</p>
						</div>
					) : (
						<Form
							form={form}
							layout="vertical"
							onFinish={onFinish}
							onFinishFailed={onFinishFailed}
						>
							<div className="form-container">
								<AnimatePresence mode="wait">
									{currentScreen === 1 && (
										<motion.div
											key="first-screen"
											initial={{ x: 0, opacity: 1 }}
											animate={{ x: 0, opacity: 1 }}
											exit={{ x: "-50%", opacity: 0 }}
											transition={{ duration: 0.3 }}
											className="first-screen"
										>
											<Row gutter={16}>
												<Col span={24}>
													<Form.Item
														label="First Name"
														name="firstName"
														rules={[
															{
																required: true,
																message: "Please enter your first name",
															},
														]}
													>
														<Input
															placeholder="Type Full Name Here"
															style={inputStyle}
														/>
													</Form.Item>
													<Form.Item
														label="Last Name"
														name="lastName"
														rules={[
															{
																required: true,
																message: "Please enter your last name",
															},
														]}
													>
														<Input
															placeholder="Type Last Name Here"
															style={inputStyle}
														/>
													</Form.Item>
													<Form.Item
														label="Date of Birth"
														name="dob"
														rules={[
															{
																required: true,
																validator: validateDateOfBirth,
															},
														]}
													>
														<DatePicker
															format={dateFormat}
															placeholder="MM/DD/YYYY"
															inputRender={(props) => (
																<input
																	{...props}
																	inputMode="numeric"
																	value={formatDateInput(props.value)}
																/>
															)}
														/>
													</Form.Item>
													<Form.Item
														label="Gender"
														name="gender"
														rules={[
															{
																required: true,
																message: "Please select your gender",
															},
														]}
													>
														<Select
															placeholder="Select One"
															style={selectInputStyle}
															suffixIcon={
																<img src={arrowDown} alt="Drop Down" />
															}
														>
															<Option value="male">Male</Option>
															<Option value="female">Female</Option>
															<Option value="other">Other</Option>
														</Select>
													</Form.Item>
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
																	"Please enter a valid phone number in the format +1 (XXX) XXX-XXXX",
															},
														]}
													>
														<Input
															placeholder={
																isPhoneInputFocused
																	? "Type your phone number here"
																	: "+1 (XXX) XXX-XXXX"
															}
															style={inputStyle}
															value={form.getFieldValue("phone")}
															onChange={(e) => {
																const digitsOnly = e.target.value.replace(
																	/\D/g,
																	""
																);
																const formattedValue =
																	formatPhoneNumber(digitsOnly);
																form.setFieldsValue({ phone: formattedValue });
															}}
															onFocus={() => setIsPhoneInputFocused(true)}
															onBlur={() => setIsPhoneInputFocused(false)}
															inputMode="numeric"
														/>
													</Form.Item>
													<Form.Item
														label="Email"
														name="email"
														rules={[
															{
																required: true,
																message: "Please enter your email",
															},
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
										</motion.div>
									)}
									{currentScreen === 2 && (
										<motion.div
											key="second-screen"
											initial={{ x: "100%", opacity: 0 }}
											animate={{ x: 0, opacity: 1 }}
											exit={{ x: "50%", opacity: 0 }}
											transition={{ duration: 0.3 }}
											className="second-screen"
										>
											<Row gutter={16}>
												<Col span={24}>
													<Form.Item
														label="City"
														name="city"
														rules={[
															{
																required: true,
																message: "Please enter your city",
															},
														]}
													>
														<Input
															placeholder="Type Your City Here"
															style={inputStyle}
														/>
													</Form.Item>
													<Form.Item
														label="Street Address"
														name="address"
														rules={[
															{
																required: true,
																message: "Please enter your address",
															},
														]}
													>
														<Input
															placeholder="Type your Address Here"
															style={inputStyle}
														/>
													</Form.Item>
													<Form.Item
														label="State"
														name="state"
														rules={[
															{
																required: true,
																message: "Please select your state",
															},
														]}
													>
														<Select
															placeholder="Select One"
															style={selectInputStyle}
															suffixIcon={
																<img src={arrowDown} alt="Drop Down" />
															}
														>
															{usStates.map((state) => (
																<Option key={state.value} value={state.value}>
																	{state.label}
																</Option>
															))}
														</Select>
													</Form.Item>
													<Form.Item
														label="ZIP Code"
														name="zipCode"
														rules={[
															{
																required: true,
																message: "Please enter your ZIP code",
															},
															{
																pattern: /^\d{5}(-\d{4})?$/,
																message:
																	"Please enter a valid ZIP code (e.g., 12345 or 12345-6789)",
															},
														]}
													>
														<Input
															placeholder="Type your ZIP Code Here"
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
														message:
															"You must agree to the terms and conditions",
													},
												]}
											>
												<Checkbox>
													By getting a start, you agree to our{" "}
													<Link
														className="link"
														to="/terms"
														onClick={saveFormData}
													>
														Terms & Conditions
													</Link>{" "}
													and{" "}
													<Link
														className="link"
														to="/privacy"
														onClick={saveFormData}
													>
														Privacy Policy
													</Link>
													.
												</Checkbox>
											</Form.Item>
											<Form.Item>
												<Button
													className="get-quote-btn"
													type="primary"
													htmlType="submit"
													block
													loading={isSubmitting}
												>
													<img src={telegramIcon} alt="Icon" /> Get Quote
												</Button>
											</Form.Item>
										</motion.div>
									)}
								</AnimatePresence>
								<div className="btn_container">
									<button
										form={form}
										className="arrow-left-btn"
										onClick={
											currentScreen === 1
												? handleNextScreen
												: handlePreviousScreen
										}
									>
										{currentScreen === 1 ? (
											<IoIosArrowForward size={28} color="#fff" />
										) : (
											<IoIosArrowBack size={28} color="#fff" />
										)}
									</button>
								</div>
							</div>
						</Form>
					)}
				</div>
			</div>
		</>
	);
};

export default FormApp;

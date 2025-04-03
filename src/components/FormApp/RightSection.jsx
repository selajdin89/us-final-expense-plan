import { useState } from "react";
import { Form, Input, Select, Button, message, Spin, Result } from "antd";
import "./RightSection.scss";

const { Option } = Select;

const RightSection = () => {
	const [form] = Form.useForm(); // Antd form instance
	const [loading, setLoading] = useState(false); // Loading state for submit button
	const [submitted, setSubmitted] = useState(false); // State to track form submission

	// Handle form submission
	const onFinish = (values) => {
		setLoading(true);
		console.log("Form Data Submitted:", values);

		// Simulate API call or form submission
		setTimeout(() => {
			setLoading(false);
			setSubmitted(true); // Set submitted to true to show success message
			message.success("Form submitted successfully!");
			form.resetFields(); // Reset form fields after submission
		}, 2000);
	};

	// Handle form submission failure
	const onFinishFailed = (errorInfo) => {
		console.log("Form submission failed:", errorInfo);
		message.error("Please fill out all required fields correctly.");
	};

	// Format phone number input
	const formatPhoneNumber = (value) => {
		if (!value) return "1"; // Default to "1" if the value is empty

		// Remove all non-digits
		let phoneNumber = value.replace(/\D/g, "");

		// Ensure the number starts with "1"
		if (!phoneNumber.startsWith("1")) {
			phoneNumber = "1" + phoneNumber;
		}

		// Format as 1(***)***-****
		if (phoneNumber.length > 1) {
			return `1(${phoneNumber.slice(1, 4)})${phoneNumber.slice(
				4,
				7
			)}-${phoneNumber.slice(7, 11)}`;
		}

		return phoneNumber;
	};

	return (
		<div className="right-section">
			<Spin spinning={loading} tip="Submitting...">
				{submitted ? (
					// <div className="submission-success">
					// 	<h2>Submission Successful!</h2>
					// 	<p>
					// 		Thank you for submitting the form. We will get back to you soon.
					// 	</p>
					// </div>
					<Result
						status="success"
						title="Submission Successful!"
						subTitle="Thank you for submitting the form. We will get back to you soon."
					/>
				) : (
					<Form
						form={form}
						layout="vertical"
						onFinish={onFinish}
						onFinishFailed={onFinishFailed}
						autoComplete="off"
						initialValues={{ phoneNumber: "1" }} // Set default value for phone number
					>
						{/* Full Name */}
						<Form.Item
							label="Name"
							name="name"
							rules={[
								{
									required: true,
									message: "Please enter your name",
								},
							]}
						>
							<Input placeholder="Enter your name" />
						</Form.Item>
						<Form.Item
							label="Phone Number"
							name="phoneNumber"
							rules={[
								{
									required: true,
									message: "Please enter your phone number",
								},
								{
									pattern: /^1\(\d{3}\)\d{3}-\d{4}$/,
									message: "Phone number must be in the format 1(***)***-****",
								},
							]}
						>
							<Input
								placeholder="1(***)***-****"
								value={form.getFieldValue("phoneNumber")}
								onChange={(e) => {
									const formattedValue = formatPhoneNumber(e.target.value);
									form.setFieldsValue({ phoneNumber: formattedValue });
								}}
								onKeyDown={(e) => {
									// Allow only digits and prevent the "1" from being deleted
									if (!/\d/.test(e.key) && e.key !== "Backspace") {
										e.preventDefault();
									}
								}}
							/>
						</Form.Item>

						{/* Email Address */}
						<Form.Item
							label="Email Address"
							name="email"
							rules={[
								{
									required: true,
									message: "Please enter your email address",
								},
								{
									type: "email",
									message: "Please enter a valid email address",
								},
							]}
						>
							<Input placeholder="Enter your email address" />
						</Form.Item>

						{/* City */}
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
							<Input placeholder="Enter your city" />
						</Form.Item>

						{/* Street Address */}
						<Form.Item
							label="Street Address"
							name="streetAddress"
							rules={[
								{
									required: true,
									message: "Please enter your street address",
								},
							]}
						>
							<Input placeholder="Enter your street address" />
						</Form.Item>

						{/* State */}
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
							<Select placeholder="Select your state">
								<Option value="CA">California</Option>
								<Option value="NY">New York</Option>
								<Option value="TX">Texas</Option>
								<Option value="FL">Florida</Option>
								<Option value="IL">Illinois</Option>
							</Select>
						</Form.Item>

						{/* Zip Code */}
						<Form.Item
							label="Zip Code"
							name="zipCode"
							rules={[
								{
									required: true,
									message: "Please enter your zip code",
								},
								{
									pattern: /^\d{5}$/,
									message: "Please enter a valid 5-digit zip code",
								},
							]}
						>
							<Input placeholder="Enter your zip code" />
						</Form.Item>

						{/* Phone Number */}

						{/* Premium */}
						<Form.Item
							label="Premium"
							name="premium"
							rules={[
								{
									required: true,
									message: "Please select a premium option",
								},
							]}
						>
							<Select placeholder="Select a premium option">
								<Option value="basic">Basic</Option>
								<Option value="standard">Standard</Option>
								<Option value="premium">Premium</Option>
							</Select>
						</Form.Item>

						{/* Submit Button */}
						<Form.Item>
							<Button
								type="primary"
								htmlType="submit"
								loading={loading}
								style={{ backgroundColor: "#1C9C4D", borderColor: "#1C9C4D" }}
							>
								Submit
							</Button>
						</Form.Item>

						{/* Terms and Conditions / Privacy Policy Links */}
						<Form.Item>
							<p className="form-links">
								By submitting this form, you agree to our{" "}
								<a
									href="/terms-and-conditions"
									target="_blank"
									rel="noopener noreferrer"
								>
									Terms and Conditions
								</a>{" "}
								and{" "}
								<a
									href="/privacy-policy"
									target="_blank"
									rel="noopener noreferrer"
								>
									Privacy Policy
								</a>
								.
							</p>
						</Form.Item>
					</Form>
				)}
			</Spin>
		</div>
	);
};

export default RightSection;

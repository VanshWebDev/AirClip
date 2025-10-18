import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "../../../styles/component/auth/ResetPwd.module.css";
import { ErrHandling } from "../../../utils/Err/ErrHandling";
import { useResetPasswordMutation } from "@/features/apiSlice";
import type { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState(""); // State for password input
  const [feedback, setFeedback] = useState(""); // State for password feedback
  const { passwordResetEmail } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  // +++ Instantiate the hook
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  interface FormValues {
    otp: number;
    newPassword: string;
    confirmPassword: string;
  }

  const onFinish = async (values: FormValues) => {
    // --- THIS IS THE CHECK YOU MUST ADD ---
    if (!passwordResetEmail) {
      toast.error("Session expired. Please request a new password reset.");
      navigate("/login"); // Send them back to safety
      return; // Stop the function
    }
    // --- END OF CHECK ---

    try {
      // Make API call using the RTK Query hook
      const res = await resetPassword({
        ...values,
        email: passwordResetEmail, // Get email from Redux state
      }).unwrap();
      console.log(res);
      toast.success(res.message);
      if (res.isPwdReset) {
        navigate("/");
      }
    } catch (err: unknown) {
      console.log(err);
      ErrHandling(err, "Failed to reset password. Please try again.");
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    setPassword(pwd);

    let feedbackMessage = "";
    if (pwd.length < 6 || pwd.length > 20) {
      feedbackMessage = "Password must be 6-20 characters.";
    } else if (!/[A-Z]/.test(pwd)) {
      feedbackMessage = "Include an uppercase letter.";
    } else if (!/[a-z]/.test(pwd)) {
      feedbackMessage = "Include a lowercase letter.";
    } else if (!/\d/.test(pwd)) {
      feedbackMessage = "Include a number.";
    } else if (!/[@$!%*?&]/.test(pwd)) {
      feedbackMessage = "Include a special character.";
    } else {
      feedbackMessage = "Password is strong.";
    }
    setFeedback(feedbackMessage);
  };

  const feedbackColor = feedback === "Password is strong." ? "green" : "red";

  return (
    <>
      <div className={styles.resetPwdContainer}>
        <div className={styles.resetPwd}>
          <p className={styles.title}>Change Password</p>
          <Form
            name="reset_password_form"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <p>OTP</p>
            <Form.Item
              name="otp"
              rules={[{ required: true, message: "Please input your OTP!" }]}
            >
              <Input
                className={styles.otpInput}
                placeholder="Enter OTP"
                type="number"
              />
            </Form.Item>
            <p>Password</p>
            <Form.Item
              name="newPassword"
              hasFeedback
              help={<span style={{ color: feedbackColor }}>{feedback}</span>}
              rules={[
                { required: true, message: "Please input your password!" },
                { min: 6, message: "Min: 6 characters." },
                { max: 20, message: "Max: 20 characters." },
                {
                  pattern:
                    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{6,20}$/,
                  message:
                    "Password must include uppercase, lowercase, number, and special character.",
                },
              ]}
            >
              <Input.Password
                placeholder="Enter new password"
                value={password}
                onChange={handlePasswordChange}
                className={styles.passwordInput}
              />
            </Form.Item>
            <p>confirm Password</p>
            <Form.Item
              name="confirmPassword"
              dependencies={["newPassword"]}
              hasFeedback
              rules={[
                { required: true, message: "Please confirm your password!" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match!")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                className={styles.passwordInput}
                placeholder="Confirm new password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={isLoading}
                style={{ width: "100%" }}
                className={styles.resetBtn}
              >
                Reset Password
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordPage;

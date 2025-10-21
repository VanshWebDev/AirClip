import { Form, Input, Button, message } from "antd";
import { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../styles/component/auth/SignupForm.module.css";
import GoogleAuth from "../GoogleAuth";
import { LoadingOutlined } from "@ant-design/icons";
import { InboxOutlined, KeyOutlined } from "@ant-design/icons";
import { ErrHandling } from "../../../utils/Err/ErrHandling";
import CreatePwd from "./CreatePwd";
import {
  useSendSignupOtpMutation,
  useVerifySignupOtpMutation,
} from "@/features/apiSlice";

const SignupForm = () => {
  const navigate = useNavigate();
  const [messageApi, contextHolderr] = message.useMessage();
  const key = "updatable";
  const [form] = Form.useForm();
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [sendSignupOtp, { isLoading: isSendingOtp }] =
    useSendSignupOtpMutation();
  const [verifySignupOtp, { isLoading: isVerifyingOtp }] =
    useVerifySignupOtpMutation();

  const onFinish = async (values: { email: string; otp: number }) => {
    const { email, otp } = values;
    try {
      const res = await verifySignupOtp({ email, otp }).unwrap();
      if (res.status == 200 || res.success == true) {
        setIsEmailVerified(true);
      }
    } catch (err) {
      ErrHandling(err, "Something went wrong");
    }
  };

  const onFinishFailed = (errorInfo: object) => {
    console.log("Failed:", errorInfo);
  };

  // SIMPLIFIED handleSendOtp function
  const handleSendOtp = async () => {
    const email = form.getFieldValue("email");
    if (!email) {
      message.error("Please enter an email first.");
      return;
    }

    messageApi.open({ key, type: "loading", content: "Sending OTP..." });

    try {
      // The API call is now simpler
      const response = await sendSignupOtp({ email }).unwrap();
      messageApi.open({ key, type: "success", content: response.message });
    } catch (err) {
      ErrHandling(err, "Something went wrong");
    }
  };

  return (
    <div className={styles.signupFormContainer}>
      {contextHolderr}
      <div className={styles.signupForm}>
        <p className={styles.title}>Sign up</p>
        {!isEmailVerified && (
          <>
            <Form
              form={form}
              name="createPassword"
              layout="vertical"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <p>Email</p>
              <Form.Item
                name="email"
                hasFeedback
                rules={[
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input
                  placeholder="Email"
                  type="email"
                  className={styles.emailInput}
                  prefix={<InboxOutlined />}
                />
              </Form.Item>
              <p>OTP</p>
              <Form.Item
                name="otp"
                hasFeedback
                rules={[{ required: true, message: "Please input your OTP!" }]}
                style={{ marginBottom: "5px" }}
              >
                <Input
                  placeholder="OTP"
                  prefix={<KeyOutlined />}
                  className={styles.otpInput}
                  type="number"
                />
              </Form.Item>
              <div className={styles.sendOtp}>
                <div
                  // 1. Disable the click event when isSendingOtp is true
                  onClick={!isSendingOtp ? handleSendOtp : undefined}
                  // 2. Add visual feedback
                  style={{
                    cursor: isSendingOtp ? "not-allowed" : "pointer",
                    opacity: isSendingOtp ? 0.6 : 1,
                  }}
                >
                  {/* 3. Show loading icon OR text */}
                  {isSendingOtp ? (
                    <>
                      <LoadingOutlined style={{ marginRight: "8px" }} />
                      Sending...
                    </>
                  ) : (
                    "Send OTP"
                  )}
                </div>
              </div>
              <Button
                type="link"
                htmlType="submit"
                loading={isVerifyingOtp}
                className={styles.signupBtn}
                disabled={isVerifyingOtp}
              >
                Verify OTP
              </Button>
            </Form>
          </>
        )}
        {isEmailVerified && <CreatePwd email={form.getFieldValue("email")} />}

        <Form.Item style={{ marginTop: "15px" }}>
          <div className={styles.actionBtns}>
            <p className={styles.dontHaveAccount}>
              Already have an account{" "}
              <span onClick={() => navigate("/login")}>Sign in</span>
            </p>
            <p className={styles.orWith}>or with</p>
            <div className={styles.googleAuthContainer}>
              <Suspense fallback={<LoadingOutlined />}>
                <GoogleAuth authMethod="signupwithgoogle" />
              </Suspense>
            </div>
          </div>
        </Form.Item>
      </div>
    </div>
  );
};

export default SignupForm;

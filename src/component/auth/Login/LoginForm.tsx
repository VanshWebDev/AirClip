import { type FC, Suspense, lazy } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
const GoogleAuth = lazy(() => import("../GoogleAuth")); // import PropTypes from "prop-types";
import { useNavigate, useLocation } from "react-router-dom";
import styles from "../../../styles/component/auth/LoginForm.module.css";
import {
  useForgotPasswordMutation,
  useLoginUserMutation,
} from "@/features/apiSlice";
import { ErrHandling } from "@/utils/Err/ErrHandling";
import { useDispatch } from "react-redux";
import { setPasswordResetEmail, setUser } from "@/features/auth/authSlice";
// import { setUser } from "@/features/auth/authSlice";
import { toast } from "sonner"; // +++ Import toast
import { setCurrentRoom } from "@/features/chat/chatSlice";
// Define the type for the form values expected in the login form
interface LoginFormValues {
  emailOrUsername: string;
  password: string;
}

const LoginForm: FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const key = "updatable";

  // Use Ant Design's Form hook
  const [form] = Form.useForm();
  //   const dispatch = useDispatch();
  // const { resetpwd } = useSelector((state: any) => state.counter);
  const navigate = useNavigate();
  const location = useLocation();
  // +++ Setup RTK Query and Redux dispatch
  const [loginUser, { isLoading: isLoginLoading }] = useLoginUserMutation();
  const [forgotPassword, { isLoading: isForgotPwdLoading }] =
    useForgotPasswordMutation();
  const dispatch = useDispatch();
  const onFinishLogin = async (values: LoginFormValues) => {
    try {
      // +++ Use the RTK Query mutation
      const res = await loginUser(values).unwrap();
      // +++ DISPATCH setUser ON SUCCESSFUL LOGIN
      if (res.user) {
        toast.success(res.message);
        dispatch(
          setUser({
            name: res.user.name || "",
            email: res.user.email,
            picture: res.user.picture || "",
            username: res.user.username || "",
            _id: res.user._id,
          })
        );
        dispatch(setCurrentRoom(null))
        navigate(location?.state?.previousPath || "/");
      }
    } catch (error) {
      // .unwrap() provides the error payload
      ErrHandling(error, "something went wrong");
    }
  };

  const handleForgotPassword = async () => {
    const emailOrUsername = form.getFieldValue("emailOrUsername") as string;
    if (!emailOrUsername) {
      message.info("Please enter your email.");
      return;
    }
    // +++ USE THE CORRECT ACTION HERE
    dispatch(setPasswordResetEmail(emailOrUsername.toLowerCase()));
    // +++ Show loading toast
    const toastId = toast.loading("Sending OTP...");
    // +++ Show loading message
    // messageApi.open({ key, type: "loading", content: "Sending OTP..." });

    try {
      // +++ Use the RTK Query mutation
      const res = await forgotPassword({ emailOrUsername }).unwrap();
      if (res.data.emailSent) {
        // messageApi.open({ key, type: "success", content: res.data.message });
        // toast.success(res.data.message);
        toast.success(res.data.message, { id: toastId });
        navigate("/auth/resetpwd");
      } else {
        messageApi.open({
          key,
          type: "error",
          content: res.message || "An error occurred.",
        });
      }
    } catch (error) {
      ErrHandling(error, "Something went wrong");
    }
  };

  return (
    <div className={styles.loginFormContainer}>
      {contextHolder}
      <div className={styles.loginForm}>
        <p className={styles.title}>Login</p>
        <Form
          form={form}
          style={{ width: "300px" }}
          className="form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinishLogin}
        >
          <p>Email</p>
          <Form.Item
            name="emailOrUsername"
            rules={[
              {
                required: true,
                message: "Input your email!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Email or Username"
              className={styles.emailInput}
            />
          </Form.Item>
          <div className={styles.passwordInput}>
            <p>Password</p>
            <Form.Item
              style={{ marginBottom: "5px" }}
              name="password"
              rules={[
                {
                  required: true,
                  message: "Input your Password!",
                },
              ]}
            >
              <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
                className={styles.pwdInput}
              />
            </Form.Item>
            <div className={styles.forgotPwd}>
              {/* <div onClick={handleForgotPassword}>Forgot password?</div> */}

              <div
                // 1. Disable the click event when isSendingOtp is true
                onClick={!isForgotPwdLoading ? handleForgotPassword : undefined}
                // 2. Add visual feedback
                style={{
                  cursor: isForgotPwdLoading ? "not-allowed" : "pointer",
                  opacity: isForgotPwdLoading ? 0.6 : 1,
                }}
              >
                {/* 3. Show loading icon OR text */}
                {isForgotPwdLoading ? (
                  <>
                    <LoadingOutlined style={{ marginRight: "8px" }} />
                    Forgot password?...
                  </>
                ) : (
                  "Forgot password?"
                )}
              </div>
            </div>
          </div>
          <Form.Item>
            <div className={styles.actionBtns}>
              <Button
                loading={isLoginLoading}
                type="link"
                htmlType="submit"
                className={styles.signInBtn}
              >
                {" "}
                Sign in{" "}
              </Button>
              <p className={styles.dontHaveAccount}>
                Don't have an account{" "}
                <span onClick={() => navigate("/signup")}>Sign up</span>
              </p>
              <p className={styles.orWith}>or with</p>
              <div className={styles.googleAuthContainer}>
                <Suspense fallback={<LoadingOutlined />}>
                  <GoogleAuth authMethod="signinwithgoogle" />
                </Suspense>
              </div>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;

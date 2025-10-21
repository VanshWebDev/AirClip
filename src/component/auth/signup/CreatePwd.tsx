import { Form, Input, Button, message } from "antd";
import { type FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../../styles/component/auth/SignupForm.module.css";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { ErrHandling } from "../../../utils/Err/ErrHandling";
import { useAppDispatch } from "@/hooks/hooks";
import { useSignupWithEmailMutation } from "@/features/apiSlice";
import { setUser } from "@/features/auth/authSlice";
import { setCurrentRoom } from "@/features/chat/chatSlice";

const CreatePwd: FC<{ email: string }> = ({ email }) => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  // const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [timer, setTimer] = useState(120);
  //   const dispatch = useDispatch();

  // +++ Setup RTK Query and Redux dispatch
  const dispatch = useAppDispatch();
  const [signupWithEmail, { isLoading }] = useSignupWithEmailMutation();
  interface values {
    password: string;
    confirmPassword: string;
    email: string;
  }

  const onFinish = async (values: values) => {
    values.email = email;

    // setIsLoading(true);
    try {
      const res = await signupWithEmail(values).unwrap();
      if(res.user){

        dispatch(setUser(res.user))
        dispatch(setCurrentRoom(null))
        // dispatch(is)
        navigate("/")
      } 
    } catch (err) {
      // The 'err' object from .unwrap() is the error payload from the server
      ErrHandling(err, "Something went wrong");
    }
  };

  useEffect(() => {
    if (timer === 0) {
      message.warning("account creation timeout");
      navigate("/");
    }
    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer, navigate]);

  const onFinishFailed = (errorInfo: object) => {
    console.log("Failed:", errorInfo);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const pwd = e.target.value;
    // setPassword(pwd);

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
    <Form
      form={form}
      name="createPassword"
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <>
        <p>Username</p>
        <Form.Item
          name="email"
          rules={[{ required: true, message: "Please input your username!" }]}
          initialValue={email}
        >
          <Input
            placeholder="email"
            className={styles.usernameInput}
            prefix={<UserOutlined />}
            disabled
          />
        </Form.Item>

        <p>Password</p>
        <Form.Item
          name="password"
          hasFeedback
          help={<span style={{ color: feedbackColor }}>{feedback}</span>}
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 6, message: "Min: 6 characters." },
            { max: 20, message: "Max: 20 characters." },
            {
              pattern:
                /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,20}$/,
              message:
                "Include uppercase, lowercase, number, and special character.",
            },
          ]}
        >
          <Input.Password
            placeholder="Password"
            onChange={handlePasswordChange}
            className={styles.pwdInput}
            prefix={<LockOutlined />}
          />
        </Form.Item>

        <p>Confirm password</p>
        <Form.Item
          name="confirmPassword"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
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
            placeholder="Confirm Password"
            className={styles.confirmPwdInput}
            prefix={<UserOutlined />}
          />
        </Form.Item>

        <Button
          type="link"
          htmlType="submit"
          loading={isLoading}
          className={styles.signupBtn}
        >
          Sign Up
        </Button>
      </>
    </Form>
  );
};

export default CreatePwd;

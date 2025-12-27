import { Button, Form, Input, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../../redux/rtk/features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);

  const onFinish = async (values) => {
    setLoader(true);
    try {
      const resp = await dispatch(addUser(values));
      if (resp.payload.message === "success") {
        window.location.href = "/admin/dashboard";
      } else {
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      console.error("Login failed:", error);
      toast.error("An error occurred during login.");
    }
  };

  const onFinishFailed = (errorInfo) => {
    setLoader(false);
    toast.error("Please fill in all required fields.");
  };

  const isLogged = Boolean(localStorage.getItem("isLogged"));
  useEffect(() => {
    if (isLogged) {
      navigate("/");
    }
  }, [isLogged, navigate]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Left Side - Visual/Hero (60%) - Hidden on small screens */}
      <div className="hidden lg:flex w-3/5 relative bg-[#0f172a] items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 scale-105"
          style={{
            backgroundImage: `url('/images/loginBackground.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-blue-900/60 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 p-16 max-w-2xl">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <h1 className="text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight drop-shadow-2xl">
              Welcome to <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-200">
                Chohan Travels
              </span>
            </h1>
            <div className="h-1.5 w-32 bg-blue-500 rounded-full mb-8"></div>
            <p className="text-xl text-blue-100/90 leading-relaxed font-light">
              Manage your fleet, bookings, and invoices with our premium administrative dashboard. Experience seamless control.
            </p>
          </motion.div>
        </div>

        {/* Decorative Circles */}
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.05, 1] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -right-1/4 w-[800px] h-[800px] border-[2px] border-white/10 rounded-full z-0"
        />
      </div>

      {/* Right Side - Form (40%) - Full width on small screens */}
      <div className="w-full lg:w-2/5 relative flex items-center justify-center p-8 lg:p-12 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            {/* <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src="/images/logo-black-new.png"
                alt="Chohan Tours"
                className="h-16 mx-auto w-32 mb-6 object-contain text-black bg-black"
              />
            </motion.div> */}

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Title level={2} className="!font-bold !text-slate-800 !mb-2 !text-3xl">
                Welcome Back
              </Title>
              <Text className="text-slate-500 text-lg">
                Please log in to your account
              </Text>
            </motion.div>
          </div>

          <Form
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            layout="vertical"
            size="large"
            className="space-y-5"
          >
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Form.Item
                label={<span className="font-semibold text-slate-700 ml-1">Username</span>}
                name="username"
                rules={[{ required: true, message: "Please input your username!" }]}
                className="mb-0"
              >
                <Input
                  prefix={<UserOutlined className="text-black text-lg mr-2" />}
                  placeholder="Enter username"
                  className="h-12 rounded-xl bg-slate-50 border-slate-200 hover:border-blue-500 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 font-medium"
                />
              </Form.Item>
            </motion.div>

            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Form.Item
                label={<span className="font-semibold text-slate-700 ml-1">Password</span>}
                name="password"
                rules={[{ required: true, message: "Please input your password!" }]}
                className="mb-4"
              >
                <Input.Password
                  prefix={<LockOutlined className="text-black text-lg mr-2" />}
                  placeholder="Enter password"
                  className="h-12 rounded-xl bg-slate-50 border-slate-200 hover:border-blue-500 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all text-slate-800 font-medium"
                />
              </Form.Item>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loader}
                  block
                  className="h-14 mt-2 rounded-xl text-xl font-bold bg-slate-900 hover:bg-slate-800 border-none shadow-xl shadow-slate-900/20 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Sign In
                </Button>
              </Form.Item>
            </motion.div>
          </Form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center border-t border-slate-100 pt-6"
          >
            <Text className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              &copy; {new Date().getFullYear()} Chohan Tours & Travels
            </Text>
          </motion.div>
        </div>
      </div>
    </div>

  );
};

export default Login;

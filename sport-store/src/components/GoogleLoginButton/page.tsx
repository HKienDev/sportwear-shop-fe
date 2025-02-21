"use client";

const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:4000/api/auth/google"; // Redirect BE để xử lý OAuth
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Đăng nhập với Google
    </button>
  );
};

export default GoogleLoginButton;

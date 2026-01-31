const AuthLayout = ({ children }) => {
  return (
    <div style={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center" }}>
      {children}
    </div>
  );
};

export default AuthLayout;

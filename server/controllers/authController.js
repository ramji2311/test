const login = async (req, res) => {
  res.json({
    success: true,
    message: "Login API Working",
  });
};

const register = async (req, res) => {
  res.json({
    success: true,
    message: "Register API Working",
  });
};

module.exports = {
  login,
  register,
};
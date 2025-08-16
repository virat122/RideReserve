

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    return res.status(201).json({
      message: "User registered successfully",
      user: req.body
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

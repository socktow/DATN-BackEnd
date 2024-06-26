const express = require('express');
const router = express.Router();
const User = require('../../Schema/UsersSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.post("/", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      const passwordMatch = await bcrypt.compare(req.body.password, user.password);
      if (passwordMatch) {
        if (!user.isEmailVerified) {
          return res.status(400).json({ success: false, errors: "Email not verified" });
        }
        const data = {
          user: {
            id: user.id,
          },
        };
        const authToken = jwt.sign(data, "secret_ecom");
        res.json({ success: true, authToken });
      } else {
        res.status(400).json({ success: false, errors: "Incorrect password" });
      }
    } else {
      res.status(400).json({ success: false, errors: "Invalid Email" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ success: false, errors: "Server error" });
  }
});

module.exports = router;

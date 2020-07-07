const express = require("express");
const router = express.Router();
const middlewareAuth = require("../../middleware/auth");
const User = require("../../models/User");

//@route GET api/user
//@desc Test route
//@access public
router.get("/", middlewareAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.send(user);
  } catch (err) {
    res.status(500).send("server error");
  }
});

module.exports = router;

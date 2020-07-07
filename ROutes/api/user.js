const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

//@route POST api/user
//@desc Register User
//@access public
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please enter a min num of password").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    //async because db connectivity to check user
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); //errors include all avaliable error for this req call
    }
    console.log(req.body.name);

    const { name, email, password } = req.body;

    try {
      //See if user exist
      let user = await User.findOne({ email });
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already registered" }] });
      }

      //Get user Avatar
      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });

      //create instant of an user to save this user in DB
      user = new User({
        name,
        email,
        avatar,
        password,
      });

      //Encrypt password using bcrypt
      const salt = await bcrypt.genSalt(10); //process to bcrypt. 10 is power of encryption
      user.password = await bcrypt.hash(password, salt); //bcrypt is to save the password in DB in encrypted form
      await user.save(); //to save the user in DB

      //Return JSON web token
      const payload = {
        //for jwt authentication we need to send the user id as payload
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;

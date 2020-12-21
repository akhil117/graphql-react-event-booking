const bcryptjs = require('bcryptjs');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');

module.exports = {
  createUser: async (args) => {
    try {
      const user = await User.findOne({ email: args.user.email })
      if (!user) {
        const hashedPassword = await bcryptjs.hash(args.user.password, 12);

        const user = new User({
          email: args.user.email,
          password: hashedPassword
        });

        const userData = await user.save();
        return { ...userData._doc, password: "Password saved successfully" };
      }
      throw Error("new user already exist");
    } catch (err) {
      throw err;
    }
  },

  login: async ({email,password}) => {
      const fetchedUser = await User.findOne({email:email});
      //checking user exist or not
      if(!fetchedUser){
        throw new Error("Incorrect Login details");
      }

      //checking password
      const isEqual = await bcryptjs.compare(password,fetchedUser.password);

      if(!isEqual){
        throw new Error("Incorrect password");
      }

      const token = jwt.sign({userId:fetchedUser._doc._id, email: fetchedUser._doc.email},"SECRET", { expiresIn: '1h' });

      return {
        userId:fetchedUser._doc._id,
        token: token,
        tokenExpiration: 1
      }
  } 
}
const bcryptjs = require('bcryptjs');
const User = require('../../models/user');

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
}
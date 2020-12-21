const Event = require('../../models/event');
const {transformEvent} = require('./merge');
const {temp} = require('../../middlewares/temp');
const User = require('../../models/user');
module.exports = {
  events: async (args) => {
    let events = await Event.find().sort('title');
    return events.map(event => {
      return transformEvent(event);
    })
  },

  createEvent: async (args,req) => {
    if (!req.isAuth) {
      throw new Error('Unauthenticated!');
    }
    try {
      let event = new Event({
        title: args.event.title,
        description: args.event.description,
        date: new Date(args.event.date),
        price: args.event.price,
        creator: "5fdf650aca6fc36c68fa3ed4"
      });
      const user = await User.findById("5fdf650aca6fc36c68fa3ed4")

      if (!user) {
        throw Error("User Not found")
      }
      await event.save();
      user.createdEvents.push(event._doc._id);
      await user.save();

      return transformEvent(event);
    } catch (err) {
      throw err;
    }
  }
}
const Event = require('../../models/event');
const {transformEvent} = require('./merge');

module.exports = {
  events: async () => {
    let events = await Event.find().sort('title');
    return events.map(event => {
      return transformEvent(event);
    })
  },

  createEvent: async (args) => {
    try {
      let event = new Event({
        title: args.event.title,
        description: args.event.description,
        date: new Date(args.event.date),
        price: args.event.price,
        creator: "5fde4ba6c4c3e556e4135a2b"
      });
      const user = await User.findById("5fde4ba6c4c3e556e4135a2b")

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
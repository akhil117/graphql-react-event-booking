const {transformBooking,transformEvent} = require('./merge');
const Event = require('../../models/event');
const Booking = require('../../models/booking');

module.exports = {
  bookings: async () => {
    try {
      let fetchedBookings = await Booking.find();
      return fetchedBookings.map(booking => {
        return transformBooking(booking);
      });
    } catch (err) {
      throw err;
    }
  },

  createBooking: async (args) => {
    try {

      const fetchedEvent = await Event.findOne({ _id: args.eventId });
      const booking = new Booking({
        event: fetchedEvent,
        user: '5fde4ba6c4c3e556e4135a2b'
      });
      const result = await booking.save();
      return transformBooking(result);
    } catch (err) {
      throw err;
    }
  },

  cancelBooking: async args => {
    try {
      const booking = await Booking.findById(args.bookingId).populate('event');
      const event = transformEvent(booking.event);
      await Booking.deleteOne({ _id: args.bookingId });
      return event;
    } catch (err) {
      throw err;
    }
  }
}
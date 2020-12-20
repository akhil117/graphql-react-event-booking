const {dateToString} = require('../../helpers/date');
const Event = require('../../models/event');
const User = require('../../models/user');


const getEvents = async (eventIds) => {
  try {
    const events = await Event.find({ _id: { $in: eventIds } });
    return events.map((myCustomEvent) => {
      return transformEvent(myCustomEvent);
    });
  }
  catch (error) {
    throw error;
  }
};

const getUser = async (userId) => {
  try {
    console.log("user",userId);
    var temp = await User.findById(userId);
    console.log("GetuSER",temp);
    let b = { ...temp._doc, createdEvents: getEvents.bind(this, temp.createdEvents), password: "Password saved successfully" };
    return b;
  } catch (err) {
    throw err;
  }
};

const getSingleEvent = async eventId => {
  try {
    const event = await Event.findById(eventId);
    return {
      ...event._doc,
      creator: getUser.bind(this, event.creator)
    };
  } catch (err) {
    throw err;
  }
};


const transformEvent = (myCustomEvent) => {
  console.log("TransformEvent",myCustomEvent);
  return {
    ...myCustomEvent._doc,
    creator: getUser.bind(this, myCustomEvent.creator),
    date: dateToString(myCustomEvent._doc.date)
  };
};

const transformBooking = (booking)=> {
  return {
    ...booking._doc,
    createdAt:dateToString(booking._doc.createdAt),
    updatedAt: dateToString(booking._doc.updatedAt),
    event: getSingleEvent.bind(this, booking._doc.event),
    user: getUser.bind(this, booking._doc.user),
  };
};


exports.transformBooking = transformBooking;
exports.transformEvent = transformEvent;
const bcryptjs = require('bcryptjs');
const { Event } = require('../../models/event');
const { User } = require('../../models/user');

const getUser = async (userId) => {
  var temp  = await User.findById(userId);
  let b = {...temp._doc,createdEvents: getEvents.bind(this,temp.createdEvents)};
  return b;
}

const getEvents = async(eventIds) => {
  try{
    const events = await Event.find({_id: {$in: eventIds}});
    return events.map((myCustomEvent)=>{
      return {...myCustomEvent._doc, creator: getUser.bind(this,myCustomEvent.creator) }
    });
  }
  catch(error){
    throw error;
  }
};

module.exports =  {
  events: async () => {
    let events = await Event.find().sort('title');
   return events.map(event => {
      return {...event._doc, creator: getUser.bind(this,event.creator) }
    })
  },
  createEvent: async (args) => {
    let event = new Event({
      title: args.event.title,
      description: args.event.description,
      date: new Date(args.event.date),
      price: args.event.price,
      creator: "5fddd886e9e7e835309ee421"
    });
    const user = await User.findById("5fddd886e9e7e835309ee421")

    if(!user){
      throw Error("User Not found")
    }
    await event.save();
    user.createdEvents.push(event._doc._id);
    await user.save();
    
    return {...event._doc,creator: getUser.bind(this,event.creator)};  
  },

  createUser: async (args) => {

    const user = await User.findOne({ email: args.user.email })
    console.log(user);
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
  }
}
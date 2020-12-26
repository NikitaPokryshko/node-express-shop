const { Schema, model } = require("mongoose");

const courseSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  img: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// Check this method later.
// Was added to inject id to course instead of _id before sending to client
// Not sure, but maybe this functionality exists by default in new mongoose versions
// courseSchema.method('toClient', function() {
//   const course = this.toObject();

//   course.id = course._id;

//   delete course._id;

//   return course;
// })

module.exports = model("Course", courseSchema);

// Roles
//  Admin => admin panelda
// user => mobile dagi foydalanuvchilar

const models = {
  // province - Ma'lumot
  province: {
    title: String,
  },

  // region - Tuman/shahar
  region: {
    title: String,
    province: String, // ObjectId
  },

  // Group
  group: {
    title: String,
    desc: String,
    startDate: String, // YYYY-MM-DD
    endDate: String, // YYYY-MM-DD
  },

  // users
  user: {
    firstName: String,
    lastName: String,
    middleName: String,
    phone: String,
    password: String,
    role: String, // user
    photo: String, // default null
    province: String, // ObjectId
    region: String, // ObjectId
  },

  // fanlar(Yo'nalishlar)
  subject: {
    title: String,
    desc: String,
    photo: String,
    active: Boolean, // aktivligi default : true
    isPublic: Boolean, //  default: false
  },

  // darslar
  lesson: {
    title: String,
    subject: String, // ObjectId
    step: Number, // dars ketma-ketligi
    docs: [
      {
        title: String,
        path: String,
      },
    ],
    video: String, // video
  },

  // Userni fanlari
  attechedSubject: {
    user: String, // ObjectId
    subject: String, // ObjectId
    lesson: String, // ObjectId
    isPassed: Boolean, // dafault:false, qachonki testdan o'tsa >> true
    lessonStep: Number,
    result: [
      {
        total: Number,
        correctCount: Number,
        inCorrectCount: Number,
        present: Number,
      },
    ], //  [], testdagi natijalar
  },

  test: {
    subject: String, // ObjectId
    lesson: String, // ObjectId
    question: String, // savoli
    file: String, // file
    options: [
      {
        answer: String,
        isCorrect: Boolean, // default:false
        file: String, // defaut: null
      },
    ], // varyantlari
  },

  news: {
    title: String,
    desc: String,
    media: [String],
    active: Boolean, // default: false
  },

  // Kategorya(kitoblar)
  category: {
    title: String,
  },

  // Book
  book: {
    title: String,
    desc: String,
    author: String, // default: null
    file: String,
    category: String, // ObjectId
  },
};

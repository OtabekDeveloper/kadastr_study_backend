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
    lessonCount: Number, // default:0
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

  // UserSubject
  userSubject: {
    user: String, // ObjectId
    subject: String, // ObjectId
    date: String, // biriktirilgan sana
    startDate: String, // YYYY-MM-DD
    endDate: String, // YYYY-MM-DD
    complateCount: Number, // default:0
  },

    // Userni lesson
    attechedSubject: {
      user: String, // ObjectId
      subject: String, // ObjectId
      lesson: String, // ObjectId
      isPassed: Boolean, // dafault:false, qachonki testdan o'tsa >> true
      lessonStep: Number,
      result: [ // 5 talik testlar natijasi saqlanadi holos, 56% dan kop ishlagani o'tadi, kam ishlagan bolsa bosh qolaveradi
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


  // Subject 30 test.
  subjectTest: {
    user: String, // ObjectId
    subject: String, // ObjectId
    startDate: String,
    endDate:String,
    questions: [], // 30 ta fanda mavjud hamma darslardan aralashtirib olinadi
    correctCount: Number,
    testType: Number,  // 1=> yonalish boshida ishlangan test, 2=> darslarni tugatgandagi test
    isPassed: Boolean, // true o'tgan, false o'tolmagan  56% dan kam bolsa o'tmagan hisoblanadi
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

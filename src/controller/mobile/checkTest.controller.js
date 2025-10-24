const TestModel = require("../../models/test.model");
const AttachedSubjectModel = require("../../models/attechedSubject.model");
const UserSubjectModel = require("../../models/userSubject.model");
const SubjectTest = require("../../models/SubjectTest.model");
const AttachedModel = require("../../models/attechedSubject.model");

const mongoose = require("mongoose");
const moment = require("moment");
const lessonModel = require("../../models/lesson.model");

module.exports = {
  answerTestLessonSubject: async (req, res) => {
    try {
      const { lesson, subject } = req.body;
      if (!lesson || !subject) {
        return res.status(400).json({ message: "lesson va subject ID kerak" });
      }

      const lessonId = new mongoose.Types.ObjectId(lesson);
      const subjectId = new mongoose.Types.ObjectId(subject);

      let attached = await AttachedSubjectModel.findOne({
        subject: subjectId,
        lesson: lessonId,
        user: req?.user?._id,
      });

      if (attached.isPassed == true) {
        return res.status(400).json({
          message: "Bu dars testidan o'tgansiz, keyingi bosqichga o'ting",
        });
      }

      const tests = await TestModel.aggregate([
        { $match: { lesson: lessonId, subject: subjectId } },
        { $sample: { size: 5 } },
      ]);
      if (!tests.length) {
        return res
          .status(404)
          .json({ message: "Bu dars va fanga oid testlar topilmadi" });
      }

      const now = moment();

      const newResult = {
        date: now.format("YYYY-MM-DD"),
        time: "",
        startTime: now.format("YYYY-MM-DD HH:mm"),
        total: tests.length,
        correctCount: 0,
        inCorrectCount: 0,
        present: 0,
        status: 1,
      };

      attached.result.push(newResult);
      await attached.save();

      const currentResultId = attached.result[attached.result.length - 1]._id;

      const formattedTests = tests.map((test) => ({
        ...test,
        options: test.options.map((opt) => ({
          ...opt,
          userChoose: false,
        })),
      }));

      return res.status(200).json({
        tests: formattedTests,
        attachedId: attached?._id,
        resultId: currentResultId,
        time: "",
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  finishTestLessonSubject: async (req, res) => {
    try {
      const { attachedId, resultId, tests, time } = req.body;

      if (!attachedId || !resultId || !tests || !tests.length) {
        return res.status(400).json({
          message: "attachedId, resultId va tests majburiy",
        });
      }

      const attached = await AttachedSubjectModel.findById(attachedId);
      if (!attached) {
        return res.status(404).json({ message: "Attached subject topilmadi" });
      }

      if (attached.isPassed == true) {
        return res.status(400).json({
          message: "Bu dars testidan o'tgansiz, keyingi bosqichga o'ting",
        });
      }

      const resultIndex = attached.result.findIndex(
        (r) => String(r._id) === String(resultId)
      );
      if (resultIndex === -1) {
        return res.status(404).json({ message: "Result topilmadi" });
      }

      let correctCount = 0;
      let inCorrectCount = 0;

      tests.forEach((test) => {
        const correct = test.options.find((o) => o.isCorrect === true);
        const chosen = test.options.find((o) => o.userChoose === true);

        if (chosen && correct) {
          if (String(chosen._id) === String(correct._id)) {
            correctCount++;
          } else {
            inCorrectCount++;
          }
        } else {
          inCorrectCount++;
        }
      });

      const total = tests.length;
      const present = Math.round((correctCount / total) * 100);

      const endTime = moment();

      attached.result[resultIndex] = {
        ...attached.result[resultIndex]._doc,
        endTime: endTime.format("YYYY-MM-DD HH:mm"),
        correctCount,
        inCorrectCount,
        total,
        present,
        time: time,
        status: 2,
      };

      if (present >= 56) {
        await UserSubjectModel.findOneAndUpdate(
          {
            user: req.user?._id,
            subject: attached?.subject,
          },
          {
            $inc: { complateCount: 1 },
          }
        );
        attached.isPassed = true;
        attached.correctCount = correctCount;
      }

      await attached.save();

      const dataDoc = await AttachedModel.find({
        subject: attached?.subject,
        user: req.user?._id,
        isPassed: true,
      });

      if (Array.isArray(dataDoc) && dataDoc.length) {
        let correntArg = 0;
        dataDoc.map((item) => {
          correntArg += item?.correctCount || 0;
        });

        let reytingLesson = correntArg / (dataDoc?.length || 1);
        reytingLesson = Number(reytingLesson.toFixed(2));
        await UserSubjectModel.findOneAndUpdate(
          {
            user: req.user?._id,
            subject: attached?.subject,
          },
          {
            reytingLesson: reytingLesson,
          }
        );
      }

      return res.status(200).json({
        success: true,
        message: "Test yakunlandi va natijalar yangilandi",
        result: attached.result[resultIndex],
      });
    } catch (error) {
      console.error(error);
      return res.status(400).json({ message: error.message });
    }
  },

  answerFinalTest: async (req, res) => {
    try {
      const { subject, testType } = req.body;
      const userId = req.user?._id;

      if (!subject) {
        return res.status(400).json({ message: "subject ID kerak" });
      }

      const subjectId = new mongoose.Types.ObjectId(subject);
      if (testType == 2) {
        const lastLesson = await AttachedModel.findOne({
          user: userId,
          subject: subjectId,
        }).sort({ lessonStep: -1 });

        if (!lastLesson) {
          return res.status(400).json({
            message: "Siz hali bu fanga oid darslarni boshlamagansiz.",
          });
        }

        const lastPassedLesson = await AttachedModel.findOne({
          user: userId,
          subject: subjectId,
          isPassed: true,
        }).sort({ lessonStep: -1 });

        if (
          lastPassedLesson &&
          lastLesson.lessonStep === lastPassedLesson.lessonStep &&
          lastPassedLesson.isPassed
        ) {
        } else {
          const nextStep = (lastPassedLesson?.lessonStep || 0) + 1;
          return res.status(400).json({
            message: `Hurmatli foydalanuvchi, Sizga yakuniy test uchun ruxsat berilmaydi. Avval ${nextStep}-dars testlaridan o'ting.`,
          });
        }
      }

      if (testType == 1) {
        const exists = await SubjectTest.exists({
          user: userId,
          subject: subjectId,
          testType: 1,
        });
        console.log(exists);

        if (exists && exists.status == 2 && exists.isChecked) {
          return res.status(400).json({
            message:
              "Siz oldin boshlang'ich test ishlagansiz, endi darslarni tugatgandan so'ng yakuniy test ishlashingiz mumkin",
          });
        } else {
          await SubjectTest.findByIdAndDelete(exists?._id);
        }
        let a = await SubjectTest.findById(exists?._id);
        console.log(">>>>>>>>>>>>>", a);
      }

      const lessons = await TestModel.distinct("lesson", {
        subject: subjectId,
      });

      if (!lessons.length) {
        return res
          .status(404)
          .json({ message: "Bu fanga oid testlar topilmadi" });
      }

      const testsPerLesson = await Promise.all(
        lessons.map((lessonId) =>
          TestModel.aggregate([
            { $match: { subject: subjectId, lesson: lessonId } },
            { $sample: { size: 1 } },
            {
              $project: {
                question: 1,
                options: 1,
                subject: 1,
                lesson: 1,
                file: 1,
              },
            },
          ])
        )
      );

      // Flatten
      let allTests = testsPerLesson.flat();

      const testIds = new Set(allTests.map((t) => t._id.toString()));

      const TEST_LIMIT = 30;
      if (allTests.length < TEST_LIMIT) {
        const remaining = TEST_LIMIT - allTests.length;

        const extra = await TestModel.aggregate([
          {
            $match: {
              subject: subjectId,
              _id: {
                $nin: Array.from(
                  testIds,
                  (id) => new mongoose.Types.ObjectId(id)
                ),
              },
            },
          },
          { $sample: { size: remaining } },
          {
            $project: {
              question: 1,
              options: 1,
              subject: 1,
              lesson: 1,
              file: 1,
            },
          },
        ]);

        allTests.push(...extra);
      }

      if (allTests.length > TEST_LIMIT) {
        allTests = allTests
          .sort(() => Math.random() - 0.5)
          .slice(0, TEST_LIMIT);
      }

      const formattedTests = allTests.map((test) => ({
        ...test,
        options: test.options.map((opt) => ({
          ...opt,
          userChoose: false,
        })),
      }));

      const doc = await SubjectTest.create({
        user: userId,
        subject: subjectId,
        questions: formattedTests,
        startDate: moment().format("YYYY-MM-DD HH:mm"),
        testType,
      });

      return res.status(200).json({
        questions: doc.questions,
        startDate: doc.startDate,
        testCount: doc.questions.length,
        _id: doc._id,
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  finishFinalTest: async (req, res) => {
    try {
      const { questions } = req.body;
      const userId = req.user?._id;
      const testId = req.body?._id;
      if (!testId || !questions?.length) {
        return res.status(400).json({ message: "testId va questions kerak" });
      }

      const testDoc = await SubjectTest.findOne({
        _id: testId,
        user: userId,
      });

      if (!testDoc) {
        return res
          .status(404)
          .json({ message: "Test topilmadi yoki sizga tegishli emas" });
      }

      if (testDoc?.isChecked) {
        return res.status(404).json({ message: "Test tekshirilgan" });
      }

      let correctCount = 0;
      let inCorrectCount = 0;

      for (const q of questions) {
        const correct = q.options.some(
          (opt) => opt.isCorrect && opt.userChoose
        );
        if (correct) correctCount++;
        else inCorrectCount++;
      }

      const total = questions.length;
      const percent = Math.round((correctCount / total) * 100);

      testDoc.correctCount = correctCount;
      testDoc.endDate = moment().format("YYYY-MM-DD HH:mm:ss");
      testDoc.isPassed = percent >= 56;
      testDoc.questions = questions;
      await testDoc.save();
      await UserSubjectModel.findOneAndUpdate(
        {
          user: userId,
          subject: testDoc?.subject,
        },
        {
          reytingSubject: testDoc.correctCount,
        }
      );
      if (percent <= 56) {
        await UserSubjectModel.findOneAndUpdate(
          {
            user: userId,
            subject: testDoc?.subject,
          },
          {
            isComplated: false,
          }
        );

        const lessons = await lessonModel.find({ subject: testDoc?.subject });
        for (let i = 0; i < lessons?.length; i++) {
          await AttachedModel.create({
            subject: testDoc?.subject,
            lesson: lessons[i],
            user: userId,
            isPassed: false,
            lessonStep: lessons[i]?.step,
          });
        }
      } else {
        await SubjectTest.findById(testDoc?._id, {
          isPassed: true,
        });
      }

      await SubjectTest.findByIdAndUpdate(testDoc?._id, {
        isChecked: true,
        status: 2,
        questions,
      });
      if (testType == 1) {
        await UserSubjectModel.findOneAndUpdate(
          {
            user: userId,
            subject: subjectId,
          },
          {
            status: 2,
          }
        );
      }
      return res.status(200).json({
        testId: testDoc?._id,
        total,
        correctCount,
        inCorrectCount,
        percent,
        isPassed: testDoc.isPassed,
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  ContinueFinalTest: async (req, res) => {
    try {
      const { subject } = req.body;
      const userId = req.user?._id;

      const docs = await SubjectTest.find({
        user: userId,
        subject,
        isChecked: false,
      })
        .populate({
          path: "subject",
          select: ["title"],
        })
        .select([
          "subject",
          "startDate",
          "endDate",
          "questions",
          "isChecked",
          "endDate",
        ]);

      return res.status(200).json(docs);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },

  // Agar user testdan o'tsa subject boyicha tanlov qilih
  CompletionTest: async (req, res) => {
    try {
      const { isCompletion, testId } = req.body;
      const userId = req.user?._id;

      const testDoc = await SubjectTest.findOne({
        _id: testId,
        user: userId,
      });

      if (!testDoc) {
        return res
          .status(404)
          .json({ message: "Test topilmadi yoki sizga tegishli emas" });
      }

      if (!testDoc?.isChecked) {
        return res.status(404).json({ message: "Test yakunlanmagan" });
      }

      if (!testDoc?.isPassed) {
        return res.status(400).json({ message: "test is not passed " });
      }

      const result = await UserSubjectModel.findOne({
        user: userId,
        subject: testDoc?.subject,
      });
      if (result?.isComplated) {
        return res.status(400).json({ message: "Subject allready complated" });
      }

      let choice = null;
      if (isCompletion) {
        choice = true;
      } else {
        choice = false;
      }
      const lessons = await lessonModel.find({ subject: testDoc?.subject });
      for (let i = 0; i < lessons?.length; i++) {
        await AttachedModel.create({
          subject: testDoc?.subject,
          lesson: lessons[i],
          user: userId,
          isPassed: choice,
          lessonStep: lessons[i]?.step,
        });
      }

      if (isCompletion == true) {
        await UserSubjectModel.findOneAndUpdate(
          {
            user: userId,
            subject: testDoc?.subject,
          },
          {
            isComplated: true,
            complateCount: lessons.length,
          }
        );
      }

      return res.status(200).json({
        message: "success",
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};

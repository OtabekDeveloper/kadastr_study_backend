const TestModel = require("../../models/test.model");
const AttachedSubjectModel = require("../../models/attechedSubject.model");
const UserSubjectModel = require("../../models/userSubject.model");
const mongoose = require("mongoose");
const moment = require("moment");
const SubjectTest = require("../../models/SubjectTest.model");

module.exports = {
  answerTestLessonSubject: async (req, res) => {
    try {
      const { lesson, subject } = req.body;
      if (!lesson || !subject) {
        return res.status(400).json({ message: "lesson va subject ID kerak" });
      }

      const lessonId = new mongoose.Types.ObjectId(lesson);
      const subjectId = new mongoose.Types.ObjectId(subject);

      const tests = await TestModel.aggregate([
        { $match: { lesson: lessonId, subject: subjectId } },
        { $sample: { size: 5 } },
      ]);
      let attached = await AttachedSubjectModel.findOne({
        subject: subjectId,
        lesson: lessonId,
        user: req?.user?._id,
      });
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

      if (present >= 60) {
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
      }

      await attached.save();

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
      const { subject } = req.body;
      const userId = req.user?._id;

      if (!subject) {
        return res.status(400).json({ message: "subject ID kerak" });
      }

      const subjectId = new mongoose.Types.ObjectId(subject);

      if (req.body?.testType == 1) {
        const subjectTestDoc = await SubjectTest.findOne({
          user: userId,
          subject: subjectId,
          testType: 1,
        });
        if (subjectTestDoc) {
          return res.status(400).json({
            message:
              "Siz oldin boshlang'ich test ishlagansiz, endi darslarni tugatgandan so'ng yakuniy test ishlashingiz mumkin",
          });
        }
      }

      const lessons = await TestModel.distinct("lesson", {
        subject: subjectId,
      });

      if (!lessons.length) {
        return res
          .status(404)
          .json({ message: "Bu fanga oid testlar topilmadi" });
      }

      let allTests = [];

      for (const lessonId of lessons) {
        const lessonTests = await TestModel.aggregate([
          { $match: { subject: subjectId, lesson: lessonId } },
          { $sample: { size: 2 } }, // har bir darsdan 1-2 ta test
        ]);
        allTests.push(...lessonTests);
      }

      if (allTests.length < 30) {
        const extra = await TestModel.aggregate([
          { $match: { subject: subjectId } },
          { $sample: { size: 30 - allTests.length } },
        ]);
        allTests.push(...extra);
      }

      if (allTests.length > 30) {
        allTests = allTests.sort(() => 0.5 - Math.random()).slice(0, 30);
      }

      const formattedTests = allTests.map((test) => ({
        ...test,
        options: test.options.map((opt) => ({
          ...opt,
          userChoose: false,
        })),
      }));

      const now = moment().format("YYYY-MM-DD HH:mm:ss");

      const doc = await SubjectTest.create({
        user: userId,
        subject: subjectId,
        questions: formattedTests,
        startDate: now,
        testType: req.body?.testType,
      });

      return res.status(200).json({
        questions: doc?.questions,
        startDate: doc?.startDate,
        testCount: doc?.questions?.length,
        _id: doc?._id,
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

      if (testDoc?.status == 2) {
        return res.status(400).json({ message: "Test tugatilingan holatda" });
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
      testDoc.status = 2;
      testDoc.questions = questions;
      await testDoc.save();

      if (percent >= 56) {
        await UserSubjectModel.findOneAndUpdate(
          {
            user: userId,
            subject: testDoc?.subject,
          },
          {
            isComplated: true,
          }
        );
      }

      return res.status(200).json({
        message: "Test yakunlandi",
        data: {
          total,
          correctCount,
          inCorrectCount,
          percent,
          isPassed: testDoc.isPassed,
        },
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};

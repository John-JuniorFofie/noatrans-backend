export const getEnrolledCourses = async (req: Request, res: Response) => {
  const { userId } = (req as any).user;

  const enrollments = await Enrollment.find({ userId })
    .populate("courseId", "title");

  const data = enrollments.map((e) => ({
    courseId: e.courseId._id,
    courseName: e.courseId.title,
  }));

  res.json(data);
};

export const getContinueLearning = async (req: Request, res: Response) => {
  const { userId } = (req as any).user;

  const enrollments = await Enrollment.find({ userId }).populate("courseId");

  const result = [];

  for (const enroll of enrollments) {
    const lessons = await Lesson.find({ courseId: enroll.courseId._id });

    const completedLessons = await Progress.find({
      userId,
      courseId: enroll.courseId._id,
      completed: true,
    });

    const progressPercent = Math.round(
      (completedLessons.length / lessons.length) * 100
    );

    const nextLesson = lessons.find(
      (lesson) =>
        !completedLessons.some(
          (p) => p.lessonId.toString() === lesson._id.toString()
        )
    );

    result.push({
      courseId: enroll.courseId._id,
      courseName: enroll.courseId.title,
      lessonsCompleted: completedLessons.length,
      totalLessons: lessons.length,
      progress: progressPercent,
      nextLessonId: nextLesson?._id,
      nextLessonTitle: nextLesson?.title,
    });
  }

  res.json(result);
};

export const getPastActivities = async (req: Request, res: Response) => {
  const { userId } = (req as any).user;

  const activities = await Activity.find({ userId })
    .populate("courseId", "title")
    .sort({ date: -1 });

  const data = activities.map((a) => ({
    activityId: a._id,
    title: a.title,
    course: a.courseId.title,
    score: a.score,
    total: a.total,
    date: a.date,
    type: a.type,
  }));

  res.json(data);
};

export const getHoursLearned = async (req: Request, res: Response) => {
  const { userId } = (req as any).user;

  const completedLessons = await Progress.find({
    userId,
    completed: true,
  }).populate("lessonId");

  let totalMinutes = 0;

  completedLessons.forEach((p) => {
    totalMinutes += (p.lessonId as any).duration || 0;
  });

  res.json({
    totalHours: Math.floor(totalMinutes / 60),
  });
};

export const getStreak = async (req: Request, res: Response) => {
  const { userId } = (req as any).user;

  const activities = await Activity.find({ userId }).sort({ date: -1 });

  let streak = 0;
  let currentDate = new Date();

  for (const act of activities) {
    const actDate = new Date(act.date);

    if (
      actDate.toDateString() === currentDate.toDateString()
    ) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  res.json({ dayStreak: streak });
};

export const getUpcomingLessons = async (_req: Request, res: Response) => {
  res.json([
    {
      lessonTitle: "Live Class",
      date: "2026-03-20",
      time: "10:00 AM",
      meetingLink: "https://zoom.com",
    },
  ]);
};
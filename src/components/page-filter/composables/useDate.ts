export const useDate = () => {
  // 日期选择器快捷选项
  const dateShortcuts = [
    {
      text: "今天",
      value: new Date(),
    },
    {
      text: "昨天",
      value: () => {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24);
        return date;
      },
    },
    {
      text: "一周前",
      value: () => {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
        return date;
      },
    },
  ];

  // 日期选择器禁用日期
  const disabledDate = (time: Date) => {
    return time.getTime() > Date.now();
  };

  //   日期范围选择器快捷选项
  const daterangeShortcuts = [
    {
      text: "今天",
      value: () => {
        const now = new Date();
        const start = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          0,
          0,
          0,
          0
        );
        const end = now;
        return [start, end];
      },
    },
    {
      text: "昨天",
      value: () => {
        const now = new Date();
        const start = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 1,
          0,
          0,
          0,
          0
        );
        const end = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate() - 1,
          23,
          59,
          59,
          999
        );
        return [start, end];
      },
    },
    {
      text: "近3天",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 3);
        return [start, end];
      },
    },
    {
      text: "近7天",
      value: () => {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        return [start, end];
      },
    },
    {
      text: "本月",
      value: () => {
        const now = new Date();
        const start = new Date(
          now.getFullYear(),
          now.getMonth(),
          1,
          0,
          0,
          0,
          0
        );
        const end = now;
        return [start, end];
      },
    },
    {
      text: "上月",
      value: () => {
        const now = new Date();
        const start = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1,
          0,
          0,
          0,
          0
        );
        const end = new Date(
          now.getFullYear(),
          now.getMonth(),
          0,
          23,
          59,
          59,
          999
        );
        return [start, end];
      },
    },
  ];

  return { dateShortcuts, disabledDate, daterangeShortcuts };
};

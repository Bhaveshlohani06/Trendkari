export const formatTimeAgo = (date) => {
  const seconds = Math.floor(
    (new Date() - new Date(date)) / 1000
  );

  const intervals = {
    वर्ष: 31536000,
    महीना: 2592000,
    दिन: 86400,
    घंटा: 3600,
    मिनट: 60,
  };

  for (const key in intervals) {
    const value = Math.floor(seconds / intervals[key]);
    if (value >= 1) {
      return `${value} ${key} पहले`;
    }
  }

  return "अभी अभी";
};


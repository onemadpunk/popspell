  return { sheets, get: id => sheets[id] || null, forLesson: lessonId => Object.values(sheets).filter(s => s.lesson === lessonId) };
})();

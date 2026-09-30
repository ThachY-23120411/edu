/**
 * DEPRECATED / REMOVED:
 * Toàn bộ dữ liệu mẫu (mock data) đã được gỡ bỏ hoàn toàn khỏi hệ thống theo yêu cầu.
 * Tất cả dữ liệu đều được quản lý tập trung và truy xuất từ Backend Modular Monolith.
 * Phân hệ trích xuất sách & số hóa đề thi đang được Dev khác phát triển và sẽ nạp trực tiếp vào DB khi hoàn thành.
 */

export const USER_PROFILE = {
  name: 'Học viên',
  targetExam: 'IELTS 7.5+',
  currentStreak: 0,
  completedToday: 0,
  goalToday: 3,
  coins: 0,
  notificationsCount: 0,
  weeklyActivity: [],
};

export const MOCK_VOCABULARY_LIST = [];
export const MOCK_EXAM_LIST = [];
export const MOCK_QUESTIONS_SECTION2 = [];
export const MOCK_EXAM_PASSAGE_URBAN = null;
export const MOCK_RESULT_DATA = null;

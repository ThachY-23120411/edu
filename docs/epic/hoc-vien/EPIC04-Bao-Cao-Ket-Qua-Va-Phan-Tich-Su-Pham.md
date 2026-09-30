# EPIC-04 — Báo Cáo Kết Quả & Phân Tích Sư Phạm

- **Role:** Thí sinh / Học viên (Candidate / Student)
- **Platform:** Web Responsive (Desktop / Tablet / Mobile)
- **Menu / Route:** `/result` và `/result/[id]`
- **Goal:** Cung cấp báo cáo phân tích kết quả thi toàn diện, chuyển đổi điểm thô sang Band điểm chuẩn hóa (IELTS, CFA, TOEIC), xếp hạng phân vị bách phân so với toàn bộ thí sinh, bóc tách năng lực theo từng dạng bài và phân tích bẫy tư duy sâu sắc chuẩn sư phạm để người học khắc phục sai sót ngay lập tức.
- **Scope:** 
  - Breadcrumb điều hướng và tiêu đề báo cáo kèm thông số tổng thời gian làm bài thực tế.
  - Thẻ điểm tổng quan (Overall Score Card): Điểm Band Score lớn (ví dụ 7.5 / 9.0 Band), đánh giá so với mục tiêu học viên, 4 chỉ số KPI chính (Tỷ lệ chính xác %, Điểm bách phân Percentile Rank, Thời gian hoàn thành, Tốc độ làm bài trung bình phút/câu).
  - Phân tích năng lực theo dạng câu hỏi (Skill Breakdown): Multiple Choice, Matching Headings, Sentence Completion, True/False/Not Given với số câu đúng/tổng, tỷ lệ %, thanh tiến độ và nhận xét sư phạm (kèm cảnh báo dạng bài yếu `isWeak`).
  - Danh mục chi tiết giải thích từng câu hỏi (Question-by-Question Pedagogical Explanations):
    - Bộ lọc câu hỏi: Tất cả, Chỉ câu sai, Chỉ câu đã cắm cờ.
    - So sánh đáp án thí sinh chọn vs Đáp án chính xác tuyệt đối.
    - Khối trích dẫn dẫn chứng trực tiếp từ bài đọc (`evidenceLocation`, `evidenceQuote`).
    - Phân tích bẫy đề thi và lỗi tư duy thường gặp (`mindsetTrap`).
    - Phân tích bẫy từ vựng và diễn đạt tương đương (`vocabularyTrap`).
    - Hộp quy tắc vàng làm bài không thể sai (`goldenRule`).
    - Nút lưu câu hỏi vào Sổ tay lỗi sai cá nhân (`BookmarkMistake`).
  - Thanh hành động cuối trang: Nút mở Sổ tay lỗi sai, nút mở Drawer từ vựng bài đọc, nút "Làm lại bài thi" và nút "Tải bảng điểm".
  - *Giới hạn phạm vi:* Việc lưu trữ dài hạn câu sai vào sổ tay được phân định sang `EPIC-05`.

## Thành phần giao diện (UI Components & Layout)

1. **Khối Header & Thao tác (`ResultHeader`):**
   - Breadcrumb: `Trang chủ / Kho đề thi / Báo cáo kết quả và phân tích chi tiết`.
   - Tiêu đề báo cáo và phụ đề thời gian làm bài.
   - Nút hành động: "Làm lại bài thi" (quay lại phòng thi) và "Tải bảng điểm" (`window.print()`).
2. **Khối Thẻ điểm & KPI tổng thể (`OverallScoreCard`):**
   - Cột trái: Nhãn chứng chỉ, điểm Band Score font Monospace 60px, thông điệp vượt mục tiêu màu xanh lá.
   - Cột phải: Lưới 4 ô thống kê: Tỷ lệ chính xác, Thứ hạng bách phân, Thời gian làm bài, Tốc độ phút/câu.
3. **Khối Phân tích năng lực theo dạng bài (`SkillBreakdownSection`):**
   - Lưới 4 card tương ứng 4 dạng câu hỏi: Multiple Choice, Matching Headings, Sentence Completion, True/False/Not Given.
   - Mỗi card có tỷ lệ %, thanh bar tiến độ, nhận xét chuyên môn và viền đỏ cảnh báo nếu là điểm yếu.
4. **Khối Chi tiết lời giải từng câu (`QuestionReviewList`):**
   - Bộ 3 nút lọc: Tất cả câu, Chỉ câu sai, Chỉ câu gắn cờ.
   - Danh sách card từng câu hỏi: Trạng thái Đúng/Sai, nút lưu vào sổ tay lỗi sai, đề bài, so sánh đáp án học viên vs đáp án đúng, hộp trích dẫn dẫn chứng bài đọc, phân tích bẫy từ vựng, phân tích lỗi tư duy và quy tắc vàng.
5. **Khối Điều hướng củng cố kiến thức (`ReinforceCallout`):**
   - Nút "Mở sổ tay lỗi sai" và nút "Xem từ vựng bài đọc".

---

## Danh sách User Stories và Giao diện tương ứng trong Epic

| User Story | Phân loại giao diện | Thành phần giao diện tương ứng | Phạm vi đặc tả UI |
| :--- | :--- | :--- | :--- |
| [EPIC04-US01 — Xem Tổng Quan Điểm Số & Phân Tích Kỹ Năng](../../user-stories/hoc-vien/EPIC04-Bao-Cao-Ket-Qua-Va-Phan-Tich-Su-Pham/EPIC04-US01-Xem-Tong-Quan-Diem-So-Va-Phan-Tich-Ky-Nang.md) | Màn hình chính | **Thẻ Điểm Tổng Quan & Bảng Phân Tích Dạng Bài** | Đặc tả hiển thị Band Score, các chỉ số KPI bách phân và ma trận phân tích năng lực từng dạng bài |
| [EPIC04-US02 — Tra Cứu Chi Tiết Lời Giải & Bẫy Đề Thi](../../user-stories/hoc-vien/EPIC04-Bao-Cao-Ket-Qua-Va-Phan-Tich-Su-Pham/EPIC04-US02-Tra-Cuu-Chi-Tiet-Loi-Giai-Va-Bay-De-Thi.md) | Màn hình chính | **Bộ Lọc Lời Giải & Khung Phân Tích Sư Phạm** | Đặc tả lọc câu sai/cắm cờ, tra cứu vị trí dẫn chứng, phân tích bẫy mindset/paraphrase và lưu câu sai vào sổ tay |

---

## Flow specification

1. Sau khi nộp bài từ phòng thi, hệ thống hoàn tất chấm điểm và điều hướng thí sinh sang `/result/[id]`.
2. Hệ thống tải toàn bộ dữ liệu thống kê, xếp hạng phân vị và bộ giải thích sư phạm.
3. Thí sinh xem xét điểm số tổng quan và các dạng bài làm chưa tốt.
4. Thí sinh lọc danh sách các câu sai để đọc kỹ phân tích bẫy tư duy, trích dẫn bài đọc và bấm lưu vào Sổ tay lỗi sai để ôn luyện sau.

## Traceability

- Yêu cầu sản phẩm liên quan: `PRD-RES-01: Báo cáo kết quả và chẩn đoán năng lực CertPrep`
- Bảng CSDL liên quan: `exam_attempts`, `exam_attempt_answers`, `exam_attempt_skill_breakdown`, `questions`, `question_explanations`, `user_mistake_notebook`
- Kiểm toán giao diện: `src/views/ResultPage.tsx`

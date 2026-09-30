# EPIC-03 — Phòng Thi Trực Tuyến Chuẩn Quốc Tế

- **Role:** Thí sinh / Học viên (Candidate / Student)
- **Platform:** Web Desktop / Laptop (Mô phỏng thi máy tính chuyên nghiệp Computer-Delivered)
- **Menu / Route:** `/exam/[id]` (ví dụ: `/exam/ielts-cam-18-test-3`)
- **Goal:** Mô phỏng chính xác áp lực và định dạng thi trên máy tính của các tổ chức khảo thí quốc tế hàng đầu (British Council/IDP IELTS on Computer, ETS TOEIC, Hanban HSK), hỗ trợ công cụ đọc văn bản chuyên nghiệp (zoom chữ, bôi dạ quang, tra từ điển ngữ cảnh tức thì) và quản lý chặt chẽ đồng hồ thời gian làm bài.
- **Scope:** 
  - Header phòng thi độc lập: Nút "Thoát" kèm modal cảnh báo, tên đề thi, đoạn văn đọc hiểu, đồng hồ đếm ngược thời gian (hỗ trợ ẩn/hiện, tạm dừng/tiếp tục), bộ đếm tiến độ số câu đã trả lời, nút "Nộp bài thi" kèm modal xác nhận.
  - Bố cục chia đôi màn hình (Split Testing Workspace):
    - Cột trái: Văn bản bài đọc hiểu (`Passage Viewer`), thanh công cụ chỉnh cỡ chữ (14px, 15px, 16px, 18px), chế độ bôi màu văn bản (`Highlighter Mode`), ảnh minh họa bài đọc (`Figure`), chú thích, các đoạn văn được đánh số thứ tự `[Paragraph 1..5]`.
    - Tính năng bôi đen văn bản để tra cứu từ điển học thuật tức thì (`DictionaryPopup`) với phiên âm IPA, giải nghĩa tiếng Việt và câu ví dụ.
    - Cột phải: Khung hiển thị câu hỏi hiện tại (`Question Card`), số thứ tự câu hỏi, tên dạng câu hỏi, nội dung đề bài tiếng Anh, bản dịch nghĩa tiếng Việt tùy chọn, các phương án lựa chọn (A, B, C, D) kèm bản dịch nghĩa tương ứng.
    - Các công cụ hỗ trợ câu hỏi: Nút cắm cờ xem lại (`Flag for review`), khung ghi chú câu hỏi (`Candidate Notes`), nút điều hướng Câu trước/Câu tiếp (`Prev/Next Question`).
    - Lưới điều hướng câu hỏi toàn bài (Question Navigation Palette: Câu 14..17 hoặc 1..40): Đổi màu trạng thái Đã trả lời (xanh), Đang làm (viền đậm), Chưa làm (xám), Có cắm cờ (chấm vàng).
  - Modal xác nhận nộp bài (`SubmitConfirmModal`) cảnh báo số câu chưa làm trước khi chấm điểm.
  - Modal xác nhận thoát phòng thi (`ExitConfirmModal`) lưu lại thời gian và câu hỏi hiện tại.
  - *Giới hạn phạm vi:* Việc tính toán quy đổi điểm số và phân tích bẫy đề sau khi nộp bài được phân định sang `EPIC-04`.

## Thành phần giao diện (UI Components & Layout)

1. **Khối Header Phòng thi cố định (`ExamHeaderBar`):**
   - Nút "Thoát", tiêu đề đề thi và tên bài đọc.
   - Bộ đếm thời gian dạng đếm lùi `MM:SS` (đổi màu đỏ khi dưới 5 phút), nút mắt ẩn/hiện đồng hồ, nút play/pause tạm dừng.
   - Thống kê tiến độ "Đã trả lời: X/Y câu" và nút "Nộp bài thi".
2. **Khối Cột trái: Bài đọc hiểu (`PassageWorkspace`):**
   - Thanh công cụ bài đọc: Nhãn "Reading Passage 2", nút Zoom In / Zoom Out cỡ chữ, nút bật/tắt bút dạ quang.
   - Khung cuộn văn bản: Tiêu đề H2 bài đọc, hình ảnh minh họa Pod thẳng đứng, các đoạn văn `[Paragraph 1]` đến `[Paragraph 5]`.
   - Popup tra từ điển nổi (`DictionaryPopup`) xuất hiện chính xác tại tọa độ chuột khi bôi đen từ.
3. **Khối Cột phải: Khu vực câu hỏi & Trả lời (`QuestionWorkspace`):**
   - Thanh trạng thái câu: "Câu hỏi 14", nhãn dạng bài (Multiple Choice, True/False/Not Given...), nút cắm cờ Flag.
   - Khung đề bài: Đề bài tiếng Anh và dịch tiếng Việt in nghiêng.
   - Danh sách phương án lựa chọn: Các button radio tương tác A, B, C, D có văn bản và dịch nghĩa.
   - Thanh điều hướng câu: Nút "Câu trước", nút "Câu tiếp theo".
   - Lưới bảng câu hỏi (Question Matrix): Bảng các ô số từ 1..40 phản ánh trạng thái câu hỏi thời gian thực.

---

## Danh sách User Stories và Giao diện tương ứng trong Epic

| User Story | Phân loại giao diện | Thành phần giao diện tương ứng | Phạm vi đặc tả UI |
| :--- | :--- | :--- | :--- |
| [EPIC03-US01 — Thao Tác Làm Bài Thi & Điều Hướng Câu Hỏi](../../user-stories/hoc-vien/EPIC03-Phong-Thi-Truc-Tuyen-Chuan-Quoc-Te/EPIC03-US01-Thao-Tac-Lam-Bai-Thi-Va-Dieu-Huong-Cau-Hoi.md) | Màn hình chính | **Khung Câu Hỏi & Lưới Điều Hướng Câu** | Đặc tả tương tác chọn phương án, đổi câu hỏi, cắm cờ xem lại và cập nhật lưới ma trận câu hỏi |
| [EPIC03-US02 — Tương Tác Bài Đọc & Tra Từ Điển Ngữ Cảnh](../../user-stories/hoc-vien/EPIC03-Phong-Thi-Truc-Tuyen-Chuan-Quoc-Te/EPIC03-US02-Tuong-Tac-Bai-Doc-Va-Tra-Tu-Dien-Ngu-Canh.md) | Màn hình chính & Popup | **Passage Viewer & Dictionary Popup** | Đặc tả chỉnh cỡ chữ, bật bút dạ quang, bôi đen văn bản kích hoạt popup từ điển ngữ cảnh tức thì |
| [EPIC03-US03 — Quản Lý Thời Gian Thi & Nộp Bài Thi](../../user-stories/hoc-vien/EPIC03-Phong-Thi-Truc-Tuyen-Chuan-Quoc-Te/EPIC03-US03-Quan-Ly-Thoi-Gian-Thi-Va-Nop-Bai-Thi.md) | Header & Modal | **Đồng Hồ Đếm Ngược & Modal Xác Nhận Nộp** | Đặc tả đồng hồ đếm lùi, tạm dừng/ẩn hiện, modal xác nhận nộp bài và cảnh báo số câu chưa hoàn tất |

---

## Flow specification

1. Thí sinh truy cập route `/exam/[id]`, hệ thống kiểm tra và nạp đề thi cùng các đoạn văn và danh sách câu hỏi.
2. Đồng hồ đếm ngược bắt đầu chạy từ `duration_minutes`. Thí sinh đọc bài đọc bên trái và chọn đáp án bên phải.
3. Khi thí sinh click chọn đáp án, hệ thống ghi nhận `user_answer`, cập nhật lưới số câu hỏi và đồng bộ trạng thái lưu tạm.
4. Thí sinh bấm "Nộp bài thi", hệ thống mở Modal kiểm tra số câu chưa làm và yêu cầu xác nhận trước khi chuyển sang trang kết quả.

## Traceability

- Yêu cầu sản phẩm liên quan: `PRD-EXAM-01: Giao diện phòng thi máy tính chuẩn quốc tế CertPrep`
- Bảng CSDL liên quan: `exams`, `exam_passages`, `passage_paragraphs`, `questions`, `question_options`, `exam_attempts`, `exam_attempt_answers`, `vocabulary_terms`
- Kiểm toán giao diện: `src/views/ExamPage.tsx`, `src/components/DictionaryPopup.tsx`

# EPIC-05 — Sổ Tay Lỗi Sai & Kho Từ Vựng Học Thuật

- **Role:** Thí sinh / Học viên (Candidate / Student)
- **Platform:** Web Responsive (Modal Popup & Right Slide-Over Drawer)
- **Menu / Route:** Truy cập toàn cục từ Top Utility Bar trên Navbar hoặc từ trang Báo cáo kết quả
- **Goal:** Cung cấp hai công cụ ôn tập cá nhân hóa chuyên sâu: Sổ tay chẩn đoán bẫy đề thi (giúp người học không lặp lại lỗi sai tương tự) và Ngân hàng từ vựng học thuật trọng tâm (giúp tra cứu nhanh, nghe phát âm chuẩn và tích lũy vốn từ band cao).
- **Scope:** 
  - Modal Sổ tay ghi chú lỗi sai & Bẫy tư duy (`MistakeNotebookModal`):
    - Header modal màu tối sang trọng, đếm tổng số lỗi sai đã lưu.
    - Thanh tab phân loại dạng bẫy: Tất cả lỗi sai, Bẫy tư duy / Not Given, Bẫy từ vựng & Paraphrase, Bẫy ngữ pháp đảo ngữ.
    - Danh sách các card câu sai: Tên đề thi, phần thi, số câu hỏi, dạng bài, đề bài gốc, so sánh đáp án bạn chọn sai vs đáp án đúng, nhãn phân loại bẫy, đoạn phân tích bẫy chi tiết, hộp quy tắc vàng rút kinh nghiệm và nút "Làm lại câu này".
  - Drawer tra cứu từ vựng học thuật trọng tâm (`VocabDrawer`):
    - Trượt từ cạnh phải màn hình (Slide-Over Drawer).
    - Header hiển thị số lượng từ khóa học thuật band 7.0 - 8.5+.
    - Thanh tìm kiếm từ vựng theo từ gốc tiếng Anh hoặc nghĩa tiếng Việt.
    - Nút lọc "Chỉ từ đã lưu" kèm bộ đếm.
    - Danh sách từ vựng: Từ gốc, ký hiệu phiên âm IPA, từ loại, nút nghe phát âm chuẩn bằng giọng bản ngữ (Web Speech Synthesis API), nút lưu/bỏ lưu từ (Bookmark toggle), nghĩa tiếng Việt chi tiết, câu ví dụ nguyên văn trong bài đọc và cụm từ cố định (Collocation).
  - *Giới hạn phạm vi:* Dữ liệu câu sai và từ vựng được tự động liên kết từ các bài thi đã làm trong `EPIC-03` và `EPIC-04`.

## Thành phần giao diện (UI Components & Layout)

1. **Khối Modal Sổ tay lỗi sai (`MistakeNotebookModal`):**
   - Backdrop làm mờ toàn màn hình.
   - Header: Icon bookmark, tiêu đề "Sổ tay ghi chú lỗi sai & Bẫy tư duy", nút X đóng modal.
   - Filter Bar: Dải tab phân loại các dạng bẫy đề thi.
   - Danh sách câu sai có thanh cuộn riêng: Mỗi câu có khung viền đỏ/xanh, chi tiết đề bài, phân tích bẫy và quy tắc vàng.
2. **Khối Drawer Từ vựng (`VocabDrawer`):**
   - Khung trượt bên phải (Right-side Drawer max-w-md).
   - Header: Tiêu đề "Từ Vựng Trọng Tâm Bài Đọc", thông số band điểm và nút đóng X.
   - Thanh công cụ: Ô tìm kiếm từ vựng và nút toggle lọc chỉ từ đã lưu.
   - Danh sách từ vựng dạng danh sách dọc có phát âm âm thanh và bookmark.

---

## Danh sách User Stories và Giao diện tương ứng trong Epic

| User Story | Phân loại giao diện | Thành phần giao diện tương ứng | Phạm vi đặc tả UI |
| :--- | :--- | :--- | :--- |
| [EPIC05-US01 — Quản Lý & Ôn Tập Sổ Tay Lỗi Sai Theo Bẫy Tư Duy](../../user-stories/hoc-vien/EPIC05-So-Tay-Loi-Sai-Va-Tu-Vung-Hoc-Thuat/EPIC05-US01-Quan-Ly-Va-On-Tap-So-Tay-Loi-Sai-Theo-Bay-Tu-Duy.md) | Modal Popup | **Modal Sổ Tay Ghi Chú Lỗi Sai & Bẫy Tư Duy** | Đặc tả xem danh sách câu sai, lọc theo nhóm bẫy, xem giải thích bẫy và làm lại câu hỏi |
| [EPIC05-US02 — Tra Cứu, Phát Âm & Lưu Trữ Từ Vựng Học Thuật](../../user-stories/hoc-vien/EPIC05-So-Tay-Loi-Sai-Va-Tu-Vung-Hoc-Thuat/EPIC05-US02-Tra-Cuu-Phat-Am-Va-Luu-Tru-Tu-Vung-Hoc-Thuat.md) | Slide-over Drawer | **Drawer Tra Cứu Từ Vựng Trọng Tâm** | Đặc tả tìm kiếm từ vựng, nghe phát âm speech synthesis, lọc từ đã lưu và hiển thị câu ví dụ/collocation |

---

## Flow specification

1. Học viên mở Sổ tay lỗi sai từ Header Navbar hoặc từ trang Báo cáo kết quả.
2. Học viên chuyển tab để xem các bẫy tư duy hay gặp (Mindset Trap, Paraphrase Trap...) và đọc lại quy tắc vàng để khắc phục.
3. Học viên mở Drawer từ vựng để tra cứu các từ mới trong bài thi, bấm nút loa để nghe giọng đọc và lưu lại các từ cần học thuộc.

## Traceability

- Yêu cầu sản phẩm liên quan: `PRD-NOTE-01: Hệ thống sổ tay bẫy đề thi và từ điển học thuật CertPrep`
- Bảng CSDL liên quan: `user_mistake_notebook`, `mistake_trap_types`, `questions`, `vocabulary_terms`, `user_saved_vocabulary`
- Kiểm toán giao diện: `src/components/MistakeNotebookModal.tsx`, `src/components/VocabDrawer.tsx`

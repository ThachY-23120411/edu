# EPIC-02 — Kho Đề Thi & Bộ Lọc Khảo Thí

- **Role:** Thí sinh / Học viên (Candidate / Student)
- **Platform:** Web Responsive (Desktop / Tablet / Mobile)
- **Menu / Route:** `/library` (Kho đề thi và bộ lọc)
- **Goal:** Giúp học viên dễ dàng khám phá, lọc và tìm kiếm đề thi mục tiêu từ ngân hàng đề thi chuẩn hóa quốc tế với đa dạng tiêu chí (Chứng chỉ, Kỹ năng, Độ khó, Từ khóa) và quản lý danh sách đề thi yêu thích cá nhân (Bookmarks).
- **Scope:** 
  - Thanh breadcrumb và tiêu đề trang kèm bộ đếm tổng số đề thi có sẵn và số đề đã lưu.
  - Sidebar bộ lọc đa tiêu chí bên trái (Keyword, Chứng chỉ Ngoại ngữ, Chứng chỉ Kinh tế, Kỹ năng Reading/Listening, Độ khó Easy/Medium/Hard) kèm nút "Đặt lại".
  - Thanh công cụ phía trên danh sách: Sắp xếp theo phổ biến, đánh giá cao, mới nhất.
  - Lưới hiển thị danh sách các card đề thi khảo thí (2 cột trên desktop) hiển thị đầy đủ thông số: Tên đề, phụ đề, tags, nhãn bản quyền, biểu tượng audio/video, số câu hỏi, thời lượng, số lượt làm, điểm đánh giá sao, nút lưu đề thi (Bookmark toggle) và nút hành động "Bắt đầu làm bài thi".
  - Trạng thái rỗng (Empty State) khi không tìm thấy kết quả phù hợp với gợi ý đặt lại bộ lọc.
  - *Giới hạn phạm vi:* Việc tương tác làm bài cụ thể trong phòng thi thuộc `EPIC-03`.

## Thành phần giao diện (UI Components & Layout)

Bố cục chuẩn khảo thí 2 cột (Catalog 2-Column Standard Testing Layout):

1. **Khối Header & Breadcrumb (`LibraryHeader`):**
   - Breadcrumb: `Trang chủ / Kho đề thi và bộ lọc`.
   - Tiêu đề H1 và đoạn diễn giải ngắn.
   - Thẻ thống kê nhanh: "Đề thi có sẵn: 7 | Đã lưu: 1".
2. **Khối Sidebar Bộ lọc (`FilterSidebar` - 3/12 cột desktop):**
   - Tiêu đề "Bộ lọc đề thi" kèm nút "Đặt lại" (Reset filters).
   - Ô nhập từ khóa tìm kiếm (Search Input).
   - Nhóm bộ lọc hệ thống chứng chỉ: Nút "Tất cả chứng chỉ", Khối Ngoại ngữ (IELTS, HSK, TOEIC, TOEFL), Khối Kinh tế (CFA, GMAT, ACCA, GRE).
   - Nhóm kỹ năng (Tất cả, Đọc hiểu Reading, Nghe hiểu Listening).
   - Nhóm độ khó (Tất cả, Cơ bản, Trung cấp, Nâng cao).
3. **Khối Danh sách đề thi (`ExamsCatalogGrid` - 9/12 cột desktop):**
   - Thanh công cụ sắp xếp (Sort By): "Phổ biến nhất", "Đánh giá cao nhất", "Mới nhất".
   - Lưới danh sách Card đề thi: Mỗi card hiển thị huy hiệu loại đề, tiêu đề, tóm tắt passages, các tag, thời lượng, số câu, lượt thi, đánh giá sao, nút Bookmark góc phải và nút "Bắt đầu làm bài thi".
   - Empty State minh họa khi bộ lọc không có dữ liệu trả về.

---

## Danh sách User Stories và Giao diện tương ứng trong Epic

| User Story | Phân loại giao diện | Thành phần giao diện tương ứng | Phạm vi đặc tả UI |
| :--- | :--- | :--- | :--- |
| [EPIC02-US01 — Tìm Kiếm & Lọc Đề Thi Đa Tiêu Chí](../../user-stories/hoc-vien/EPIC02-Kho-De-Thi-Va-Bo-Loc-Khao-Thi/EPIC02-US01-Tim-Kiem-Va-Loc-De-Thi-Da-Tieu-Chi.md) | Màn hình chính | **Thanh Tìm Kiếm & Sidebar Bộ Lọc Đa Chiều** | Đặc tả ô tìm kiếm từ khóa, chọn danh mục chứng chỉ, kỹ năng, độ khó và sắp xếp kết quả |
| [EPIC02-US02 — Quản Lý Danh Sách Đề Thi Yêu Thích](../../user-stories/hoc-vien/EPIC02-Kho-De-Thi-Va-Bo-Loc-Khao-Thi/EPIC02-US02-Quan-Ly-Danh-Sach-De-Thi-Yeu-Thich.md) | Màn hình chính | **Card Đề Thi & Nút Bookmark Yêu Thích** | Đặc tả thao tác click lưu/hủy lưu đề thi, cập nhật tức thì bộ đếm đề đã lưu và đồng bộ CSDL |

---

## Flow specification

1. Học viên vào `/library` (có thể kèm param `?category=hsk` từ Navbar hoặc Trang chủ).
2. Hệ thống tải danh mục và danh sách đề thi phù hợp.
3. Học viên nhập từ khóa hoặc tích chọn các tiêu chí lọc $\rightarrow$ Lưới đề thi cập nhật ngay lập tức không cần tải lại trang.
4. Học viên bấm nút Bookmark để lưu lại đề hoặc bấm "Bắt đầu làm bài thi" để điều hướng vào phòng thi `EPIC-03`.

## Traceability

- Yêu cầu sản phẩm liên quan: `PRD-LIB-01: Thư viện đề thi và bộ lọc đa chiều CertPrep`
- Bảng CSDL liên quan: `exams`, `exam_categories`, `certificate_domains`, `tags`, `exam_tag_relations`, `user_bookmarked_exams`
- Kiểm toán giao diện: `src/views/LibraryPage.tsx`

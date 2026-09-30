# EPIC-01 — Trang Chủ & Điều Hướng Khảo Thí

- **Role:** Thí sinh / Học viên (Candidate / Student)
- **Platform:** Web Responsive (Desktop / Tablet / Mobile)
- **Menu / Route:** `/` (Trang chủ) và Thanh điều hướng toàn cục (Global Navbar)
- **Goal:** Cung cấp trung tâm khảo thí tập trung, giúp học viên nhanh chóng nắm bắt tiến độ học tập hiện tại, phục hồi bài thi đang làm dở, lựa chọn lộ trình chứng chỉ mục tiêu, tìm kiếm đề thi và khám phá hệ sinh thái khảo thí chuẩn quốc tế.
- **Scope:** 
  - Hiển thị thanh tiện ích toàn cục: Thông báo quy chuẩn khảo thí, Sổ tay lỗi sai, Kho từ vựng, Avatar hồ sơ, Bộ chọn mục tiêu học tập (Target Selector).
  - Hero Section với thanh tìm kiếm nhanh tức thì và các chip từ khóa gợi ý (Cambridge 18, CFA Level 1, HSK 5...).
  - Thẻ tóm tắt hoạt động gần nhất (Recent in-progress test) hiển thị số câu đã làm, thời gian còn lại kèm 2 nút hành động: "Tiếp tục làm bài" và "Xem kết quả lần trước".
  - Marquee dải đối tác đại học uy tín (FTU, NEU, RMIT, VNU, UEH, Oxford, Cambridge...).
  - Phân khu hai khối chứng chỉ trọng tâm: Khối Ngoại Ngữ (IELTS, HSK, TOEIC, TOEFL) và Khối Kinh Tế - Tài Chính (CFA, GMAT, ACCA, GRE).
  - Bảng danh mục bài thi thực hành nổi bật (Featured Practice Tests) kèm tab phân loại nhanh.
  - Giới thiệu 3 bước phương pháp khảo thí tiêu chuẩn và phản hồi của học viên thực tế (Testimonials).
  - *Giới hạn phạm vi:* Việc làm bài thi chi tiết được phân định sang `EPIC-03`; việc tra cứu sâu toàn bộ kho đề được phân định sang `EPIC-02`.

## Thành phần giao diện (UI Components & Layout)

Bố cục giao diện trang chủ được thiết kế theo phong cách học thuật doanh nghiệp (Corporate Academic), thanh lịch và tin cậy cao:

1. **Khối Header / Điều hướng toàn cục (`Navbar`):**
   - Dải thông báo đen trên cùng (Top Utility Bar): Tiêu chuẩn khảo thí quốc tế, nút mở Sổ tay lỗi sai, nút mở Drawer từ vựng.
   - Thanh điều hướng chính (Main Navbar): Brand logo CertPrep, Menu dropdown Ngoại ngữ, Menu dropdown Kinh tế, Link Phòng thi, Link Kết quả, Bộ chọn mục tiêu (`activeTarget`), Nút CTA "Vào thi thử", Avatar hồ sơ cá nhân (`USER_PROFILE`).
2. **Khối Hero & Tìm kiếm tức thì (`HeroSection`):**
   - Huy hiệu tiêu chuẩn khảo thí 2024 - 2026.
   - Tiêu đề H1 và đoạn dẫn giải giá trị.
   - Thanh tìm kiếm từ khóa kèm nút Xóa và nút CTA "Xem kho đề thi".
   - Danh sách 5 chip tìm kiếm nhanh.
3. **Khối Tiếp tục bài thi dở dang (`RecentActivityBar`):**
   - Nằm đè nhẹ (-mt-6) lên ranh giới giữa Hero và thân trang.
   - Cột trái: Icon đồng hồ, nhãn "Đang làm dở", tên đề thi đang làm dở, thông số tiến độ số câu và thời gian còn lại.
   - Cột phải: Nút "Tiếp tục làm bài" và nút "Xem kết quả lần trước".
4. **Khối Dải đối tác đại học (`UniversityLogos`):**
   - Dải thẻ logo các trường FTU, NEU, RMIT, VNU, UEH, HUST, Oxford, Cambridge, Harvard... kèm số lượng sinh viên luyện thi.
5. **Khối Phân nhóm chứng chỉ theo lộ trình (`CategoryTracks`):**
   - Nhóm 1: Khối Ngoại ngữ (4 Card: IELTS, HSK, TOEIC, TOEFL).
   - Nhóm 2: Khối Kinh tế & Tài chính (4 Card: CFA, GMAT, ACCA, GRE).
6. **Khối Bảng đề thi luyện tập tiêu chuẩn (`FeaturedTestsCatalog`):**
   - Danh sách tab lọc danh mục: Tất cả, Ngoại ngữ, Kinh tế, IELTS, CFA, HSK, TOEIC.
   - Bảng danh sách đề thi dạng hàng ngang với nhãn Audio, độ khó, số câu, thời lượng, lượt làm, đánh giá sao, nút "Bắt đầu thi tính giờ" và nút "Luyện tập".
   - Nút dẫn tới Thư viện đề thi đầy đủ.
7. **Khối Phương pháp khảo thí & Đánh giá học viên (`Methodology & Testimonials`):**
   - 3 cột quy trình: Áp lực phòng thi thực $\rightarrow$ Chấm điểm tức thì $\rightarrow$ Khắc phục bẫy đề thi.
   - 3 card nhận xét thực tế của sinh viên đạt band cao từ FTU, NEU, VNU.

---

## Danh sách User Stories và Giao diện tương ứng trong Epic

| User Story | Phân loại giao diện | Thành phần giao diện tương ứng | Phạm vi đặc tả UI |
| :--- | :--- | :--- | :--- |
| [EPIC01-US01 — Xem Dashboard Khảo Thí & Tiếp Tục Bài Thi Dở](../../user-stories/hoc-vien/EPIC01-Trang-Chu-Va-Dieu-Huong-Khao-Thi/EPIC01-US01-Xem-Dashboard-Va-Tiep-Tuc-Bai-Thi-Do.md) | Màn hình chính | **Thẻ Bài Thi Đang Làm Dở & Bảng Đề Thi Nổi Bật** | Đặc tả thanh tóm tắt tiến độ, khôi phục thời gian và điều hướng vào phòng thi tính giờ |
| [EPIC01-US02 — Lựa Chọn & Cập Nhật Mục Tiêu Chứng Chỉ](../../user-stories/hoc-vien/EPIC01-Trang-Chu-Va-Dieu-Huong-Khao-Thi/EPIC01-US02-Lua-Chon-Va-Cap-Nhat-Muc-Tieu-Chung-Chi.md) | Header & Dropdown | **Target Selector Dropdown & Hồ Sơ Học Viên** | Đặc tả bộ chọn mục tiêu chứng chỉ (IELTS 7.5+, CFA Level 1...), chuỗi streak học tập và menu hồ sơ |
| [EPIC01-US03 — Tìm Kiếm Nhanh Đề Thi Từ Hero Section](../../user-stories/hoc-vien/EPIC01-Trang-Chu-Va-Dieu-Huong-Khao-Thi/EPIC01-US03-Tim-Kiem-Nhanh-De-Thi-Tu-Hero-Section.md) | Màn hình chính | **Hero Search Bar & Lộ Trình Chứng Chỉ** | Đặc tả ô tìm kiếm từ khóa tức thì, các chip gợi ý nhanh và điều hướng phân loại khối thi sang Thư viện |

---

## Flow specification

Luồng nghiệp vụ của Epic 01 bắt đầu khi học viên truy cập trang chủ:
1. Học viên vào trang chủ $\rightarrow$ Hệ thống kiểm tra bài thi chưa hoàn tất gần nhất của học viên và nạp thông tin mục tiêu học tập.
2. Nếu có bài thi dở, hiển thị thanh "Đang làm dở" với nút bấm tiếp tục làm bài ngay lập tức.
3. Học viên có thể tìm kiếm nhanh đề thi bằng ô tìm kiếm hoặc click chọn khối chứng chỉ để chuyển sang Thư viện khảo thí có kèm bộ lọc tương ứng.

## Traceability

- Yêu cầu sản phẩm liên quan: `PRD-HUB-01: Hệ thống trang chủ và trung tâm khảo thí EduTest Pro`
- Bảng CSDL liên quan: `users`, `user_profiles`, `exam_attempts`, `exams`, `exam_categories`, `partner_universities`, `student_testimonials`
- Kiểm toán giao diện: `src/views/HomePage.tsx`, `src/components/Navbar.tsx`, `src/components/UniversityLogos.tsx`

# EPIC01-US01 - Xem Dashboard Khảo Thí & Tiếp Tục Bài Thi Dở

## Preconditions
- Người dùng đã truy cập nền tảng EduTest Pro với phiên đăng nhập học viên hợp lệ.
- Học viên có ít nhất một bài thi đang làm dở dang trên hệ thống có trạng thái `in_progress` lưu trong cơ sở dữ liệu.

## Trigger
- Học viên truy cập trang chủ hoặc bấm vào Logo CertPrep / Menu "Trang chủ" trên Navbar.
- Màn hình liên quan: Giao diện Trang chủ (`/`), Khối Hoạt động gần đây (`RecentActivityBar`).

## Main Flow

1. Học viên truy cập vào Trang chủ EduTest Pro (`/`).
2. SYS truy vấn cơ sở dữ liệu tìm kiếm bản ghi bài thi chưa hoàn thành gần nhất (`exam_attempts` có `status = 'in_progress'`) của học viên.
3. SYS hiển thị khối tóm tắt bài thi đang làm dở gồm: Tiêu đề đề thi, phần thi đang dừng lại, số câu đã trả lời / tổng số câu, và thời gian làm bài còn lại.
4. Học viên bấm nút [ Tiếp tục làm bài ].
5. SYS lưu mã đề thi vào phiên làm việc (`activeExamId`), khôi phục trạng thái đồng hồ đếm ngược và điều hướng học viên vào phòng thi `/exam/[id]`.

- **Business rules / logic:**
  - Nếu học viên có nhiều bài thi dở, hệ thống ưu tiên hiển thị bài thi có thời điểm cập nhật mới nhất (`started_at` hoặc `updated_at` gần nhất).
  - Thời gian còn lại được tính dựa trên số giây đã lưu `remaining_seconds_saved`; nếu thời gian còn lại $\le 0$, bài thi tự động chuyển trạng thái `completed` và không hiển thị trên thanh làm dở.
  - Số câu đã trả lời được tính bằng số lượng bản ghi `exam_attempt_answers` có `user_answer IS NOT NULL`.

### Field-level specification — Màn hình Khối Hoạt Động Gần Nhất (RecentActivityBar)
| Field / control | Loại UI Control | State | Required | Conditional / dynamic | Source / validation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Nhãn trạng thái** | `Badge Text` | `READONLY` | `optional` | `Không` | Chuỗi cố định `"Đang làm dở"` |
| **Danh mục bài thi** | `Text Label` | `READONLY` | `optional` | `DYNAMIC` | Lấy từ `exams.category_label` (ví dụ: `"IELTS Academic Reading"`) |
| **Tên đề thi dở dang** | `Typography Heading` | `READONLY` | `required` | `DYNAMIC` | Lấy từ `exams.title` của bài thi đang làm |
| **Tiến độ số câu** | `Text Label` | `READONLY` | `required` | `AUTO-FILL` | Hiển thị chuỗi `"Đã trả lời X/Y câu hỏi"` tính từ `exam_attempts` |
| **Thời gian còn lại** | `Text Label` | `READONLY` | `required` | `AUTO-FILL` | Định dạng `"Còn MM phút SS giây"` từ `remaining_seconds_saved` |
| **Nút Tiếp tục làm bài** | `Button Action` | `USER-INPUT` | `required` | `Không` | Điều hướng sang `/exam/[id]` của đề thi dở |
| **Nút Xem kết quả lần trước** | `Button Action` | `USER-INPUT` | `optional` | `CONDITIONAL`<br>• Hiện khi học viên đã có ít nhất 1 bài thi hoàn thành trước đó.<br>• Ẩn khi học viên là người dùng mới chưa từng nộp bài nào. | Điều hướng sang `/result/[id]` của lần thi gần nhất |

## Alternate Flows

### AF-01 — Không có bài thi nào đang làm dở
1. Tại bước 2, SYS kiểm tra không tìm thấy bản ghi `exam_attempts` nào ở trạng thái `in_progress`.
2. SYS ẩn toàn bộ khối `RecentActivityBar` khỏi giao diện Trang chủ và đẩy phần dải đối tác đại học lên sát Hero Section.

### AF-02 — Học viên chọn Xem kết quả lần trước
1. Tại bước 4, thay vì tiếp tục làm bài dở, học viên bấm nút [ Xem kết quả lần trước ].
2. SYS truy vấn bài thi hoàn thành gần nhất (`status = 'completed'`) và điều hướng học viên sang trang `/result/[id]`.

## Exception Flows

- **Đề thi đã bị gỡ bỏ hoặc khóa:** Đề thi dở dang bị quản trị viên gỡ bỏ (`is_published = false`) $\rightarrow$ SYS hiển thị thông báo lỗi "Đề thi này hiện không còn khả dụng", hủy trạng thái dở dang của bài thi và tải lại trang chủ.

## Activity Diagram — Swimlane
**Trigger:** Học viên truy cập trang chủ và thao tác với khối bài thi đang làm dở.

```mermaid
flowchart TB
  subgraph B["Boundary — Trang Chủ EduTest Pro"]
    subgraph L0["Swimlane — Học viên"]
      I01(("Initial"))
      A01["Truy cập Trang chủ EduTest Pro"]
      A02["Quan sát thông tin bài thi đang làm dở"]
      A03["Bấm nút Tiếp tục làm bài"]
      A04["Bấm nút Xem kết quả lần trước"]
    end
    subgraph L1["Swimlane — SYS"]
      S01["Truy vấn bài thi dở dang trong exam_attempts"]
      D01{"Có bài thi dở dang?"}
      S02["Hiển thị thanh RecentActivityBar với số câu và thời gian"]
      S03["Ẩn khối RecentActivityBar và nâng layout dải đại học"]
      D02{"Lựa chọn của học viên?"}
      S04["Khôi phục tiến độ và điều hướng sang /exam/:id"]
      S05["Truy vấn kết quả gần nhất và điều hướng sang /result/:id"]
      M01(("Merge — Điều hướng"))
      F01((("Final — Vào màn hình tương ứng")))
      F02((("Final — Xem trang chủ thông thường")))
    end
  end

  I01 --> A01
  A01 --> S01
  S01 --> D01
  D01 -->|Có bài thi dở| S02
  D01 -->|Không có bài dở| S03
  S03 --> F02
  S02 --> A02
  A02 --> D02
  D02 -->|Chọn Tiếp tục| A03
  D02 -->|Chọn Xem kết quả| A04
  A03 --> S04
  A04 --> S05
  S04 --> M01
  S05 --> M01
  M01 --> F01
```

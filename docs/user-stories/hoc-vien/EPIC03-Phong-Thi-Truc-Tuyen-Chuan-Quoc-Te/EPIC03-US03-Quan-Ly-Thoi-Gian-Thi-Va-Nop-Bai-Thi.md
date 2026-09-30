# EPIC03-US03 - Quản Lý Thời Gian Thi & Nộp Bài Thi

## Preconditions
- Thí sinh đang tham gia phòng thi trực tuyến `/exam/[id]`.
- Đồng hồ đếm ngược đang kích hoạt tính giờ bài thi.

## Trigger
- Thí sinh bấm nút [ Nộp bài thi ] tại Header phòng thi hoặc thời gian làm bài đếm ngược về 00:00.
- Màn hình liên quan: Header phòng thi (`ExamHeaderBar`), Modal xác nhận nộp bài (`SubmitConfirmModal`).

## Main Flow

1. Thí sinh hoàn thành các câu hỏi trong bài và bấm nút [ Nộp bài thi ] tại góc phải thanh Header.
2. SYS hiển thị Modal xác nhận nộp bài (`SubmitConfirmModal`) với các thông số thống kê:
   - Số câu đã trả lời / tổng số câu (ví dụ: `14/17 câu`).
   - Cảnh báo số câu còn bỏ trống nếu có (ví dụ: "Bạn còn 3 câu chưa trả lời").
   - Thời gian làm bài còn lại (ví dụ: "Còn 48 phút 13 giây").
3. Thí sinh bấm nút [ Xác nhận nộp bài ] trong modal.
4. SYS dừng đồng hồ đếm ngược, lưu toàn bộ đáp án vào `exam_attempt_answers`, tính toán điểm số thô, cập nhật trạng thái phiên thi sang `completed` và điều hướng thí sinh sang trang Báo cáo kết quả (`/result/[id]`).

- **Business rules / logic:**
  - Hết giờ tự động nộp: Khi `timeLeftSeconds === 0`, hệ thống tự động khóa tương tác làm bài, hiển thị thông báo "Đã hết thời gian làm bài" và tự động nộp bài mà không cần thí sinh bấm xác nhận.
  - Tính năng ẩn/tạm dừng đồng hồ:
    - Nút Icon Con mắt: Ẩn số phút giây (hiển thị `--:--`) để giảm bớt căng thẳng tâm lý cho thí sinh.
    - Nút Icon Pause/Play: Cho phép tạm dừng đồng hồ trong chế độ luyện tập tự do.
  - Cảnh báo thời gian nguy hiểm: Khi thời gian còn lại $< 5$ phút ($< 300$ giây), khung đồng hồ tự động chuyển sang màu đỏ hồng (`bg-rose-50 text-rose-700 border-rose-300`) để cảnh báo trực quan.

### Field-level specification — Modal Xác Nhận Nộp Bài (SubmitConfirmModal)
| Field / control | Loại UI Control | State | Required | Conditional / dynamic | Source / validation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Tiêu đề cảnh báo modal** | `Heading Text` | `READONLY` | `required` | `Không` | Chuỗi `"Xác nhận nộp bài thi"` |
| **Thông số câu đã làm** | `Text Label` | `READONLY` | `required` | `AUTO-FILL` | Hiển thị chuỗi `"Đã hoàn thành X/Y câu hỏi"` |
| **Cảnh báo câu chưa trả lời**| `Alert Banner` | `READONLY` | `optional` | `CONDITIONAL`<br>• Hiện khi số câu đã làm < tổng số câu (`answeredCount < totalQuestions`).<br>• Ẩn khi đã trả lời 100% các câu hỏi. | Hiển thị hộp cảnh báo màu vàng kèm số câu còn thiếu |
| **Thông số thời gian còn lại** | `Text Label` | `READONLY` | `required` | `AUTO-FILL` | Lấy từ giá trị đếm lùi `timeLeftSeconds` |

## Alternate Flows

### AF-01 — Thí sinh bấm Hủy trong modal nộp bài
1. Tại bước 2, thí sinh nhận thấy còn câu chưa làm và bấm nút [ Tiếp tục làm bài / Hủy ].
2. SYS đóng modal xác nhận và đưa thí sinh trở lại phòng thi để tiếp tục hoàn thiện các câu còn thiếu.

### AF-02 — Tự động nộp bài khi đồng hồ về 00:00
1. Đồng hồ đếm lùi về mốc `00:00`.
2. SYS kích hoạt hàm `handleSubmitExam()`, đóng mọi modal đang mở và tự động chuyển hướng sang trang kết quả.

## Exception Flows

- **Lỗi mạng khi gửi bài thi lên máy chủ:** Kết nối mạng bị mất khi bấm xác nhận nộp $\rightarrow$ SYS lưu bài thi vào bộ nhớ đệm an toàn của trình duyệt (IndexedDB/LocalStorage), giữ nguyên trạng thái modal và hiển thị nút "Thử gửi lại bài thi" để đảm bảo không mất bài của thí sinh.

## Activity Diagram — Swimlane
**Trigger:** Thí sinh bấm nút Nộp bài thi hoặc hệ thống đếm ngược về 00:00.

```mermaid
flowchart TB
  subgraph B["Boundary — Phòng Thi /exam/:id"]
    subgraph L0["Swimlane — Thí sinh"]
      I01(("Initial"))
      A01["Bấm nút Nộp bài thi trên Header"]
      A02["Xem modal thống kê số câu chưa làm"]
      A03["Bấm nút Xác nhận nộp bài"]
      A04["Bấm nút Hủy và quay lại làm tiếp"]
    end
    subgraph L1["Swimlane — SYS"]
      D01{"Sự kiện kích hoạt nộp bài?"}
      S01["Đồng hồ đếm lùi chạm mốc 00:00"]
      S02["Mở SubmitConfirmModal hiển thị số câu đã làm/chưa làm"]
      D02{"Quyết định của thí sinh?"}
      S03["Đóng modal và tiếp tục tính giờ làm bài"]
      S04["Dừng đồng hồ đếm ngược và chốt dữ liệu bài làm"]
      S05["Lưu answers, tính điểm và cập nhật exam_attempts thành completed"]
      S06["Điều hướng thí sinh sang màn hình /result/:id"]
      M01(("Merge — Kích hoạt nộp"))
      F01((("Final — Chuyển sang Trang kết quả")))
      F02((("Final — Tiếp tục làm bài trong phòng thi")))
    end
  end

  I01 --> D01
  D01 -->|Thí sinh bấm nút nộp| A01
  D01 -->|Hết giờ 00:00| S01
  A01 --> S02
  S02 --> A02
  A02 --> D02
  D02 -->|Xác nhận nộp| A03
  D02 -->|Bấm Hủy| A04
  A04 --> S03
  S03 --> F02
  A03 --> M01
  S01 --> M01
  M01 --> S04
  S04 --> S05
  S05 --> S06
  S06 --> F01
```

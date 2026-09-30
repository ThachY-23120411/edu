# EPIC01-US03 - Tìm Kiếm Nhanh Đề Thi Từ Hero Section

## Preconditions
- Người dùng đã truy cập trang chủ nền tảng EduTest Pro.
- Ngân hàng đề thi và các từ khóa chứng chỉ đã được index sẵn trong hệ thống.

## Trigger
- Học viên nhập từ khóa vào ô tìm kiếm tại Hero Section hoặc click vào một trong các chip gợi ý nhanh (Cambridge 18, CFA Level 1, HSK 5...).
- Màn hình liên quan: Khối Hero Section trên Trang chủ (`/`), Kho đề thi (`/library`).

## Main Flow

1. Học viên nhập từ khóa tìm kiếm (ví dụ: `"Cambridge 18"`) vào ô tìm kiếm tại Hero Section.
2. SYS tự động lọc danh sách đề thi hiển thị tức thì tại bảng đề thi thực hành phía dưới trang chủ và hiển thị nút [ Xóa ] trong ô input.
3. Học viên bấm nút [ Xem kho đề thi ] hoặc nhấn phím `Enter`.
4. SYS điều hướng học viên sang trang Kho đề thi (`/library?category=all&q=Cambridge+18`) với từ khóa đã được điền sẵn vào bộ lọc của Thư viện.

- **Business rules / logic:**
  - Nếu học viên click vào một trong các chip tìm nhanh (ví dụ: chip "HSK 5 Chuẩn Hanban"):
    - Ô input tự động điền giá trị chip.
    - SYS lập tức điều hướng sang `/library?category=hsk`.
  - Bộ lọc tức thì tại trang chủ không phân biệt chữ hoa, chữ thường và tìm kiếm theo cả tiêu đề đề thi (`title`), nhãn danh mục (`categoryLabel`) và các thẻ tag (`tags`).

### Field-level specification — Khối Hero Section (HeroSearchBlock)
| Field / control | Loại UI Control | State | Required | Conditional / dynamic | Source / validation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Ô nhập từ khóa tìm kiếm** | `Text Input` | `USER-INPUT` | `optional` | `TRIGGER` | Nhập văn bản tự do, tối đa 100 ký tự |
| **Nút Xóa từ khóa** | `Button Action` | `USER-INPUT` | `optional` | `CONDITIONAL`<br>• Hiện khi ô tìm kiếm có ít nhất 1 ký tự (`searchQuery.length > 0`).<br>• Ẩn khi ô tìm kiếm rỗng. | Xóa toàn bộ văn bản trong ô input và khôi phục danh sách đầy đủ |
| **Nút Xem kho đề thi** | `Button Action` | `USER-INPUT` | `required` | `Không` | Điều hướng sang `/library` kèm tham số lọc |
| **Danh sách chip tìm nhanh** | `Chip Buttons` | `USER-INPUT` | `optional` | `DYNAMIC` | Danh sách 5 chip: Cambridge 18, CFA Level 1, GMAT Focus, HSK 5, TOEIC ETS |

## Alternate Flows

### AF-01 — Học viên xóa từ khóa tìm kiếm
1. Học viên bấm vào nút [ Xóa ] trong ô input.
2. SYS xóa trắng nội dung ô tìm kiếm, ẩn nút Xóa và khôi phục hiển thị toàn bộ đề thi tại bảng phía dưới trang chủ.

### AF-02 — Học viên click trực tiếp vào chip tìm nhanh
1. Tại bước 1, học viên không gõ phím mà click trực tiếp vào chip `"CFA Level 1 Ethics"`.
2. SYS nhận diện mã chứng chỉ tương ứng `cfa` và điều hướng học viên sang `/library?category=cfa`.

## Exception Flows

- **Không tìm thấy đề thi phù hợp trên trang chủ:** Từ khóa nhập vào không khớp với đề thi nào $\rightarrow$ SYS hiển thị thông báo "Không tìm thấy đề thi phù hợp với từ khóa" tại bảng bên dưới cùng nút "Xem toàn bộ trong kho đề".

## Activity Diagram — Swimlane
**Trigger:** Học viên tương tác với ô tìm kiếm hoặc chip từ khóa tại Hero Section.

```mermaid
flowchart TB
  subgraph B["Boundary — Hero Section Trang Chủ"]
    subgraph L0["Swimlane — Học viên"]
      I01(("Initial"))
      A01["Tương tác tại khu vực tìm kiếm Hero"]
      A02["Nhập từ khóa vào ô input"]
      A03["Bấm nút Xem kho đề thi"]
      A04["Click vào chip tìm nhanh"]
      A05["Bấm nút Xóa từ khóa"]
    end
    subgraph L1["Swimlane — SYS"]
      D01{"Thao tác của học viên?"}
      S01["Lọc tức thì bảng đề thi nổi bật trang chủ và hiện nút Xóa"]
      S02["Điều hướng sang /library kèm query param tìm kiếm"]
      S03["Lấy mã chứng chỉ chip và điều hướng sang /library?category=:code"]
      S04["Xóa nội dung input và hoàn nguyên danh sách đề thi"]
      M01(("Merge — Điều hướng"))
      F01((("Final — Chuyển sang Kho đề thi"))
      F02((("Final — Tiếp tục ở lại Trang chủ")))
    end
  end

  I01 --> A01
  A01 --> D01
  D01 -->|Gõ từ khóa| A02
  D01 -->|Bấm chip nhanh| A04
  A02 --> S01
  S01 --> D02{"Học viên thao tác tiếp?"}
  D02 -->|Bấm nút Xem kho đề| A03
  D02 -->|Bấm nút Xóa| A05
  A03 --> S02
  A04 --> S03
  A05 --> S04
  S02 --> M01
  S03 --> M01
  M01 --> F01
  S04 --> F02
```

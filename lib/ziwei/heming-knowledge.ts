/**
 * Tử Vi Đẩu Số hợp bàn Tri thức khố
 * Dựa trên hệ thống 倪海厦《Thiên Kỷ》 + đoạn ngữ cổ điển《Tử Vi Đẩu Số toàn thư》 + tổng hợp tài liệu chuyên nghiệp toàn mạng
 * Cung cấp cho AI phân tích hợp bàn sử dụng
 */

// ─── Đoạn ngữ hoàn chỉnh của Thập Tứ Chính Tinh tại Phu Thê Cung ──────────────────────────

export const STAR_IN_FUQI_GU: Record<string, {
  summary: string;       // hạch tâm Nhất câu
  good: string;          // điều kiện/biểu hiện Cát tượng
  bad: string;           // Hung tượng/lưu ý
  spouse_traits: string; // ngoại hình tính cách phối ngẫu
  timing: string;        // kiến nghị hôn kỳ
  ni_quote?: string;     // nguyên thoại 倪海厦
}> = {
  'Tử Vi': {
    summary: 'Phối ngẫu kiêu ngạo có năng lực，nghi kết hôn muộn，tình cảm lấy tôn trọng làm nền tảng',
    good: 'Tam Phương có Phụ Bật tương giáp，phối ngẫu hiền năng có tài，sau hôn đắc quý trợ；Tam Hợp kiến Lộc chủ tài Lộc song toàn',
    bad: 'Cô quân vô phụ，phối ngẫu mạnh mẽ khó giao tiếp；Thìn Tuất Cung Phu Thê tình phận đạm bạc；hội Phá Quân：trước hôn có nhiều trở ngại',
    spouse_traits: 'Phối ngẫu khí chất kiêu ngạo，có chủ kiến，tự tôn mạnh，năng lực mạnh nhưng bất dễ biểu đạt tình cảm',
    timing: 'Nghi kết hôn muộn（Nam 30 trở lên，Nữ 27 trở lên），kết hôn sớm nhiều trắc trở',
    ni_quote: 'Tử Vi tại Phu Thê Cung，cô khắc，nghi kết hôn muộn，tình cảm tốt nhưng chi phí giao tiếp cao',
  },
  'Thiên Cơ': {
    summary: 'hôn nhân đa biến，nghi phối ngẫu chênh lệch tuổi lớn hơn',
    good: 'kiến Lộc Tồn hoặc hóa Lộc：tình cảm còn có thể duy trì；hội Thái Âm：tăng thêm tinh tế ôn nhu',
    bad: 'hóa Kỵ hoặc hội Sát：tình cảm biến hóa lớn，dễ có ly biệt；Thiên Cơ thiện biến，phối ngẫu đối với tình cảm giơ kỳ bất định',
    spouse_traits: 'Phối ngẫu thông minh đa biến，tâm tư tinh tế，duyên tôn giáo triết học sâu，hơi thần kinh chất',
    timing: 'Nghi chênh lệch tuổi lớn（chênh trên 6 tuổi），có thể giảm xung đột biến hóa của hai bên',
    ni_quote: 'Thiên Cơ thiện biến，bất nghi độc tọa，hôn nhân tràn đầy biến hóa',
  },
  'Thái Dương': {
    summary: 'Nam Mệnh trợ thê，Nữ Mệnh vượng phu；Lạc Hãm hóa Kỵ thì phản chủ hình khắc',
    good: 'Miếu Vượng（Mão chí Thân Cung）：phối ngẫu có năng lực，Nam Mệnh có hiền nội trợ；Nữ Mệnh gả vượng phu，hôn nhân mỹ mãn',
    bad: 'Lạc Hãm（Dậu chí Dần Cung）：Nam Mệnh phối ngẫu bệnh nhược，Nữ Mệnh gả dung phu；hóa Kỵ：Nữ Mệnh "thượng bất kiến phụ，hạ bất kiến tử，trung bất kiến phu"，năm đó trượng phu có đại tai nạn',
    spouse_traits: 'Phối ngẫu khai sáng rộng rãi，có ý thức hình tượng công chúng，khảng khái nhưng có lúc quá mạnh mẽ',
    timing: 'Tình cảm diễn biến khởi nóng cuối lạnh，nghi giữ khoảng cách thích hợp duy trì cảm giác mới mẻ',
    ni_quote: 'Thái Dương hóa Kỵ，thượng bất kiến phụ，hạ bất kiến tử，trung bất kiến phu——Nữ Mệnh năm đó trượng phu tất có đại tai họa',
  },
  'Vũ Khúc': {
    summary: 'Sao Quả Tú，hôn nhân hình khắc，Nhất luật nghi kết hôn muộn',
    good: 'Vũ Khúc hóa Lộc：phối ngẫu có năng lực tài chính，nhưng Nam Mệnh phản hiềm thê quá giỏi；kiến Lộc Tồn giáp phụ：hôn nhân ổn cố có tài',
    bad: 'hóa Kỵ：cô quả，khó hôn，hoặc phối ngẫu Thân có tàn tật；Vũ Khúc Thất Sát（Mão Dậu Cung）：điềm hôn nhân ác liệt；ngộ bất kỳ Tứ Sát nào：chủ ly hôn；Vũ Khúc Phá Quân：kiến Sát Kỵ hình diệu hôn nhân tất bất Lợi',
    spouse_traits: 'Phối ngẫu cương liệt độc lập，nói năng trực tiếp，bất giỏi biểu đạt tình cảm，năng lực kinh tế mạnh nhưng tính cách tương đối cô khắc',
    timing: 'Vũ Khúc hệ Nhất luật kiến nghị kết hôn sau 30 tuổi，kết hôn sớm dễ sớm tan',
    ni_quote: 'Vũ Khúc hóa Kỵ，vi Sao hình tù，hệ Vũ Khúc hôn nhân nghi muộn',
  },
  'Thiên Đồng': {
    summary: 'Phối ngẫu ôn hòa hưởng lạc，nghi chênh lệch tuổi lớn，kết hôn muộn là Cát',
    good: 'kiến Lộc Tồn hoặc hóa Lộc：phối ngẫu ôn hòa đới tài，gia đình an ổn；cùng Thái Âm đồng：tình cảm ôn nhu ngọt ngào',
    bad: 'hóa Kỵ：tình cảm ban đầu còn khá，dần dần chuyển nhạt，do phối hợp bất lương gây oán đỗi；ngộ Sát nhiều：lười biếng thành gánh nặng',
    spouse_traits: 'Phối ngẫu ôn hòa lương thiện，lạc quan tùy hòa，nhưng có thể lười biếng，chủ nghĩa hưởng lạc khá mạnh',
    timing: 'Nam cưới người nhỏ hơn mình，Nữ gả người lớn hơn mình，chênh lệch tuổi trên 8 năm là kết phát tốt nhất',
  },
  'Liêm Trinh': {
    summary: 'Chính Tinh bất ổn định nhất Phu Thê Cung，rủi ro sinh ly tử biệt cao',
    good: 'Liêm Trinh Thiên Phủ（Tý Ngọ）：phối ngẫu ôn hòa thanh tú，tình cảm còn khá，phối ngẫu đa số là tộc lương tháng',
    bad: 'Liêm Trinh Tham Lang：phi sinh ly tức tử biệt；Liêm Trinh Phá Quân：thủy trung tác phần Mộ；Liêm Trinh Thất Sát：bán lộ mai thi thể；hóa Kỵ：tình cảm quấy nhiễu bất đoạn，hòa hảo rạn nứt tuần hoàn；cùng Hỏa Tinh đồng Cung：dẫu có Cát diệu cũng phân cư',
    spouse_traits: 'Phối ngẫu ngoại hình xuất chúng，giỏi giao tế，giá trị cảm xúc cao，nhưng bất ổn định；có thể ly nhiều tụ ít',
    timing: 'Nam Mệnh nghi phối thê ít tuổi（trẻ hơn 6-12 tuổi），Nữ Mệnh nghi phối phu nhiều tuổi',
    ni_quote: 'Liêm Trinh Tham Lang/Liêm Trinh Phá Quân tại Phu Thê Cung，bất quản Nam Mệnh Nữ Mệnh，phi sinh ly tức tử biệt；Liêm Trinh Thất Sát——bán lộ mai thi；Liêm Trinh Phá Quân——thủy trung tác trủng；Liêm Trinh Tham Lang——hoành yêu（yểu chiết）',
  },
  'Thiên Phủ': {
    summary: 'Thiện diệu，chủ sinh ly bất tử biệt，tình cảm bình ổn nhưng bình đạm',
    good: 'kiến Lộc Tồn hoặc hóa Lộc：tài Lộc song toàn，tình cảm ổn định；Tam Phương vô Sát：Phu Thê bình tĩnh hòa hài',
    bad: 'Phụ Bật đơn Sao：dễ có lần hôn nhân thứ Nhị；ngộ Tứ Sát：tình cảm lãnh đạm，xác suất sinh ly tăng thêm',
    spouse_traits: 'Phối ngẫu ôn văn nhĩ nhã，hứng thú rộng rãi，thủ tài có nguyên tắc，năng lực công việc mạnh，nhưng thiên bảo thủ',
    timing: 'Nam Mệnh phối ngẫu nhiều tuổi，Nữ Mệnh phối ngẫu ít tuổi；tình cảm ổn định nhưng cần chủ động vun đắp',
  },
  'Thái Âm': {
    summary: 'Hỷ phối ngẫu thanh tú ôn nhu；Lạc Hãm gia Sát thì tình cảm đa biến',
    good: 'Miếu Vượng（Tý chí Ngọ）kiến Cát：phối ngẫu tú khí có thành tựu，Nam Mệnh thê mỹ；Nữ Mệnh：bản Thân tú mỹ có khí chất',
    bad: 'Lạc Hãm（Mùi chí Hợi）：tình cảm dễ biến，phối ngẫu sức khỏe khiếm giai；hóa Kỵ（Nam Mệnh càng Kỵ）：bà tức bất hòa，thê tử cùng mẫu thân tất khởi xung đột；ngộ Hỏa Linh：tình cảm đại biến cố',
    spouse_traits: 'Phối ngẫu ôn nhu tú khí，tinh tế mẫn cảm，trọng tình cảm，nhưng có lúc cảm xúc hóa',
    timing: 'Không ràng buộc đặc định，nhưng Lạc Hãm thì nghi kết hôn muộn',
    ni_quote: 'Mệnh của người Nam，tối sợ Thái Âm hóa Kỵ，bà tức bất hòa，thái thái cùng mẹ Nhất định bất hòa',
  },
  'Tham Lang': {
    summary: 'đào hoa tối vượng，hôn nhân bất ổn，rủi ro ngoại tình cao',
    good: 'hóa Lộc：phối ngẫu tài nghệ giai，phong tình vạn chủng，tình cảm ngọt ngào（nhưng rủi ro ngoại tình bất giảm）；ngộ hóa Khoa：giảm bớt ngoại tình',
    bad: 'hóa Kỵ：nhiều lần hôn nhân thứ Nhị；Tử Vi Tham Lang（Mão Dậu）：phối ngẫu nhiều xuất ngoại，có điềm ngoại tình；ngộ Tứ Sát：tất sinh ly；Ngọ Cung Tham Lang（Sao võ quan）：phản chủ phối ngẫu võ chức，tương đối ổn định',
    spouse_traits: 'Phối ngẫu tài nghệ siêu quần，năng lực xã giao mạnh，duyên khác phái cực tốt，nhưng dục vọng vượng thịnh，khó ràng buộc',
    timing: 'Kết hôn sớm tình cảm đa biến，nghi kết hôn muộn；trước hôn cần tìm hiểu quan hệ khác phái của đối phương',
    ni_quote: 'Tham Lang ngoài chỉ Sao đào hoa，cũng chỉ tửu sắc tài khí đổ，thống thống tại trong Tham Lang；Tham Lang tại Ngọ Cung là Sao võ quan，bất nên tùy tiện phê đào hoa',
  },
  'Cự Môn': {
    summary: 'khẩu thiệt thị phi nhiều，Phu Thê dễ cãi vã，cần Thái Dương hóa giải',
    good: 'Thái Dương Miếu Vượng tương hội：phản chủ hôn nhân hòa mỹ，khẩu tài hóa thành Lợi khí giao tiếp；hóa Lộc：thê tử hiền năng，tài lộ do thê mà mở',
    bad: 'hóa Kỵ：phối ngẫu thích cằn nhằn，thị phi bất đoạn；Đà La đồng độ：Phu Thê tự tìm phiền não；độc thủ vô Cát：tình cảm áp ức，mâu thuẫn sâu xa nhiều',
    spouse_traits: 'Phối ngẫu khẩu tài tốt，tâm đố kỵ mạnh，để ý thể diện，có lúc quá kén chọn，nhưng nội tâm thâm tình',
    timing: 'Không ràng buộc đặc định，nhưng cần chuẩn bị tâm lý giao tiếp mài hợp lâu dài',
  },
  'Thiên Tướng': {
    summary: 'Lương duyên "thân thượng gia thân"，phu xướng phụ tùy，hôn nhân kiểu hợp tác',
    good: 'kiến Phụ Bật song toàn：tình cảm trung thành，hôn nhân ổn cố；phối ngẫu chính trực thực thà；Thiên Tướng Tam Hợp kiến Lộc：tài Lộc khả kỳ',
    bad: 'Phụ Bật đơn Sao：có thể dự báo tái hôn；ngộ Sát nhiều：tình cảm trung áp ức ủy khuất，bất giỏi biểu đạt',
    spouse_traits: 'Phối ngẫu chính trực thực thà，giữ chữ tín，bất thích xung đột，giỏi phối hợp，là bạn đời Tuyệt giai',
    timing: 'Phần nhiều do quan hệ quen biết như bạn học、đồng nghiệp、hàng xóm phát triển，nghi Phu Thê hợp tác cộng sự',
  },
  'Thiên Lương': {
    summary: 'Hỷ phối ngẫu trách nhiệm mạnh hoặc niên kỷ lớn hơn，trước hôn nhiều trắc trở',
    good: 'kiến Lộc：phối ngẫu có Phúc Đức，tình cảm thực thà；Tam Hợp phương có Cát：tình cảm vun đắp ổn trọng lý trí',
    bad: 'hóa Kỵ hoặc kiến Sát：thích cằn nhằn，mạnh mẽ thuyết phục，tình cảm sơ ly；Thiên Lương phối Thiên Mã：Phu Thê vì hoàn cảnh phân tán；trước hôn dễ thất bại mối tình đầu',
    spouse_traits: 'Phối ngẫu trách nhiệm mạnh，ổn trọng lão thành，giỏi giảng đạo lý，nhưng thỉnh thoảng có khuynh hướng thuyết giáo',
    timing: 'Trước hôn nhiều trắc trở là thường thái，Nhất đán kết hôn phản nhiên ổn cố；vô Sát sau hôn tình duyên càng sâu',
  },
  'Thất Sát': {
    summary: '"uyên khâm bán lãnh"——tụ ít ly nhiều，nghi kết hôn muộn sau 30 tuổi',
    good: 'Miếu Vượng（Dần Thân Cung）：phối ngẫu tuy cương cường nhưng trung thành，Nhất đán dấn thân thì toàn lực dốc sức；hóa Lộc tương trợ：giảm nhẹ cô khắc',
    bad: 'ngộ Sát：tình cảm bề mặt hòa hài nội tâm bất mãn，Nam Mệnh chủ Nhị thú；Nữ Mệnh nghi thiên phòng kế thất；Mão Dậu Cung（Vũ Khúc Thất Sát）：vận hôn nhân tối kém',
    spouse_traits: 'Phối ngẫu cương cường cô tích，Nhất kiến chung tình nhanh，rời đi cũng nhanh，yêu đương lạnh nóng đều nhanh',
    timing: 'Nhất luật nghi kết hôn muộn，sau 30 tuổi hôn nhân tương đối ổn cố；kết hôn sớm nhiều hình khắc',
    ni_quote: 'Thất Sát cư phu phụ nhi uyên khâm bán lãnh（cổ phú）；nếu bạn cưới thái thái là Thất Sát nhập Mệnh，thì bạn xem như hủy gần Nhất nửa rồi，rất mệt a，thảo mộc giai binh',
  },
  'Phá Quân': {
    summary: 'Sao phá hao hôn nhân，vô nhân xuất kỳ hữu，theo đuổi tình cảm vô ràng buộc',
    good: 'hóa Lộc：phá nhi hậu lập，tình cảm trải qua trắc trở phản nhiên có thể đi đến cuối；anh Sao Nhập Miếu：phối ngẫu anh đĩnh có cá tính',
    bad: 'hóa Kỵ：phá hoại đãi tận，nhiều Nhất hôn hoặc bất hôn；Tử Vi Phá Quân（Sửu Mùi）：bất gia Sát cũng khắc，gia Sát tất ly；cùng Liêm Trinh：thủy trung tác phần Mộ；trung niên về sau có tượng phân giường phân cư',
    spouse_traits: 'Phối ngẫu theo đuổi tự do，bất hỷ ràng buộc，dũng cảm đột phá，nhưng quan niệm hôn nhân bạc nhược，Nhất sinh biến động lớn',
    timing: 'Trước hôn dễ Nhất kiến chung tình hoặc kết hôn thảo suất，nghi kéo dài thời gian chung sống rồi mới quyết định',
    ni_quote: 'Liêm Trinh Phá Quân tại Phu Thê Cung，thủy trung tác phần Mộ；Phá Quân là Sao lực phá hoại hôn nhân mạnh nhất',
  },
};

// ─── Đoạn ngữ hoàn chỉnh của Tứ Hóa tại Phu Thê Cung ──────────────────────────────────────

export const SIHUA_IN_FUQI_GU = {
  'Hóa Lộc': 'Cùng phối ngẫu có tiền Thiên duyên phận，phối ngẫu cá tính lạc quan，sau hôn tình cảm càng tốt，phối ngẫu càng ngày càng biết kiếm tiền，duyên phận thâm hậu；tự hóa Lộc thì tài lai tài khứ，tình cảm có nhưng khó giữ',
  'Hóa Quyền': 'hôn nhân phần nhiều do chủ động tranh thủ mà đến，phối ngẫu nắm Quyền quyết sách，phần lớn sự việc phối ngẫu tự hành phán quyết，cần học cách buông tay；hôn nhân kiểu tranh thủ，càng cưỡng cầu càng khó đắc',
  'Hóa Khoa': 'Xem là tiểu Lộc，có thể hòa hài chung sống cùng phối ngẫu，có duyên quý nhân，Lợi cho yêu đương kết hôn；Khoa tại Phu Thê chủ phối ngẫu có danh tiếng hoặc kỹ năng chuyên nghiệp',
  'Hóa Kỵ': 'Khiếm hạ món nợ hôn nhân，kết hôn sớm dễ sớm ly，kiến nghị kết hôn muộn hoặc bất hôn；phối ngẫu đối với bản nhân có oán ngôn；hóa Kỵ xung Phu Thê Cung càng Hung——điềm sinh ly tử biệt',
};

// ─── Phương pháp luận cốt lõi hợp bàn ─────────────────────────────────────────

export const HEMING_METHODOLOGY = `
## Khung cốt lõi phân tích hợp bàn（hệ thống 倪海厦 +《Tử Vi Đẩu Số toàn thư》tổng hợp）

### Nhất、Nguyên tắc liên tham song Cung（đoạn pháp hôn nhân quan trọng nhất của 倪海厦）

**Khẩu quyết cốt lõi：「Xem hôn nhân，chỉ xem Phu Thê Cung，đại thác đặc thác，Nhất định phải đồng thời xem Phúc Đức Cung。」**

- **Phu Thê Cung**：xem tính Sao、ngoại hình、tính cách、mô thức tương tác của phối ngẫu
- **Phúc Đức Cung**：đại biểu tình cảm sâu xa của Phu Thê、hôn nhân có thể lâu dài hay không
- **Ví dụ của 倪师**：“Có người Phu Thê Cung rất tốt，Phúc Đức Cung rất tệ，tan！Phu Thê phải tan。”

**Vì vậy lúc hợp bàn phải đồng thời phân tích của song phương：Mệnh + Phu Thê Cung + Phúc Đức Cung**

---

### Nhị、Tiêu chuẩn phán đoán Thiên tác chi hợp

**Cấp độ khớp cao nhất（Thiên tác chi hợp）**：
- Phu Thê Cung Chính Tinh bên Giáp = Mệnh Chính Tinh bên Ất
- Phu Thê Cung Chính Tinh bên Ất = Mệnh Chính Tinh bên Giáp
- Hai bên hỗ tương đối ứng，tức là Nhất đôi mệnh trung chú định

**Lương phối cấp hai**：
- Phu Thê Cung Chính Tinh của Nhất phương = Mệnh Chính Tinh của đối phương（đối ứng đơn hướng）
- Tính Sao Mệnh song phương Ngũ Hành tương sinh（như Mộc Mệnh phối Thổ Mệnh、Thổ Mệnh phối Thủy Mệnh）
- Đại Hạn song phương đồng hành vận Vượng

**Tổ hợp Hung triệu**：
- Song phương hỗ tương hóa Kỵ xung Mệnh đối phương（hỗ vi oan gia）
- Hóa Kỵ của Nhất phương phi nhập Phu Thê Cung của Nhất phương khác（mang tổn thương hôn nhân cho đối phương）
- Phu Thê Cung song phương đều có trọng Sát vô Cát Tinh

---

### Tam、Ngũ bộ pháp hợp bàn hoàn chỉnh

**Bước thứ Nhất：đánh giá cơ sở mệnh cách song phương**
- Cách Cục Mệnh song phương có xứng đôi hay không（cùng loại hoặc loại hỗ bổ）
- Trọng điểm xem：phối hợp tính Sao của Mệnh + Thân + Phúc Đức Cung
- Cảnh giới：song phương đều là cách Sát Phá Lang（lưỡng hổ tương tranh）；hoặc Nhất mạnh Nhất yếu quá chênh lệch

**Bước thứ Nhị：Phu Thê Cung hỗ tham**
- Phu Thê Cung Chính Tinh bên Giáp → có đối ứng Sao Mệnh/Tam Hợp phương bên Ất hay không？
- Phu Thê Cung Chính Tinh bên Ất → có đối ứng Sao Mệnh/Tam Hợp phương bên Giáp hay không？
- Trạng thái Tứ Hóa riêng của Phu Thê Cung song phương（hóa Lộc/hóa Kỵ ảnh hưởng lớn nhất）

**Bước thứ Tam：phân tích sao tượng Thái Dương Thái Âm**
- Nữ Mệnh：Thái Dương đại biểu trượng phu；Thái Dương Miếu Vượng=vượng phu，Lạc Hãm hóa Kỵ=khắc phu
- Nam Mệnh：Thái Âm đại biểu thê tử；Thái Âm Miếu Vượng=thê mỹ hiền，hóa Kỵ=bà tức bất hòa
- Trạng thái của hai Sao này trong Lá số song phương，ảnh hưởng trực tiếp chất lượng hôn nhân

**Bước thứ Tứ：Tứ Hóa phi hóa hỗ tham（kỹ pháp cao cấp）**
- Sinh niên can bên Giáp → tìm Sao Tứ Hóa → những Sao này lạc tại Cung Vị nào của Lá số bên Ất
  - hóa Lộc phi nhập Mệnh/Tài Bạch Cung bên Ất：có trợ giúp chính hướng cho bên Ất
  - hóa Kỵ phi nhập Phu Thê Cung bên Ất：mang tổn thương hôn nhân cho bên Ất
  - hóa Kỵ phi nhập Mệnh bên Ất：bản Thân mang áp lực cho đối phương
- Sinh niên can bên Ất → phi hóa phản hướng phân tích bên Giáp
- Hình thành "phi hóa hỗ tham"，phán đoán "loại duyên phận" song hướng

**Bước thứ Ngũ：phân tích đồng bộ Đại Hạn**
- Đại Hạn hiện tại của song phương có đồng hành vận Vượng hay không：câu Vượng=thời cơ tốt nhất，câu Suy=thử thách chung
- Nhất phương Vượng Nhất phương Suy：cần có ý thức cân bằng trạng thái song phương
- Lưu Niên Tam Hợp phương Sao đào hoa tụ tập：năm đó thời cơ tốt kết hôn

---

### Tứ、Phán đoán loại duyên phận

| Loại hóa duyên | Đặc trưng |
|---------|------|
| hóa Lộc dẫn động | Chính duyên、chân ái，tình cảm ngọt ngào thuận lợi |
| hóa Quyền dẫn động | Tình cảm chủ động tranh thủ，có trương lực，có bên chủ đạo |
| hóa Khoa dẫn động | Duyên phận hòa hài chung sống，tôn trọng lẫn nhau，kiểu bạch đầu giai lão |
| hóa Kỵ dẫn động | Nghịch duyên/oan gia，hành hạ lẫn nhau nhưng khó chia lìa，cần tu hành mới có thể hóa giải |
| Song phương hỗ hóa Kỵ | Kiểu "oan gia lộ hiệp"，tình cảm mãnh liệt nhưng thống khổ tịnh tồn，kiểu khiếm trái tiền thế |

---

### Ngũ、Tam tằng pháp phán đoán hôn kỳ

**Tầng thứ Nhất：Cách Cục bản Lá số**
- Phu Thê Cung vô Sát：nghi kết hôn sớm
- Phu Thê Cung hữu Sát vô Cát：nghi kết hôn muộn（Nam 30 trở lên，Nữ 27 trở lên）
- Vũ Khúc、Liêm Trinh、Thất Sát、Phá Quân tại Phu Thê Cung：Nhất luật kiến nghị kết hôn muộn

**Tầng thứ Nhị：Đại Hạn**
- Đại Hạn Phu Thê Cung nhiều Cát Tinh：năm đó có cơ hội kết hôn
- Đại Hạn Phu Thê Cung hóa Kỵ：năm đó tình cảm bị ngăn trở

**Tầng thứ Tam：Lưu Niên**
- Hồng Loan、Thiên Hỷ nhập Mệnh hoặc Phu Thê Cung：năm đó hôn luyến có động
- Lưu Niên Cung Vị lạc đến Phu Thê Cung：năm đó hôn nhân là trọng điểm
- Lưu Niên Tam Hợp phương Sao đào hoa hội tụ：năm đó cơ hội tình cảm nhiều

---

### Lục、Tình hình kết hôn các Cung Vị

| Lưu Niên Cung Vị | Tình hình kết hôn |
|---------|---------|
| Phu Thê Cung | Tình cảm phát triển bình thường mà kết hôn |
| Mệnh | Tự mình chủ động xuất kích mà kết hôn |
| Tử Nữ Cung | Phụng tử thành hôn（lên xe trước bù vé sau） |
| Điền Trạch Cung | Vì duyên cớ gia đình、bất động sản mà kết hôn |
| Phụ Mẫu Cung | Phụng mệnh Phụ Mẫu，do trưởng bối giới thiệu |

---

### Thất、Dấu hiệu cụ thể của khắc phu/khắc thê

**Khắc phu Mệnh（hàm nghĩa phi truyền thống）định nghĩa của 倪师**：
> “Cô gái khắc phu，chính là thái thái đi phía trước，tiên sinh phía sau mồ hôi đầm đìa xách túi lớn túi nhỏ trả tiền，mãi mới đợi được xe，tiên sinh còn phải giúp thái thái mở cửa。Cái này gọi là khắc phu。”
> “Vượng phu，là thái thái hoàn toàn khiến tiên sinh không có nỗi lo phía sau。”

**Dấu hiệu cụ thể**：
- Phu Thê Cung Liêm Trinh+Tham Lang/Phá Quân/Thất Sát（tổ hợp Tam Hung）
- Thái Dương Lạc Hãm hóa Kỵ（Nữ Mệnh）
- Thái Âm hóa Kỵ（Nam Mệnh）
- Phu Thê Cung Tứ Sát tề tụ vô Cát Tinh
- Quả Tú Cô Thần nhập Mệnh hoặc Phu Thê Cung
- Phúc Đức Cung Phá Quân Hãm lạc + Liêm Trinh Bình（thủy trung tác trủng cách）

---

### Bát、Phán đoán hợp bàn hợp tác sự nghiệp

**Cung Vị tham chiếu chính**：
- Quan Lộc Cung：tính Sao Cung sự nghiệp song phương có tương dung hay không
- Huynh Đệ Cung（Nô Bộc Cung）：đại biểu quan hệ hợp tác
- Phúc Đức Cung：có thể đồng cam cộng khổ hay không

**Cát tượng hợp tác sự nghiệp**：
- Mệnh song phương hỗ bổ（Nhất mưu Nhất hành）
- Quan Lộc Cung của Nhất phương hóa Lộc phi nhập Quan Lộc Cung của Nhất phương khác
- Huynh Đệ Cung có Lộc Tồn vô hóa Kỵ xung

**Hung tượng hợp tác sự nghiệp**：
- Song phương hóa Kỵ hỗ xung Quan Lộc Cung
- Mệnh đối phương hóa Kỵ phi nhập Tài Bạch Cung của bên mình（đối phương tiêu hao tiền tài của mình）
- Cự Môn tại Huynh Đệ/Nô Bộc Cung：倪师："Cự Môn tại Cung bằng hữu，đại biểu cùng bằng hữu hợp tác sẽ bằng hữu biến cừu nhân"

---

### Cửu、Loại tương vị tình cảm（phán nhanh tính tương dung mệnh cách）

| Tổ hợp song phương | Tính tương dung | Thuyết minh |
|---------|-------|------|
| Tử Vi + Thiên Phủ | ★★★★★ | Đế Sao ngộ tài khố，thành tựu lẫn nhau，ổn định nhất |
| Thiên Tướng + Sao bất kỳ | ★★★★ | Ấn Sao tá tài，Thiên Tướng thích ứng mạnh |
| Thiên Lương + Thiên Đồng | ★★★★ | Lão thành và ôn hòa hỗ bổ，kiểu bạch đầu giai lão |
| Thái Dương + Thái Âm | ★★★★ | Nhật Nguyệt tịnh minh，hỗ bổ kinh điển，Âm Dương điều hòa |
| Thất Sát + Thất Sát | ★★ | Lưỡng hổ tương tranh，hỏa hoa lớn，mâu thuẫn nhiều |
| Phá Quân + Phá Quân | ★★ | Song phá，phá hoại lẫn nhau，hôn nhân bất ổn |
| Liêm Trinh + Thất Sát/Phá Quân | ★ | Nhị trong tổ hợp Tam Hung，rủi ro sinh ly tử biệt cao nhất |
| Sát Phá Lang + Cơ Nguyệt Đồng Lương | ★★★ | Động tĩnh hỗ bổ，nhưng cần mài hợp，Nhất phương khai thác Nhất phương thủ thành |
| Tử Phá + Liêm Phủ | ★★★★ | Cách Cục tương đương，hấp dẫn lẫn nhau |
| Vũ Khúc + Thiên Đồng | ★★★ | Cương nhu hỗ tế，Vũ Khúc thu liễm ngộ Thiên Đồng ôn hòa，có thể hỗ bổ |

---

### Thập、Tổng hợp danh ngôn cốt lõi hợp bàn của 倪海厦

1. **"Xem hôn nhân，chỉ xem Phu Thê Cung，đại thác đặc thác，Nhất định phải đồng thời xem Phúc Đức Cung。"**
2. **"Liêm Trinh Tham Lang/Liêm Trinh Phá Quân tại Phu Thê Cung，bất quản Nam Mệnh Nữ Mệnh，phi sinh ly tức tử biệt。"**
3. **"Liêm Trinh Thất Sát——bán lộ mai thi；Liêm Trinh Phá Quân——thủy trung tác trủng；Liêm Trinh Tham Lang——hoành yêu yểu chiết。"**
4. **"Thái Dương hóa Kỵ，thượng bất kiến phụ，hạ bất kiến tử，trung bất kiến phu。"（Nữ Mệnh năm đó phối ngẫu có đại tai nạn）**
5. **"Mệnh của người Nam，tối sợ Thái Âm hóa Kỵ，bà tức bất hòa，thái thái cùng mẹ Nhất định bất hòa。"**
6. **"Vượng phu，là thái thái hoàn toàn khiến tiên sinh không có nỗi lo phía sau；khắc phu là tình cảm quá tốt，hoàn toàn lấy đối phương làm chủ。"**
7. **"Cự Môn tại Cung bằng hữu，cùng bằng hữu hợp tác sẽ bằng hữu biến cừu nhân。"**
8. **"Nếu bạn cưới thái thái là Thất Sát nhập Mệnh，thì bạn xem như hủy gần Nhất nửa rồi，rất mệt a，thảo mộc giai binh。"**
`;

// ─── Bảng hỗ trợ phán đoán hôn nhân ──────────────────────────────────────────────

export const MARRIAGE_STARS_BRIEF: Record<string, string> = {
  'Hồng Loan': 'Chính duyên hôn luyến，nhập Mệnh Thân chủ thúc thành hôn；Lưu Niên phùng Hồng Loan năm đó hôn luyến có động',
  'Thiên Hỷ': 'Hỷ sự hôn nhân，cùng Hồng Loan dẫn động lẫn nhau，chủ hỷ sự đến',
  'Thiên Diêu': 'tài nghệ đào hoa，cơ hội tình cảm；hôn luyến trung ngộ Thiên Diêu dễ có lãng mạn tao ngộ',
  'Hàm Trì': 'đào hoa cường lực，lưu ý tình cảm phiền nhiễu；ngộ Tham Lang thì đào hoa tối vượng',
  'Cô Thần': 'Sao cô khắc，Nam Mệnh nhập Mệnh chủ độc lập tốt，nhưng nhập Phu Thê Cung chủ duyên thiển',
  'Quả Tú': 'Sao cô khắc，Nữ Mệnh nhập Mệnh hoặc Phu Thê Cung，chủ hôn nhân bất thuận tụ thiểu ly đa',
  'Thiên Khốc': 'cô khắc hình thương，nhập Phu Thê Cung chủ phối ngẫu có đại tai họa',
  'Thiên Hư': 'Sao không hao，nhập Phu Thê Cung chủ tình cảm hư hao',
  'Thiên Vu': 'vãn hôn di sản tôn giáo；nhập Phu Thê Cung chủ kết hôn muộn là Cát，kết hôn sớm nhiều trắc trở',
};

export const HEMING_SCORE_CRITERIA = {
  'NgũSao': 'Phu Thê Cung song phương hỗ ánh Thiên tác chi hợp，Tứ Hóa hỗ tương bổ ích，Đại Hạn đồng hành vận Vượng，Phúc Đức Cung song Cát',
  'TứSao': 'Phu Thê Cung Nhất phương đối ứng Mệnh đối phương，Tứ Hóa lấy Lộc Khoa làm chủ，nền tảng tình cảm vững chắc',
  'TamSao': 'Mệnh cách tương phối nhưng đều có lăng giác，cần mài hợp，về lâu dài ổn định',
  'NhịSao': 'Phu Thê Cung đều có Sát Tinh，hóa Kỵ hữu xung，tình cảm thăng trầm lớn，cần song phương chủ động vun đắp',
  'NhấtSao': 'Hung Sao hội tụ Phu Thê Cung，hoặc tổ hợp Tam Hung Liêm Trinh，rủi ro sinh ly tử biệt cao',
};

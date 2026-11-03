'use client';
import { motion, AnimatePresence } from 'framer-motion';
import type { Star } from '@/lib/ziwei/types';
import { STAR_DESCRIPTIONS } from '@/lib/ziwei/constants';

interface StarDetailPanelProps {
  star: Star | null;
  palaceName?: string;
  onClose: () => void;
}

// Nghê Hải Hạ thể hệ các Sao chi tiết luận giải（tham khảo Cố Tường Hoằng《Phi Tinh Tử Vi Đẩu Số toàn thư》và Nam Bắc Sơn Nhân《Tử Vi Đẩu Số toàn thư》）
const STAR_DETAIL: Record<string, {
  niHaixia: string;
  classical: string;
  bestPalace: string;
  worstPalace: string;
  career: string;
  relationship: string;
  wealth: string;
  health: string;
}> = {
  'Tử Vi': {
    niHaixia: 'Nghê sư cho rằng Tử Vi là sao hoàng đế，tọa Mệnh có khí cô ngạo，thích ở một mình，không thích bị người quản thúc。Tử Vi cần Tả Phù Hữu Bật tương giáp mới phát huy được khí chất đế vương，bằng không chỉ là cô quân，giàu mà không quý。Tử Vi ở cung Thìn Tuất là tốt nhất，cùng Thiên Phủ tạo thành song sao Cách Cục，tài quan song mỹ，có thể xuất tướng nhập tướng。Tử Vi sợ nhất Hỏa Tinh、Linh Tinh、Kình Dương、Đà La đồng Cung，gia sát thì cô quý，có Quyền mà không có tài。',
    classical: 'Cổ quyết：「Tử Vi đế tọa lâm Mệnh Chủ tôn quý，thống lĩnh chúng Sao，tọa Mệnh giả chủ Quyền uy hiển đạt。」Nam Bắc Sơn Nhân chú：「Tử Vi thủ Mệnh vu Thìn vị，tài quan song mỹ，xuất tướng nhập tướng，vị chí Tam công；Tý Cung an Mệnh giả，phú quý bất nại cửu，ngày sau bất mỹ。」',
    bestPalace: 'Mệnh（ThìnTuất）、Quan LộcCung',
    worstPalace: 'Tật ÁchCung、Phu ThêCung',
    career: 'chính giới、tầng quản lý、độc lập khởi nghiệp，Thiên sinh khí chất đế vương，thích hợp độc đương Nhất diện lãnh đạo cương vị',
    relationship: 'Tình cảm bị động，lòng tự tôn mạnh，cần đối phương chủ động，có khuynh hướng cô độc，vãn hôn thì Cát',
    wealth: 'tài vận ổn định，thủ thành mạnh hơn tiến thủ，vị Thìn Tuất tài quan song mỹ，thích hợp nhất đầu tư tích lũy',
    health: 'thuộc tính thổ，Lưu ý tỳ vị、hệ tiêu hóa。Kỵ quá lao，nên giữ nếp sinh hoạt quy luật',
  },
  'Thiên Cơ': {
    niHaixia: 'Nghê sư nói Thiên Cơ là sao tham mưu，sao thông minh nhất，nhưng thông minh lộ ra ngoài thì hại Thân。Thiên Cơ hóa Kỵ phiền phức nhất，đại biểu thông minh quá hóa bị thông minh hại。Thiên Cơ thuộc mộc，thiện biến linh động，ở Mệnh thì tư duy mẫn tiệp，nhưng thường đa mưu thiểu quyết，cần rời xa cố hương đi xa mới phát triển được，ứng sự cơ biến、tùy cơ ứng biến là Đặc điểm lớn nhất của nó。',
    classical: 'Cổ quyết：「vi nhân sinh tinh hoạt，tự hảo tác kinh doanh，Thiên Cơ Sao thuộc mộc，thương mãi giai đa cơ kiến，ly tông tất viễn thân，cơ mưu tất viễn ly thân。」Nam Bắc Sơn Nhân chú：「Thiên Cơ cư Miếu Vượng Địa，chủ nhân sinh tinh minh，thiện sách hoạch；cư Hạn Địa thì ảm đạm，nhân nhân giai tòng thương vi nghiệp。」',
    bestPalace: 'Mệnh（Mão vị）、Quan LộcCung',
    worstPalace: 'Phu ThêCung',
    career: 'chuyên gia kỹ thuật、mưu sĩ、nghiên cứu viên、IT、sách hoạch，dùng não hơn dùng tay，thích hợp phát triển xa quê',
    relationship: 'Tình cảm đa biến，ý nghĩ quá nhiều，khó chuyên Nhất，nên vãn hôn，sau hôn nhân cần học cách buông bỏ lo lắng',
    wealth: 'dựa vào trí tuệ cùng kỹ năng kiếm tiền，Bất thiện giữ tiền，lấy kỹ thuật chuyên nghiệp làm nghề thì tài vận ổn định',
    health: 'thuộc tính mộc，Lưu ý can đảm、hệ thần kinh。tâm tư quá nặng dễ mất ngủ，nên luyện tập tĩnh tâm minh tưởng',
  },
  'Thái Dương': {
    niHaixia: 'Nghê sư cho rằng Thái Dương là sao đại Nam nhân chủ nghĩa，ở vị Mão đến Ngọ Nhập Miếu，quang minh chính đại；sau Ngọ dần Lạc Hãm。Thái Dương tọa Mệnh thì người khảng khái hảo diện Tý，Nam Mệnh hợp，Nữ Mệnh quá cường thế。Thái Dương đại biểu phụ thân cùng trưởng bối，ở Mệnh chủ tính cách ngoại hướng cởi mở，thích được mọi người nhìn thấy，hợp nhất công chức hoặc sự nghiệp công chúng。Lạc Hãm thì trước cần sau lười，cô quả lao lục。',
    classical: 'Cổ quyết：「Thái Dương cư Ngọ vi Nhập Miếu，quang huy đại phóng，chủ quý hiển，Nam Mệnh tốt nhất；Lạc Hãm thì cô quả lao lục，tiên cần hậu lãn。」Nam Bắc Sơn Nhân chú：「Thái Dương ở Ngọ Cung thủ Mệnh，tài quan song mỹ，xuất tướng nhập tướng；Thìn vị an Mệnh，trung năm tài quan biến mỹ，Ất năm sinh nhân ngộ Hung diệc đại Lợi。」',
    bestPalace: 'Mệnh（Mão chí Ngọ）、Quan LộcCung',
    worstPalace: 'Phu ThêCung（NữMệnh）、Tật ÁchCung',
    career: 'công chức、chính giới、quản lý、công quan、giáo dục、truyền thông，thích đứng trước mọi người，hợp sự nghiệp công chúng',
    relationship: 'Nam Mệnh duyên tốt nhưng lăng nhăng，Nữ Mệnh độc lập cường thế，hôn nhân cần dĩ hòa，nên tìm bạn đời dịu dàng ân cần',
    wealth: 'tài vận dựa vào nỗ lực，khảng khái hảo thi，Bất thiện tích lũy；Nhập Miếu tài vận Vượng，Lạc Hãm tài vận thăng trầm',
    health: 'thuộc tính hỏa，Lưu ý tim、mắt。vị Lạc Hãm giờ dễ quá lao，cần Lưu ý nghỉ ngơi đầy đủ',
  },
  'Vũ Khúc': {
    niHaixia: 'Nghê sư thị Vũ Khúc vi Tài Bạch Chính Tinh，cương ngạnh Bất khuất，sợ nhất cô khắc。Vũ Khúc tọa Mệnh thì người ý chí kiên định，thích hợp kim dung、lý tài，nhưng Tình cảm quá thẳng，dễ làm tổn thương người khác。Vũ Khúc hóa Kỵ phải cẩn thận tai nạn huyết quang。Vũ Khúc ở Thìn Tuất Sửu Mùi Đắc Vượng Địa，cùng Thất Sát đồng Cung có thể thành tướng tài cách，là Cách Cục tài phú cực tốt。',
    classical: 'Cổ quyết：「Vũ Khúc thuộc kim，tính cương cường，Nhất sinh đa hình khắc；thủ Mệnh vu Vượng Địa，xuất tướng nhập tướng。」Nam Bắc Sơn Nhân chú：「Vũ Khúc thủ Mệnh，Tam Phương Tứ Chính câu Cát，tài quan song mỹ，vũ chức gia phụ bật xương khúc，diệc chủ đại quý；cùng Thất Sát đồng Cung，vi tướng tài cách，chủ đại phú。」',
    bestPalace: 'Mệnh（ThìnTuấtSửuMùi）、Tài BạchCung、Quan LộcCung',
    worstPalace: 'Phu ThêCung',
    career: 'kim dung、quân cảnh、kế toán、công trình，chấp hành lực cực mạnh，thích hợp lĩnh vực Cần phách lực cùng quyết đoán lực',
    relationship: 'Tình cảm trực lai trực vãng，thiếu tình thú，Cần bạn đời dịu dàng bổ trợ，Kỵ Tình cảm cô khắc',
    wealth: 'tài Sao bản Mệnh，tài vận cực mạnh，năng lực lý tài siêu quần，vị Thìn Tuất tài quan song mỹ',
    health: 'thuộc tính kim，Lưu ý phổi、hệ hô hấp、răng。hóa Kỵ giờ cần phòng tai ương huyết quang',
  },
  'Thiên Đồng': {
    niHaixia: 'Nghê sư nói Thiên Đồng là sao phúc，sao lười nhất。Thiên Đồng tọa Mệnh thích hưởng phúc，Bất ái cạnh tranh，thích hợp công việc ổn định。Thiên Đồng cùng Thiên Lương đồng Cung tốt nhất，có thể hưởng phúc lại có bảo đảm。Thiên Đồng hóa Lộc là hóa Lộc đẹp nhất，chủ Nhất sinh áo cơm vô ưu，vui vẻ thong dong。Thiên Đồng Kỵ Lạc Hãm，Lạc Hãm thì phúc giảm，cần hóa giải cùng Hung Sao。',
    classical: 'Cổ quyết：「Thiên Đồng vi Phúc Đức chi Sao，tọa Mệnh giả hưởng phúc hữu dư，chủ Nhất sinh tiêu dao tự tại，Bất tất lao khổ。」Nam Bắc Sơn Nhân chú：「Thiên Đồng thủ Mệnh，Tam Phương vô sát，Nhất sinh vui vẻ，áo cơm đầy đủ；gia Cát Tinh thì phú quý song toàn，vi nhân ôn hòa，đa nhân duyên。」',
    bestPalace: 'Mệnh、Phúc ĐứcCung',
    worstPalace: 'Quan LộcCung',
    career: 'phục vụ nghiệp、ngu lạc、xan ẩm、văn nghệ，hoàn cảnh nhẹ nhàng vui vẻ thích hợp nhất，Kỵ cao áp cạnh tranh',
    relationship: 'Tình cảm ôn hòa，Bất chủ động，dễ bị động tiếp nhận，hôn nhân khá ổn định，tính cách dễ chịu đáng mến',
    wealth: 'tài vận Bất đột xuất，dựa vào lương ổn định，Bất thiện đầu cơ，áo cơm vô ưu nhưng khó đại phú',
    health: 'thuộc tính thủy，Lưu ý thận、bàng quang。thể chất khá yếu，nên vận động vừa phải，giữ tâm thái nhẹ nhàng',
  },
  'Liêm Trinh': {
    niHaixia: 'Nghê sư cho rằng Liêm Trinh là thứ đào hoa，tài hoa hơn người nhưng Tình cảm phức tạp。Liêm Trinh hóa Kỵ rất Hung，đại biểu quan ti、lao ngục、tai nạn。Liêm Trinh cùng Thiên Tướng đồng Cung thì hóa Hung thành Cát，trở thành cách hành chính ấn thụ。Liêm Trinh Ngũ hành thuộc hỏa，tính cách cương liệt，Nhất sinh nhiều thăng trầm，tài nghệ xuất chúng，nếu có thể thủ chính Bất tà，có thể thành đại khí。',
    classical: 'Cổ quyết：「Liêm Trinh vi thứ đào hoa，tài hoa hơn người，Tình cảm đa ba chiết；liêm tướng đồng Cung，hóa Hung vi Cát，thành hành chính ấn thụ cách，có thể chưởng Quyền bính。」Nam Bắc Sơn Nhân chú：「Liêm Trinh thủ Mệnh，kiến Cát Tinh thì tài hoa xuất chúng，hóa Kỵ thì quan ti triền Thân，chủ huyết quang chi tai，tu phòng。」',
    bestPalace: 'Quan LộcCung（phối Thiên Tướng）、Mệnh（hóa Lộc giờ）',
    worstPalace: 'Mệnh（hóa Kỵ giờ）、Phu ThêCung',
    career: 'nghệ thuật、ngu lạc、pháp luật、công chức（phối Thiên Tướng），tài nghệ xuất chúng，nên thủ chính nghiệp mới lâu dài',
    relationship: 'đào hoa nhiều，Tình cảm phức tạp，dễ gặp tranh chấp Tình cảm，nên vãn hôn，Chọn bạn đời ổn trọng',
    wealth: 'tài vận thăng trầm，dựa vào tài nghệ mưu tài，hóa Kỵ giờ phòng tranh chấp tài vụ cùng rủi ro pháp luật',
    health: 'thuộc tính hỏa，Lưu ý tim、máu、gan。hóa Kỵ giờ phòng tai nạn cùng phẫu thuật，lưu ý huyết quang',
  },
  'Thiên Phủ': {
    niHaixia: 'Nghê sư nói Thiên Phủ là sao tài khố，sao thủ thành，Bất chủ động phát tài nhưng giữ được tài phú。Thiên Phủ tọa Mệnh thì ổn trọng bảo thủ，Nữ Mệnh tốt nhất，có thể Vượng phu hưng gia。Thiên Phủ thích nhất Tử Vi đồng Cung hoặc đối chiếu，tạo thành song sao Cách Cục，tài quan song mỹ。Thiên Phủ sợ không kiếp giáp，gặp không kiếp thì tài khố thấy đáy，giữ Bất trụ tài。',
    classical: 'Cổ quyết：「Thiên Phủ vi tài khố chi Sao，thủ Mệnh giả ổn trọng bảo thủ，chủ tích tài Vượng gia；Nữ Mệnh phùng chi，có thể Vượng phu ích Tý，gia đạo hưng long。」Nam Bắc Sơn Nhân chú：「Thiên Phủ thủ Mệnh，Tam Phương Cát tụ，tài quan song mỹ，phú quý an khang；ngộ không kiếp，thì tài khố phá lậu，nan dĩ tích tài。」',
    bestPalace: 'Mệnh、Tài BạchCung、Điền TrạchCung',
    worstPalace: 'Thiên DiCung',
    career: 'hành chính quản lý、tài vụ、bảo hiểm、phòng Địa sản，cầu ổn Bất mạo hiểm，thích hợp nghề thủ thành',
    relationship: 'Tình cảm ổn định，lo cho gia đình，là bạn đời tốt，chú trọng cảm giác an toàn gia đình cùng bảo đảm kinh tế',
    wealth: 'tài vận cực tốt，năng lực giữ tiền mạnh，thích hợp nhất đầu tư tích lũy cùng Bất động sản trí nghiệp',
    health: 'thuộc tính thổ，Lưu ý tỳ vị、tiêu hóa。thể chất ổn định，nên giữ ăn uống cùng sinh hoạt quy luật',
  },
  'Thái Âm': {
    niHaixia: 'Nghê sư cho rằng Thái Âm là sao tài，Lợi Nữ Mệnh，cũng là sao đại biểu mẫu thân và vợ con của Nam Mệnh。Thái Âm Nhập Miếu thì tài vận cực tốt，Hạn Địa thì tài vận bị cản trở。Thái Âm hóa Kỵ phải Lưu ý vấn đề của người thân Nữ tính。Thái Âm ở vị Hợi Tý Nhập Miếu，quang huy chiếu khắp，đại biểu ưu nhã tế nhị，Tình cảm phong phú，coi trọng thế giới nội tâm cùng đời sống tinh thần。',
    classical: 'Cổ quyết：「Thái Âm vi tài Sao，Lợi Nữ Mệnh；Hợi Tý Nhập Miếu，quang huy toàn chiếu，tài vận cực Vượng；Ngọ vị Lạc Hãm，ưu uất đa tình，tài vận Bình đạm。」Nam Bắc Sơn Nhân chú：「Thái Âm thủ Mệnh，Nhập Miếu giả tài phú ưu hậu，Nữ Mệnh vưu giai；Lạc Hãm giả cần nỗ lực mới có thể trí phú，tình cảm tế nhị。」',
    bestPalace: 'Mệnh（HợiTý）、Tài BạchCung',
    worstPalace: 'Mệnh（Ngọ vị Hạn Địa）',
    career: 'tài vụ、kim dung、phòng Địa sản、nghệ thuật、giáo dục，tế nhị kiên nhẫn，thích hợp nghề Cần mỹ cảm cùng ôn nhu',
    relationship: 'Tình cảm ôn nhu tế nhị，coi trọng cảm nhận nội tâm，Cần quan hệ ổn định có cảm giác an toàn',
    wealth: 'Nhập Miếu tài vận cực Vượng，Lạc Hãm thì cần nỗ lực；lý tài tỉ mỉ，giỏi tích lũy，Bất thiện mạo hiểm',
    health: 'thuộc tính thủy，Lưu ý thận、Tý Cung（Nữ Mệnh）。tâm trạng dao động ảnh hưởng sức khỏe，nên giữ tâm tình thư thái',
  },
  'Tham Lang': {
    niHaixia: 'Nghê sư nói Tham Lang là sao đa tài đa nghệ nhất，đào hoa nặng nhất。Tham Lang hóa Lộc nhập Mệnh thì mị lực Tứ xạ，người gặp người thích。Tham Lang thuộc sao vãn phát，trung năm về sau mới thật sự phát đạt。Tham Lang ở vị Dần Thân Nhập Miếu tốt nhất，đào hoa Vượng thịnh，tài nghệ siêu quần；hóa Lộc sau tài vận đại phát，nhưng nếu gặp không kiếp thì Nhất sinh nhiều ba chiết，khó tụ tài。',
    classical: 'Cổ quyết：「Tham Lang phát phúc hanh thông，đa tài đa nghệ，đào hoa nặng nhất；nhiên nan quá Tam Thập tuế，vãn phát giả chúng。Lạc Hãm ngộ sát phản Cát，thử hệ Tham Lang Lạc Hãm chi lý。」Nam Bắc Sơn Nhân chú：「Tham Lang thủ Mệnh，ngộ Cát thì phúc Lộc đa thọ，phát phúc hanh thông；nhưng cửu hậu Bất Đắc thiện chung，cố nghi tu Thân Dưỡng đức，mới có thể thiện chung。」',
    bestPalace: 'Mệnh（hóa Lộc）、Phúc ĐứcCung、Thiên DiCung',
    worstPalace: 'Tật ÁchCung',
    career: 'nghệ thuật、ngu lạc、công quan、tiêu thụ、phong thủy Ngũ thuật，dựa vào nhân mạch cùng tài nghệ，hình đa tài đa nghệ',
    relationship: 'đào hoa cực Vượng，Tình cảm đa nguyên hóa，nên vãn hôn，sau hôn nhân cần khắc chế đào hoa mới có thể bạch thủ giai lão',
    wealth: 'dựa vào nhân mạch và tài nghệ kiếm tiền，tài vận trung vãn năm mới ổn，hóa Lộc sau tài nguyên quảng tiến，đầu năm nên ổn thủ',
    health: 'thuộc tính mộc（hàm thủy），Lưu ý gan、thận。đào hoa quá Vượng dễ hao tổn tinh lực，nên tiết chế điều Dưỡng',
  },
  'Cự Môn': {
    niHaixia: 'Nghê sư cho rằng Cự Môn là sao khẩu thiệt thị phi，nhưng hóa Lộc hóa Quyền sau chuyển Cát，biến thành Cách Cục dựa vào khẩu tài kiếm tiền。Cự Môn tọa Mệnh đa nghi，thiện biện，thích hợp luật sư、giáo sư、tiêu thụ。Cự Môn Kỵ nhất hóa Kỵ，chủ khẩu thiệt thị phi Bất đoạn，thậm chí dẫn đến tố tụng。Cự Môn ở vị Tý Ngọ khá tốt，khẩu tài hay，chủ dùng ngôn ngữ lập Thân。',
    classical: 'Cổ quyết：「Cự Môn vi ám diệu，chủ khẩu thiệt thị phi；hóa Lộc Quyền thì chuyển thành dùng khẩu tài mưu sinh，chủ phú quý。」Nam Bắc Sơn Nhân chú：「Cự Môn thủ Mệnh，phùng hóa Lộc Quyền，dùng khẩu thiệt vi nghiệp giả đại cát；hóa Kỵ thì khẩu thiệt liên lụy，quan ti triền Thân，cần cẩn thận ngôn ngữ。」',
    bestPalace: 'Quan LộcCung（hóa Lộc Quyền）、Mệnh（Tý Ngọ）',
    worstPalace: 'Phu ThêCung、Tật ÁchCung（hóa Kỵ）',
    career: 'luật sư、giáo sư、tiêu thụ、chủ trì nhân、chuyên gia đàm phán，khẩu tài là năng lực cạnh tranh cốt lõi',
    relationship: 'đa nghi đa lự，dễ nghĩ quá nhiều，giao tiếp là quan kiện của hôn nhân，cần chọn bạn đời kiên nhẫn',
    wealth: 'dựa vào khẩu tài và kỹ năng chuyên nghiệp kiếm tiền，hóa Lộc sau tài vận khá tốt，hóa Kỵ phòng tranh chấp tài vụ khẩu thiệt liên lụy',
    health: 'thuộc tính thủy，Lưu ý thận、tai、khoang miệng。đa tư đa lự dễ hại Thân，nên học cách thư giãn giảm áp',
  },
  'Thiên Tướng': {
    niHaixia: 'Nghê sư nói Thiên Tướng là sao ấn thụ，phụ trách hành chính thứ vụ。Thiên Tướng tọa Mệnh thì trung quy trung củ，thích hợp công chức hành chính。Thiên Tướng cần nhất có sao mạnh phối hợp mới phát huy được，đơn độc tọa Mệnh khá Bình đạm。Thiên Tướng thích nhất Liêm Trinh tương bạn，tạo thành liêm tướng cách，có thể chủ hành chính đại Quyền；sợ nhất Phá Quân đồng Cung，tạo thành hình Kỵ giáp ấn cách，chủ Hung hiểm。',
    classical: 'Cổ quyết：「Thiên Tướng vi ấn thụ chi Sao，chủ hành chính thứ vụ；liêm tướng đồng Cung，hóa Hung vi Cát，chưởng hành chính đại Quyền。」Nam Bắc Sơn Nhân chú：「Thiên Tướng thủ Mệnh，trung quy trung củ，thích hợp công chức；Đắc Liêm Trinh tương phối，có thể thành đống lương quốc gia；Phá Quân đồng thủ，thì hình khắc nan miễn。」',
    bestPalace: 'Quan LộcCung、Mệnh（phối Liêm Trinh）',
    worstPalace: 'Tài BạchCung、Mệnh（phối Phá Quân thì hình Kỵ giáp ấn）',
    career: 'công chức、hành chính quản lý、bí thư、trợ lý，giỏi vai trò phụ trợ hỗ trợ，Cần sao mạnh dẫn đường',
    relationship: 'Tình cảm ổn định，trung hậu thật thà，là bạn đời tốt，nhưng Cần đối phương chủ đạo phương hướng',
    wealth: 'tài vận Bình ổn，dựa vào lương tích lũy，Bất thích hợp đầu tư mạo hiểm，lý tài thủ thành thích hợp nhất',
    health: 'thuộc tính thủy，Lưu ý thận、hệ bạch huyết。thể chất trung bình，nên giữ thói quen sinh hoạt quy luật',
  },
  'Thiên Lương': {
    niHaixia: 'Nghê sư cho rằng Thiên Lương là sao ấm，có thể bảo hộ người khác，cũng đại biểu y dược tôn giáo。Thiên Lương tọa Mệnh có duyên trưởng bối，đầu năm nhiều ma nạn，cuối năm hưởng phúc。Thiên Lương sợ nhất hóa Kỵ，đại biểu trưởng bối hoặc sức khỏe có vấn đề。Thiên Lương cùng Thái Dương đồng Cung tốt nhất，ngày tháng cùng sáng，quý nhân che chở，Nhất sinh có quý nhân tương trợ，cuối cùng Đắc Bình an。',
    classical: 'Cổ quyết：「Thiên Lương vi ấm Sao，chủ tí ấm bảo hộ；tọa Mệnh giả có duyên trưởng bối，đầu năm chịu ma luyện，cuối năm hưởng thanh phúc。」Nam Bắc Sơn Nhân chú：「Thiên Lương thủ Mệnh，tu phùng Cát Tinh mới có thể phát đạt；ngộ Thái Dương đồng Cung，ngày tháng cùng sáng，chủ quý hiển，Nhất sinh đa quý nhân tương trợ。」',
    bestPalace: 'Mệnh、Phụ MẫuCung、Phúc ĐứcCung',
    worstPalace: 'Mệnh（hóa Kỵ giờ）、Tài BạchCung',
    career: 'y liệu、tôn giáo、pháp luật、xã công、từ thiện，thích giúp đỡ người khác，có tấm lòng che chở mọi người',
    relationship: 'Tình cảm thường chênh lệch tuổi tác khá lớn，hoặc duyên phận đến muộn，cần chờ đợi kiên nhẫn mới Đắc lương duyên',
    wealth: 'tài vận dựa vào quý nhân tương trợ，đầu năm tài vận Bất tốt，cuối năm tài vận mới vững，nên thủ Bất nên xung',
    health: 'thuộc tính thổ，Lưu ý tỳ vị、xương cốt。cần coi trọng bảo kiện sức khỏe tuổi già，nên sớm phòng ngừa điều Dưỡng',
  },
  'Thất Sát': {
    niHaixia: 'Nghê sư nói Thất Sát là sao Tướng Quân，quả quyết xung kính mạnh，nhưng có tính cô khắc。Thất Sát tọa Mệnh Bắt buộc có Phụ Tinh hóa giải tính cô độc，bằng không lục thân duyên bạc。Thất Sát cùng Vũ Khúc đồng Cung là tướng tài cách，cực tốt。Thất Sát sợ nhất trúc la Tam hạn（dương đà hỏa linh cùng chiếu），chủ đại hung，phải phòng tai nạn。Thất Sát hóa Lộc sau phản thành Cát，có thể thành tài đại tướng。',
    classical: 'Cổ quyết：「Thất Sát vi Tướng Quân chi Sao，quả quyết xung kính mạnh；thủ Mệnh giả tính cô khắc nặng，lục thân duyên bạc。」Nam Bắc Sơn Nhân chú：「Thất Sát thủ Mệnh，Tam Hợp Cát tụ thì đại quý；ngộ trúc la Tam hạn（dương đà hỏa linh），chủ đại hung，phòng tai ương bất ngờ，phòng hình khắc。」',
    bestPalace: 'Mệnh（có Phụ Tinh）、Quan LộcCung',
    worstPalace: 'Phu ThêCung、Phụ MẫuCung',
    career: 'quân cảnh、khởi nghiệp、kim dung giao dịch、lĩnh vực độc đương Nhất diện，Cần Nhanh quyết đoán cùng phách lực',
    relationship: 'Tình cảm cô khắc，khó tìm bạn đời phù hợp，Cần đối tượng có thể bao dung cá tính cường thế，nên vãn hôn',
    wealth: 'tài vận ba động lớn，có cơ hội đại phú，cũng có lúc thăng trầm lớn；Vũ Khúc đồng Cung có thể thành tướng tài cách đại quý',
    health: 'thuộc tính kim，Lưu ý phổi、đại tràng。tính tình nóng nảy dễ hại Thân，nên học cách kiểm soát cảm xúc cùng tu Thân',
  },
  'Phá Quân': {
    niHaixia: 'Nghê sư nói Phá Quân là sao phá cũ lập mới nhất，cũng là một trong những sao cô khắc nhất。Phá Quân hóa Lộc sau mới tốt lên，đại biểu có thể phá rồi sau đó lập。Phá Quân tọa Mệnh lục thân duyên bạc，nhưng năng lực khai sáng cực mạnh。Phá Quân thích hợp nhất cải cách、sáng tạo；hóa Lộc giờ tài vận chuyển Vượng，Nhất phá Nhất lập，cuối cùng có thể thành tựu sự nghiệp。',
    classical: 'Cổ quyết：「Phá Quân vi sao phá cũ lập mới nhất，tọa Mệnh giả cô khắc，lục thân duyên bạc，nhiên năng lực khai sáng siêu cường；hóa Lộc sau phá nhi hậu lập，có thể thành đại nghiệp。」Nam Bắc Sơn Nhân chú：「Phá Quân thủ Mệnh，Nhất sinh nhiều ba chiết；hóa Lộc giả，phá tài chi hậu mới có thể trùng kiến，tài vận cuối cùng hảo chuyển，chủ thành tựu lúc cuối năm。」',
    bestPalace: 'Quan LộcCung（hóa Lộc）、Thiên DiCung',
    worstPalace: 'Phu ThêCung、Phụ MẫuCung',
    career: 'sự nghiệp hình khai sáng、quân cảnh、cải cách、quản lý biến cách，thích hợp công việc tiên phong Bất đoạn khai phá lĩnh vực mới',
    relationship: 'Tình cảm nhiều ba chiết，ly hợp Bất định，lục thân duyên bạc，cần Chọn bạn đời độc lập và có sức bao dung mạnh',
    wealth: 'tài vận thăng trầm lớn，hóa Lộc sau tài vận chuyển tốt；thủ thành thì tài thoái，cần Bất đoạn khai sáng Cục mới mới có thể tích tài',
    health: 'thuộc tính thủy，Lưu ý thận、bàng quang、hệ sinh thực。thể chất thăng trầm，nên giữ thói quen vận động quy luật',
  },
};

const levelConfig = {
  major: { label: 'Chính Tinh', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  lucky: { label: 'Cát Tinh', color: 'text-sky-400 border-sky-500/30 bg-sky-500/10' },
  sha:   { label: 'Sát Tinh', color: 'text-red-400 border-red-500/30 bg-red-500/10' },
  minor: { label: 'tạp Sao', color: 'text-slate-400 border-slate-500/25 bg-slate-500/10' },
};

const siHuaColors: Record<string, string> = {
  'Lộc': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
  'Quyền': 'text-blue-400 bg-blue-500/10 border-blue-500/30',
  'Khoa': 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
  'Kỵ': 'text-red-400 bg-red-500/10 border-red-500/30',
};

export default function StarDetailPanel({ star, palaceName, onClose }: StarDetailPanelProps) {
  const desc = star ? STAR_DESCRIPTIONS[star.name] : null;
  const detail = star ? STAR_DETAIL[star.name] : null;
  const typeConfig = star ? levelConfig[star.type] : null;

  return (
    <AnimatePresence>
      {star && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
          className="card-glass rounded-xl overflow-hidden"
        >
          {/* Tiêu đề lan */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--t-border)' }}>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold" style={{ color: 'var(--t-gold)' }}>{star.name}</span>
              {typeConfig && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${typeConfig.color}`}>
                  {typeConfig.label}
                </span>
              )}
              {star.siHua && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium ${siHuaColors[star.siHua] || ''}`}>
                  hóa {star.siHua}
                </span>
              )}
            </div>
            <button onClick={onClose} className="transition-colors text-lg leading-none" style={{ color: 'var(--t-faint)' }}>×</button>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto max-h-[560px]">
            {/* Thông tin cơ bản */}
            {desc && (
              <div className="flex flex-wrap gap-1.5">
                {[
                  `Ngũ hành · ${desc.element}`,
                  `Tính chất · ${desc.nature}`,
                  ...(palaceName ? [`Vị trí · ${palaceName}`] : []),
                  ...(star.brightness ? [star.brightness === 'bright' ? 'Miếu Vượng' : star.brightness === 'dim' ? 'Lạc Hãm' : 'Bình hòa'] : []),
                ].map(tag => (
                  <div key={tag} className="text-[10px] px-2 py-1 rounded-full"
                    style={{
                      border: '1px solid var(--t-border)',
                      color: tag.includes('Miếu Vượng') ? '#eab308' : tag.includes('Lạc Hãm') ? '#ef4444' : 'var(--t-text2)',
                    }}>
                    {tag}
                  </div>
                ))}
              </div>
            )}

            {/* Từ khóa */}
            {desc && (
              <div>
                <div className="text-[10px] tracking-widest mb-1.5" style={{ color: 'var(--t-faint)' }}>Tinh Diệu Đặc điểm</div>
                <div className="flex flex-wrap gap-1.5">
                  {desc.keywords.split('·').map(k => (
                    <span key={k} className="text-[11px] px-2 py-0.5 rounded-full"
                      style={{ color: 'var(--t-gold)', border: '1px solid rgba(212,168,67,0.2)', background: 'rgba(212,168,67,0.06)' }}>
                      {k.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Cổ thư nguyên văn */}
            {detail && (
              <div className="rounded-xl p-3" style={{ background: 'rgba(212,168,67,0.04)', border: '1px solid rgba(212,168,67,0.12)' }}>
                <div className="text-[10px] tracking-widest mb-1.5 flex items-center gap-1" style={{ color: 'var(--t-gold)', opacity: 0.7 }}>
                  Cổ thư nguyên văn
                </div>
                <p className="text-[11px] leading-relaxed italic" style={{ color: 'var(--t-gold)', opacity: 0.8 }}>{detail.classical}</p>
              </div>
            )}

            {/* Nghê Hải Hạ Luận giải */}
            {detail && (
              <>
                <div>
                  <div className="text-[10px] tracking-widest mb-1.5 flex items-center gap-1.5" style={{ color: 'var(--t-faint)' }}>
                    <span className="w-3 h-px inline-block" style={{ background: 'var(--t-border-acc)' }} />
                    Nghê Hải Hạ lão sư Luận giải
                    <span className="w-3 h-px inline-block" style={{ background: 'var(--t-border-acc)' }} />
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--t-text2)' }}>{detail.niHaixia}</p>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: 'sự nghiệp phương hướng', value: detail.career, icon: '◈' },
                    { label: 'Tình cảm Đặc điểm', value: detail.relationship, icon: '♡' },
                    { label: 'tài vận Phân tích', value: detail.wealth, icon: '◆' },
                    { label: 'sức khỏe Gợi ý', value: detail.health, icon: '☯' },
                  ].map(item => (
                    <div key={item.label} className="card-inner rounded-lg p-3">
                      <div className="text-[10px] mb-1 flex items-center gap-1" style={{ color: 'var(--t-faint)' }}>
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed" style={{ color: 'var(--t-text2)' }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="text-[10px] p-2.5 rounded-lg" style={{ border: '1px solid rgba(74,222,128,0.15)', background: 'rgba(74,222,128,0.05)' }}>
                    <div className="text-emerald-500 mb-0.5 font-medium">Cung Vị tối ưu</div>
                    <div className="text-emerald-500/70">{detail.bestPalace}</div>
                  </div>
                  <div className="text-[10px] p-2.5 rounded-lg" style={{ border: '1px solid rgba(248,113,113,0.15)', background: 'rgba(248,113,113,0.05)' }}>
                    <div className="text-red-500 mb-0.5 font-medium">Cung Vị cần Lưu ý</div>
                    <div className="text-red-500/70">{detail.worstPalace}</div>
                  </div>
                </div>
              </>
            )}

            {/* Phụ Tinh/Sát Tinh Ghi chú */}
            {!detail && star.type !== 'major' && (
              <div className="text-xs leading-relaxed" style={{ color: 'var(--t-text2)' }}>
                {star.type === 'lucky' && (
                  <>
                    {star.name === 'Văn Xương' && 'Văn Xương nhập Cung，chủ học nghiệp khảo thí thuận Lợi，văn thư ấn giám có Lợi，nên làm công việc liên quan văn tự。Cổ quyết：「Văn Xương Khoa Giáp，chủ văn chương hiển đạt，phùng khảo tất đệ。」'}
                    {star.name === 'Văn Khúc' && 'Văn Khúc nhập Cung，chủ tài nghệ xuất chúng，khẩu tài hay，giỏi biểu đạt，năng khiếu nghệ thuật Thiên phú mạnh。Cổ quyết：「Văn Khúc vi tài nghệ chi Sao，năng văn năng võ，khẩu tài thắng nhân。」'}
                    {star.name === 'Tả Phù' && 'Tả Phù nhập Cung，chủ quý nhân tương trợ，có người nâng đỡ，sự hạng của Cung Vị này được hỗ trợ thiện ý。Cổ quyết：「Tả Phù vi trợ lực chi Sao，tọa Mệnh thì quý nhân nhiều，phùng Hung hóa Cát。」'}
                    {star.name === 'Hữu Bật' && 'Hữu Bật nhập Cung，chủ quý nhân tương trợ，nhiều quý nhân Nữ tính，sự hạng của Cung Vị này có người hiệp trợ。Cổ quyết：「Hữu Bật vi Âm trợ chi Sao，nhiều quý nhân Nữ tính，hóa hiểm vi di。」'}
                    {star.name === 'Thiên Khôi' && 'Thiên Khôi nhập Cung，chủ quý nhân sinh ban ngày，quý nhân Nam tính nhiều，phùng Hung hóa Cát chi lực。Cổ quyết：「Thiên Khôi vi Thiên Ất quý nhân，phùng chi tất có quý nhân phù trì。」'}
                    {star.name === 'Thiên Việt' && 'Thiên Việt nhập Cung，chủ quý nhân sinh ban đêm，quý nhân Nữ tính nhiều，tăng thêm khí Cát tường。Cổ quyết：「Thiên Việt vi ngọc đường quý nhân，chủ Âm trợ，Nữ quý nhân nhiều。」'}
                    {star.name === 'Lộc Tồn' && 'Lộc Tồn nhập Cung，chủ tài Lộc thủ thành，Cung Vị này có tài khí，nhưng thuộc về tài vận hình bảo thủ。Cổ quyết：「Lộc Tồn vi tài Lộc chi Sao，chủ thủ tài hữu dư，tiến tài ổn kiện。」'}
                    {star.name === 'Thiên Mã' && 'Thiên Mã nhập Cung，chủ bôn ba động đãng，động trung cầu tài，nên chủ động xuất kích，Bất nên thủ chu đãi thố。Cổ quyết：「Thiên Mã chủ động，phùng Lộc thì tài Lộc song toàn，động trung sinh tài。」'}
                  </>
                )}
                {star.type === 'sha' && (
                  <>
                    {star.name === 'Địa Không' && 'Địa Không nhập Cung，chủ sự hạng của Cung Vị này có cảm giác rơi vào trống rỗng，tinh thần hao tán，nên Lưu ý sức khỏe tâm lý。Cổ quyết：「Địa Không chủ hư hao，nhập Mệnh giả đa tinh thần mê mang，phải phòng không tưởng。」'}
                    {star.name === 'Địa Kiếp' && 'Địa Kiếp nhập Cung，chủ sự hạng của Cung Vị này có tổn thất bất ngờ，tài vật cần cẩn thận，phòng tiểu nhân。Cổ quyết：「Địa Kiếp chủ kiếp tài，nhập Mệnh giả tài vận thụ tổn，phòng mất mát bất ngờ。」'}
                    {star.name === 'Hỏa Tinh' && 'Hỏa Tinh nhập Cung，chủ sự hạng của Cung Vị này nóng nảy xung động，tâm trạng dao động，nhưng nếu gặp Tham Lang thì phản thành Cát。Cổ quyết：「Hỏa Tinh chủ cấp táo，nhiên gặp Tham Lang đồng Cung，phản vi hỏa tham cách，chủ bạo phát。」'}
                    {star.name === 'Linh Tinh' && 'Linh Tinh nhập Cung，chủ sự hạng của Cung Vị này có trở ngại ngầm，phòng tiểu nhân sau lưng，mọi việc nên khiêm tốn。Cổ quyết：「Linh Tinh chủ ám sát，nhập Mệnh giả đa ám trung thụ địch，phải phòng thị phi sau lưng。」'}
                    {star.name === 'Kình Dương' && 'Kình Dương nhập Cung，chủ hình khắc，sự hạng của Cung Vị này nhiều ba chiết，có tai ương huyết quang hoặc tai nạn。Cổ quyết：「Kình Dương vi hình khắc chi Sao，nhập Mệnh giả đa hình khắc，phải phòng tai nạn huyết quang。」'}
                    {star.name === 'Đà La' && 'Đà La nhập Cung，chủ thị phi triền Thân，sự hạng của Cung Vị này tha diên Bất quyết，mọi việc nên sớm chuẩn bị。Cổ quyết：「Đà La chủ thị phi tha diên，nhập Mệnh giả tố sự trì hoãn，phải phòng củ triền Bất thanh。」'}
                  </>
                )}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

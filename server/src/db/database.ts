import {
  UserEntity,
  UserProfileEntity,
  TargetOptionEntity,
  UserDailyActivityEntity,
  CertificateDomainEntity,
  ExamCategoryEntity,
  HeroQuickSearchChipEntity,
  ExamSkillEntity,
  ExamEntity,
  ExamPassageEntity,
  QuestionEntity,
  ExamAttemptEntity,
  ExamAttemptAnswerEntity,
  ExamAttemptSkillBreakdownEntity,
  UserMistakeNotebookEntity,
  VocabularyTermEntity,
  UserSavedVocabularyEntity,
  PartnerUniversityEntity,
  StudentTestimonialEntity,
} from '../shared/types';

export class Database {
  private static instance: Database;

  public users: Map<string, UserEntity> = new Map();
  public user_profiles: Map<string, UserProfileEntity> = new Map();
  public target_options: Map<string, TargetOptionEntity> = new Map();
  public user_daily_activities: Map<string, UserDailyActivityEntity> = new Map();
  public certificate_domains: Map<string, CertificateDomainEntity> = new Map();
  public exam_categories: Map<string, ExamCategoryEntity> = new Map();
  public hero_quick_search_chips: Map<string, HeroQuickSearchChipEntity> = new Map();
  public exam_skills: Map<string, ExamSkillEntity> = new Map();
  public exams: Map<string, ExamEntity> = new Map();
  public user_bookmarked_exams: Set<string> = new Set(); // format: `${userId}:${examId}`
  public exam_passages: Map<string, ExamPassageEntity> = new Map();
  public questions: Map<number, QuestionEntity> = new Map();
  public exam_attempts: Map<string, ExamAttemptEntity> = new Map();
  public exam_attempt_answers: Map<string, ExamAttemptAnswerEntity> = new Map(); // format: `${attemptId}:${questionId}`
  public exam_attempt_skill_breakdown: Map<string, ExamAttemptSkillBreakdownEntity> = new Map();
  public user_mistake_notebook: Map<string, UserMistakeNotebookEntity> = new Map();
  public vocabulary_terms: Map<string, VocabularyTermEntity> = new Map();
  public user_saved_vocabulary: Map<string, UserSavedVocabularyEntity> = new Map(); // format: `${userId}:${vocabId}`
  public partner_universities: Map<string, PartnerUniversityEntity> = new Map();
  public student_testimonials: Map<string, StudentTestimonialEntity> = new Map();

  private constructor() {
    this.seed();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private seed() {
    // 1. Users & Profiles
    const demoUser: UserEntity = {
      id: 'user_demo_01',
      email: 'phuongthao@edutest.pro',
      password_hash: '$2b$10$hashed_password_sample',
      full_name: 'Nguyễn Phương Thảo',
      avatar_url: '',
      role: 'student',
      status: 'active',
      created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.users.set(demoUser.id, demoUser);

    const demoProfile: UserProfileEntity = {
      id: 'profile_demo_01',
      user_id: demoUser.id,
      target_exam: 'IELTS 7.5+',
      current_streak: 0,
      completed_today: 0,
      goal_today: 3,
      coins: 0,
      notifications_count: 0,
      updated_at: new Date().toISOString(),
    };
    this.user_profiles.set(demoProfile.user_id, demoProfile);

    // Target Options
    const targets: TargetOptionEntity[] = [
      { code: 'ielts_7_5', label: 'IELTS 7.5+', category_code: 'ielts', display_order: 1, is_active: true },
      { code: 'cfa_level_1', label: 'CFA Level 1', category_code: 'cfa', display_order: 2, is_active: true },
      { code: 'hsk_5_6', label: 'HSK 5 - 6', category_code: 'hsk', display_order: 3, is_active: true },
      { code: 'toeic_850', label: 'TOEIC 850+', category_code: 'toeic', display_order: 4, is_active: true },
      { code: 'gmat_focus', label: 'GMAT Focus', category_code: 'gmat', display_order: 5, is_active: true },
    ];
    targets.forEach((t) => this.target_options.set(t.code, t));

    // Daily Activities (Khởi tạo tuần mới cho người dùng)
    const days = [
      { day: 'T2', completed: false, score: 0 },
      { day: 'T3', completed: false, score: 0 },
      { day: 'T4', completed: false, score: 0 },
      { day: 'T5', completed: false, score: 0 },
      { day: 'T6', completed: false, score: 0 },
      { day: 'T7', completed: false, score: 0 },
      { day: 'CN', completed: false, score: 0 },
    ];
    days.forEach((d, idx) => {
      const actId = `act_${idx}`;
      this.user_daily_activities.set(actId, {
        id: actId,
        user_id: demoUser.id,
        activity_date: new Date(Date.now() - (6 - idx) * 86400000).toISOString().split('T')[0],
        day_label: d.day,
        completed: d.completed,
        score: d.score,
        minutes_studied: 0,
      });
    });

    // 2. Certificate Domains
    const domains: CertificateDomainEntity[] = [
      { code: 'foreign-language', name_vi: 'Khối Ngoại Ngữ', description: 'Chứng chỉ ngoại ngữ quốc tế (IELTS, HSK, TOEIC, TOEFL)', icon_name: 'Languages', display_order: 1 },
      { code: 'economics', name_vi: 'Khối Kinh Tế & Quản Trị', description: 'Chứng chỉ tài chính, kiểm toán và kinh tế (CFA, GMAT, ACCA, GRE)', icon_name: 'TrendingUp', display_order: 2 },
      { code: 'admissions', name_vi: 'Khối Tuyển Sinh & Đánh Giá Năng Lực', description: 'Kỳ thi tốt nghiệp THPT và chuẩn hóa đại học (THPTQG, SAT)', icon_name: 'GraduationCap', display_order: 3 },
    ];
    domains.forEach((d) => this.certificate_domains.set(d.code, d));

    // Exam Categories
    const categories: ExamCategoryEntity[] = [
      { code: 'ielts', domain_code: 'foreign-language', name: 'IELTS Academic & General', short_name: 'IELTS', standard_org: 'Cambridge Assessment', target_score_range: 'Target: 6.5 - 8.5+', description: 'Bộ đề Cambridge 16-19, Reading & Listening giải thích chi tiết', display_order: 1, is_active: true },
      { code: 'hsk', domain_code: 'foreign-language', name: 'HSK (Cấp độ 1 - 6)', short_name: 'HSK', standard_org: 'Hanban Standard', target_score_range: 'HSK 4, 5, 6 & HSKK', description: 'Khảo thí Hanban Trung Quốc, Pinyin & cấu trúc ngữ pháp', display_order: 2, is_active: true },
      { code: 'toeic', domain_code: 'foreign-language', name: 'TOEIC 4 Kỹ Năng', short_name: 'ETS', standard_org: 'ETS Chuẩn 2024', target_score_range: 'Target: 750 - 990', description: 'Format đề mới nhất, bẫy Part 5 & 7 văn bản thương mại', display_order: 3, is_active: true },
      { code: 'toefl', domain_code: 'foreign-language', name: 'TOEFL iBT Academic', short_name: 'iBT', standard_org: 'ETS iBT', target_score_range: 'Target: 95 - 110+', description: 'Mô phỏng bài thi du học học thuật Bắc Mỹ với bài đọc chuyên ngành', display_order: 4, is_active: true },
      { code: 'cfa', domain_code: 'economics', name: 'CFA Level 1, 2, 3', short_name: 'CFA', standard_org: 'CFA Institute', target_score_range: 'CFA Standard 2024', description: 'Trắc nghiệm Ethics, Quantitative Methods, Financial Statement Analysis', display_order: 5, is_active: true },
      { code: 'gmat', domain_code: 'economics', name: 'GMAT Focus Edition', short_name: 'GMAT', standard_org: 'GMAC Focus 2024', target_score_range: 'Target 655+ (90th%)', description: 'Trọng tâm Data Insights, Quantitative Reasoning & Verbal cho thạc sĩ MBA', display_order: 6, is_active: true },
      { code: 'acca', domain_code: 'economics', name: 'ACCA Financial Accounting', short_name: 'ACCA', standard_org: 'ACCA Global UK', target_score_range: 'Kiểm toán & IFRS', description: 'Bộ đề kiểm toán quốc tế, bài tập định khoản nghiệp vụ theo IFRS', display_order: 7, is_active: true },
      { code: 'gre', domain_code: 'economics', name: 'GRE General Test', short_name: 'GRE', standard_org: 'ETS Official', target_score_range: 'Target 325+', description: 'Bài thi khảo thí năng lực định lượng và ngôn ngữ học thuật cao học', display_order: 8, is_active: true },
      { code: 'thptqg', domain_code: 'admissions', name: 'THPT Quốc Gia Tiếng Anh', short_name: 'THPT', standard_org: 'Bộ GD&ĐT', target_score_range: 'Target 8.5 - 9.5+', description: 'Chuẩn form ma trận Bộ GD&ĐT, phân loại câu hỏi điểm 9+', display_order: 9, is_active: true },
    ];
    categories.forEach((c) => this.exam_categories.set(c.code, c));

    // Hero Chips
    const chips: HeroQuickSearchChipEntity[] = [
      { id: 'chip_1', label: 'IELTS Cambridge 18', category_code: 'ielts', search_keyword: 'Cambridge 18', display_order: 1, is_active: true },
      { id: 'chip_2', label: 'CFA Level 1 Ethics', category_code: 'cfa', search_keyword: 'CFA Level 1', display_order: 2, is_active: true },
      { id: 'chip_3', label: 'GMAT Focus 2024', category_code: 'gmat', search_keyword: 'GMAT Focus', display_order: 3, is_active: true },
      { id: 'chip_4', label: 'HSK 5 Chuẩn Hanban', category_code: 'hsk', search_keyword: 'HSK 5', display_order: 4, is_active: true },
      { id: 'chip_5', label: 'TOEIC ETS Full Test', category_code: 'toeic', search_keyword: 'TOEIC ETS', display_order: 5, is_active: true },
    ];
    chips.forEach((c) => this.hero_quick_search_chips.set(c.id, c));

    // Skills
    const skills: ExamSkillEntity[] = [
      { code: 'all', name_vi: 'Tất cả kỹ năng', display_order: 1 },
      { code: 'reading', name_vi: 'Đọc hiểu (Reading)', icon_name: 'FileText', display_order: 2 },
      { code: 'listening', name_vi: 'Nghe hiểu (Listening)', icon_name: 'Headphones', display_order: 3 },
    ];
    skills.forEach((s) => this.exam_skills.set(s.code, s));

    // 3. Exams
    const examList: ExamEntity[] = [
      {
        id: 'ielts-cam-18-test-3',
        category_code: 'ielts',
        title: 'Cambridge IELTS 18 – Academic Reading Test 3',
        subtitle: 'Passages: Urban farming · Artificial intelligence · Renewable energy technologies',
        category_label: 'IELTS Academic',
        sub_badge: 'Cambridge Assessment',
        badge_type: 'hot',
        difficulty: 'hard',
        difficulty_label: 'Band 7.0 - 8.5+',
        passages_summary: '3 Passages: Urban farming · Artificial intelligence · Materials science',
        total_questions: 40,
        duration_minutes: 60,
        test_takers_count: 18400,
        rating: 4.9,
        review_count: 1230,
        has_audio: false,
        has_video_solution: false,
        is_published: true,
        tags: ['Giải thích tiếng Việt', 'Chuẩn Cambridge', 'Band 7.0 - 8.5+'],
        created_at: new Date('2024-01-15').toISOString(),
      },
      {
        id: 'cfa-level-1-ethics-quant',
        category_code: 'cfa',
        title: 'CFA Level 1 – Quantitative Methods & Ethical Standards',
        subtitle: 'CFA Institute 2024 Curriculum Mock Exam · TVM, Probability, Hypothesis Testing & Code of Ethics',
        category_label: 'Kinh Tế & Tài Chính',
        sub_badge: 'CFA Institute',
        badge_type: 'hot',
        difficulty: 'hard',
        difficulty_label: 'CFA Standard 2024',
        total_questions: 45,
        duration_minutes: 60,
        test_takers_count: 12850,
        rating: 4.95,
        review_count: 940,
        has_audio: false,
        has_video_solution: false,
        is_published: true,
        tags: ['CFA Level 1', 'Financial Ethics', 'Quantitative Analysis', 'Tài chính chuyên sâu'],
        created_at: new Date('2024-02-10').toISOString(),
      },
      {
        id: 'gmat-focus-data-insights',
        category_code: 'gmat',
        title: 'GMAT Focus Edition – Data Insights & Quantitative Reasoning',
        subtitle: 'Official GMAC Assessment Form · Data Sufficiency, Multi-Source Reasoning & Integrated Graphs',
        category_label: 'Kinh Tế & Quản Trị',
        sub_badge: 'GMAC Official',
        badge_type: 'new',
        difficulty: 'hard',
        difficulty_label: 'Target 655+ (90th%)',
        total_questions: 30,
        duration_minutes: 45,
        test_takers_count: 15200,
        rating: 4.9,
        review_count: 1120,
        has_audio: false,
        has_video_solution: false,
        is_published: true,
        tags: ['GMAT Focus 2024', 'Data Insights', 'Thạc sĩ Quản trị MBA', 'Tư duy logic'],
        created_at: new Date('2024-02-20').toISOString(),
      },
      {
        id: 'hsk-5-standard-2024',
        category_code: 'hsk',
        title: 'HSK 5 – Bộ đề luyện thi tiêu chuẩn Hanban 2024',
        subtitle: 'Đề 02 · Kèm Audio giọng Bắc Kinh chuẩn · Đầy đủ Pinyin & Giải nghĩa cấu trúc ngữ pháp',
        category_label: 'Ngoại Ngữ - HSK',
        sub_badge: 'Hanban Standard',
        badge_type: 'audio',
        difficulty: 'hard',
        difficulty_label: 'Cao cấp (HSK 5)',
        total_questions: 90,
        duration_minutes: 100,
        test_takers_count: 9800,
        rating: 4.8,
        review_count: 845,
        has_audio: true,
        audio_duration: '45:00',
        has_video_solution: false,
        is_published: true,
        tags: ['Kèm Audio gốc', 'Phân tích ngữ pháp', 'Đáp án chuẩn Hanban'],
        created_at: new Date('2024-03-01').toISOString(),
      },
      {
        id: 'toeic-ets-reading-listening',
        category_code: 'toeic',
        title: 'TOEIC ETS 2024 – Test 05 Full Reading & Listening',
        subtitle: 'Bộ đề bản quyền ETS chuẩn format mới nhất · Trọng tâm Part 5, 6, 7 văn bản thương mại',
        category_label: 'Ngoại Ngữ - TOEIC',
        sub_badge: 'ETS Official',
        badge_type: 'audio',
        difficulty: 'medium',
        difficulty_label: 'Target 750 - 900+',
        total_questions: 100,
        duration_minutes: 75,
        test_takers_count: 28400,
        rating: 4.85,
        review_count: 1980,
        has_audio: true,
        has_video_solution: false,
        is_published: true,
        tags: ['ETS 2024', 'Target 800+', 'Audio bản quyền', 'Business English'],
        created_at: new Date('2024-03-10').toISOString(),
      },
      {
        id: 'acca-f3-financial-accounting',
        category_code: 'acca',
        title: 'ACCA Financial Accounting (FA / F3) – Mock Exam',
        subtitle: 'International Financial Reporting Standards (IFRS) · Balance Sheets, Cash Flows & Double-Entry',
        category_label: 'Kinh Tế & Kiểm Toán',
        sub_badge: 'ACCA UK',
        badge_type: 'new',
        difficulty: 'hard',
        difficulty_label: 'ACCA Standard',
        total_questions: 35,
        duration_minutes: 60,
        test_takers_count: 8650,
        rating: 4.9,
        review_count: 620,
        has_audio: false,
        has_video_solution: false,
        is_published: true,
        tags: ['ACCA F3', 'Kiểm toán quốc tế', 'IFRS Standards', 'Kế toán tài chính'],
        created_at: new Date('2024-03-15').toISOString(),
      },
      {
        id: 'thptqg-chuyen-su-pham-2024',
        category_code: 'thptqg',
        title: 'Đề thi thử THPT Quốc Gia 2024 – Chuyên ĐH Sư Phạm Hà Nội',
        subtitle: 'Chuẩn form ma trận Bộ GD&ĐT (Lần 2) · Lời giải chi tiết từng câu phân loại 9+',
        category_label: 'Tuyển Sinh - THPTQG',
        sub_badge: 'Chuyên Sư Phạm',
        badge_type: 'video',
        difficulty: 'medium',
        difficulty_label: 'Mục tiêu 8.5 - 9.5+',
        total_questions: 50,
        duration_minutes: 60,
        test_takers_count: 24200,
        rating: 5.0,
        review_count: 2410,
        has_audio: false,
        has_video_solution: true,
        is_published: true,
        tags: ['Lời giải Video + Text', 'Chuyên Sư Phạm', 'Bộ đề 9+'],
        created_at: new Date('2024-03-20').toISOString(),
      },
    ];
    examList.forEach((e) => this.exams.set(e.id, e));

    // Bookmarked Exams: Khởi tạo trống ban đầu (Chưa có bookmark)
    // this.user_bookmarked_exams khởi tạo trống

    // 4. Exam Passages & 5. Questions: Khởi tạo trống
    // Lưu ý: Phần extract sách để hiển thị đề cho người dùng làm online đang được Dev khác phát triển và chưa merge vào hệ thống.
    // Toàn bộ dữ liệu đề thi mẫu đã được gỡ bỏ hoàn toàn khỏi DB. Khi module trích xuất hoàn thiện sẽ nạp dữ liệu thật vào DB.

    // 6. User Exam Attempts & Mistakes: Khởi tạo trống cho người dùng mới (Chỉ tạo khi người dùng làm bài/lưu lỗi sai)
    // Dev khác đang phát triển module phòng thi và tính điểm thi.
    // 7. Mistake Notebook: Khởi tạo trống, lưu khi học viên thao tác.


    // 8. Vocabulary Terms
    const vocabData: VocabularyTermEntity[] = [
      {
        id: 'v1',
        passage_id: 'passage-2',
        word: 'hydroponic',
        phonetic: '/ˌhaɪ.drəˈpɒn.ɪk/',
        part_of_speech: 'adj',
        domain_or_cert: 'ielts',
        meaning_vi: 'thủy canh (trồng cây trong dung dịch dinh dưỡng không cần đất)',
        example_en: 'Closed-loop hydroponic systems recycle virtually 95% of moisture.',
        example_vi: 'Các hệ thống thủy canh vòng kín tái chế gần 95% độ ẩm.',
        collocation: 'hydroponic farming / agriculture',
      },
      {
        id: 'v2',
        passage_id: 'passage-2',
        word: 'drastically',
        phonetic: '/ˈdræs.tɪ.kəl.i/',
        part_of_speech: 'adv',
        domain_or_cert: 'ielts',
        meaning_vi: 'mạnh mẽ, đột ngột, triệt để',
        example_en: 'The new technique drastically reduces water consumption.',
        example_vi: 'Kỹ thuật mới giảm đáng kể lượng nước tiêu thụ.',
        collocation: 'drastically reduce / alter / improve',
      },
      {
        id: 'v3',
        passage_id: 'passage-2',
        word: 'depletion',
        phonetic: '/dɪˈpliː.ʃən/',
        part_of_speech: 'noun',
        domain_or_cert: 'ielts',
        meaning_vi: 'sự cạn kiệt, suy giảm tài nguyên',
        example_en: 'Rural soil depletion threatens long-term agricultural sustainability.',
        example_vi: 'Sự suy kiệt đất canh tác nông thôn đe dọa sự bền vững lâu dài.',
        collocation: 'soil / resource / ozone depletion',
      },
      {
        id: 'v4',
        passage_id: 'passage-2',
        word: 'aeroponic',
        phonetic: '/ˌeə.rəʊˈpɒn.ɪk/',
        part_of_speech: 'adj',
        domain_or_cert: 'ielts',
        meaning_vi: 'khí canh (rễ cây lơ lửng trong không khí được phun sương dinh dưỡng)',
        example_en: 'Aeroponic misting provides plant roots with optimal oxygen levels.',
        example_vi: 'Phun sương khí canh cung cấp cho rễ cây mức oxy tối ưu.',
        collocation: 'aeroponic misting system',
      },
      {
        id: 'v5',
        passage_id: 'passage-2',
        word: 'hinder',
        phonetic: '/ˈhɪn.dər/',
        part_of_speech: 'verb',
        domain_or_cert: 'ielts',
        meaning_vi: 'cản trở, kìm hãm, gây trở ngại',
        example_en: 'High installation capital costs have hindered adoption in developing nations.',
        example_vi: 'Chi phí vốn lắp đặt cao đã cản trở việc áp dụng tại các nước đang phát triển.',
        collocation: 'hinder economic development / growth',
      },
      {
        id: 'v6',
        word: 'amortization',
        phonetic: '/əˌmɔː.tɪˈzeɪ.ʃən/',
        part_of_speech: 'noun (CFA/Finance)',
        domain_or_cert: 'cfa',
        meaning_vi: 'khấu hao tài sản vô hình / phân bổ dần khoản nợ vay',
        example_en: 'Intangible assets with finite lives are subject to regular amortization.',
        example_vi: 'Tài sản vô hình có thời hạn hữu hạn phải chịu khấu hao định kỳ.',
        collocation: 'loan / bond / asset amortization',
      },
      {
        id: 'v7',
        word: 'arbitrage',
        phonetic: '/ˈɑː.bɪ.trɑːʒ/',
        part_of_speech: 'noun (Finance/Economics)',
        domain_or_cert: 'cfa',
        meaning_vi: 'kinh doanh chênh lệch giá (mua rẻ ở thị trường này và bán đắt ở thị trường khác cùng thời điểm)',
        example_en: 'Arbitrage opportunities disappear rapidly in highly liquid financial markets.',
        example_vi: 'Cơ hội chênh lệch giá biến mất rất nhanh ở các thị trường tài chính có tính thanh khoản cao.',
        collocation: 'pure arbitrage / risk arbitrage',
      },
    ];
    vocabData.forEach((v) => this.vocabulary_terms.set(v.id, v));

    // 8b. Saved Vocab: Khởi tạo trống, lưu khi người dùng bấm lưu từ vựng
    // this.user_saved_vocabulary khởi tạo trống ban đầu

    // 9. Universities & Testimonials
    const universities: PartnerUniversityEntity[] = [
      { id: 'ftu', name: 'Đại học Ngoại Thương', short_name: 'FTU', subtitle: 'Foreign Trade University', country_region: 'Hà Nội & TP.HCM', student_count_display: '6,400+ sinh viên', popular_certs: ['IELTS 7.5+', 'CFA Level 1', 'TOEIC 900'], display_order: 1, is_active: true },
      { id: 'neu', name: 'Đại học Kinh tế Quốc dân', short_name: 'NEU', subtitle: 'National Economics University', country_region: 'Hà Nội', student_count_display: '7,800+ sinh viên', popular_certs: ['CFA', 'GMAT', 'IELTS', 'ACCA'], display_order: 2, is_active: true },
      { id: 'rmit', name: 'RMIT University', short_name: 'RMIT', subtitle: 'RMIT University Vietnam', country_region: 'Vietnam / Australia', student_count_display: '4,200+ sinh viên', popular_certs: ['IELTS 7.5+', 'CFA', 'GMAT'], display_order: 3, is_active: true },
      { id: 'vnu', name: 'Đại học Quốc gia Hà Nội', short_name: 'VNU', subtitle: 'Vietnam National University', country_region: 'Hà Nội', student_count_display: '9,100+ sinh viên', popular_certs: ['IELTS', 'HSK 5-6', 'SAT', 'ĐGNL'], display_order: 4, is_active: true },
      { id: 'ueh', name: 'Đại học Kinh tế TP.HCM', short_name: 'UEH', subtitle: 'University of Economics HCMC', country_region: 'TP. Hồ Chí Minh', student_count_display: '6,800+ sinh viên', popular_certs: ['CFA', 'TOEIC', 'ACCA', 'GMAT'], display_order: 5, is_active: true },
      { id: 'hust', name: 'Đại học Bách Khoa Hà Nội', short_name: 'HUST', subtitle: 'Hanoi University of Science and Tech', country_region: 'Hà Nội', student_count_display: '5,500+ sinh viên', popular_certs: ['TOEIC 850+', 'IELTS', 'GRE Quant'], display_order: 6, is_active: true },
      { id: 'oxford', name: 'University of Oxford', short_name: 'OXFORD', subtitle: 'University of Oxford, UK', country_region: 'United Kingdom', student_count_display: 'Du học & Sau ĐH', popular_certs: ['IELTS Academic 8.0', 'GMAT 720+'], display_order: 7, is_active: true },
      { id: 'cambridge', name: 'University of Cambridge', short_name: 'CAMBRIDGE', subtitle: 'University of Cambridge, UK', country_region: 'United Kingdom', student_count_display: 'Du học & Sau ĐH', popular_certs: ['Cambridge Assessment', 'CFA'], display_order: 8, is_active: true },
      { id: 'harvard', name: 'Harvard University', short_name: 'HARVARD', subtitle: 'Harvard Business School / College', country_region: 'United States', student_count_display: 'MBA & Sau ĐH', popular_certs: ['GMAT Focus 685+', 'GRE'], display_order: 9, is_active: true },
    ];
    universities.forEach((u) => this.partner_universities.set(u.id, u));

    const testimonials: StudentTestimonialEntity[] = [
      {
        id: 'testi_1',
        university_id: 'ftu',
        student_name: 'Trần Hoàng Long',
        cohort_info: 'Khóa K60 FTU Hà Nội',
        achieved_badge: 'Đạt IELTS Band 8.0',
        badge_color: 'blue',
        quote_content: '“Giao diện làm đề giống hệt thi IELTS trên máy tính của BC/IDP. Đặc biệt mục phân tích bẫy Paraphrase Trap giúp mình tăng từ 7.0 lên 8.0 Reading chỉ sau 3 tuần.”',
        is_featured: true,
        display_order: 1,
      },
      {
        id: 'testi_2',
        university_id: 'neu',
        student_name: 'Lê Minh Quân',
        cohort_info: 'Viện Ngân hàng - Tài chính NEU',
        achieved_badge: 'Passed CFA Level 1 (Top 10%)',
        badge_color: 'purple',
        quote_content: '“Đề thi CFA ở đây có câu hỏi Ethics và Quantitative bám sát curriculum 2024. Phân tích chi tiết giúp mình không bị nhầm lẫn giữa IFRS và US GAAP.”',
        is_featured: true,
        display_order: 2,
      },
      {
        id: 'testi_3',
        university_id: 'vnu',
        student_name: 'Phạm Thu Uyên',
        cohort_info: 'Khoa Ngôn ngữ & Văn hóa Trung Quốc',
        achieved_badge: 'Đạt HSK 6 (262/300 điểm)',
        badge_color: 'amber',
        quote_content: '“Hệ thống tra từ vựng trực tiếp khi click đúp vào chữ Hán cực kỳ tiện. Audio đề nghe chuẩn giọng Bắc Kinh, không bị rè hay giật lag như các trang khác.”',
        is_featured: true,
        display_order: 3,
      },
    ];
    testimonials.forEach((t) => this.student_testimonials.set(t.id, t));
  }
}

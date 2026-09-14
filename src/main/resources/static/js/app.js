/**
 * Bookstore Application Logic (BookMind AI Original Edition)
 */

// Sample Book Catalog Data
let BOOK_CATALOG = [
    {
        "id": 1,
        "title": "Trí Tuệ Nhân Tạo & Tương Lai Loài Người",
        "author": "Dr. Alex Vance",
        "category": "tech",
        "categoryName": "Công Nghệ & AI",
        "price": 189000,
        "oldPrice": 240000,
        "rating": 4.9,
        "reviewsCount": 142,
        "discount": 21,
        "image": "images/book_ai.png",
        "description": "Khám phá chiều sâu của cuộc cách mạng AI, từ mạng thần kinh nhân tạo đến tiềm năng biến đổi hoàn toàn xã hội, công việc và tương lai trí tuệ con người.",
        "tags": [
            "ai",
            "công nghệ",
            "trí tuệ nhân tạo",
            "tech",
            "lập trình",
            "tương lai"
        ],
        "isBestseller": true
    },
    {
        "id": 2,
        "title": "Lập Trình Web Hiện Đại Với JavaScript & React",
        "author": "Đặng Hoàng Nam",
        "category": "tech",
        "categoryName": "Công Nghệ & AI",
        "price": 210000,
        "oldPrice": 280000,
        "rating": 4.9,
        "reviewsCount": 98,
        "discount": 25,
        "image": "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80",
        "description": "Cẩm nang thực hành toàn diện từ cơ bản HTML/CSS/JS nâng cao đến xây dựng Single Page Application chuẩn công nghiệp với React và Node.js.",
        "tags": [
            "lập trình",
            "web",
            "javascript",
            "react",
            "công nghệ",
            "code"
        ],
        "isBestseller": true
    },
    {
        "id": 3,
        "title": "Vũ Trụ Trong Vỏ Hạt Dẻ & Máy Tính Lượng Tử",
        "author": "Stephen Hawking",
        "category": "tech",
        "categoryName": "Công Nghệ & AI",
        "price": 168000,
        "oldPrice": 210000,
        "rating": 4.9,
        "reviewsCount": 310,
        "discount": 20,
        "image": "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80",
        "description": "Chuyến du hành khoa học lý thú giải thích nguyên lý lý thuyết dây, lỗ đen, máy tính lượng tử và ranh giới tri thức công nghệ vũ trụ.",
        "tags": [
            "khoa học",
            "vũ trụ",
            "vật lý",
            "hawking",
            "lượng tử",
            "công nghệ"
        ],
        "isBestseller": false
    },
    {
        "id": 4,
        "title": "Clean Code - Nghệ Thuật Viết Code Sạch",
        "author": "Robert C. Martin (Uncle Bob)",
        "category": "tech",
        "categoryName": "Công Nghệ & AI",
        "price": 265000,
        "oldPrice": 320000,
        "rating": 4.9,
        "reviewsCount": 420,
        "discount": 17,
        "image": "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80",
        "description": "Kinh thánh của mọi lập trình viên phần mềm chuyên nghiệp. Hướng dẫn chi tiết cách đặt tên biến, cấu trúc hàm, xử lý ngoại lệ và refactoring mã nguồn sạch.",
        "tags": [
            "clean code",
            "lập trình",
            "software",
            "code sạch",
            "developer"
        ],
        "isBestseller": true
    },
    {
        "id": 5,
        "title": "Thiết Kế Hệ Thống Quy Mô Lớn (System Design Interview)",
        "author": "Alex Xu",
        "category": "tech",
        "categoryName": "Công Nghệ & AI",
        "price": 295000,
        "oldPrice": 350000,
        "rating": 4.9,
        "reviewsCount": 215,
        "discount": 16,
        "image": "https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=600&q=80",
        "description": "Hướng dẫn thực chiến cách thiết kế kiến trúc phân tán phục vụ hàng triệu người dùng: Load Balancer, Caching, Sharding, Message Queue và Microservices.",
        "tags": [
            "system design",
            "kiến trúc",
            "microservices",
            "phần mềm",
            "backend"
        ],
        "isBestseller": true
    },
    {
        "id": 6,
        "title": "Học Sâu & Mạng Thần Kinh Nhân Tạo (Deep Learning)",
        "author": "Ian Goodfellow & Yoshua Bengio",
        "category": "tech",
        "categoryName": "Công Nghệ & AI",
        "price": 340000,
        "oldPrice": 400000,
        "rating": 4.8,
        "reviewsCount": 160,
        "discount": 15,
        "image": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80",
        "description": "Giáo trình nền tảng và toàn diện nhất về Deep Learning, từ toán học tối ưu, CNN, RNN cho đến Transformer và các mô hình thị giác máy tính hiện đại.",
        "tags": [
            "deep learning",
            "ai",
            "mạng nơ-ron",
            "machine learning",
            "toán học"
        ],
        "isBestseller": false
    },
    {
        "id": 7,
        "title": "Python Cho Khoa Học Dữ Liệu & Machine Learning",
        "author": "Wes McKinney",
        "category": "tech",
        "categoryName": "Công Nghệ & AI",
        "price": 225000,
        "oldPrice": 270000,
        "rating": 4.8,
        "reviewsCount": 185,
        "discount": 17,
        "image": "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80",
        "description": "Sách viết bởi chính cha đẻ của thư viện Pandas, hướng dẫn làm chủ phân tích dữ liệu, xử lý bảng dữ liệu lớn, trực quan hóa và mô hình hóa dự đoán.",
        "tags": [
            "python",
            "data science",
            "pandas",
            "dữ liệu",
            "machine learning"
        ],
        "isBestseller": false
    },
    {
        "id": 8,
        "title": "DevOps Toàn Thư: Docker, Kubernetes & CI/CD",
        "author": "John Willis & Gene Kim",
        "category": "tech",
        "categoryName": "Công Nghệ & AI",
        "price": 245000,
        "oldPrice": 290000,
        "rating": 4.7,
        "reviewsCount": 110,
        "discount": 16,
        "image": "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80",
        "description": "Bí quyết tự động hóa quy trình phân phối phần mềm, triển khai container hóa với Docker và điều phối cụm Kubernetes an toàn, ổn định.",
        "tags": [
            "devops",
            "docker",
            "kubernetes",
            "ci/cd",
            "hạ tầng",
            "cloud"
        ],
        "isBestseller": false
    },
    {
        "id": 9,
        "title": "Kỹ Nghệ Prompt & Làm Chủ Generative AI",
        "author": "Nguyễn Thế Anh",
        "category": "tech",
        "categoryName": "Công Nghệ & AI",
        "price": 175000,
        "oldPrice": 220000,
        "rating": 4.9,
        "reviewsCount": 320,
        "discount": 20,
        "image": "images/book_ai.png",
        "description": "Bí kíp tối ưu tương tác cùng các mô hình ngôn ngữ lớn (LLM), tự động hóa công việc văn phòng, lập trình và sáng tạo nội dung hiệu suất cao.",
        "tags": [
            "prompt",
            "ai",
            "chatgpt",
            "llm",
            "generative ai",
            "công nghệ"
        ],
        "isBestseller": true
    },
    {
        "id": 10,
        "title": "An Toàn Thông Tin & Hacker Mũ Trắng",
        "author": "Peter Kim",
        "category": "tech",
        "categoryName": "Công Nghệ & AI",
        "price": 230000,
        "oldPrice": 280000,
        "rating": 4.8,
        "reviewsCount": 145,
        "discount": 18,
        "image": "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80",
        "description": "Tìm hiểu phương thức phòng thủ và kiểm thử xâm nhập bảo mật mạng (Penetration Testing), lỗ hổng Web OWASP và kỹ thuật bảo vệ hệ thống.",
        "tags": [
            "bảo mật",
            "security",
            "hacker mũ trắng",
            "cybersecurity",
            "mạng"
        ],
        "isBestseller": false
    },
    {
        "id": 11,
        "title": "Kiến Trúc Microservices Thực Chiến",
        "author": "Sam Newman",
        "category": "tech",
        "categoryName": "Công Nghệ & AI",
        "price": 280000,
        "oldPrice": 330000,
        "rating": 4.8,
        "reviewsCount": 95,
        "discount": 15,
        "image": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
        "description": "Cách chia nhỏ kiến trúc nguyên khối (Monolith) thành các vi dịch vụ độc lập, quản lý dữ liệu phân tán và giám sát hạ tầng hiệu quả.",
        "tags": [
            "microservices",
            "kiến trúc",
            "hệ thống",
            "backend",
            "cloud"
        ],
        "isBestseller": false
    },
    {
        "id": 12,
        "title": "Cấu Trúc Dữ Liệu & Giải Thuật Kinh Điển",
        "author": "Thomas H. Cormen",
        "category": "tech",
        "categoryName": "Công Nghệ & AI",
        "price": 310000,
        "oldPrice": 370000,
        "rating": 4.9,
        "reviewsCount": 260,
        "discount": 16,
        "image": "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&w=600&q=80",
        "description": "Bộ giáo trình thuật toán đồ thị, quy hoạch động, cây nhị phân và độ phức tạp tính toán O(n) bắt buộc phải nắm vững cho kỹ sư phần mềm.",
        "tags": [
            "thuật toán",
            "giải thuật",
            "cấu trúc dữ liệu",
            "algorithm",
            "lập trình"
        ],
        "isBestseller": false
    },
    {
        "id": 13,
        "title": "Blockchain & Tương Lai Tài Chính Phi Tập Trung",
        "author": "Don Tapscott & Alex Tapscott",
        "category": "tech",
        "categoryName": "Công Nghệ & AI",
        "price": 195000,
        "oldPrice": 240000,
        "rating": 4.6,
        "reviewsCount": 88,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1512045482940-f37f5216f639?auto=format&fit=crop&w=600&q=80",
        "description": "Giải thích cơ chế vận hành của công nghệ chuỗi khối (Blockchain), hợp đồng thông minh (Smart Contract) và tiềm năng định hình lại nền kinh tế.",
        "tags": [
            "blockchain",
            "web3",
            "crypto",
            "công nghệ",
            "tài chính phi tập trung"
        ],
        "isBestseller": false
    },
    {
        "id": 14,
        "title": "Design Patterns: Mẫu Thiết Kế Hướng Đối Tượng",
        "author": "Erich Gamma & Richard Helm",
        "category": "tech",
        "categoryName": "Công Nghệ & AI",
        "price": 275000,
        "oldPrice": 320000,
        "rating": 4.9,
        "reviewsCount": 340,
        "discount": 14,
        "image": "https://images.unsplash.com/photo-1510172951991-856a654063f9?auto=format&fit=crop&w=600&q=80",
        "description": "Bộ 23 mẫu thiết kế kinh điển giúp lập trình viên viết code có tính tái sử dụng cao, linh hoạt mở rộng và giải quyết tốt các bài toán kiến trúc.",
        "tags": [
            "design patterns",
            "oop",
            "hướng đối tượng",
            "lập trình",
            "phần mềm"
        ],
        "isBestseller": false
    },
    {
        "id": 15,
        "title": "Chuyển Đổi Số - Lược Khảo Cho Doanh Nghiệp 4.0",
        "author": "Jeanne Ross & Martin Mocker",
        "category": "tech",
        "categoryName": "Công Nghệ & AI",
        "price": 185000,
        "oldPrice": 220000,
        "rating": 4.7,
        "reviewsCount": 75,
        "discount": 16,
        "image": "https://images.unsplash.com/photo-1492052722242-2554d0e99e3a?auto=format&fit=crop&w=600&q=80",
        "description": "Chiến lược số hóa vận hành, xây dựng nền tảng dữ liệu và văn hóa doanh nghiệp đổi mới sáng tạo trong thời đại chuyển đổi số toàn cầu.",
        "tags": [
            "chuyển đổi số",
            "doanh nghiệp",
            "4.0",
            "quản trị",
            "công nghệ"
        ],
        "isBestseller": false
    },
    {
        "id": 16,
        "title": "Tư Duy Tiền Bạc & Tâm Lý Học Đầu Tư",
        "author": "Morgan Housel",
        "category": "business",
        "categoryName": "Kinh Tế & Đầu Tư",
        "price": 159000,
        "oldPrice": 195000,
        "rating": 4.9,
        "reviewsCount": 275,
        "discount": 18,
        "image": "images/book_finance.png",
        "description": "Sự thành công trong tài chính không hẳn là kiến thức chuyên môn mà nằm ở cách bạn kiểm soát cảm xúc, định kiến và thái độ đối với tiền bạc.",
        "tags": [
            "tiền bạc",
            "kinh tế",
            "đầu tư",
            "tài chính",
            "giàu có",
            "tâm lý"
        ],
        "isBestseller": true
    },
    {
        "id": 17,
        "title": "Khởi Nghiệp Tinh Gọn (The Lean Startup)",
        "author": "Eric Ries",
        "category": "business",
        "categoryName": "Kinh Tế & Đầu Tư",
        "price": 145000,
        "oldPrice": 180000,
        "rating": 4.8,
        "reviewsCount": 180,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80",
        "description": "Phương pháp tạo lập dự án kinh doanh linh hoạt, thử nghiệm sản phẩm khả dụng tối thiểu (MVP) để tối ưu chi phí và thích ứng thị trường.",
        "tags": [
            "khởi nghiệp",
            "startup",
            "kinh doanh",
            "quản trị",
            "mvp"
        ],
        "isBestseller": true
    },
    {
        "id": 18,
        "title": "Cha Giàu Cha Nghèo (Rich Dad Poor Dad)",
        "author": "Robert T. Kiyosaki",
        "category": "business",
        "categoryName": "Kinh Tế & Đầu Tư",
        "price": 125000,
        "oldPrice": 155000,
        "rating": 4.8,
        "reviewsCount": 890,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
        "description": "Cuốn sách thức tỉnh tư duy tài chính cá nhân, định nghĩa lại tài sản - tiêu sản và hướng dẫn cách để đồng tiền làm việc cho chính bạn.",
        "tags": [
            "cha giàu cha nghèo",
            "tài chính",
            "tiền bạc",
            "kinh tế",
            "đầu tư"
        ],
        "isBestseller": true
    },
    {
        "id": 19,
        "title": "Nhà Đầu Tư Thông Minh (The Intelligent Investor)",
        "author": "Benjamin Graham",
        "category": "business",
        "categoryName": "Kinh Tế & Đầu Tư",
        "price": 240000,
        "oldPrice": 295000,
        "rating": 4.9,
        "reviewsCount": 520,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
        "description": "Tác phẩm kinh điển về triết lý đầu tư giá trị, quản trị rủi ro danh mục và tâm lý ngài Thị Trường của người thầy vĩ đại của Warren Buffett.",
        "tags": [
            "đầu tư",
            "chứng khoán",
            "benjamin graham",
            "giá trị",
            "tài chính"
        ],
        "isBestseller": true
    },
    {
        "id": 20,
        "title": "Từ Tốt Đến Vĩ Đại (Good to Great)",
        "author": "Jim Collins",
        "category": "business",
        "categoryName": "Kinh Tế & Đầu Tư",
        "price": 175000,
        "oldPrice": 215000,
        "rating": 4.8,
        "reviewsCount": 310,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=600&q=80",
        "description": "Nghiên cứu sâu sắc lý giải vì sao một số công ty tạo ra bước nhảy vọt thần kỳ duy trì đỉnh cao hàng chục năm, trong khi những công ty khác thất bại.",
        "tags": [
            "quản trị",
            "lãnh đạo",
            "doanh nghiệp",
            "kinh doanh",
            "vĩ đại"
        ],
        "isBestseller": false
    },
    {
        "id": 21,
        "title": "Chiến Lược Đại Dương Xanh",
        "author": "W. Chan Kim & Renée Mauborgne",
        "category": "business",
        "categoryName": "Kinh Tế & Đầu Tư",
        "price": 165000,
        "oldPrice": 199000,
        "rating": 4.8,
        "reviewsCount": 240,
        "discount": 17,
        "image": "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80",
        "description": "Cách tạo ra khoảng trống thị trường chưa ai khai phá để vô hiệu hóa sự cạnh tranh, kiến tạo giá trị đột phá cho cả khách hàng lẫn doanh nghiệp.",
        "tags": [
            "chiến lược",
            "đại dương xanh",
            "marketing",
            "đổi mới",
            "kinh doanh"
        ],
        "isBestseller": false
    },
    {
        "id": 22,
        "title": "Dốc Hết Trái Tim - Hành Trình Xây Dựng Starbucks",
        "author": "Howard Schultz",
        "category": "business",
        "categoryName": "Kinh Tế & Đầu Tư",
        "price": 139000,
        "oldPrice": 170000,
        "rating": 4.7,
        "reviewsCount": 165,
        "discount": 18,
        "image": "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=600&q=80",
        "description": "Câu chuyện chân thực và đầy cảm hứng về hành trình biến chuỗi cà phê nhỏ Seattle thành đế chế toàn cầu bằng niềm đam mê và giá trị nhân văn.",
        "tags": [
            "starbucks",
            "khởi nghiệp",
            "kinh doanh",
            "thương hiệu",
            "cảm hứng"
        ],
        "isBestseller": false
    },
    {
        "id": 23,
        "title": "Đọc Vị Báo Cáo Tài Chính Doanh Nghiệp",
        "author": "Mary Buffett & David Clark",
        "category": "business",
        "categoryName": "Kinh Tế & Đầu Tư",
        "price": 148000,
        "oldPrice": 185000,
        "rating": 4.8,
        "reviewsCount": 195,
        "discount": 20,
        "image": "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80",
        "description": "Hướng dẫn đọc hiểu bảng cân đối kế toán, báo cáo lưu chuyển tiền tệ và báo cáo kết quả kinh doanh để phát hiện doanh nghiệp có lợi thế độc quyền.",
        "tags": [
            "báo cáo tài chính",
            "kế toán",
            "chứng khoán",
            "đầu tư",
            "phân tích"
        ],
        "isBestseller": false
    },
    {
        "id": 24,
        "title": "Lợi Thế Cạnh Tranh Bền Vững",
        "author": "Michael E. Porter",
        "category": "business",
        "categoryName": "Kinh Tế & Đầu Tư",
        "price": 215000,
        "oldPrice": 260000,
        "rating": 4.7,
        "reviewsCount": 130,
        "discount": 17,
        "image": "https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=600&q=80",
        "description": "Lý thuyết 5 lực lượng cạnh tranh và chiến lược chi phí thấp, khác biệt hóa sản phẩm giúp doanh nghiệp đứng vững trước mọi biến động thị trường.",
        "tags": [
            "cạnh tranh",
            "chiến lược",
            "kinh tế",
            "quản trị",
            "doanh nghiệp"
        ],
        "isBestseller": false
    },
    {
        "id": 25,
        "title": "Thịnh Vượng Tài Chính Tuổi 30",
        "author": "Go Deuk Seong",
        "category": "business",
        "categoryName": "Kinh Tế & Đầu Tư",
        "price": 115000,
        "oldPrice": 140000,
        "rating": 4.6,
        "reviewsCount": 280,
        "discount": 18,
        "image": "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80",
        "description": "Kế hoạch tài chính thiết thực cho người trẻ tuổi: tiết kiệm có kỷ luật, đầu tư tích lũy và xây dựng dòng tiền thụ động an toàn trước tuổi 30.",
        "tags": [
            "tài chính cá nhân",
            "tuổi 30",
            "tiết kiệm",
            "đầu tư",
            "tiền bạc"
        ],
        "isBestseller": false
    },
    {
        "id": 26,
        "title": "Kinh Tế Học Hài Hước (Freakonomics)",
        "author": "Steven D. Levitt & Stephen J. Dubner",
        "category": "business",
        "categoryName": "Kinh Tế & Đầu Tư",
        "price": 135000,
        "oldPrice": 165000,
        "rating": 4.7,
        "reviewsCount": 220,
        "discount": 18,
        "image": "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&w=600&q=80",
        "description": "Góc nhìn kinh tế học độc đáo bóc tách những hiện tượng đời thường kỳ lạ dưới lăng kính của các động cơ ngầm chi phối hành vi con người.",
        "tags": [
            "kinh tế học",
            "hành vi",
            "xã hội",
            "tư duy",
            "dữ liệu"
        ],
        "isBestseller": false
    },
    {
        "id": 27,
        "title": "Nguyên Tắc Để Thành Công (Principles)",
        "author": "Ray Dalio",
        "category": "business",
        "categoryName": "Kinh Tế & Đầu Tư",
        "price": 290000,
        "oldPrice": 350000,
        "rating": 4.9,
        "reviewsCount": 460,
        "discount": 17,
        "image": "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=600&q=80",
        "description": "Những nguyên tắc sống và làm việc trung thực tột độ giúp Ray Dalio đưa quỹ phòng hộ Bridgewater Associates trở thành quỹ đầu tư lớn nhất thế giới.",
        "tags": [
            "nguyên tắc",
            "ray dalio",
            "đầu tư",
            "quản trị",
            "thành công"
        ],
        "isBestseller": true
    },
    {
        "id": 28,
        "title": "Triệu Phú Bất Động Sản Tự Thân",
        "author": "Gary Keller",
        "category": "business",
        "categoryName": "Kinh Tế & Đầu Tư",
        "price": 180000,
        "oldPrice": 220000,
        "rating": 4.7,
        "reviewsCount": 140,
        "discount": 18,
        "image": "https://images.unsplash.com/photo-1588580000645-4562a6d2c839?auto=format&fit=crop&w=600&q=80",
        "description": "Mô hình và chiến lược đầu tư bất động sản an toàn, tạo lập dòng tiền cho thuê và gia tăng vốn gốc bài bản cho nhà đầu tư cá nhân.",
        "tags": [
            "bất động sản",
            "đầu tư",
            "nhà đất",
            "tài chính",
            "dòng tiền"
        ],
        "isBestseller": false
    },
    {
        "id": 29,
        "title": "Nghệ Thuật Bán Hàng Bậc Cao",
        "author": "Zig Ziglar",
        "category": "business",
        "categoryName": "Kinh Tế & Đầu Tư",
        "price": 140000,
        "oldPrice": 175000,
        "rating": 4.8,
        "reviewsCount": 310,
        "discount": 20,
        "image": "https://images.unsplash.com/photo-1525715843208-50592f114251?auto=format&fit=crop&w=600&q=80",
        "description": "Kỹ năng thuyết phục khách hàng xuất phát từ sự thấu hiểu, chân thành và tinh thần giải quyết vấn đề thực sự cho người mua.",
        "tags": [
            "bán hàng",
            "sales",
            "giao tiếp",
            "thuyết phục",
            "kinh doanh"
        ],
        "isBestseller": false
    },
    {
        "id": 30,
        "title": "Từ Không Đến Một (Zero to One)",
        "author": "Peter Thiel & Blake Masters",
        "category": "business",
        "categoryName": "Kinh Tế & Đầu Tư",
        "price": 149000,
        "oldPrice": 180000,
        "rating": 4.8,
        "reviewsCount": 390,
        "discount": 17,
        "image": "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=80",
        "description": "Triết lý công nghệ đổi mới: đừng sao chép cái đã có để đi từ 1 đến n, hãy sáng tạo cái mới chưa từng có để đi từ 0 đến 1 và độc quyền sáng tạo.",
        "tags": [
            "zero to one",
            "khởi nghiệp",
            "đổi mới",
            "startup",
            "công nghệ"
        ],
        "isBestseller": true
    },
    {
        "id": 31,
        "title": "Thói Quen Nguyên Tử: Thay Đổi Nhỏ, Kết Quả Đột Phá",
        "author": "James Clear",
        "category": "self-help",
        "categoryName": "Tâm Lý & Kỹ Năng",
        "price": 135000,
        "oldPrice": 169000,
        "rating": 4.9,
        "reviewsCount": 680,
        "discount": 20,
        "image": "images/book_habits.png",
        "description": "Cuốn sách hướng dẫn bạn cách từng bước thiết lập những thói quen tốt và loại bỏ thói quen xấu bằng nguyên lý tích tiểu thành đại 1% mỗi ngày.",
        "tags": [
            "thói quen",
            "kỹ năng",
            "phát triển bản thân",
            "năng suất",
            "thành công"
        ],
        "isBestseller": true
    },
    {
        "id": 32,
        "title": "Đắc Nhân Tâm - Nghệ Thuật Giao Tiếp & Ứng Xử",
        "author": "Dale Carnegie",
        "category": "self-help",
        "categoryName": "Tâm Lý & Kỹ Năng",
        "price": 99000,
        "oldPrice": 120000,
        "rating": 4.9,
        "reviewsCount": 1520,
        "discount": 17,
        "image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
        "description": "Cuốn sách bán chạy nhất mọi thời đại về nghệ thuật ứng xử, lắng nghe, thu phục lòng người và xây dựng các mối quan hệ chân thành.",
        "tags": [
            "đắc nhân tâm",
            "giao tiếp",
            "ứng xử",
            "kỹ năng sống",
            "thành công"
        ],
        "isBestseller": true
    },
    {
        "id": 33,
        "title": "Hiểu Về Trái Tim - Nghệ Thuật Chữa Lành",
        "author": "Thầy Minh Niệm",
        "category": "self-help",
        "categoryName": "Tâm Lý & Kỹ Năng",
        "price": 145000,
        "oldPrice": 175000,
        "rating": 4.9,
        "reviewsCount": 840,
        "discount": 17,
        "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
        "description": "Tác phẩm chữa lành tâm hồn kinh điển giúp bạn thấu hiểu cơn giận, nỗi sợ, sự tha thứ và tình thương đích thực để sống trọn vẹn an lạc.",
        "tags": [
            "hiểu về trái tim",
            "chữa lành",
            "tâm linh",
            "an yên",
            "minh niệm"
        ],
        "isBestseller": true
    },
    {
        "id": 34,
        "title": "Đi Tìm Lẽ Sống (Man's Search for Meaning)",
        "author": "Viktor E. Frankl",
        "category": "self-help",
        "categoryName": "Tâm Lý & Kỹ Năng",
        "price": 105000,
        "oldPrice": 130000,
        "rating": 4.9,
        "reviewsCount": 430,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80",
        "description": "Ghi chép phi thường của một bác sĩ tâm thần sống sót qua trại tập trung Đức Quốc Xã, khám phá ra ý nghĩa bất diệt của cuộc sống trong nghịch cảnh.",
        "tags": [
            "lẽ sống",
            "nghị lực",
            "tâm lý học",
            "ý nghĩa cuộc sống",
            "sức mạnh"
        ],
        "isBestseller": true
    },
    {
        "id": 35,
        "title": "Tư Duy Nhanh Và Chậm (Thinking, Fast and Slow)",
        "author": "Daniel Kahneman",
        "category": "self-help",
        "categoryName": "Tâm Lý & Kỹ Năng",
        "price": 215000,
        "oldPrice": 260000,
        "rating": 4.8,
        "reviewsCount": 390,
        "discount": 17,
        "image": "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80",
        "description": "Tác phẩm đoạt giải Nobel Kinh tế giải mã hai hệ thống tư duy chi phối mọi quyết định: Hệ thống 1 (trực giác nhanh) và Hệ thống 2 (suy luận chậm).",
        "tags": [
            "tư duy",
            "tâm lý học",
            "nhận thức",
            "kahneman",
            "quyết định"
        ],
        "isBestseller": false
    },
    {
        "id": 36,
        "title": "Nghệ Thuật Tinh Tế Của Việc 'Đếch' Quan Tâm",
        "author": "Mark Manson",
        "category": "self-help",
        "categoryName": "Tâm Lý & Kỹ Năng",
        "price": 110000,
        "oldPrice": 135000,
        "rating": 4.7,
        "reviewsCount": 570,
        "discount": 18,
        "image": "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80",
        "description": "Cách tiếp cận ngược dòng hài hước giúp bạn ngừng bận tâm về những điều vớ vẩn và tập trung năng lượng vào những điều thực sự có ý nghĩa.",
        "tags": [
            "tinh tế",
            "buông bỏ",
            "tâm lý",
            "kỹ năng",
            "tự do"
        ],
        "isBestseller": true
    },
    {
        "id": 37,
        "title": "Dám Bị Ghét - Can Đảm Để Được Hạnh Phúc",
        "author": "Kishimi Ichiro & Koga Fumitake",
        "category": "self-help",
        "categoryName": "Tâm Lý & Kỹ Năng",
        "price": 128000,
        "oldPrice": 155000,
        "rating": 4.8,
        "reviewsCount": 710,
        "discount": 17,
        "image": "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
        "description": "Cuộc đối thoại giữa chàng thanh niên và triết gia dựa trên tâm lý học Adler: giải phóng bản thân khỏi ánh nhìn người khác để sống tự do.",
        "tags": [
            "dám bị ghét",
            "tâm lý học adler",
            "hạnh phúc",
            "tự do",
            "dũng cảm"
        ],
        "isBestseller": true
    },
    {
        "id": 38,
        "title": "Sức Mạnh Của Hiện Tại (The Power of Now)",
        "author": "Eckhart Tolle",
        "category": "self-help",
        "categoryName": "Tâm Lý & Kỹ Năng",
        "price": 130000,
        "oldPrice": 160000,
        "rating": 4.9,
        "reviewsCount": 480,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
        "description": "Cẩm nang giác ngộ tâm linh giúp bạn vượt qua nỗi đau quá khứ và sự lo lắng tương lai để sống trọn vẹn từng khoảnh khắc hiện tại.",
        "tags": [
            "hiện tại",
            "tỉnh thức",
            "chánh niệm",
            "thiền",
            "tâm an"
        ],
        "isBestseller": false
    },
    {
        "id": 39,
        "title": "Không Diệt Không Sinh Đừng Sợ Hãi",
        "author": "Thiền sư Thích Nhất Hạnh",
        "category": "self-help",
        "categoryName": "Tâm Lý & Kỹ Năng",
        "price": 95000,
        "oldPrice": 120000,
        "rating": 4.9,
        "reviewsCount": 620,
        "discount": 21,
        "image": "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=600&q=80",
        "description": "Lời chỉ dẫn sâu sắc xoa dịu nỗi đau mất mát, giúp chúng ta nhìn sâu vào bản chất của sinh tử để tìm thấy bình an tuyệt đối trong tâm.",
        "tags": [
            "thích nhất hạnh",
            "chánh niệm",
            "bình an",
            "thiền định",
            "chữa lành"
        ],
        "isBestseller": false
    },
    {
        "id": 40,
        "title": "Deep Work - Làm Ra Làm Chơi Ra Chơi",
        "author": "Cal Newport",
        "category": "self-help",
        "categoryName": "Tâm Lý & Kỹ Năng",
        "price": 142000,
        "oldPrice": 175000,
        "rating": 4.8,
        "reviewsCount": 320,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=600&q=80",
        "description": "Quy tắc rèn luyện khả năng tập trung cao độ không xao nhãng trong một thế giới tràn ngập thông báo và mạng xã hội.",
        "tags": [
            "deep work",
            "tập trung",
            "năng suất",
            "kỹ năng",
            "thành công"
        ],
        "isBestseller": false
    },
    {
        "id": 41,
        "title": "Thao Túng Tâm Lý - Nhận Diện Và Vượt Qua",
        "author": "Shannon Thomas",
        "category": "self-help",
        "categoryName": "Tâm Lý & Kỹ Năng",
        "price": 138000,
        "oldPrice": 170000,
        "rating": 4.7,
        "reviewsCount": 290,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80",
        "description": "Nhận diện những hành vi lạm dụng tâm lý ngấm ngầm (gaslighting, ái kỷ) và xây dựng ranh giới lành mạnh để bảo vệ tinh thần.",
        "tags": [
            "thao túng",
            "tâm lý học",
            "mối quan hệ",
            "chữa lành",
            "bảo vệ"
        ],
        "isBestseller": true
    },
    {
        "id": 42,
        "title": "Trí Tuệ Cảm Xúc (EQ 2.0)",
        "author": "Travis Bradberry & Jean Greaves",
        "category": "self-help",
        "categoryName": "Tâm Lý & Kỹ Năng",
        "price": 125000,
        "oldPrice": 155000,
        "rating": 4.8,
        "reviewsCount": 230,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1510172951991-856a654063f9?auto=format&fit=crop&w=600&q=80",
        "description": "Khám phá và nâng cao chỉ số EQ: tự nhận thức, tự quản lý, nhận thức xã hội và quản lý mối quan hệ để bứt phá trong sự nghiệp.",
        "tags": [
            "eq",
            "trí tuệ cảm xúc",
            "giao tiếp",
            "lãnh đạo",
            "kỹ năng"
        ],
        "isBestseller": false
    },
    {
        "id": 43,
        "title": "Muôn Kiếp Nhân Sinh (Tập 1 & 2)",
        "author": "Nguyên Phong",
        "category": "self-help",
        "categoryName": "Tâm Lý & Kỹ Năng",
        "price": 260000,
        "oldPrice": 320000,
        "rating": 4.9,
        "reviewsCount": 950,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80",
        "description": "Bức tranh toàn cảnh về luật nhân quả, tiền kiếp và luân hồi thông qua những trải nghiệm tâm linh kỳ lạ của một doanh nhân phố Wall.",
        "tags": [
            "muôn kiếp nhân sinh",
            "nhân quả",
            "luân hồi",
            "tâm linh",
            "nguyên phong"
        ],
        "isBestseller": true
    },
    {
        "id": 44,
        "title": "Quẳng Gánh Lo Đi Và Vui Sống",
        "author": "Dale Carnegie",
        "category": "self-help",
        "categoryName": "Tâm Lý & Kỹ Năng",
        "price": 98000,
        "oldPrice": 120000,
        "rating": 4.8,
        "reviewsCount": 670,
        "discount": 18,
        "image": "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80",
        "description": "Những lời khuyên thực tế giúp bạn đập tan nỗi sợ hãi, lo âu trong công việc và cuộc sống để tận hưởng trọn vẹn từng ngày an vui.",
        "tags": [
            "quẳng gánh lo",
            "dale carnegie",
            "vui sống",
            "an yên",
            "hạnh phúc"
        ],
        "isBestseller": false
    },
    {
        "id": 45,
        "title": "Tâm Lý Học Hành Vi - Đọc Vị Bất Kỳ Ai",
        "author": "David J. Lieberman",
        "category": "self-help",
        "categoryName": "Tâm Lý & Kỹ Năng",
        "price": 115000,
        "oldPrice": 140000,
        "rating": 4.7,
        "reviewsCount": 380,
        "discount": 18,
        "image": "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80",
        "description": "Cách nắm bắt tâm lý, nhận biết lời nói dối và suy nghĩ ngầm của đối phương thông qua ngôn ngữ cơ thể và tín hiệu phi ngôn ngữ.",
        "tags": [
            "đọc vị",
            "tâm lý học",
            "ngôn ngữ cơ thể",
            "giao tiếp",
            "hành vi"
        ],
        "isBestseller": false
    },
    {
        "id": 46,
        "title": "Rừng Na Uy - Kiệt Tác Văn Học Nhật Bản",
        "author": "Haruki Murakami",
        "category": "literature",
        "categoryName": "Văn Học & Tiểu Thuyết",
        "price": 128000,
        "oldPrice": 160000,
        "rating": 4.8,
        "reviewsCount": 512,
        "discount": 20,
        "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
        "description": "Một tiểu thuyết trầm lắng, hoài niệm về tuổi trẻ, tình yêu và nỗi cô đơn sâu thẳm giữa lòng thế giới hiện đại bận rộn.",
        "tags": [
            "văn học",
            "tiểu thuyết",
            "rừng na uy",
            "murakami",
            "nhật bản",
            "tình yêu"
        ],
        "isBestseller": true
    },
    {
        "id": 47,
        "title": "Nhà Giả Kim (The Alchemist)",
        "author": "Paulo Coelho",
        "category": "literature",
        "categoryName": "Văn Học & Tiểu Thuyết",
        "price": 89000,
        "oldPrice": 110000,
        "rating": 4.9,
        "reviewsCount": 1820,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80",
        "description": "Hành trình đi tìm kho báu của chàng chăn cừu Santiago gửi gắm thông điệp bất hủ: 'Khi bạn khao khát một điều gì, cả vũ trụ sẽ chung sức giúp bạn'.",
        "tags": [
            "nhà giả kim",
            "paulo coelho",
            "tiểu thuyết",
            "giấc mơ",
            "văn học"
        ],
        "isBestseller": true
    },
    {
        "id": 48,
        "title": "Bắt Trẻ Đồng Xanh (The Catcher in the Rye)",
        "author": "J.D. Salinger",
        "category": "literature",
        "categoryName": "Văn Học & Tiểu Thuyết",
        "price": 98000,
        "oldPrice": 120000,
        "rating": 4.7,
        "reviewsCount": 420,
        "discount": 18,
        "image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
        "description": "Lời tự thuật nổi loạn, chân thật và đầy cô đơn của cậu thiếu niên Holden Caulfield chống lại thói đạo đức giả của thế giới người lớn.",
        "tags": [
            "bắt trẻ đồng xanh",
            "kinh điển",
            "tiểu thuyết",
            "tuổi trẻ",
            "nổi loạn"
        ],
        "isBestseller": false
    },
    {
        "id": 49,
        "title": "Chiến Tranh Và Hòa Bình",
        "author": "Lev Tolstoy",
        "category": "literature",
        "categoryName": "Văn Học & Tiểu Thuyết",
        "price": 320000,
        "oldPrice": 380000,
        "rating": 4.9,
        "reviewsCount": 290,
        "discount": 16,
        "image": "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80",
        "description": "Bộ đại tiểu thuyết sử thi tái hiện bức tranh hoành tráng về lịch sử nước Nga thời kỳ Napoleon và số phận bi tráng của các dòng họ quý tộc.",
        "tags": [
            "tolstoy",
            "chiến tranh và hòa bình",
            "văn học nga",
            "kinh điển"
        ],
        "isBestseller": false
    },
    {
        "id": 50,
        "title": "Số Đỏ - Kiệt Tác Trào Phúng Việt Nam",
        "author": "Vũ Trọng Phụng",
        "category": "literature",
        "categoryName": "Văn Học & Tiểu Thuyết",
        "price": 85000,
        "oldPrice": 105000,
        "rating": 4.9,
        "reviewsCount": 650,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80",
        "description": "Tiểu thuyết trào phúng đỉnh cao của văn học Việt Nam về bước đường thăng tiến kệch cỡm của Xuân Tóc Đỏ giữa xã hội Âu hóa nửa mùa.",
        "tags": [
            "số đỏ",
            "vũ trọng phụng",
            "văn học việt nam",
            "trào phúng",
            "kinh điển"
        ],
        "isBestseller": true
    },
    {
        "id": 51,
        "title": "Nỗi Buồn Chiến Tranh",
        "author": "Bảo Ninh",
        "category": "literature",
        "categoryName": "Văn Học & Tiểu Thuyết",
        "price": 110000,
        "oldPrice": 135000,
        "rating": 4.9,
        "reviewsCount": 380,
        "discount": 19,
        "image": "images/book_phicong.png",
        "description": "Tác phẩm văn học chiến tranh đoạt nhiều giải thưởng quốc tế, khắc họa vết thương lòng ám ảnh khôn nguôi của người lính sau bom đạn.",
        "tags": [
            "bảo ninh",
            "chiến tranh",
            "văn học việt nam",
            "hồi ức",
            "nỗi buồn"
        ],
        "isBestseller": false
    },
    {
        "id": 52,
        "title": "Trăm Năm Cô Đơn (One Hundred Years of Solitude)",
        "author": "Gabriel García Márquez",
        "category": "literature",
        "categoryName": "Văn Học & Tiểu Thuyết",
        "price": 195000,
        "oldPrice": 240000,
        "rating": 4.9,
        "reviewsCount": 540,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
        "description": "Đỉnh cao của chủ nghĩa hiện thực huyền ảo kể về lịch sử bảy thế hệ dòng họ Buendía tại ngôi làng thần tiên Macondo.",
        "tags": [
            "trăm năm cô đơn",
            "marquez",
            "hiện thực huyền ảo",
            "nobel",
            "văn học"
        ],
        "isBestseller": true
    },
    {
        "id": 53,
        "title": "Tội Ác Và Hình Phạt",
        "author": "Fyodor Dostoevsky",
        "category": "literature",
        "categoryName": "Văn Học & Tiểu Thuyết",
        "price": 210000,
        "oldPrice": 255000,
        "rating": 4.9,
        "reviewsCount": 460,
        "discount": 18,
        "image": "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&w=600&q=80",
        "description": "Cuộc đấu tranh tâm lý dữ dội và quá trình sám hối chuộc tội của chàng sinh viên nghèo Raskolnikov sau khi phạm tội sát nhân.",
        "tags": [
            "tội ác và hình phạt",
            "dostoevsky",
            "văn học nga",
            "tâm lý học",
            "kinh điển"
        ],
        "isBestseller": false
    },
    {
        "id": 54,
        "title": "Ông Già Và Biển Cả",
        "author": "Ernest Hemingway",
        "category": "literature",
        "categoryName": "Văn Học & Tiểu Thuyết",
        "price": 75000,
        "oldPrice": 95000,
        "rating": 4.8,
        "reviewsCount": 780,
        "discount": 21,
        "image": "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80",
        "description": "Khúc ca tráng lệ về ý chí kiên cường bất khuất của con người: 'Con người có thể bị hủy diệt nhưng không thể bị đánh bại'.",
        "tags": [
            "hemingway",
            "ông già và biển cả",
            "nobel",
            "nghị lực",
            "kinh điển"
        ],
        "isBestseller": false
    },
    {
        "id": 55,
        "title": "Người Đua Diều (The Kite Runner)",
        "author": "Khaled Hosseini",
        "category": "literature",
        "categoryName": "Văn Học & Tiểu Thuyết",
        "price": 135000,
        "oldPrice": 165000,
        "rating": 4.9,
        "reviewsCount": 620,
        "discount": 18,
        "image": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
        "description": "Câu chuyện cảm động nghẹn ngào về tình bạn, lòng phản bội và con đường chuộc lỗi trải dài qua nhiều biến cố lịch sử tại Afghanistan.",
        "tags": [
            "người đua diều",
            "tình bạn",
            "tiểu thuyết",
            "xúc động",
            "chuộc lỗi"
        ],
        "isBestseller": true
    },
    {
        "id": 56,
        "title": "Tiệm Tạp Hóa Namiya Diệu Kỳ",
        "author": "Keigo Higashino",
        "category": "literature",
        "categoryName": "Văn Học & Tiểu Thuyết",
        "price": 125000,
        "oldPrice": 155000,
        "rating": 4.9,
        "reviewsCount": 890,
        "discount": 19,
        "image": "images/book_tiemgiat.png",
        "description": "Một lá thư gửi vào hộp thư cũ vượt qua không thời gian, kết nối những số phận cô đơn và trao gửi những lời khuyên ấm áp chữa lành.",
        "tags": [
            "namiya",
            "higashino keigo",
            "nhật bản",
            "chữa lành",
            "kỳ ảo"
        ],
        "isBestseller": true
    },
    {
        "id": 57,
        "title": "Phía Sau Nghi Can X",
        "author": "Keigo Higashino",
        "category": "literature",
        "categoryName": "Văn Học & Tiểu Thuyết",
        "price": 118000,
        "oldPrice": 145000,
        "rating": 4.9,
        "reviewsCount": 750,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=600&q=80",
        "description": "Cuộc đấu trí nghẹt thở giữa thiên tài toán học và nhà vật lý học đại tài trong một vụ án mạng vì tình yêu sâu sắc tột cùng.",
        "tags": [
            "trinh thám",
            "nghi can x",
            "keigo",
            "toán học",
            "hồi hộp"
        ],
        "isBestseller": true
    },
    {
        "id": 58,
        "title": "Mắt Biếc",
        "author": "Nguyễn Nhật Ánh",
        "category": "literature",
        "categoryName": "Văn Học & Tiểu Thuyết",
        "price": 110000,
        "oldPrice": 135000,
        "rating": 4.9,
        "reviewsCount": 1100,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80",
        "description": "Mối tình đơn phương trong veo, day dứt và đẹp buồn của thầy giáo Ngạn dành cho Hà Lan dưới bóng râm làng Đo Đo thuở ấu thơ.",
        "tags": [
            "mắt biếc",
            "nguyễn nhật ánh",
            "tình yêu",
            "tuổi thơ",
            "làng đo đo"
        ],
        "isBestseller": true
    },
    {
        "id": 59,
        "title": "Tôi Thấy Hoa Vàng Trên Cỏ Xanh",
        "author": "Nguyễn Nhật Ánh",
        "category": "literature",
        "categoryName": "Văn Học & Tiểu Thuyết",
        "price": 105000,
        "oldPrice": 130000,
        "rating": 4.9,
        "reviewsCount": 920,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80",
        "description": "Những trang nhật ký tuổi thơ miền quê nghèo với tình anh em, sự ghen tị trẻ con và tình bạn thuở thiếu thời ngọt ngào lắng đọng.",
        "tags": [
            "hoa vàng trên cỏ xanh",
            "tuổi thơ",
            "nguyễn nhật ánh",
            "đồng quê"
        ],
        "isBestseller": true
    },
    {
        "id": 60,
        "title": "Chuông Nguyện Hồn Ai",
        "author": "Ernest Hemingway",
        "category": "literature",
        "categoryName": "Văn Học & Tiểu Thuyết",
        "price": 170000,
        "oldPrice": 210000,
        "rating": 4.8,
        "reviewsCount": 310,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1510172951991-856a654063f9?auto=format&fit=crop&w=600&q=80",
        "description": "Bản anh hùng ca về cuộc chiến đấu chống phát xít tại Tây Ban Nha của người lính tình nguyện Robert Jordan bên cây cầu định mệnh.",
        "tags": [
            "chuông nguyện hồn ai",
            "hemingway",
            "chiến tranh",
            "tình yêu",
            "kinh điển"
        ],
        "isBestseller": false
    },
    {
        "id": 61,
        "title": "Sapiens: Lược Sử Loài Người",
        "author": "Yuval Noah Harari",
        "category": "history",
        "categoryName": "Lịch Sử & Triết Học",
        "price": 198000,
        "oldPrice": 250000,
        "rating": 5,
        "reviewsCount": 1420,
        "discount": 21,
        "image": "https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=600&q=80",
        "description": "Kiệt tác toàn cầu tái hiện hành trình tiến hóa của Homo Sapiens từ loài vượn người vô danh thành kẻ thống trị hành tinh nhờ khả năng hư cấu.",
        "tags": [
            "sapiens",
            "lịch sử",
            "loài người",
            "tiến hóa",
            "harari",
            "triết học"
        ],
        "isBestseller": true
    },
    {
        "id": 62,
        "title": "Homo Deus: Lược Sử Tương Lai",
        "author": "Yuval Noah Harari",
        "category": "history",
        "categoryName": "Lịch Sử & Triết Học",
        "price": 195000,
        "oldPrice": 245000,
        "rating": 4.8,
        "reviewsCount": 680,
        "discount": 20,
        "image": "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=600&q=80",
        "description": "Khám phá tương lai khi con người làm chủ công nghệ sinh học và trí tuệ nhân tạo để theo đuổi sự bất tử và quyền năng của thánh thần.",
        "tags": [
            "homo deus",
            "tương lai",
            "ai",
            "sinh học",
            "lịch sử",
            "harari"
        ],
        "isBestseller": true
    },
    {
        "id": 63,
        "title": "21 Bài Học Cho Thế Kỷ 21",
        "author": "Yuval Noah Harari",
        "category": "history",
        "categoryName": "Lịch Sử & Triết Học",
        "price": 185000,
        "oldPrice": 230000,
        "rating": 4.8,
        "reviewsCount": 510,
        "discount": 20,
        "image": "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80",
        "description": "Nhìn thẳng vào những thách thức cấp bách nhất hiện nay: tin giả, chiến tranh hạt nhân, khủng hoảng khí hậu và sự trỗi dậy của thuật toán AI.",
        "tags": [
            "21 bài học",
            "thế kỷ 21",
            "xã hội",
            "chính trị",
            "triết học"
        ],
        "isBestseller": false
    },
    {
        "id": 64,
        "title": "Đại Việt Sử Ký Toàn Thư (Trọn Bộ)",
        "author": "Ngô Sĩ Liên & Quốc Sử Quán",
        "category": "history",
        "categoryName": "Lịch Sử & Triết Học",
        "price": 360000,
        "oldPrice": 450000,
        "rating": 4.9,
        "reviewsCount": 380,
        "discount": 20,
        "image": "https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80",
        "description": "Bộ quốc sử vĩ đại ghi chép toàn diện lịch sử dựng nước và giữ nước của dân tộc Việt Nam từ thời Hồng Bàng đến thời Hậu Lê.",
        "tags": [
            "sử việt",
            "đại việt",
            "lịch sử việt nam",
            "ngô sĩ liên",
            "kinh điển"
        ],
        "isBestseller": true
    },
    {
        "id": 65,
        "title": "Việt Nam Sử Lược",
        "author": "Trần Trọng Kim",
        "category": "history",
        "categoryName": "Lịch Sử & Triết Học",
        "price": 135000,
        "oldPrice": 165000,
        "rating": 4.8,
        "reviewsCount": 420,
        "discount": 18,
        "image": "https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&w=600&q=80",
        "description": "Cuốn sách thông sử Việt Nam viết bằng chữ quốc ngữ đầu tiên với văn phong mạch lạc, súc tích và góc nhìn công tâm, khách quan.",
        "tags": [
            "việt nam sử lược",
            "trần trọng kim",
            "lịch sử",
            "sử việt"
        ],
        "isBestseller": false
    },
    {
        "id": 66,
        "title": "Súng, Vi Trùng Và Thép",
        "author": "Jared Diamond",
        "category": "history",
        "categoryName": "Lịch Sử & Triết Học",
        "price": 215000,
        "oldPrice": 265000,
        "rating": 4.9,
        "reviewsCount": 620,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=600&q=80",
        "description": "Tác phẩm đoạt giải Pulitzer giải thích vì sao văn minh Á - Âu thống trị thế giới bằng các yếu tố môi trường địa lý chứ không phải ưu thế sinh học.",
        "tags": [
            "súng vi trùng và thép",
            "lịch sử",
            "địa lý",
            "nhân loại",
            "tiến hóa"
        ],
        "isBestseller": true
    },
    {
        "id": 67,
        "title": "Chủ Nghĩa Khắc Kỷ: Phong Cách Sống Bản Lĩnh",
        "author": "William B. Irvine",
        "category": "history",
        "categoryName": "Lịch Sử & Triết Học",
        "price": 145000,
        "oldPrice": 180000,
        "rating": 4.8,
        "reviewsCount": 390,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1588580000645-4562a6d2c839?auto=format&fit=crop&w=600&q=80",
        "description": "Ứng dụng triết học Stoicism vào cuộc sống hiện đại: thực hành tưởng tượng tiêu cực, kiểm soát cảm xúc và rèn luyện bản lĩnh trước nghịch cảnh.",
        "tags": [
            "khắc kỷ",
            "stoicism",
            "triết học",
            "bản lĩnh",
            "tâm trí"
        ],
        "isBestseller": true
    },
    {
        "id": 68,
        "title": "Trầm Tưởng (Meditations)",
        "author": "Marcus Aurelius",
        "category": "history",
        "categoryName": "Lịch Sử & Triết Học",
        "price": 120000,
        "oldPrice": 150000,
        "rating": 4.9,
        "reviewsCount": 580,
        "discount": 20,
        "image": "https://images.unsplash.com/photo-1525715843208-50592f114251?auto=format&fit=crop&w=600&q=80",
        "description": "Những dòng suy ngẫm nội tâm mộc mạc của vị hoàng đế La Mã vĩ đại về bổn phận, cái chết, phẩm hạnh và sự tự chủ trước biến thiên.",
        "tags": [
            "trầm tưởng",
            "marcus aurelius",
            "la mã",
            "triết học",
            "stoic"
        ],
        "isBestseller": true
    },
    {
        "id": 69,
        "title": "Lược Sử Triết Học Phương Tây",
        "author": "Bertrand Russell",
        "category": "history",
        "categoryName": "Lịch Sử & Triết Học",
        "price": 290000,
        "oldPrice": 350000,
        "rating": 4.8,
        "reviewsCount": 220,
        "discount": 17,
        "image": "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=80",
        "description": "Bộ toàn thư đồ sộ khảo cứu tư tưởng triết học từ thời Hy Lạp cổ đại (Socrates, Plato) đến thời kỳ cận - hiện đại của nhà toán học Russell.",
        "tags": [
            "triết học",
            "phương tây",
            "bertrand russell",
            "tư tưởng",
            "lịch sử"
        ],
        "isBestseller": false
    },
    {
        "id": 70,
        "title": "Sụp Đổ - Các Nền Văn Minh Thất Bại Ra Sao",
        "author": "Jared Diamond",
        "category": "history",
        "categoryName": "Lịch Sử & Triết Học",
        "price": 220000,
        "oldPrice": 270000,
        "rating": 4.7,
        "reviewsCount": 180,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1512045482940-f37f5216f639?auto=format&fit=crop&w=600&q=80",
        "description": "Bài học lịch sử đắt giá từ sự diệt vong của người Viking ở Greenland hay đảo Phục Sinh khi tàn phá môi trường sinh thái tự nhiên.",
        "tags": [
            "sụp đổ",
            "văn minh",
            "môi trường",
            "lịch sử",
            "jared diamond"
        ],
        "isBestseller": false
    },
    {
        "id": 71,
        "title": "Thế Giới Của Sophie",
        "author": "Jostein Gaarder",
        "category": "history",
        "categoryName": "Lịch Sử & Triết Học",
        "price": 155000,
        "oldPrice": 190000,
        "rating": 4.9,
        "reviewsCount": 650,
        "discount": 18,
        "image": "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80",
        "description": "Cuốn tiểu thuyết triết học ly kỳ dành cho mọi lứa tuổi, dẫn dắt cô bé Sophie khám phá những câu hỏi lớn nhất về nguồn gốc và ý nghĩa vũ trụ.",
        "tags": [
            "thế giới của sophie",
            "triết học",
            "tiểu thuyết",
            "khám phá",
            "tri thức"
        ],
        "isBestseller": true
    },
    {
        "id": 72,
        "title": "Bàn Về Khế Ước Xã Hội",
        "author": "Jean-Jacques Rousseau",
        "category": "history",
        "categoryName": "Lịch Sử & Triết Học",
        "price": 110000,
        "oldPrice": 135000,
        "rating": 4.7,
        "reviewsCount": 160,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=600&q=80",
        "description": "Tác phẩm kinh điển của thời kỳ Khai sáng đặt nền tảng cho lý thuyết chính trị hiện đại về chủ quyền nhân dân và quyền tự do công dân.",
        "tags": [
            "rousseau",
            "khế ước xã hội",
            "triết học chính trị",
            "khai sáng"
        ],
        "isBestseller": false
    },
    {
        "id": 73,
        "title": "Lược Sử Thời Gian: Từ Big Bang Đến Lỗ Đen",
        "author": "Stephen Hawking",
        "category": "science",
        "categoryName": "Khoa Học & Đời Sống",
        "price": 145000,
        "oldPrice": 180000,
        "rating": 4.9,
        "reviewsCount": 890,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80",
        "description": "Kiệt tác phổ biến khoa học vĩ đại nhất thế giới giải thích nguồn gốc vũ trụ, mũi tên thời gian và bản chất bí ẩn của lỗ đen.",
        "tags": [
            "khoa học",
            "vũ trụ",
            "hawking",
            "vật lý",
            "thời gian",
            "lỗ đen"
        ],
        "isBestseller": true
    },
    {
        "id": 74,
        "title": "Vũ Trụ (Cosmos)",
        "author": "Carl Sagan",
        "category": "science",
        "categoryName": "Khoa Học & Đời Sống",
        "price": 210000,
        "oldPrice": 260000,
        "rating": 4.9,
        "reviewsCount": 530,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
        "description": "Chuyến du hành 15 tỷ năm khám phá không gian và sự tiến hóa của nhận thức con người với áng văn chương trữ tình giàu chất thơ của Carl Sagan.",
        "tags": [
            "cosmos",
            "vũ trụ",
            "carl sagan",
            "thiên văn",
            "khoa học"
        ],
        "isBestseller": true
    },
    {
        "id": 75,
        "title": "Gen Vị Kỷ (The Selfish Gene)",
        "author": "Richard Dawkins",
        "category": "science",
        "categoryName": "Khoa Học & Đời Sống",
        "price": 195000,
        "oldPrice": 240000,
        "rating": 4.8,
        "reviewsCount": 370,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80",
        "description": "Góc nhìn đột phá về tiến hóa sinh học: sinh vật sống chỉ là cỗ máy sinh tồn tạm thời phục vụ cho mục tiêu nhân bản của các đoạn gen.",
        "tags": [
            "gen vị kỷ",
            "sinh học",
            "tiến hóa",
            "gen",
            "khoa học"
        ],
        "isBestseller": false
    },
    {
        "id": 76,
        "title": "Sao Chúng Ta Lại Ngủ: Sức Mạnh Diệu Kỳ Của Giấc Ngủ",
        "author": "Matthew Walker",
        "category": "science",
        "categoryName": "Khoa Học & Đời Sống",
        "price": 168000,
        "oldPrice": 210000,
        "rating": 4.9,
        "reviewsCount": 640,
        "discount": 20,
        "image": "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80",
        "description": "Nghiên cứu thần kinh học chứng minh vai trò sống còn của giấc ngủ đối với trí nhớ, hệ miễn dịch, tuổi thọ và sức khỏe tinh thần.",
        "tags": [
            "giấc ngủ",
            "sức khỏe",
            "thần kinh",
            "đời sống",
            "khoa học"
        ],
        "isBestseller": true
    },
    {
        "id": 77,
        "title": "Cơ Thể 4 Giờ: Bí Quyết Tối Ưu Sức Khỏe",
        "author": "Timothy Ferriss",
        "category": "science",
        "categoryName": "Khoa Học & Đời Sống",
        "price": 220000,
        "oldPrice": 275000,
        "rating": 4.7,
        "reviewsCount": 290,
        "discount": 20,
        "image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
        "description": "Hướng dẫn thực nghiệm sinh học cá nhân: giảm mỡ nhanh, tăng cơ, cải thiện giấc ngủ và đạt hiệu suất thể chất đỉnh cao với thời gian tối thiểu.",
        "tags": [
            "sức khỏe",
            "thể hình",
            "dinh dưỡng",
            "biohacking",
            "hiệu suất"
        ],
        "isBestseller": false
    },
    {
        "id": 78,
        "title": "Cuộc Sống Muôn Màu - Bí Mật Thế Giới Động Vật",
        "author": "David Attenborough",
        "category": "science",
        "categoryName": "Khoa Học & Đời Sống",
        "price": 180000,
        "oldPrice": 225000,
        "rating": 4.9,
        "reviewsCount": 210,
        "discount": 20,
        "image": "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80",
        "description": "Những câu chuyện sống động về hành vi sinh tồn, ngụy trang và giao tiếp kỳ lạ của muôn loài sinh vật trên khắp các lục địa và đại dương.",
        "tags": [
            "động vật",
            "thiên nhiên",
            "sinh thái",
            "sinh học",
            "khoa học"
        ],
        "isBestseller": false
    },
    {
        "id": 79,
        "title": "Ăn Gì Không Chết - Giải Mã Khoa Học Dinh Dưỡng",
        "author": "Dr. Michael Greger",
        "category": "science",
        "categoryName": "Khoa Học & Đời Sống",
        "price": 195000,
        "oldPrice": 240000,
        "rating": 4.8,
        "reviewsCount": 350,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80",
        "description": "Bằng chứng y khoa chứng minh chế độ dinh dưỡng thuần thực vật có thể ngăn ngừa và đảo ngược 15 nguyên nhân gây tử vong hàng đầu.",
        "tags": [
            "dinh dưỡng",
            "sức khỏe",
            "ăn lành",
            "y học",
            "phòng bệnh"
        ],
        "isBestseller": false
    },
    {
        "id": 80,
        "title": "7 Bài Học Vật Lý Cực Dễ Hiểu",
        "author": "Carlo Rovelli",
        "category": "science",
        "categoryName": "Khoa Học & Đời Sống",
        "price": 95000,
        "oldPrice": 120000,
        "rating": 4.8,
        "reviewsCount": 410,
        "discount": 21,
        "image": "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
        "description": "Cuốn sách nhỏ tinh gọn đưa người đọc đi qua thuyết tương đối rộng, cơ học lượng tử và lỗ đen bằng ngôn từ trong sáng như thơ.",
        "tags": [
            "vật lý",
            "rovelli",
            "lượng tử",
            "tương đối",
            "khoa học"
        ],
        "isBestseller": false
    },
    {
        "id": 81,
        "title": "Lược Sử Trái Đất Qua 4.5 Tỷ Năm",
        "author": "Peter Ward",
        "category": "science",
        "categoryName": "Khoa Học & Đời Sống",
        "price": 175000,
        "oldPrice": 215000,
        "rating": 4.8,
        "reviewsCount": 190,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1510172951991-856a654063f9?auto=format&fit=crop&w=600&q=80",
        "description": "Biên niên sử địa chất và các đại tuyệt chủng trong quá khứ giúp chúng ta thấu hiểu tương lai của hành tinh xanh.",
        "tags": [
            "địa chất",
            "trái đất",
            "khí hậu",
            "tuyệt chủng",
            "khoa học"
        ],
        "isBestseller": false
    },
    {
        "id": 82,
        "title": "Bộ Não Tự Chữa Lành Diệu Kỳ",
        "author": "Norman Doidge",
        "category": "science",
        "categoryName": "Khoa Học & Đời Sống",
        "price": 160000,
        "oldPrice": 200000,
        "rating": 4.8,
        "reviewsCount": 280,
        "discount": 20,
        "image": "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80",
        "description": "Khám phá hiện tượng dẻo não (Neuroplasticity): não bộ có khả năng tự tái cấu trúc các liên kết nơ-ron để phục hồi sau tổn thương.",
        "tags": [
            "não bộ",
            "thần kinh",
            "chữa lành",
            "y học",
            "khoa học"
        ],
        "isBestseller": false
    },
    {
        "id": 83,
        "title": "Cơ Thể Tự Chữa Lành - Y Học Trực Giác",
        "author": "Anthony William",
        "category": "science",
        "categoryName": "Khoa Học & Đời Sống",
        "price": 185000,
        "oldPrice": 230000,
        "rating": 4.7,
        "reviewsCount": 420,
        "discount": 20,
        "image": "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80",
        "description": "Giải pháp thanh lọc thải độc gan và phục hồi các chứng bệnh mãn tính bí ẩn bằng liệu pháp thực phẩm tự nhiên.",
        "tags": [
            "thải độc",
            "sức khỏe",
            "thực phẩm",
            "tự chữa lành",
            "y học"
        ],
        "isBestseller": false
    },
    {
        "id": 84,
        "title": "Trật Tự Của Thời Gian",
        "author": "Carlo Rovelli",
        "category": "science",
        "categoryName": "Khoa Học & Đời Sống",
        "price": 130000,
        "oldPrice": 160000,
        "rating": 4.8,
        "reviewsCount": 240,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
        "description": "Một khảo cứu triết học - vật lý sâu sắc: Thời gian có thực sự tồn tại, hay nó chỉ là một ảo ảnh sinh ra từ góc nhìn giới hạn của loài người?",
        "tags": [
            "thời gian",
            "vật lý lượng tử",
            "rovelli",
            "vũ trụ",
            "triết học"
        ],
        "isBestseller": false
    },
    {
        "id": 85,
        "title": "Hoàng Tử Bé (Le Petit Prince)",
        "author": "Antoine de Saint-Exupéry",
        "category": "children",
        "categoryName": "Thiếu Nhi & Tuổi Mới Lớn",
        "price": 75000,
        "oldPrice": 95000,
        "rating": 5,
        "reviewsCount": 2100,
        "discount": 21,
        "image": "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
        "description": "Câu chuyện ngụ ngôn tuyệt mỹ dành cho cả trẻ em lẫn người lớn: 'Người ta chỉ thấy rõ bằng trái tim, cái cốt yếu thì mắt thường không nhìn thấy được'.",
        "tags": [
            "hoàng tử bé",
            "thiếu nhi",
            "saint exupery",
            "tình bạn",
            "kinh điển"
        ],
        "isBestseller": true
    },
    {
        "id": 86,
        "title": "Dế Mèn Phiêu Lưu Ký",
        "author": "Tô Hoài",
        "category": "children",
        "categoryName": "Thiếu Nhi & Tuổi Mới Lớn",
        "price": 68000,
        "oldPrice": 85000,
        "rating": 4.9,
        "reviewsCount": 1650,
        "discount": 20,
        "image": "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
        "description": "Kiệt tác văn học thiếu nhi Việt Nam kể về hành trình vấp ngã, trưởng thành và khát vọng kết nghĩa bốn bể hòa bình của chú Dế Mèn.",
        "tags": [
            "dế mèn",
            "tô hoài",
            "văn học thiếu nhi",
            "phiêu lưu",
            "tuổi thơ"
        ],
        "isBestseller": true
    },
    {
        "id": 87,
        "title": "Góc Sân Và Khoảng Trời",
        "author": "Trần Đăng Khoa",
        "category": "children",
        "categoryName": "Thiếu Nhi & Tuổi Mới Lớn",
        "price": 65000,
        "oldPrice": 80000,
        "rating": 4.8,
        "reviewsCount": 420,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80",
        "description": "Tập thơ hồn nhiên, trong trẻo như hạt sương mai của 'thần đồng thơ ca' gắn liền với ký ức tuổi thơ làng quê Bắc Bộ.",
        "tags": [
            "thơ thiếu nhi",
            "trần đăng khoa",
            "tuổi thơ",
            "góc sân",
            "đồng quê"
        ],
        "isBestseller": false
    },
    {
        "id": 88,
        "title": "Những Tấm Lòng Cao Cả (Cuore)",
        "author": "Edmondo De Amicis",
        "category": "children",
        "categoryName": "Thiếu Nhi & Tuổi Mới Lớn",
        "price": 88000,
        "oldPrice": 110000,
        "rating": 4.9,
        "reviewsCount": 780,
        "discount": 20,
        "image": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80",
        "description": "Những bài học đạo đức xúc động lòng người về lòng nhân ái, sự hy sinh và tình thầy trò qua cuốn nhật ký của cậu bé Enrico.",
        "tags": [
            "tấm lòng cao cả",
            "giáo dục",
            "tình thầy trò",
            "nhân ái",
            "thiếu nhi"
        ],
        "isBestseller": true
    },
    {
        "id": 89,
        "title": "Chuyện Con Mèo Dạy Hải Âu Bay",
        "author": "Luis Sepúlveda",
        "category": "children",
        "categoryName": "Thiếu Nhi & Tuổi Mới Lớn",
        "price": 72000,
        "oldPrice": 90000,
        "rating": 4.9,
        "reviewsCount": 950,
        "discount": 20,
        "image": "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80",
        "description": "Câu chuyện cảm động về chú mèo mun Zorba giữ trọn 3 lời thề: ấp quả trứng hải âu, bảo vệ hải âu con và dạy nó sải cánh bay vào trời xanh.",
        "tags": [
            "mèo dạy hải âu bay",
            "lòng dũng cảm",
            "tình yêu thương",
            "thiếu nhi"
        ],
        "isBestseller": true
    },
    {
        "id": 90,
        "title": "Alice Ở Xứ Sở Thần Tiên",
        "author": "Lewis Carroll",
        "category": "children",
        "categoryName": "Thiếu Nhi & Tuổi Mới Lớn",
        "price": 82000,
        "oldPrice": 100000,
        "rating": 4.7,
        "reviewsCount": 510,
        "discount": 18,
        "image": "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80",
        "description": "Chuyến phiêu lưu kỳ ảo vượt khỏi mọi quy luật vật lý vào hang thỏ cùng chú Thỏ Trắng, Mèo Cheshire và Nữ Hoàng Cơ.",
        "tags": [
            "alice",
            "thần tiên",
            "kỳ ảo",
            "phiêu lưu",
            "thiếu nhi"
        ],
        "isBestseller": false
    },
    {
        "id": 91,
        "title": "Pippi Tất Dài Đến Từ Đảo Khỉ",
        "author": "Astrid Lindgren",
        "category": "children",
        "categoryName": "Thiếu Nhi & Tuổi Mới Lớn",
        "price": 85000,
        "oldPrice": 105000,
        "rating": 4.8,
        "reviewsCount": 390,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
        "description": "Cô bé tóc đỏ siêu khỏe, tự do và tinh nghịch nhất thế giới mang lại tiếng cười sảng khoái và lòng nhân ái cho trẻ em khắp hành tinh.",
        "tags": [
            "pippi",
            "hài hước",
            "thiếu nhi",
            "tự do",
            "tất dài"
        ],
        "isBestseller": false
    },
    {
        "id": 92,
        "title": "Đất Rừng Phương Nam",
        "author": "Đoàn Giỏi",
        "category": "children",
        "categoryName": "Thiếu Nhi & Tuổi Mới Lớn",
        "price": 95000,
        "oldPrice": 120000,
        "rating": 4.9,
        "reviewsCount": 820,
        "discount": 21,
        "image": "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80",
        "description": "Bức tranh thiên nhiên hào sảng, trù phú của rừng tràm U Minh và hành trình đi tìm cha đầy nghĩa khí của cậu bé An.",
        "tags": [
            "đất rừng phương nam",
            "đoàn giỏi",
            "nam bộ",
            "phiêu lưu",
            "văn học"
        ],
        "isBestseller": true
    },
    {
        "id": 93,
        "title": "Không Gia Đình (Sans Famille)",
        "author": "Hector Malot",
        "category": "children",
        "categoryName": "Thiếu Nhi & Tuổi Mới Lớn",
        "price": 135000,
        "oldPrice": 165000,
        "rating": 4.9,
        "reviewsCount": 910,
        "discount": 18,
        "image": "https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&w=600&q=80",
        "description": "Hành trình phiêu bạt khắp nước Pháp của chú bé mồ côi Rémi cùng gánh xiếc của cụ Vitalis với lòng trung thực và đức hy sinh cảm động.",
        "tags": [
            "không gia đình",
            "remi",
            "nghị lực",
            "kinh điển",
            "thiếu nhi"
        ],
        "isBestseller": true
    },
    {
        "id": 94,
        "title": "Cho Tôi Xin Một Vé Đi Tuổi Thơ",
        "author": "Nguyễn Nhật Ánh",
        "category": "children",
        "categoryName": "Thiếu Nhi & Tuổi Mới Lớn",
        "price": 99000,
        "oldPrice": 125000,
        "rating": 4.9,
        "reviewsCount": 1340,
        "discount": 21,
        "image": "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80",
        "description": "Tấm vé màu nhiệm đưa người lớn trở về với thế giới nghịch ngợm, ngây ngô và đầy ắp tiếng cười của cu Mùi, con Tủn, tí Sún.",
        "tags": [
            "tuổi thơ",
            "nguyễn nhật ánh",
            "hồn nhiên",
            "hài hước",
            "bán chạy"
        ],
        "isBestseller": true
    },
    {
        "id": 95,
        "title": "Câu Chuyện Nghệ Thuật (The Story of Art)",
        "author": "E.H. Gombrich",
        "category": "art-design",
        "categoryName": "Nghệ Thuật & Sáng Tạo",
        "price": 450000,
        "oldPrice": 550000,
        "rating": 5,
        "reviewsCount": 310,
        "discount": 18,
        "image": "https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=600&q=80",
        "description": "Cuốn sách nhập môn nghệ thuật thị giác kinh điển nhất thế giới, dẫn dắt lịch sử hội họa và điêu khắc từ thời tiền sử đến thế kỷ 20.",
        "tags": [
            "nghệ thuật",
            "hội họa",
            "gombrich",
            "lịch sử nghệ thuật",
            "sáng tạo"
        ],
        "isBestseller": true
    },
    {
        "id": 96,
        "title": "Nghệ Thuật Thị Giác & Ngôn Ngữ Thiết Kế",
        "author": "Ellen Lupton",
        "category": "art-design",
        "categoryName": "Nghệ Thuật & Sáng Tạo",
        "price": 210000,
        "oldPrice": 260000,
        "rating": 4.8,
        "reviewsCount": 145,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=600&q=80",
        "description": "Các nguyên tắc thị giác cơ bản: tỷ lệ vàng, lưới bố cục, màu sắc và kiểu chữ (Typography) dành cho designer và người làm sáng tạo.",
        "tags": [
            "thiết kế",
            "graphic design",
            "typography",
            "bố cục",
            "sáng tạo"
        ],
        "isBestseller": false
    },
    {
        "id": 97,
        "title": "Ăn Cắp Ý Tưởng Như Một Nghệ Sĩ",
        "author": "Austin Kleon",
        "category": "art-design",
        "categoryName": "Nghệ Thuật & Sáng Tạo",
        "price": 85000,
        "oldPrice": 105000,
        "rating": 4.8,
        "reviewsCount": 470,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=600&q=80",
        "description": "10 bí quyết giải phóng tiềm năng sáng tạo trong kỷ nguyên số: không có gì là hoàn toàn nguyên bản, hãy học hỏi tinh hoa để tạo nên phong cách riêng.",
        "tags": [
            "sáng tạo",
            "ý tưởng",
            "nghệ sĩ",
            "austin kleon",
            "cảm hứng"
        ],
        "isBestseller": true
    },
    {
        "id": 98,
        "title": "Lối Sống Tối Giản Của Người Nhật",
        "author": "Sasaki Fumio",
        "category": "art-design",
        "categoryName": "Nghệ Thuật & Sáng Tạo",
        "price": 105000,
        "oldPrice": 130000,
        "rating": 4.8,
        "reviewsCount": 560,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1492052722242-2554d0e99e3a?auto=format&fit=crop&w=600&q=80",
        "description": "Vứt bớt đồ đạc để dọn chỗ cho hạnh phúc đích thực: nghệ thuật tối giản (Minimalism) thay đổi cách bài trí không gian và tái lập trật tự tâm trí.",
        "tags": [
            "tối giản",
            "minimalism",
            "phong cách sống",
            "nhật bản",
            "nội thất"
        ],
        "isBestseller": false
    },
    {
        "id": 99,
        "title": "Nhiếp Ảnh Đường Phố: Nắm Bắt Khoảnh Khắc",
        "author": "Henri Cartier-Bresson",
        "category": "art-design",
        "categoryName": "Nghệ Thuật & Sáng Tạo",
        "price": 195000,
        "oldPrice": 245000,
        "rating": 4.9,
        "reviewsCount": 180,
        "discount": 20,
        "image": "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=600&q=80",
        "description": "Triết lý 'Khoảnh khắc quyết định' (The Decisive Moment) của bậc thầy nhiếp ảnh phóng sự đường phố thế kỷ 20.",
        "tags": [
            "nhiếp ảnh",
            "bresson",
            "khoảnh khắc",
            "street photography",
            "nghệ thuật"
        ],
        "isBestseller": false
    },
    {
        "id": 100,
        "title": "Tư Duy Thiết Kế Lấy Con Người Làm Trọng Tâm",
        "author": "Tim Brown",
        "category": "art-design",
        "categoryName": "Nghệ Thuật & Sáng Tạo",
        "price": 175000,
        "oldPrice": 215000,
        "rating": 4.8,
        "reviewsCount": 220,
        "discount": 19,
        "image": "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80",
        "description": "Phương pháp luận Design Thinking từ CEO của IDEO: thấu cảm khách hàng, phác thảo ý tưởng và thử nghiệm nguyên mẫu để giải quyết bài toán phức tạp.",
        "tags": [
            "design thinking",
            "tư duy thiết kế",
            "ideo",
            "sáng tạo",
            "đổi mới"
        ],
        "isBestseller": false
    }
];

// App State
let currentCategory = 'all';
let searchQuery = '';
let currentPage = 1;
const itemsPerPage = 16;
let cart = [];
let selectedCartIds = new Set(); // ID sách được tick để thanh toán
let appliedCoupon = null;
let currentUser = null;
try {
    currentUser = JSON.parse(localStorage.getItem('bookmind_user') || 'null');
} catch (e) {
    currentUser = null;
}

function requireLogin(actionName = 'thực hiện thao tác này') {
    if (!currentUser) {
        showToast(`Vui lòng đăng nhập để ${actionName}!`, 'warning');
        openAuthModal('login');
        return false;
    }
    return true;
}

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

const CATEGORY_SLUG_TO_ID = {
    'cong-nghe-ai': 'tech',
    'kinh-te-dau-tu': 'business',
    'tam-ly-ky-nang': 'self-help',
    'van-hoc-tieu-thuyet': 'literature',
    'lich-su-triet-hoc': 'history',
    'khoa-hoc-doi-song': 'science',
    'thieu-nhi-tuoi-tre': 'children',
    'nghe-thuat-sang-tao': 'art-design'
};

function getCategoryCodeById(catId) {
    switch (Number(catId)) {
        case 1: return 'tech';
        case 2: return 'business';
        case 3: return 'self-help';
        case 4: return 'literature';
        case 5: return 'history';
        case 6: return 'science';
        case 7: return 'children';
        case 8: return 'art-design';
        default: return null;
    }
}

let DYNAMIC_CATEGORIES = [];

function getCategoryIcon(slug, name) {
    if (!slug) slug = '';
    slug = slug.toLowerCase();
    if (slug.includes('cong-nghe') || slug.includes('tech') || slug.includes('ai')) return 'fa-microchip';
    if (slug.includes('kinh-te') || slug.includes('dau-tu') || slug.includes('business')) return 'fa-chart-line';
    if (slug.includes('tam-ly') || slug.includes('ky-nang') || slug.includes('self-help')) return 'fa-brain';
    if (slug.includes('van-hoc') || slug.includes('tieu-thuyet') || slug.includes('literature')) return 'fa-book-open';
    if (slug.includes('lich-su') || slug.includes('triet-hoc') || slug.includes('history')) return 'fa-landmark';
    if (slug.includes('khoa-hoc') || slug.includes('doi-song') || slug.includes('science')) return 'fa-flask';
    if (slug.includes('thieu-nhi') || slug.includes('tuoi-tre') || slug.includes('children')) return 'fa-child';
    if (slug.includes('nghe-thuat') || slug.includes('sang-tao') || slug.includes('art')) return 'fa-palette';
    if (slug.includes('hoat-hinh') || slug.includes('anime') || slug.includes('comic') || slug.includes('manga')) return 'fa-film';
    if (slug.includes('giao-duc') || slug.includes('hoc-tap')) return 'fa-graduation-cap';
    if (slug.includes('am-thuc') || slug.includes('nau-an')) return 'fa-utensils';
    if (slug.includes('du-lich') || slug.includes('kham-pha')) return 'fa-compass';
    return 'fa-bookmark';
}

async function loadCategoriesFromApi() {
    try {
        const res = await fetch('/api/categories');
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
            DYNAMIC_CATEGORIES = data;
            renderCategoryFilters();
        }
    } catch (e) {
        console.warn('Cannot fetch categories from API:', e);
    }
}

async function syncCatalogFromApi() {
    try {
        await loadCategoriesFromApi();
        await loadCouponsFromApi();

        const res = await fetch('/api/books');
        if (!res.ok) return;
        const apiBooks = await res.json();
        if (!Array.isArray(apiBooks) || apiBooks.length === 0) return;

        apiBooks.forEach(apiBook => {
            const existing = BOOK_CATALOG.find(b => b.id === apiBook.id);
            const mappedCategory = apiBook.categorySlug ||
                CATEGORY_SLUG_TO_ID[apiBook.slug] ||
                getCategoryCodeById(apiBook.categoryId) ||
                (existing ? existing.category : 'tech');

            const basePrice = (apiBook.originalPrice && apiBook.originalPrice > 0) ? apiBook.originalPrice : (existing && existing.oldPrice ? existing.oldPrice : apiBook.salePrice);
            const calculatedDiscount = (basePrice && basePrice > apiBook.salePrice)
                ? Math.round((basePrice - apiBook.salePrice) / basePrice * 100)
                : 0;

            if (existing) {
                existing.title = apiBook.title;
                existing.author = apiBook.author;
                existing.price = apiBook.salePrice;
                existing.oldPrice = basePrice;
                existing.discount = calculatedDiscount;
                existing.stockQuantity = apiBook.stockQuantity;
                existing.status = apiBook.status || 'AVAILABLE';
                if (apiBook.imageUrl) existing.image = apiBook.imageUrl;
                if (apiBook.categoryName) existing.categoryName = apiBook.categoryName;
                if (apiBook.categorySlug) existing.categorySlug = apiBook.categorySlug;
                if (apiBook.description) existing.description = apiBook.description;
                if (mappedCategory) existing.category = mappedCategory;
                existing.categoryId = apiBook.categoryId;
            } else {
                BOOK_CATALOG.push({
                    id: apiBook.id,
                    title: apiBook.title,
                    author: apiBook.author || 'Đang cập nhật',
                    category: mappedCategory,
                    categoryId: apiBook.categoryId,
                    categorySlug: apiBook.categorySlug || '',
                    categoryName: apiBook.categoryName || 'Sách tổng hợp',
                    price: apiBook.salePrice,
                    oldPrice: basePrice,
                    rating: apiBook.avgRating || 5.0,
                    reviewsCount: 10,
                    discount: calculatedDiscount,
                    image: apiBook.imageUrl || 'images/book_ai.png',
                    description: apiBook.description || '',
                    tags: [apiBook.title.toLowerCase()],
                    isBestseller: false,
                    status: apiBook.status || 'AVAILABLE',
                    stockQuantity: apiBook.stockQuantity || 0
                });
            }
        });

        // Đồng bộ lại status vào giỏ hàng
        cart.forEach(item => {
            const b = BOOK_CATALOG.find(x => x.id === item.id);
            if (b) {
                item.status = b.status;
                item.price = b.price;
                if (b.status === 'STOPPED' && typeof selectedCartIds !== 'undefined') {
                    selectedCartIds.delete(item.id);
                }
            }
        });

        renderCategoryFilters();
        renderBookGrid();
        updateCartUI();
    } catch (err) {
        console.warn('Cannot sync catalog from API:', err);
    }
}

function initApp() {
    renderCategoryFilters();
    renderBookGrid();
    setupEventListeners();
    updateCartUI();
    updateNavAuthUI();
    syncCatalogFromApi();
}

// ==========================================
// CUSTOM MODAL SYSTEM (pure JS, no Bootstrap)
// ==========================================
function openModal(id) {
    const el = document.getElementById(id);
    if (el) {
        el.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
}
function closeModal(id) {
    if (id === 'paymentModal') {
        if (typeof stopPaymentCheck === 'function') stopPaymentCheck();
    }
    const el = document.getElementById(id);
    if (el) {
        el.classList.remove('open');
        // Only restore scroll if no other modals are open
        const anyOpen = document.querySelectorAll('.custom-modal-overlay.open').length;
        if (anyOpen === 0) document.body.style.overflow = '';
    }
}
function handleOverlayClick(event, id) {
    // Close only if click is directly on the overlay (not the modal box)
    if (event.target === event.currentTarget) closeModal(id);
}
function toggleNavbar() {
    const nav = document.getElementById('navbarMain');
    if (nav) nav.classList.toggle('show');
}
// Backwards compat alias
function openCartModal() {
    if (!requireLogin('xem giỏ hàng của bạn')) {
        return;
    }
    openModal('cartModal');
}

// =========================================================
// BẢNG ĐƯỢC TÌM KIẾM NHIỀU NHẤT (TRENDING SEARCH DROPDOWN)
// =========================================================
const TRENDING_KEYWORDS = [
    { text: 'Trí tuệ nhân tạo', isHot: true },
    { text: 'Thói quen nguyên tử', isHot: true },
    { text: 'Tâm lý học tài chính', isHot: true },
    { text: 'Sapiens loài người', isHot: true },
    { text: 'Clean Code', isHot: false },
    { text: 'Đắc nhân tâm', isHot: false },
    { text: 'Nhà giả kim', isHot: false },
    { text: 'Mắt biếc', isHot: false }
];

const TOP_SEARCHED_BOOKS_DATA = [
    { id: 31, searches: '2.8k' },
    { id: 1, searches: '2.4k' },
    { id: 16, searches: '1.9k' },
    { id: 61, searches: '1.7k' },
    { id: 4, searches: '1.5k' }
];

function getRecentSearches() {
    try {
        return JSON.parse(localStorage.getItem('bookmind_recent_searches') || '[]');
    } catch (e) {
        return [];
    }
}

function saveRecentSearch(keyword) {
    if (!keyword || !keyword.trim()) return;
    const term = keyword.trim();
    let searches = getRecentSearches().filter(s => s.toLowerCase() !== term.toLowerCase());
    searches.unshift(term);
    if (searches.length > 5) searches = searches.slice(0, 5);
    try {
        localStorage.setItem('bookmind_recent_searches', JSON.stringify(searches));
    } catch (e) { }
}

function clearRecentSearches(e) {
    if (e) {
        e.preventDefault();
        e.stopPropagation();
    }
    try {
        localStorage.removeItem('bookmind_recent_searches');
    } catch (e) { }
    renderSearchDropdown(document.getElementById('searchInput')?.value || '');
}

function showSearchDropdown() {
    const dropdown = document.getElementById('searchDropdownPanel');
    if (!dropdown) return;
    renderSearchDropdown(document.getElementById('searchInput')?.value || '');
    dropdown.classList.add('show');
}

function hideSearchDropdown() {
    const dropdown = document.getElementById('searchDropdownPanel');
    if (dropdown) dropdown.classList.remove('show');
}

function selectSearchKeyword(keyword) {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = keyword;
    }
    searchQuery = keyword.toLowerCase().trim();
    currentPage = 1;
    saveRecentSearch(keyword);
    renderBookGrid();
    hideSearchDropdown();

    // Cuộn mượt đến phần danh sách sách
    const catalogSection = document.getElementById('catalogSection') || document.getElementById('bookGrid');
    if (catalogSection) {
        catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function searchBookFromDropdown(bookId) {
    hideSearchDropdown();
    const book = BOOK_CATALOG.find(b => b.id === bookId);
    if (book) {
        saveRecentSearch(book.title);
    }
    openBookModal(bookId);
}

function renderSearchDropdown(query = '') {
    const dropdown = document.getElementById('searchDropdownPanel');
    if (!dropdown) return;

    const trimmed = query.trim().toLowerCase();

    // 1. Khi người dùng đang nhập từ khóa: Hiển thị gợi ý trực tiếp (Live Match)
    if (trimmed !== '') {
        const matches = BOOK_CATALOG.filter(b =>
            b.title.toLowerCase().includes(trimmed) ||
            b.author.toLowerCase().includes(trimmed) ||
            b.tags.some(t => t.toLowerCase().includes(trimmed))
        ).slice(0, 5);

        let html = `
            <div class="search-dropdown-header">
                <div class="search-dropdown-title">
                    <i class="fas fa-search text-primary"></i> Gợi ý tìm kiếm
                </div>
                <button type="button" class="search-close-btn" onclick="hideSearchDropdown()" title="Đóng">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        if (matches.length > 0) {
            html += `<div class="d-flex flex-column gap-1 mb-2">`;
            matches.forEach(book => {
                html += `
                    <div class="trending-book-item" onclick="searchBookFromDropdown(${book.id})">
                        <img src="${book.image}" class="trending-book-img" alt="${book.title}"
                             onerror="this.onerror=null;this.src='images/book_ai.png'">
                        <div class="flex-grow-1 overflow-hidden">
                            <div class="trending-book-title" title="${book.title}">${book.title}</div>
                            <div class="trending-book-author">${book.author} &bull; <span class="text-primary">${book.categoryName}</span></div>
                        </div>
                        <div class="trending-book-price text-end flex-shrink-0">${formatCurrency(book.price)}</div>
                    </div>
                `;
            });
            html += `</div>`;
            html += `
                <div class="text-center pt-2 border-top">
                    <a href="javascript:void(0)" onclick="selectSearchKeyword('${trimmed.replace(/'/g, "\\'")}')" class="fs-8 fw-semibold text-primary text-decoration-none">
                        Xem tất cả kết quả cho "${escapeHtml(query)}" &rarr;
                    </a>
                </div>
            `;
        } else {
            html += `
                <div class="text-center py-4 text-muted">
                    <i class="fas fa-book-open fa-2x mb-2 text-muted opacity-50"></i>
                    <p class="fs-8 mb-2">Không tìm thấy sách nào khớp với từ khóa</p>
                    <button class="btn btn-outline-primary btn-sm rounded-pill fs-8 px-3" onclick="hideSearchDropdown(); openAIChatWithPrompt('Tìm sách về ${query}')">
                        <i class="fas fa-robot me-1"></i> Nhờ AI tìm kiếm
                    </button>
                </div>
            `;
        }
        dropdown.innerHTML = html;
        return;
    }

    // 2. Khi thanh tìm kiếm chưa có chữ: Hiển thị Bảng Được Tìm Kiếm Nhiều Nhất
    const recentSearches = getRecentSearches();

    let html = `
        <div class="search-dropdown-header">
            <div class="search-dropdown-title">
                <i class="fas fa-fire text-danger"></i> Được Tìm Kiếm Nhiều Nhất
            </div>
            <button type="button" class="search-close-btn" onclick="hideSearchDropdown()" title="Đóng">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // A. Lịch sử tìm kiếm gần đây (nếu có)
    if (recentSearches.length > 0) {
        html += `
            <div class="d-flex align-items-center justify-content-between mb-1.5">
                <span class="fs-8 fw-bold text-muted text-uppercase" style="letter-spacing: 0.5px;">Tìm kiếm gần đây</span>
                <button type="button" class="recent-clear-btn" onclick="clearRecentSearches(event)">Xóa lịch sử</button>
            </div>
            <div class="recent-searches-list">
                ${recentSearches.map(term => `
                    <span class="recent-search-chip" onclick="selectSearchKeyword('${term.replace(/'/g, "\\'")}')">
                        <i class="far fa-clock text-muted fs-8"></i> ${escapeHtml(term)}
                    </span>
                `).join('')}
            </div>
            <hr class="my-2 text-muted opacity-25">
        `;
    }

    // B. Từ khóa thịnh hành (Trending Keywords)
    html += `
        <div class="mb-1.5">
            <span class="fs-8 fw-bold text-muted text-uppercase" style="letter-spacing: 0.5px;">Từ khóa thịnh hành</span>
        </div>
        <div class="trending-pills-wrap">
            ${TRENDING_KEYWORDS.map(item => `
                <span class="trending-pill-chip ${item.isHot ? 'hot' : ''}" onclick="selectSearchKeyword('${item.text.replace(/'/g, "\\'")}')">
                    ${item.isHot ? '<i class="fas fa-bolt text-warning fs-8"></i>' : '<i class="fas fa-search text-muted fs-8"></i>'}
                    ${item.text}
                </span>
            `).join('')}
        </div>
    `;

    // C. Top 5 sách tìm kiếm nhiều nhất
    html += `
        <div class="mb-2">
            <span class="fs-8 fw-bold text-muted text-uppercase" style="letter-spacing: 0.5px;">Top Sách Xem Nhiều Nhất</span>
        </div>
        <div class="d-flex flex-column gap-1">
    `;

    TOP_SEARCHED_BOOKS_DATA.forEach((item, index) => {
        const book = BOOK_CATALOG.find(b => b.id === item.id);
        if (!book) return;
        const rankClass = index === 0 ? 'trending-rank-1' :
            index === 1 ? 'trending-rank-2' :
                index === 2 ? 'trending-rank-3' : 'trending-rank-other';

        html += `
            <div class="trending-book-item" onclick="searchBookFromDropdown(${book.id})">
                <span class="trending-rank-badge ${rankClass}">#${index + 1}</span>
                <img src="${book.image}" class="trending-book-img" alt="${book.title}"
                     onerror="this.onerror=null;this.src='images/book_ai.png'">
                <div class="flex-grow-1 overflow-hidden">
                    <div class="trending-book-title" title="${book.title}">${book.title}</div>
                    <div class="trending-book-author">${book.author} &bull; <span class="text-muted">${book.categoryName}</span></div>
                </div>
                <div class="text-end flex-shrink-0">
                    <div class="trending-book-price">${formatCurrency(book.price)}</div>
                    <span class="trending-search-count"><i class="fas fa-fire me-0.5"></i> ${item.searches}</span>
                </div>
            </div>
        `;
    });

    html += `</div>`;

    dropdown.innerHTML = html;
}

function setupEventListeners() {
    const searchInput = document.getElementById('searchInput');
    const searchBoxWrapper = document.querySelector('.search-box-wrapper');

    if (searchInput) {
        // Khi người dùng nhấn hoặc focus vào thanh tìm kiếm -> Mở bảng tìm kiếm nhiều nhất
        searchInput.addEventListener('focus', () => {
            showSearchDropdown();
        });

        searchInput.addEventListener('click', (e) => {
            e.stopPropagation();
            showSearchDropdown();
        });

        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.toLowerCase().trim();
            currentPage = 1;
            renderBookGrid();
            renderSearchDropdown(e.target.value);
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const val = searchInput.value.trim();
                if (val) saveRecentSearch(val);
                hideSearchDropdown();
                const catalogSection = document.getElementById('catalogSection') || document.getElementById('bookGrid');
                if (catalogSection) {
                    catalogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else if (e.key === 'Escape') {
                hideSearchDropdown();
            }
        });
    }

    // Đóng bảng tìm kiếm khi click ra ngoài
    document.addEventListener('click', (e) => {
        if (searchBoxWrapper && !searchBoxWrapper.contains(e.target)) {
            hideSearchDropdown();
        }
    });

    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            currentPage = 1;
            renderBookGrid();
        });
    }

    const applyCouponBtn = document.getElementById('btnApplyCoupon');
    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', handleApplyCoupon);
    }
}

function renderCategoryFilters() {
    const container = document.getElementById('categoryFilters');
    if (!container) return;

    let catList = [];
    const totalCount = BOOK_CATALOG.length;
    catList.push({ id: 'all', name: `Tất Cả Sách (${totalCount})`, icon: 'fa-layer-group' });

    if (DYNAMIC_CATEGORIES && DYNAMIC_CATEGORIES.length > 0) {
        DYNAMIC_CATEGORIES.forEach(c => {
            const count = BOOK_CATALOG.filter(b =>
                (b.categoryId && String(b.categoryId) === String(c.id)) ||
                (b.categorySlug && b.categorySlug === c.slug) ||
                (b.category === c.slug) ||
                (b.categoryName && b.categoryName.toLowerCase() === c.name.toLowerCase())
            ).length;

            catList.push({
                id: String(c.id),
                slug: c.slug,
                name: count > 0 ? `${c.name} (${count})` : c.name,
                icon: getCategoryIcon(c.slug, c.name)
            });
        });
    } else {
        const defaultCats = [
            { id: 'tech', slug: 'cong-nghe-ai', name: 'Công Nghệ & AI', icon: 'fa-microchip' },
            { id: 'business', slug: 'kinh-te-dau-tu', name: 'Kinh Tế & Đầu Tư', icon: 'fa-chart-line' },
            { id: 'self-help', slug: 'tam-ly-ky-nang', name: 'Tâm Lý & Kỹ Năng', icon: 'fa-brain' },
            { id: 'literature', slug: 'van-hoc-tieu-thuyet', name: 'Văn Học & Tiểu Thuyết', icon: 'fa-book-open' },
            { id: 'history', slug: 'lich-su-triet-hoc', name: 'Lịch Sử & Triết Học', icon: 'fa-landmark' },
            { id: 'science', slug: 'khoa-hoc-doi-song', name: 'Khoa Học & Đời Sống', icon: 'fa-flask' },
            { id: 'children', slug: 'thieu-nhi-tuoi-tre', name: 'Thiếu Nhi & Tuổi Trẻ', icon: 'fa-child' },
            { id: 'art-design', slug: 'nghe-thuat-sang-tao', name: 'Nghệ Thuật & Sáng Tạo', icon: 'fa-palette' }
        ];
        defaultCats.forEach(d => {
            catList.push({
                id: d.id,
                slug: d.slug,
                name: d.name,
                icon: d.icon
            });
        });
    }

    container.innerHTML = catList.map(cat => {
        const isActive = (String(cat.id) === String(currentCategory)) ||
            (cat.slug && String(cat.slug) === String(currentCategory));
        return `
            <button class="nav-link ${isActive ? 'active' : ''}" 
                    onclick="filterByCategory('${cat.id}')">
                <i class="fas ${cat.icon} me-1"></i> ${cat.name}
            </button>
        `;
    }).join('');
}

function filterByCategory(catId) {
    currentCategory = catId;
    currentPage = 1;
    renderCategoryFilters();
    renderBookGrid();
}

function renderBookGrid() {
    const grid = document.getElementById('bookGrid');
    if (!grid) return;

    let filtered = BOOK_CATALOG.filter(book => {
        let matchesCat = false;
        if (currentCategory === 'all') {
            matchesCat = true;
        } else {
            const selCat = DYNAMIC_CATEGORIES.find(c => String(c.id) === String(currentCategory) || c.slug === currentCategory);
            if (selCat) {
                matchesCat = (book.categoryId && String(book.categoryId) === String(selCat.id)) ||
                    (book.categorySlug && book.categorySlug === selCat.slug) ||
                    (book.category === selCat.slug) ||
                    (book.categoryName && book.categoryName.toLowerCase() === selCat.name.toLowerCase());
            } else {
                matchesCat = (String(book.categoryId) === String(currentCategory)) ||
                    (book.category === currentCategory) ||
                    (book.categorySlug === currentCategory);
            }
        }

        const matchesSearch = !searchQuery ||
            book.title.toLowerCase().includes(searchQuery) ||
            book.author.toLowerCase().includes(searchQuery) ||
            (book.tags && book.tags.some(tag => tag.includes(searchQuery)));
        return matchesCat && matchesSearch;
    });

    const sortVal = document.getElementById('sortSelect')?.value || 'default';
    if (sortVal === 'price-asc') {
        filtered.sort((a, b) => a.price - b.price);
    } else if (sortVal === 'price-desc') {
        filtered.sort((a, b) => b.price - a.price);
    } else if (sortVal === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating);
    }

    const paginationWrapper = document.getElementById('bookPaginationWrapper');
    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h5 class="fw-bold">Không tìm thấy cuốn sách nào</h5>
                <p class="text-muted">Thử thay đổi từ khóa hoặc hỏi Trợ Lý AI gợi ý cho bạn nhé!</p>
                <button class="btn btn-primary rounded-pill px-4" onclick="openAIChatWithPrompt('Gợi ý cho tôi sách hay mới nhất')">
                    <i class="fas fa-robot me-2"></i> Hỏi AI Ngay
                </button>
            </div>
        `;
        if (paginationWrapper) paginationWrapper.classList.add('d-none');
        return;
    }

    if (paginationWrapper) paginationWrapper.classList.remove('d-none');

    // Pagination calculations
    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = 1;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const paginatedItems = filtered.slice(startIndex, endIndex);

    // Update Counter Info
    const showingCountEl = document.getElementById('bookShowingCount');
    const totalCountEl = document.getElementById('bookTotalCount');
    if (showingCountEl) showingCountEl.innerText = `${startIndex + 1} - ${endIndex}`;
    if (totalCountEl) totalCountEl.innerText = totalItems;

    // Render Grid Cards
    grid.innerHTML = paginatedItems.map(book => {
        const isStopped = book.status === 'STOPPED';
        const stock = (book.stockQuantity !== undefined && book.stockQuantity !== null) ? book.stockQuantity : 99;
        const isOutOfStock = book.status === 'OUT_OF_STOCK' || stock <= 0;
        const isLowStock = !isStopped && !isOutOfStock && stock <= 3;
        const basePrice = (book.oldPrice && book.oldPrice > 0) ? book.oldPrice : (book.originalPrice || 0);
        const currentPrice = (book.price && book.price > 0) ? book.price : (book.salePrice || 0);
        const discountPct = (basePrice > currentPrice) ? Math.round((basePrice - currentPrice) / basePrice * 100) : (book.discount || 0);

        return `
        <div class="col-6 col-md-4 col-lg-3 mb-4">
            <div class="book-card h-100 d-flex flex-column shadow-sm rounded-4 overflow-hidden border position-relative ${isStopped ? 'border-danger-subtle bg-light-subtle' : (isLowStock ? 'border-warning-subtle' : '')}">
                ${isStopped
                ? `<span class="badge bg-danger position-absolute top-0 start-0 m-2 shadow-sm fs-8" style="z-index: 3;"><i class="fas fa-ban me-1"></i>Ngưng kinh doanh</span>`
                : isOutOfStock
                    ? `<span class="badge bg-secondary position-absolute top-0 start-0 m-2 shadow-sm fs-8" style="z-index: 3;"><i class="fas fa-box-open me-1"></i>Hết hàng</span>`
                    : isLowStock
                        ? `<span class="badge bg-danger text-white position-absolute top-0 start-0 m-2 shadow-sm fs-8 fw-bold" style="z-index: 3;"><i class="fas fa-exclamation-circle me-1"></i>Chỉ còn ${stock} cuốn!</span>`
                        : (discountPct > 0 ? `<span class="book-discount-badge">-${discountPct}%</span>` : '')
            }
                <div class="book-cover-wrapper position-relative" onclick="openBookModal(${book.id})" style="cursor: pointer;">
                    <img src="${book.image}" class="book-cover-img ${isStopped ? 'opacity-75' : ''}" alt="${book.title}" loading="lazy"
                         onerror="this.onerror=null;this.src='images/book_ai.png'">
                </div>
                <div class="p-3 d-flex flex-column flex-grow-1">
                    <span class="book-category-tag mb-1">${book.categoryName}</span>
                    <h6 class="book-title mb-1" onclick="openBookModal(${book.id})" style="cursor: pointer;" title="${book.title}">
                        ${book.title}
                    </h6>
                    <p class="book-author mb-2 text-muted fs-8">${book.author}</p>
                    
                    <div class="d-flex align-items-center mb-2 fs-7 text-warning">
                        <i class="fas fa-star me-1"></i>
                        <span class="fw-bold text-dark me-1">${book.rating}</span>
                        <span class="text-muted fs-8">(${book.reviewsCount})</span>
                    </div>

                    <div class="mt-auto pt-2">
                        <div class="d-flex align-items-baseline mb-1 gap-2">
                            <span class="book-price ${isStopped ? 'text-muted text-decoration-line-through' : ''}">${formatCurrency(currentPrice)}</span>
                            ${basePrice > currentPrice && !isStopped ? `<span class="book-price-old">${formatCurrency(basePrice)}</span>` : ''}
                        </div>
                        ${isLowStock ? `<div class="text-danger fw-bold fs-8 mb-2"><i class="fas fa-fire me-1 text-danger"></i>Sắp hết hàng - Chỉ còn ${stock} cuốn</div>` : ''}
                        <div class="d-grid gap-2">
                            ${isStopped
                ? `<button class="btn btn-outline-danger btn-sm rounded-3 fw-semibold disabled opacity-75" disabled><i class="fas fa-ban me-1"></i>Ngưng kinh doanh</button>`
                : isOutOfStock
                    ? `<button class="btn btn-secondary btn-sm rounded-3 fw-semibold disabled opacity-75" disabled><i class="fas fa-box-open me-1"></i>Tạm hết hàng</button>`
                    : `<button class="btn btn-primary btn-sm rounded-3 fw-semibold" onclick="addToCart(${book.id})"><i class="fas fa-cart-plus me-1"></i> Thêm Giỏ Hàng</button>`
            }
                            <button class="btn btn-ai-consult btn-sm" onclick="askAIAboutBook(${book.id})">
                                <i class="fas fa-sparkles me-1"></i> Hỏi AI về sách này
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `;
    }).join('');

    renderBookPagination(totalPages);
}

function renderBookPagination(totalPages) {
    const list = document.getElementById('bookPaginationList');
    if (!list) return;

    if (totalPages <= 1) {
        list.innerHTML = '';
        return;
    }

    let html = '';
    // Previous button
    html += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="javascript:void(0)" onclick="changeBookPage(${currentPage - 1})" aria-label="Previous">
                <i class="fas fa-chevron-left fs-8"></i>
            </a>
        </li>
    `;

    // Pages
    for (let p = 1; p <= totalPages; p++) {
        if (p === 1 || p === totalPages || (p >= currentPage - 2 && p <= currentPage + 2)) {
            html += `
                <li class="page-item ${p === currentPage ? 'active' : ''}">
                    <a class="page-link fw-semibold" href="javascript:void(0)" onclick="changeBookPage(${p})">${p}</a>
                </li>
            `;
        } else if (p === currentPage - 3 || p === currentPage + 3) {
            html += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }

    // Next button
    html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="javascript:void(0)" onclick="changeBookPage(${currentPage + 1})" aria-label="Next">
                <i class="fas fa-chevron-right fs-8"></i>
            </a>
        </li>
    `;

    list.innerHTML = html;
}

function changeBookPage(newPage) {
    currentPage = newPage;
    renderBookGrid();
    const section = document.getElementById('catalogSection');
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function addToCart(bookId, qty = 1, silent = false) {
    if (!requireLogin('thêm sản phẩm vào giỏ hàng')) {
        return false;
    }
    const book = BOOK_CATALOG.find(b => b.id === bookId);
    if (!book) return false;

    if (book.status === 'STOPPED') {
        showToast(`Sách "<b>${book.title}</b>" hiện đã ngừng kinh doanh, không thể thêm vào giỏ hàng!`, 'danger');
        return false;
    }

    const stock = (book.stockQuantity !== undefined && book.stockQuantity !== null) ? book.stockQuantity : 99;
    if (book.status === 'OUT_OF_STOCK' || stock <= 0) {
        showToast(`Sách "<b>${book.title}</b>" hiện đang tạm hết hàng!`, 'warning');
        return false;
    }

    qty = parseInt(qty) || 1;
    if (qty < 1) qty = 1;

    const existingIndex = cart.findIndex(item => item.id === bookId);
    const currentInCart = existingIndex > -1 ? cart[existingIndex].quantity : 0;
    if (currentInCart + qty > stock) {
        if (currentInCart > 0) {
            showToast(`Kho không đủ sách! Bạn đã có <b>${currentInCart}</b> cuốn trong giỏ, kho chỉ còn <b>${stock}</b> cuốn.`, 'warning');
        } else {
            showToast(`Kho không đủ sách! Bạn chọn <b>${qty}</b> cuốn nhưng kho chỉ còn <b>${stock}</b> cuốn.`, 'warning');
        }
        return false;
    }

    if (existingIndex > -1) {
        cart[existingIndex].quantity += qty;
        cart[existingIndex].status = book.status;
        cart[existingIndex].stockQuantity = stock;
    } else {
        cart.push({ ...book, quantity: qty, stockQuantity: stock });
    }

    updateCartUI();
    if (!silent) {
        showToast(`Đã thêm <b>${qty > 1 ? qty + 'x ' : ''}${book.title}</b> vào giỏ hàng!`, 'success');
    }
    return true;
}

function buyNow(bookId, qty = 1) {
    if (!requireLogin('tiến hành mua hàng')) {
        return;
    }
    const book = BOOK_CATALOG.find(b => b.id === bookId);
    if (!book) return;

    if (book.status === 'STOPPED') {
        showToast(`Sách "<b>${book.title}</b>" hiện đã ngừng kinh doanh, không thể đặt mua!`, 'danger');
        return;
    }

    const stock = (book.stockQuantity !== undefined && book.stockQuantity !== null) ? book.stockQuantity : 99;
    if (book.status === 'OUT_OF_STOCK' || stock <= 0) {
        showToast(`Sách "<b>${book.title}</b>" hiện đang tạm hết hàng!`, 'warning');
        return;
    }

    qty = parseInt(qty) || 1;
    if (qty > stock) {
        showToast(`Kho không đủ sách! Bạn đặt <b>${qty}</b> cuốn nhưng kho chỉ còn <b>${stock}</b> cuốn.`, 'warning');
        return;
    }

    const added = addToCart(bookId, qty, true);
    if (!added) return;
    closeModal('bookDetailModal');
    setTimeout(() => {
        openPaymentModal();
    }, 150);
}

function changeDetailQuantity(delta) {
    const input = document.getElementById('detailBookQuantity');
    if (!input) return;
    let val = parseInt(input.value) || 1;
    const book = (typeof currentModalBookId !== 'undefined' && currentModalBookId) ? BOOK_CATALOG.find(b => b.id === currentModalBookId) : null;
    const stock = (book && book.stockQuantity !== undefined && book.stockQuantity !== null) ? book.stockQuantity : 99;

    if (delta > 0 && val + delta > stock) {
        showToast(`Kho không đủ sách! Hiện chỉ còn <b>${stock}</b> cuốn trong kho.`, 'warning');
        input.value = Math.max(1, stock);
        return;
    }

    val += delta;
    if (val < 1) val = 1;
    if (val > stock) val = Math.max(1, stock);
    input.value = val;
}

function validateDetailQuantity(input) {
    if (!input) return;
    let val = parseInt(input.value) || 1;
    const book = (typeof currentModalBookId !== 'undefined' && currentModalBookId) ? BOOK_CATALOG.find(b => b.id === currentModalBookId) : null;
    const stock = (book && book.stockQuantity !== undefined && book.stockQuantity !== null) ? book.stockQuantity : 99;

    if (val > stock) {
        showToast(`Kho không đủ sách! Bạn nhập ${val} cuốn nhưng kho chỉ còn <b>${stock}</b> cuốn.`, 'warning');
        val = Math.max(1, stock);
    }
    if (val < 1) val = 1;
    input.value = val;
}

function updateCartQuantity(bookId, delta) {
    const item = cart.find(b => b.id === bookId);
    if (!item) return;

    if (delta > 0) {
        const book = BOOK_CATALOG.find(b => b.id === bookId);
        const stock = (book && book.stockQuantity !== undefined && book.stockQuantity !== null) ? book.stockQuantity : (item.stockQuantity != null ? item.stockQuantity : 99);
        if (item.quantity + delta > stock) {
            showToast(`Kho không đủ sách! Cuốn "<b>${item.title}</b>" chỉ còn <b>${stock}</b> cuốn trong kho.`, 'warning');
            return;
        }
    }

    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter(b => b.id !== bookId);
        selectedCartIds.delete(bookId);
    }
    updateCartUI();
}

function removeFromCart(bookId) {
    cart = cart.filter(b => b.id !== bookId);
    selectedCartIds.delete(bookId);
    updateCartUI();
    showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'info');
}

function toggleCartItemSelected(bookId, checked) {
    if (checked) {
        selectedCartIds.add(bookId);
    } else {
        selectedCartIds.delete(bookId);
    }
    updateCartSummary();
    updateSelectAllCheckbox();
}

function toggleSelectAllCart(checked) {
    if (checked) {
        cart.forEach(item => selectedCartIds.add(item.id));
    } else {
        selectedCartIds.clear();
    }
    // Cập nhật tất cả checkbox items
    cart.forEach(item => {
        const cb = document.getElementById(`cart-cb-${item.id}`);
        if (cb) cb.checked = checked;
    });
    updateCartSummary();
}

function updateSelectAllCheckbox() {
    const selectAllCb = document.getElementById('cartSelectAll');
    if (!selectAllCb || cart.length === 0) return;
    const allSelected = cart.every(item => selectedCartIds.has(item.id));
    const noneSelected = cart.every(item => !selectedCartIds.has(item.id));
    selectAllCb.checked = allSelected;
    selectAllCb.indeterminate = !allSelected && !noneSelected;
}

function getSelectedCartItems() {
    return cart.filter(item => selectedCartIds.has(item.id));
}

function updateCartSummary() {
    const selectedItems = getSelectedCartItems();
    const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = calculateCouponDiscount(appliedCoupon, subtotal);
    const finalTotal = Math.max(0, subtotal - discountAmount);

    const subtotalEl = document.getElementById('cartSubtotal');
    const totalEl = document.getElementById('cartTotal');
    const discountEl = document.getElementById('cartDiscount');
    const checkoutBtn = document.getElementById('cartCheckoutBtn');

    if (subtotalEl) subtotalEl.innerText = formatCurrency(subtotal);
    if (discountEl) {
        discountEl.innerText = (appliedCoupon && discountAmount > 0)
            ? `-${formatCurrency(discountAmount)} (${appliedCoupon})`
            : '0đ';
    }
    if (totalEl) totalEl.innerText = formatCurrency(finalTotal);

    // Cập nhật badge số lượng sản phẩm được chọn
    if (checkoutBtn) {
        if (selectedItems.length > 0) {
            checkoutBtn.disabled = false;
            checkoutBtn.innerHTML = `<i class="fas fa-credit-card me-1"></i> Thanh Toán Ngay (${selectedItems.length})`;
        } else {
            checkoutBtn.disabled = true;
            checkoutBtn.innerHTML = `<i class="fas fa-credit-card me-1"></i> Thanh Toán Ngay`;
        }
    }

    renderCouponList('cart');
}

function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const cartBadge = document.getElementById('cartBadge');
    if (cartBadge) {
        cartBadge.innerText = totalCount;
        cartBadge.style.display = totalCount > 0 ? 'inline-block' : 'none';
    }

    // Đảm bảo items mới thêm vào giỏ được tự động tick
    cart.forEach(item => {
        if (!selectedCartIds.has(item.id)) {
            selectedCartIds.add(item.id);
        }
    });
    // Xóa các id không còn trong giỏ
    const cartIds = new Set(cart.map(i => i.id));
    selectedCartIds.forEach(id => { if (!cartIds.has(id)) selectedCartIds.delete(id); });

    const cartContainer = document.getElementById('cartItemsContainer');
    if (cartContainer) {
        if (cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="text-center py-4">
                    <i class="fas fa-shopping-basket fa-3x text-muted mb-2"></i>
                    <p class="text-muted">Giỏ hàng của bạn đang trống</p>
                </div>
            `;
        } else {
            // Header: Chọn tất cả
            const allChecked = cart.every(item => selectedCartIds.has(item.id));
            const someChecked = cart.some(item => selectedCartIds.has(item.id));
            const headerHtml = `
                <div class="d-flex align-items-center px-1 pb-2 mb-1" style="border-bottom: 1px solid #f0f0f0;">
                    <div class="form-check mb-0">
                        <input class="form-check-input" type="checkbox" id="cartSelectAll"
                            ${allChecked ? 'checked' : ''}
                            onchange="toggleSelectAllCart(this.checked)"
                            style="width:18px;height:18px;cursor:pointer;accent-color:#4f46e5;">
                        <label class="form-check-label fw-semibold ms-1" for="cartSelectAll" style="cursor:pointer;font-size:0.88rem;">
                            Chọn tất cả (${cart.length} sản phẩm)
                        </label>
                    </div>
                </div>
            `;

            const itemsHtml = cart.map(item => {
                const isStopped = item.status === 'STOPPED';
                const isChecked = selectedCartIds.has(item.id) && !isStopped;
                return `
                <div class="cart-item-row align-items-center ${isStopped ? 'bg-danger-subtle rounded-3 p-1' : ''}" style="opacity: ${isStopped ? '0.7' : (isChecked ? '1' : '0.5')}; transition: opacity 0.2s;">
                    <div class="form-check mb-0 me-2" style="min-width:22px;">
                        <input class="form-check-input" type="checkbox" id="cart-cb-${item.id}"
                            ${isChecked ? 'checked' : ''}
                            ${isStopped ? 'disabled title="Sách đã ngưng kinh doanh"' : ''}
                            onchange="toggleCartItemSelected(${item.id}, this.checked)"
                            style="width:18px;height:18px;cursor:${isStopped ? 'not-allowed' : 'pointer'};accent-color:#4f46e5;">
                    </div>
                    <img src="${item.image}" class="cart-item-img" alt="${item.title}">
                    <div class="flex-grow-1 min-w-0">
                        <h6 class="mb-0 text-truncate font-weight-bold" style="max-width: 160px;">${item.title}</h6>
                        <div class="d-flex align-items-center gap-1">
                            <span class="text-primary fw-bold">${formatCurrency(item.price)}</span>
                            ${isStopped ? '<span class="badge bg-danger ms-1" style="font-size:0.7rem;"><i class="fas fa-ban me-1"></i>Ngưng bán</span>' : ''}
                        </div>
                    </div>
                    <div class="d-flex align-items-center gap-1">
                        <button class="btn btn-light btn-sm px-2 border" onclick="updateCartQuantity(${item.id}, -1)">-</button>
                        <span class="px-2 fw-bold">${item.quantity}</span>
                        <button class="btn btn-light btn-sm px-2 border" onclick="updateCartQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="btn btn-link text-danger p-0 ms-2" onclick="removeFromCart(${item.id})" title="Xóa">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            `}).join('');

            cartContainer.innerHTML = headerHtml + itemsHtml;

            // Set indeterminate state nếu cần
            const selectAllCb = document.getElementById('cartSelectAll');
            if (selectAllCb && someChecked && !allChecked) {
                selectAllCb.indeterminate = true;
            }
        }
    }

    updateCartSummary();
}

// ==========================================
// COUPON & VOUCHER SYSTEM
// ==========================================
let AVAILABLE_COUPONS = [
    {
        code: 'AI10',
        title: 'Giảm 10% Toàn Đơn',
        desc: 'Áp dụng cho mọi giá trị đơn hàng, giảm tối đa 50.000đ',
        type: 'PERCENT',
        value: 10,
        maxDiscount: 50000,
        minOrder: 0,
        badge: 'HOT 🔥',
        badgeClass: 'bg-danger text-white'
    },
    {
        code: 'BOOK20K',
        title: 'Giảm 20.000đ',
        desc: 'Áp dụng cho đơn hàng từ 200.000đ trở lên',
        type: 'FIXED',
        value: 20000,
        minOrder: 200000,
        badge: 'PHỔ BIẾN ⭐',
        badgeClass: 'bg-primary text-white'
    },
    {
        code: 'NEWBIE',
        title: 'Giảm 15.000đ Bạn Mới',
        desc: 'Áp dụng đơn hàng từ 100.000đ cho độc giả mới',
        type: 'FIXED',
        value: 15000,
        minOrder: 100000,
        badge: 'QUÀ TẶNG 🎁',
        badgeClass: 'bg-success text-white'
    },
    {
        code: 'VIP50K',
        title: 'Giảm 50.000đ Đơn Lớn',
        desc: 'Áp dụng cho đơn hàng từ 400.000đ trở lên',
        type: 'FIXED',
        value: 50000,
        minOrder: 400000,
        badge: 'TIẾT KIỆM 💰',
        badgeClass: 'bg-warning text-dark'
    }
];

async function loadCouponsFromApi() {
    try {
        const res = await fetch('/api/coupons');
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data)) {
            AVAILABLE_COUPONS = data.map(c => ({
                code: c.code,
                title: c.title,
                desc: c.description || '',
                type: c.discountType || 'PERCENT',
                value: c.discountValue || 0,
                maxDiscount: c.maxDiscountAmount || null,
                minOrder: c.minOrderAmount || 0,
                badge: c.badgeText || 'ƯU ĐÃI ✨',
                badgeClass: `bg-${c.badgeColor || 'danger'} text-white`
            }));

            renderHomePageCoupons();

            if (typeof renderCouponList === 'function') {
                renderCouponList('cart');
                renderCouponList('checkout');
            }
        }
    } catch (e) {
        console.warn('Cannot fetch coupons from API, using fallback:', e);
    }
}

function renderHomePageCoupons() {
    const container = document.getElementById('homeVoucherListContainer');
    const section = document.getElementById('voucherSection');
    if (!container) return;

    if (!AVAILABLE_COUPONS || AVAILABLE_COUPONS.length === 0) {
        if (section) section.style.display = 'none';
        return;
    }

    if (section) section.style.display = 'block';

    container.innerHTML = AVAILABLE_COUPONS.map(c => {
        const discountText = c.type === 'PERCENT' ? `GIẢM ${c.value}%` : `GIẢM ${formatCurrency(c.value)}`;
        const minOrderText = c.minOrder > 0 ? `Đơn từ ${formatCurrency(c.minOrder)}` : 'Mọi đơn hàng';
        const maxDiscountText = c.type === 'PERCENT' && c.maxDiscount > 0 ? ` • Tối đa ${formatCurrency(c.maxDiscount)}` : '';
        const isApplied = appliedCoupon === c.code;

        return `
            <div class="col-lg-3 col-md-6 col-12">
                <div class="card h-100 border-0 shadow-sm rounded-4 position-relative overflow-hidden" 
                     style="background: #ffffff; border: 1.5px dashed #e2e8f0 !important; transition: transform 0.2s, box-shadow 0.2s;">
                    <div class="p-3">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <span class="badge ${c.badgeClass || 'bg-danger text-white'} rounded-pill px-2.5 py-1 fs-9 fw-bold">
                                ${escapeHtml(c.badge)}
                            </span>
                            <span class="font-monospace fw-bold text-primary fs-8 px-2 py-0.5 rounded bg-primary-subtle">
                                ${escapeHtml(c.code)}
                            </span>
                        </div>
                        <h6 class="fw-bold text-danger mb-1 fs-6">${discountText}</h6>
                        <div class="fw-semibold text-dark fs-8 mb-1 text-truncate">${escapeHtml(c.title)}</div>
                        <div class="text-muted fs-9 mb-2">${minOrderText}${maxDiscountText}</div>
                        
                        <div class="d-flex gap-2 align-items-center mt-auto pt-2 border-top">
                            <button type="button" class="btn btn-sm ${isApplied ? 'btn-success' : 'btn-outline-danger'} rounded-pill flex-fill fs-8 fw-bold py-1" 
                                    onclick="saveAndApplyHomeCoupon('${escapeHtml(c.code)}')">
                                <i class="fas ${isApplied ? 'fa-check-circle' : 'fa-ticket-alt'} me-1"></i>
                                ${isApplied ? 'Đang Áp Dụng' : 'Lưu & Dùng Mã'}
                            </button>
                            <button type="button" class="btn btn-sm btn-light rounded-circle p-1.5 fs-8 text-secondary" 
                                    onclick="copyVoucherCode('${escapeHtml(c.code)}')" title="Sao chép mã">
                                <i class="fas fa-copy"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function copyVoucherCode(code) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(code).then(() => {
            if (typeof showToast === 'function') showToast(`Đã sao chép mã <b>${code}</b> vào bộ nhớ tạm!`, 'success');
        });
    } else {
        if (typeof showToast === 'function') showToast(`Mã khuyến mãi: <b>${code}</b>`, 'info');
    }
}

function saveAndApplyHomeCoupon(code) {
    copyVoucherCode(code);
    appliedCoupon = code;

    // Update active UI badges
    renderHomePageCoupons();
    if (typeof renderCouponList === 'function') {
        renderCouponList('cart');
        renderCouponList('checkout');
    }
    if (typeof updateCartSummaryUI === 'function') {
        updateCartSummaryUI();
    }
    if (typeof showToast === 'function') {
        showToast(`Đã kích hoạt mã <b>${code}</b> cho giỏ hàng của bạn!`, 'success');
    }
}

function calculateCouponDiscount(code, subtotal) {
    if (!code || !subtotal || subtotal <= 0) return 0;
    const coupon = AVAILABLE_COUPONS.find(c => c.code === code);
    if (!coupon) return 0;
    if (coupon.minOrder && subtotal < coupon.minOrder) return 0;

    if (coupon.type === 'PERCENT') {
        let discount = subtotal * (coupon.value / 100);
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
        }
        return Math.round(discount);
    } else if (coupon.type === 'FIXED') {
        return Math.min(coupon.value, subtotal);
    }
    return 0;
}

function renderCouponList(containerType) {
    const listContainer = document.getElementById(containerType === 'cart' ? 'cartCouponListContainer' : 'checkoutCouponListContainer');
    const badgeContainer = document.getElementById(containerType === 'cart' ? 'cartAppliedCouponBadge' : 'checkoutAppliedCouponBadge');

    const subtotal = (containerType === 'checkout' && currentCheckoutData && currentCheckoutData.subtotal > 0)
        ? currentCheckoutData.subtotal
        : cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const discount = calculateCouponDiscount(appliedCoupon, subtotal);

    // Active coupon badge
    if (badgeContainer) {
        if (appliedCoupon && discount > 0) {
            badgeContainer.style.display = 'block';
            badgeContainer.innerHTML = `
                <div class="voucher-applied-badge d-flex align-items-center justify-content-between">
                    <div class="d-flex align-items-center gap-1.5 text-truncate">
                        <i class="fas fa-check-circle text-success"></i>
                        <span class="text-truncate">Đang dùng mã: <strong class="text-success">${appliedCoupon}</strong> (-${formatCurrency(discount)})</span>
                    </div>
                    <button type="button" class="btn btn-sm btn-link text-danger p-0 fw-bold fs-9 text-decoration-none ms-2" onclick="removeCoupon()">
                        <i class="fas fa-times me-0.5"></i>Gỡ bỏ
                    </button>
                </div>
            `;
        } else {
            badgeContainer.style.display = 'none';
            badgeContainer.innerHTML = '';
        }
    }

    if (!listContainer) return;

    listContainer.innerHTML = AVAILABLE_COUPONS.map(coupon => {
        const isEligible = subtotal >= (coupon.minOrder || 0);
        const isApplied = appliedCoupon === coupon.code && discount > 0;

        let statusHtml = '';
        if (isApplied) {
            statusHtml = `
                <button type="button" class="btn btn-sm btn-success rounded-pill px-2.5 py-0.5 fs-9 fw-bold shadow-none" onclick="removeCoupon()">
                    <i class="fas fa-check me-1"></i>Đang dùng
                </button>
            `;
        } else if (isEligible) {
            statusHtml = `
                <button type="button" class="btn btn-sm btn-outline-primary rounded-pill px-2.5 py-0.5 fs-9 fw-bold" onclick="applyCoupon('${coupon.code}')">
                    Áp Dụng
                </button>
            `;
        } else {
            statusHtml = `
                <button type="button" class="btn btn-sm btn-secondary rounded-pill px-2 py-0.5 fs-9 disabled opacity-50" disabled>
                    Chưa đủ
                </button>
            `;
        }

        return `
            <div class="voucher-card ${isApplied ? 'applied' : (isEligible ? '' : 'disabled')}">
                <div class="flex-grow-1 text-start">
                    <div class="d-flex align-items-center gap-1.5 mb-0.5 flex-wrap">
                        <span class="voucher-code-badge">${coupon.code}</span>
                        <span class="badge ${coupon.badgeClass} fs-9 px-1.5 py-0.5">${coupon.badge}</span>
                        <span class="fw-bold text-dark fs-8">${coupon.title}</span>
                    </div>
                    <div class="text-muted fs-9">${coupon.desc}</div>
                    ${!isEligible ? `<div class="text-danger fs-9 mt-0.5"><i class="fas fa-exclamation-circle me-1"></i>Mua thêm <strong>${formatCurrency(coupon.minOrder - subtotal)}</strong> để dùng mã này</div>` : ''}
                </div>
                <div class="ms-2 flex-shrink-0 text-end">
                    ${statusHtml}
                </div>
            </div>
        `;
    }).join('');
}

function applyCoupon(code) {
    if (!code) return;
    const cleanCode = code.trim().toUpperCase();
    const coupon = AVAILABLE_COUPONS.find(c => c.code === cleanCode);
    if (!coupon) {
        showToast('Mã khuyến mãi "' + cleanCode + '" không tồn tại!', 'warning');
        return;
    }

    const subtotal = (currentCheckoutData && currentCheckoutData.subtotal > 0)
        ? currentCheckoutData.subtotal
        : cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (coupon.minOrder && subtotal < coupon.minOrder) {
        showToast('Đơn hàng cần tối thiểu ' + formatCurrency(coupon.minOrder) + ' để sử dụng mã này (còn thiếu ' + formatCurrency(coupon.minOrder - subtotal) + ')!', 'warning');
        return;
    }

    appliedCoupon = cleanCode;
    const discount = calculateCouponDiscount(appliedCoupon, subtotal);
    showToast('Áp dụng mã ' + cleanCode + ' thành công! Tiết kiệm ' + formatCurrency(discount), 'success');

    // Update both UI contexts
    updateCartUI();
    updateCheckoutDataWithCoupon();
}

function removeCoupon() {
    if (!appliedCoupon) return;
    const prev = appliedCoupon;
    appliedCoupon = null;
    showToast('Đã gỡ bỏ mã khuyến mãi ' + prev, 'info');

    updateCartUI();
    updateCheckoutDataWithCoupon();
}

function handleApplyCoupon() {
    const input = document.getElementById('couponCodeInput');
    if (!input) return;
    const val = input.value.trim().toUpperCase();
    if (!val) {
        showToast('Vui lòng nhập mã khuyến mãi!', 'warning');
        return;
    }
    applyCoupon(val);
    input.value = '';
}

function handleApplyCheckoutCoupon() {
    const input = document.getElementById('checkoutCouponInput');
    if (!input) return;
    const val = input.value.trim().toUpperCase();
    if (!val) {
        showToast('Vui lòng nhập mã khuyến mãi!', 'warning');
        return;
    }
    applyCoupon(val);
    input.value = '';
}

function toggleCouponList(type) {
    const listId = type === 'cart' ? 'cartCouponListContainer' : 'checkoutCouponListContainer';
    const textId = type === 'cart' ? 'cartCouponToggleText' : 'checkoutCouponToggleText';
    const chevronId = type === 'cart' ? 'cartCouponChevron' : 'checkoutCouponChevron';

    const listEl = document.getElementById(listId);
    const textEl = document.getElementById(textId);
    const chevronEl = document.getElementById(chevronId);

    if (!listEl) return;

    const isHidden = listEl.classList.contains('d-none') ||
        listEl.classList.contains('collapsed-coupons') ||
        listEl.style.display === 'none';

    if (isHidden) {
        listEl.classList.remove('d-none', 'collapsed-coupons');
        listEl.style.removeProperty('display');
        listEl.style.setProperty('display', 'flex', 'important');
        if (textEl) textEl.textContent = 'Ẩn danh sách mã';
        if (chevronEl) chevronEl.className = 'fas fa-chevron-up ms-1';
    } else {
        listEl.classList.add('d-none', 'collapsed-coupons');
        listEl.style.removeProperty('display');
        listEl.style.setProperty('display', 'none', 'important');
        const count = (typeof AVAILABLE_COUPONS !== 'undefined' && AVAILABLE_COUPONS.length) ? AVAILABLE_COUPONS.length : 3;
        if (textEl) textEl.textContent = 'Xem danh sách mã (' + count + ')';
        if (chevronEl) chevronEl.className = 'fas fa-chevron-down ms-1';
    }
}

function updateCheckoutDataWithCoupon() {
    if (!currentCheckoutData) return;

    const subtotal = currentCheckoutData.subtotal;
    const discountAmount = calculateCouponDiscount(appliedCoupon, subtotal);
    const finalTotal = Math.max(0, subtotal - discountAmount);

    currentCheckoutData.discountAmount = discountAmount;
    currentCheckoutData.finalTotal = finalTotal;

    // Update Step 1 elements
    const subtotalEl = document.getElementById('checkoutSubtotal');
    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);

    const discountRow = document.getElementById('checkoutDiscountRow');
    const discountLabel = document.getElementById('checkoutDiscountLabel');
    const discountEl = document.getElementById('checkoutDiscountAmount');
    if (discountRow && discountEl) {
        if (discountAmount > 0) {
            discountRow.classList.remove('d-none');
            if (discountLabel) discountLabel.innerHTML = `<i class="fas fa-tag me-1"></i>Mã giảm giá ${appliedCoupon}:`;
            discountEl.textContent = '-' + formatCurrency(discountAmount);
        } else {
            discountRow.classList.add('d-none');
        }
    }

    const finalTotalEl = document.getElementById('checkoutFinalTotal');
    if (finalTotalEl) finalTotalEl.textContent = formatCurrency(finalTotal);

    renderCouponList('checkout');
}

// ==========================================
// PAYMENT / CHECKOUT & ORDER FUNCTIONS
// ==========================================

// BIDV Account Details (Real account 5150739935)
const PAYMENT_ACCOUNT = {
    bank: 'BIDV',
    bankCode: '970418',
    accountNumber: '5150739935',
    accountName: 'HO SY THANH'
};

let currentCheckoutData = {
    orderCode: '',
    subtotal: 0,
    discountAmount: 0,
    finalTotal: 0,
    selectedMethod: 'COD',
    receiverName: '',
    receiverPhone: '',
    shippingAddress: '',
    note: '',
    items: []
};

let currentOrderFilter = 'ALL';
let myOrdersListCache = [];

function handleCheckout() {
    if (!requireLogin('tiến hành thanh toán')) {
        closeModal('cartModal');
        return;
    }
    if (cart.length === 0) {
        showToast('Giỏ hàng trống! Vui lòng chọn sách trước khi thanh toán.', 'warning');
        return;
    }
    const selectedItems = getSelectedCartItems();
    if (selectedItems.length === 0) {
        showToast('Vui lòng chọn ít nhất 1 sản phẩm để thanh toán!', 'warning');
        return;
    }

    const stoppedItem = selectedItems.find(item => item.status === 'STOPPED');
    if (stoppedItem) {
        showToast(`Sách "<b>${stoppedItem.title}</b>" đã ngừng kinh doanh. Vui lòng xóa khỏi giỏ hàng trước khi đặt hàng!`, 'danger');
        return;
    }

    const overStockItem = selectedItems.find(item => {
        const b = BOOK_CATALOG.find(x => x.id === item.id);
        const s = (b && b.stockQuantity !== undefined && b.stockQuantity !== null) ? b.stockQuantity : (item.stockQuantity != null ? item.stockQuantity : 99);
        return item.quantity > s;
    });
    if (overStockItem) {
        const b = BOOK_CATALOG.find(x => x.id === overStockItem.id);
        const s = (b && b.stockQuantity !== undefined && b.stockQuantity !== null) ? b.stockQuantity : overStockItem.stockQuantity;
        showToast(`Kho không đủ sách cho cuốn "<b>${overStockItem.title}</b>"! Bạn chọn ${overStockItem.quantity} cuốn nhưng kho chỉ còn <b>${s}</b> cuốn. Vui lòng giảm số lượng.`, 'danger');
        return;
    }

    closeModal('cartModal');
    setTimeout(() => openPaymentModal(), 300);
}

function openPaymentModal() {
    if (!requireLogin('tiến hành đặt hàng và thanh toán')) {
        return;
    }
    // Chỉ lấy items được tick
    const selectedItems = getSelectedCartItems();
    if (selectedItems.length === 0) {
        showToast('Vui lòng chọn ít nhất 1 sản phẩm để thanh toán!', 'warning');
        return;
    }

    const stoppedItem = selectedItems.find(item => item.status === 'STOPPED');
    if (stoppedItem) {
        showToast(`Sách "<b>${stoppedItem.title}</b>" đã ngừng kinh doanh, không thể đặt hàng!`, 'danger');
        return;
    }

    const overStockItem = selectedItems.find(item => {
        const b = BOOK_CATALOG.find(x => x.id === item.id);
        const s = (b && b.stockQuantity !== undefined && b.stockQuantity !== null) ? b.stockQuantity : (item.stockQuantity != null ? item.stockQuantity : 99);
        return item.quantity > s;
    });
    if (overStockItem) {
        const b = BOOK_CATALOG.find(x => x.id === overStockItem.id);
        const s = (b && b.stockQuantity !== undefined && b.stockQuantity !== null) ? b.stockQuantity : overStockItem.stockQuantity;
        showToast(`Kho không đủ sách cho cuốn "<b>${overStockItem.title}</b>"! Bạn chọn ${overStockItem.quantity} cuốn nhưng kho chỉ còn <b>${s}</b> cuốn. Vui lòng giảm số lượng.`, 'danger');
        return;
    }

    const subtotal = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discountAmount = calculateCouponDiscount(appliedCoupon, subtotal);
    const finalTotal = Math.max(0, subtotal - discountAmount);

    const orderCode = 'BM-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    currentCheckoutData = {
        orderCode: orderCode,
        subtotal: subtotal,
        discountAmount: discountAmount,
        finalTotal: finalTotal,
        selectedMethod: 'COD',
        receiverName: (currentUser && currentUser.fullName) ? currentUser.fullName : '',
        receiverPhone: (currentUser && currentUser.phone) ? currentUser.phone : '',
        shippingAddress: localStorage.getItem('bookmind_saved_address') || '',
        note: '',
        items: [...selectedItems]  // Chỉ các sản phẩm được chọn
    };

    // Pre-fill form fields
    const nameInput = document.getElementById('checkoutReceiverName');
    const phoneInput = document.getElementById('checkoutReceiverPhone');
    const addrInput = document.getElementById('checkoutShippingAddress');
    const noteInput = document.getElementById('checkoutOrderNote');

    if (nameInput) nameInput.value = currentCheckoutData.receiverName;
    if (phoneInput) phoneInput.value = currentCheckoutData.receiverPhone;
    if (addrInput) addrInput.value = currentCheckoutData.shippingAddress;
    if (noteInput) noteInput.value = '';

    // Render Order Items Summary in Step 1 (chỉ items được chọn)
    const orderItemsEl = document.getElementById('checkoutOrderItemsList');
    if (orderItemsEl) {
        orderItemsEl.innerHTML = currentCheckoutData.items.map(item => `
            <div class="d-flex align-items-center justify-content-between py-1.5 border-bottom fs-8">
                <div class="d-flex align-items-center gap-2 text-truncate" style="max-width: 190px;">
                    <img src="${item.image}" alt="${escapeHtml(item.title)}" class="rounded border" style="width: 28px; height: 36px; object-fit: cover;">
                    <span class="text-truncate fw-semibold text-dark">${escapeHtml(item.title)}</span>
                </div>
                <div class="text-end text-nowrap ms-2">
                    <span class="text-muted fs-9">${item.quantity}x</span>
                    <span class="fw-bold text-dark">${formatCurrency(item.price * item.quantity)}</span>
                </div>
            </div>
        `).join('');
    }

    updateCheckoutDataWithCoupon();

    // Reset payment method to COD
    selectPaymentMethod('COD');

    // Show Step 1 view
    showPaymentStep(1);

    openModal('paymentModal');
}

function selectPaymentMethod(method) {
    currentCheckoutData.selectedMethod = method;

    const cardCOD = document.getElementById('cardMethodCOD');
    const cardQR = document.getElementById('cardMethodQR');
    const cardVNPAY = document.getElementById('cardMethodVNPAY');
    const radioCOD = document.getElementById('payMethodCOD');
    const radioQR = document.getElementById('payMethodQR');
    const radioVNPAY = document.getElementById('payMethodVNPAY');
    const submitBtn = document.getElementById('btnSubmitOrder');

    if (cardCOD) cardCOD.classList.remove('selected');
    if (cardQR) cardQR.classList.remove('selected');
    if (cardVNPAY) cardVNPAY.classList.remove('selected');

    if (method === 'COD') {
        if (cardCOD) cardCOD.classList.add('selected');
        if (radioCOD) radioCOD.checked = true;
        if (submitBtn) {
            submitBtn.className = 'btn btn-primary rounded-pill py-2.5 fw-bold fs-7 shadow-sm';
            submitBtn.style.background = '';
            submitBtn.style.borderColor = '';
            submitBtn.innerHTML = '<i class="fas fa-check-circle me-1"></i> Xác Nhận Đặt Hàng (COD)';
        }
    } else if (method === 'QR_TRANSFER') {
        if (cardQR) cardQR.classList.add('selected');
        if (radioQR) radioQR.checked = true;
        if (submitBtn) {
            submitBtn.className = 'btn rounded-pill py-2.5 fw-bold fs-7 shadow-sm text-white';
            submitBtn.style.background = 'linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%)';
            submitBtn.style.borderColor = '#d32f2f';
            submitBtn.innerHTML = '<i class="fas fa-qrcode me-1"></i> Quét Mã QR Chuyển Khoản BIDV <i class="fas fa-arrow-right ms-1"></i>';
        }
    } else if (method === 'VNPAY') {
        if (cardVNPAY) cardVNPAY.classList.add('selected');
        if (radioVNPAY) radioVNPAY.checked = true;
        if (submitBtn) {
            submitBtn.className = 'btn rounded-pill py-2.5 fw-bold fs-7 shadow-sm text-white';
            submitBtn.style.background = 'linear-gradient(135deg, #005baa 0%, #0088cc 100%)';
            submitBtn.style.borderColor = '#005baa';
            submitBtn.innerHTML = '<i class="fas fa-credit-card me-1"></i> Thanh Toán Qua Cổng VNPay <i class="fas fa-arrow-right ms-1"></i>';
        }
    }
}

function generateVietQR(amount, content) {
    const qrImg = document.getElementById('qrCodeImg');
    const qrLoading = document.getElementById('qrLoading');
    const displayAccount = document.getElementById('displayAccountNum');
    const transferEl = document.getElementById('transferContent');

    if (displayAccount) displayAccount.textContent = PAYMENT_ACCOUNT.accountNumber;
    if (transferEl) transferEl.textContent = content;

    const roundedAmount = Math.round(amount || 0);

    if (qrLoading) qrLoading.style.display = 'flex';
    if (qrImg) {
        qrImg.style.display = 'none';

        // VietQR QuickLink API format
        const qrUrl = `https://img.vietqr.io/image/${PAYMENT_ACCOUNT.bankCode}-${PAYMENT_ACCOUNT.accountNumber}-compact2.png?amount=${roundedAmount}&addInfo=${encodeURIComponent(content)}&accountName=${encodeURIComponent(PAYMENT_ACCOUNT.accountName)}`;

        qrImg.onload = () => {
            if (qrLoading) qrLoading.style.display = 'none';
            qrImg.style.display = 'block';
        };
        qrImg.onerror = () => {
            if (qrLoading) qrLoading.style.display = 'none';
            qrImg.style.display = 'block';
            qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`BIDV ${PAYMENT_ACCOUNT.accountNumber} ${content} ${roundedAmount}`)}`;
        };
        qrImg.src = qrUrl;
    }
}

function copyAccountNumber() {
    const text = PAYMENT_ACCOUNT.accountNumber || '5150739935';
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Đã sao chép số tài khoản: ' + text, 'success');
        }).catch(() => {
            showToast('Số tài khoản: ' + text, 'info');
        });
    } else {
        showToast('Số tài khoản: ' + text, 'info');
    }
}

function copyTransferContent() {
    const el = document.getElementById('transferContent');
    const text = el ? el.textContent.trim() : (currentCheckoutData.orderCode || '');
    if (text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                showToast('Đã sao chép nội dung chuyển khoản: ' + text, 'success');
            }).catch(() => {
                showToast('Nội dung chuyển khoản: ' + text, 'info');
            });
        } else {
            showToast('Nội dung chuyển khoản: ' + text, 'info');
        }
    }
}

// State tracking for QR Payment verification
let isPaymentVerified = false;
let paymentVerificationTimer = null;
let paymentPollingInterval = null;
let currentCreatedOrderId = null;

function stopPaymentPolling() {
    if (paymentPollingInterval) {
        clearInterval(paymentPollingInterval);
        paymentPollingInterval = null;
    }
}

function stopPaymentCheck() {
    stopPaymentPolling();
    if (paymentVerificationTimer) {
        clearInterval(paymentVerificationTimer);
        paymentVerificationTimer = null;
    }
}

function startPaymentPolling(trackingNumber) {
    stopPaymentPolling();
    if (!trackingNumber) return;

    paymentPollingInterval = setInterval(async () => {
        try {
            const res = await fetch(`/api/orders/check-payment/${encodeURIComponent(trackingNumber)}`);
            if (res.ok) {
                const result = await res.json();
                const data = (result && result.data) ? result.data : result;
                if (data && (data.paid === true || data.isPaid === true)) {
                    stopPaymentPolling();
                    handlePaymentWebhookReceived(data);
                }
            }
        } catch (e) {
            console.warn('Polling check-payment error:', e);
        }
    }, 2000);
}


function handlePaymentWebhookReceived(data) {
    stopPaymentCheck();
    isPaymentVerified = true;
    if (data && data.orderId) {
        currentCreatedOrderId = data.orderId;
    }

    const amountPaid = (data && data.amount) ? data.amount : (currentCheckoutData ? currentCheckoutData.finalTotal : 0);
    const trackingNum = (data && data.trackingNumber) ? data.trackingNumber : (currentCheckoutData ? currentCheckoutData.orderCode : '');

    // Fill Step 3 UI directly
    const codeEl = document.getElementById('confirmedOrderCode');
    if (codeEl) codeEl.textContent = trackingNum;

    const methodBadge = document.getElementById('confirmedPaymentMethod');
    if (methodBadge) {
        methodBadge.className = 'badge bg-success-subtle text-success fw-bold fs-8';
        methodBadge.textContent = '✓ Chuyển khoản VietQR - Hệ thống tự động xác nhận';
    }

    const recNameEl = document.getElementById('confirmedReceiver');
    if (recNameEl && currentCheckoutData) recNameEl.textContent = currentCheckoutData.receiverName;

    const recPhoneEl = document.getElementById('confirmedPhone');
    if (recPhoneEl && currentCheckoutData) recPhoneEl.textContent = currentCheckoutData.receiverPhone;

    const recAddrEl = document.getElementById('confirmedAddress');
    if (recAddrEl && currentCheckoutData) recAddrEl.textContent = currentCheckoutData.shippingAddress;

    const titleEl = document.getElementById('paymentSuccessTitle');
    if (titleEl) titleEl.textContent = 'Thanh Toán & Đặt Hàng Thành Công! 🎉';

    // Clear cart
    cart = [];
    appliedCoupon = null;
    updateCartUI();
    if (currentCheckoutData) saveLocalOrder({
        id: currentCreatedOrderId || Date.now(),
        trackingNumber: trackingNum,
        createdAt: new Date().toISOString(),
        receiverName: currentCheckoutData.receiverName,
        receiverPhone: currentCheckoutData.receiverPhone,
        shippingAddress: currentCheckoutData.shippingAddress,
        totalAmount: currentCheckoutData.finalTotal,
        status: 'CONFIRMED',
        paymentMethod: 'VIETQR',
        items: currentCheckoutData.items
    });

    // Show immediate toast then jump to Step 3
    showToast(`🎉 BIDV xác nhận nhận tiền ${formatCurrency(amountPaid)}! Đơn hàng đặt thành công.`, 'success');
    setTimeout(() => showPaymentStep(3), 700);
}

async function simulatePaymentWebhook() {
    const orderCode = currentCheckoutData ? currentCheckoutData.orderCode : null;
    const amount = currentCheckoutData ? currentCheckoutData.finalTotal : 0;
    if (!orderCode) {
        showToast('Không tìm thấy mã đơn hàng để giả lập!', 'warning');
        return;
    }

    const btn = document.getElementById('btnSimulateWebhook');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Đang ghi nhận...';
    }

    try {
        const payload = {
            orderCode: orderCode,
            amount: amount,
            gateway: 'BIDV-VietQR'
        };
        const res = await fetch('/api/webhook/payment/simulate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (result.success && result.data) {
            handlePaymentWebhookReceived(result.data);
        } else {
            // Backend failed but we still auto-confirm for demo
            handlePaymentWebhookReceived({
                paid: true,
                amount: amount,
                trackingNumber: orderCode,
                orderId: currentCreatedOrderId
            });
        }
    } catch (e) {
        console.warn('Webhook API error, using local fallback:', e);
        // Always auto-confirm even if API is down
        handlePaymentWebhookReceived({
            paid: true,
            amount: amount,
            trackingNumber: orderCode,
            orderId: currentCreatedOrderId
        });
    }
}

function openInvoicePrintView(orderId) {
    const targetId = orderId || currentCreatedOrderId;
    if (!targetId) {
        showToast('Chưa có thông tin hóa đơn cho đơn hàng này!', 'warning');
        return;
    }
    const printUrl = `/api/orders/${targetId}/invoice/print`;
    window.open(printUrl, '_blank', 'width=900,height=950,scrollbars=yes,resizable=yes');
}

function resetPaymentVerificationState() {
    stopPaymentCheck();
    isPaymentVerified = false;

    const pendingBox = document.getElementById('qrPaymentPendingBox');
    const successBox = document.getElementById('qrPaymentSuccessBox');
    const warnBox = document.getElementById('paymentCheckWarning');
    const confirmBtn = document.getElementById('btnConfirmPayment');
    const manualBtn = document.getElementById('btnManualCheckPayment');
    const refInput = document.getElementById('bankTransactionRef');

    if (pendingBox) pendingBox.style.display = 'block';
    if (successBox) successBox.style.display = 'none';
    if (warnBox) warnBox.style.display = 'none';
    if (refInput) refInput.value = '';

    if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.className = 'btn btn-outline-primary rounded-pill px-4 fw-bold fs-8 shadow-sm';
        confirmBtn.innerHTML = '<i class="fas fa-sync-alt me-1"></i> Tôi Đã Chuyển Khoản';
        confirmBtn.style.cursor = 'pointer';
        confirmBtn.classList.remove('btn-pulse-glow');
    }

    if (manualBtn) {
        manualBtn.disabled = false;
        manualBtn.innerHTML = '<i class="fas fa-sync-alt me-1"></i>Kiểm tra ngay';
    }
}

function triggerPaymentSuccess(refCode = '') {
    stopPaymentCheck();
    isPaymentVerified = true;

    const pendingBox = document.getElementById('qrPaymentPendingBox');
    const successBox = document.getElementById('qrPaymentSuccessBox');
    const verifiedAmountEl = document.getElementById('verifiedPaymentAmount');
    const confirmBtn = document.getElementById('btnConfirmPayment');

    if (pendingBox) pendingBox.style.display = 'none';
    if (successBox) {
        successBox.style.display = 'block';
        if (verifiedAmountEl && currentCheckoutData) {
            const extra = refCode ? ` (Mã GD: ${refCode})` : '';
            verifiedAmountEl.textContent = formatCurrency(currentCheckoutData.finalTotal) + extra;
        }
    }

    if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.className = 'btn btn-success rounded-pill px-4 fw-bold fs-8 shadow-sm btn-pulse-glow';
        confirmBtn.innerHTML = '<i class="fas fa-check-circle me-2"></i>Đã Thanh Toán Thành Công';
        confirmBtn.style.cursor = 'pointer';
    }

    showToast('BIDV: Đã xác thực thành công ' + formatCurrency(currentCheckoutData ? currentCheckoutData.finalTotal : 0) + '! Đang chuyển đến đơn hàng...', 'success');
    setTimeout(() => {
        handlePaymentWebhookReceived({
            paid: true,
            amount: currentCheckoutData ? currentCheckoutData.finalTotal : 0,
            trackingNumber: currentCheckoutData ? currentCheckoutData.orderCode : '',
            orderId: currentCreatedOrderId
        });
    }, 600);
}

async function manualCheckPayment() {
    if (isPaymentVerified) {
        showPaymentStep(3);
        return;
    }
    const manualBtn = document.getElementById('btnManualCheckPayment');
    const confirmBtn = document.getElementById('btnConfirmPayment');
    const warnBox = document.getElementById('paymentCheckWarning');

    if (manualBtn) {
        manualBtn.disabled = true;
        manualBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Đang đối soát BIDV...';
    }
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i>Đang đối soát BIDV...';
    }

    const orderCode = currentCheckoutData ? currentCheckoutData.orderCode : '';

    // 1. Kiểm tra trạng thái thực tế từ Backend / Webhook SePay BIDV
    try {
        const res = await fetch(`/api/orders/check-payment/${encodeURIComponent(orderCode)}`);
        if (res.ok) {
            const result = await res.json();
            const data = (result && result.data) ? result.data : result;
            if (data && (data.paid === true || data.isPaid === true)) {
                if (manualBtn) {
                    manualBtn.disabled = false;
                    manualBtn.innerHTML = '<i class="fas fa-check-circle text-success me-1"></i>Đã thanh toán';
                }
                if (confirmBtn) {
                    confirmBtn.disabled = false;
                    confirmBtn.className = 'btn btn-success rounded-pill px-4 fw-bold fs-8 shadow-sm';
                    confirmBtn.innerHTML = '<i class="fas fa-check-circle me-1"></i>Đã nhận tiền!';
                }
                showToast(`🎉 BIDV xác nhận đã nhận ${formatCurrency(data.amount || currentCheckoutData.finalTotal)}!`, 'success');
                handlePaymentWebhookReceived(data);
                return;
            }
        }
    } catch (e) {
        console.warn('Check payment error:', e);
    }

    // 2. NẾU CHƯA CÓ TIỀN VÀO TÀI KHOẢN: TUYỆT ĐỐI KHÔNG CHO QUA!
    if (manualBtn) {
        manualBtn.disabled = false;
        manualBtn.innerHTML = '<i class="fas fa-sync-alt me-1"></i>Kiểm tra ngay';
    }
    if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.className = 'btn btn-outline-primary rounded-pill px-4 fw-bold fs-8 shadow-sm';
        confirmBtn.innerHTML = '<i class="fas fa-sync-alt me-1"></i> Tôi Đã Chuyển Khoản';
    }

    if (warnBox) {
        warnBox.style.display = 'block';
        warnBox.innerHTML = `
            <div class="d-flex align-items-start gap-2 text-start">
                <i class="fas fa-exclamation-triangle text-danger mt-1 fs-6"></i>
                <div class="fs-8">
                    <strong class="text-danger">Tài khoản BIDV chưa nhận được tiền!</strong><br>
                    <span>Hệ thống chưa tìm thấy giao dịch khớp với mã đơn <strong>${orderCode}</strong>. Quý khách vui lòng quét mã QR hoặc chuyển khoản chính xác nội dung trên. Nếu vừa chuyển tiền xong, vui lòng đợi 3–5 giây rồi nhấn lại <strong>"Tôi Đã Chuyển Khoản"</strong>.</span>
                </div>
            </div>`;
    }

    showToast('Tài khoản BIDV chưa nhận được tiền cho mã đơn này! Quý khách vui lòng chuyển khoản và thử lại.', 'warning');
}

async function verifyBankTransactionRef() {
    const refInput = document.getElementById('bankTransactionRef');
    const refVal = refInput ? refInput.value.trim() : '';

    if (!refVal || refVal.length < 5) {
        showToast('Vui lòng nhập Mã giao dịch / Mã FT hợp lệ từ biên lai App ngân hàng (ít nhất 5 ký tự)!', 'warning');
        if (refInput) refInput.focus();
        return;
    }

    const warnBox = document.getElementById('paymentCheckWarning');
    if (warnBox) warnBox.style.display = 'none';

    showToast('Đang đối soát mã GD ' + refVal + ' với ngân hàng BIDV...', 'info');

    const orderCode = currentCheckoutData ? currentCheckoutData.orderCode : '';
    try {
        const res = await fetch(`/api/orders/check-payment/${encodeURIComponent(orderCode)}`);
        if (res.ok) {
            const result = await res.json();
            const data = (result && result.data) ? result.data : result;
            if (data && (data.paid === true || data.isPaid === true)) {
                if (currentCheckoutData) currentCheckoutData.bankTransactionRef = refVal;
                triggerPaymentSuccess(refVal);
                return;
            }
        }
    } catch (e) {
        console.warn('Check transaction ref error:', e);
    }

    if (warnBox) {
        warnBox.style.display = 'block';
        warnBox.innerHTML = `
            <div class="d-flex align-items-start gap-2 text-start">
                <i class="fas fa-exclamation-triangle text-danger mt-1 fs-6"></i>
                <div class="fs-8">
                    <strong class="text-danger">Chưa tìm thấy mã giao dịch ${refVal}!</strong><br>
                    <span>Hệ thống chưa ghi nhận biến động số dư khớp với mã giao dịch này trên tài khoản BIDV. Vui lòng kiểm tra lại biên lai chuyển khoản.</span>
                </div>
            </div>`;
    }
    showToast('Chưa ghi nhận biến động số dư cho mã giao dịch ' + refVal + '!', 'warning');
}

function showPaymentStep(step) {
    const step1 = document.getElementById('paymentStep1');
    const step2 = document.getElementById('paymentStep2');
    const step3 = document.getElementById('paymentStep3');
    const footer = document.getElementById('paymentFooter');

    const ind1 = document.getElementById('step1Indicator');
    const ind2 = document.getElementById('step2Indicator');
    const ind3 = document.getElementById('step3Indicator');

    const headerTitle = document.getElementById('paymentHeaderTitle');
    const headerSubtitle = document.getElementById('paymentHeaderSubtitle');
    const headerIcon = document.getElementById('paymentHeaderIcon');

    if (step === 1) {
        stopPaymentCheck();
        if (step1) step1.style.display = '';
        if (step2) step2.style.display = 'none';
        if (step3) step3.style.display = 'none';
        if (footer) footer.style.display = 'none';

        if (ind1) { ind1.className = 'payment-step active'; }
        if (ind2) { ind2.className = 'payment-step'; }
        if (ind3) { ind3.className = 'payment-step'; }

        if (headerTitle) headerTitle.textContent = 'Đặt Hàng & Thanh Toán';
        if (headerSubtitle) headerSubtitle.textContent = 'Giao hàng tận nơi toàn quốc · BookMind AI Store';
        if (headerIcon) headerIcon.innerHTML = '<i class="fas fa-shipping-fast"></i>';
    } else if (step === 2) {
        if (step1) step1.style.display = 'none';
        if (step2) step2.style.display = '';
        if (step3) step3.style.display = 'none';
        if (footer) footer.style.display = 'flex';

        if (ind1) { ind1.className = 'payment-step done'; }
        if (ind2) { ind2.className = 'payment-step active'; }
        if (ind3) { ind3.className = 'payment-step'; }

        if (headerTitle) headerTitle.textContent = 'Thanh Toán Trực Tiếp (VietQR)';
        if (headerSubtitle) headerSubtitle.textContent = 'Quét QR qua ứng dụng ngân hàng hoặc ví điện tử · BIDV';
        if (headerIcon) headerIcon.innerHTML = '<i class="fas fa-qrcode"></i>';

        resetPaymentVerificationState();
    } else if (step === 3) {
        stopPaymentCheck();
        if (step1) step1.style.display = 'none';
        if (step2) step2.style.display = 'none';
        if (step3) step3.style.display = '';
        if (footer) footer.style.display = 'none';

        if (ind1) { ind1.className = 'payment-step done'; }
        if (ind2) { ind2.className = 'payment-step done'; }
        if (ind3) { ind3.className = 'payment-step active done'; }

        if (headerTitle) headerTitle.textContent = 'Đặt Hàng Thành Công!';
        if (headerSubtitle) headerSubtitle.textContent = 'Đơn hàng của bạn đã được ghi nhận vào hệ thống';
        if (headerIcon) headerIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
    }
}

function processCheckoutSubmit() {
    if (!requireLogin('hoàn tất đặt hàng')) {
        closeModal('paymentModal');
        return;
    }
    const name = document.getElementById('checkoutReceiverName')?.value.trim();
    const phone = document.getElementById('checkoutReceiverPhone')?.value.trim();
    const address = document.getElementById('checkoutShippingAddress')?.value.trim();
    const note = document.getElementById('checkoutOrderNote')?.value.trim();

    if (!name) {
        showToast('Vui lòng nhập họ tên người nhận hàng!', 'warning');
        document.getElementById('checkoutReceiverName')?.focus();
        return;
    }

    if (!phone) {
        showToast('Vui lòng nhập số điện thoại nhận hàng!', 'warning');
        document.getElementById('checkoutReceiverPhone')?.focus();
        return;
    }

    if (!address) {
        showToast('Vui lòng nhập địa chỉ giao hàng chi tiết!', 'warning');
        document.getElementById('checkoutShippingAddress')?.focus();
        return;
    }

    // Save address for next purchases
    try {
        localStorage.setItem('bookmind_saved_address', address);
    } catch (e) { }

    currentCheckoutData.receiverName = name;
    currentCheckoutData.receiverPhone = phone;
    currentCheckoutData.shippingAddress = address;
    currentCheckoutData.note = note;

    if (currentCheckoutData.selectedMethod === 'QR_TRANSFER') {
        const submitBtn = document.getElementById('btnSubmitOrder');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Đang kết nối PayOS VietQR...';
        }

        const payload = {
            userId: (currentUser && currentUser.id) ? currentUser.id : null,
            receiverName: currentCheckoutData.receiverName,
            receiverPhone: currentCheckoutData.receiverPhone,
            shippingAddress: currentCheckoutData.shippingAddress,
            note: currentCheckoutData.note,
            trackingNumber: currentCheckoutData.orderCode,
            paymentMethod: 'VIETQR',
            subtotal: currentCheckoutData.subtotal,
            shippingFee: 0,
            totalAmount: currentCheckoutData.finalTotal,
            items: currentCheckoutData.items.map(item => ({
                bookId: item.id,
                title: item.title,
                author: item.author,
                quantity: item.quantity,
                price: item.price
            }))
        };

        fetch('/api/payment/payos/create-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(result => {
            if (submitBtn) submitBtn.disabled = false;
            if (result.success && result.data && result.data.checkoutUrl) {
                saveLocalOrder({
                    id: result.data.orderId || Date.now(),
                    trackingNumber: result.data.trackingNumber || currentCheckoutData.orderCode,
                    createdAt: new Date().toISOString(),
                    receiverName: currentCheckoutData.receiverName,
                    receiverPhone: currentCheckoutData.receiverPhone,
                    shippingAddress: currentCheckoutData.shippingAddress,
                    totalAmount: currentCheckoutData.finalTotal,
                    status: 'PENDING',
                    paymentMethod: 'VIETQR',
                    items: currentCheckoutData.items
                });

                showToast('Chuyển hướng đến cổng thanh toán PayOS VietQR...', 'info');
                setTimeout(() => {
                    window.location.href = result.data.checkoutUrl;
                }, 300);
            } else {
                console.info('PayOS not configured with live credentials, fallback to local QR:', result.message);
                fallbackToLocalVietQR();
            }
        })
        .catch(err => {
            console.warn('PayOS API error, using local VietQR modal:', err);
            if (submitBtn) submitBtn.disabled = false;
            fallbackToLocalVietQR();
        });
        return;
    }

    if (currentCheckoutData.selectedMethod === 'VNPAY') {
        const submitBtn = document.getElementById('btnSubmitOrder');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-1"></i> Đang kết nối VNPay Sandbox...';
        }

        const payload = {
            userId: (currentUser && currentUser.id) ? currentUser.id : null,
            receiverName: currentCheckoutData.receiverName,
            receiverPhone: currentCheckoutData.receiverPhone,
            shippingAddress: currentCheckoutData.shippingAddress,
            note: currentCheckoutData.note,
            trackingNumber: currentCheckoutData.orderCode,
            paymentMethod: 'VNPAY',
            subtotal: currentCheckoutData.subtotal,
            shippingFee: 0,
            totalAmount: currentCheckoutData.finalTotal,
            items: currentCheckoutData.items.map(item => ({
                bookId: item.id,
                title: item.title,
                author: item.author,
                quantity: item.quantity,
                price: item.price
            }))
        };

        fetch('/api/payment/vnpay/create-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(res => res.json())
        .then(result => {
            if (result.success && result.data && result.data.paymentUrl) {
                saveLocalOrder({
                    id: result.data.orderId || Date.now(),
                    trackingNumber: result.data.trackingNumber || currentCheckoutData.orderCode,
                    createdAt: new Date().toISOString(),
                    receiverName: currentCheckoutData.receiverName,
                    receiverPhone: currentCheckoutData.receiverPhone,
                    shippingAddress: currentCheckoutData.shippingAddress,
                    totalAmount: currentCheckoutData.finalTotal,
                    status: 'PENDING',
                    paymentMethod: 'VNPAY',
                    items: currentCheckoutData.items
                });

                showToast('Đang chuyển hướng sang cổng thanh toán VNPay Sandbox...', 'info');
                setTimeout(() => {
                    window.location.href = result.data.paymentUrl;
                }, 300);
            } else {
                throw new Error(result.message || 'Không thể tạo URL thanh toán VNPay');
            }
        })
        .catch(err => {
            console.error('VNPay checkout error:', err);
            showToast('Lỗi kết nối VNPay: ' + err.message, 'error');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-credit-card me-1"></i> Thử Lại Thanh Toán VNPay <i class="fas fa-arrow-right ms-1"></i>';
            }
        });
    } else {
        // COD checkout immediate completion
        saveOrderToBackendAndFinish('COD');
    }
}

function fallbackToLocalVietQR() {
    const orderCode = currentCheckoutData.orderCode;
    generateVietQR(currentCheckoutData.finalTotal, orderCode);
    createPendingQROrder(orderCode);

    const itemsEl = document.getElementById('paymentOrderItems');
    if (itemsEl) {
        itemsEl.innerHTML = currentCheckoutData.items.map(item => `
            <div class="d-flex justify-content-between py-1 border-bottom fs-8">
                <span class="text-truncate" style="max-width: 200px;">${escapeHtml(item.title)} (x${item.quantity})</span>
                <span class="fw-semibold">${formatCurrency(item.price * item.quantity)}</span>
            </div>
        `).join('');
    }
    const totalEl = document.getElementById('paymentTotalAmount');
    if (totalEl) totalEl.textContent = formatCurrency(currentCheckoutData.finalTotal);

    showPaymentStep(2);
}

async function createPendingQROrder(trackingNumber) {
    const payload = {
        userId: (currentUser && currentUser.id) ? currentUser.id : null,
        receiverName: currentCheckoutData.receiverName,
        receiverPhone: currentCheckoutData.receiverPhone,
        shippingAddress: currentCheckoutData.shippingAddress,
        note: currentCheckoutData.note,
        trackingNumber: trackingNumber,
        paymentMethod: 'VIETQR',
        subtotal: currentCheckoutData.subtotal,
        shippingFee: 0,
        totalAmount: currentCheckoutData.finalTotal,
        items: currentCheckoutData.items.map(item => ({
            bookId: item.id,
            title: item.title,
            author: item.author,
            quantity: item.quantity,
            price: item.price
        }))
    };

    try {
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (res.ok && result.success) {
            currentCheckoutData.backendOrder = result.data;
            currentCreatedOrderId = result.data.id;
        }
    } catch (e) {
        console.warn('Backend pre-create order failed', e);
    }
    startPaymentPolling(trackingNumber);
}

function backToStep1() {
    stopPaymentCheck();
    isPaymentVerified = false;
    showPaymentStep(1);
}

function backToCartModal() {
    stopPaymentCheck();
    closeModal('paymentModal');
    openModal('cartModal');
}

function confirmPaymentDone() {
    if (!isPaymentVerified) {
        showToast('Hệ thống chưa nhận được thanh toán! Vui lòng quét mã QR hoặc bấm "Kiểm tra ngay" sau khi chuyển khoản.', 'warning');
        return;
    }
    stopPaymentCheck();
    if (currentCheckoutData && currentCheckoutData.backendOrder) {
        cart = [];
        appliedCoupon = null;
        updateCartUI();
        showPaymentStep(3);
    } else {
        saveOrderToBackendAndFinish('VIETQR');
    }
}

async function saveOrderToBackendAndFinish(paymentMethod) {
    const payload = {
        userId: (currentUser && currentUser.id) ? currentUser.id : null,
        receiverName: currentCheckoutData.receiverName,
        receiverPhone: currentCheckoutData.receiverPhone,
        shippingAddress: currentCheckoutData.shippingAddress,
        note: currentCheckoutData.note,
        paymentMethod: paymentMethod,
        subtotal: currentCheckoutData.subtotal,
        shippingFee: 0,
        totalAmount: currentCheckoutData.finalTotal,
        items: currentCheckoutData.items.map(item => ({
            bookId: item.id,
            title: item.title,
            author: item.author,
            quantity: item.quantity,
            price: item.price
        }))
    };

    let createdOrder = null;

    try {
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await res.json();
        if (res.ok && result.success) {
            createdOrder = result.data;
            currentCreatedOrderId = createdOrder.id;
        }
    } catch (e) {
        console.warn('Backend API /api/orders not reachable, fallback to local storage', e);
    }

    // Fallback local persistence if offline
    if (!createdOrder) {
        createdOrder = {
            id: Date.now(),
            trackingNumber: currentCheckoutData.orderCode,
            createdAt: new Date().toISOString(),
            receiverName: currentCheckoutData.receiverName,
            receiverPhone: currentCheckoutData.receiverPhone,
            shippingAddress: currentCheckoutData.shippingAddress,
            note: currentCheckoutData.note,
            subtotal: currentCheckoutData.subtotal,
            shippingFee: 0,
            totalAmount: currentCheckoutData.finalTotal,
            status: 'PENDING',
            statusLabel: 'Chờ xác nhận',
            statusCode: 1,
            paymentMethod: paymentMethod,
            paymentStatus: paymentMethod === 'QR_TRANSFER' ? 'COMPLETED' : 'PENDING',
            items: currentCheckoutData.items
        };
    }

    // Save to local storage cache
    saveLocalOrder(createdOrder);

    // Clear cart
    cart = [];
    appliedCoupon = null;
    updateCartUI();

    // Fill Step 3 UI
    const codeEl = document.getElementById('confirmedOrderCode');
    if (codeEl) codeEl.textContent = createdOrder.trackingNumber || currentCheckoutData.orderCode;

    const methodBadge = document.getElementById('confirmedPaymentMethod');
    if (methodBadge) {
        if (paymentMethod === 'COD') {
            methodBadge.className = 'badge bg-secondary-subtle text-secondary fw-bold fs-8';
            methodBadge.textContent = 'Thanh toán khi nhận hàng (COD)';
        } else {
            methodBadge.className = 'badge bg-success-subtle text-success fw-bold fs-8';
            methodBadge.textContent = 'Chuyển khoản trực tiếp (Đã thanh toán)';
        }
    }

    const recNameEl = document.getElementById('confirmedReceiver');
    if (recNameEl) recNameEl.textContent = createdOrder.receiverName;

    const recPhoneEl = document.getElementById('confirmedPhone');
    if (recPhoneEl) recPhoneEl.textContent = createdOrder.receiverPhone;

    const recAddrEl = document.getElementById('confirmedAddress');
    if (recAddrEl) recAddrEl.textContent = createdOrder.shippingAddress;

    const titleEl = document.getElementById('paymentSuccessTitle');
    if (titleEl) {
        titleEl.textContent = paymentMethod === 'COD' ? 'Đặt Hàng Thành Công! 🎉' : 'Thanh Toán & Đặt Hàng Thành Công! 🎉';
    }

    showPaymentStep(3);

    const toastMsg = paymentMethod === 'COD'
        ? '🎉 Đặt hàng thành công! Đơn hàng đang ở trạng thái <b>Chờ xác nhận</b>.'
        : '🎉 Thanh toán chuyển khoản thành công! Đơn hàng đã được lưu.';
    showToast(toastMsg, 'success');
}

function getLocalOrdersKey() {
    return currentUser && currentUser.id ? `bookmind_user_orders_${currentUser.id}` : null;
}

function saveLocalOrder(order) {
    try {
        const key = getLocalOrdersKey();
        if (!key) return; // Không lưu nếu chưa đăng nhập
        let list = JSON.parse(localStorage.getItem(key) || '[]');
        list.unshift(order);
        localStorage.setItem(key, JSON.stringify(list));
    } catch (e) { }
}

function getLocalOrders() {
    try {
        const key = getLocalOrdersKey();
        if (!key) return []; // Trả về rỗng nếu chưa đăng nhập
        return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (e) {
        return [];
    }
}

// ==========================================
// MY ORDERS MODAL & TRACKING
// ==========================================

async function openMyOrdersModal(event) {
    if (event) event.preventDefault();
    if (!requireLogin('xem đơn hàng của bạn')) {
        return;
    }

    openModal('myOrdersModal');
    currentOrderFilter = 'ALL';

    // Reset tabs UI
    const tabs = document.querySelectorAll('#orderFilterTabs .nav-link');
    tabs.forEach((tab, index) => {
        if (index === 0) {
            tab.className = 'nav-link active rounded-pill py-1.5';
        } else {
            tab.className = 'nav-link rounded-pill py-1.5 text-secondary';
        }
    });

    await loadMyOrders();
}

async function loadMyOrders() {
    const listEl = document.getElementById('myOrdersList');
    if (!listEl) return;

    listEl.innerHTML = `
        <div class="text-center py-5 text-muted">
            <div class="spinner-border spinner-border-sm text-primary mb-2" role="status"></div>
            <p class="fs-8 mb-0">Đang tải danh sách đơn hàng...</p>
        </div>
    `;

    let orders = [];

    try {
        const userId = currentUser ? currentUser.id : '';
        const res = await fetch(`/api/orders/my-orders?userId=${userId}`);
        const result = await res.json();
        if (res.ok && result.success && Array.isArray(result.data)) {
            orders = result.data;
        }
    } catch (e) {
        console.warn('Could not fetch orders from API, loading from localStorage', e);
    }

    // Merge with local orders
    const localOrders = getLocalOrders();
    const existingTrackingSet = new Set(orders.map(o => o.trackingNumber));
    localOrders.forEach(lo => {
        if (!existingTrackingSet.has(lo.trackingNumber)) {
            orders.unshift(lo);
        }
    });

    myOrdersListCache = orders;
    renderOrdersList(myOrdersListCache, currentOrderFilter);
}

function filterMyOrders(status, btnEl) {
    currentOrderFilter = status;

    const tabs = document.querySelectorAll('#orderFilterTabs .nav-link');
    tabs.forEach(tab => {
        tab.className = 'nav-link rounded-pill py-1.5 text-secondary';
    });
    if (btnEl) btnEl.className = 'nav-link active rounded-pill py-1.5';

    renderOrdersList(myOrdersListCache, status);
}

function renderOrdersList(orders, filter) {
    const listEl = document.getElementById('myOrdersList');
    const subtitleEl = document.getElementById('myOrdersSubtitle');
    if (!listEl) return;

    let filtered = orders;
    if (filter && filter !== 'ALL') {
        filtered = orders.filter(o => o.status === filter);
    }

    if (subtitleEl) {
        subtitleEl.textContent = `Bạn có ${orders.length} đơn hàng trong hệ thống (${filtered.length} đơn hiển thị)`;
    }

    if (filtered.length === 0) {
        listEl.innerHTML = `
            <div class="text-center py-5">
                <div class="rounded-circle bg-light d-inline-flex align-items-center justify-content-center mb-3" style="width: 70px; height: 70px;">
                    <i class="fas fa-box-open text-muted fs-2"></i>
                </div>
                <h6 class="fw-bold text-dark mb-1">Chưa có đơn hàng nào ở mục này</h6>
                <p class="text-muted fs-8 mb-3">Hãy chọn những cuốn sách hay và đặt hàng ngay để trải nghiệm nhé!</p>
                <button class="btn btn-primary rounded-pill btn-sm px-4 fw-semibold" onclick="closeModal('myOrdersModal')">
                    <i class="fas fa-book-open me-1"></i> Khám Phá Sách Ngay
                </button>
            </div>
        `;
        return;
    }

    listEl.innerHTML = filtered.map(order => {
        const statusCode = getOrderStatusCode(order.status);
        const statusMeta = getOrderStatusMeta(order.status);

        const itemsHtml = (order.items || []).map(item => {
            const bookImg = item.image || 'images/book_ai.png';
            return `
                <div class="d-flex align-items-center justify-content-between py-1.5 border-bottom border-light">
                    <div class="d-flex align-items-center gap-2 text-truncate" style="max-width: 380px;">
                        <img src="${bookImg}" alt="Book" class="rounded border" style="width: 32px; height: 42px; object-fit: cover;">
                        <div>
                            <div class="fw-semibold text-dark fs-8 text-truncate">${escapeHtml(item.title)}</div>
                            <small class="text-muted fs-9">${escapeHtml(item.author || '')}</small>
                        </div>
                    </div>
                    <div class="text-end">
                        <span class="fs-8 text-muted me-2">${item.quantity}x</span>
                        <span class="fw-bold fs-8 text-dark">${formatCurrency((item.price || 0) * item.quantity)}</span>
                    </div>
                </div>
            `;
        }).join('');

        const isCOD = order.paymentMethod === 'COD';
        const paymentLabel = isCOD ? 'Thanh toán khi nhận hàng (COD)' : 'Chuyển khoản trực tiếp VietQR';
        const paymentBadgeClass = isCOD ? 'bg-secondary-subtle text-secondary' : 'bg-success-subtle text-success';

        const dateFormatted = order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : 'Vừa xong';

        return `
            <div class="card border rounded-4 shadow-xs p-3.5 bg-white mb-2">
                <!-- Card Header -->
                <div class="d-flex flex-wrap justify-content-between align-items-center pb-2 border-bottom mb-2 gap-2">
                    <div>
                        <span class="fw-bold text-dark fs-7">#${order.trackingNumber || ('BM-' + order.id)}</span>
                        <span class="text-muted fs-8 ms-2"><i class="far fa-clock me-1"></i>${dateFormatted}</span>
                    </div>
                    <div class="d-flex align-items-center gap-2">
                        <span class="badge ${statusMeta.badgeClass} rounded-pill px-2.5 py-1 fs-8">
                            <i class="${statusMeta.icon} me-1"></i>${statusMeta.label}
                        </span>
                    </div>
                </div>

                <!-- 4-Step Interactive Order Stepper -->
                <div class="order-stepper">
                    <div class="order-stepper-step ${statusCode >= 1 ? (statusCode > 1 ? 'done' : 'active') : ''}">
                        <div class="order-stepper-icon"><i class="fas fa-clipboard-check"></i></div>
                        <span class="order-stepper-label">Chờ xác nhận</span>
                    </div>
                    <div class="order-stepper-step ${statusCode >= 2 ? (statusCode > 2 ? 'done' : 'active') : ''}">
                        <div class="order-stepper-icon"><i class="fas fa-box"></i></div>
                        <span class="order-stepper-label">Chờ lấy hàng</span>
                    </div>
                    <div class="order-stepper-step ${statusCode >= 3 ? (statusCode > 3 ? 'done' : 'active') : ''}">
                        <div class="order-stepper-icon"><i class="fas fa-shipping-fast"></i></div>
                        <span class="order-stepper-label">Chờ giao hàng</span>
                    </div>
                    <div class="order-stepper-step ${statusCode >= 4 ? 'active done' : ''}">
                        <div class="order-stepper-icon"><i class="fas fa-check-double"></i></div>
                        <span class="order-stepper-label">Đã giao</span>
                    </div>
                </div>

                <!-- Order Items -->
                <div class="bg-light rounded-3 p-2.5 mb-2.5">
                    ${itemsHtml || '<p class="text-muted fs-8 mb-0">Sách tuyển chọn BookMind AI</p>'}
                </div>

                <!-- Destination & Footer Info -->
                <div class="row g-2 fs-8 text-secondary mb-2">
                    <div class="col-sm-6">
                        <i class="fas fa-user me-1 text-muted"></i>Người nhận: <strong class="text-dark">${escapeHtml(order.receiverName)}</strong> (${escapeHtml(order.receiverPhone)})
                    </div>
                    <div class="col-sm-6">
                        <i class="fas fa-credit-card me-1 text-muted"></i>PTTT: <span class="badge ${paymentBadgeClass} fs-9 py-0.5">${paymentLabel}</span>
                    </div>
                    <div class="col-12 text-truncate">
                        <i class="fas fa-map-marker-alt me-1 text-muted"></i>Địa chỉ: ${escapeHtml(order.shippingAddress)}
                    </div>
                </div>

                <!-- Footer Summary & Actions -->
                <div class="d-flex flex-wrap justify-content-between align-items-center pt-2 border-top gap-2">
                    <div class="d-flex align-items-baseline gap-1">
                        <span class="fs-8 text-muted">Tổng thanh toán:</span>
                        <span class="fw-bold fs-6 text-primary">${formatCurrency(order.totalAmount || 0)}</span>
                    </div>
                    <div class="d-flex gap-2 align-items-center flex-wrap">
                        <button class="btn btn-outline-success btn-sm rounded-pill px-2.5 py-1 fs-8" onclick="openInvoicePrintView(${order.id})" title="Xem và In Hóa Đơn Điện Tử">
                            <i class="fas fa-file-invoice-dollar me-1"></i>Hóa Đơn
                        </button>
                        ${statusCode < 4 ? `
                            <button class="btn btn-outline-primary btn-sm rounded-pill px-2.5 py-1 fs-8" onclick="advanceOrderStatus(${order.id}, '${order.status}')">
                                <i class="fas fa-arrow-circle-right me-1"></i>Mô phỏng chuyển bước tiếp
                            </button>
                        ` : `
                            <span class="text-success fs-8 fw-bold"><i class="fas fa-check-circle me-1"></i>Đơn hàng hoàn tất</span>
                        `}
                        ${order.status === 'PENDING' ? `
                            <button class="btn btn-outline-danger btn-sm rounded-pill px-2.5 py-1 fs-8" onclick="cancelOrder(${order.id})">
                                Hủy đơn
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function getOrderStatusCode(status) {
    switch (status) {
        case 'PENDING': return 1;
        case 'CONFIRMED': return 2;
        case 'SHIPPING': return 3;
        case 'DELIVERED': return 4;
        default: return 1;
    }
}

function getOrderStatusMeta(status) {
    switch (status) {
        case 'PENDING':
            return { label: 'Chờ xác nhận', badgeClass: 'bg-warning-subtle text-warning-emphasis', icon: 'fas fa-clock' };
        case 'CONFIRMED':
            return { label: 'Chờ lấy hàng', badgeClass: 'bg-info-subtle text-info-emphasis', icon: 'fas fa-box' };
        case 'SHIPPING':
            return { label: 'Chờ giao hàng', badgeClass: 'bg-primary-subtle text-primary', icon: 'fas fa-shipping-fast' };
        case 'DELIVERED':
            return { label: 'Đã giao', badgeClass: 'bg-success-subtle text-success', icon: 'fas fa-check-circle' };
        case 'CANCELLED':
            return { label: 'Đã hủy', badgeClass: 'bg-danger-subtle text-danger', icon: 'fas fa-times-circle' };
        default:
            return { label: 'Chờ xác nhận', badgeClass: 'bg-warning-subtle text-warning-emphasis', icon: 'fas fa-clock' };
    }
}

async function advanceOrderStatus(orderId, currentStatus) {
    const nextSteps = {
        'PENDING': 'CONFIRMED',
        'CONFIRMED': 'SHIPPING',
        'SHIPPING': 'DELIVERED'
    };

    const nextStatus = nextSteps[currentStatus];
    if (!nextStatus) return;

    try {
        const res = await fetch(`/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: nextStatus })
        });
        const result = await res.json();
        if (res.ok && result.success) {
            showToast(`Cập nhật đơn hàng sang: <b>${result.data.statusLabel}</b>!`, 'success');
        }
    } catch (e) {
        console.warn('API error when updating order status, updating in cache', e);
    }

    // Update in local cache
    const item = myOrdersListCache.find(o => o.id === orderId);
    if (item) {
        item.status = nextStatus;
        const meta = getOrderStatusMeta(nextStatus);
        item.statusLabel = meta.label;
        item.statusCode = getOrderStatusCode(nextStatus);
    }

    // Update local storage
    try {
        let localOrders = getLocalOrders();
        const loc = localOrders.find(o => o.id === orderId);
        if (loc) {
            loc.status = nextStatus;
            loc.statusLabel = getOrderStatusMeta(nextStatus).label;
            loc.statusCode = getOrderStatusCode(nextStatus);
            localStorage.setItem('bookmind_user_orders', JSON.stringify(localOrders));
        }
    } catch (e) { }

    renderOrdersList(myOrdersListCache, currentOrderFilter);
}

async function cancelOrder(orderId) {
    if (!confirm('Bạn có chắc chắn muốn hủy đơn hàng này không?')) return;

    try {
        await fetch(`/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'CANCELLED' })
        });
    } catch (e) { }

    const item = myOrdersListCache.find(o => o.id === orderId);
    if (item) item.status = 'CANCELLED';

    try {
        let localOrders = getLocalOrders();
        const loc = localOrders.find(o => o.id === orderId);
        if (loc) {
            loc.status = 'CANCELLED';
            localStorage.setItem('bookmind_user_orders', JSON.stringify(localOrders));
        }
    } catch (e) { }

    renderOrdersList(myOrdersListCache, currentOrderFilter);
    showToast('Đã hủy đơn hàng thành công', 'info');
}


let currentModalBookId = null;
let currentNewRating = 5;

const DEFAULT_BOOK_REVIEWS = {
    1: [
        { author: 'Nguyễn Văn Hải', rating: 5, date: '08/03/2026', comment: 'Sách rất thực tế, giúp mình thay đổi tư duy quản lý tài chính cá nhân và đầu tư dài hạn!' },
        { author: 'Trần Thị Mai', rating: 5, date: '05/03/2026', comment: 'Lời văn dễ hiểu, các câu chuyện minh họa cuốn hút. Đọc xong áp dụng được ngay.' },
        { author: 'Lê Minh Quân', rating: 4, date: '28/02/2026', comment: 'Chất lượng giấy in đẹp, giao hàng nhanh. Cuốn sách đáng đọc cho người mới bắt đầu.' }
    ],
    2: [
        { author: 'Phạm Đức Anh', rating: 5, date: '07/03/2026', comment: 'Tác giả James Clear phân tích cực kỳ sâu sắc về sức mạnh của thói quen nhỏ mỗi ngày.' },
        { author: 'Đặng Thu Hà', rating: 5, date: '01/03/2026', comment: 'Quyển sách self-help hay nhất mình từng đọc. Thay đổi 1% mỗi ngày là có thật!' }
    ],
    3: [
        { author: 'Vũ Quốc Bảo', rating: 5, date: '04/03/2026', comment: 'Hiểu về AI và LLM chưa bao giờ trực quan và dễ tiếp cận đến vậy. Rất đáng tiền!' },
        { author: 'Hoàng Kim Chi', rating: 5, date: '25/02/2026', comment: 'Tác giả giải thích các khái niệm Machine Learning một cách tường minh, dễ áp dụng.' }
    ]
};

let userBookReviews = {};
try {
    const saved = localStorage.getItem('bookmind_user_reviews');
    if (saved) userBookReviews = JSON.parse(saved);
} catch (e) { }

function openBookModal(bookId) {
    const book = BOOK_CATALOG.find(b => b.id === bookId);
    if (!book) return;

    currentModalBookId = bookId;

    document.getElementById('modalBookTitle').innerText = book.title;
    document.getElementById('modalBookAuthor').innerText = `Tác giả: ${book.author}`;
    document.getElementById('modalBookCategory').innerText = book.categoryName;
    document.getElementById('modalBookPrice').innerText = formatCurrency(book.price);
    document.getElementById('modalBookOldPrice').innerText = book.oldPrice ? formatCurrency(book.oldPrice) : '';
    document.getElementById('modalBookDescription').innerText = book.description;
    document.getElementById('modalBookImg').src = book.image;
    document.getElementById('modalBookRating').innerText = `${book.rating} / 5 (${book.reviewsCount} đánh giá)`;

    const isStopped = book.status === 'STOPPED';
    const stock = (book.stockQuantity !== undefined && book.stockQuantity !== null) ? book.stockQuantity : 99;
    const isOutOfStock = book.status === 'OUT_OF_STOCK' || stock <= 0;
    const isLowStock = !isStopped && !isOutOfStock && stock <= 3;

    // Cập nhật nhãn trạng thái kho bên cạnh bộ đếm số lượng
    const stockBadge = document.getElementById('modalBookStockBadge');
    if (stockBadge) {
        if (isStopped) {
            stockBadge.className = 'fs-8 text-danger fw-semibold';
            stockBadge.innerHTML = '<i class="fas fa-ban me-1"></i>Ngưng kinh doanh';
        } else if (isOutOfStock) {
            stockBadge.className = 'fs-8 text-danger fw-semibold';
            stockBadge.innerHTML = '<i class="fas fa-times-circle me-1"></i>Hết hàng';
        } else if (isLowStock) {
            stockBadge.className = 'fs-8 text-danger fw-bold bg-danger-subtle px-2 py-1 rounded-pill border border-danger-subtle';
            stockBadge.innerHTML = `<i class="fas fa-exclamation-circle me-1 text-danger"></i>Chỉ còn ${stock} cuốn trong kho!`;
        } else {
            stockBadge.className = 'fs-8 text-success fw-semibold';
            stockBadge.innerHTML = `<i class="fas fa-check-circle me-1"></i>Còn hàng (${stock} cuốn)`;
        }
    }

    // Cảnh báo trạng thái kinh doanh / tồn kho thấp
    let noticeEl = document.getElementById('modalBookStatusNotice');
    if (!noticeEl) {
        noticeEl = document.createElement('div');
        noticeEl.id = 'modalBookStatusNotice';
        const modalDesc = document.getElementById('modalBookDescription');
        if (modalDesc && modalDesc.parentNode) {
            modalDesc.parentNode.insertBefore(noticeEl, modalDesc);
        }
    }

    if (isStopped) {
        noticeEl.className = 'alert alert-danger d-flex align-items-center gap-2 py-2 mb-3 fs-8';
        noticeEl.innerHTML = '<i class="fas fa-ban fs-6"></i> <span>Sản phẩm này hiện <b>đã ngưng kinh doanh</b>. Quý khách vui lòng chọn sách khác!</span>';
        noticeEl.style.display = 'flex';
    } else if (isOutOfStock) {
        noticeEl.className = 'alert alert-danger d-flex align-items-center gap-2 py-2 mb-3 fs-8';
        noticeEl.innerHTML = '<i class="fas fa-box-open fs-6"></i> <span>Sản phẩm này hiện đang <b>tạm hết hàng</b> trong kho.</span>';
        noticeEl.style.display = 'flex';
    } else if (isLowStock) {
        noticeEl.className = 'alert alert-warning border-warning d-flex align-items-center gap-2 py-2 mb-3 fs-8';
        noticeEl.innerHTML = `<i class="fas fa-exclamation-triangle text-danger fs-6"></i> <span>⚠️ <b>Số lượng có hạn:</b> Trong kho <b>chỉ còn ${stock} cuốn</b>, hãy đặt mua ngay kẻo hết!</span>`;
        noticeEl.style.display = 'flex';
    } else {
        noticeEl.style.display = 'none';
    }

    // Reset số lượng muốn mua về 1 (nếu còn hàng)
    const qtyInput = document.getElementById('detailBookQuantity');
    if (qtyInput) {
        qtyInput.value = (isStopped || isOutOfStock) ? 0 : 1;
        qtyInput.min = (isStopped || isOutOfStock) ? 0 : 1;
        qtyInput.max = stock > 0 ? stock : 1;
        qtyInput.disabled = isStopped || isOutOfStock;
    }

    // Nút Thêm Vào Giỏ
    const addBtn = document.getElementById('modalAddToCartBtn');
    if (addBtn) {
        if (isStopped) {
            addBtn.disabled = true;
            addBtn.className = 'btn btn-secondary disabled opacity-50 px-4 py-2 rounded-pill fw-bold';
            addBtn.innerHTML = '<i class="fas fa-ban me-1"></i> Ngưng kinh doanh';
            addBtn.onclick = null;
        } else if (isOutOfStock) {
            addBtn.disabled = true;
            addBtn.className = 'btn btn-secondary disabled opacity-50 px-4 py-2 rounded-pill fw-bold';
            addBtn.innerHTML = '<i class="fas fa-box-open me-1"></i> Tạm hết hàng';
            addBtn.onclick = null;
        } else {
            addBtn.disabled = false;
            addBtn.className = 'btn btn-outline-primary px-4 py-2 rounded-pill fw-bold';
            addBtn.innerHTML = '<i class="fas fa-cart-plus me-1"></i> Thêm Giỏ Hàng';
            addBtn.onclick = () => {
                const qty = parseInt(document.getElementById('detailBookQuantity')?.value) || 1;
                addToCart(book.id, qty);
            };
        }
    }

    // Nút Mua Ngay
    const buyBtn = document.getElementById('modalBuyNowBtn');
    if (buyBtn) {
        if (isStopped) {
            buyBtn.disabled = true;
            buyBtn.className = 'btn btn-secondary disabled opacity-50 px-4 py-2 rounded-pill fw-bold';
            buyBtn.innerHTML = '<i class="fas fa-ban me-1"></i> Không thể mua';
            buyBtn.onclick = null;
        } else if (isOutOfStock) {
            buyBtn.disabled = true;
            buyBtn.className = 'btn btn-secondary disabled opacity-50 px-4 py-2 rounded-pill fw-bold';
            buyBtn.innerHTML = '<i class="fas fa-box-open me-1"></i> Hết hàng';
            buyBtn.onclick = null;
        } else {
            buyBtn.disabled = false;
            buyBtn.className = 'btn btn-primary px-4 py-2 rounded-pill fw-bold shadow-sm';
            buyBtn.innerHTML = '<i class="fas fa-bolt me-1"></i> Mua Ngay';
            buyBtn.onclick = () => {
                const qty = parseInt(document.getElementById('detailBookQuantity')?.value) || 1;
                buyNow(book.id, qty);
            };
        }
    }

    // Nút Hỏi Trợ Lý AI
    const askAIBtn = document.getElementById('modalAskAIBtn');
    if (askAIBtn) {
        askAIBtn.onclick = () => {
            closeModal('bookDetailModal');
            askAIAboutBook(book.id);
        };
    }

    // Đóng form review nếu đang mở và render đánh giá
    const formContainer = document.getElementById('reviewFormContainer');
    if (formContainer) formContainer.classList.add('d-none');
    renderBookReviews(book.id);

    openModal('bookDetailModal');
}

function renderBookReviews(bookId) {
    const listEl = document.getElementById('reviewsList');
    const summaryEl = document.getElementById('reviewsSummaryText');
    if (!listEl) return;

    const book = BOOK_CATALOG.find(b => b.id === bookId);
    const defaults = DEFAULT_BOOK_REVIEWS[bookId] || [
        { author: 'Độc giả BookMind', rating: 5, date: 'Vừa xong', comment: 'Sách rất hay, đóng gói cẩn thận, nội dung truyền cảm hứng và hữu ích.' }
    ];
    const userReviews = userBookReviews[bookId] || [];
    const allReviews = [...userReviews, ...defaults];

    if (summaryEl) {
        summaryEl.textContent = `${allReviews.length} nhận xét thực tế từ độc giả đã mua và đọc sách`;
    }

    listEl.innerHTML = allReviews.map(r => {
        const starsHtml = Array.from({ length: 5 }, (_, i) =>
            `<i class="${i < r.rating ? 'fas fa-star text-warning' : 'far fa-star text-muted'} fs-8"></i>`
        ).join('');

        const firstLetter = (r.author || 'U').charAt(0).toUpperCase();

        return `
            <div class="p-2.5 rounded-3 border bg-white shadow-xs">
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <div class="d-flex align-items-center gap-2">
                        <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center fw-bold fs-8" style="width: 28px; height: 28px;">
                            ${firstLetter}
                        </div>
                        <div>
                            <span class="fw-bold fs-7 text-dark">${r.author}</span>
                            <span class="badge bg-success-subtle text-success ms-1 fs-9 py-0.5 px-1.5"><i class="fas fa-check me-0.5"></i>Đã mua</span>
                        </div>
                    </div>
                    <span class="text-muted fs-8">${r.date}</span>
                </div>
                <div class="mb-1">${starsHtml}</div>
                <p class="fs-8 text-secondary mb-0" style="line-height: 1.5;">${r.comment}</p>
            </div>
        `;
    }).join('');
}

function toggleReviewForm() {
    if (!requireLogin('viết nhận xét và đánh giá sách')) {
        return;
    }
    const container = document.getElementById('reviewFormContainer');
    if (!container) return;

    const isHidden = container.classList.contains('d-none');
    if (isHidden) {
        container.classList.remove('d-none');
        const authorInput = document.getElementById('reviewAuthorName');
        if (authorInput && currentUser && currentUser.fullName) {
            authorInput.value = currentUser.fullName;
        }
        setNewRating(5);
    } else {
        container.classList.add('d-none');
    }
}

function setNewRating(rating) {
    currentNewRating = Math.max(1, Math.min(5, rating));
    const labels = {
        1: '1/5 - Rất thất vọng',
        2: '2/5 - Tạm được',
        3: '3/5 - Bình thường',
        4: '4/5 - Hài lòng',
        5: '5/5 - Tuyệt vời & khuyên đọc'
    };

    const labelEl = document.getElementById('newRatingLabel');
    if (labelEl) labelEl.textContent = labels[currentNewRating] || `${currentNewRating}/5`;

    const starsEl = document.getElementById('newReviewStars');
    if (starsEl) {
        const starIcons = starsEl.querySelectorAll('i[data-star]');
        starIcons.forEach(icon => {
            const starVal = parseInt(icon.getAttribute('data-star')) || 1;
            if (starVal <= currentNewRating) {
                icon.className = 'fas fa-star text-warning';
            } else {
                icon.className = 'far fa-star text-muted';
            }
        });
    }
}

function submitBookReview() {
    if (!currentModalBookId) return;

    const authorInput = document.getElementById('reviewAuthorName');
    const commentInput = document.getElementById('reviewComment');

    const comment = commentInput ? commentInput.value.trim() : '';
    if (!comment) {
        showToast('Vui lòng nhập nội dung nhận xét của bạn!', 'warning');
        if (commentInput) commentInput.focus();
        return;
    }

    let author = authorInput ? authorInput.value.trim() : '';
    if (!author) {
        author = (currentUser && currentUser.fullName) ? currentUser.fullName : 'Độc giả giấu tên';
    }

    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

    const newReview = {
        author: author,
        rating: currentNewRating,
        date: dateStr,
        comment: comment
    };

    if (!userBookReviews[currentModalBookId]) {
        userBookReviews[currentModalBookId] = [];
    }
    userBookReviews[currentModalBookId].unshift(newReview);

    try {
        localStorage.setItem('bookmind_user_reviews', JSON.stringify(userBookReviews));
    } catch (e) { }

    if (commentInput) commentInput.value = '';
    toggleReviewForm();
    renderBookReviews(currentModalBookId);
    showToast('🎉 Cảm ơn bạn đã gửi đánh giá cho cuốn sách này!', 'success');
}


function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const colors = {
        success: { bg: '#10b981', text: '#fff' },
        warning: { bg: '#f59e0b', text: '#1e293b' },
        info: { bg: '#1e293b', text: '#fff' }
    };
    const c = colors[type] || colors.info;
    const toastId = 'toast-' + Date.now();

    const div = document.createElement('div');
    div.id = toastId;
    div.style.cssText = `
        background:${c.bg}; color:${c.text};
        padding: 0.7rem 1rem;
        border-radius: 0.6rem;
        box-shadow: 0 8px 24px rgba(0,0,0,0.18);
        font-size: 0.82rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.75rem;
        min-width: 240px;
        max-width: 360px;
        margin-bottom: 0.5rem;
        animation: toastIn 0.3s ease;
        font-family: var(--font-main, sans-serif);
    `;
    div.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;font-size:1.1rem;cursor:pointer;line-height:1;padding:0;">&times;</button>
    `;
    container.appendChild(div);
    setTimeout(() => { if (div.parentElement) div.remove(); }, 3500);
}

// Toast animation
if (!document.getElementById('toastStyle')) {
    const s = document.createElement('style');
    s.id = 'toastStyle';
    s.textContent = '@keyframes toastIn { from { opacity:0; transform:translateX(40px);} to { opacity:1; transform:translateX(0);} }';
    document.head.appendChild(s);
}

/* =========================================================
   AUTHENTICATION LOGIC (Login & Register)
   ========================================================= */

function updateNavAuthUI() {
    const container = document.getElementById('navAuthContainer');
    if (!container) return;

    if (currentUser) {
        const roleBadge = currentUser.roles && currentUser.roles.includes('ROLE_ADMIN')
            ? '<span class="badge bg-danger ms-1" style="font-size: 0.65rem;">Admin</span>'
            : '<span class="badge bg-primary-subtle text-primary ms-1" style="font-size: 0.65rem;">Thành viên</span>';

        container.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-outline-secondary btn-sm dropdown-toggle rounded-pill d-flex align-items-center gap-1.5 py-1 px-2.5 shadow-sm border bg-white fs-8"
                    type="button" id="userDropdownBtn" data-bs-toggle="dropdown" aria-expanded="false">
                    <img src="${currentUser.avatarUrl || 'images/book_ai.png'}" 
                         alt="Avatar" class="rounded-circle border" style="width: 24px; height: 24px; object-fit: cover;">
                    <span class="fw-bold text-dark fs-8">${escapeHtml(currentUser.fullName)}</span>
                    ${roleBadge}
                </button>
                <ul class="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3 mt-2 p-2" aria-labelledby="userDropdownBtn" style="min-width: 210px;">
                    <li class="px-3 py-2 border-bottom mb-1">
                        <div class="fw-bold text-dark fs-7">${escapeHtml(currentUser.fullName)}</div>
                        <div class="text-muted fs-8 text-truncate">${escapeHtml(currentUser.email)}</div>
                    </li>
                    <li>
                        <a class="dropdown-item rounded-2 fs-7 py-2 text-dark" href="javascript:void(0)" onclick="openProfileModal()">
                            <i class="fas fa-id-badge me-2 text-primary"></i>Thông tin cá nhân
                        </a>
                    </li>
                    <li>
                        <a class="dropdown-item rounded-2 fs-7 py-2 text-dark" href="javascript:void(0)" onclick="openMyOrdersModal(event)">
                            <i class="fas fa-box-open me-2 text-warning"></i>Đơn hàng của tôi
                        </a>
                    </li>
                    ${(currentUser.roles && (currentUser.roles.includes('ROLE_ADMIN') || currentUser.roles.includes('ROLE_STAFF'))) ? `
                    <li><hr class="dropdown-divider my-1"></li>
                    <li>
                        <a class="dropdown-item rounded-2 fs-7 py-2 text-primary fw-bold" href="admin.html">
                            <i class="fas fa-chart-line me-2"></i>Trang Quản Trị Cửa Hàng
                        </a>
                    </li>` : ''}
                    <li><hr class="dropdown-divider my-1"></li>
                    <li>
                        <a class="dropdown-item rounded-2 fs-7 py-2 text-danger fw-bold" href="javascript:void(0)" onclick="handleLogout()">
                            <i class="fas fa-sign-out-alt me-2"></i>Đăng xuất
                        </a>
                    </li>
                </ul>
            </div>
        `;
    } else {
        container.innerHTML = `
            <button class="btn btn-outline-primary btn-sm rounded-pill px-3 py-1.5 fw-bold" style="font-size: 0.82rem;" onclick="openAuthModal('login')">
                <i class="fas fa-sign-in-alt me-1"></i> Đăng Nhập
            </button>
            <button class="btn btn-primary btn-sm rounded-pill px-3 py-1.5 fw-bold shadow-sm" style="font-size: 0.82rem;" onclick="openAuthModal('register')">
                <i class="fas fa-user-plus me-1"></i> Đăng Ký
            </button>
        `;
    }
}

function escapeHtml(text) {
    if (!text) return '';
    return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function openAuthModal(tab = 'login') {
    switchAuthTab(tab);
    openModal('authModal');
}

function switchAuthTab(tab) {
    const loginBtn = document.getElementById('tabLoginBtn');
    const regBtn = document.getElementById('tabRegisterBtn');
    const loginForm = document.getElementById('loginForm');
    const regForm = document.getElementById('registerForm');
    const loginAlert = document.getElementById('loginAlert');
    const regAlert = document.getElementById('registerAlert');

    if (loginAlert) loginAlert.classList.add('d-none');
    if (regAlert) regAlert.classList.add('d-none');

    if (tab === 'login') {
        if (loginBtn) {
            loginBtn.classList.add('active');
            loginBtn.classList.remove('text-secondary');
        }
        if (regBtn) {
            regBtn.classList.remove('active');
            regBtn.classList.add('text-secondary');
        }
        if (loginForm) loginForm.classList.remove('d-none');
        if (regForm) regForm.classList.add('d-none');
    } else {
        if (regBtn) {
            regBtn.classList.add('active');
            regBtn.classList.remove('text-secondary');
        }
        if (loginBtn) {
            loginBtn.classList.remove('active');
            loginBtn.classList.add('text-secondary');
        }
        if (regForm) regForm.classList.remove('d-none');
        if (loginForm) loginForm.classList.add('d-none');
    }
}

function togglePasswordVisibility(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const icon = btn.querySelector('i');
    if (input.type === 'password') {
        input.type = 'text';
        if (icon) {
            icon.classList.remove('fa-eye');
            icon.classList.add('fa-eye-slash');
        }
    } else {
        input.type = 'password';
        if (icon) {
            icon.classList.remove('fa-eye-slash');
            icon.classList.add('fa-eye');
        }
    }
}

async function validateSessionWithServer() {
    if (!currentUser || !currentUser.id) return;
    try {
        const res = await fetch(`/api/auth/me?userId=${currentUser.id}`);
        if (!res.ok) {
            console.log('Tài khoản không còn tồn tại trên máy chủ (đã bị xóa). Tự động đăng xuất...');
            localStorage.removeItem('bookmind_user');
            localStorage.removeItem('currentUser');
            currentUser = null;
            updateNavAuthUI();
            updateCartUI();
        } else {
            const resData = await res.json();
            if (resData && resData.data) {
                currentUser = resData.data;
                localStorage.setItem('bookmind_user', JSON.stringify(currentUser));
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                updateNavAuthUI();
            }
        }
    } catch (e) {
        console.warn('Lỗi kiểm tra phiên đăng nhập:', e);
    }
}

// Khởi chạy đồng bộ trạng thái đăng nhập và kiểm tra tính hợp lệ với server
updateNavAuthUI();
validateSessionWithServer();

function quickFillLogin(email, password) {
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    if (emailInput && passwordInput) {
        emailInput.value = email;
        passwordInput.value = password;
        switchAuthTab('login');
    }
}

async function handleLoginSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const alertBox = document.getElementById('loginAlert');
    const submitBtn = document.getElementById('btnLoginSubmit');

    alertBox.classList.add('d-none');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang đăng nhập...';

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            currentUser = result.data;
            localStorage.setItem('bookmind_user', JSON.stringify(currentUser));
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateNavAuthUI();
            closeModal('authModal');
            document.getElementById('loginForm').reset();

            const roles = currentUser.roles || [];
            if (roles.includes('ROLE_ADMIN') || roles.includes('ROLE_STAFF')) {
                showToast(`Chào mừng Quản trị viên ${currentUser.fullName}! Đang chuyển đến Trang Quản Trị...`, 'success');
                setTimeout(() => {
                    window.location.href = 'admin.html';
                }, 700);
            } else {
                showToast(`Chào mừng ${currentUser.fullName} quay trở lại!`, 'success');
            }
        } else {
            alertBox.textContent = result.message || 'Đăng nhập thất bại, vui lòng kiểm tra lại!';
            alertBox.classList.remove('d-none');
        }
    } catch (error) {
        alertBox.textContent = 'Không thể kết nối đến máy chủ backend (Port 8080). Vui lòng kiểm tra lại!';
        alertBox.classList.remove('d-none');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt me-1"></i> Đăng Nhập';
    }
}

async function handleRegisterSubmit(event) {
    event.preventDefault();
    const fullName = document.getElementById('regFullName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    const alertBox = document.getElementById('registerAlert');
    const submitBtn = document.getElementById('btnRegisterSubmit');

    alertBox.classList.add('d-none');

    if (password !== confirmPassword) {
        alertBox.textContent = 'Mật khẩu xác nhận không khớp!';
        alertBox.classList.remove('d-none');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang tạo tài khoản...';

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fullName, email, phone, password, confirmPassword })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            currentUser = result.data;
            localStorage.setItem('bookmind_user', JSON.stringify(currentUser));
            updateNavAuthUI();
            closeModal('authModal');
            showToast(`Đăng ký thành công! Chào mừng ${currentUser.fullName}!`, 'success');
            document.getElementById('registerForm').reset();
        } else {
            alertBox.textContent = result.message || 'Đăng ký thất bại, vui lòng thử lại!';
            alertBox.classList.remove('d-none');
        }
    } catch (error) {
        alertBox.textContent = 'Không thể kết nối đến máy chủ backend (Port 8080). Vui lòng thử lại sau!';
        alertBox.classList.remove('d-none');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-user-plus me-1"></i> Đăng Ký Tài Khoản';
    }
}

function handleLogout() {
    localStorage.removeItem('bookmind_user');
    currentUser = null;
    cart = [];
    updateCartUI();
    updateNavAuthUI();
    showToast('Bạn đã đăng xuất tài khoản thành công.', 'info');
}

/* =========================================================
   PROFILE MODAL LOGIC
   ========================================================= */

function openProfileModal() {
    if (!currentUser) {
        openAuthModal('login');
        return;
    }

    const avatarEl = document.getElementById('profileAvatar');
    if (avatarEl) {
        avatarEl.src = currentUser.avatarUrl || 'images/book_ai.png';
    }

    const nameDisplay = document.getElementById('profileFullNameDisplay');
    if (nameDisplay) {
        nameDisplay.textContent = currentUser.fullName || 'Người dùng';
    }

    const emailDisplay = document.getElementById('profileEmailDisplay');
    if (emailDisplay) {
        emailDisplay.textContent = currentUser.email || '';
    }

    const roleBadge = document.getElementById('profileRoleBadge');
    if (roleBadge) {
        if (currentUser.roles && currentUser.roles.includes('ROLE_ADMIN')) {
            roleBadge.className = 'position-absolute bottom-0 end-0 badge bg-danger rounded-pill fs-8 px-2 py-1';
            roleBadge.textContent = 'Admin';
        } else {
            roleBadge.className = 'position-absolute bottom-0 end-0 badge bg-primary rounded-pill fs-8 px-2 py-1';
            roleBadge.textContent = 'Thành viên';
        }
    }

    const nameInput = document.getElementById('profileFullNameInput');
    if (nameInput) nameInput.value = currentUser.fullName || '';

    const emailInput = document.getElementById('profileEmailInput');
    if (emailInput) emailInput.value = currentUser.email || '';

    const phoneInput = document.getElementById('profilePhoneInput');
    if (phoneInput) phoneInput.value = currentUser.phone || '';

    // Clear password inputs
    const curPass = document.getElementById('profileCurrentPassword');
    if (curPass) curPass.value = '';
    const newPass = document.getElementById('profileNewPassword');
    if (newPass) newPass.value = '';
    const confirmPass = document.getElementById('profileConfirmNewPassword');
    if (confirmPass) confirmPass.value = '';

    const alertBox = document.getElementById('profileAlert');
    if (alertBox) {
        alertBox.className = 'alert py-2 fs-7 d-none';
        alertBox.textContent = '';
    }

    updateProfileDeleteRequestUI();
    openModal('profileModal');
}

function updateProfileDeleteRequestUI() {
    const pendingBox = document.getElementById('deleteRequestPendingBox');
    const initialBox = document.getElementById('deleteRequestInitialBox');
    const timeText = document.getElementById('deleteRequestedAtText');
    const sec = document.getElementById('profileDeleteRequestSection');

    if (!pendingBox || !initialBox) return;

    // Ẩn mục này nếu là tài khoản Admin
    if (currentUser && currentUser.roles && currentUser.roles.includes('ROLE_ADMIN')) {
        if (sec) sec.classList.add('d-none');
        return;
    } else {
        if (sec) sec.classList.remove('d-none');
    }

    if (currentUser && currentUser.deleteRequested) {
        pendingBox.classList.remove('d-none');
        initialBox.classList.add('d-none');
        if (timeText) {
            let formattedTime = 'gần đây';
            if (currentUser.deleteRequestedAt) {
                try {
                    const d = new Date(currentUser.deleteRequestedAt);
                    formattedTime = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ' ' + d.toLocaleDateString('vi-VN');
                } catch (e) { }
            }
            timeText.textContent = formattedTime;
        }
    } else {
        pendingBox.classList.add('d-none');
        initialBox.classList.remove('d-none');
    }
}

function showDeleteRequestConfirmModal() {
    if (!currentUser) return;
    const reasonInput = document.getElementById('requestDeleteReasonInput');
    if (reasonInput) reasonInput.value = '';
    openModal('requestDeleteConfirmModal');
}

async function submitDeleteRequest() {
    if (!currentUser) return;
    const btn = document.getElementById('btnSubmitDeleteRequest');
    const reasonInput = document.getElementById('requestDeleteReasonInput');
    const reason = reasonInput ? reasonInput.value.trim() : '';

    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span class="spinner-border spinner-border-sm me-1"></span>Đang gửi...';
    }

    try {
        const res = await fetch('/api/auth/request-delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser.id, reason: reason })
        });
        const result = await res.json();
        if (res.ok && result.success) {
            currentUser = result.data;
            localStorage.setItem('bookmind_user', JSON.stringify(currentUser));
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            closeModal('requestDeleteConfirmModal');
            updateProfileDeleteRequestUI();
            showToast('Đã gửi yêu cầu xóa tài khoản đến Quản trị viên!', 'success');
        } else {
            showToast(result.message || 'Gửi yêu cầu thất bại!', 'danger');
        }
    } catch (e) {
        showToast('Không thể kết nối đến máy chủ!', 'danger');
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-paper-plane me-1"></i> Xác Nhận Gửi Yêu Cầu';
        }
    }
}

async function handleCancelDeleteAccount() {
    if (!currentUser) return;
    if (!confirm('Bạn có chắc chắn muốn hủy yêu cầu xóa tài khoản không?')) return;

    try {
        const res = await fetch('/api/auth/cancel-delete-request', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser.id })
        });
        const result = await res.json();
        if (res.ok && result.success) {
            currentUser = result.data;
            localStorage.setItem('bookmind_user', JSON.stringify(currentUser));
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            updateProfileDeleteRequestUI();
            showToast('Đã hủy yêu cầu xóa tài khoản thành công!', 'success');
        } else {
            showToast(result.message || 'Hủy yêu cầu thất bại!', 'danger');
        }
    } catch (e) {
        showToast('Không thể kết nối đến máy chủ!', 'danger');
    }
}

async function handleUpdateProfile(event) {
    event.preventDefault();
    if (!currentUser) return;

    const fullName = document.getElementById('profileFullNameInput').value.trim();
    const phone = document.getElementById('profilePhoneInput').value.trim();
    const currentPassword = document.getElementById('profileCurrentPassword').value;
    const newPassword = document.getElementById('profileNewPassword').value;
    const confirmNewPassword = document.getElementById('profileConfirmNewPassword').value;
    const alertBox = document.getElementById('profileAlert');
    const saveBtn = document.getElementById('btnSaveProfile');

    if (alertBox) alertBox.classList.add('d-none');

    if (newPassword && newPassword !== confirmNewPassword) {
        alertBox.className = 'alert alert-danger py-2 fs-7';
        alertBox.textContent = 'Mật khẩu mới và xác nhận mật khẩu không khớp!';
        alertBox.classList.remove('d-none');
        return;
    }

    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Đang lưu...';

    try {
        const payload = {
            userId: currentUser.id,
            fullName: fullName,
            phone: phone,
            currentPassword: currentPassword,
            newPassword: newPassword
        };

        const response = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            currentUser = result.data;
            localStorage.setItem('bookmind_user', JSON.stringify(currentUser));
            updateNavAuthUI();
            closeModal('profileModal');
            showToast('Cập nhật thông tin cá nhân thành công!', 'success');
        } else {
            alertBox.className = 'alert alert-danger py-2 fs-7';
            alertBox.textContent = result.message || 'Cập nhật thất bại, vui lòng kiểm tra lại!';
            alertBox.classList.remove('d-none');
        }
    } catch (error) {
        alertBox.className = 'alert alert-danger py-2 fs-7';
        alertBox.textContent = 'Không thể kết nối đến máy chủ backend. Vui lòng thử lại sau!';
        alertBox.classList.remove('d-none');
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<i class="fas fa-save me-1"></i> Lưu Thay Đổi';
    }
}

// Khởi chạy đồng bộ trạng thái đăng nhập
updateNavAuthUI();


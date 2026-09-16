CREATE DATABASE IF NOT EXISTS bookmind_ai_db
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE bookmind_ai_db;

/* =========================================================
   1. PHÂN HỆ NGƯỜI DÙNG & BẢO MẬT (USER & SECURITY)
   ========================================================= */

-- Bảng Quyền (Roles) - Chuẩn bị cho Spring Security
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE -- ROLE_USER, ROLE_ADMIN, ROLE_STAFF
);

-- Bảng Người dùng
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15) UNIQUE,
    avatar_url VARCHAR(255),
    status ENUM('ACTIVE', 'INACTIVE', 'BANNED') DEFAULT 'ACTIVE',
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng trung gian N-N: Phân quyền người dùng
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

/* =========================================================
   2. PHÂN HỆ SẢN PHẨM (PRODUCT CATALOG)
   ========================================================= */

-- Danh mục (Categories) - Hỗ trợ đa tầng (Parent-Child)
CREATE TABLE categories (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    parent_id BIGINT NULL, -- NULL nếu là danh mục gốc. VD: Sách IT -> Lập trình
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE, -- URL thân thiện (vd: sach-lap-trinh)
    description TEXT NULL,
    status BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Sách (Books) - Đầy đủ thông tin thực tế
CREATE TABLE books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT,
    isbn VARCHAR(20) UNIQUE, -- Mã số sách chuẩn quốc tế
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    author VARCHAR(150),
    publisher VARCHAR(150),
    publication_year INT,
    pages INT,
    description LONGTEXT,
    original_price DECIMAL(10, 2) NOT NULL, -- Giá gốc
    sale_price DECIMAL(10, 2) NOT NULL,     -- Giá bán thực tế
    stock_quantity INT NOT NULL DEFAULT 0,
    avg_rating DECIMAL(3, 2) DEFAULT 0.00,  -- Điểm đánh giá trung bình
    status ENUM('AVAILABLE', 'OUT_OF_STOCK', 'STOPPED') DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Hình ảnh Sách (Book Images) - 1 sách có nhiều ảnh
CREATE TABLE book_images (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    book_id BIGINT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    is_thumbnail BOOLEAN DEFAULT FALSE, -- Cờ đánh dấu ảnh bìa chính
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

/* =========================================================
   3. PHÂN HỆ QUẢN LÝ KHO (INVENTORY)
   ========================================================= */

-- Phiếu nhập kho (Inventory Receipts)
CREATE TABLE inventory_receipts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL, -- Nhân viên nào nhập kho
    total_cost DECIMAL(12, 2) NOT NULL DEFAULT 0,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Chi tiết nhập kho
CREATE TABLE inventory_receipt_details (
    receipt_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    import_price DECIMAL(10, 2) NOT NULL, -- Giá gốc khi nhập hàng
    PRIMARY KEY (receipt_id, book_id),
    FOREIGN KEY (receipt_id) REFERENCES inventory_receipts(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

/* =========================================================
   4. PHÂN HỆ MUA HÀNG & THANH TOÁN (SALES & PAYMENTS)
   ========================================================= */

-- Giỏ hàng (Carts) - Lưu trữ lâu dài
CREATE TABLE carts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE cart_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    cart_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- Bảng Đơn hàng (Orders)
CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT, -- Cứ để NULL nếu cho phép mua không cần đăng nhập (Guest)
    tracking_number VARCHAR(50) UNIQUE, -- Mã vận đơn
    subtotal DECIMAL(10, 2) NOT NULL, -- Tiền hàng
    shipping_fee DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL, -- Tổng thanh toán
    status ENUM('PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING',
    shipping_address TEXT NOT NULL,
    receiver_name VARCHAR(100) NOT NULL,
    receiver_phone VARCHAR(15) NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Chi tiết đơn hàng
CREATE TABLE order_details (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- Giao dịch thanh toán (Payments) - Tách riêng để dễ tích hợp VNPay/Momo
CREATE TABLE payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    payment_method ENUM('COD', 'VNPAY', 'MOMO', 'CREDIT_CARD') NOT NULL,
    transaction_id VARCHAR(100), -- Mã giao dịch từ cổng thanh toán trả về
    payment_status ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
    payment_date TIMESTAMP NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

/* =========================================================
   5. PHÂN HỆ TƯƠNG TÁC & AI (INTERACTION & AI)
   ========================================================= */

-- Đánh giá sách (Reviews)
CREATE TABLE reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    book_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Lịch sử Chat AI (AI Chat History) - Lưu ngữ cảnh để bot thông minh hơn
CREATE TABLE ai_chat_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT, -- AI có thể chat với khách vãng lai
    session_token VARCHAR(100) UNIQUE NOT NULL,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE ai_chat_messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_id BIGINT NOT NULL,
    sender ENUM('USER', 'BOT') NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES ai_chat_sessions(id) ON DELETE CASCADE
);

/* =========================================================
   6. PHÂN HỆ KHUYẾN MÃI & VOUCHER (PROMOTIONS & VOUCHERS)
   ========================================================= */

-- Bảng Voucher & Mã giảm giá
CREATE TABLE vouchers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    discount_type ENUM('PERCENT', 'FIXED') DEFAULT 'PERCENT',
    discount_value DECIMAL(10, 2) NOT NULL,
    max_discount_amount DECIMAL(10, 2) NULL,
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    applicable_type ENUM('ALL', 'CATEGORY', 'BOOK') DEFAULT 'ALL',
    applicable_id BIGINT NULL,
    badge_text VARCHAR(50) DEFAULT 'ƯU ĐÃI ✨',
    badge_color VARCHAR(30) DEFAULT 'danger',
    usage_limit INT DEFAULT 1000,
    used_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bảng Ví Voucher của Người dùng (User Saved Vouchers)
CREATE TABLE user_vouchers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    voucher_id BIGINT NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP NULL,
    UNIQUE KEY uq_user_voucher (user_id, voucher_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (voucher_id) REFERENCES vouchers(id) ON DELETE CASCADE
);
-- 1. Thêm Dữ liệu Quyền (Roles)
INSERT INTO roles (id, name) VALUES 
(1, 'ROLE_USER'), 
(2, 'ROLE_ADMIN'), 
(3, 'ROLE_STAFF');

-- 2. Thêm Dữ liệu Người dùng (Users)
-- Mật khẩu ở đây giả lập đã được mã hóa BCrypt (mật khẩu gốc là '123456')
INSERT INTO users (id, email, password, full_name, phone, status, email_verified) VALUES
(1, 'admin@bookmind.com', '$2a$10$xyzMockHashBcrypt123456789', 'Admin BookMind', '0900000000', 'ACTIVE', TRUE),
(2, 'khachhang1@gmail.com', '$2a$10$xyzMockHashBcrypt123456789', 'Nguyễn Văn A', '0911111111', 'ACTIVE', TRUE),
(3, 'khachhang2@gmail.com', '$2a$10$xyzMockHashBcrypt123456789', 'Trần Thị B', '0922222222', 'ACTIVE', TRUE);

-- 3. Phân quyền Người dùng (User Roles)
INSERT INTO user_roles (user_id, role_id) VALUES
(1, 2), -- User 1 là ADMIN
(2, 1), -- User 2 là USER
(3, 1); -- User 3 là USER

-- 4. Thêm Dữ liệu Danh mục (Categories)
INSERT INTO categories (id, parent_id, name, slug) VALUES
(1, NULL, 'Công nghệ & AI', 'cong-nghe-ai'),
(2, NULL, 'Kinh tế & Đầu tư', 'kinh-te-dau-tu'),
(3, NULL, 'Tâm lý & Kỹ năng', 'tam-ly-ky-nang'),
(4, NULL, 'Văn học & Tiểu thuyết', 'van-hoc-tieu-thuyet'),
(5, NULL, 'Lịch sử & Triết học', 'lich-su-triet-hoc'),
(6, NULL, 'Khoa học & Đời sống', 'khoa-hoc-doi-song'),
(7, NULL, 'Thiếu nhi & Tuổi mới lớn', 'thieu-nhi-tuoi-moi-lon'),
(8, NULL, 'Nghệ thuật & Sáng tạo', 'nghe-thuat-sang-tao');

-- 5. Thêm Dữ liệu Sách (Books - 100 Cuốn Đa Dạng Thể Loại)
INSERT INTO books (id, category_id, isbn, title, slug, author, publisher, original_price, sale_price, stock_quantity, avg_rating, description) VALUES
(1, 1, '9786041000001', 'Trí Tuệ Nhân Tạo & Tương Lai Loài Người', 'tri-tue-nhan-tao-tuong-lai-loai-nguoi-1', 'Dr. Alex Vance', 'NXB Thông Tin & Truyền Thông', 240000, 189000, 51, 4.9, 'Khám phá chiều sâu của cuộc cách mạng AI, từ mạng thần kinh nhân tạo đến tiềm năng biến đổi hoàn toàn xã hội, công việc và tương lai trí tuệ con người.'),
(2, 1, '9786041000002', 'Lập Trình Web Hiện Đại Với JavaScript & React', 'lap-trinh-web-hien-dai-voi-javascript-react-2', 'Đặng Hoàng Nam', 'NXB Thông Tin & Truyền Thông', 280000, 210000, 52, 4.9, 'Cẩm nang thực hành toàn diện từ cơ bản HTML/CSS/JS nâng cao đến xây dựng Single Page Application chuẩn công nghiệp với React và Node.js.'),
(3, 1, '9786041000003', 'Vũ Trụ Trong Vỏ Hạt Dẻ & Máy Tính Lượng Tử', 'vu-tru-trong-vo-hat-de-may-tinh-luong-tu-3', 'Stephen Hawking', 'NXB Thông Tin & Truyền Thông', 210000, 168000, 53, 4.9, 'Chuyến du hành khoa học lý thú giải thích nguyên lý lý thuyết dây, lỗ đen, máy tính lượng tử và ranh giới tri thức công nghệ vũ trụ.'),
(4, 1, '9786041000004', 'Clean Code - Nghệ Thuật Viết Code Sạch', 'clean-code-nghe-thuat-viet-code-sach-4', 'Robert C. Martin (Uncle Bob)', 'NXB Thông Tin & Truyền Thông', 320000, 265000, 54, 4.9, 'Kinh thánh của mọi lập trình viên phần mềm chuyên nghiệp. Hướng dẫn chi tiết cách đặt tên biến, cấu trúc hàm, xử lý ngoại lệ và refactoring mã nguồn sạch.'),
(5, 1, '9786041000005', 'Thiết Kế Hệ Thống Quy Mô Lớn (System Design Interview)', 'thiet-ke-he-thong-quy-mo-lon-system-design-interview-5', 'Alex Xu', 'NXB Thông Tin & Truyền Thông', 350000, 295000, 55, 4.9, 'Hướng dẫn thực chiến cách thiết kế kiến trúc phân tán phục vụ hàng triệu người dùng: Load Balancer, Caching, Sharding, Message Queue và Microservices.'),
(6, 1, '9786041000006', 'Học Sâu & Mạng Thần Kinh Nhân Tạo (Deep Learning)', 'hoc-sau-mang-than-kinh-nhan-tao-deep-learning-6', 'Ian Goodfellow & Yoshua Bengio', 'NXB Thông Tin & Truyền Thông', 400000, 340000, 56, 4.8, 'Giáo trình nền tảng và toàn diện nhất về Deep Learning, từ toán học tối ưu, CNN, RNN cho đến Transformer và các mô hình thị giác máy tính hiện đại.'),
(7, 1, '9786041000007', 'Python Cho Khoa Học Dữ Liệu & Machine Learning', 'python-cho-khoa-hoc-du-lieu-machine-learning-7', 'Wes McKinney', 'NXB Thông Tin & Truyền Thông', 270000, 225000, 57, 4.8, 'Sách viết bởi chính cha đẻ của thư viện Pandas, hướng dẫn làm chủ phân tích dữ liệu, xử lý bảng dữ liệu lớn, trực quan hóa và mô hình hóa dự đoán.'),
(8, 1, '9786041000008', 'DevOps Toàn Thư: Docker, Kubernetes & CI/CD', 'devops-toan-thu-docker-kubernetes-ci-cd-8', 'John Willis & Gene Kim', 'NXB Thông Tin & Truyền Thông', 290000, 245000, 58, 4.7, 'Bí quyết tự động hóa quy trình phân phối phần mềm, triển khai container hóa với Docker và điều phối cụm Kubernetes an toàn, ổn định.'),
(9, 1, '9786041000009', 'Kỹ Nghệ Prompt & Làm Chủ Generative AI', 'ky-nghe-prompt-lam-chu-generative-ai-9', 'Nguyễn Thế Anh', 'NXB Thông Tin & Truyền Thông', 220000, 175000, 59, 4.9, 'Bí kíp tối ưu tương tác cùng các mô hình ngôn ngữ lớn (LLM), tự động hóa công việc văn phòng, lập trình và sáng tạo nội dung hiệu suất cao.'),
(10, 1, '9786041000010', 'An Toàn Thông Tin & Hacker Mũ Trắng', 'an-toan-thong-tin-hacker-mu-trang-10', 'Peter Kim', 'NXB Thông Tin & Truyền Thông', 280000, 230000, 60, 4.8, 'Tìm hiểu phương thức phòng thủ và kiểm thử xâm nhập bảo mật mạng (Penetration Testing), lỗ hổng Web OWASP và kỹ thuật bảo vệ hệ thống.'),
(11, 1, '9786041000011', 'Kiến Trúc Microservices Thực Chiến', 'kien-truc-microservices-thuc-chien-11', 'Sam Newman', 'NXB Thông Tin & Truyền Thông', 330000, 280000, 61, 4.8, 'Cách chia nhỏ kiến trúc nguyên khối (Monolith) thành các vi dịch vụ độc lập, quản lý dữ liệu phân tán và giám sát hạ tầng hiệu quả.'),
(12, 1, '9786041000012', 'Cấu Trúc Dữ Liệu & Giải Thuật Kinh Điển', 'cau-truc-du-lieu-giai-thuat-kinh-dien-12', 'Thomas H. Cormen', 'NXB Thông Tin & Truyền Thông', 370000, 310000, 62, 4.9, 'Bộ giáo trình thuật toán đồ thị, quy hoạch động, cây nhị phân và độ phức tạp tính toán O(n) bắt buộc phải nắm vững cho kỹ sư phần mềm.'),
(13, 1, '9786041000013', 'Blockchain & Tương Lai Tài Chính Phi Tập Trung', 'blockchain-tuong-lai-tai-chinh-phi-tap-trung-13', 'Don Tapscott & Alex Tapscott', 'NXB Thông Tin & Truyền Thông', 240000, 195000, 63, 4.6, 'Giải thích cơ chế vận hành của công nghệ chuỗi khối (Blockchain), hợp đồng thông minh (Smart Contract) và tiềm năng định hình lại nền kinh tế.'),
(14, 1, '9786041000014', 'Design Patterns: Mẫu Thiết Kế Hướng Đối Tượng', 'design-patterns-mau-thiet-ke-huong-doi-tuong-14', 'Erich Gamma & Richard Helm', 'NXB Thông Tin & Truyền Thông', 320000, 275000, 64, 4.9, 'Bộ 23 mẫu thiết kế kinh điển giúp lập trình viên viết code có tính tái sử dụng cao, linh hoạt mở rộng và giải quyết tốt các bài toán kiến trúc.'),
(15, 1, '9786041000015', 'Chuyển Đổi Số - Lược Khảo Cho Doanh Nghiệp 4.0', 'chuyen-doi-so-luoc-khao-cho-doanh-nghiep-4-0-15', 'Jeanne Ross & Martin Mocker', 'NXB Thông Tin & Truyền Thông', 220000, 185000, 65, 4.7, 'Chiến lược số hóa vận hành, xây dựng nền tảng dữ liệu và văn hóa doanh nghiệp đổi mới sáng tạo trong thời đại chuyển đổi số toàn cầu.'),
(16, 2, '9786041000016', 'Tư Duy Tiền Bạc & Tâm Lý Học Đầu Tư', 'tu-duy-tien-bac-tam-ly-hoc-dau-tu-16', 'Morgan Housel', 'NXB Tổng Hợp TP.HCM', 195000, 159000, 66, 4.9, 'Sự thành công trong tài chính không hẳn là kiến thức chuyên môn mà nằm ở cách bạn kiểm soát cảm xúc, định kiến và thái độ đối với tiền bạc.'),
(17, 2, '9786041000017', 'Khởi Nghiệp Tinh Gọn (The Lean Startup)', 'khoi-nghiep-tinh-gon-the-lean-startup-17', 'Eric Ries', 'NXB Tổng Hợp TP.HCM', 180000, 145000, 67, 4.8, 'Phương pháp tạo lập dự án kinh doanh linh hoạt, thử nghiệm sản phẩm khả dụng tối thiểu (MVP) để tối ưu chi phí và thích ứng thị trường.'),
(18, 2, '9786041000018', 'Cha Giàu Cha Nghèo (Rich Dad Poor Dad)', 'cha-giau-cha-ngheo-rich-dad-poor-dad-18', 'Robert T. Kiyosaki', 'NXB Tổng Hợp TP.HCM', 155000, 125000, 68, 4.8, 'Cuốn sách thức tỉnh tư duy tài chính cá nhân, định nghĩa lại tài sản - tiêu sản và hướng dẫn cách để đồng tiền làm việc cho chính bạn.'),
(19, 2, '9786041000019', 'Nhà Đầu Tư Thông Minh (The Intelligent Investor)', 'nha-dau-tu-thong-minh-the-intelligent-investor-19', 'Benjamin Graham', 'NXB Tổng Hợp TP.HCM', 295000, 240000, 69, 4.9, 'Tác phẩm kinh điển về triết lý đầu tư giá trị, quản trị rủi ro danh mục và tâm lý ngài Thị Trường của người thầy vĩ đại của Warren Buffett.'),
(20, 2, '9786041000020', 'Từ Tốt Đến Vĩ Đại (Good to Great)', 'tu-tot-den-vi-dai-good-to-great-20', 'Jim Collins', 'NXB Tổng Hợp TP.HCM', 215000, 175000, 70, 4.8, 'Nghiên cứu sâu sắc lý giải vì sao một số công ty tạo ra bước nhảy vọt thần kỳ duy trì đỉnh cao hàng chục năm, trong khi những công ty khác thất bại.'),
(21, 2, '9786041000021', 'Chiến Lược Đại Dương Xanh', 'chien-luoc-dai-duong-xanh-21', 'W. Chan Kim & Renée Mauborgne', 'NXB Tổng Hợp TP.HCM', 199000, 165000, 71, 4.8, 'Cách tạo ra khoảng trống thị trường chưa ai khai phá để vô hiệu hóa sự cạnh tranh, kiến tạo giá trị đột phá cho cả khách hàng lẫn doanh nghiệp.'),
(22, 2, '9786041000022', 'Dốc Hết Trái Tim - Hành Trình Xây Dựng Starbucks', 'doc-het-trai-tim-hanh-trinh-xay-dung-starbucks-22', 'Howard Schultz', 'NXB Tổng Hợp TP.HCM', 170000, 139000, 72, 4.7, 'Câu chuyện chân thực và đầy cảm hứng về hành trình biến chuỗi cà phê nhỏ Seattle thành đế chế toàn cầu bằng niềm đam mê và giá trị nhân văn.'),
(23, 2, '9786041000023', 'Đọc Vị Báo Cáo Tài Chính Doanh Nghiệp', 'doc-vi-bao-cao-tai-chinh-doanh-nghiep-23', 'Mary Buffett & David Clark', 'NXB Tổng Hợp TP.HCM', 185000, 148000, 73, 4.8, 'Hướng dẫn đọc hiểu bảng cân đối kế toán, báo cáo lưu chuyển tiền tệ và báo cáo kết quả kinh doanh để phát hiện doanh nghiệp có lợi thế độc quyền.'),
(24, 2, '9786041000024', 'Lợi Thế Cạnh Tranh Bền Vững', 'loi-the-canh-tranh-ben-vung-24', 'Michael E. Porter', 'NXB Tổng Hợp TP.HCM', 260000, 215000, 74, 4.7, 'Lý thuyết 5 lực lượng cạnh tranh và chiến lược chi phí thấp, khác biệt hóa sản phẩm giúp doanh nghiệp đứng vững trước mọi biến động thị trường.'),
(25, 2, '9786041000025', 'Thịnh Vượng Tài Chính Tuổi 30', 'thinh-vuong-tai-chinh-tuoi-30-25', 'Go Deuk Seong', 'NXB Tổng Hợp TP.HCM', 140000, 115000, 75, 4.6, 'Kế hoạch tài chính thiết thực cho người trẻ tuổi: tiết kiệm có kỷ luật, đầu tư tích lũy và xây dựng dòng tiền thụ động an toàn trước tuổi 30.'),
(26, 2, '9786041000026', 'Kinh Tế Học Hài Hước (Freakonomics)', 'kinh-te-hoc-hai-huoc-freakonomics-26', 'Steven D. Levitt & Stephen J. Dubner', 'NXB Tổng Hợp TP.HCM', 165000, 135000, 76, 4.7, 'Góc nhìn kinh tế học độc đáo bóc tách những hiện tượng đời thường kỳ lạ dưới lăng kính của các động cơ ngầm chi phối hành vi con người.'),
(27, 2, '9786041000027', 'Nguyên Tắc Để Thành Công (Principles)', 'nguyen-tac-de-thanh-cong-principles-27', 'Ray Dalio', 'NXB Tổng Hợp TP.HCM', 350000, 290000, 77, 4.9, 'Những nguyên tắc sống và làm việc trung thực tột độ giúp Ray Dalio đưa quỹ phòng hộ Bridgewater Associates trở thành quỹ đầu tư lớn nhất thế giới.'),
(28, 2, '9786041000028', 'Triệu Phú Bất Động Sản Tự Thân', 'trieu-phu-bat-dong-san-tu-than-28', 'Gary Keller', 'NXB Tổng Hợp TP.HCM', 220000, 180000, 78, 4.7, 'Mô hình và chiến lược đầu tư bất động sản an toàn, tạo lập dòng tiền cho thuê và gia tăng vốn gốc bài bản cho nhà đầu tư cá nhân.'),
(29, 2, '9786041000029', 'Nghệ Thuật Bán Hàng Bậc Cao', 'nghe-thuat-ban-hang-bac-cao-29', 'Zig Ziglar', 'NXB Tổng Hợp TP.HCM', 175000, 140000, 79, 4.8, 'Kỹ năng thuyết phục khách hàng xuất phát từ sự thấu hiểu, chân thành và tinh thần giải quyết vấn đề thực sự cho người mua.'),
(30, 2, '9786041000030', 'Từ Không Đến Một (Zero to One)', 'tu-khong-den-mot-zero-to-one-30', 'Peter Thiel & Blake Masters', 'NXB Tổng Hợp TP.HCM', 180000, 149000, 80, 4.8, 'Triết lý công nghệ đổi mới: đừng sao chép cái đã có để đi từ 1 đến n, hãy sáng tạo cái mới chưa từng có để đi từ 0 đến 1 và độc quyền sáng tạo.'),
(31, 3, '9786041000031', 'Thói Quen Nguyên Tử: Thay Đổi Nhỏ, Kết Quả Đột Phá', 'thoi-quen-nguyen-tu-thay-doi-nho-ket-qua-dot-pha-31', 'James Clear', 'NXB Thế Giới', 169000, 135000, 81, 4.9, 'Cuốn sách hướng dẫn bạn cách từng bước thiết lập những thói quen tốt và loại bỏ thói quen xấu bằng nguyên lý tích tiểu thành đại 1% mỗi ngày.'),
(32, 3, '9786041000032', 'Đắc Nhân Tâm - Nghệ Thuật Giao Tiếp & Ứng Xử', 'dac-nhan-tam-nghe-thuat-giao-tiep-ung-xu-32', 'Dale Carnegie', 'NXB Thế Giới', 120000, 99000, 82, 4.9, 'Cuốn sách bán chạy nhất mọi thời đại về nghệ thuật ứng xử, lắng nghe, thu phục lòng người và xây dựng các mối quan hệ chân thành.'),
(33, 3, '9786041000033', 'Hiểu Về Trái Tim - Nghệ Thuật Chữa Lành', 'hieu-ve-trai-tim-nghe-thuat-chua-lanh-33', 'Thầy Minh Niệm', 'NXB Thế Giới', 175000, 145000, 83, 4.9, 'Tác phẩm chữa lành tâm hồn kinh điển giúp bạn thấu hiểu cơn giận, nỗi sợ, sự tha thứ và tình thương đích thực để sống trọn vẹn an lạc.'),
(34, 3, '9786041000034', 'Đi Tìm Lẽ Sống (Man''s Search for Meaning)', 'di-tim-le-song-man-s-search-for-meaning-34', 'Viktor E. Frankl', 'NXB Thế Giới', 130000, 105000, 84, 4.9, 'Ghi chép phi thường của một bác sĩ tâm thần sống sót qua trại tập trung Đức Quốc Xã, khám phá ra ý nghĩa bất diệt của cuộc sống trong nghịch cảnh.'),
(35, 3, '9786041000035', 'Tư Duy Nhanh Và Chậm (Thinking, Fast and Slow)', 'tu-duy-nhanh-va-cham-thinking-fast-and-slow-35', 'Daniel Kahneman', 'NXB Thế Giới', 260000, 215000, 85, 4.8, 'Tác phẩm đoạt giải Nobel Kinh tế giải mã hai hệ thống tư duy chi phối mọi quyết định: Hệ thống 1 (trực giác nhanh) và Hệ thống 2 (suy luận chậm).'),
(36, 3, '9786041000036', 'Nghệ Thuật Tinh Tế Của Việc ''Đếch'' Quan Tâm', 'nghe-thuat-tinh-te-cua-viec-dech-quan-tam-36', 'Mark Manson', 'NXB Thế Giới', 135000, 110000, 86, 4.7, 'Cách tiếp cận ngược dòng hài hước giúp bạn ngừng bận tâm về những điều vớ vẩn và tập trung năng lượng vào những điều thực sự có ý nghĩa.'),
(37, 3, '9786041000037', 'Dám Bị Ghét - Can Đảm Để Được Hạnh Phúc', 'dam-bi-ghet-can-dam-de-duoc-hanh-phuc-37', 'Kishimi Ichiro & Koga Fumitake', 'NXB Thế Giới', 155000, 128000, 87, 4.8, 'Cuộc đối thoại giữa chàng thanh niên và triết gia dựa trên tâm lý học Adler: giải phóng bản thân khỏi ánh nhìn người khác để sống tự do.'),
(38, 3, '9786041000038', 'Sức Mạnh Của Hiện Tại (The Power of Now)', 'suc-manh-cua-hien-tai-the-power-of-now-38', 'Eckhart Tolle', 'NXB Thế Giới', 160000, 130000, 88, 4.9, 'Cẩm nang giác ngộ tâm linh giúp bạn vượt qua nỗi đau quá khứ và sự lo lắng tương lai để sống trọn vẹn từng khoảnh khắc hiện tại.'),
(39, 3, '9786041000039', 'Không Diệt Không Sinh Đừng Sợ Hãi', 'khong-diet-khong-sinh-dung-so-hai-39', 'Thiền sư Thích Nhất Hạnh', 'NXB Thế Giới', 120000, 95000, 89, 4.9, 'Lời chỉ dẫn sâu sắc xoa dịu nỗi đau mất mát, giúp chúng ta nhìn sâu vào bản chất của sinh tử để tìm thấy bình an tuyệt đối trong tâm.'),
(40, 3, '9786041000040', 'Deep Work - Làm Ra Làm Chơi Ra Chơi', 'deep-work-lam-ra-lam-choi-ra-choi-40', 'Cal Newport', 'NXB Thế Giới', 175000, 142000, 90, 4.8, 'Quy tắc rèn luyện khả năng tập trung cao độ không xao nhãng trong một thế giới tràn ngập thông báo và mạng xã hội.'),
(41, 3, '9786041000041', 'Thao Túng Tâm Lý - Nhận Diện Và Vượt Qua', 'thao-tung-tam-ly-nhan-dien-va-vuot-qua-41', 'Shannon Thomas', 'NXB Thế Giới', 170000, 138000, 91, 4.7, 'Nhận diện những hành vi lạm dụng tâm lý ngấm ngầm (gaslighting, ái kỷ) và xây dựng ranh giới lành mạnh để bảo vệ tinh thần.'),
(42, 3, '9786041000042', 'Trí Tuệ Cảm Xúc (EQ 2.0)', 'tri-tue-cam-xuc-eq-2-0-42', 'Travis Bradberry & Jean Greaves', 'NXB Thế Giới', 155000, 125000, 92, 4.8, 'Khám phá và nâng cao chỉ số EQ: tự nhận thức, tự quản lý, nhận thức xã hội và quản lý mối quan hệ để bứt phá trong sự nghiệp.'),
(43, 3, '9786041000043', 'Muôn Kiếp Nhân Sinh (Tập 1 & 2)', 'muon-kiep-nhan-sinh-tap-1-2-43', 'Nguyên Phong', 'NXB Thế Giới', 320000, 260000, 93, 4.9, 'Bức tranh toàn cảnh về luật nhân quả, tiền kiếp và luân hồi thông qua những trải nghiệm tâm linh kỳ lạ của một doanh nhân phố Wall.'),
(44, 3, '9786041000044', 'Quẳng Gánh Lo Đi Và Vui Sống', 'quang-ganh-lo-di-va-vui-song-44', 'Dale Carnegie', 'NXB Thế Giới', 120000, 98000, 94, 4.8, 'Những lời khuyên thực tế giúp bạn đập tan nỗi sợ hãi, lo âu trong công việc và cuộc sống để tận hưởng trọn vẹn từng ngày an vui.'),
(45, 3, '9786041000045', 'Tâm Lý Học Hành Vi - Đọc Vị Bất Kỳ Ai', 'tam-ly-hoc-hanh-vi-doc-vi-bat-ky-ai-45', 'David J. Lieberman', 'NXB Thế Giới', 140000, 115000, 95, 4.7, 'Cách nắm bắt tâm lý, nhận biết lời nói dối và suy nghĩ ngầm của đối phương thông qua ngôn ngữ cơ thể và tín hiệu phi ngôn ngữ.'),
(46, 4, '9786041000046', 'Rừng Na Uy - Kiệt Tác Văn Học Nhật Bản', 'rung-na-uy-kiet-tac-van-hoc-nhat-ban-46', 'Haruki Murakami', 'NXB Hội Nhà Văn', 160000, 128000, 96, 4.8, 'Một tiểu thuyết trầm lắng, hoài niệm về tuổi trẻ, tình yêu và nỗi cô đơn sâu thẳm giữa lòng thế giới hiện đại bận rộn.'),
(47, 4, '9786041000047', 'Nhà Giả Kim (The Alchemist)', 'nha-gia-kim-the-alchemist-47', 'Paulo Coelho', 'NXB Hội Nhà Văn', 110000, 89000, 97, 4.9, 'Hành trình đi tìm kho báu của chàng chăn cừu Santiago gửi gắm thông điệp bất hủ: ''Khi bạn khao khát một điều gì, cả vũ trụ sẽ chung sức giúp bạn''.'),
(48, 4, '9786041000048', 'Bắt Trẻ Đồng Xanh (The Catcher in the Rye)', 'bat-tre-dong-xanh-the-catcher-in-the-rye-48', 'J.D. Salinger', 'NXB Hội Nhà Văn', 120000, 98000, 98, 4.7, 'Lời tự thuật nổi loạn, chân thật và đầy cô đơn của cậu thiếu niên Holden Caulfield chống lại thói đạo đức giả của thế giới người lớn.'),
(49, 4, '9786041000049', 'Chiến Tranh Và Hòa Bình', 'chien-tranh-va-hoa-binh-49', 'Lev Tolstoy', 'NXB Hội Nhà Văn', 380000, 320000, 99, 4.9, 'Bộ đại tiểu thuyết sử thi tái hiện bức tranh hoành tráng về lịch sử nước Nga thời kỳ Napoleon và số phận bi tráng của các dòng họ quý tộc.'),
(50, 4, '9786041000050', 'Số Đỏ - Kiệt Tác Trào Phúng Việt Nam', 'so-do-kiet-tac-trao-phung-viet-nam-50', 'Vũ Trọng Phụng', 'NXB Hội Nhà Văn', 105000, 85000, 100, 4.9, 'Tiểu thuyết trào phúng đỉnh cao của văn học Việt Nam về bước đường thăng tiến kệch cỡm của Xuân Tóc Đỏ giữa xã hội Âu hóa nửa mùa.'),
(51, 4, '9786041000051', 'Nỗi Buồn Chiến Tranh', 'noi-buon-chien-tranh-51', 'Bảo Ninh', 'NXB Hội Nhà Văn', 135000, 110000, 101, 4.9, 'Tác phẩm văn học chiến tranh đoạt nhiều giải thưởng quốc tế, khắc họa vết thương lòng ám ảnh khôn nguôi của người lính sau bom đạn.'),
(52, 4, '9786041000052', 'Trăm Năm Cô Đơn (One Hundred Years of Solitude)', 'tram-nam-co-don-one-hundred-years-of-solitude-52', 'Gabriel García Márquez', 'NXB Hội Nhà Văn', 240000, 195000, 102, 4.9, 'Đỉnh cao của chủ nghĩa hiện thực huyền ảo kể về lịch sử bảy thế hệ dòng họ Buendía tại ngôi làng thần tiên Macondo.'),
(53, 4, '9786041000053', 'Tội Ác Và Hình Phạt', 'toi-ac-va-hinh-phat-53', 'Fyodor Dostoevsky', 'NXB Hội Nhà Văn', 255000, 210000, 103, 4.9, 'Cuộc đấu tranh tâm lý dữ dội và quá trình sám hối chuộc tội của chàng sinh viên nghèo Raskolnikov sau khi phạm tội sát nhân.'),
(54, 4, '9786041000054', 'Ông Già Và Biển Cả', 'ong-gia-va-bien-ca-54', 'Ernest Hemingway', 'NXB Hội Nhà Văn', 95000, 75000, 104, 4.8, 'Khúc ca tráng lệ về ý chí kiên cường bất khuất của con người: ''Con người có thể bị hủy diệt nhưng không thể bị đánh bại''.'),
(55, 4, '9786041000055', 'Người Đua Diều (The Kite Runner)', 'nguoi-dua-dieu-the-kite-runner-55', 'Khaled Hosseini', 'NXB Hội Nhà Văn', 165000, 135000, 105, 4.9, 'Câu chuyện cảm động nghẹn ngào về tình bạn, lòng phản bội và con đường chuộc lỗi trải dài qua nhiều biến cố lịch sử tại Afghanistan.'),
(56, 4, '9786041000056', 'Tiệm Tạp Hóa Namiya Diệu Kỳ', 'tiem-tap-hoa-namiya-dieu-ky-56', 'Keigo Higashino', 'NXB Hội Nhà Văn', 155000, 125000, 106, 4.9, 'Một lá thư gửi vào hộp thư cũ vượt qua không thời gian, kết nối những số phận cô đơn và trao gửi những lời khuyên ấm áp chữa lành.'),
(57, 4, '9786041000057', 'Phía Sau Nghi Can X', 'phia-sau-nghi-can-x-57', 'Keigo Higashino', 'NXB Hội Nhà Văn', 145000, 118000, 107, 4.9, 'Cuộc đấu trí nghẹt thở giữa thiên tài toán học và nhà vật lý học đại tài trong một vụ án mạng vì tình yêu sâu sắc tột cùng.'),
(58, 4, '9786041000058', 'Mắt Biếc', 'mat-biec-58', 'Nguyễn Nhật Ánh', 'NXB Hội Nhà Văn', 135000, 110000, 108, 4.9, 'Mối tình đơn phương trong veo, day dứt và đẹp buồn của thầy giáo Ngạn dành cho Hà Lan dưới bóng râm làng Đo Đo thuở ấu thơ.'),
(59, 4, '9786041000059', 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh', 'toi-thay-hoa-vang-tren-co-xanh-59', 'Nguyễn Nhật Ánh', 'NXB Hội Nhà Văn', 130000, 105000, 109, 4.9, 'Những trang nhật ký tuổi thơ miền quê nghèo với tình anh em, sự ghen tị trẻ con và tình bạn thuở thiếu thời ngọt ngào lắng đọng.'),
(60, 4, '9786041000060', 'Chuông Nguyện Hồn Ai', 'chuong-nguyen-hon-ai-60', 'Ernest Hemingway', 'NXB Hội Nhà Văn', 210000, 170000, 110, 4.8, 'Bản anh hùng ca về cuộc chiến đấu chống phát xít tại Tây Ban Nha của người lính tình nguyện Robert Jordan bên cây cầu định mệnh.'),
(61, 5, '9786041000061', 'Sapiens: Lược Sử Loài Người', 'sapiens-luoc-su-loai-nguoi-61', 'Yuval Noah Harari', 'NXB Tri Thức', 250000, 198000, 111, 5, 'Kiệt tác toàn cầu tái hiện hành trình tiến hóa của Homo Sapiens từ loài vượn người vô danh thành kẻ thống trị hành tinh nhờ khả năng hư cấu.'),
(62, 5, '9786041000062', 'Homo Deus: Lược Sử Tương Lai', 'homo-deus-luoc-su-tuong-lai-62', 'Yuval Noah Harari', 'NXB Tri Thức', 245000, 195000, 112, 4.8, 'Khám phá tương lai khi con người làm chủ công nghệ sinh học và trí tuệ nhân tạo để theo đuổi sự bất tử và quyền năng của thánh thần.'),
(63, 5, '9786041000063', '21 Bài Học Cho Thế Kỷ 21', '21-bai-hoc-cho-the-ky-21-63', 'Yuval Noah Harari', 'NXB Tri Thức', 230000, 185000, 113, 4.8, 'Nhìn thẳng vào những thách thức cấp bách nhất hiện nay: tin giả, chiến tranh hạt nhân, khủng hoảng khí hậu và sự trỗi dậy của thuật toán AI.'),
(64, 5, '9786041000064', 'Đại Việt Sử Ký Toàn Thư (Trọn Bộ)', 'dai-viet-su-ky-toan-thu-tron-bo-64', 'Ngô Sĩ Liên & Quốc Sử Quán', 'NXB Tri Thức', 450000, 360000, 114, 4.9, 'Bộ quốc sử vĩ đại ghi chép toàn diện lịch sử dựng nước và giữ nước của dân tộc Việt Nam từ thời Hồng Bàng đến thời Hậu Lê.'),
(65, 5, '9786041000065', 'Việt Nam Sử Lược', 'viet-nam-su-luoc-65', 'Trần Trọng Kim', 'NXB Tri Thức', 165000, 135000, 115, 4.8, 'Cuốn sách thông sử Việt Nam viết bằng chữ quốc ngữ đầu tiên với văn phong mạch lạc, súc tích và góc nhìn công tâm, khách quan.'),
(66, 5, '9786041000066', 'Súng, Vi Trùng Và Thép', 'sung-vi-trung-va-thep-66', 'Jared Diamond', 'NXB Tri Thức', 265000, 215000, 116, 4.9, 'Tác phẩm đoạt giải Pulitzer giải thích vì sao văn minh Á - Âu thống trị thế giới bằng các yếu tố môi trường địa lý chứ không phải ưu thế sinh học.'),
(67, 5, '9786041000067', 'Chủ Nghĩa Khắc Kỷ: Phong Cách Sống Bản Lĩnh', 'chu-nghia-khac-ky-phong-cach-song-ban-linh-67', 'William B. Irvine', 'NXB Tri Thức', 180000, 145000, 117, 4.8, 'Ứng dụng triết học Stoicism vào cuộc sống hiện đại: thực hành tưởng tượng tiêu cực, kiểm soát cảm xúc và rèn luyện bản lĩnh trước nghịch cảnh.'),
(68, 5, '9786041000068', 'Trầm Tưởng (Meditations)', 'tram-tuong-meditations-68', 'Marcus Aurelius', 'NXB Tri Thức', 150000, 120000, 118, 4.9, 'Những dòng suy ngẫm nội tâm mộc mạc của vị hoàng đế La Mã vĩ đại về bổn phận, cái chết, phẩm hạnh và sự tự chủ trước biến thiên.'),
(69, 5, '9786041000069', 'Lược Sử Triết Học Phương Tây', 'luoc-su-triet-hoc-phuong-tay-69', 'Bertrand Russell', 'NXB Tri Thức', 350000, 290000, 119, 4.8, 'Bộ toàn thư đồ sộ khảo cứu tư tưởng triết học từ thời Hy Lạp cổ đại (Socrates, Plato) đến thời kỳ cận - hiện đại của nhà toán học Russell.'),
(70, 5, '9786041000070', 'Sụp Đổ - Các Nền Văn Minh Thất Bại Ra Sao', 'sup-do-cac-nen-van-minh-that-bai-ra-sao-70', 'Jared Diamond', 'NXB Tri Thức', 270000, 220000, 50, 4.7, 'Bài học lịch sử đắt giá từ sự diệt vong của người Viking ở Greenland hay đảo Phục Sinh khi tàn phá môi trường sinh thái tự nhiên.'),
(71, 5, '9786041000071', 'Thế Giới Của Sophie', 'the-gioi-cua-sophie-71', 'Jostein Gaarder', 'NXB Tri Thức', 190000, 155000, 51, 4.9, 'Cuốn tiểu thuyết triết học ly kỳ dành cho mọi lứa tuổi, dẫn dắt cô bé Sophie khám phá những câu hỏi lớn nhất về nguồn gốc và ý nghĩa vũ trụ.'),
(72, 5, '9786041000072', 'Bàn Về Khế Ước Xã Hội', 'ban-ve-khe-uoc-xa-hoi-72', 'Jean-Jacques Rousseau', 'NXB Tri Thức', 135000, 110000, 52, 4.7, 'Tác phẩm kinh điển của thời kỳ Khai sáng đặt nền tảng cho lý thuyết chính trị hiện đại về chủ quyền nhân dân và quyền tự do công dân.'),
(73, 6, '9786041000073', 'Lược Sử Thời Gian: Từ Big Bang Đến Lỗ Đen', 'luoc-su-thoi-gian-tu-big-bang-den-lo-den-73', 'Stephen Hawking', 'NXB Trẻ', 180000, 145000, 53, 4.9, 'Kiệt tác phổ biến khoa học vĩ đại nhất thế giới giải thích nguồn gốc vũ trụ, mũi tên thời gian và bản chất bí ẩn của lỗ đen.'),
(74, 6, '9786041000074', 'Vũ Trụ (Cosmos)', 'vu-tru-cosmos-74', 'Carl Sagan', 'NXB Trẻ', 260000, 210000, 54, 4.9, 'Chuyến du hành 15 tỷ năm khám phá không gian và sự tiến hóa của nhận thức con người với áng văn chương trữ tình giàu chất thơ của Carl Sagan.'),
(75, 6, '9786041000075', 'Gen Vị Kỷ (The Selfish Gene)', 'gen-vi-ky-the-selfish-gene-75', 'Richard Dawkins', 'NXB Trẻ', 240000, 195000, 55, 4.8, 'Góc nhìn đột phá về tiến hóa sinh học: sinh vật sống chỉ là cỗ máy sinh tồn tạm thời phục vụ cho mục tiêu nhân bản của các đoạn gen.'),
(76, 6, '9786041000076', 'Sao Chúng Ta Lại Ngủ: Sức Mạnh Diệu Kỳ Của Giấc Ngủ', 'sao-chung-ta-lai-ngu-suc-manh-dieu-ky-cua-giac-ngu-76', 'Matthew Walker', 'NXB Trẻ', 210000, 168000, 56, 4.9, 'Nghiên cứu thần kinh học chứng minh vai trò sống còn của giấc ngủ đối với trí nhớ, hệ miễn dịch, tuổi thọ và sức khỏe tinh thần.'),
(77, 6, '9786041000077', 'Cơ Thể 4 Giờ: Bí Quyết Tối Ưu Sức Khỏe', 'co-the-4-gio-bi-quyet-toi-uu-suc-khoe-77', 'Timothy Ferriss', 'NXB Trẻ', 275000, 220000, 57, 4.7, 'Hướng dẫn thực nghiệm sinh học cá nhân: giảm mỡ nhanh, tăng cơ, cải thiện giấc ngủ và đạt hiệu suất thể chất đỉnh cao với thời gian tối thiểu.'),
(78, 6, '9786041000078', 'Cuộc Sống Muôn Màu - Bí Mật Thế Giới Động Vật', 'cuoc-song-muon-mau-bi-mat-the-gioi-dong-vat-78', 'David Attenborough', 'NXB Trẻ', 225000, 180000, 58, 4.9, 'Những câu chuyện sống động về hành vi sinh tồn, ngụy trang và giao tiếp kỳ lạ của muôn loài sinh vật trên khắp các lục địa và đại dương.'),
(79, 6, '9786041000079', 'Ăn Gì Không Chết - Giải Mã Khoa Học Dinh Dưỡng', 'an-gi-khong-chet-giai-ma-khoa-hoc-dinh-duong-79', 'Dr. Michael Greger', 'NXB Trẻ', 240000, 195000, 59, 4.8, 'Bằng chứng y khoa chứng minh chế độ dinh dưỡng thuần thực vật có thể ngăn ngừa và đảo ngược 15 nguyên nhân gây tử vong hàng đầu.'),
(80, 6, '9786041000080', '7 Bài Học Vật Lý Cực Dễ Hiểu', '7-bai-hoc-vat-ly-cuc-de-hieu-80', 'Carlo Rovelli', 'NXB Trẻ', 120000, 95000, 60, 4.8, 'Cuốn sách nhỏ tinh gọn đưa người đọc đi qua thuyết tương đối rộng, cơ học lượng tử và lỗ đen bằng ngôn từ trong sáng như thơ.'),
(81, 6, '9786041000081', 'Lược Sử Trái Đất Qua 4.5 Tỷ Năm', 'luoc-su-trai-dat-qua-4-5-ty-nam-81', 'Peter Ward', 'NXB Trẻ', 215000, 175000, 61, 4.8, 'Biên niên sử địa chất và các đại tuyệt chủng trong quá khứ giúp chúng ta thấu hiểu tương lai của hành tinh xanh.'),
(82, 6, '9786041000082', 'Bộ Não Tự Chữa Lành Diệu Kỳ', 'bo-nao-tu-chua-lanh-dieu-ky-82', 'Norman Doidge', 'NXB Trẻ', 200000, 160000, 62, 4.8, 'Khám phá hiện tượng dẻo não (Neuroplasticity): não bộ có khả năng tự tái cấu trúc các liên kết nơ-ron để phục hồi sau tổn thương.'),
(83, 6, '9786041000083', 'Cơ Thể Tự Chữa Lành - Y Học Trực Giác', 'co-the-tu-chua-lanh-y-hoc-truc-giac-83', 'Anthony William', 'NXB Trẻ', 230000, 185000, 63, 4.7, 'Giải pháp thanh lọc thải độc gan và phục hồi các chứng bệnh mãn tính bí ẩn bằng liệu pháp thực phẩm tự nhiên.'),
(84, 6, '9786041000084', 'Trật Tự Của Thời Gian', 'trat-tu-cua-thoi-gian-84', 'Carlo Rovelli', 'NXB Trẻ', 160000, 130000, 64, 4.8, 'Một khảo cứu triết học - vật lý sâu sắc: Thời gian có thực sự tồn tại, hay nó chỉ là một ảo ảnh sinh ra từ góc nhìn giới hạn của loài người?'),
(85, 7, '9786041000085', 'Hoàng Tử Bé (Le Petit Prince)', 'hoang-tu-be-le-petit-prince-85', 'Antoine de Saint-Exupéry', 'NXB Kim Đồng', 95000, 75000, 65, 5, 'Câu chuyện ngụ ngôn tuyệt mỹ dành cho cả trẻ em lẫn người lớn: ''Người ta chỉ thấy rõ bằng trái tim, cái cốt yếu thì mắt thường không nhìn thấy được''.'),
(86, 7, '9786041000086', 'Dế Mèn Phiêu Lưu Ký', 'de-men-phieu-luu-ky-86', 'Tô Hoài', 'NXB Kim Đồng', 85000, 68000, 66, 4.9, 'Kiệt tác văn học thiếu nhi Việt Nam kể về hành trình vấp ngã, trưởng thành và khát vọng kết nghĩa bốn bể hòa bình của chú Dế Mèn.'),
(87, 7, '9786041000087', 'Góc Sân Và Khoảng Trời', 'goc-san-va-khoang-troi-87', 'Trần Đăng Khoa', 'NXB Kim Đồng', 80000, 65000, 67, 4.8, 'Tập thơ hồn nhiên, trong trẻo như hạt sương mai của ''thần đồng thơ ca'' gắn liền với ký ức tuổi thơ làng quê Bắc Bộ.'),
(88, 7, '9786041000088', 'Những Tấm Lòng Cao Cả (Cuore)', 'nhung-tam-long-cao-ca-cuore-88', 'Edmondo De Amicis', 'NXB Kim Đồng', 110000, 88000, 68, 4.9, 'Những bài học đạo đức xúc động lòng người về lòng nhân ái, sự hy sinh và tình thầy trò qua cuốn nhật ký của cậu bé Enrico.'),
(89, 7, '9786041000089', 'Chuyện Con Mèo Dạy Hải Âu Bay', 'chuyen-con-meo-day-hai-au-bay-89', 'Luis Sepúlveda', 'NXB Kim Đồng', 90000, 72000, 69, 4.9, 'Câu chuyện cảm động về chú mèo mun Zorba giữ trọn 3 lời thề: ấp quả trứng hải âu, bảo vệ hải âu con và dạy nó sải cánh bay vào trời xanh.'),
(90, 7, '9786041000090', 'Alice Ở Xứ Sở Thần Tiên', 'alice-o-xu-so-than-tien-90', 'Lewis Carroll', 'NXB Kim Đồng', 100000, 82000, 70, 4.7, 'Chuyến phiêu lưu kỳ ảo vượt khỏi mọi quy luật vật lý vào hang thỏ cùng chú Thỏ Trắng, Mèo Cheshire và Nữ Hoàng Cơ.'),
(91, 7, '9786041000091', 'Pippi Tất Dài Đến Từ Đảo Khỉ', 'pippi-tat-dai-den-tu-dao-khi-91', 'Astrid Lindgren', 'NXB Kim Đồng', 105000, 85000, 71, 4.8, 'Cô bé tóc đỏ siêu khỏe, tự do và tinh nghịch nhất thế giới mang lại tiếng cười sảng khoái và lòng nhân ái cho trẻ em khắp hành tinh.'),
(92, 7, '9786041000092', 'Đất Rừng Phương Nam', 'dat-rung-phuong-nam-92', 'Đoàn Giỏi', 'NXB Kim Đồng', 120000, 95000, 72, 4.9, 'Bức tranh thiên nhiên hào sảng, trù phú của rừng tràm U Minh và hành trình đi tìm cha đầy nghĩa khí của cậu bé An.'),
(93, 7, '9786041000093', 'Không Gia Đình (Sans Famille)', 'khong-gia-dinh-sans-famille-93', 'Hector Malot', 'NXB Kim Đồng', 165000, 135000, 73, 4.9, 'Hành trình phiêu bạt khắp nước Pháp của chú bé mồ côi Rémi cùng gánh xiếc của cụ Vitalis với lòng trung thực và đức hy sinh cảm động.'),
(94, 7, '9786041000094', 'Cho Tôi Xin Một Vé Đi Tuổi Thơ', 'cho-toi-xin-mot-ve-di-tuoi-tho-94', 'Nguyễn Nhật Ánh', 'NXB Kim Đồng', 125000, 99000, 74, 4.9, 'Tấm vé màu nhiệm đưa người lớn trở về với thế giới nghịch ngợm, ngây ngô và đầy ắp tiếng cười của cu Mùi, con Tủn, tí Sún.'),
(95, 8, '9786041000095', 'Câu Chuyện Nghệ Thuật (The Story of Art)', 'cau-chuyen-nghe-thuat-the-story-of-art-95', 'E.H. Gombrich', 'NXB Trẻ', 550000, 450000, 75, 5, 'Cuốn sách nhập môn nghệ thuật thị giác kinh điển nhất thế giới, dẫn dắt lịch sử hội họa và điêu khắc từ thời tiền sử đến thế kỷ 20.'),
(96, 8, '9786041000096', 'Nghệ Thuật Thị Giác & Ngôn Ngữ Thiết Kế', 'nghe-thuat-thi-giac-ngon-ngu-thiet-ke-96', 'Ellen Lupton', 'NXB Trẻ', 260000, 210000, 76, 4.8, 'Các nguyên tắc thị giác cơ bản: tỷ lệ vàng, lưới bố cục, màu sắc và kiểu chữ (Typography) dành cho designer và người làm sáng tạo.'),
(97, 8, '9786041000097', 'Ăn Cắp Ý Tưởng Như Một Nghệ Sĩ', 'an-cap-y-tuong-nhu-mot-nghe-si-97', 'Austin Kleon', 'NXB Trẻ', 105000, 85000, 77, 4.8, '10 bí quyết giải phóng tiềm năng sáng tạo trong kỷ nguyên số: không có gì là hoàn toàn nguyên bản, hãy học hỏi tinh hoa để tạo nên phong cách riêng.'),
(98, 8, '9786041000098', 'Lối Sống Tối Giản Của Người Nhật', 'loi-song-toi-gian-cua-nguoi-nhat-98', 'Sasaki Fumio', 'NXB Trẻ', 130000, 105000, 78, 4.8, 'Vứt bớt đồ đạc để dọn chỗ cho hạnh phúc đích thực: nghệ thuật tối giản (Minimalism) thay đổi cách bài trí không gian và tái lập trật tự tâm trí.'),
(99, 8, '9786041000099', 'Nhiếp Ảnh Đường Phố: Nắm Bắt Khoảnh Khắc', 'nhiep-anh-duong-pho-nam-bat-khoanh-khac-99', 'Henri Cartier-Bresson', 'NXB Trẻ', 245000, 195000, 79, 4.9, 'Triết lý ''Khoảnh khắc quyết định'' (The Decisive Moment) của bậc thầy nhiếp ảnh phóng sự đường phố thế kỷ 20.'),
(100, 8, '9786041000100', 'Tư Duy Thiết Kế Lấy Con Người Làm Trọng Tâm', 'tu-duy-thiet-ke-lay-con-nguoi-lam-trong-tam-100', 'Tim Brown', 'NXB Trẻ', 215000, 175000, 80, 4.8, 'Phương pháp luận Design Thinking từ CEO của IDEO: thấu cảm khách hàng, phác thảo ý tưởng và thử nghiệm nguyên mẫu để giải quyết bài toán phức tạp.');

-- 6. Thêm Dữ liệu Hình ảnh Sách (Book Images)
INSERT INTO book_images (id, book_id, image_url, is_thumbnail) VALUES
(1, 1, 'images/book_ai.png', TRUE),
(2, 2, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80', TRUE),
(3, 3, 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80', TRUE),
(4, 4, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80', TRUE),
(5, 5, 'https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=600&q=80', TRUE),
(6, 6, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80', TRUE),
(7, 7, 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80', TRUE),
(8, 8, 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80', TRUE),
(9, 9, 'images/book_ai.png', TRUE),
(10, 10, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80', TRUE),
(11, 11, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80', TRUE),
(12, 12, 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&w=600&q=80', TRUE),
(13, 13, 'https://images.unsplash.com/photo-1512045482940-f37f5216f639?auto=format&fit=crop&w=600&q=80', TRUE),
(14, 14, 'https://images.unsplash.com/photo-1510172951991-856a654063f9?auto=format&fit=crop&w=600&q=80', TRUE),
(15, 15, 'https://images.unsplash.com/photo-1492052722242-2554d0e99e3a?auto=format&fit=crop&w=600&q=80', TRUE),
(16, 16, 'images/book_finance.png', TRUE),
(17, 17, 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80', TRUE),
(18, 18, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', TRUE),
(19, 19, 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80', TRUE),
(20, 20, 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=600&q=80', TRUE),
(21, 21, 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80', TRUE),
(22, 22, 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=600&q=80', TRUE),
(23, 23, 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80', TRUE),
(24, 24, 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=600&q=80', TRUE),
(25, 25, 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80', TRUE),
(26, 26, 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&w=600&q=80', TRUE),
(27, 27, 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=600&q=80', TRUE),
(28, 28, 'https://images.unsplash.com/photo-1588580000645-4562a6d2c839?auto=format&fit=crop&w=600&q=80', TRUE),
(29, 29, 'https://images.unsplash.com/photo-1525715843208-50592f114251?auto=format&fit=crop&w=600&q=80', TRUE),
(30, 30, 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=80', TRUE),
(31, 31, 'images/book_habits.png', TRUE),
(32, 32, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80', TRUE),
(33, 33, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', TRUE),
(34, 34, 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80', TRUE),
(35, 35, 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80', TRUE),
(36, 36, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80', TRUE),
(37, 37, 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80', TRUE),
(38, 38, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80', TRUE),
(39, 39, 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=600&q=80', TRUE),
(40, 40, 'https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=600&q=80', TRUE),
(41, 41, 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80', TRUE),
(42, 42, 'https://images.unsplash.com/photo-1510172951991-856a654063f9?auto=format&fit=crop&w=600&q=80', TRUE),
(43, 43, 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80', TRUE),
(44, 44, 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80', TRUE),
(45, 45, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80', TRUE),
(46, 46, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', TRUE),
(47, 47, 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80', TRUE),
(48, 48, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80', TRUE),
(49, 49, 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80', TRUE),
(50, 50, 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80', TRUE),
(51, 51, 'images/book_phicong.png', TRUE),
(52, 52, 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80', TRUE),
(53, 53, 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&w=600&q=80', TRUE),
(54, 54, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80', TRUE),
(55, 55, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80', TRUE),
(56, 56, 'images/book_tiemgiat.png', TRUE),
(57, 57, 'https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=600&q=80', TRUE),
(58, 58, 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80', TRUE),
(59, 59, 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80', TRUE),
(60, 60, 'https://images.unsplash.com/photo-1510172951991-856a654063f9?auto=format&fit=crop&w=600&q=80', TRUE),
(61, 61, 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=600&q=80', TRUE),
(62, 62, 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=600&q=80', TRUE),
(63, 63, 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80', TRUE),
(64, 64, 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80', TRUE),
(65, 65, 'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&w=600&q=80', TRUE),
(66, 66, 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=600&q=80', TRUE),
(67, 67, 'https://images.unsplash.com/photo-1588580000645-4562a6d2c839?auto=format&fit=crop&w=600&q=80', TRUE),
(68, 68, 'https://images.unsplash.com/photo-1525715843208-50592f114251?auto=format&fit=crop&w=600&q=80', TRUE),
(69, 69, 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=600&q=80', TRUE),
(70, 70, 'https://images.unsplash.com/photo-1512045482940-f37f5216f639?auto=format&fit=crop&w=600&q=80', TRUE),
(71, 71, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=600&q=80', TRUE),
(72, 72, 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=600&q=80', TRUE),
(73, 73, 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80', TRUE),
(74, 74, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', TRUE),
(75, 75, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80', TRUE),
(76, 76, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80', TRUE),
(77, 77, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80', TRUE),
(78, 78, 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80', TRUE),
(79, 79, 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80', TRUE),
(80, 80, 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80', TRUE),
(81, 81, 'https://images.unsplash.com/photo-1510172951991-856a654063f9?auto=format&fit=crop&w=600&q=80', TRUE),
(82, 82, 'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=600&q=80', TRUE),
(83, 83, 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80', TRUE),
(84, 84, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80', TRUE),
(85, 85, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80', TRUE),
(86, 86, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80', TRUE),
(87, 87, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80', TRUE),
(88, 88, 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80', TRUE),
(89, 89, 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80', TRUE),
(90, 90, 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80', TRUE),
(91, 91, 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80', TRUE),
(92, 92, 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=600&q=80', TRUE),
(93, 93, 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?auto=format&fit=crop&w=600&q=80', TRUE),
(94, 94, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80', TRUE),
(95, 95, 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?auto=format&fit=crop&w=600&q=80', TRUE),
(96, 96, 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=600&q=80', TRUE),
(97, 97, 'https://images.unsplash.com/photo-1526243741027-444d633d7365?auto=format&fit=crop&w=600&q=80', TRUE),
(98, 98, 'https://images.unsplash.com/photo-1492052722242-2554d0e99e3a?auto=format&fit=crop&w=600&q=80', TRUE),
(99, 99, 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=600&q=80', TRUE),
(100, 100, 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?auto=format&fit=crop&w=600&q=80', TRUE);

-- 7. Thêm Dữ liệu Nhập kho (Inventory)
INSERT INTO inventory_receipts (id, user_id, total_cost, note) VALUES 
(1, 1, 35000000, 'Nhập hàng đợt 1 khai trương');

INSERT INTO inventory_receipt_details (receipt_id, book_id, quantity, import_price) VALUES
(1, 1, 50, 150000), 
(1, 2, 100, 100000), 
(1, 3, 120, 120000),
(1, 4, 45, 80000),
(1, 5, 80, 60000);

-- 8. Thêm Dữ liệu Giỏ hàng (Cart)
INSERT INTO carts (id, user_id) VALUES (1, 2);

INSERT INTO cart_items (cart_id, book_id, quantity) VALUES 
(1, 3, 1), -- Mua 1 cuốn Thói quen nguyên tử
(1, 1, 2); -- Mua 2 cuốn Trí tuệ nhân tạo

-- 9. Thêm Dữ liệu Đơn hàng (Orders)
INSERT INTO orders (id, user_id, tracking_number, subtotal, shipping_fee, total_amount, status, shipping_address, receiver_name, receiver_phone) VALUES
(1, 3, 'BM-99887766', 268000, 30000, 298000, 'CONFIRMED', '123 Đường C, Quận 1, TP.HCM', 'Trần Thị B', '0922222222');

INSERT INTO order_details (order_id, book_id, quantity, unit_price) VALUES
(1, 3, 1, 169000), -- Giá lúc mua là 169.000
(1, 5, 1, 99000);  -- Giá lúc mua là 99.000

-- 10. Thêm Dữ liệu Thanh toán (Payments)
INSERT INTO payments (order_id, payment_method, transaction_id, payment_status) VALUES
(1, 'VNPAY', 'VNP123456789T', 'COMPLETED');

-- 11. Thêm Dữ liệu Đánh giá (Reviews)
INSERT INTO reviews (book_id, user_id, rating, comment) VALUES
(3, 3, 5, 'Sách thực tế, dễ áp dụng vào việc xây dựng thói quen hàng ngày!'),
(5, 3, 4, 'Cốt truyện nhẹ nhàng, chữa lành.');

-- 12. Thêm Dữ liệu Lịch sử Chat AI (AI Chat)
INSERT INTO ai_chat_sessions (id, user_id, session_token) VALUES 
(1, 2, 'ses-abc-12345-mock-token');

INSERT INTO ai_chat_messages (session_id, sender, message) VALUES
(1, 'USER', 'Tôi đang muốn tìm một cuốn sách giúp quản lý chi tiêu cá nhân hiệu quả.'),
(1, 'BOT', 'Chào bạn, BookMind AI gợi ý cho bạn cuốn "Tâm Lý Học Tài Chính" của Morgan Housel. Cuốn sách này sẽ giúp bạn hiểu rõ hành vi của mình đối với tiền bạc đấy ạ!');

-- 13. Thêm Dữ liệu Voucher Khuyến mãi (Vouchers & User Vouchers)
INSERT INTO vouchers (id, code, title, description, discount_type, discount_value, max_discount_amount, min_order_amount, badge_text, badge_color, is_active) VALUES
(1, 'AI10', 'Giảm 10% Toàn Đơn', 'Áp dụng cho mọi giá trị đơn hàng, giảm tối đa 50.000đ', 'PERCENT', 10.00, 50000.00, 0.00, 'HOT 🔥', 'danger', TRUE),
(2, 'BOOK20K', 'Giảm 20.000đ', 'Áp dụng cho đơn hàng từ 200.000đ trở lên', 'FIXED', 20000.00, 20000.00, 200000.00, 'PHỔ BIẾN ⭐', 'primary', TRUE),
(3, 'NEWBIE', 'Giảm 15.000đ Bạn Mới', 'Áp dụng đơn hàng từ 100.000đ cho độc giả mới', 'FIXED', 15000.00, 15000.00, 100000.00, 'QUÀ TẶNG 🎁', 'success', TRUE),
(4, 'VIP50K', 'Giảm 50.000đ Đơn Lớn', 'Áp dụng cho đơn hàng từ 400.000đ trở lên', 'FIXED', 50000.00, 50000.00, 400000.00, 'TIẾT KIỆM 💰', 'warning', TRUE);

INSERT INTO user_vouchers (user_id, voucher_id, is_used) VALUES
(2, 1, FALSE),
(2, 3, FALSE);
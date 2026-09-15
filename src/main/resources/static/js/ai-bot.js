/**
 * AI Consultation Chatbot - BookMind Assistant
 * Standalone Intelligent Assistant Edition (100% Hoạt Động Độc Lập)
 *
 * Tính năng nổi bật:
 *  1. Thông báo rõ ràng khi khách tìm sách / tác giả KHÔNG CÓ trong danh mục cửa hàng.
 *  2. Thông báo từ chối lịch sự khi khách hỏi câu hỏi KHÔNG LIÊN QUAN đến sách / mua hàng.
 *  3. Gợi ý sách thông minh theo chủ đề, giá bán, chính sách giao nhận và hỗ trợ tức thì.
 */

let isChatOpen = false;
let hasUnreadMessages = true;

// =====================================================
// KHỞI TẠO
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
    initAIChatbot();
});

function initAIChatbot() {
    const toggleBtn = document.getElementById('aiChatToggleBtn');
    const closeBtn = document.getElementById('aiChatCloseBtn');
    const sendBtn = document.getElementById('aiChatSendBtn');
    const inputField = document.getElementById('aiChatInput');

    if (toggleBtn) toggleBtn.addEventListener('click', toggleAIChat);
    if (closeBtn) closeBtn.addEventListener('click', toggleAIChat);

    if (sendBtn && inputField) {
        sendBtn.addEventListener('click', () => handleUserSend());
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) handleUserSend();
        });
    }

    renderWelcomeMessages();
}

function toggleAIChat() {
    const chatWindow = document.getElementById('aiChatWindow');
    const unreadBadge = document.getElementById('aiUnreadBadge');
    const contactStack = document.getElementById('floatingContactStack');
    isChatOpen = !isChatOpen;
    if (chatWindow) {
        if (isChatOpen) {
            chatWindow.classList.remove('collapsed');
            if (unreadBadge) unreadBadge.style.display = 'none';
            if (contactStack) contactStack.style.display = 'none';
            hasUnreadMessages = false;
        } else {
            chatWindow.classList.add('collapsed');
            if (contactStack) contactStack.style.display = 'flex';
        }
    }
}

function openAIChatWithPrompt(promptText) {
    if (!isChatOpen) toggleAIChat();
    const inputField = document.getElementById('aiChatInput');
    if (inputField) {
        inputField.value = promptText;
        handleUserSend();
    }
}

function askAIAboutBook(bookId) {
    const catalog = getCatalog();
    const book = catalog.find(b => b.id === bookId);
    if (!book) return;
    if (!isChatOpen) toggleAIChat();
    const prompt = `Tư vấn giúp tôi về cuốn: "${book.title}"`;
    appendUserMessage(prompt);
    processChatMessage(prompt, book);
}

// =====================================================
// UI MESSAGES
// =====================================================
function renderWelcomeMessages() {
    const chatBody = document.getElementById('aiChatBody');
    if (!chatBody) return;

    chatBody.innerHTML = `
        <div class="chat-msg bot">
            <div class="msg-avatar"><i class="fas fa-robot"></i></div>
            <div class="msg-content">
                <b>Xin chào! 👋 Tôi là Trợ Lý AI BookMind.</b><br>
                Tôi có thể giúp bạn tìm kiếm sách, tra cứu tác giả, xem top bán chạy và tư vấn chi tiết về sách cũng như đơn hàng!
                <div class="quick-chip-wrapper">
                    <button class="quick-chip" onclick="handleQuickChip('Top 3 sách bán chạy nhất là gì?')">🔥 Top bán chạy</button>
                    <button class="quick-chip" onclick="handleQuickChip('Gợi ý sách học AI và lập trình cho người mới')">💻 Sách Công Nghệ & AI</button>
                    <button class="quick-chip" onclick="handleQuickChip('Sách phát triển bản thân hay nhất bạn có?')">🌱 Phát triển bản thân</button>
                    <button class="quick-chip" onclick="handleQuickChip('Sách nào giá dưới 150k mà đáng đọc?')">💰 Sách giá dưới 150k</button>
                    <button class="quick-chip" onclick="handleQuickChip('Chính sách giao hàng và đổi trả như thế nào?')">🚚 Giao hàng & Đổi trả</button>
                </div>
            </div>
        </div>
    `;
}

function handleQuickChip(promptText) {
    appendUserMessage(promptText);
    processChatMessage(promptText);
}

function handleUserSend() {
    const inputField = document.getElementById('aiChatInput');
    if (!inputField) return;
    const query = inputField.value.trim();
    if (!query) return;
    inputField.value = '';
    appendUserMessage(query);
    processChatMessage(query);
}

function appendUserMessage(text) {
    const chatBody = document.getElementById('aiChatBody');
    if (!chatBody) return;
    chatBody.insertAdjacentHTML('beforeend', `
        <div class="chat-msg user">
            <div class="msg-avatar"><i class="fas fa-user"></i></div>
            <div class="msg-content">${escapeHtml(text)}</div>
        </div>
    `);
    scrollToChatBottom();
}

function appendBotMessage(htmlContent, recommendedBooks = []) {
    const chatBody = document.getElementById('aiChatBody');
    if (!chatBody) return;

    let bookCardsHtml = '';
    if (recommendedBooks && recommendedBooks.length > 0) {
        bookCardsHtml = recommendedBooks.map(book => {
            const priceText = typeof formatCurrency === 'function' ? formatCurrency(book.price) : `${(book.price || 0).toLocaleString('vi-VN')}₫`;
            return `
                <div class="chat-book-recommend">
                    <img src="${book.image}" alt="${escapeHtml(book.title)}" onerror="this.src='https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80'">
                    <div class="info">
                        <div class="title">${escapeHtml(book.title)}</div>
                        <div class="price">${priceText}</div>
                    </div>
                    <a class="btn btn-primary btn-sm px-2 py-1 fs-8 text-decoration-none" href="/books/${book.id}">Xem</a>
                </div>
            `;
        }).join('');
    }

    chatBody.insertAdjacentHTML('beforeend', `
        <div class="chat-msg bot">
            <div class="msg-avatar"><i class="fas fa-robot"></i></div>
            <div class="msg-content">
                <div>${htmlContent}</div>
                ${bookCardsHtml}
            </div>
        </div>
    `);
    scrollToChatBottom();
}

function showTypingIndicator() {
    const chatBody = document.getElementById('aiChatBody');
    if (!chatBody) return;
    chatBody.insertAdjacentHTML('beforeend', `
        <div id="aiTypingIndicator" class="chat-msg bot">
            <div class="msg-avatar"><i class="fas fa-robot"></i></div>
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `);
    scrollToChatBottom();
}

function removeTypingIndicator() {
    const indicator = document.getElementById('aiTypingIndicator');
    if (indicator) indicator.remove();
}

function scrollToChatBottom() {
    const chatBody = document.getElementById('aiChatBody');
    if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
}

// =====================================================
// XỬ LÝ CHATBOT NỘI BỘ (STANDALONE ENGINE)
// =====================================================
function processChatMessage(userMessage, directBook = null) {
    showTypingIndicator();

    // Giả lập độ trễ phản hồi tự nhiên (300ms - 500ms)
    const delay = 300 + Math.floor(Math.random() * 200);

    setTimeout(() => {
        removeTypingIndicator();
        const reply = generateBotReply(userMessage, directBook);
        const htmlReply = markdownToHtml(reply.text);
        appendBotMessage(htmlReply, reply.books || []);
    }, delay);
}

function handleAIChat(userMessage) {
    processChatMessage(userMessage);
}

// =====================================================
// TỪ KHÓA LIÊN QUAN ĐẾN NHÀ SÁCH & MUA HÀNG
// =====================================================
const STORE_KEYWORDS = [
    // Sách, đọc & tác phẩm
    'sach', 'cuon', 'tap', 'doc', 'tac gia', 'tac pham', 'truyen', 'tieu thuyet', 'nxb', 'nha xuat ban',
    'bia', 'trang', 'muc luc', 'tom tat', 'tai ban', 'review', 'sach hay', 'sach moi', 'sach cu', 'manga', 'comic',
    // Thể loại & Lĩnh vực sách
    'cong nghe', 'ai', 'tri tue nhan tao', 'lap trinh', 'code', 'python', 'javascript', 'react', 'java',
    'web', 'devops', 'du lieu', 'khoa hoc', 'vu tru', 'vat ly', 'system design', 'microservices',
    'blockchain', 'deep learning', 'machine learning', 'data',
    'kinh doanh', 'khoi nghiep', 'dau tu', 'tai chinh', 'tien', 'kinh te', 'startup', 'doanh nghiep',
    'bat dong san', 'chung khoan', 'marketing', 'ban hang', 'quan tri', 'ti phu', 'trieu phu',
    'phat trien ban than', 'ky nang', 'thoi quen', 'tam ly', 'tap trung', 'chua lanh', 'giao tiep',
    'self help', 'thanh cong', 'nguyen tu', 'dac nhan tam', 'le song', 'hanh phuc', 'cam xuc', 'eq',
    'van hoc', 'nhat ban', 'kinh dien', 'rung na uy', 'nha gia kim', 'dong xanh',
    // Dịch vụ mua sắm & Thanh toán
    'mua', 'ban', 'gia', 'bao nhieu', 'tien', 're', 'dat', 'tiet kiem', 'gia tot', 'duoi 150k', '150k',
    'giam gia', 'khuyen mai', 'uu dai', 'voucher', 'ma giam', 'sale', 'bestseller', 'ban chay',
    'ship', 'giao hang', 'van chuyen', 'phi ship', 'freeship', 'hoa toc', 'bao lau', 'nhan hang',
    'thanh toan', 'vnpay', 'cod', 'tien mat', 'atm', 'visa',
    'doi tra', 'bao hanh', 'loi sach', 'tra hang',
    'don hang', 'gio hang', 'dat hang', 'tai khoan', 'dang nhap', 'dang ky',
    'nha sach', 'cua hang', 'bookmind', 'shop', 'hotline', 'dia chi', 'lien he',
    // Giao tiếp hỏi đáp với trợ lý
    'chao', 'xin chao', 'hello', 'hi', 'hey', 'alo', 'tro ly', 'bot', 'tu van', 'goi y', 'gioi thieu',
    'co gi', 'giup', 'ho tro', 'cho minh hoi', 'cho em hoi', 'cho toi hoi', 'hoi ve'
];

// Các cụm từ thể hiện khách đang tìm kiếm sách / tác giả
const SEARCH_INTENT_PHRASES = [
    'tim sach', 'kiem sach', 'co sach', 'tim cuon', 'co cuon', 'ban cuon', 'sach cua',
    'tac gia', 'tac pham', 'cuon sach', 'muon mua', 'muon doc', 'muon tim',
    'co ban', 'ban co', 'nha sach co', 'shop co', 'cho minh hoi cuon', 'cho em hoi cuon',
    'hoi cuon', 'hoi sach', 'sach ten', 'truyen', 'tieu thuyet', 'comic', 'manga'
];

// =====================================================
// ENGINE PHÂN TÍCH VÀ TRẢ LỜI THÔNG MINH
// =====================================================
function getCatalog() {
    if (typeof BOOK_CATALOG !== 'undefined' && Array.isArray(BOOK_CATALOG)) {
        return BOOK_CATALOG;
    }
    return [];
}

function removeAccents(str) {
    if (!str) return '';
    return str.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd').replace(/Đ/g, 'D')
        .toLowerCase()
        .trim();
}

function formatMoney(amount) {
    if (typeof formatCurrency === 'function') {
        return formatCurrency(amount);
    }
    return `${(amount || 0).toLocaleString('vi-VN')}₫`;
}

/**
 * Trích xuất tên sách hoặc tác giả từ câu hỏi tìm kiếm
 */
function extractSearchTerm(rawText) {
    let text = (rawText || '').trim();

    // 1. Nếu có để trong dấu ngoặc kép hoặc nháy đơn
    const quoteMatch = text.match(/["“'`](.+?)["”'`]/);
    if (quoteMatch && quoteMatch[1].trim()) {
        return quoteMatch[1].trim();
    }

    // 2. Bỏ các tiền tố hỏi tìm kiếm phổ biến
    const prefixRegex = /^(tim sach|kiem sach|co sach|tim cuon|co cuon|ban cuon|muon tim sach|muon tim|muon doc|muon mua|sach cua tac gia|sach cua|tac gia|tac pham|cuon sach|cho minh hoi cuon|cho em hoi cuon|cho toi hoi cuon|cho minh hoi sach|cho em hoi|cho toi hoi|hoi ve cuon|hoi ve sach|hoi ve|tim kiem|co ban cuon|co ban sach|co ban|ban co sach|ban co|nha sach co sach|nha sach co|shop co sach|shop co)\s+/i;
    text = text.replace(prefixRegex, '');

    // 3. Bỏ các hậu tố câu hỏi
    const suffixRegex = /\s+(khong a|khong shop|khong ban|khong|ko a|ko shop|ko|vay a|vay shop|vay|nhi|the|co khong|nua khong|nua ko)\??$/i;
    text = text.replace(suffixRegex, '');

    // Bỏ dấu câu ở cuối
    text = text.replace(/[?!.,;]+$/, '').trim();

    return text || rawText;
}

/**
 * Kiểm tra xem người dùng có đang tìm sách / tác giả cụ thể hay không
 */
function isSearchIntent(cleanText, rawText) {
    for (const phrase of SEARCH_INTENT_PHRASES) {
        if (cleanText.includes(phrase)) return true;
    }
    // Có dấu ngoặc kép tên sách
    if (/["“'`](.+?)["”'`]/.test(rawText)) return true;

    // Bắt đầu bằng chữ sách/truyện hoặc có từ "sách" đi kèm câu hỏi
    if (cleanText.startsWith('sach ') || cleanText.startsWith('truyen ')) return true;
    if (cleanText.includes('sach') && (cleanText.includes('khong') || cleanText.includes('ko') || rawText.includes('?'))) return true;

    return false;
}

/**
 * Kiểm tra xem câu hỏi có hoàn toàn KHÔNG LIÊN QUAN đến sách / mua hàng không
 */
function isOffTopic(cleanText) {
    if (!cleanText) return false;

    // Kiểm tra xem có chứa bất kỳ từ khóa liên quan đến nhà sách không
    const hasStoreKeyword = STORE_KEYWORDS.some(kw => {
        if (kw.length <= 3) {
            const regex = new RegExp(`(^|\\s)${kw}(\\s|$)`);
            return regex.test(cleanText);
        }
        return cleanText.includes(kw);
    });

    return !hasStoreKeyword;
}

/**
 * Tìm kiếm sách trong catalog theo tiêu đề và từ khóa
 */
function findBookInCatalog(cleanText, catalog) {
    if (!cleanText || !catalog.length) return null;

    // 1. Khớp chính xác hoặc chuỗi con tiêu đề
    for (const b of catalog) {
        const titleClean = removeAccents(b.title);
        if (cleanText.includes(titleClean)) return b;
        if (titleClean.length > 8 && titleClean.includes(cleanText)) return b;
    }

    // 2. Khớp các từ khóa tiêu đề quan trọng (VD: "thoi quen nguyen tu", "dac nhan tam", "clean code", "nha gia kim", "rung na uy")
    for (const b of catalog) {
        const titleClean = removeAccents(b.title);
        const words = titleClean.split(/\s+/).filter(w => w.length > 2);
        const matchedWords = words.filter(w => cleanText.includes(w));
        if (words.length >= 2 && matchedWords.length >= Math.min(2, words.length)) {
            return b;
        }
    }

    // 3. Khớp tags
    for (const b of catalog) {
        if (b.tags && Array.isArray(b.tags)) {
            for (const tag of b.tags) {
                const tagClean = removeAccents(tag);
                if (tagClean.length > 3 && cleanText.includes(tagClean)) {
                    return b;
                }
            }
        }
    }

    return null;
}

/**
 * Tìm kiếm tác giả trong catalog
 */
function findAuthorsInCatalog(cleanText, catalog) {
    if (!cleanText || !catalog.length) return [];
    return catalog.filter(b => {
        const authorClean = removeAccents(b.author);
        return cleanText.includes(authorClean) || (authorClean.length > 5 && authorClean.includes(cleanText));
    });
}

// =====================================================
// HÀM XỬ LÝ CHÍNH GENERATE BOT REPLY
// =====================================================
function generateBotReply(userMessage, directBook = null) {
    const catalog = getCatalog();
    const raw = (userMessage || '').trim();
    const clean = removeAccents(raw);

    // 1. Tư vấn sách cụ thể khi bấm nút "Hỏi AI" trên giao diện
    if (directBook) {
        return buildBookDetailReply(directBook);
    }

    // 2. Chào hỏi / Hỏi thông tin trợ lý
    if (clean.includes('xin chao') || clean.includes('chao ban') || clean.includes('chao shop') || clean === 'chao' || clean === 'hello' || clean === 'hi' || clean === 'hey' || clean === 'alo' || clean.includes('ban la ai') || clean.includes('tro ly')) {
        const sampleBooks = catalog.slice(0, 2);
        return {
            text: `Xin chào bạn! 👋 Tôi là **Trợ lý AI BookMind**.\n\n` +
                  `Tôi có thể hỗ trợ bạn:\n` +
                  `• 🔍 Tra cứu sách, tác giả và gợi ý sách theo sở thích.\n` +
                  `• 🔥 Xem top sách bán chạy và các đầu sách giá tốt dưới 150k.\n` +
                  `• 📦 Giải đáp về thời gian giao hàng, phí ship và chính sách đổi trả.\n\n` +
                  `Bạn muốn tìm hiểu tựa sách nào hôm nay?`,
            books: sampleBooks
        };
    }

    // 3. Chính sách giao hàng, thanh toán, đổi trả
    if (clean.includes('giao hang') || clean.includes('van chuyen') || clean.includes('ship') || clean.includes('thanh toan') || clean.includes('doi tra') || clean.includes('chuyen khoan') || clean.includes('phi ship') || clean.includes('bao lau') || clean.includes('cod') || clean.includes('tra hang') || clean.includes('dia chi') || clean.includes('hotline')) {
        return {
            text: `Dạ, dưới đây là thông tin về **Chính sách mua hàng & Dịch vụ** tại BookMind:\n\n` +
                  `🚚 **Thời gian giao hàng & Phí ship:**\n` +
                  `• Nội thành: 24h - 48h làm việc.\n` +
                  `• Toàn quốc: 2 - 4 ngày làm việc.\n` +
                  `• **Miễn phí vận chuyển (Freeship)** cho mọi đơn hàng từ **250.000₫**!\n\n` +
                  `💳 **Hình thức thanh toán:**\n` +
                  `• Thanh toán khi nhận hàng (**COD**).\n` +
                  `• Chuyển khoản ngân hàng tự động qua **Mã VietQR (PayOS)** (xác nhận đơn tức thì).\n\n` +
                  `🔄 **Chính sách đổi trả:**\n` +
                  `• Hỗ trợ đổi trả miễn phí trong vòng **7 ngày** nếu sách bị lỗi in ấn, rách hoặc hư hại trong quá trình vận chuyển.`,
            books: []
        };
    }

    // 4. Sách giá rẻ / Dưới 150k / Khuyến mãi
    if (clean.includes('duoi 150k') || clean.includes('150k') || clean.includes('gia re') || clean.includes('tiet kiem') || clean.includes('gia tot') || clean.includes('khuyen mai') || clean.includes('giam gia') || clean.includes('uu dai')) {
        const budgetBooks = catalog
            .filter(b => b.price <= 165000)
            .sort((a, b) => (b.discount || 0) - (a.discount || 0))
            .slice(0, 3);

        return {
            text: `Dạ có ngay! BookMind đang có nhiều tựa sách hay với mức giá **dưới 150.000₫ - 165.000₫** kèm ưu đãi giảm giá tốt:\n\n` +
                  budgetBooks.map(b => `• **${b.title}**: Chỉ **${formatMoney(b.price)}** ${b.oldPrice ? `*(giá gốc ${formatMoney(b.oldPrice)})*` : ''}`).join('\n') +
                  `\n\nTất cả đều là sách mới chính hãng, bản in sắc nét:`,
            books: budgetBooks
        };
    }

    // 5. Top sách bán chạy / Bestseller
    if (clean.includes('ban chay') || clean.includes('bestseller') || clean.includes('top sach') || clean.includes('top 3') || clean.includes('top') || clean.includes('hot') || clean.includes('nhieu nguoi doc') || clean.includes('noi bat') || clean.includes('sach hay nhat')) {
        const topBooks = catalog
            .filter(b => b.isBestseller || b.rating >= 4.8)
            .slice(0, 3);

        const listText = topBooks.map((b, i) =>
            `${i + 1}. **${b.title}** - *${b.author}* (⭐ ${b.rating}/5 - **${formatMoney(b.price)}**)`
        ).join('\n');

        return {
            text: `Dưới đây là **Top sách bán chạy & được yêu thích nhất** tại BookMind hiện nay:\n\n${listText}\n\nCác tác phẩm này đều được bạn đọc đánh giá rất cao về cả nội dung lẫn tính ứng dụng. Bạn có thể bấm **Xem** bên dưới để xem chi tiết nhé!`,
            books: topBooks
        };
    }

    // 6. Thể loại: Công nghệ & AI
    if (clean.includes('cong nghe') || clean.includes('ai') || clean.includes('tri tue nhan tao') || clean.includes('lap trinh') || clean.includes('code') || clean.includes('react') || clean.includes('python') || clean.includes('javascript') || clean.includes('system design') || clean.includes('deep learning') || clean.includes('khoa hoc')) {
        const techBooks = catalog.filter(b =>
            b.category === 'tech' ||
            (b.categoryName && removeAccents(b.categoryName).includes('cong nghe')) ||
            (b.tags && b.tags.some(t => ['ai', 'lập trình', 'code', 'công nghệ', 'python'].includes(t.toLowerCase())))
        ).slice(0, 3);

        return {
            text: `Chào bạn! Về mảng **Công Nghệ, Lập Trình & AI**, BookMind xin giới thiệu các tựa sách chất lượng nhất:\n\n` +
                  techBooks.map(b => `• **${b.title}** (${formatMoney(b.price)}) - *${b.author}*`).join('\n') +
                  `\n\nNhững cuốn sách này cung cấp từ nền tảng vững chắc đến kiến thức thực chiến nâng cao. Mời bạn xem chi tiết:`,
            books: techBooks
        };
    }

    // 7. Thể loại: Phát triển bản thân & Kỹ năng
    if (clean.includes('phat trien ban than') || clean.includes('ky nang') || clean.includes('tam ly') || clean.includes('thoi quen') || clean.includes('tap trung') || clean.includes('chua lanh') || clean.includes('giao tiep') || clean.includes('self help')) {
        const selfHelpBooks = catalog.filter(b =>
            b.category === 'self-help' ||
            b.category === 'psychology' ||
            (b.categoryName && (removeAccents(b.categoryName).includes('phat trien') || removeAccents(b.categoryName).includes('tam ly')))
        ).slice(0, 3);

        return {
            text: `Đây là các tác phẩm **Phát triển bản thân & Tâm lý học ứng dụng** xuất sắc nhất được nhiều độc giả khuyên đọc:\n\n` +
                  selfHelpBooks.map(b => `• **${b.title}** - *${b.author}*`).join('\n') +
                  `\n\nGiúp rèn luyện thói quen, nâng cao tư duy và cân bằng cuộc sống. Bạn bấm **Xem** bên dưới để đọc thử mục lục nhé!`,
            books: selfHelpBooks
        };
    }

    // 8. Thể loại: Kinh doanh & Đầu tư
    if (clean.includes('kinh doanh') || clean.includes('khoi nghiep') || clean.includes('dau tu') || clean.includes('tai chinh') || clean.includes('tien') || clean.includes('kinh te') || clean.includes('startup') || clean.includes('doanh nghiep')) {
        const bizBooks = catalog.filter(b =>
            b.category === 'business' ||
            (b.categoryName && removeAccents(b.categoryName).includes('kinh te'))
        ).slice(0, 3);

        return {
            text: `Về chủ đề **Kinh Doanh, Khởi Nghiệp & Quản Lý Tài Chính**, đây là 3 cuốn sách gối đầu giường dành cho bạn:\n\n` +
                  bizBooks.map(b => `• **${b.title}** - *${b.author}* (Giá: **${formatMoney(b.price)}**)`).join('\n') +
                  `\n\nSách trang bị tư duy chiến lược và kỹ năng quản lý tài chính vững vàng:`,
            books: bizBooks
        };
    }

    // 9. Thể loại: Văn học & Tiểu thuyết
    if (clean.includes('van hoc') || clean.includes('tieu thuyet') || clean.includes('truyen kinh dien') || clean.includes('tac pham kinh dien')) {
        const litBooks = catalog.filter(b =>
            b.category === 'literature' ||
            (b.categoryName && removeAccents(b.categoryName).includes('van hoc'))
        ).slice(0, 3);

        return {
            text: `Nếu bạn đang tìm những tác phẩm **Văn Học & Tiểu Thuyết Kinh Điển** để thả lỏng tâm hồn, BookMind gợi ý:\n\n` +
                  litBooks.map(b => `• **${b.title}** - *${b.author}*`).join('\n') +
                  `\n\nNhững câu chuyện giàu cảm xúc và bài học nhân sinh sâu sắc:`,
            books: litBooks
        };
    }

    // 10. Tìm kiếm theo cuốn sách CỤ THỂ CÓ TRONG CATALOG
    const matchedBook = findBookInCatalog(clean, catalog);
    if (matchedBook) {
        return buildBookDetailReply(matchedBook);
    }

    // 11. Tìm kiếm theo TÁC GIẢ CỤ THỂ CÓ TRONG CATALOG
    const authorMatches = findAuthorsInCatalog(clean, catalog);
    if (authorMatches.length > 0) {
        return {
            text: `Tìm thấy **${authorMatches.length} cuốn sách** của tác giả **${authorMatches[0].author}** tại nhà sách BookMind:\n\n` +
                  authorMatches.map(b => `• **${b.title}** - Giá: **${formatMoney(b.price)}**`).join('\n') +
                  `\n\nMời bạn tham khảo chi tiết bên dưới:`,
            books: authorMatches.slice(0, 3)
        };
    }

    // =====================================================================
    // ⚠️ YÊU CẦU 1: KHÁCH TÌM SÁCH / TÁC GIẢ NHƯNG KHÔNG CÓ TRONG STORE
    // =====================================================================
    if (isSearchIntent(clean, raw)) {
        const searchTerm = extractSearchTerm(raw);
        const topBooks = catalog.filter(b => b.isBestseller || b.rating >= 4.8).slice(0, 3);

        return {
            text: `🔍 **Thông báo từ BookMind:**\n\n` +
                  `Rất tiếc, hiện tại BookMind **chưa có** cuốn sách hoặc tác giả **"${escapeHtml(searchTerm)}"** trong danh mục của cửa hàng.\n\n` +
                  `📌 **Gợi ý dành cho bạn:**\n` +
                  `• Bạn vui lòng kiểm tra lại chính tả tên sách hoặc tác giả.\n` +
                  `• Nhà sách BookMind liên tục nhập thêm sách mới mỗi tuần. Bạn có thể liên hệ Hotline/Fanpage để gửi yêu cầu nhập cuốn sách này nhé!\n\n` +
                  `👉 Trong lúc này, bạn có thể tham khảo một số tựa sách bán chạy đang có sẵn tại cửa hàng:`,
            books: topBooks
        };
    }

    // =====================================================================
    // ⚠️ YÊU CẦU 2: CÂU HỎI KHÔNG LIÊN QUAN ĐẾN SÁCH & MUA HÀNG (OFF-TOPIC)
    // =====================================================================
    if (isOffTopic(clean)) {
        return {
            text: `⚠️ **Thông báo từ Trợ lý AI BookMind:**\n\n` +
                  `Xin lỗi bạn, tôi là **Trợ lý ảo chuyên trách của Nhà sách BookMind**, chỉ có thể hỗ trợ các thông tin liên quan đến **sách, tác giả, mua hàng và dịch vụ của cửa hàng**.\n\n` +
                  `Rất tiếc tôi **không thể trả lời các câu hỏi ngoài phạm vi này** (như thời tiết, câu đố, kiến thức đời sống, tin tức ngoài lề...).\n\n` +
                  `📚 **Bạn có thể hỏi tôi về:**\n` +
                  `• Gợi ý sách hay: *Công nghệ & AI, Phát triển bản thân, Kinh doanh, Văn học...*\n` +
                  `• Tìm sách bán chạy nhất hoặc sách giá rẻ dưới 150k.\n` +
                  `• Hướng dẫn mua hàng, thanh toán qua mã QR/COD và chính sách giao nhận.\n\n` +
                  `Mời bạn chọn câu hỏi liên quan đến sách để tôi hỗ trợ bạn tốt nhất nhé!`,
            books: []
        };
    }

    // =====================================================================
    // 12. Fallback chung khi câu hỏi chưa rõ ràng nhưng có liên quan
    // =====================================================================
    const fallbackBooks = catalog.filter(b => b.isBestseller).slice(0, 3);
    return {
        text: `Cảm ơn câu hỏi của bạn! Bạn có thể thử tìm kiếm theo các chủ đề phổ biến sau:\n\n` +
              `• Gõ **"Top bán chạy"** để xem các tựa sách được yêu thích nhất.\n` +
              `• Gõ **"Sách Công nghệ"** hoặc **"Phát triển bản thân"** để nhận gợi ý chuyên sâu.\n` +
              `• Gõ **"Sách dưới 150k"** để tìm sách giá tốt.\n` +
              `• Hoặc gõ trực tiếp tên cuốn sách bạn đang quan tâm.\n\n` +
              `Dưới đây là một số tựa sách nổi bật mà bạn có thể quan tâm:`,
        books: fallbackBooks
    };
}

function buildBookDetailReply(book) {
    const priceText = formatMoney(book.price);
    const oldPriceText = book.oldPrice ? formatMoney(book.oldPrice) : '';
    const discountText = book.discount ? `*(tiết kiệm ${book.discount}%)*` : '';

    return {
        text: `Dạ, cuốn **"${book.title}"** của tác giả **${book.author}** là một tác phẩm rất nổi bật thuộc danh mục **${book.categoryName || 'Sách Hay'}**!\n\n` +
              `⭐ **Đánh giá:** ${book.rating || 5}/5 (${book.reviewsCount || 100}+ lượt đánh giá)\n` +
              `💵 **Giá bán:** **${priceText}** ${oldPriceText ? `*(giá gốc: ${oldPriceText} ${discountText})*` : ''}\n\n` +
              `📖 **Tóm tắt nội dung:**\n` +
              `${book.description || 'Tác phẩm mang lại nhiều giá trị thực tiễn và góc nhìn sâu sắc cho người đọc.'}\n\n` +
              `💡 Bạn có thể bấm nút **Xem** bên dưới để đọc thêm chi tiết hoặc thêm vào giỏ hàng ngay nhé!`,
        books: [book]
    };
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================
function findMentionedBooks(replyText) {
    const catalog = getCatalog();
    if (!catalog.length || !replyText) return [];
    const lowerReply = replyText.toLowerCase();
    return catalog.filter(book =>
        lowerReply.includes(book.title.toLowerCase().substring(0, 12))
    ).slice(0, 3);
}

function markdownToHtml(text) {
    if (!text) return '';
    return text
        .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
        .replace(/\*(.+?)\*/g, '<i>$1</i>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/\n\n/g, '<br><br>')
        .replace(/\n/g, '<br>')
        .replace(/^[-•]\s(.+)/gm, '• $1');
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.innerText = text;
    return div.innerHTML;
}

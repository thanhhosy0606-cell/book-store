package com.bookmind.config;

import com.bookmind.repository.BookRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.datasource.init.ScriptUtils;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;

@Component
public class BookCatalogInitializer implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(BookCatalogInitializer.class);

    private final BookRepository bookRepository;
    private final DataSource dataSource;

    public BookCatalogInitializer(BookRepository bookRepository, DataSource dataSource) {
        this.bookRepository = bookRepository;
        this.dataSource = dataSource;
    }

    @Override
    public void run(ApplicationArguments args) {
        try {
            long currentCount = bookRepository.count();
            log.info("📊 Kiểm tra số lượng sách trong kho CSDL: {} cuốn", currentCount);

            if (currentCount < 100) {
                log.info("🚀 Phát hiện kho sách CSDL chưa đủ 100 cuốn (hiện có {} cuốn). Đang tự động nạp danh mục 100 cuốn chuẩn...", currentCount);
                try (Connection conn = dataSource.getConnection()) {
                    ClassPathResource resource = new ClassPathResource("seed-catalog.sql");
                    ScriptUtils.executeSqlScript(conn, resource);
                    long newCount = bookRepository.count();
                    log.info("✅ Nạp thành công danh mục sách! Số lượng sách trong kho CSDL hiện tại: {} cuốn.", newCount);
                } catch (Exception e) {
                    log.error("❌ Lỗi khi tự động nạp danh mục sách seed-catalog.sql: {}", e.getMessage(), e);
                }
            } else {
                log.info("✅ Kho sách CSDL đã có đầy đủ {} cuốn, không cần nạp thêm.", currentCount);
            }
        } catch (Exception ex) {
            log.warn("⚠️ Không thể kiểm tra hoặc nạp danh mục sách khởi tạo: {}", ex.getMessage());
        }
    }
}

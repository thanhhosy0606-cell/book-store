package com.bookmind.controller;

import com.bookmind.entity.Category;
import com.bookmind.repository.CategoryRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.text.Normalizer;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Pattern;

@RestController
@RequestMapping({"/api/admin/categories", "/api/categories"})
@CrossOrigin(origins = "*")
public class AdminCategoryController {

    private static final Logger log = LoggerFactory.getLogger(AdminCategoryController.class);
    private final CategoryRepository categoryRepository;

    public AdminCategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> createCategory(@RequestBody Map<String, String> body) {
        String name = body.get("name");
        if (name == null || name.isBlank()) {
            return ResponseEntity.badRequest().body("Tên thể loại không được để trống!");
        }

        String slug = generateSlug(name);
        String baseSlug = slug;
        int counter = 1;
        while (categoryRepository.findBySlug(slug).isPresent()) {
            slug = baseSlug + "-" + counter++;
        }

        Category category = new Category();
        category.setName(name.trim());
        category.setSlug(slug);
        if (body.containsKey("description") && body.get("description") != null) {
            category.setDescription(body.get("description").trim());
        }
        category.setStatus(true);

        Category saved = categoryRepository.save(category);
        log.info("Admin created category #{}: {}", saved.getId(), saved.getName());
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return categoryRepository.findById(id)
                .map(cat -> {
                    if (body.containsKey("name") && body.get("name") != null) {
                        cat.setName(body.get("name").toString().trim());
                    }
                    if (body.containsKey("description")) {
                        cat.setDescription(body.get("description") != null ? body.get("description").toString().trim() : null);
                    }
                    if (body.containsKey("status") && body.get("status") != null) {
                        cat.setStatus(Boolean.valueOf(body.get("status").toString()));
                    }
                    Category updated = categoryRepository.save(cat);
                    log.info("Admin updated category #{}: {}", updated.getId(), updated.getName());
                    return ResponseEntity.ok(updated);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        return categoryRepository.findById(id)
                .map(cat -> {
                    categoryRepository.delete(cat);
                    log.info("Admin deleted category #{}", id);
                    return ResponseEntity.ok("Đã xóa thể loại #" + id);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private String generateSlug(String input) {
        if (input == null) return "";
        String str = input.toLowerCase(Locale.ENGLISH).trim();
        str = str.replace("đ", "d").replace("Đ", "d");
        String normalized = Normalizer.normalize(str, Normalizer.Form.NFD);
        String noAccents = Pattern.compile("\\p{InCombiningDiacriticalMarks}+").matcher(normalized).replaceAll("");
        String slug = Pattern.compile("[^a-z0-9\\s-]").matcher(noAccents).replaceAll("");
        slug = Pattern.compile("[\\s]+").matcher(slug).replaceAll("-");
        slug = Pattern.compile("-+").matcher(slug).replaceAll("-");
        return slug.replaceAll("^-|-$", "");
    }
}

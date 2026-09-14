package com.bookmind.repository;

import com.bookmind.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    Optional<Book> findBySlug(String slug);
    Optional<Book> findByIsbn(String isbn);
    List<Book> findByCategoryId(Long categoryId);
}


package com.finance.financeapp.controller;

import com.finance.financeapp.dto.CategoryDTO;
import com.finance.financeapp.dto.MessageResponse;
import com.finance.financeapp.entity.Category;
import com.finance.financeapp.entity.TransactionType;
import com.finance.financeapp.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowedOrigins}")
public class CategoryController {
    private final CategoryService categoryService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> addCategory(
        @RequestParam Long userId,
        @Valid @RequestBody CategoryDTO categoryDTO
    ) {
        Category category = categoryService.addCategory(userId, categoryDTO);
        return ResponseEntity.ok(category);
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getCategories(
        @RequestParam Long userId,
        @RequestParam(required = false) TransactionType type
    ) {
        if (type != null) {
            List<Category> categories = categoryService.getCategoriesByUserIdAndType(userId, type);
            return ResponseEntity.ok(categories);
        }
        List<Category> categories = categoryService.getCategoriesByUserId(userId);
        return ResponseEntity.ok(categories);
    }

    @PutMapping("/{categoryId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateCategory(
        @PathVariable Long categoryId,
        @Valid @RequestBody CategoryDTO categoryDTO
    ) {
        Category category = categoryService.updateCategory(categoryId, categoryDTO);
        return ResponseEntity.ok(category);
    }

    @DeleteMapping("/{categoryId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> deleteCategory(@PathVariable Long categoryId) {
        categoryService.deleteCategory(categoryId);
        return ResponseEntity.ok(new MessageResponse("Category deleted successfully"));
    }
}

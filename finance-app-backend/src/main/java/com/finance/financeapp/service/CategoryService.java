package com.finance.financeapp.service;

import com.finance.financeapp.dto.CategoryDTO;
import com.finance.financeapp.entity.Category;
import com.finance.financeapp.entity.TransactionType;
import com.finance.financeapp.entity.User;
import com.finance.financeapp.repository.CategoryRepository;
import com.finance.financeapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    
    public Category addCategory(Long userId, CategoryDTO categoryDTO) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Category category = new Category();
        category.setUser(user);
        category.setName(categoryDTO.getName());
        category.setColor(categoryDTO.getColor());
        category.setIcon(categoryDTO.getIcon());
        category.setType(categoryDTO.getType());
        
        return categoryRepository.save(category);
    }
    
    public List<Category> getCategoriesByUserId(Long userId) {
        return categoryRepository.findByUserId(userId);
    }
    
    public List<Category> getCategoriesByUserIdAndType(Long userId, TransactionType type) {
        return categoryRepository.findByUserIdAndType(userId, type);
    }
    
    public Category updateCategory(Long categoryId, CategoryDTO categoryDTO) {
        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new RuntimeException("Category not found"));
        
        category.setName(categoryDTO.getName());
        category.setColor(categoryDTO.getColor());
        category.setIcon(categoryDTO.getIcon());
        category.setType(categoryDTO.getType());
        
        return categoryRepository.save(category);
    }
    
    public void deleteCategory(Long categoryId) {
        categoryRepository.deleteById(categoryId);
    }
}

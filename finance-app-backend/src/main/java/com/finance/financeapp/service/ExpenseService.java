package com.finance.financeapp.service;

import com.finance.financeapp.dto.ExpenseDTO;
import com.finance.financeapp.entity.Category;
import com.finance.financeapp.entity.Expense;
import com.finance.financeapp.entity.User;
import com.finance.financeapp.repository.CategoryRepository;
import com.finance.financeapp.repository.ExpenseRepository;
import com.finance.financeapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class ExpenseService {
    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    
    public Expense addExpense(Long userId, ExpenseDTO expenseDTO) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Category category = categoryRepository.findById(expenseDTO.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Category not found"));
        
        Expense expense = new Expense();
        expense.setUser(user);
        expense.setCategory(category);
        expense.setAmount(expenseDTO.getAmount());
        expense.setDescription(expenseDTO.getDescription());
        expense.setExpenseDate(expenseDTO.getExpenseDate());
        expense.setPaymentMethod(expenseDTO.getPaymentMethod());
        
        return expenseRepository.save(expense);
    }
    
    public List<Expense> getExpensesByDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        return expenseRepository.findByUserIdAndExpenseDateBetween(userId, startDate, endDate);
    }
    
    public List<Expense> getExpensesByUserId(Long userId) {
        return expenseRepository.findByUserId(userId);
    }
    
    public BigDecimal getTotalExpense(Long userId, LocalDate startDate, LocalDate endDate) {
        BigDecimal total = expenseRepository.getTotalExpenseByDateRange(userId, startDate, endDate);
        return total != null ? total : BigDecimal.ZERO;
    }
    
    public Map<String, BigDecimal> getExpensesByCategory(Long userId, LocalDate startDate, LocalDate endDate) {
        Map<String, BigDecimal> categoryExpenses = new HashMap<>();
        
        List<Category> categories = categoryRepository.findByUserId(userId);
        for (Category category : categories) {
            BigDecimal amount = expenseRepository.getTotalExpenseByCategory(userId, category.getId(), startDate, endDate);
            if (amount != null && amount.compareTo(BigDecimal.ZERO) > 0) {
                categoryExpenses.put(category.getName(), amount);
            }
        }
        
        return categoryExpenses;
    }
    
    public Expense updateExpense(Long expenseId, ExpenseDTO expenseDTO) {
        Expense expense = expenseRepository.findById(expenseId)
            .orElseThrow(() -> new RuntimeException("Expense not found"));
        
        if (expenseDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(expenseDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
            expense.setCategory(category);
        }
        
        if (expenseDTO.getAmount() != null) {
            expense.setAmount(expenseDTO.getAmount());
        }
        if (expenseDTO.getDescription() != null) {
            expense.setDescription(expenseDTO.getDescription());
        }
        if (expenseDTO.getExpenseDate() != null) {
            expense.setExpenseDate(expenseDTO.getExpenseDate());
        }
        if (expenseDTO.getPaymentMethod() != null) {
            expense.setPaymentMethod(expenseDTO.getPaymentMethod());
        }
        
        return expenseRepository.save(expense);
    }
    
    public void deleteExpense(Long expenseId) {
        expenseRepository.deleteById(expenseId);
    }
}

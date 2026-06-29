package com.finance.financeapp.service;

import com.finance.financeapp.dto.BudgetDTO;
import com.finance.financeapp.dto.BudgetStatus;
import com.finance.financeapp.entity.Budget;
import com.finance.financeapp.entity.Category;
import com.finance.financeapp.entity.User;
import com.finance.financeapp.repository.BudgetRepository;
import com.finance.financeapp.repository.CategoryRepository;
import com.finance.financeapp.repository.ExpenseRepository;
import com.finance.financeapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class BudgetService {
    private final BudgetRepository budgetRepository;
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    
    public Budget createBudget(Long userId, BudgetDTO budgetDTO) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Budget budget = new Budget();
        budget.setUser(user);
        
        if (budgetDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(budgetDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
            budget.setCategory(category);
        }
        
        budget.setLimitAmount(budgetDTO.getLimitAmount());
        budget.setPeriod(budgetDTO.getPeriod());
        budget.setMonthYear(budgetDTO.getMonthYear());
        budget.setAlertPercentage(budgetDTO.getAlertPercentage() != null ? budgetDTO.getAlertPercentage() : 80);
        
        return budgetRepository.save(budget);
    }
    
    public List<Budget> getBudgetsByUserId(Long userId) {
        return budgetRepository.findByUserId(userId);
    }
    
    public BudgetStatus getBudgetStatus(Long budgetId) {
        Budget budget = budgetRepository.findById(budgetId)
            .orElseThrow(() -> new RuntimeException("Budget not found"));
        
        LocalDate startDate, endDate;
        if (budget.getPeriod().name().equals("MONTHLY")) {
            startDate = LocalDate.now().withDayOfMonth(1);
            endDate = startDate.plusMonths(1).minusDays(1);
        } else {
            startDate = LocalDate.now().withDayOfYear(1);
            endDate = startDate.plusYears(1).minusDays(1);
        }
        
        BigDecimal spent;
        if (budget.getCategory() != null) {
            spent = expenseRepository.getTotalExpenseByCategory(
                budget.getUser().getId(),
                budget.getCategory().getId(),
                startDate,
                endDate
            );
        } else {
            spent = expenseRepository.getTotalExpenseByDateRange(
                budget.getUser().getId(),
                startDate,
                endDate
            );
        }
        
        if (spent == null) {
            spent = BigDecimal.ZERO;
        }
        
        BigDecimal remaining = budget.getLimitAmount().subtract(spent);
        double percentageUsed = budget.getLimitAmount().compareTo(BigDecimal.ZERO) > 0 
            ? spent.divide(budget.getLimitAmount(), 2, RoundingMode.HALF_UP).doubleValue() * 100 
            : 0;
        
        return new BudgetStatus(
            budget,
            spent,
            remaining,
            percentageUsed,
            percentageUsed >= budget.getAlertPercentage()
        );
    }
    
    public Budget updateBudget(Long budgetId, BudgetDTO budgetDTO) {
        Budget budget = budgetRepository.findById(budgetId)
            .orElseThrow(() -> new RuntimeException("Budget not found"));
        
        if (budgetDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(budgetDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
            budget.setCategory(category);
        }
        
        budget.setLimitAmount(budgetDTO.getLimitAmount());
        budget.setPeriod(budgetDTO.getPeriod());
        budget.setMonthYear(budgetDTO.getMonthYear());
        budget.setAlertPercentage(budgetDTO.getAlertPercentage());
        
        return budgetRepository.save(budget);
    }
    
    public void deleteBudget(Long budgetId) {
        budgetRepository.deleteById(budgetId);
    }
}

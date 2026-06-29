package com.finance.financeapp.service;

import com.finance.financeapp.dto.IncomeDTO;
import com.finance.financeapp.entity.Category;
import com.finance.financeapp.entity.Income;
import com.finance.financeapp.entity.User;
import com.finance.financeapp.repository.CategoryRepository;
import com.finance.financeapp.repository.IncomeRepository;
import com.finance.financeapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class IncomeService {
    private final IncomeRepository incomeRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    
    public Income addIncome(Long userId, IncomeDTO incomeDTO) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Category category = categoryRepository.findById(incomeDTO.getCategoryId())
            .orElseThrow(() -> new RuntimeException("Category not found"));
        
        Income income = new Income();
        income.setUser(user);
        income.setCategory(category);
        income.setAmount(incomeDTO.getAmount());
        income.setDescription(incomeDTO.getDescription());
        income.setIncomeDate(incomeDTO.getIncomeDate());
        income.setSource(incomeDTO.getSource());
        
        return incomeRepository.save(income);
    }
    
    public List<Income> getIncomesByDateRange(Long userId, LocalDate startDate, LocalDate endDate) {
        return incomeRepository.findByUserIdAndIncomeDateBetween(userId, startDate, endDate);
    }
    
    public List<Income> getIncomesByUserId(Long userId) {
        return incomeRepository.findByUserId(userId);
    }
    
    public BigDecimal getTotalIncome(Long userId, LocalDate startDate, LocalDate endDate) {
        BigDecimal total = incomeRepository.getTotalIncomeByDateRange(userId, startDate, endDate);
        return total != null ? total : BigDecimal.ZERO;
    }
    
    public Income updateIncome(Long incomeId, IncomeDTO incomeDTO) {
        Income income = incomeRepository.findById(incomeId)
            .orElseThrow(() -> new RuntimeException("Income not found"));
        
        if (incomeDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(incomeDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found"));
            income.setCategory(category);
        }
        
        if (incomeDTO.getAmount() != null) {
            income.setAmount(incomeDTO.getAmount());
        }
        if (incomeDTO.getDescription() != null) {
            income.setDescription(incomeDTO.getDescription());
        }
        if (incomeDTO.getIncomeDate() != null) {
            income.setIncomeDate(incomeDTO.getIncomeDate());
        }
        if (incomeDTO.getSource() != null) {
            income.setSource(incomeDTO.getSource());
        }
        
        return incomeRepository.save(income);
    }
    
    public void deleteIncome(Long incomeId) {
        incomeRepository.deleteById(incomeId);
    }
}

package com.finance.financeapp.service;

import com.finance.financeapp.entity.*;
import com.finance.financeapp.repository.ExpenseRepository;
import com.finance.financeapp.repository.RecurringExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class RecurringExpenseService {
    private final RecurringExpenseRepository recurringRepo;
    private final ExpenseRepository expenseRepo;
    
    @Scheduled(cron = "0 0 0 * * ?")
    public void processRecurringExpenses() {
        List<RecurringExpense> activeRecurring = recurringRepo.findByIsActiveTrue();
        
        for (RecurringExpense rec : activeRecurring) {
            LocalDate today = LocalDate.now();
            
            if (shouldCreateExpense(rec, today)) {
                Expense expense = new Expense();
                expense.setUser(rec.getUser());
                expense.setCategory(rec.getCategory());
                expense.setAmount(rec.getAmount());
                expense.setDescription(rec.getDescription());
                expense.setExpenseDate(today);
                expense.setPaymentMethod("AUTO");
                
                expenseRepo.save(expense);
            }
            
            if (rec.getEndDate() != null && today.isAfter(rec.getEndDate())) {
                rec.setIsActive(false);
                recurringRepo.save(rec);
            }
        }
    }
    
    private boolean shouldCreateExpense(RecurringExpense rec, LocalDate today) {
        LocalDate lastExpense = expenseRepo.getLastExpenseDate(
            rec.getUser().getId(), 
            rec.getCategory().getId()
        ).orElse(null);
        
        if (lastExpense == null) {
            return !today.isBefore(rec.getStartDate());
        }
        
        return switch(rec.getFrequency()) {
            case DAILY -> today.isAfter(lastExpense);
            case WEEKLY -> ChronoUnit.WEEKS.between(lastExpense, today) >= 1;
            case MONTHLY -> ChronoUnit.MONTHS.between(lastExpense, today) >= 1;
            case YEARLY -> ChronoUnit.YEARS.between(lastExpense, today) >= 1;
        };
    }
    
    public RecurringExpense createRecurringExpense(Long userId, RecurringExpense recurringExpense) {
        return recurringRepo.save(recurringExpense);
    }
    
    public List<RecurringExpense> getRecurringExpensesByUserId(Long userId) {
        return recurringRepo.findByUserId(userId);
    }
    
    public void deleteRecurringExpense(Long id) {
        recurringRepo.deleteById(id);
    }
}

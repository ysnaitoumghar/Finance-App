package com.finance.financeapp.service;

import com.finance.financeapp.dto.SharedExpenseDTO;
import com.finance.financeapp.entity.*;
import com.finance.financeapp.repository.*;
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
public class SharedExpenseService {
    private final SharedExpenseRepository sharedExpenseRepository;
    private final ExpenseSplitRepository splitRepository;
    private final ExpenseGroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserRepository userRepository;
    
    public SharedExpense createSharedExpense(Long groupId, SharedExpenseDTO dto) {
        ExpenseGroup group = groupRepository.findById(groupId)
            .orElseThrow(() -> new RuntimeException("Group not found"));
        
        List<GroupMember> memberList = groupMemberRepository.findByGroupId(groupId);
        
        if (memberList.isEmpty()) {
            throw new RuntimeException("No members in group");
        }
        
        BigDecimal splitAmount = dto.getAmount().divide(
            new BigDecimal(memberList.size()),
            2,
            RoundingMode.HALF_UP
        );
        
        SharedExpense expense = new SharedExpense();
        expense.setGroup(group);
        expense.setPaidBy(userRepository.findById(dto.getPaidBy())
            .orElseThrow(() -> new RuntimeException("User not found")));
        
        if (dto.getCategoryId() != null) {
            expense.setCategory(null); // Simplified for now
        }
        
        expense.setAmount(dto.getAmount());
        expense.setDescription(dto.getDescription());
        expense.setExpenseDate(dto.getExpenseDate() != null ? dto.getExpenseDate() : LocalDate.now());
        
        SharedExpense saved = sharedExpenseRepository.save(expense);
        
        for (GroupMember member : memberList) {
            if (!member.getUser().getId().equals(dto.getPaidBy())) {
                ExpenseSplit split = new ExpenseSplit();
                split.setSharedExpense(saved);
                split.setOwedBy(member.getUser());
                split.setAmountOwed(splitAmount);
                split.setStatus(SplitStatus.PENDING);
                splitRepository.save(split);
            }
        }
        
        return saved;
    }
    
    public List<SharedExpense> getSharedExpensesByGroupId(Long groupId) {
        return sharedExpenseRepository.findByGroupId(groupId);
    }
    
    public void settleExpense(Long splitId) {
        ExpenseSplit split = splitRepository.findById(splitId)
            .orElseThrow(() -> new RuntimeException("Split not found"));
        split.setStatus(SplitStatus.PAID);
        split.setAmountPaid(split.getAmountOwed());
        splitRepository.save(split);
    }
    
    public BigDecimal getAmountOwed(Long userId, Long groupId) {
        return splitRepository.getTotalAmountOwed(userId, groupId);
    }
}

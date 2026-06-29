package com.finance.financeapp.repository;

import com.finance.financeapp.entity.SharedExpense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SharedExpenseRepository extends JpaRepository<SharedExpense, Long> {
    List<SharedExpense> findByGroupId(Long groupId);
    List<SharedExpense> findByPaidBy_Id(Long userId);
}

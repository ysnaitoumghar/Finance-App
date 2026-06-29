package com.finance.financeapp.repository;

import com.finance.financeapp.entity.ExpenseGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseGroupRepository extends JpaRepository<ExpenseGroup, Long> {
    List<ExpenseGroup> findByCreatedBy_Id(Long userId);
}

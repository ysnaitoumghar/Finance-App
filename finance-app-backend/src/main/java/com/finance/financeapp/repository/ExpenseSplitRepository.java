package com.finance.financeapp.repository;

import com.finance.financeapp.entity.ExpenseSplit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ExpenseSplitRepository extends JpaRepository<ExpenseSplit, Long> {
    List<ExpenseSplit> findBySharedExpense_GroupId(Long groupId);
    List<ExpenseSplit> findByOwedBy_Id(Long userId);
    
    @Query("SELECT COALESCE(SUM(es.amountOwed - es.amountPaid), 0) FROM ExpenseSplit es WHERE es.owedBy.id = :userId AND es.sharedExpense.group.id = :groupId")
    BigDecimal getTotalAmountOwed(@Param("userId") Long userId, @Param("groupId") Long groupId);
}

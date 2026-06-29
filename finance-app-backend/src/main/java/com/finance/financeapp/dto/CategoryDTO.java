package com.finance.financeapp.dto;

import com.finance.financeapp.entity.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryDTO {
    @NotBlank(message = "Category name is required")
    private String name;

    private String color;

    private String icon;

    @NotNull(message = "Category type is required")
    private TransactionType type;
}

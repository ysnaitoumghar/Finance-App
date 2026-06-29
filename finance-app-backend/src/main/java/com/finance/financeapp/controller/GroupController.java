package com.finance.financeapp.controller;

import com.finance.financeapp.dto.GroupDTO;
import com.finance.financeapp.dto.MessageResponse;
import com.finance.financeapp.entity.ExpenseGroup;
import com.finance.financeapp.entity.GroupMember;
import com.finance.financeapp.service.GroupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/groups")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.cors.allowedOrigins}")
public class GroupController {
    private final GroupService groupService;

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> createGroup(
        @RequestParam Long userId,
        @Valid @RequestBody GroupDTO groupDTO
    ) {
        ExpenseGroup group = groupService.createGroup(userId, groupDTO);
        return ResponseEntity.ok(group);
    }

    @GetMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getGroups(@RequestParam Long userId) {
        List<ExpenseGroup> groups = groupService.getGroupsByUserId(userId);
        return ResponseEntity.ok(groups);
    }

    @PostMapping("/{groupId}/members")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> addMemberToGroup(
        @PathVariable Long groupId,
        @RequestParam Long userId
    ) {
        groupService.addMemberToGroup(groupId, userId);
        return ResponseEntity.ok(new MessageResponse("Member added successfully"));
    }

    @GetMapping("/{groupId}/members")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> getGroupMembers(@PathVariable Long groupId) {
        List<GroupMember> members = groupService.getGroupMembers(groupId);
        return ResponseEntity.ok(members);
    }
}

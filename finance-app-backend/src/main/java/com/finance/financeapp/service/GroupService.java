package com.finance.financeapp.service;

import com.finance.financeapp.dto.GroupDTO;
import com.finance.financeapp.entity.ExpenseGroup;
import com.finance.financeapp.entity.GroupMember;
import com.finance.financeapp.entity.User;
import com.finance.financeapp.repository.ExpenseGroupRepository;
import com.finance.financeapp.repository.GroupMemberRepository;
import com.finance.financeapp.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class GroupService {
    private final ExpenseGroupRepository groupRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserRepository userRepository;
    
    public ExpenseGroup createGroup(Long userId, GroupDTO groupDTO) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        ExpenseGroup group = new ExpenseGroup();
        group.setName(groupDTO.getName());
        group.setDescription(groupDTO.getDescription());
        group.setCreatedBy(user);
        
        ExpenseGroup saved = groupRepository.save(group);
        
        GroupMember creatorMember = new GroupMember();
        creatorMember.setGroup(saved);
        creatorMember.setUser(user);
        groupMemberRepository.save(creatorMember);
        
        return saved;
    }
    
    public List<ExpenseGroup> getGroupsByUserId(Long userId) {
        return groupRepository.findByCreatedBy_Id(userId);
    }
    
    public void addMemberToGroup(Long groupId, Long userId) {
        ExpenseGroup group = groupRepository.findById(groupId)
            .orElseThrow(() -> new RuntimeException("Group not found"));
        
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        GroupMember member = new GroupMember();
        member.setGroup(group);
        member.setUser(user);
        groupMemberRepository.save(member);
    }
    
    public List<GroupMember> getGroupMembers(Long groupId) {
        return groupMemberRepository.findByGroupId(groupId);
    }
}

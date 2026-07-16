package com.tecnostore.service;

import com.tecnostore.model.AuditLog;
import com.tecnostore.repository.AuditLogRepository;
import com.tecnostore.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
public class AuditService {
    private final AuditLogRepository auditLogRepository;
    private final UserRepository userRepository;

    public AuditService(AuditLogRepository auditLogRepository, UserRepository userRepository) {
        this.auditLogRepository = auditLogRepository;
        this.userRepository = userRepository;
    }

    public void log(String action, String entity, Long entityId, String description) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setEntity(entity);
        log.setEntityId(entityId);
        log.setDescription(description);
        String email = SecurityContextHolder.getContext().getAuthentication() == null
                ? null
                : SecurityContextHolder.getContext().getAuthentication().getName();
        if (email != null) {
            userRepository.findByEmailIgnoreCaseAndActiveTrue(email).ifPresent(log::setUser);
        }
        auditLogRepository.save(log);
    }
}

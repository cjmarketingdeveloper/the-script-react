// src/constants/permissions.js

export const ROLE_PERMISSIONS = {
  Developer: ['system:all'], // Handled via a wildcard bypass check
  
  Designer: [
    'content:write',
    'content:arrange'
  ],
  
  Evaluator: [
    'data:analytics',
    'data:competitions'
  ],
  
  Owner: [
    'unit:manage-staff',
    'content:consume',
    'feedback:submit',
    'game:participate'
  ],
  
  Rep: [
    'unit:view-assigned',
    'unit:audit-staff',
    // Reps can view content to demo it, but cannot submit gameplay/feedback
    'content:consume' 
  ],
  
  Staff: [
    'content:consume',
    'feedback:submit',
    'game:participate'
  ]
};
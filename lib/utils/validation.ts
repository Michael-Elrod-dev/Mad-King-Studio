// lib/utils/validation.ts
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateContactForm(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.name.trim()) errors.push("Name is required");
  if (!data.email.trim()) errors.push("Email is required");
  else if (!validateEmail(data.email)) errors.push("Invalid email address");
  if (!data.subject.trim()) errors.push("Subject is required");
  if (!data.message.trim()) errors.push("Message is required");
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

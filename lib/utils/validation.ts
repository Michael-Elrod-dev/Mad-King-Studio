// lib/utils/validation.ts
import { VALIDATION, MESSAGES } from "../constants";

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

  if (!data.name.trim()) {
    errors.push(MESSAGES.ERROR.REQUIRED_FIELD);
  } else if (
    data.name.trim().length < VALIDATION.MIN_NAME_LENGTH ||
    data.name.trim().length > VALIDATION.MAX_NAME_LENGTH
  ) {
    errors.push(
      `Name must be between ${VALIDATION.MIN_NAME_LENGTH} and ${VALIDATION.MAX_NAME_LENGTH} characters`,
    );
  }

  if (!data.email.trim()) {
    errors.push(MESSAGES.ERROR.REQUIRED_FIELD);
  } else if (!validateEmail(data.email)) {
    errors.push(MESSAGES.ERROR.INVALID_EMAIL);
  }

  if (!data.subject.trim()) {
    errors.push(MESSAGES.ERROR.REQUIRED_FIELD);
  }

  if (!data.message.trim()) {
    errors.push(MESSAGES.ERROR.REQUIRED_FIELD);
  } else if (
    data.message.trim().length < VALIDATION.MIN_MESSAGE_LENGTH ||
    data.message.trim().length > VALIDATION.MAX_MESSAGE_LENGTH
  ) {
    errors.push(
      `Message must be between ${VALIDATION.MIN_MESSAGE_LENGTH} and ${VALIDATION.MAX_MESSAGE_LENGTH} characters`,
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

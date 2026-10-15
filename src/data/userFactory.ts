import { faker } from '@faker-js/faker';
import { env } from '../config/env';

export interface TestUser {
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
}

/** Builds a unique, valid user so sign-up never collides with an existing account. */
export function createUser(overrides: Partial<TestUser> = {}): TestUser {
  const firstName = faker.person.firstName().replace(/[^A-Za-z]/g, '') || 'Test';
  const lastName = faker.person.lastName().replace(/[^A-Za-z]/g, '') || 'User';
  const unique = `${Date.now()}${faker.number.int({ min: 100, max: 999 })}`;
  const user: TestUser = {
    firstName,
    lastName,
    fullName: `${firstName} ${lastName}`,
    email: `qa.${firstName.toLowerCase()}.${unique}@${env.testEmailDomain}`,
    // Egyptian mobile format: 01[0125] + 8 digits
    phone: `01${faker.helpers.arrayElement(['0', '1', '2', '5'])}${faker.string.numeric(8)}`,
    // Upper, lower, digit and symbol to satisfy common password policies
    password: `Qa!${faker.string.alpha({ length: 4, casing: 'upper' })}${faker.string.alpha({ length: 4, casing: 'lower' })}${faker.string.numeric(3)}`,
    ...overrides,
  };
  if (overrides.firstName || overrides.lastName) {
    user.fullName = `${user.firstName} ${user.lastName}`;
  }
  return user;
}

export const invalidData = {
  malformedEmails: ['plainaddress', 'missing-at.com', 'user@', '@no-user.com'],
  weakPassword: '123',
  wrongPassword: 'Wrong!Pass123',
  unregisteredEmail: () => `nobody.${Date.now()}@${env.testEmailDomain}`,
};

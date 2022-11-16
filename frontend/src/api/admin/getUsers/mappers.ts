import { backend_roles, UserFromBackend } from '@/api/admin/apiTypes.server';
import { roles, User } from '@/api/admin/apiTypes';

export function mapUnverifiedUsers(userFromBackend: UserFromBackend[]): User[] {
  return userFromBackend.map((user) => ({
    key: user.ID,
    role:
      user.Role === backend_roles.creditor ? roles.creditor : roles.investor,
    name: user.Name,
    photo: user.Photo,
    passport: user.Passport,
    workplace: user.WorkPlace,
    property: user.Property,
  }));
}

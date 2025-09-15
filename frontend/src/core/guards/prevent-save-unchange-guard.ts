import { CanDeactivateFn } from '@angular/router';
import { MemberProfile } from '../../features/members/member-profile/member-profile';

export const preventSaveUnchangeGuard: CanDeactivateFn<MemberProfile> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  if (component.editForm?.dirty) {
    return confirm('Are you sure you want to Cancel');
  }
  return true;
};

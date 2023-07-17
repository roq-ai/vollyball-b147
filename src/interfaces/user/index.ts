import { CoachInterface } from 'interfaces/coach';
import { GuestUserInterface } from 'interfaces/guest-user';
import { PlayerInterface } from 'interfaces/player';
import { SupportStaffInterface } from 'interfaces/support-staff';

import { GetQueryInterface } from '../get-query.interface';

export interface UserInterface {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roq_user_id: string;
  tenant_id: string;

  coach: CoachInterface[];
  guest_user: GuestUserInterface[];
  player: PlayerInterface[];
  support_staff: SupportStaffInterface[];
}

export interface UserGetQueryInterface extends GetQueryInterface {
  roq_user_id?: string;
  tenant_id?: string;
}

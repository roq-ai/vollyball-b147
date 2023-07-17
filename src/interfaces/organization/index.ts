import { CoachInterface } from 'interfaces/coach';
import { GuestUserInterface } from 'interfaces/guest-user';
import { PlayerInterface } from 'interfaces/player';
import { SupportStaffInterface } from 'interfaces/support-staff';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface OrganizationInterface {
  id?: string;
  description?: string;
  image?: string;
  name: string;
  created_at?: any;
  updated_at?: any;
  user_id: string;
  tenant_id: string;
  coach?: CoachInterface[];
  guest_user?: GuestUserInterface[];
  player?: PlayerInterface[];
  support_staff?: SupportStaffInterface[];
  user?: UserInterface;
  _count?: {
    coach?: number;
    guest_user?: number;
    player?: number;
    support_staff?: number;
  };
}

export interface OrganizationGetQueryInterface extends GetQueryInterface {
  id?: string;
  description?: string;
  image?: string;
  name?: string;
  user_id?: string;
  tenant_id?: string;
}

export enum ELifeCycle {
  CREATED = 'CREATED',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum ESecurityLabel {
  PUBLIC = 'PUBLIC',
  INTERNAL = 'INTERNAL',
  RESTRICTED = 'RESTRICTED',
  CONFIDENTIAL = 'CONFIDENTIAL'
}

export interface Response<T> {
  result: T;
  messages: string[];
  messageCodes: number[];
  simpleMessage?: string;
}

export interface DomainEntity {
  id: string;
  version: number;
  securityLabel: ESecurityLabel;
}

export interface LifeCycleBo extends DomainEntity {
  state: ELifeCycle;
  comments?: string;
}

export interface DummyEmployee extends LifeCycleBo {
  employeeNumber: string;
  nationalId: string;
  name: string;
  emailAddress: string;
  nextOfKinId?: string;
}

export interface EntityRevisionInfo {
  id: number;
  actionDate: string;
  userID: string;
  operation: string;
  serviceClass: string;
  serviceMethod: string;
  clientIP: string;
}

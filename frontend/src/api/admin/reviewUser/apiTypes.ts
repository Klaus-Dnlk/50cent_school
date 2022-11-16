export const enum UserTypeToSendApiRequest {
  consumers = 'consumers',
  investors = 'investors',
}

export const enum ActionToPerformOnUser {
  approve = 'approve',
  decline = 'decline',
}

export interface UserReviewRequestApi {
  action: ActionToPerformOnUser;
  userId: number;
  accountType: UserTypeToSendApiRequest;
}

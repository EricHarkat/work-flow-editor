export interface Step {
  id: string;
  type: 'start' | 'sms' | 'email' | 'custom' | 'end';
  name: string;
  transitions: {
    onSuccess?: string[];
    onFailure?: string[];
  };
}
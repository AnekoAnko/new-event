export interface IEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  createdAt?: string;
  creatorId?: string;
}
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserDetails {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  password: string;
}

import { ObjectType, Field, Int } from "type-graphql";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Post } from "./Post";
import { Updoot } from "./Updoot";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToMany(() => Post, (post) => post.creator)
  posts: Post[];

  @OneToMany(() => Updoot, (updoot) => updoot.user)
  updoots: Updoot[];

  @Field()
  @Column({ unique: true })
  username!: string;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Field()
  @Column({ nullable: true })
  password!: string;

  @Field(() => String, { nullable: true })
  @Column({ default: null })
  EXTERNAL_ID!: String;

  @Field(() => String, { nullable: true })
  @Column({ default: null })
  EXTERNAL_TYPE!: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}

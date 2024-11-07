import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

@Schema()
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  endDate: Date;

  @Prop({ default: 'PENDING', required: true })
  state: TaskStatus;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

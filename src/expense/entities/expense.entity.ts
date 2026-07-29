import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ExpenseDocument = Expense & Document;

@Schema({ timestamps: true })
export class Expense {
  @Prop({ required: true })
  title?: string;

  @Prop({ required: true, min: 0 })
  amount?: number;

  @Prop({ required: true, default: 'other' })
  category?: string;

  @Prop({ required: true })
  date?: Date;

  @Prop({ default: '' })
  description?: string;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ItemDocument = Item & Document;

@Schema({ timestamps: true })
export class Item {
  @Prop({ required: true, trim: true })
  itemName!: string;   // ✅ '!' add kiya

  @Prop({ required: true, type: Number, min: 0 })
  price!: number;       // ✅ '!' add kiya

  @Prop({ required: true, trim: true })
  perItem!: string;     // ✅ '!' add kiya

  @Prop({ required: true, trim: true })
  type!: string;        // ✅ '!' add kiya

  @Prop({ trim: true, default: '' })
  description!: string; // ✅ '!' add kiya

  @Prop({ default: true })
  isActive!: boolean;    // ✅ '!' add kiya
}

export const ItemSchema = SchemaFactory.createForClass(Item);
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AvatarDocument = Avatar & Document;

@Schema()
export class Avatar {
    @Prop({ required: true, index: true, unique: true })
    userId: number;

    @Prop({ required: true })
    hash: string;

    @Prop({ required: true })
    base64Data: string;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);

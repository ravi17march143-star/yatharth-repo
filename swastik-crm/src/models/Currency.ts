import mongoose, { Schema, Document } from 'mongoose';
export interface ICurrency extends Document { symbol: string; name: string; decimal_separator: string; thousand_separator: string; placement: string; isdefault: number; currencycode: string; }
const CurrencySchema = new Schema<ICurrency>({ symbol: { type: String, required: true }, name: { type: String, required: true }, decimal_separator: { type: String, default: '.' }, thousand_separator: { type: String, default: ',' }, placement: { type: String, default: 'before' }, isdefault: { type: Number, default: 0 }, currencycode: { type: String, required: true } }, { timestamps: true });
export default mongoose.models.Currency || mongoose.model<ICurrency>('Currency', CurrencySchema);

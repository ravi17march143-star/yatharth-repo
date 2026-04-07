import mongoose, { Schema, Document } from 'mongoose';
export interface ICountry extends Document { countryid: number; short_name: string; name: string; iso3: string; numcode: number; phonecode: number; }
const CountrySchema = new Schema<ICountry>({ countryid: { type: Number, required: true, unique: true }, short_name: { type: String, required: true }, name: { type: String, required: true }, iso3: { type: String }, numcode: { type: Number }, phonecode: { type: Number } }, { timestamps: true });
export default mongoose.models.Country || mongoose.model<ICountry>('Country', CountrySchema);

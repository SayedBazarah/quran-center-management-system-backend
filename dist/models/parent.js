import { Gender, ParentRelationship } from "@/types/enums";
import mongoose, { Schema } from "mongoose";
/**
 * Parent Schema
 */
const ParentSchema = new Schema({
    name: {
        type: String,
        required: [true, "Parent name is required"],
        trim: true,
        minlength: [3, "Name must be at least 3 characters"],
        maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
        type: String,
        sparse: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide a valid email",
        ],
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        unique: true,
        trim: true,
    },
    nationalId: {
        type: String,
        required: [true, "National ID is required"],
        unique: true,
        trim: true,
    },
    nationalIdImg: {
        type: String,
        required: [true, "National ID image is required"],
        trim: true,
    },
    birthDate: {
        type: Date,
    },
    gender: {
        type: String,
        enum: Object.values(Gender),
    },
    relationship: {
        type: String,
        enum: Object.values(ParentRelationship),
        default: ParentRelationship.FATHER,
    },
    studentId: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        unique: true,
        sparse: true,
    },
}, {
    timestamps: true,
    collection: "parents",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// ============================================================================
// VIRTUALS
// ============================================================================
ParentSchema.virtual("student", {
    ref: "Student",
    localField: "studentId",
    foreignField: "_id",
    justOne: true,
});
export default mongoose.model("Parent", ParentSchema);
//# sourceMappingURL=parent.js.map
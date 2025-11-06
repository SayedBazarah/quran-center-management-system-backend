import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
// import { ITimestamps, IContactInfo, IIdentityDocument, IUserCredentials } from '@types/interfaces';
import { Gender } from "@/types/enums";
/**
 * Teacher Schema
 */
const TeacherSchema = new Schema({
    name: {
        type: String,
        required: [true, "Teacher name is required"],
        trim: true,
        minlength: [3, "Name must be at least 3 characters"],
        maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide a valid email",
        ],
    },
    phone: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        match: [
            /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
            "Please provide a valid phone number",
        ],
    },
    nationalId: {
        type: String,
        required: [true, "National ID is required"],
        unique: true,
        trim: true,
        minlength: [10, "National ID must be at least 10 characters"],
    },
    nationalIdImg: {
        type: String,
        trim: true,
    },
    avatar: {
        type: String,
        trim: true,
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
        lowercase: true,
        minlength: [3, "Username must be at least 3 characters"],
    },
    gender: {
        type: String,
        enum: Object.values(Gender),
    },
    password: {
        type: String,
        minlength: [8, "Password must be at least 8 characters"],
        select: false,
    },
    branchId: {
        type: Schema.Types.ObjectId,
        ref: "Branch",
        required: [true, "Branch ID is required"],
        index: true,
    },
}, {
    timestamps: true,
    collection: "teachers",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// ============================================================================
// VIRTUALS
// ============================================================================
TeacherSchema.virtual("enrollments", {
    ref: "Enrollment",
    localField: "_id",
    foreignField: "teacherId",
    justOne: false,
});
// ============================================================================
// MIDDLEWARE
// ============================================================================
TeacherSchema.pre("save", async function (next) {
    if (!this.isModified("password") || !this.password) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    }
    catch (error) {
        next(error);
    }
});
// ============================================================================
// METHODS
// ============================================================================
TeacherSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password)
        return false;
    return await bcrypt.compare(candidatePassword, this.password);
};
export default mongoose.model("Teacher", TeacherSchema);
//# sourceMappingURL=teacher.js.map
// src/models/Payment.ts
import mongoose, { Schema } from "mongoose";
const PaymentSchema = new Schema({
    amount: {
        type: Number,
        required: [true, "Amount is required"],
        min: [0, "Amount cannot be negative"],
    },
    handledBy: {
        type: String,
        trim: true,
        maxlength: [100, "HandledBy cannot exceed 100 characters"],
    },
    // relations
    enrollmentId: {
        type: Schema.Types.ObjectId,
        ref: "Enrollment",
        required: [true, "Enrollment is required"],
        index: true,
    },
    studentId: {
        type: Schema.Types.ObjectId,
        ref: "Student",
        required: [true, "Student is required"],
        index: true,
    },
    adminId: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
        index: true,
    },
}, {
    timestamps: true,
    collection: "payments",
});
// Common aggregates: by student, by enrollment, by date
PaymentSchema.index({ studentId: 1, createdAt: -1 });
PaymentSchema.index({ enrollmentId: 1, createdAt: -1 });
export default mongoose.model("Payment", PaymentSchema);
//# sourceMappingURL=payment.js.map
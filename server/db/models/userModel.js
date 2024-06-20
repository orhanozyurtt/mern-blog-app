import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },
    verificationCode: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  { timestamps: true }
);

// Şifre kaydedilmeden önce hash'lenir
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Şifre karşılaştırma metodu
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// findOneAndUpdate hook'u ekleyerek güncelleme işlemlerinde de şifreleme yapılmasını sağlar
userSchema.pre('findOneAndUpdate', async function (next) {
  // `this._update` kullanarak güncellenecek veriyi alıyoruz
  const update = this._update;

  // Eğer parola güncelleniyorsa, tekrar şifreleme işlemi yap
  if (update.password) {
    const salt = await bcrypt.genSalt(10);
    update.password = await bcrypt.hash(update.password, salt);
  }

  next();
});

const User = mongoose.model('User', userSchema);

export default User;

import User from '../db/models/userModel.js';
import { HTTP_CODES } from '../config/Enum.js';
import CustomError from '../lib/Error.js';
import Response from '../lib/Response.js';
import nodemailer from 'nodemailer';
// import { controller } from '../lib/InputController.js';
import { generateToken, refreshToken } from '../lib/generateToken.js';

class UserController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Kullanıcıyı veritabanında bulma
      const userExists = await User.findOne({ email });
      if (userExists) {
        throw new CustomError(
          HTTP_CODES.BAD_REQUEST,
          'User already exists',
          'The email address you entered is already associated with an account'
        );
      }

      // const verificationCode = crypto.randomBytes(6).toString('hex');
      const verificationCode = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      // doğrulama kodu gönderme
      // E-posta doğrulama kodunu gönderme
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.SYSTEM_MAIL,
          pass: process.env.SYSTEM_PASS,
        },
      });

      const mailOptions = {
        from: 'E-posta doğrulama',
        to: email,
        subject: 'Email Verification',
        // text: `Please verify your email using the following code: ${verificationCode}`,
        html: generateEmailContent(verificationCode),
      };
      await transporter.sendMail(mailOptions);
      // Başarılı yanıt gönderme
      // Yeni kullanıcı oluşturma
      const user = new User({ name, email, password, verificationCode });
      // Kullanıcıyı kaydetme
      await user.save();
      // tokenleri oluşturma cookie atma
      generateToken(res, user._id, user.isAdmin);
      refreshToken(res, user._id, user.isAdmin);

      // Kullanıcıyı JSON yanıtında dönerken, parolayı yanıtın dışında tutalım
      const userResponse = {
        name: user.name,
        email: user.email,
        id: user._id,
        verificationCode: 'please check your email for verification code ',
      };
      res
        .status(HTTP_CODES.CREATED)
        .json(
          Response.successResponse(
            userResponse,
            'success registration',
            HTTP_CODES.CREATED
          )
        );
    } catch (error) {
      const errorResponse = Response.errorResponse(error);
      res.status(errorResponse.code).json(errorResponse);
    }
  }

  async confirmEmail(req, res) {
    try {
      // Validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(HTTP_CODES.BAD_REQUEST)
          .json({ ErrorList: errors.array() });
      }
      const { email, code } = req.body;

      if (!email || !code) {
        throw new CustomError(
          HTTP_CODES.BAD_REQUEST,
          'Validation error',
          'Email and verification code are required'
        );
      }

      const user = await User.findOne({ email });

      if (!user) {
        throw new CustomError(
          HTTP_CODES.BAD_REQUEST,
          'Invalid verification',
          'No user found with this email address'
        );
      }

      if (user.isVerified) {
        throw new CustomError(
          HTTP_CODES.BAD_REQUEST,
          'Already verified',
          'This email address has already been verified'
        );
      }

      if (user.verificationCode !== code) {
        throw new CustomError(
          HTTP_CODES.BAD_REQUEST,
          'Invalid verification code',
          'The verification code is incorrect'
        );
      }

      user.isVerified = true;
      user.verificationCode = undefined; // verification code is no longer needed
      await user.save();

      res
        .status(HTTP_CODES.OK)
        .json(
          Response.successResponse(
            null,
            'Email successfully verified',
            HTTP_CODES.OK
          )
        );
    } catch (error) {
      const errorResponse = Response.errorResponse(error);
      res.status(errorResponse.code).json(errorResponse);
    }
  }

  async login(req, res) {
    try {
      // Validation errors

      const { email, password } = req.body;

      // Kullanıcıyı veritabanında bulma
      const user = await User.findOne({ email });

      if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id, user.isAdmin);
        refreshToken(res, user._id, user.isAdmin);
        const userResponse = {
          // _id: user._id,
          name: user.name,
          email: user.email,
          // isAdmin: user.isAdmin,
        };
        res
          .status(HTTP_CODES.OK)
          .json(
            Response.successResponse(
              userResponse,
              'success login',
              HTTP_CODES.CREATED
            )
          );
      } else {
        throw new CustomError(
          HTTP_CODES.BAD_REQUEST,
          'please check your mail or password',
          'mail or password is wrong'
        );
      }
    } catch (error) {
      const errorResponse = Response.errorResponse(error);
      return res.status(errorResponse.code).json(errorResponse);
    }
  }

  async logout(req, res) {
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    res.cookie('refreshToken', '', {
      httpOnly: true,
      expires: new Date(0),
    });
    res.status(200).json({ message: 'user logged out  ' });
  }
  async test(req, res) {
    res.json('welcome user panel');
  }
}
function generateEmailContent(verificationCode) {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
  <h1 style="text-align: center; color: #333;">Email Verification</h1>
  <div style="background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);  text-align: center;">
    <p style="font-size: 16px; ">Please verify your email using the following code:</p>
    <div style="background-color: #f0f0f0; padding: 10px; border-radius: 8px;">
      <strong style="font-size: 20px;">${verificationCode}</strong>
    </div>
  </div>
</div>

  `;
}

export default new UserController();
//! eğer token yenileme işlemi ön uçta sorun çıkartırsa refresh token endpointi oluştur

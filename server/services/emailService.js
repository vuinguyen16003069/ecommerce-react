const nodemailer = require('nodemailer');

// Tạo transporter cho Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || '',
    pass: process.env.GMAIL_PASS || ''
  }
});

// Hàm gửi email reset mật khẩu (OTP)
const sendResetOtpEmail = async (to, otp) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to,
      subject: '🔐 Đặt lại mật khẩu JShop',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🛍️ JShop</h1>
            <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Yêu cầu đặt lại mật khẩu</p>
          </div>

          <div style="padding: 30px; background-color: #f9fafb; border-radius: 0 0 10px 10px;">
            <p style="color: #333; font-size: 16px; margin-top: 0;">Xin chào,</p>
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản JShop.
              Dưới đây là mã xác nhận (OTP) của bạn, có hiệu lực trong vòng 10 phút:
            </p>

            <div style="background-color: #fff; border: 2px solid #f97316; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0 0 10px 0; text-transform: uppercase;">MÃ XÁC NHẬN (OTP)</p>
              <code style="background-color: #f3f4f6; padding: 10px 15px; border-radius: 4px; font-size: 24px; font-weight: bold; color: #1f2937; letter-spacing: 5px;">
                ${otp}
              </code>
            </div>

            <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 20px;">
              <strong>Cách sử dụng:</strong>
            </p>
            <ul style="color: #666; font-size: 14px; line-height: 1.8; margin: 10px 0;">
              <li>Nhập mã OTP này trên trang quên mật khẩu.</li>
              <li>Điền mật khẩu mới của bạn và xác nhận.</li>
            </ul>

            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin: 20px 0;">
              <p style="color: #92400e; font-size: 13px; margin: 0;">
                <strong>⚠️ Lưu ý bảo mật:</strong> Không chia sẻ mật khẩu này với bất kỳ ai.
                Đội hỗ trợ của JShop sẽ không bao giờ yêu cầu mật khẩu của bạn.
              </p>
            </div>

            <p style="color: #999; font-size: 12px; margin-top: 20px;">
              Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.
              Nếu có vấn đề, hãy liên hệ với chúng tôi qua <strong>hotline@jshop.com</strong>
            </p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">

            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              © 2024 JShop. Tất cả các quyền được bảo lưu.
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email gửi thành công:', info.messageId);
    return true;
  } catch (error) {
    console.error('Lỗi gửi email:', error);
    return false;
  }
};

const sendRegisterOtpEmail = async (to, otp) => {
  try {
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to,
      subject: '🎉 Xác nhận đăng ký tài khoản JShop',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f97316 0%, #ea580c 100%); padding: 30px; text-align: center; color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🛍️ JShop</h1>
            <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Chào mừng bạn đến với chúng tôi</p>
          </div>

          <div style="padding: 30px; background-color: #f9fafb; border-radius: 0 0 10px 10px;">
            <p style="color: #333; font-size: 16px; margin-top: 0;">Xin chào,</p>
            <p style="color: #666; font-size: 14px; line-height: 1.6;">
              Cảm ơn bạn đã đăng ký tài khoản tại JShop. Để hoàn tất việc đăng ký, vui lòng sử dụng mã xác nhận (OTP) dưới đây. Mã này có hiệu lực trong vòng 10 phút:
            </p>

            <div style="background-color: #fff; border: 2px solid #f97316; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0 0 10px 0; text-transform: uppercase;">MÃ XÁC NHẬN (OTP)</p>
              <code style="background-color: #f3f4f6; padding: 10px 15px; border-radius: 4px; font-size: 24px; font-weight: bold; color: #1f2937; letter-spacing: 5px;">
                ${otp}
              </code>
            </div>

            <p style="color: #666; font-size: 14px; line-height: 1.6; margin-top: 20px;">
              Nếu bạn không thực hiện đăng ký này, vui lòng bỏ qua email này.
            </p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">

            <p style="color: #999; font-size: 12px; text-align: center; margin: 0;">
              © 2024 JShop. Tất cả các quyền được bảo lưu.
            </p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email gửi đăng ký thành công:', info.messageId);
    return true;
  } catch (error) {
    console.error('Lỗi gửi email đăng ký:', error);
    return false;
  }
};

module.exports = { sendResetOtpEmail, sendRegisterOtpEmail };

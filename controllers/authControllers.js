const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendVerificationEmail = require('../utils/mailer');




const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    fullname: req.body.fullname,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    role: req.body.role
  });
  const verificationToken = crypto.randomBytes(32).toString('hex');
  newUser.verificationToken = verificationToken;
  await newUser.save({ validateBeforeSave: false });
  const verificationLink = `http://${req.get('host')}/api/v1/users/verify-email?token=${verificationToken}`;
  // console.log(verificationLink);
  await sendVerificationEmail(newUser.email, verificationLink);
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError({ english: 'Please provide email and password', arabic: 'يرجى تقديم بريدك الالكتروني وكلمة المرور' }, 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError({ english: 'Incorrect email or password', arabic: 'بريدك الالكتروني او كلمة المرور غير صحيحة' }, 401));
  }

  if (!user.isVerified) {
    return next(new AppError({ english: 'Please verify your gmail', arabic: 'يرجى التحقق من بريدك الالكتروني' }, 401));
  }

  // 3) If everything ok, send token to client
  createSendToken(user, 200, res);
});
//////////////////////////////////////////////////////////////////////////////




exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({massage :{ english: 'Logged out', arabic: 'تم تسجيل الخروج بنجاح' } });
};

exports.protect = catchAsync(async (req, res, next) => {
 console.log(req.headers);
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    console.log(req.headers.authorization)
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    console.log("2")

    token = req.cookies.jwt;
  }

  console.log(token);

  if (!token) {
    return next(
      new AppError(
        { english: 'You are not logged in! Please log in to get access', arabic: ' يرجى تسجيل الدخول للوصول' },
        401
      )
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        { english: 'The user belonging to this token does no longer exist.', arabic: 'لا يوجد مستخدم يتعلق بهذا الرمز' },
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  // if (currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(
  //     new AppError('User recently changed password! Please log in again.', 401)
  //   );
  // }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
});

// // Only for rendered pages, no errors!
// exports.isLoggedIn = async (req, res, next) => {
//   if (req.cookies.jwt) {
//     try {
//       // 1) verify token
//       const decoded = await promisify(jwt.verify)(
//         req.cookies.jwt,
//         process.env.JWT_SECRET
//       );

//       // 2) Check if user still exists
//       const currentUser = await User.findById(decoded.id);
//       if (!currentUser) {
//         return next();
//       }

//       // 3) Check if user changed password after the token was issued
//       if (currentUser.changedPasswordAfter(decoded.iat)) {
//         return next();
//       }

//       // THERE IS A LOGGED IN USER
//       res.locals.user = currentUser;
//       return next();
//     } catch (err) {
//       return next();
//     }
//   }
//   next();
// };
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError({ english: 'You do not have permission to perform this action', arabic: 'ليس لديك صلاحيات لتنفيذ هذا الإجراء' }, 403)
      );
    }

    next();
  };
};



exports.verifyEmail = catchAsync(async (req, res, next) => {
  const token = req.query.token;
  // Find the user by verification token
  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return res.status(400).send('Invalid or expired verification token.');
  }

  // Mark the email as verified
  user.verificationToken = undefined;
  user.isVerified = true;
  await user.save({ validateBeforeSave: false });

  res.send('Email verified successfully.');
});









exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError({ english: 'There is no user with email address.', arabic: 'لا يوجد مستخدم باستخدام البريد الألكتروني' }, 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/reset-password/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
  
  try {
    await sendVerificationEmail(
    user.email,
      resetURL
    );

    res.status(200).json({
      status: 'success',
      message: {
        english: 'Token sent to email',
        arabic: 'تم ارسال رمز التحقق على البريد الألكتروني'
      }
    });
  } catch (err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError({
        english: 'There was an error sending the email. Try again later!',
        arabic: 'حدث خطأ في الإرسال. حاول مرة اخرى في وقت لاحق'}),
      500
    );
  }
});




exports.resetPassword = catchAsync(async (req, res, next) => {

  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.resetToken)
    .digest('hex');
  console.log(1);
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });
  console.log(2);

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError({ english: 'Token is invalid or has expired', arabic: 'الرمز غير صالح او منتهي الصلاحية' }, 400));
  }
  console.log(3);
  
  user.password = req.body.password;
  console.log(4);
  user.passwordConfirm = req.body.passwordConfirm;
  console.log(5);
  user.passwordResetToken = undefined;
  console.log(6);
  user.passwordResetExpires = undefined;
  console.log(7);
  await user.save();

  console.log(8);

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
  console.log(9);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError({ english: 'Your current password is wrong.', arabic: 'كلمة المرور الحالية غير صحيحة' }, 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});
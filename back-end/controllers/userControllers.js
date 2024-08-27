const User = require(`${__dirname}/../models/User`);
const catchAsync = require(`${__dirname}/../utils/catchAsync`);
const AppError = require(`${__dirname}/../utils/appError`);


exports.createUser = catchAsync(async (req, res, next) => {
    const user = await User.create(req.body);
    res.status(201).json({
        status: "success",
        massage: {
            english: "User created successfully",
            arabic: "تم انشاء المستخدم بنجاح"
        },
        data: {
            user
        }
    });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
    
    const users = await User.find().populate("journeys").populate("journeys");
    res.status(200).json({
        status: "success",
        massage: {
            english: "Users retrieved successfully",
            arabic: "تم تحميل المستخدمين بنجاح"
        },
        results: users.length,
        data: {
            users
        }
    });
});

exports.getUser = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.params.id).populate("journeys");
    res.status(200).json({
        status: "success",
        massage: {
            english: "User retrieve successfully",
            arabic: "تم تحميل المستخدم بنجاح"
        },
        data: {
            user
        }
    });
})


exports.updateUser = catchAsync(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        status: "success",
        massage: {
            english: "User updated successfully",
            arabic: "تم تحديث المستخدم بنجاح"
        },
        data: {
            user
        }
    });
})


exports.deleteUser = catchAsync(async (req, res, next) => {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).json({
        status: "success",
        massage: {
            english: "User deleted successfully",
            arabic: "تم حذف المستخدم بنجاح"
        },
        data: null
    });
})



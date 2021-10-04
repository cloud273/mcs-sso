'use strict';

export const Constant = {
    server: {
        port: 4005,
        token: "73NuuN8wPVhScY5+6K7Y4IkRpMSwveojrhingtYirAUw+cRcKNGqRrMGBtYJ21kmS9T3uxsirsMh2rQacrALSQ"
    },
    routePrefix: "/api",
    message: {
        host: "http://localhost:4004",
        token: "0TnZF2TArcBp8r48MwNx1Fl0OMRS03KYbn6aUEMtn5hC9dXJiqa2wO9AvIdCJodHOBjiTF1KNXLpv897OnYQHF",
        sender: "cskh@datchonhanh.com"
    },
    notify: {
        activation: {
            subject: {
                "en": "Activation code",
                "vi": "Mã kích hoạt"
            },
            message: {
                "en": "Your activation code is ",
                "vi": "Mã kích hoạt của bạn là "
            },
            sms: {
                "en": "Your activation code is ",
                "vi": "Ma kich hoat cua ban la "
            }
        },
        resetPassword: {
            subject: {
                "en": "Reset code",
                "vi": "Mã bí mật"
            },
            message: {
                "en": "Your password reset code is ",
                "vi": "Mã tạo mới mật khẩu của bạn là "
            },
            sms: {
                "en": "Your password reset code is ",
                "vi": "Ma tao moi mat khau cua ban la "
            }
        }
    },
    passwordMinLength: 6,
    activeCodeLive: 900,
    tokenLive: 3600*24*30,
    type: {
        create: "create",
        activate: "activate",
        forgot: "forgot"
    }
}

